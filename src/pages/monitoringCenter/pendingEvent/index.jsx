import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/breadcrumb';
import { Form, Button } from 'antd';
import filters from '@/filters/index';
import enums from '@/i18n/zh-CN/zhCN';
import FilterSelectAllTable from '@/components/filter-selectall-table';
import SearchForm from './components/SearchForm';
import BatchDisposeItem from './components/BatchDisposeItem';
import DisposeItem from './components/DisposeItem';
import styles from './style.less';

@connect(({ pendingEventSpace, areaCity, loading }) => {
    return {
        pendingEventSpace,
        areaCity,
        loading,
    };
})
@Form.create()
class Curd extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            condition: {},
            dataSource: [],
            pagination: {
                pageSize: 10,
                current: 0,
                total: 0,
            },
            batchHandleVisible: false,
            disposeVisible: false,
            filteredInfo: {}, // 筛选数据
            filtersParam: {},
            batchDisposeRecord: [], // 批量处理
            disposeRecord: {}, // 单个处理
            ids: [], //批量处理
        };
    }

    componentDidMount() {
        this.searchList(0);
    }

    searchList = (page, size) => {
        const { dispatch } = this.props;
        const { condition, pagination, filteredInfo, filtersParam } = this.state;
        const value = {
            page,
            size: size || pagination.pageSize,
            ...condition,
            ...filtersParam,
            operationTypeList: filteredInfo.type,
        };
        dispatch({
            type: 'pendingEventSpace/getTableListInfo',
            payload: {
                ...value,
            },
            callback: (response) => {
                this.setState({
                    pagination: {
                        showTotal: () => {
                            return (
                                <span
                                    style={{
                                        marginRight: 15,
                                        fontSize: '14px',
                                    }}>
                                    共<a>{response.pageable.totalElements}</a>条
                                </span>
                            );
                        },
                        total: response.pageable.totalElements,
                        pageSize: response.pageable.size,
                        current: response.pageable.number + 1,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '30', '40', '100'],
                    },
                    dataSource: response.data,
                });
            },
        });
    };

    handleSearch = (value) => {
        this.setState(
            {
                condition: value,
            },
            () => {
                this.searchList(0);
            },
        );
    };

    reset = () => {
        this.setState({
            condition: {},
            filtersParam: {},
            filteredInfo: {},
        });
    };

    handleTableChange = (pagination, filterList) => {
        this.setState(
            {
                filteredInfo: filterList,
            },
            () => {
                this.searchList(pagination.current - 1, pagination.pageSize);
            },
        );
    };

    handleTableSearch = (confirm, columns) => {
        confirm();

        const filtersParam = {};
        const { startValue, endValue } = columns[5].filteredValue;
        if (startValue) {
            filtersParam.startTime = startValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (endValue) {
            filtersParam.endTime = endValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (columns[4].filteredValue.length > 0) {
            filtersParam.eventTypeList = columns[4].filteredValue;
        }

        this.setState({ filtersParam }, () => {
            this.searchList(0);
        });
    };

    // 单个处理弹窗
    disposeItem = (record) => {
        this.setState((prevState) => {
            return {
                disposeVisible: !prevState.disposeVisible,
                disposeRecord: record,
            };
        });
    };

    okDispose = () => {
        this.setState(
            (prevState) => {
                return {
                    disposeVisible: !prevState.disposeVisible,
                };
            },
            () => {
                this.searchList(0);
            },
        );
    };

    // 批量处理弹框
    batchDisposeItem = (record) => {
        this.setState((prevState) => {
            return {
                batchHandleVisible: !prevState.batchHandleVisible,
                batchDisposeRecord: record,
            };
        });
    };

    okBatchDispose = () => {
        this.setState(
            (prevState) => {
                return {
                    batchHandleVisible: !prevState.batchHandleVisible,
                };
            },
            () => {
                this.searchList(0);
            },
        );
    };

    getTypeFilters = () => {
        const typeArray = [];
        enums.eventType.map((item) => {
            const typeItem = {};
            typeItem.label = item.name;
            typeItem.value = item.code;
            typeArray.push(typeItem);
        });
        return typeArray;
    };

    render() {
        const { batchHandleVisible, disposeVisible, batchDisposeRecord, disposeRecord, dataSource, ids } = this.state;
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                width: 68,
                align: 'center',
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                },
                fixed: 'left',
            },
            {
                title: '设备编码',
                dataIndex: 'no',
                ellipsis: true,
            },
            {
                title: '所属客户',
                dataIndex: 'customerName',
                ellipsis: true,
            },
            {
                title: '地理位置',
                dataIndex: 'areaName',
                ellipsis: true,
            },
            {
                title: '事件类型',
                dataIndex: 'type',
                filterType: 'multipleChoice',
                filters: this.getTypeFilters(),
                ellipsis: true,
                render: (text) => {
                    return filters.deviceFilter(text);
                },
            },
            {
                title: '发生时间',
                dataIndex: 'eventTime',
                filterType: 'timeRanger',
                width: 189,
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
                                    return this.disposeItem(record);
                                }}>
                                处理
                            </a>
                        </div>
                    );
                },
                fixed: 'right',
                width: 68,
            },
        ];

        const rowSelection = {
            onChange: (selectedRowKeys) => {
                this.setState({
                    ids: selectedRowKeys,
                });
            },
        };

        return (
            <div className={styles['pending-event']}>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <SearchForm handleSearch={this.handleSearch} reset={this.reset}></SearchForm>
                </div>
                <div className="content mt12">
                    <div className="mb12 clearfix">
                        <span className="table-title">待处理事件</span>
                        {ids && ids.length > 0 && (
                            <Button
                                className="fr"
                                icon="hourglass"
                                onClick={() => {
                                    return this.batchDisposeItem();
                                }}
                                type="primary">
                                批量处理
                            </Button>
                        )}
                    </div>
                    <FilterSelectAllTable
                        rowKey={(record) => {
                            return record.id;
                        }}
                        columns={columns}
                        dataSource={dataSource}
                        loading={this.props.loading.effects['pendingEventSpace/getTableListInfo']}
                        onChange={this.handleTableChange}
                        pagination={this.state.pagination}
                        rowSelection={rowSelection}
                        scroll={{ x: 1200 }}
                        handleTableSearch={this.handleTableSearch}></FilterSelectAllTable>
                </div>
                {batchHandleVisible && <BatchDisposeItem ids={ids} batchDisposeRecord={batchDisposeRecord} batchHandle={this.batchDisposeItem} okBatchDispose={this.okBatchDispose} cancleBatchDispose={this.batchDisposeItem}></BatchDisposeItem>}
                {disposeVisible && <DisposeItem disposeRecord={disposeRecord} disposeItem={this.disposeItem} okDispose={this.okDispose} cancleDispose={this.disposeItem}></DisposeItem>}
            </div>
        );
    }
}

export default Curd;
