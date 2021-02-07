import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { Table, Divider, Popover, Modal } from 'antd';
import { connect } from 'dva';
import { HxIcon } from '@/components/hx-components';
import SearchForm from './components/SearchForm';
import Junior from './components/Junior';
import Detail from './components/Detail';
import styles from './index.less';

const { confirm } = Modal;

@connect(({ loading, seriesManagement }) => {
    return {
        seriesManagement,
        loadingSearch: loading.effects['seriesManagement/getTableListInfo'],
    };
})
class TableView extends Component {
    columns = [
        {
            title: '系列名称',
            dataIndex: 'name',
            render: (text) => {
                return text || '--';
            },
            align: 'left',
            ellipsis: true,
        },
        {
            title: '系列编码',
            dataIndex: 'code',
            render: (text) => {
                return text || '--';
            },
            align: 'left',
            ellipsis: true,
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record) => {
                return (
                    <div>
                        {record.parentId === null ? (
                            <a
                                onClick={() => {
                                    return this.addJunior(record, 'add');
                                }}>
                                新增下级
                            </a>
                        ) : (
                            <div>
                                <a
                                    onClick={() => {
                                        return this.showDetails(record);
                                    }}>
                                    详情
                                </a>
                                <Divider type="vertical"></Divider>
                                <a
                                    onClick={() => {
                                        return this.addJunior(record, 'edit');
                                    }}>
                                    编辑
                                </a>
                                <Divider type="vertical"></Divider>
                                <Popover
                                    placement="bottom"
                                    title={text}
                                    overlayClassName={styles.tableBox}
                                    content={
                                        <div className={styles.popover}>
                                            <a
                                                onClick={() => {
                                                    return this.addJunior(record, 'add');
                                                }}>
                                                新增下级
                                            </a>
                                            <a
                                                onClick={() => {
                                                    return this.up(record);
                                                }}>
                                                上移
                                            </a>
                                            <a
                                                onClick={() => {
                                                    return this.down(record);
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
            searchParam: {},
            juniorVisable: false, // 新增下级弹框展示
            detailsVisable: false, // 弹框展示
        };
    }

    componentDidMount = () => {
        this.getTableViewList();
    };

    getTableViewList = () => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        dispatch({
            type: 'seriesManagement/getTableListInfo',
            payload: {
                ...searchParam,
            },
        });
    };

    // 上移
    up = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'seriesManagement/up',
            payload: { id: record.id },
            callback: () => {
                this.getTableViewList();
            },
        });
    };

    // 下移
    down = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'seriesManagement/down',
            payload: { id: record.id },
            callback: () => {
                this.getTableViewList();
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

    deleteShow = (record) => {
        confirm({
            content: (
                <div>
                    <div>确定要删除该数据吗？</div>
                    <div>系列名称：{record && record.name ? record.name : ''}</div>
                </div>
            ),
            title: '提示',
            okText: '确定',
            cancelText: '取消',
            icon: <HxIcon type="icon-ask" className="fz24"></HxIcon>,
            onOk: () => {
                return this.deleteOk(record.id);
            },
            className: 'confirmStyle',
        });
    };

    // 确定删除
    deleteOk = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'seriesManagement/deleteTableInfo',
            payload: { id },
            callback: () => {
                this.getTableViewList();
            },
        });
    };

    // 显示详情
    showDetails = (record) => {
        this.setState(
            (preState) => {
                return {
                    detailsVisable: !preState.detailsVisable,
                    juniorInfo: record,
                };
            },
            () => {
                this.getTableViewList();
            },
        );
    };

    // 新增下级
    addJunior = (record, type) => {
        this.setState(
            (preState) => {
                return {
                    juniorVisable: !preState.juniorVisable,
                    juniorInfo: record,
                    addOrEdit: type,
                };
            },
            () => {
                this.getTableViewList();
            },
        );
    };

    render() {
        const { juniorVisable, juniorInfo, addOrEdit, detailsVisable } = this.state;
        const {
            seriesManagement: { tableInfo },
            loadingSearch,
        } = this.props;
        const { data = [] } = tableInfo;
        return (
            <>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content mt16">
                    <SearchForm handleSearch={this.handleSearch} resetSearch={this.resetSearch}></SearchForm>
                </div>
                <div className="content mt12 flex-1">
                    <div className="mb20 clearfix">
                        <span className="table-title">系列列表</span>
                    </div>
                    <Table
                        rowKey={(record) => {
                            return record.id;
                        }}
                        loading={loadingSearch}
                        pagination={false}
                        columns={this.columns}
                        dataSource={data}
                        defaultExpandAllRows></Table>
                </div>
                {juniorVisable ? <Junior addOrEdit={addOrEdit} addJunior={this.addJunior} juniorInfo={juniorInfo}></Junior> : null}
                {detailsVisable ? <Detail showDetails={this.showDetails} juniorInfo={juniorInfo}></Detail> : null}
            </>
        );
    }
}

export default TableView;
