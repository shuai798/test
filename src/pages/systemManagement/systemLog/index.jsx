import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { connect } from 'dva';
import zhCN from '@/i18n/zh-CN/zhCN';
import filters from '@/filters';
import FilterSelectAllTable from '@/components/filter-selectall-table';
import SearchForm from './components/SearchForm';

@connect(({ loading, systemLogSpace }) => {
    return {
        systemLogSpace,
        loadingSearch: loading.effects['systemLogSpace/getTableListInfo'],
    };
})
class TableView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageInfo: {
                page: 0,
                size: 10,
            },
            searchParam: {},
            filtersParam: {},
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
            type: 'systemLogSpace/getTableListInfo',
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
            filtersParam: {},
        });
    };

    getTypeFilters = () => {
        const typeArray = [];
        zhCN.systemLogResult.map((item) => {
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
        const { startValue, endValue } = columns[2].filteredValue;
        const startValue1 = columns[3].filteredValue.startValue;
        const endValue1 = columns[3].filteredValue.endValue;
        if (startValue) {
            filtersParam.startTimeS = startValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (endValue) {
            filtersParam.startTimeE = endValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (startValue1) {
            filtersParam.endTimeS = startValue1.format('YYYY-MM-DD HH:mm:ss');
        }
        if (endValue1) {
            filtersParam.endTimeE = endValue1.format('YYYY-MM-DD HH:mm:ss');
        }
        if (columns[6].filteredValue.length > 0) {
            filtersParam.statusList = columns[6].filteredValue;
        }
        this.setState({ filtersParam }, () => {
            this.getTableViewList(0);
        });
    };

    render() {
        const {
            systemLogSpace: { tableInfo },
            loadingSearch,
        } = this.props;
        const { data = [], pageable = {} } = tableInfo;
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

        const columns = [
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
                ellipsis: true,
            },
            {
                title: '任务名称',
                dataIndex: 'name',
                // width: 124,
                ellipsis: true,
            },
            {
                title: '开始时间',
                dataIndex: 'startTime',
                align: 'center',
                filterType: 'timeRanger',
                width: 189,
                ellipsis: true,
            },
            {
                title: '结束时间',
                dataIndex: 'endTime',
                align: 'center',
                filterType: 'timeRanger',
                width: 189,
                ellipsis: true,
            },
            {
                title: '任务描述',
                dataIndex: 'description',
                ellipsis: true,
            },
            {
                title: '异常描述',
                dataIndex: 'exceptionInfo',
                ellipsis: true,
                render: (text) => {
                    return text || '--';
                },
            },
            {
                title: '执行结果',
                dataIndex: 'status',
                filterType: 'multipleChoice',
                filters: this.getTypeFilters(),
                align: 'center',
                width: 124,
                ellipsis: true,
                render: (text) => {
                    if (text === 'SUCCESS') {
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
                                <div className="dib">{filters.operationResultFilter(text)}</div>
                            </div>
                        );
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
                            <div className="dib">{filters.operationResultFilter(text)}</div>
                        </div>
                    );
                },
            },
        ];
        return (
            <>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <SearchForm handleSearch={this.handleSearch} resetSearch={this.resetSearch}></SearchForm>
                </div>
                <div className="content mt12 flex-1">
                    <div className="mb20 clearfix">
                        <span className="table-title">系统日志</span>
                    </div>
                    <FilterSelectAllTable
                        rowKey={(record) => {
                            return record.id;
                        }}
                        loading={loadingSearch}
                        columns={columns}
                        scroll={{ x: 1200 }}
                        dataSource={data}
                        pagination={pagination}
                        onChange={this.tableChange}
                        handleTableSearch={this.handleTableSearch}></FilterSelectAllTable>
                </div>
            </>
        );
    }
}

export default TableView;
