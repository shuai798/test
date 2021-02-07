import React, { Component } from 'react';
import { Table, Button, Form, Icon, Divider, Modal } from 'antd';
import { HxIcon, HxRangePicker } from '@/components/hx-components';
import { connect } from 'dva';
import moment from 'moment';
import filters from '@/filters/index';
import _ from 'lodash';
import AddRepairRecord from './AddRepairRecord';
import RepairRecordDetail from './RepairRecordDetail';
import EditRepairRecord from './EditRepairRecord';
import styles from '../../../index.less';
import FilterSelectAllTable from '@/components/filter-selectall-table';

@connect(({ deviceList, loading }) => {
    return {
        deviceList,
        loadingSearch: loading.effects['deviceList/getRepairRecordList'],
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
            maintenanceTime: [],
            isShowAddRepairRecordModal: false,
            isShowRepairRecordDetailModal: false,
            isShowEditRepairRecordModal: false,
        };
    }

    componentDidMount = () => {
        this.getTableViewList(0);
        this.getEmployeeList();
    };

    getEmployeeList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/getEmployeeList',
        });
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
            type: 'deviceList/getRepairRecordList',
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
    tableChange = (pagination) => {
        this.getTableViewList(pagination.current - 1, pagination.pageSize);
    };

    updateAddRepairRecordModalStatus = () => {
        this.setState((prevState) => {
            return { isShowAddRepairRecordModal: !prevState.isShowAddRepairRecordModal };
        });
    };

    updateRepairRecordDetailModalStatus = (record) => {
        if (record) {
            const { id } = record;
            const { dispatch } = this.props;
            dispatch({
                type: 'deviceList/getRepairRecordDetail',
                payload: {
                    id,
                },
                callback: () => {
                    this.setState((prevState) => {
                        return { isShowRepairRecordDetailModal: !prevState.isShowRepairRecordDetailModal };
                    });
                },
            });
        } else {
            this.setState((prevState) => {
                return { isShowRepairRecordDetailModal: !prevState.isShowRepairRecordDetailModal };
            });
        }
    };

    updateEditRepairRecordModalStatus = (record) => {
        if (record) {
            const { id } = record;
            const { dispatch } = this.props;
            dispatch({
                type: 'deviceList/getRepairRecordDetail',
                payload: {
                    id,
                },
                callback: () => {
                    this.setState((prevState) => {
                        return { isShowEditRepairRecordModal: !prevState.isShowEditRepairRecordModal };
                    });
                },
            });
        } else {
            this.setState((prevState) => {
                return { isShowEditRepairRecordModal: !prevState.isShowEditRepairRecordModal };
            });
        }
    };

    getRepairRecordDetail = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/getRepairRecordDetail',
            payload: {
                id,
            },
        });
    };

    showDeleteConfirm = (record) => {
        const { id } = record;
        Modal.confirm({
            content: (
                <span>
                    确定要 <span style={{ color: '#ff3b3b' }}>删除</span> 该数据吗？
                </span>
            ),
            title: '提示',
            okText: '确定',
            cancelText: '取消',
            icon: <HxIcon type="icon-ask" className="fz24"></HxIcon>,
            onOk: () => {
                return this.deleteRepairRecord(id);
            },
            className: 'confirmStyle',
        });
    };

    deleteRepairRecord = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/deleteRepairRecord',
            payload: {
                id,
            },
            callback: () => {
                this.getTableViewList();
            },
        });
    };

    handleTableSearch = (confirm, columns) => {
        confirm();
        let filtersParam = {};
        const { startValue, endValue } = columns[4].filteredValue;
        if (startValue) {
            filtersParam.maintenanceStartTime = startValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (endValue) {
            filtersParam.maintenanceEndTime = endValue.format('YYYY-MM-DD HH:mm:ss');
        }
        this.setState({ filtersParam }, () => {
            this.getTableViewList(0);
        });
    };

    render() {
        const { isShowAddRepairRecordModal, isShowRepairRecordDetailModal, isShowEditRepairRecordModal } = this.state;
        const {
            deviceList: { repairRecordList },
        } = this.props;
        const { data = [], pageable = {} } = repairRecordList;
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
                title: '维修单元',
                dataIndex: 'unitTypeList',
                render: (text) => {
                    const unitTypeList = [];
                    text.map((scene) => {
                        return unitTypeList.push(filters.deviceUnitTypeFilter(scene));
                    });
                    return _.join(unitTypeList, '、');
                },
                ellipsis: true,
            },
            {
                title: '情况描述',
                dataIndex: 'description',
                ellipsis: true,
            },
            {
                title: '维修人员',
                dataIndex: 'employeeName',
                render: (text, record) => {
                    return (
                        <span>
                            <span>{text}</span>
                            {record.employeeMobile ? (
                                <span>
                                    <span className="mr5 ml5">/</span>
                                    <span>{record.employeeMobile}</span>
                                </span>
                            ) : null}
                        </span>
                    );
                },
                width: 250,
                ellipsis: true,
            },
            {
                title: '维修时间',
                dataIndex: 'maintenanceTime',
                filterType: 'timeRanger',
                width: 250,
                align: 'center',
                ellipsis: true,
            },
            {
                title: '操作',
                dataIndex: 'id',
                render: (text, record) => {
                    return (
                        <div>
                            <a
                                onClick={() => {
                                    return this.updateRepairRecordDetailModalStatus(record);
                                }}>
                                详情
                            </a>
                            <Divider type="vertical"></Divider>
                            <a
                                onClick={() => {
                                    return this.updateEditRepairRecordModalStatus(record);
                                }}>
                                编辑
                            </a>
                            <Divider type="vertical"></Divider>
                            <a
                                className="link-delete"
                                onClick={() => {
                                    return this.showDeleteConfirm(record);
                                }}>
                                删除
                            </a>
                        </div>
                    );
                },
                width: 167,
            },
        ];
        return (
            <div>
                <div className="mb20 clearfix">
                    <span className="table-title">设备维修记录</span>
                    <div className="fr">
                        <Button onClick={this.updateAddRepairRecordModalStatus} className="mr8" type="primary">
                            新增维修
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
                {isShowAddRepairRecordModal && <AddRepairRecord updateAddRepairRecordModalStatus={this.updateAddRepairRecordModalStatus} getTableViewList={this.getTableViewList}></AddRepairRecord>}
                {isShowRepairRecordDetailModal && <RepairRecordDetail updateRepairRecordDetailModalStatus={this.updateRepairRecordDetailModalStatus}></RepairRecordDetail>}
                {isShowEditRepairRecordModal && <EditRepairRecord updateEditRepairRecordModalStatus={this.updateEditRepairRecordModalStatus} getTableViewList={this.getTableViewList}></EditRepairRecord>}
            </div>
        );
    }
}

export default RemoteUpgradeTable;
