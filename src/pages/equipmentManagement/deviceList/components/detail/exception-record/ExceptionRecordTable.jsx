import React, { Component } from 'react';
import { Table, Button, Form, Icon } from 'antd';
import { HxRangePicker } from '@/components/hx-components';
import { connect } from 'dva';
import filters from '@/filters/index';
import enums from '@/i18n/zh-CN/zhCN';
import ExceptionRecordDetail from './ExceptionRecordDetail';
import FilterSelectAllTable from '@/components/filter-selectall-table';

@connect(({ deviceList, loading }) => {
    return {
        deviceList,
        loadingSearch: loading.effects['deviceList/getExceptionRecordList'],
    };
})
@Form.create()
class ExceptionRecordTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageInfo: {
                page: 0,
                size: 10,
            },
            searchParam: {},
            isShowExceptionRecordDetailModal: false,
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
            type: 'deviceList/getExceptionRecordList',
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

    updateDetailModalStatus = (record) => {
        if (record) {
            const { id } = record;
            this.getExceptionRecordDetail(id);
        }
        this.setState((prevState) => {
            return { isShowExceptionRecordDetailModal: !prevState.isShowExceptionRecordDetailModal };
        });
    };

    getColumnSearchProps = (dataIndex) => {
        return {
            filterDropdown: ({ selectedKeys, confirm }) => {
                return (
                    <div style={{ padding: 8 }}>
                        <HxRangePicker
                            ref={(node) => {
                                this.searchInput = node;
                            }}></HxRangePicker>
                        <div className="mt8 text-right">
                            <Button
                                type="primary"
                                onClick={() => {
                                    return this.handleSearch(selectedKeys, confirm, dataIndex);
                                }}>
                                确定
                            </Button>
                        </div>
                    </div>
                );
            },
            filterIcon: (filtered) => {
                return <Icon type="clock-circle" style={{ color: filtered ? '#1890ff' : undefined }} />;
            },
        };
    };

    getExceptionRecordDetail = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/getExceptionRecordDetail',
            payload: {
                id,
            },
        });
    };

    getTypeFilters = () => {
        const typeArray = [];
        enums.deviceExceptionType.map((item) => {
            const typeItem = {};
            typeItem.text = item.name;
            typeItem.value = item.code;
            typeArray.push(typeItem);
        });
        return typeArray;
    };

    render() {
        const { isShowExceptionRecordDetailModal } = this.state;
        const {
            deviceList: { deviceList },
        } = this.props;
        const { data = [], pageable = {} } = deviceList;
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
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                width: 68,
                align: 'center',
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                },
            },
            {
                title: '异常类型',
                dataIndex: 'type',
                filters: this.getTypeFilters(),
                render: (text) => {
                    return filters.deviceExceptionTypeFilter(text);
                },
            },
            {
                title: '发生时间',
                dataIndex: 'abnormalTime',
                ...this.getColumnSearchProps('time'),
            },
            {
                title: '操作',
                dataIndex: 'id',
                render: (text, record) => {
                    return (
                        <div>
                            <a
                                onClick={() => {
                                    return this.updateDetailModalStatus(record);
                                }}>
                                详情
                            </a>
                        </div>
                    );
                },
                fixed: 'right',
                width: 120,
            },
        ];
        return (
            <div>
                <div className="mb20 clearfix">
                    <span className="table-title">异常通行记录</span>
                </div>
                <Table
                    rowKey={(record) => {
                        return record.id;
                    }}
                    loading={this.props.loadingSearch}
                    scroll={{ x: 1100 }}
                    columns={columns}
                    dataSource={data}
                    pagination={pagination}
                    onChange={this.tableChange}></Table>
                {isShowExceptionRecordDetailModal && <ExceptionRecordDetail updateDetailModalStatus={this.updateDetailModalStatus}></ExceptionRecordDetail>}
            </div>
        );
    }
}

export default ExceptionRecordTable;
