import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { Button, Icon } from 'antd';
import { connect } from 'dva';
import { HxRangePicker } from '@/components/hx-components';
import moment from 'moment';
import filters from '@/filters';
import zhCN from '@/i18n/zh-CN/zhCN';
import FilterSelectAllTable from '@/components/filter-selectall-table';
import SearchForm from './components/SearchForm';

@connect(({ loading, batchOperationSpace }) => {
    return {
        batchOperationSpace,
        loadingSearch: loading.effects['batchOperationSpace/getTableListInfo'],
        zhCN,
    };
})
class TableView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchParam: {},
            activeTime: [], // 操作时间
            filtersParam: {},
        };
    }

    componentDidMount = () => {
        this.getTableViewList();
    };

    // 分页
    getTableViewList = (page = 0, size = 10) => {
        const { dispatch } = this.props;
        const { searchParam, pagination, filtersParam } = this.state;
        const value = {
            page,
            size: size || pagination.pageSize,
            ...searchParam,
            ...filtersParam,
        };
        dispatch({
            type: 'batchOperationSpace/getTableListInfo',
            payload: {
                ...value,
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
                this.getTableViewList(0);
            },
        );
    };

    // 重置查询条件
    resetSearch = () => {
        this.setState({
            searchParam: {},
            activeTime: [],
            filtersParam: {},
        });
    };

    // 显示详情框
    showDetails = (id) => {
        this.props.history.push(`/equipmentManagement/batchOperation/details?id=${id}`);
    };

    showAddForm = () => {
        this.props.history.push('/equipmentManagement/batchOperation/addForm');
    };

    handleTableChange = (pagination) => {
        this.getTableViewList(pagination.current - 1, pagination.pageSize);
    };

    handleTableSearch = (confirm, columns) => {
        confirm();
        const filtersParam = {};
        const { startValue, endValue } = columns[4].filteredValue;
        if (startValue) {
            filtersParam.operationStartTime = startValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (endValue) {
            filtersParam.operationEndTime = endValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (columns[1].filteredValue.length > 0) {
            filtersParam.operationTypeList = columns[1].filteredValue;
        }
        this.setState({ filtersParam }, () => {
            this.getTableViewList(0);
        });
    };

    handleChangeCreatedTime = (momentCreatedTime, stringCreatedTime) => {
        this.setState({ activeTime: stringCreatedTime });
    };

    handleSearchCreatedTime = (confirm) => {
        confirm();
        let { filtersParam } = this.state;
        const { activeTime } = this.state;
        filtersParam = {
            ...filtersParam,
            operationStartTime: activeTime[0],
            operationEndTime: activeTime[1],
        };
        this.setState({ filtersParam }, () => {
            this.getTableViewList(0);
        });
    };

    // handleResetCreatedTime = (clearFilters) => {
    //     clearFilters();
    //     let { filtersParam } = this.state;
    //     filtersParam = {
    //         ...filtersParam,
    //         buildStartTime: '',
    //         buildEndTime: '',
    //     };
    //     this.setState(
    //         {
    //             filtersParam,
    //             activeTime: [],
    //         },
    //         () => {
    //             this.getTableViewList();
    //         },
    //     );
    // };

    getColumnSearchProps = () => {
        const { activeTime } = this.state;
        return {
            filterDropdown: ({ confirm }) => {
                return (
                    <div>
                        <HxRangePicker showTime value={activeTime.length === 2 && activeTime[0] && activeTime[1] ? [moment(activeTime[0], 'YYYY-MM-DD HH:mm:ss'), moment(activeTime[1], 'YYYY-MM-DD HH:mm:ss')] : []} onChange={this.handleChangeCreatedTime} className="m8"></HxRangePicker>
                        <div className="filter-footer">
                            <a
                                onClick={() => {
                                    return this.handleSearchCreatedTime(confirm);
                                }}>
                                确定
                            </a>
                            {/*<a*/}
                            {/*    onClick={() => {*/}
                            {/*        return this.handleResetCreatedTime(clearFilters);*/}
                            {/*    }}>*/}
                            {/*    重置*/}
                            {/*</a>*/}
                        </div>
                    </div>
                );
            },
            filterIcon: () => {
                return <Icon type="clock-circle" style={{ color: activeTime.length === 2 && activeTime[0] && activeTime[1] ? '#4db22f' : undefined }} />;
            },
        };
    };

    //获取操作类型
    getTypeFilters = () => {
        const typeArray = [];
        zhCN.operationType.map((item) => {
            const typeItem = {};
            typeItem.label = item.name;
            typeItem.value = item.code;
            typeArray.push(typeItem);
        });
        return typeArray;
    };

    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'No',
                width: 68,
                align: 'center',
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                },
                fixed: 'left',
            },
            {
                title: '操作类型',
                dataIndex: 'operationType',
                filterType: 'multipleChoice',
                filters: this.getTypeFilters(),
                render: (text) => {
                    return filters.getOperationType(text) || '--';
                },
                ellipsis: true,
                width: 189,
            },
            {
                title: '设备数量',
                dataIndex: 'deviceNum',
                align: 'center',
                ellipsis: true,
                render: (text) => {
                    return text || '--';
                },
                width: 120,
            },
            {
                title: '操作结果',
                dataIndex: 'operationResult',
                align: 'center',
                children: [
                    {
                        title: '执行中',
                        dataIndex: 'processingNum',
                        width: 87,
                        align: 'center',
                        ellipsis: true,
                    },
                    {
                        title: '成功',
                        dataIndex: 'successNum',
                        width: 87,
                        align: 'center',
                        ellipsis: true,
                        render: (text) => {
                            if (text === 0) {
                                return text;
                            }
                            return <span className="color-success">{text}</span>;
                        },
                    },
                    {
                        title: '失败',
                        dataIndex: 'failureNum',
                        width: 87,
                        align: 'center',
                        ellipsis: true,
                        render: (text) => {
                            if (text === 0) {
                                return text;
                            }
                            return <span className="color-danger">{text}</span>;
                        },
                    },
                ],
            },
            {
                title: '操作时间',
                dataIndex: 'operationTime',
                filterType: 'timeRanger',
                ellipsis: true,
                render: (text) => {
                    return text || '--';
                },
                width: 189,
            },
            {
                title: '操作人',
                dataIndex: 'operatorName',
                align: 'center',
                ellipsis: true,
                render: (text) => {
                    return text || '--';
                },
                width: 120,
            },
            {
                title: '所属组织',
                dataIndex: 'organizationName',
                ellipsis: true,
                // width: 280,
                render: (text) => {
                    return text || '--';
                },
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    return (
                        <div>
                            <a
                                onClick={() => {
                                    return this.showDetails(record.id);
                                }}>
                                详情
                            </a>
                        </div>
                    );
                },
                fixed: 'right',
                width: 68,
            },
        ];

        const {
            batchOperationSpace: { tableInfo },
            loadingSearch,
        } = this.props;
        const { data = [], pageable = {} } = tableInfo;
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
        return (
            <>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <SearchForm handleSearch={this.handleSearch} resetSearch={this.resetSearch}></SearchForm>
                </div>
                <div className="content mt12 flex-1">
                    <div className="mb12 clearfix">
                        <span className="table-title">批量操作记录</span>
                        <div className="fr">
                            <Button onClick={this.showAddForm} className="mr8" type="primary">
                                <span className="iconfont icon-add mr8 fz14"></span>批量操作
                            </Button>
                        </div>
                    </div>
                    <FilterSelectAllTable
                        rowKey={(record) => {
                            return record.id;
                        }}
                        loading={loadingSearch}
                        // bordered
                        columns={columns}
                        dataSource={data}
                        pagination={pagination}
                        onChange={this.handleTableChange}
                        scroll={{ x: 1200 }}
                        handleTableSearch={this.handleTableSearch}></FilterSelectAllTable>
                </div>
            </>
        );
    }
}

export default TableView;
