import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/breadcrumb';
import Export from '@/utils/export';
import Api from '@/utils/api';
import { Form, Button } from 'antd';
import FilterSelectAllTable from '@/components/filter-selectall-table';
import moment from 'moment';
import SearchForm from './components/SearchForm';
import DetailForm from './components/DetailForm';
import styles from './style.less';

@connect(({ equipmentFailureRecord, loading }) => {
    return {
        equipmentFailureRecord,
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
            detailVisible: false,
            filtersParam: {}, // 事件参数
            detailRecord: {}, // 详情数据
            faultType: [],
        };
    }

    componentDidMount() {
        this.searchList(0);
        this.getTypeFilters();
    }

    searchList = (page, size) => {
        const { dispatch } = this.props;
        const { condition, pagination, filtersParam } = this.state;
        const value = {
            ...condition,
            size: size || pagination.pageSize,
            page,
            ...filtersParam,
        };
        dispatch({
            type: 'equipmentFailureRecord/getTableListInfo',
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

    resetSearch = () => {
        this.setState({
            condition: {},
        });
    };

    handleTableChange = (pagination) => {
        this.searchList(pagination.current - 1, pagination.pageSize);
    };

    handleTableSearch = (confirm, columns) => {
        confirm();

        const filtersParam = {};
        const { startValue, endValue } = columns[5].filteredValue;
        if (startValue) {
            filtersParam.breakdownStartTime = startValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (endValue) {
            filtersParam.breakdownEndTime = endValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (columns[4].filteredValue.length > 0) {
            filtersParam.typeList = columns[4].filteredValue;
        }

        this.setState({ filtersParam }, () => {
            this.searchList(0);
        });
    };

    // 批量处理弹框
    batchHandle = () => {
        this.setState((prevState) => {
            return {
                batchHandleVisible: !prevState.batchHandleVisible,
            };
        });
    };

    // 单个处理弹窗
    disposeItem = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'equipmentFailureRecord/getDetailList',
            payload: {
                id: record.id,
            },
            callback: (response) => {
                this.setState((prevState) => {
                    return {
                        detailRecord: response.data,
                        detailVisible: !prevState.detailVisible,
                    };
                });
            },
        });
    };

    cancleDispose = () => {
        this.setState((prevState) => {
            return {
                detailVisible: !prevState.detailVisible,
            };
        });
    };

    getTypeFilters = () => {
        const { dispatch } = this.props;
        const typeArray = [];
        dispatch({
            type: 'dataDictionarySpace/getDictionaryItemList',
            payload: {
                code: 'SBGZLX',
            },
            callback: (res) => {
                if (res.data && res.data.length > 0) {
                    res.data.map((item) => {
                        const typeItem = {};
                        typeItem.label = item.name;
                        typeItem.value = item.code;
                        typeArray.push(typeItem);
                    });
                }
                this.setState({
                    faultType: typeArray,
                });
            },
        });
    };

    // 导出
    export = () => {
        const { searchParam } = this.state;
        const now = moment(new Date()).format('YYYY-MM-DD HHmmss');
        Export.exportAsset(`设备故障记录${now}.xlsx`, `/bioec/w/deviceBreakdownRecord/export${Api.bodyToParm(searchParam)}`);
    };

    render() {
        const { detailRecord, dataSource, detailVisible, faultType } = this.state;
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
                title: '设备编码',
                dataIndex: 'no',
                ellipsis: true,
                fixed: 'left',
                render: (text) => {
                    return text || '--';
                },
            },
            {
                title: '所属客户',
                dataIndex: 'customerName',
                ellipsis: true,
                render: (text) => {
                    return text || '--';
                },
            },
            {
                title: '地理位置',
                dataIndex: 'location',
                ellipsis: true,
                render: (text) => {
                    return text || '--';
                },
            },
            {
                title: '故障类型',
                dataIndex: 'type',
                filterType: 'multipleChoice',
                filters: faultType,
                ellipsis: true,
                width: 150,
                // render: (text) => {
                //     return filters.deviceTroubleTypeFilter(text) || '--';
                // },
            },
            {
                title: '发生时间',
                dataIndex: 'breakdownTime',
                filterType: 'timeRanger',
                width: 189,
                align: 'center',
                ellipsis: true,
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
                                    return this.disposeItem(record);
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
        return (
            <div className={styles['equipment-record']}>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <SearchForm handleSearch={this.handleSearch} resetSearch={this.resetSearch}></SearchForm>
                </div>
                <div className="content mt12">
                    <div className="mb12 clearfix">
                        <span className="table-title">设备故障记录</span>
                        <div className="fr">
                            <Button onClick={this.export}>
                                <span className="iconfont icon-export mr8 fz14"></span>导出
                            </Button>
                        </div>
                    </div>
                    {faultType && faultType.length > 0 && (
                        <FilterSelectAllTable
                            columns={columns}
                            dataSource={dataSource}
                            rowKey={(record) => {
                                return record.id;
                            }}
                            loading={this.props.loading.effects['equipmentFailureRecord/getTableListInfo']}
                            onChange={this.handleTableChange}
                            pagination={this.state.pagination}
                            scroll={{ x: 1200 }}
                            handleTableSearch={this.handleTableSearch}></FilterSelectAllTable>
                    )}
                </div>
                {detailVisible && <DetailForm detailRecord={detailRecord} disposeItem={this.disposeItem} okDispose={this.cancleDispose} cancleDispose={this.cancleDispose}></DetailForm>}
            </div>
        );
    }
}

export default Curd;
