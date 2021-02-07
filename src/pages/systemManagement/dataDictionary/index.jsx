import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { connect } from 'dva';
import { Table } from 'antd';
import Setting from './components/Setting';
import SearchForm from './components/SearchForm';

@connect(({ loading, dataDictionarySpace }) => {
    return {
        dataDictionarySpace,
        loadingSearch: loading.effects['dataDictionarySpace/getTableListInfo'],
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
            title: '字典名称',
            dataIndex: 'name',
            ellipsis: true,
            render: (text) => {
                return text || '--';
            },
        },
        {
            title: '系统ID',
            dataIndex: 'code',
            ellipsis: true,
            render: (text) => {
                return text || '--';
            },
            // width: 300,
        },
        {
            title: '操作',
            dataIndex: 'operate',
            ellipsis: true,
            render: (text, record) => {
                return (
                    <div>
                        <a
                            onClick={() => {
                                return this.settingShow(record.id);
                            }}>
                            设置
                        </a>
                    </div>
                );
            },
            fixed: 'right',
            width: 68,
        },
    ];

    constructor(props) {
        super(props);
        this.state = {
            settingId: '',
            showSettingModal: false, // 是否展示设置模态框
            pageInfo: {
                page: 0,
                size: 10,
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
            type: 'dataDictionarySpace/getTableListInfo',
            payload: {
                ...pageInfo,
                ...searchParam,
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

    // 显示配置框
    settingShow = (id) => {
        this.setState((preState) => {
            return {
                showSettingModal: !preState.showSettingModal,
                settingId: id,
            };
        });
    };

    render() {
        const {
            dataDictionarySpace: { tableInfo },
            loadingSearch,
        } = this.props;
        const { data = [], pageable = {} } = tableInfo;
        const { showSettingModal, settingId } = this.state;
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
                        <span className="table-title">数据字典</span>
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
                    {showSettingModal ? <Setting settingShow={this.settingShow} settingId={settingId}></Setting> : null}
                </div>
            </>
        );
    }
}

export default TableView;
