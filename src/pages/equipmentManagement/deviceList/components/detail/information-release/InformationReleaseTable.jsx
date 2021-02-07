import React, { Component } from 'react';
import { Button, Form, Icon, Modal } from 'antd';
import { connect } from 'dva';
import filters from '@/filters/index';
import enums from '@/i18n/zh-CN/zhCN';
import AddRelease from './AddRelease';
import ClearRelease from './ClearRelease';
import FilterSelectAllTable from '@/components/filter-selectall-table';

@connect(({ deviceList, loading }) => {
    return {
        deviceList,
        loadingSearch: loading.effects['deviceList/getInformationReleaseList'],
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
            isShowAddReleaseModal: false,
            isShowClearReleaseModal: false,
        };
    }

    componentDidMount = () => {
        this.getTableViewList(0);
    };

    getTableViewList = (page, size) => {
        let flag = 0;
        const { pageInfo, searchParam, filtersParam } = this.state;
        if (page || page === 0) {
            pageInfo.page = page;
            flag = 1;
        }
        if (size) {
            pageInfo.size = size;
            flag = 1;
        }
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/getInformationReleaseList',
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

    // 点击下一页 或者切换某页，选择每页条数
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

    updateAddReleaseModalStatus = () => {
        this.setState((prevState) => {
            return { isShowAddReleaseModal: !prevState.isShowAddReleaseModal };
        });
    };

    updateClearReleaseModalStatus = () => {
        this.setState((prevState) => {
            return { isShowClearReleaseModal: !prevState.isShowClearReleaseModal };
        });
    };

    showDeleteConfirm = (id) => {
        Modal.confirm({
            content: (
                <span>
                    确定要 <span style={{ color: '#ff3b3b' }}>删除</span> 该发布数据吗？
                </span>
            ),
            title: '提示',
            okText: '确定',
            cancelText: '取消',
            icon: <Icon style={{ color: 'rgba(245, 78, 68, 1)' }} type="exclamation-circle"></Icon>,
            onOk: () => {
                return this.deleteInformationRelease(id);
            },
            className: 'confirmStyle',
        });
    };

    deleteInformationRelease = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/deleteInformationRelease',
            payload: {
                id,
            },
            callback: () => {
                this.getTableViewList();
            },
        });
    };

    showPublishConfirm = (id) => {
        Modal.confirm({
            content: '确定要再次发布该数据吗？',
            title: '提示',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                return this.publishInformationRelease(id);
            },
        });
    };

    publishInformationRelease = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/publishInformationRelease',
            payload: {
                id,
            },
            callback: () => {
                this.getTableViewList();
            },
        });
    };

    getTypeFilters = (type) => {
        const typeArray = [];
        enums[type].map((item) => {
            const typeItem = {};
            typeItem.label = item.name;
            typeItem.value = item.code;
            typeArray.push(typeItem);
        });
        return typeArray;
    };

    handleTableSearch = (confirm, columns) => {
        confirm();
        const filtersParam = {};
        const { startValue, endValue } = columns[7].filteredValue;
        if (startValue) {
            filtersParam.publishStartTime = startValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (endValue) {
            filtersParam.publishEndTime = endValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (columns[3].filteredValue.length > 0) {
            filtersParam.location = columns[3].filteredValue;
        }
        if (columns[5].filteredValue.length > 0) {
            filtersParam.operationType = columns[5].filteredValue;
        }
        if (columns[6].filteredValue.length > 0) {
            filtersParam.status = columns[6].filteredValue;
        }
        this.setState({ filtersParam }, () => {
            this.getTableViewList(0);
        });
    };

    render() {
        const { isShowAddReleaseModal, isShowClearReleaseModal } = this.state;
        const {
            deviceList: { informationReleaseList },
        } = this.props;
        const { data = [], pageable = {} } = informationReleaseList;
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
                title: '发布标题',
                dataIndex: 'title',
                ellipsis: true,
                render: (text) => {
                    return text || '--';
                },
            },
            {
                title: '通道类型',
                dataIndex: 'pathTypelist',
                ellipsis: true,
                render: (text) => {
                    const arr = [];
                    text.map((item) => {
                        enums.pathTypeList.map((pathType) => {
                            if (item === pathType.code) {
                                arr.push(pathType.name);
                            }
                        });
                    });
                    return arr.join('、');
                },
            },
            {
                title: '显示位置',
                dataIndex: 'location',
                filters: this.getTypeFilters('deviceInformationLocation'),
                filterType: 'multipleChoice',
                ellipsis: true,
                render: (text) => {
                    return filters.deviceInformationLocationFilter(text);
                },
            },
            {
                title: '媒体文件',
                dataIndex: 'fileName',
                ellipsis: true,
                render: (text) => {
                    return text || '--';
                },
            },
            {
                title: '操作类型',
                dataIndex: 'operationType',
                filters: this.getTypeFilters('operationTypeList'),
                filterType: 'multipleChoice',
                ellipsis: true,
                render: (text) => {
                    return filters.operationTypeListFilter(text);
                },
            },
            {
                title: '下发结果',
                dataIndex: 'status',
                filters: this.getTypeFilters('publishResult'),
                filterType: 'multipleChoice',
                ellipsis: true,
                render: (text) => {
                    return filters.publishResultFilter(text);
                },
                width: 200,
                align: 'center',
            },
            {
                title: '下发时间',
                dataIndex: 'publishTime',
                filterType: 'timeRanger',
                width: 189,
                align: 'center',
                ellipsis: true,
            },
            {
                title: '操作',
                dataIndex: 'id',
                render: (text, record) => {
                    const { id, status, operationType } = record;
                    return (
                        <div>
                            {status === 'FAILURE' && operationType === 'CREATE' ? (
                                <a
                                    onClick={() => {
                                        return this.showPublishConfirm(id);
                                    }}>
                                    发布
                                </a>
                            ) : (
                                '--'
                            )}
                        </div>
                    );
                },
                width: 68,
            },
        ];
        return (
            <div>
                <div className="mb20 clearfix">
                    <span className="table-title">信息发布记录</span>
                    <div className="fr">
                        <Button onClick={this.updateAddReleaseModalStatus} className="mr8" type="primary">
                            新增发布
                        </Button>
                        <Button onClick={this.updateClearReleaseModalStatus} className="mr8" type="danger">
                            清除发布
                        </Button>
                    </div>
                </div>
                <FilterSelectAllTable
                    columns={columns}
                    dataSource={data}
                    rowKey={(record) => {
                        return record.id;
                    }}
                    loading={this.props.loadingSearch}
                    onChange={this.tableChange}
                    pagination={pagination}
                    scroll={{ x: 1100 }}
                    handleTableSearch={this.handleTableSearch}></FilterSelectAllTable>
                {isShowAddReleaseModal && <AddRelease updateAddReleaseModalStatus={this.updateAddReleaseModalStatus} getTableViewList={this.getTableViewList}></AddRelease>}
                {isShowClearReleaseModal && <ClearRelease updateClearReleaseModalStatus={this.updateClearReleaseModalStatus} getTableViewList={this.getTableViewList}></ClearRelease>}
            </div>
        );
    }
}

export default RemoteUpgradeTable;
