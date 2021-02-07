import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/breadcrumb';
import { Form } from 'antd';
import enums from '@/i18n/zh-CN/zhCN';
import FilterSelectAllTable from '@/components/filter-selectall-table';
import SearchForm from './components/SearchForm';
import DetailForm from './components/DetailForm';

@connect(({ repairsRecords, loading }) => {
    return {
        repairsRecords,
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
            detailRecord: {}, // 详情数据
        };
    }

    componentDidMount() {
        this.searchList(0);
    }

    searchList = (page, size) => {
        const { dispatch } = this.props;
        const { condition, pagination, filtersParam } = this.state;
        const value = {
            ...condition,
            ...filtersParam,
            size: size || pagination.pageSize,
            page,
        };
        dispatch({
            type: 'repairsRecords/getTableListInfo',
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
            filtersParam: {},
        });
    };

    handleTableChange = (pagination) => {
        this.searchList(pagination.current - 1, pagination.pageSize);
    };

    handleTableSearch = (confirm, columns) => {
        confirm();

        const filtersParam = {};
        const { startValue, endValue } = columns[6].filteredValue;
        if (startValue) {
            filtersParam.startTime = startValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (endValue) {
            filtersParam.endTime = endValue.format('YYYY-MM-DD HH:mm:ss');
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

    // 详情弹窗
    disposeItem = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'repairsRecords/getDetailList',
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

    // 关闭详情弹窗
    cancleDispose = () => {
        this.setState((prevState) => {
            return {
                detailVisible: !prevState.detailVisible,
            };
        });
    };

    getTypeFilters = () => {
        const typeArray = [];
        enums.deviceTroubleType.map((item) => {
            const typeItem = {};
            typeItem.text = item.name;
            typeItem.value = item.code;
            typeArray.push(typeItem);
        });
        return typeArray;
    };

    render() {
        const { detailRecord, dataSource, detailVisible } = this.state;
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
                fixed: 'left',
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
                title: '联系人',
                dataIndex: 'contactName',
                width: 150,
                ellipsis: true,
            },
            {
                title: '联系电话',
                dataIndex: 'contactMobile',
                width: 189,
                ellipsis: true,
            },
            {
                title: '报修时间',
                dataIndex: 'repairTime',
                filterType: 'timeRanger',
                width: 189,
                align: 'center',
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
            <>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <SearchForm handleSearch={this.handleSearch} resetSearch={this.resetSearch}></SearchForm>
                </div>
                <div className="content mt12 flex-1">
                    <div className="mb12 clearfix">
                        <span className="table-title">报修记录</span>
                    </div>
                    <FilterSelectAllTable
                        columns={columns}
                        dataSource={dataSource}
                        rowKey={(record) => {
                            return record.id;
                        }}
                        loading={this.props.loading.effects['repairsRecords/getTableListInfo']}
                        onChange={this.handleTableChange}
                        pagination={this.state.pagination}
                        scroll={{ x: 1300 }}
                        handleTableSearch={this.handleTableSearch}></FilterSelectAllTable>
                </div>
                {detailVisible && <DetailForm detailRecord={detailRecord} disposeItem={this.disposeItem} cancleDispose={this.cancleDispose}></DetailForm>}
            </>
        );
    }
}

export default Curd;
