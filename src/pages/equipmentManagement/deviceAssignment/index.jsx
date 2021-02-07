import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { Table, Button, Form, Modal, Divider, Icon } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import Export from '@/utils/export';
import moment from 'moment';
import Api from '@/utils/api';
import { HxIcon } from '@/components/hx-components';
import SearchForm from './components/SearchForm';
import EditFormModal from './components/EditFormModal';
import BatchEditFormModal from './components/BatchEditFormModal';

const { confirm } = Modal;

@connect(({ deviceAssignment, loading }) => {
    return {
        deviceAssignment,
        loadingSearch: loading.effects['deviceAssignment/getDeviceAssignmentList'],
    };
})
@Form.create()
class TableView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageInfo: {
                page: 0,
                size: 10,
            },
            editFormModalVisible: false,
            tableItemRecord: {},
            searchParam: {},
            seriesTreeData: [],
            selectedRowKeyList: [],
            selectedRowList: [],
            isShowBatchEditFormModal: false,
        };
    }

    componentDidMount = () => {
        // 获取系列型号下拉树
        this.getSeriesTree();
        // 获取当前用户所属组织直属客户、下级组织客户
        this.getCustomerList();
        this.getTableViewList(0);
    };

    getSeriesTree = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceAssignment/getSeriesTree',
            callback: () => {
                const {
                    deviceAssignment: { seriesTree = [] },
                } = this.props;
                const seriesTreeData = this.changeDataToTreeSelect(seriesTree, '');
                this.setState({ seriesTreeData });
            },
        });
    };

    getCustomerList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceAssignment/getCustomerList',
        });
    };

    changeDataToTreeSelect = (dataList, name) => {
        const list = dataList;
        if (list.length > 0) {
            for (let i = 0; i < list.length; i += 1) {
                list[i].value = list[i].id;
                list[i].title = list[i].name;
                // 用于回显全路径
                list[i].newValue = name !== '' ? `${name} / ${list[i].name}` : list[i].name;
                if (list[i].children && list[i].children.length > 0) {
                    list[i].children = this.changeDataToTreeSelect(list[i].children, list[i].newValue);
                } else {
                    list[i].children = null;
                }
            }
        }
        return list;
    };

    getTableViewList = (page, size) => {
        const { dispatch } = this.props;
        const { pageInfo, searchParam } = this.state;
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
            type: 'deviceAssignment/getDeviceAssignmentList',
            payload: {
                ...pageInfo,
                ...searchParam,
            },
            callback: () => {
                this.setState({
                    selectedRowKeyList: [],
                    selectedRowList: [],
                });
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

    // 查询数据
    handleSearch = (value) => {
        this.setState(
            {
                searchParam: value,
            },
            () => {
                this.getTableViewList(0);
            },
        );
    };

    // 重置查询条件
    resetSearch = () => {
        this.setState({
            searchParam: {},
        });
    };

    addTableListOK = () => {
        this.getTableViewList(0);
    };

    editeTableList = (record) => {
        const { id } = record;
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceAssignment/getDeviceAssignmentDetail',
            payload: {
                id,
            },
            callback: () => {
                this.setState({
                    editFormModalVisible: true,
                });
            },
        });
    };

    changeEditModal = () => {
        this.setState((preState) => {
            return {
                editFormModalVisible: !preState.editFormModalVisible,
            };
        });
    };

    editTableListOK = () => {
        this.changeEditModal();
        this.getTableViewList();
    };

    showConfirm = (idList) => {
        confirm({
            content: (
                <div>
                    <div>
                        确定要 <span style={{ color: '#ff3b3b' }}>删除</span> 该数据吗？
                    </div>
                    <div className="mt12">设备数量：{idList.length}</div>
                </div>
            ),
            title: '提示',
            okText: '确定',
            cancelText: '取消',
            icon: <HxIcon type="icon-ask" className="fz24"></HxIcon>,
            onOk: () => {
                return this.handleDelete(idList);
            },
            className: 'confirmStyle',
        });
    };

    showItemConfirm = (record) => {
        confirm({
            content: (
                <div>
                    <div>
                        确定要 <span style={{ color: '#ff3b3b' }}>删除</span> 该数据吗？
                    </div>
                    <div className="mt12">设备编码：{record.no}</div>
                </div>
            ),
            title: '提示',
            okText: '确定',
            cancelText: '取消',
            icon: <HxIcon type="icon-ask" className="fz24"></HxIcon>,
            onOk: () => {
                return this.handleDelete([record.id]);
            },
            className: 'confirmStyle',
        });
    };

    unbindConfirm = (record) => {
        const { orgName } = JSON.parse(localStorage.getItem('userInfo'));
        confirm({
            content: (
                <div>
                    <div>
                        确定要 <span style={{ color: '#ff3b3b' }}>解绑</span> 该设备从该客户吗？
                    </div>
                    <div>解绑后，该设备从属关系恢复到当前组织</div>
                    <div className="mt12">当前组织：{orgName}</div>
                </div>
            ),
            title: '提示',
            okText: '确定',
            cancelText: '取消',
            icon: <HxIcon type="icon-ask" className="fz24"></HxIcon>,
            onOk: () => {
                return this.unbind(record);
            },
            className: 'confirmStyle',
        });
    };

    unbind = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceAssignment/unbind',
            payload: {
                id: record.id,
            },
            callback: () => {
                this.getTableViewList();
            },
        });
    };

    // 删除之后仍然显示在当前页，或者前一页
    handleDelete = (idList) => {
        const {
            dispatch,
            deviceAssignment: { deviceAssignmentList },
        } = this.props;
        const { pageable = {} } = deviceAssignmentList;
        let page = pageable.number || 0;
        const size = pageable.size || 10;
        const total = pageable.totalElements || 0;
        if (pageable.last && page !== 0 && total % size === 1) {
            page -= 1;
        }
        dispatch({
            type: 'deviceAssignment/batchDeleteTableInfo',
            payload: idList,
            callback: () => {
                this.getTableViewList(page);
            },
        });
    };

    toAddForm = () => {
        router.push('/equipmentManagement/deviceAssignment/addDeviceAssignment');
    };

    toImport = () => {
        router.push('/equipmentManagement/deviceAssignment/import');
    };

    updateBatchEditModalStatus = () => {
        this.setState((prevState) => {
            return { isShowBatchEditFormModal: !prevState.isShowBatchEditFormModal };
        });
    };

    export = () => {
        const { searchParam } = this.state;
        const now = moment(new Date()).format('YYYY-MM-DD HHmmss');
        Export.exportAsset(`设备分配记录${now}.xlsx`, `/bioec/w/device/allocation/export${Api.bodyToParm(searchParam)}`);
    };

    render() {
        const {
            deviceAssignment: { deviceAssignmentList },
        } = this.props;
        const { data = [], pageable = {} } = deviceAssignmentList;
        const { editFormModalVisible, tableItemRecord, seriesTreeData, selectedRowKeyList, selectedRowList, isShowBatchEditFormModal } = this.state;
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
        const rowSelection = {
            selectedRowKeys: selectedRowKeyList,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeyList: selectedRowKeys,
                    selectedRowList: selectedRows,
                });
            },
            getCheckboxProps: record => {
                return {
                    disabled: record.status === 'RUNNING' || record.status === 'TO_BE_MAINTAINED' || record.status === 'TO_BE_SCRAPPED',
                };
            },
        };
        const { orgName } = JSON.parse(localStorage.getItem('userInfo'));
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
                title: '设备编码',
                dataIndex: 'no',
                ellipsis: true,
                width: 250,
            },
            {
                title: '控制器编码',
                dataIndex: 'controllerNo',
                ellipsis: true,
                width: 250,
            },
            {
                title: '系列型号',
                dataIndex: 'seriesName',
                ellipsis: true,
            },
            {
                title: '分配对象',
                dataIndex: 'distributionObjectName',
                ellipsis: true,
            },
            {
                title: '操作',
                dataIndex: 'id',
                render: (text, record) => {
                    return (
                        record.status === 'RUNNING' || record.status === 'TO_BE_MAINTAINED' || record.status === 'TO_BE_SCRAPPED' ? <div></div> :
                            <div>
                                <a
                                    onClick={() => {
                                        return this.editeTableList(record);
                                    }}>
                                编辑
                                </a>
                                <Divider type="vertical"></Divider>
                                <a
                                    onClick={() => {
                                        return this.unbindConfirm(record);
                                    }}>
                                解绑
                                </a>
                                {orgName === '总公司' && <Divider type="vertical"></Divider>}
                                {orgName === '总公司' && (
                                    <a
                                        className="link-delete"
                                        onClick={() => {
                                            return this.showItemConfirm(record);
                                        }}>
                                    删除
                                    </a>
                                )}
                            </div>
                    );
                },
                width: 167,
            },
        ];
        return (
            <>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <SearchForm handleSearch={this.handleSearch} resetSearch={this.resetSearch} seriesTreeData={seriesTreeData}></SearchForm>
                </div>
                <div className="content mt20 flex-1">
                    <div className="mb20 clearfix">
                        <span className="table-title">设备绑定记录</span>
                        <div className="fr">
                            {selectedRowList.length > 0 && (
                                <Button
                                    onClick={() => {
                                        return this.showConfirm(selectedRowKeyList);
                                    }}
                                    className="mr8"
                                    type="danger"
                                    ghost>
                                    <span className="iconfont icon-delete mr8 fz14"></span>批量删除
                                </Button>
                            )}
                            {selectedRowList.length > 0 && (
                                <Button onClick={this.updateBatchEditModalStatus} className="mr8" type="primary" ghost>
                                    批量分配
                                </Button>
                            )}
                            {orgName === '总公司' && (
                                <Button onClick={this.toImport} className="mr8">
                                    <span className="iconfont icon-import mr8 fz14"></span>导入
                                </Button>
                            )}
                            <Button onClick={this.export} className="mr8">
                                <span className="iconfont icon-export mr8 fz14"></span>导出
                            </Button>
                            {orgName === '总公司' && (
                                <Button type="primary" onClick={this.toAddForm}>
                                    <span className="iconfont icon-add mr8 fz14"></span>分配
                                </Button>
                            )}
                        </div>
                    </div>
                    <Table
                        rowKey={(record) => {
                            return record.id;
                        }}
                        loading={this.props.loadingSearch}
                        scroll={{ x: 1200 }}
                        columns={columns}
                        dataSource={data}
                        pagination={pagination}
                        onChange={this.tableChange}
                        rowSelection={rowSelection}></Table>
                </div>
                {editFormModalVisible ? <EditFormModal hideEditModal={this.changeEditModal} editTableListOK={this.editTableListOK} recordInfo={tableItemRecord} seriesTreeData={seriesTreeData}></EditFormModal> : null}
                {isShowBatchEditFormModal ? <BatchEditFormModal updateBatchEditModalStatus={this.updateBatchEditModalStatus} getTableViewList={this.getTableViewList} selectedRowList={selectedRowList} seriesTreeData={seriesTreeData}></BatchEditFormModal> : null}
            </>
        );
    }
}

export default TableView;
