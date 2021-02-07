import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { connect } from 'dva';
import { Modal, Table, Divider, Button } from 'antd';
import SearchForm from './components/SearchForm';
import AddModal from './components/AddModal';
import DetailModal from './components/DetailModal';
import styles from './index.less';
import { HxIcon } from '@/components/hx-components';

const { confirm } = Modal;

@connect(({ loading, roleMangementSpace }) => {
    return {
        roleMangementSpace,
        loadingSearch: loading.effects['roleMangementSpace/getTableListInfo'],
    };
})
class TableView extends Component {
    columns = [
        {
            title: '序号',
            dataIndex: 'NO.',
            width: 68,
            align: 'center',
            render: (text, record, index) => {
                const { pageInfo } = this.state;
                return <span>{pageInfo.page * pageInfo.size + index + 1}</span>;
            },
            fixed: 'left',
        },
        {
            title: '角色名称',
            dataIndex: 'name',
            ellipsis: true,
            render: (text) => {
                return text || '--';
            },
        },
        {
            title: '管理状态',
            dataIndex: 'disable',
            ellipsis: true,
            render: (text) => {
                if (!text) {
                    return (
                        <div>
                            <div
                                className="dib"
                                style={{
                                    width: 8,
                                    height: 8,
                                    background: '#01B538',
                                    borderRadius: '50%',
                                    marginRight: 7,
                                }}></div>
                            <div className="dib">启用</div>
                        </div>
                    );
                    // <span className="color-success">启用</span>;
                }
                return (
                    <div>
                        <div
                            className="dib"
                            style={{
                                width: 8,
                                height: 8,
                                background: '#FF3B3B',
                                borderRadius: '50%',
                                marginRight: 7,
                            }}></div>
                        <div className="dib">禁用</div>
                    </div>
                );
            },
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record) => {
                return (
                    <div className={styles.dividerStyle}>
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
                        <a
                            onClick={() => {
                                return this.deleteShow(record);
                            }}>
                            删除
                        </a>
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
            settingId: '',
            editShowModal: false, // 编辑
            detailShowModal: false, //详情
            editRecord: {}, // 编辑的数据
            detailRecord: {}, //详情数据
            pageInfo: {
                page: 0,
                size: 10,
                sort: 'lastModifiedDate,desc',
            },
            searchParam: {},
        };
    }

    componentDidMount = () => {
        this.getTableViewList(0);
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
            type: 'roleMangementSpace/getTableListInfo',
            payload: {
                ...pageInfo,
                ...searchParam,
                dataType: 'CUSTOM',
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

    deleteShow = (record) => {
        confirm({
            title: <div>确认删除角色“{record.name}”？</div>,
            icon: <HxIcon type="icon-ask" className="fz24"></HxIcon>,
            // content:
            //     <div>
            //         <Form>
            //             <FormItem label="管理员密码">
            //                 {getFieldDecorator('password', {
            //                     validate: [
            //                         {
            //                             trigger: 'onChange',
            //                             rules: [validate.Rule_require],
            //                         },
            //                     ],
            //                 })(<Input placeholder="请输入" maxLength={32}></Input>)}
            //             </FormItem>
            //         </Form>
            //     </div>,
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
        const {
            dispatch,
            roleMangementSpace: { dataSettingDictionaryList },
        } = this.props;
        const { pageable = {} } = dataSettingDictionaryList;
        let page = pageable.number || 0;
        const size = pageable.size || 10;
        const total = pageable.totalElements || 0;
        if (pageable.last && page !== 0 && total % size === 1) {
            page -= 1;
        }
        dispatch({
            type: 'roleMangementSpace/deleteSettingItem',
            payload: { id },
            callback: () => {
                this.getTableViewList(page, size);
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

    // 显示新增编辑框
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
            type: 'roleMangementSpace/editSettingItem',
            payload: values,
            callback: () => {
                const { page, size } = this.state.pageInfo;
                this.setState((preState) => {
                    return {
                        editShowModal: !preState.editShowModal,
                    };
                });
                this.getTableViewList(page, size);
            },
        });
    };

    // 确定添加
    addOk = (values) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'roleMangementSpace/addSettingItem',
            payload: values,
            callback: () => {
                const { page, size } = this.state.pageInfo;
                this.setState((preState) => {
                    return {
                        editShowModal: !preState.editShowModal,
                        selectedRowKeys: [], // 添加成功后将选定状态取消
                    };
                });
                this.getTableViewList(page, size);
            },
        });
    };

    render() {
        const {
            roleMangementSpace: { tableInfo },
            loadingSearch,
        } = this.props;
        const { data = [], pageable = {} } = tableInfo;
        const { editShowModal, detailShowModal, editRecord, detailRecord, settingId } = this.state;
        const pagination = {
            showTotal: () => {
                return (
                    <span className="pagination">
                        共<a>{pageable.totalPages}</a>页/<a>{pageable.totalElements}</a>条数据
                    </span>
                );
            },
            total: pageable.totalElements,
            pageSize: pageable.size,
            current: parseInt(pageable.number + 1, 10) || 1,
            showSizeChanger: true,
        };
        return (
            <>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <SearchForm handleSearch={this.handleSearch} resetSearch={this.resetSearch}></SearchForm>
                </div>
                <div className="content mt12 flex-1">
                    <div className="mb20 clearfix">
                        <span className="table-title">角色列表</span>
                        <div className="fr">
                            <Button
                                type="primary"
                                onClick={() => {
                                    return this.editShow();
                                }}>
                                <span className="iconfont icon-add mr8 fz14"></span>角色
                            </Button>
                        </div>
                    </div>
                    <Table
                        rowKey={(record) => {
                            return record.id;
                        }}
                        loading={loadingSearch}
                        columns={this.columns}
                        dataSource={data}
                        pagination={pagination}
                        onChange={this.tableChange}></Table>
                    {editShowModal ? <AddModal settingId={settingId} editShow={this.editShow} addOk={this.addOk} editOk={this.editOk} editRecord={editRecord}></AddModal> : null}
                    {detailShowModal ? <DetailModal detailRecord={detailRecord} detailShow={this.detailShow}></DetailModal> : null}
                </div>
            </>
        );
    }
}

export default TableView;
