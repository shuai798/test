import React, { Component } from 'react';
import { Table, Button, Form, Icon, Divider, Modal } from 'antd';
import { HxIcon, HxRangePicker } from '@/components/hx-components';
import { connect } from 'dva';
import moment from 'moment';
import AddMaintenanceRecord from './AddMaintenanceRecord';
import MaintenanceRecordDetail from './MaintenanceRecordDetail';
import EditMaintenanceRecord from './EditMaintenanceRecord';
import styles from '../../../index.less';
import FilterSelectAllTable from '@/components/filter-selectall-table';

@connect(({ deviceList, loading }) => {
    return {
        deviceList,
        loadingSearch: loading.effects['deviceList/getMaintenanceRecordList'],
    };
})
@Form.create()
class MaintenanceRecordTable extends Component {
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
            upkeepTime: [],
            isShowAddMaintenanceRecordModal: false,
            isShowMaintenanceRecordDetailModal: false,
            isShowEditMaintenanceRecordModal: false,
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
            type: 'deviceList/getMaintenanceRecordList',
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

    updateAddMaintenanceRecordModalStatus = () => {
        this.setState((prevState) => {
            return { isShowAddMaintenanceRecordModal: !prevState.isShowAddMaintenanceRecordModal };
        });
    };

    updateMaintenanceRecordDetailModalStatus = (record) => {
        if (record) {
            const { id } = record;
            const { dispatch } = this.props;
            dispatch({
                type: 'deviceList/getMaintenanceRecordDetail',
                payload: {
                    id,
                },
                callback: () => {
                    this.setState((prevState) => {
                        return { isShowMaintenanceRecordDetailModal: !prevState.isShowMaintenanceRecordDetailModal };
                    });
                },
            });
        } else {
            this.setState((prevState) => {
                return { isShowMaintenanceRecordDetailModal: !prevState.isShowMaintenanceRecordDetailModal };
            });
        }
    };

    updateEditMaintenanceRecordModalStatus = (record) => {
        if (record) {
            const { id } = record;
            const { dispatch } = this.props;
            dispatch({
                type: 'deviceList/getMaintenanceRecordDetail',
                payload: {
                    id,
                },
                callback: () => {
                    this.setState((prevState) => {
                        return { isShowEditMaintenanceRecordModal: !prevState.isShowEditMaintenanceRecordModal };
                    });
                },
            });
        } else {
            this.setState((prevState) => {
                return { isShowEditMaintenanceRecordModal: !prevState.isShowEditMaintenanceRecordModal };
            });
        }
    };

    getMaintenanceRecordDetail = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/getMaintenanceRecordDetail',
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
                return this.deleteMaintenanceRecord(id);
            },
            className: 'confirmStyle',
        });
    };

    deleteMaintenanceRecord = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/deleteMaintenanceRecord',
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
        const { startValue, endValue } = columns[3].filteredValue;
        if (startValue) {
            filtersParam.upkeepStartTime = startValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (endValue) {
            filtersParam.upkeepEndTime = endValue.format('YYYY-MM-DD HH:mm:ss');
        }
        this.setState({ filtersParam }, () => {
            this.getTableViewList(0);
        });
    };

    render() {
        const { isShowAddMaintenanceRecordModal, isShowMaintenanceRecordDetailModal, isShowEditMaintenanceRecordModal } = this.state;
        const {
            deviceList: { maintenanceRecordList },
        } = this.props;
        const { data = [], pageable = {} } = maintenanceRecordList;
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
                title: '情况描述',
                dataIndex: 'description',
                ellipsis: true,
            },
            {
                title: '维保人员',
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
                title: '维保时间',
                dataIndex: 'upkeepTime',
                filterType: 'timeRanger',
                width: 189,
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
                                    return this.updateMaintenanceRecordDetailModalStatus(record);
                                }}>
                                详情
                            </a>
                            <Divider type="vertical"></Divider>
                            <a
                                onClick={() => {
                                    return this.updateEditMaintenanceRecordModalStatus(record);
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
                    <span className="table-title">设备维保记录</span>
                    <div className="fr">
                        <Button onClick={this.updateAddMaintenanceRecordModalStatus} className="mr8" type="primary">
                            新增维保
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
                {isShowAddMaintenanceRecordModal && <AddMaintenanceRecord updateAddMaintenanceRecordModalStatus={this.updateAddMaintenanceRecordModalStatus} getTableViewList={this.getTableViewList}></AddMaintenanceRecord>}
                {isShowMaintenanceRecordDetailModal && <MaintenanceRecordDetail updateMaintenanceRecordDetailModalStatus={this.updateMaintenanceRecordDetailModalStatus}></MaintenanceRecordDetail>}
                {isShowEditMaintenanceRecordModal && <EditMaintenanceRecord updateEditMaintenanceRecordModalStatus={this.updateEditMaintenanceRecordModalStatus} getTableViewList={this.getTableViewList}></EditMaintenanceRecord>}
            </div>
        );
    }
}

export default MaintenanceRecordTable;
