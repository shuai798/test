import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import Export from '@/utils/export';
import { Button, Form } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import moment from 'moment';
import FilterSelectAllTable from '@/components/filter-selectall-table';
import SearchForm from './components/SearchForm';
import AddDeviceCodeBatch from './components/AddDeviceCodeBatch';

@connect(({ deviceCodeManagement, loading }) => {
    return {
        deviceCodeManagement,
        loadingSearch: loading.effects['deviceCodeManagement/getDeviceCodeBatchList'],
    };
})
@Form.create()
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
            seriesTreeData: [],
            isShowAddDeviceCodeBatchModal: false,
        };
    }

    componentDidMount = () => {
        // 获取系列型号下拉树
        this.getSeriesTree();
        this.getTableViewList();
    };

    getSeriesTree = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceCodeManagement/getSeriesTree',
            callback: () => {
                const {
                    deviceCodeManagement: { seriesTree = [] },
                } = this.props;
                const seriesTreeData = this.changeDataToTreeSelect(seriesTree, '');
                this.setState({ seriesTreeData });
            },
        });
    };

    changeDataToTreeSelect = (dataList, name) => {
        const list = dataList;
        if (list.length > 0) {
            for (let i = 0; i < list.length; i += 1) {
                list[i].value = list[i].id;
                list[i].title = list[i].name;
                // 用于回显全路径
                list[i].newValue = name !== '' ? `${name} / ${list[i].name}` : list[i].name;
                if (list[i].children && list[i].children.length > 0) {
                    list[i].children = this.changeDataToTreeSelect(list[i].children, list[i].newValue);
                } else {
                    list[i].children = null;
                }
            }
        }
        return list;
    };

    updateAddDeviceCodeBatchModalStatus = () => {
        this.setState((prevState) => {
            return { isShowAddDeviceCodeBatchModal: !prevState.isShowAddDeviceCodeBatchModal };
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
            type: 'deviceCodeManagement/getDeviceCodeBatchList',
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

    toDetail = (record) => {
        const { id } = record;
        router.push(`/equipmentManagement/deviceCodeManagement/deviceDetail?id=${id}`);
    };

    export = (record) => {
        const { id } = record;
        const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        Export.exportAsset(`批次生成记录${now}.xlsx`, `/bioec/w/deviceNoBatch/export?deviceNoBatchId=${id}`);
    };

    handleTableSearch = (confirm, columns) => {
        confirm();
        const filtersParam = {};
        const { startValue, endValue } = columns[4].filteredValue;
        if (startValue) {
            filtersParam.buildStartTime = startValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (endValue) {
            filtersParam.buildEndTime = endValue.format('YYYY-MM-DD HH:mm:ss');
        }
        this.setState({ filtersParam }, () => {
            this.getTableViewList(0);
        });
    };

    render() {
        const {
            deviceCodeManagement: { deviceCodeBatchList },
        } = this.props;
        const { data = [], pageable = {} } = deviceCodeBatchList;
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
        const { seriesTreeData, isShowAddDeviceCodeBatchModal } = this.state;
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
                title: '系列型号',
                dataIndex: 'seriesName',
                ellipsis: true,
            },
            {
                title: '编码数量',
                dataIndex: 'noNum',
                align: 'right',
                width: 150,
                ellipsis: true,
            },
            {
                title: '编码范围',
                dataIndex: 'firstNo',
                ellipsis: true,
                render: (text, record) => {
                    return `${record.firstNo}~${record.lastNo}`;
                },
            },
            {
                title: '生成时间',
                dataIndex: 'createdTime',
                filterType: 'timeRanger',
                width: 189,
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
                                    return this.export(record);
                                }}>
                                下载编码文件
                            </a>
                        </div>
                    );
                },
                fixed: 'right',
                width: 120,
            },
        ];
        return (
            <>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <SearchForm handleSearch={this.handleSearch} resetSearch={this.resetSearch} seriesTreeData={seriesTreeData}></SearchForm>
                </div>
                <div className="content mt20 flex-1">
                    <div className="mb20 clearfix">
                        <span className="table-title">批次生成记录</span>
                        <div className="fr">
                            <Button onClick={this.updateAddDeviceCodeBatchModalStatus} className="mr8" type="primary">
                                <span className="iconfont icon-add mr8 fz14"></span>批次
                            </Button>
                        </div>
                    </div>
                    <FilterSelectAllTable
                        rowKey={(record) => {
                            return record.id;
                        }}
                        columns={columns}
                        dataSource={data}
                        loading={this.props.loadingSearch}
                        onChange={this.tableChange}
                        pagination={pagination}
                        scroll={{ x: 1200 }}
                        handleTableSearch={this.handleTableSearch}></FilterSelectAllTable>
                </div>
                {isShowAddDeviceCodeBatchModal && <AddDeviceCodeBatch getTableViewList={this.getTableViewList} seriesTreeData={seriesTreeData} updateAddDeviceCodeBatchModalStatus={this.updateAddDeviceCodeBatchModalStatus}></AddDeviceCodeBatch>}
            </>
        );
    }
}

export default TableView;
