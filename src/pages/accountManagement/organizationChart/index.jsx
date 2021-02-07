import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { connect } from 'dva';
import { Modal, Table, Divider, Icon, Popover, message } from 'antd';
import filters from '@/filters/index';
import SearchForm from './components/SearchForm';
import AddModal from './components/addModal';
import EditModal from './components/editModal';
import DetailModal from './components/DetailModal';
import styles from './index.less';
import FilterSelectAllTable from '@/components/filter-selectall-table';
import { HxIcon } from '@/components/hx-components';

const { confirm } = Modal;

@connect(({ loading, organizationChartSpace }) => {
    return {
        organizationChartSpace,
        loadingSearch: loading.effects['organizationChartSpace/getTableListInfo'],
    };
})
class TableView extends Component {
    columns = [
        // {
        //     title: '序号',
        //     dataIndex: 'NO.',
        //     width: 68,
        //     align: 'center',
        //     render: (text, record, index) => {
        //         return <span>{index + 1}</span>;
        //     },
        //     fixed: 'left',
        // },
        {
            title: '组织名称',
            dataIndex: 'name',
            width: 280,
            ellipsis: true,
            render: (text) => {
                return text || '--';
            },
            // align: 'left',
        },
        {
            title: '组织编码',
            dataIndex: 'code',
            ellipsis: true,
            render: (text) => {
                return text || '--';
            },
            // align: 'center',
            // width: 200,
        },
        {
            title: '组织类型',
            dataIndex: 'type',
            ellipsis: true,
            align: 'center',
            render: (text) => {
                return text ? filters.organizationTypeFilter(text) : '--';
            },
            // align: 'center',
            // width: 200,
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record, index) => {
                return (
                    <div className={styles.dividerStyle}>
                        {record.parentId === null ? (
                            <a
                                onClick={() => {
                                    return this.addShow(record);
                                }}>
                                新增下级
                            </a>
                        ) : (
                            <div>
                                <a
                                    onClick={() => {
                                        return this.detailShow(record);
                                    }}>
                                    详情
                                </a>
                                <Divider type="vertical" />
                                <a
                                    onClick={() => {
                                        return this.editShow(record);
                                    }}>
                                    编辑
                                </a>
                                <Divider type="vertical" />
                                <Popover
                                    placement="bottom"
                                    title={text}
                                    overlayClassName={styles.morePadding}
                                    content={
                                        <div className={styles.popover}>
                                            {record.type !== 'AGENT' ? (
                                                <a
                                                    onClick={() => {
                                                        return this.addShow(record);
                                                    }}>
                                                    新增下级
                                                </a>
                                            ) : null}
                                            <a
                                                onClick={() => {
                                                    return this.up(record, index);
                                                }}>
                                                上移
                                            </a>
                                            <a
                                                onClick={() => {
                                                    return this.down(record, index);
                                                }}>
                                                下移
                                            </a>
                                            <a
                                                className="link-delete"
                                                onClick={() => {
                                                    return this.deleteShow(record);
                                                }}>
                                                删除
                                            </a>
                                        </div>
                                    }>
                                    <a>更多</a>
                                </Popover>
                            </div>
                        )}
                    </div>
                );
            },
            fixed: 'right',
            width: 167,
        },
    ];

    constructor(props) {
        super(props);
        this.state = {
            editShowModal: false, // 编辑
            addShowModal: false, // 编辑
            detailShowModal: false, //详情
            addRecord: {}, // 新增需要的数据
            editRecord: {}, // 编辑的数据
            detailRecord: {}, //详情数据
            searchParam: {},
            tableData: [], // tree数据源
        };
    }

    componentDidMount = () => {
        this.getTableViewList();
    };

    getTableViewList = () => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        const { orgId } = JSON.parse(localStorage.getItem('userInfo'));
        dispatch({
            type: 'organizationChartSpace/getTableListInfo',
            payload: {
                ...searchParam,
                orgId,
            },
            callback: (res) => {
                this.setState({
                    tableData: res && res !== null ? res : [],
                    // tableData: res,
                });
            },
        });
    };

    // 查询数据
    handleSearch = (value) => {
        this.setState(
            {
                searchParam: value,
            },
            () => {
                this.getTableViewList();
            },
        );
    };

    // 重置查询条件
    resetSearch = () => {
        this.setState({
            searchParam: {},
        });
    };

    // 上移
    up = (record, index) => {
        const { dispatch } = this.props;
        if (index === 0) {
            message.warn('已经是第一个了，无法上移');
            return;
        }
        dispatch({
            type: 'organizationChartSpace/up',
            payload: { id: record.id },
            callback: () => {
                this.getTableViewList();
            },
        });
    };

    // 下移
    down = (record, index) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'organizationChartSpace/getTableListById',
            payload: { orgId: record.parentId },
            callback: (res) => {
                if (index === res.data.children.length - 1) {
                    message.warn('已经是最后一个了，无法下移');
                    return;
                }
                dispatch({
                    type: 'organizationChartSpace/down',
                    payload: { id: record.id },
                    callback: () => {
                        this.getTableViewList();
                    },
                });
            },
        });
    };

    deleteShow = (record) => {
        confirm({
            title: '确定要删除该数据吗',
            // title:
            //     <div>
            //         确认<span className="color-danger" style={{ paddingLeft: 4, paddingRight: 4 }}>删除</span>角色“{record.name}”？
            //     </div>,
            icon: <HxIcon type="icon-ask" className="fz24"></HxIcon>,
            // content:
            okText: '确定',
            cancelText: '取消',
            width: 450,
            onOk: () => {
                return this.deleteOk(record.id);
            },
        });
    };

    // 确定删除
    deleteOk = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'organizationChartSpace/deleteSettingItem',
            payload: { id },
            callback: () => {
                this.getTableViewList();
            },
        });
    };

    // 显示详情框
    detailShow = (record) => {
        this.setState((preState) => {
            return {
                detailShowModal: !preState.detailShowModal,
                detailRecord: record,
            };
        });
    };

    // 显示编辑框
    editShow = (record) => {
        this.setState((preState) => {
            return {
                editShowModal: !preState.editShowModal,
                editRecord: record,
            };
        });
    };

    // 确定编辑
    editOk = (values) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'organizationChartSpace/editSettingItem',
            payload: values,
            callback: () => {
                this.setState((preState) => {
                    return {
                        editShowModal: !preState.editShowModal,
                    };
                });
                this.getTableViewList();
            },
        });
    };

    // 显示新增框
    addShow = (record) => {
        this.setState((preState) => {
            return {
                addShowModal: !preState.addShowModal,
                addRecord: record,
            };
        });
    };

    // 确定添加
    addOk = (values) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'organizationChartSpace/addSettingItem',
            payload: values,
            callback: () => {
                this.setState((preState) => {
                    return {
                        addShowModal: !preState.addShowModal,
                    };
                });
                this.getTableViewList();
            },
        });
    };

    render() {
        const { tableData, addShowModal, editShowModal, detailShowModal, editRecord, detailRecord, addRecord } = this.state;
        const { loadingSearch } = this.props;
        return (
            <>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <SearchForm handleSearch={this.handleSearch} resetSearch={this.resetSearch}></SearchForm>
                </div>
                <div className="content mt12 flex-1">
                    <div className="mb12 clearfix">
                        <span className="table-title">组织架构</span>
                    </div>
                    {tableData && tableData.length > 0 && tableData[0] !== null && (
                        <Table
                            rowKey={(record) => {
                                return record.id;
                            }}
                            loading={loadingSearch}
                            columns={this.columns}
                            dataSource={tableData}
                            scroll={{ x: 1100 }}
                            defaultExpandAllRows></Table>
                    )}
                    {addShowModal ? <AddModal addShow={this.addShow} addOk={this.addOk} addRecord={addRecord}></AddModal> : null}
                    {editShowModal ? <EditModal editShow={this.editShow} editOk={this.editOk} editRecord={editRecord}></EditModal> : null}
                    {detailShowModal ? <DetailModal detailRecord={detailRecord} detailShow={this.detailShow}></DetailModal> : null}
                </div>
            </>
        );
    }
}

export default TableView;
