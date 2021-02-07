import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/breadcrumb';
import Export from '@/utils/export';
import Api from '@/utils/api';
import { Form, Button } from 'antd';
import filters from '@/filters/index';
import enums from '@/i18n/zh-CN/zhCN';
import SearchForm from './components/SearchForm';
import FilterSelectAllTable from '@/components/filter-selectall-table';
import styles from './style.less';
import DetailForm from './components/DetailForm';
import moment from 'moment';

@connect(({ processedEventSpace, loading }) => {
    return {
        processedEventSpace,
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
            detailVisible: false,
            filtersParam: {},
        };
    }

    componentDidMount() {
        this.searchList(0);
    }

    searchList = (page, size) => {
        const { dispatch } = this.props;
        const { condition, pagination, filtersParam } = this.state;
        const value = {
            page,
            size: size || pagination.pageSize,
            ...condition,
            ...filtersParam,
        };
        dispatch({
            type: 'processedEventSpace/getTableList',
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
        const happenStart = columns[5].filteredValue.startValue;
        const happenEnd = columns[5].filteredValue.endValue;
        const disposeStart = columns[7].filteredValue.startValue;
        const disposeEnd = columns[7].filteredValue.endValue;
        if (happenStart) {
            filtersParam.eventTimeStart = happenStart.format('YYYY-MM-DD HH:mm:ss');
        }
        if (happenEnd) {
            filtersParam.eventTimeEnd = happenEnd.format('YYYY-MM-DD HH:mm:ss');
        }
        if (disposeStart) {
            filtersParam.operationTimeStart = disposeStart.format('YYYY-MM-DD HH:mm:ss');
        }
        if (disposeEnd) {
            filtersParam.operationTimeEnd = disposeEnd.format('YYYY-MM-DD HH:mm:ss');
        }
        if (columns[4].filteredValue.length > 0) {
            filtersParam.eventTypeList = columns[4].filteredValue;
        }
        if (columns[6].filteredValue.length > 0) {
            filtersParam.resultEnum = columns[6].filteredValue;
        }

        this.setState({ filtersParam }, () => {
            this.searchList(0);
        });
    };

    // 详情弹窗
    detailForm = (record) => {
        this.setState((prevState) => {
            return {
                detailVisible: !prevState.detailVisible,
                detailRecord: record,
            };
        });
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

    getResultFilters = () => {
        const typeArray = [];
        enums.results.map((item) => {
            const typeItem = {};
            typeItem.label = item.name;
            typeItem.value = item.code;
            typeArray.push(typeItem);
        });
        return typeArray;
    };

    // 导出
    export = () => {
        const { condition } = this.state;
        const date = moment().format('YYYY-MM-DD HHmmss');
        Export.exportAsset(`已处理事件${date}.xlsx`, `/bioec/w/deviceEvent/export${Api.bodyToParm(condition)}`);
    };

    render() {
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
                render: (text) => {
                    return filters.deviceFilter(text);
                },
                ellipsis: true,
            },
            {
                title: '发生时间',
                dataIndex: 'eventTime',
                filterType: 'timeRanger',
                width: 189,
                ellipsis: true,
            },
            {
                title: '处理结果',
                dataIndex: 'handleResult',
                filterType: 'multipleChoice',
                filters: this.getResultFilters(),
                render: (text) => {
                    return filters.resultFilter(text);
                },
                width: 150,
                ellipsis: true,
            },
            {
                title: '处理时间',
                dataIndex: 'operationTime',
                filterType: 'timeRanger',
                width: 180,
                ellipsis: true,
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    return (
                        <div>
                            <a
                                onClick={() => {
                                    return this.detailForm(record);
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
        const { dataSource, detailVisible, detailRecord } = this.state;
        return (
            <div className={styles['processed-event']}>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <SearchForm handleSearch={this.handleSearch} resetSearch={this.resetSearch}></SearchForm>
                </div>
                <div className="content mt12">
                    <div className="mb12 clearfix">
                        <span className="table-title">已处理事件</span>
                        <div className="fr">
                            <Button onClick={this.export}>
                                <span className="iconfont icon-export mr8 fz14"></span>导出
                            </Button>
                        </div>
                    </div>
                    <FilterSelectAllTable
                        columns={columns}
                        dataSource={dataSource}
                        rowKey={(record) => {
                            return record.id;
                        }}
                        loading={this.props.loading.effects['processedEventSpace/getTableList']}
                        onChange={this.handleTableChange}
                        pagination={this.state.pagination}
                        scroll={{ x: 1400 }}
                        handleTableSearch={this.handleTableSearch}></FilterSelectAllTable>
                </div>
                {detailVisible && <DetailForm detailRecord={detailRecord} detailForm={this.detailForm}></DetailForm>}
            </div>
        );
    }
}

export default Curd;
