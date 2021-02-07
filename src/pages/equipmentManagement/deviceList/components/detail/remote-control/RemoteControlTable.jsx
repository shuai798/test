import React, { Component } from 'react';
import { Button, Form, Modal, message } from 'antd';
import filters from '@/filters/index';
import enums from '@/i18n/zh-CN/zhCN';
import { connect } from 'dva';
import FilterSelectAllTable from '@/components/filter-selectall-table';
import { HxIcon } from '@/components/hx-components';
import ResetCounter from './ResetCounter';

@connect(({ deviceList, loading }) => {
    return {
        deviceList,
        loadingSearch: loading.effects['deviceList/getDeviceControlRecordList'],
    };
})
@Form.create()
class RemoteUpgradeTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageInfo: {
                page: 0,
                size: 10,
            },
            searchParam: {
                deviceId: this.props.deviceList.deviceDetail.id,
            },
            filtersParam: {},
            isShowResetCounterModal: false,
        };
    }

    componentDidMount = () => {
        this.getTableViewList(0);
    };

    getTableViewList = (page, size) => {
        const { dispatch } = this.props;
        const { pageInfo, searchParam, filtersParam } = this.state;
        let flag = 0;
        if (page || page === 0) {
            pageInfo.page = page;
            flag = 1;
        }
        if (size) {
            pageInfo.size = size;
            flag = 1;
        }
        dispatch({
            type: 'deviceList/getDeviceControlRecordList',
            payload: {
                ...pageInfo,
                ...searchParam,
                ...filtersParam,
            },
        });
        if (flag) {
            this.setState({
                pageInfo,
            });
        }
    };

    tableChange = (pagination, tableFilters) => {
        let { filtersParam } = this.state;
        filtersParam = {
            ...filtersParam,
            ...tableFilters,
        };
        this.setState({ filtersParam }, () => {
            this.getTableViewList(pagination.current - 1, pagination.pageSize);
        });
    };

    getTypeFilters = () => {
        const typeArray = [];
        enums.publishResult.map((item) => {
            const typeItem = {};
            typeItem.label = item.name;
            typeItem.value = item.code;
            typeArray.push(typeItem);
        });
        return typeArray;
    };

    restartConfirm = () => {
        Modal.confirm({
            content: '确定要重启该设备吗？',
            title: '提示',
            okText: '确定',
            cancelText: '取消',
            icon: <HxIcon type="icon-warning" className="fz24"></HxIcon>,
            onOk: () => {
                return this.addControlRecord('REBOOT');
            },
        });
    };

    openConfirm = () => {
        Modal.confirm({
            content: '确定要开闸吗？',
            title: '提示',
            okText: '确定',
            cancelText: '取消',
            icon: <HxIcon type="icon-warning" className="fz24"></HxIcon>,
            onOk: () => {
                return this.addControlRecord('OPEN');
            },
        });
    };

    closeConfirm = () => {
        Modal.confirm({
            content: '确定要关闸吗？',
            title: '提示',
            okText: '确定',
            cancelText: '取消',
            icon: <HxIcon type="icon-warning" className="fz24"></HxIcon>,
            onOk: () => {
                return this.addControlRecord('CLOSE');
            },
        });
    };

    addControlRecord = (type) => {
        const controlRecord = {
            deviceId: this.props.deviceList.deviceDetail.id,
            type,
        };
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/addControlRecord',
            payload: controlRecord,
            callback: () => {
                if (type === 'REBOOT') {
                    message.success('重启成功');
                }
                if (type === 'OPEN') {
                    message.success('开闸成功');
                }
                if (type === 'CLOSE') {
                    message.success('关闸成功');
                }
                this.getTableViewList();
            },
        });
    };

    handleTableSearch = (confirm, columns) => {
        confirm();
        const filtersParam = {};
        const { startValue, endValue } = columns[3].filteredValue;
        if (startValue) {
            filtersParam.operationStartTime = startValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (endValue) {
            filtersParam.operationEndTime = endValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (columns[2].filteredValue.length > 0) {
            filtersParam.status = columns[2].filteredValue;
        }
        this.setState({ filtersParam }, () => {
            this.getTableViewList(0);
        });
    };

    updateResetCounterModalStatus = () => {
        this.setState(prevState => {
            return {
                isShowResetCounterModal: !prevState.isShowResetCounterModal,
            };
        });
    }

    render() {
        const {
            deviceList: { deviceControlRecordList },
        } = this.props;
        const { data = [], pageable = {} } = deviceControlRecordList;
        const { isShowResetCounterModal } = this.state;
        const pagination = {
            showTotal: () => {
                return (
                    <span className="pagination">
                        共<a>{pageable.totalPages}</a>页/<a>{pageable.totalElements}</a>条
                    </span>
                );
            },
            total: pageable.totalElements,
            pageSize: pageable.size,
            current: parseInt(pageable.number + 1, 10) || 1,
            showSizeChanger: true,
        };
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                width: 68,
                align: 'center',
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                },
            },
            {
                title: '操作类型',
                dataIndex: 'type',
                ellipsis: true,
                render: (text, record) => {
                    const showStr = filters.deviceControlTypeFilter(text);
                    if (text === 'RESET_COUNTER') {
                        const resetCounterTypeList = record.resetCounterTypeStr.split('、');
                        if (resetCounterTypeList && resetCounterTypeList.length > 0) {
                            const resetCounterTypeNameList = [];
                            resetCounterTypeList.map(resetCounterType => {
                                enums.resetCounter.map(item => {
                                    if (resetCounterType === item.code) {
                                        resetCounterTypeNameList.push(item.name);
                                    }
                                });
                            });
                            return `${showStr}：${resetCounterTypeNameList.join('、')}`;
                        }
                    } else {
                        return showStr;
                    }
                },
            },
            {
                title: '下发结果',
                dataIndex: 'status',
                filters: this.getTypeFilters(),
                filterType: 'multipleChoice',
                ellipsis: true,
                render: (text) => {
                    return filters.publishResultFilter(text);
                },
            },
            {
                title: '下发时间',
                dataIndex: 'operationTime',
                filterType: 'timeRanger',
                ellipsis: true,
                width: 189,
            },
        ];
        return (
            <div>
                <div className="mb20 clearfix">
                    <span className="table-title">远程控制记录</span>
                    <div className="fr">
                        <Button onClick={this.updateResetCounterModalStatus} className="mr8" type="primary">
                            复位计数器
                        </Button>
                        <Button onClick={this.restartConfirm} className="mr8" type="primary">
                            远程重启
                        </Button>
                        <Button onClick={this.openConfirm} className="mr8" type="primary">
                            远程开闸
                        </Button>
                        <Button onClick={this.closeConfirm} type="primary">
                            远程关闸
                        </Button>
                    </div>
                </div>
                <FilterSelectAllTable
                    rowKey={(record) => {
                        return record.id;
                    }}
                    columns={columns}
                    dataSource={data}
                    loading={this.props.loadingSearch}
                    onChange={this.tableChange}
                    pagination={pagination}
                    scroll={{ x: 1100 }}
                    handleTableSearch={this.handleTableSearch}></FilterSelectAllTable>
                {isShowResetCounterModal ? <ResetCounter updateResetCounterModalStatus={this.updateResetCounterModalStatus} getTableViewList={this.getTableViewList}></ResetCounter> : null}
            </div>
        );
    }
}

export default RemoteUpgradeTable;
