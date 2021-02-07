import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { connect } from 'dva';
import FilterSelectAllTable from '@/components/filter-selectall-table';
import enums from '@/i18n/zh-CN/zhCN';
import SearchForm from './components/SearchForm';

@connect(({ loading, operationLogSpace }) => {
    return {
        operationLogSpace,
        loadingSearch: loading.effects['operationLogSpace/getTableListInfo'] || loading.effects['operationLogSpace/getTypes'],
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
            operationTypes: [],
            dataLoaded: false,
        };
    }

    componentDidMount = () => {
        this.getTypes();
    };

    getTypes = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'operationLogSpace/getTypes',
            payload: {},
            callback: (response) => {
                if (response.status == 200) {
                    this.setState({
                        operationTypes: response.data,
                    });
                }
                this.getTableViewList(0);
            },
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
            type: 'operationLogSpace/getTableListInfo',
            payload: {
                ...pageInfo,
                ...searchParam,
                ...filtersParam,
            },
            callback: () => {
                this.setState({ dataLoaded: true });
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

    handleTableSearch = (confirm, columns) => {
        confirm();

        const filtersParam = {};
        const { startValue, endValue } = columns[6].filteredValue;
        if (startValue) {
            filtersParam.operStartTime = startValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (endValue) {
            filtersParam.operEndTime = endValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (columns[1].filteredValue.length > 0) {
            filtersParam.operTypeList = columns[1].filteredValue;
        }

        this.setState({ filtersParam }, () => {
            this.getTableViewList(0);
        });
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
        const { operationTypes } = this.state;
        operationTypes.map((item) => {
            const typeItem = {};
            typeItem.label = item;
            typeItem.value = item;
            typeArray.push(typeItem);
        });
        return typeArray;
    };

    render() {
        const {
            operationLogSpace: { tableInfo },
            loadingSearch,
        } = this.props;
        const { dataLoaded } = this.state;
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
            },
            {
                title: '操作类型',
                dataIndex: 'operType',
                filterType: 'multipleChoice',
                filters: this.getTypeFilters(),
                ellipsis: true,
                render: (text) => {
                    return text || '--';
                },
            },
            {
                title: '功能模块',
                dataIndex: 'module',
                ellipsis: true,
                render: (text) => {
                    return text || '--';
                },
            },
            {
                title: '操作账户',
                dataIndex: 'employeeMobile',
                ellipsis: true,
                render: (text, item) => {
                    return item.employeeName && text ? `${item.employeeName}/${text}` : text || '--';
                },
            },
            {
                title: '所属组织',
                dataIndex: 'organizationName',
                ellipsis: true,
                render: (text) => {
                    return text || '--';
                },
            },
            {
                title: 'IP地址',
                dataIndex: 'ip',
                ellipsis: true,
                width: 130,
                render: (text) => {
                    return text || '--';
                },
            },
            {
                title: '操作时间',
                dataIndex: 'operTime',
                filterType: 'timeRanger',
                align: 'center',
                ellipsis: true,
                width: 189,
                render: (text) => {
                    return text || '--';
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
                        <span className="table-title">操作日志</span>
                    </div>
                    {dataLoaded ? (
                        <FilterSelectAllTable
                            rowKey={(record) => {
                                return record.id;
                            }}
                            loading={loadingSearch}
                            columns={columns}
                            dataSource={data}
                            pagination={pagination}
                            scroll={{ x: 1200 }}
                            onChange={this.tableChange}
                            handleTableSearch={this.handleTableSearch}></FilterSelectAllTable>
                    ) : null}
                </div>
            </>
        );
    }
}

export default TableView;
