import React, { Component } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import FilterSelectAllTable from '@/components/filter-selectall-table';
import BrokenRecordDetail from './BrokenRecordDetail';

@connect(({ deviceList, loading }) => {
    return {
        deviceList,
        loadingSearch: loading.effects['deviceList/getBrokenRecordList'],
    };
})
@Form.create()
class BrokenRecordTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageInfo: {
                page: 0,
                size: 10,
            },
            searchParam: {
                deviceId: this.props.deviceList.deviceDetail.id,
            },
            filtersParam: {},
            isShowBrokenRecordDetailModal: false,
            faultType: [],
        };
    }

    componentDidMount = () => {
        this.getTableViewList(0);
        this.getTypeFilters();
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
            type: 'deviceList/getBrokenRecordList',
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
    tableChange = (pagination, tableFilters) => {
        let { filtersParam } = this.state;
        filtersParam = {
            ...filtersParam,
            ...tableFilters,
        };
        this.setState({ filtersParam }, () => {
            this.getTableViewList(pagination.current - 1, pagination.pageSize);
        });
    };

    updateDetailModalStatus = (record) => {
        if (record) {
            const { id } = record;
            this.getBrokenRecordDetail(id);
        }
        this.setState((prevState) => {
            return { isShowBrokenRecordDetailModal: !prevState.isShowBrokenRecordDetailModal };
        });
    };

    getBrokenRecordDetail = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/getBrokenRecordDetail',
            payload: {
                id,
            },
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

    handleTableSearch = (confirm, columns) => {
        confirm();
        const filtersParam = {};
        const { startValue, endValue } = columns[2].filteredValue;
        if (startValue) {
            filtersParam.breakdownEndTimebreakdownStartTime = startValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (endValue) {
            filtersParam.breakdownEndTime = endValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (columns[1].filteredValue.length > 0) {
            filtersParam.type = columns[1].filteredValue;
        }
        this.setState({ filtersParam }, () => {
            this.getTableViewList(0);
        });
    };

    render() {
        const { isShowBrokenRecordDetailModal, faultType } = this.state;
        const {
            deviceList: { brokenRecordList },
        } = this.props;
        const { data = [], pageable = {} } = brokenRecordList;
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
                title: '故障类型',
                dataIndex: 'type',
                filterType: 'multipleChoice',
                filters: faultType,
                align: 'center',
                ellipsis: true,
            },
            {
                title: '发生时间',
                dataIndex: 'breakdownTime',
                filterType: 'timeRanger',
                align: 'center',
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
                                    return this.updateDetailModalStatus(record);
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
            <div>
                <div className="mb20 clearfix">
                    <span className="table-title">设备故障记录</span>
                </div>
                {faultType && faultType.length > 0 && (
                    <FilterSelectAllTable
                        rowKey={(record) => {
                            return record.id;
                        }}
                        columns={columns}
                        dataSource={data}
                        loading={this.props.loadingSearch}
                        onChange={this.tableChange}
                        pagination={pagination}
                        scroll={{ x: 1100 }}
                        handleTableSearch={this.handleTableSearch}></FilterSelectAllTable>
                )}
                {isShowBrokenRecordDetailModal && <BrokenRecordDetail updateDetailModalStatus={this.updateDetailModalStatus}></BrokenRecordDetail>}
            </div>
        );
    }
}

export default BrokenRecordTable;
