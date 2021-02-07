import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import Export from '@/utils/export';
import Api from '@/utils/api';
import { Table, Button, Form, Icon } from 'antd';
import { HxRangePicker } from '@/components/hx-components';
import { connect } from 'dva';
import { router } from 'umi';
import filters from '@/filters/index';
import moment from 'moment';
import enums from '@/i18n/zh-CN/zhCN';
import SearchForm from './components/SearchForm';
import styles from './index.less';
import FilterSelectAllTable from '@/components/filter-selectall-table';

@connect(({ deviceList, loading }) => {
    return {
        deviceList,
        loadingSearch: loading.effects['deviceList/getDeviceList'],
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
            activeTime: [],
            seriesTreeData: [],
        };
    }

    componentDidMount = () => {
        // 获取系列型号下拉树
        this.getSeriesTree();
        // 获取当前用户所属组织直属客户、下级组织客户
        this.getCustomerList();
        this.getTableViewList();
    };

    getSeriesTree = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/getSeriesTree',
            callback: () => {
                const {
                    deviceList: { seriesTree = [] },
                } = this.props;
                const seriesTreeData = this.changeDataToTreeSelect(seriesTree, '');
                this.setState({ seriesTreeData });
            },
        });
    };

    getCustomerList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/getCustomerList',
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
            type: 'deviceList/getDeviceList',
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
        router.push(`/equipmentManagement/deviceList/deviceDetail?id=${id}`);
    };

    export = () => {
        const { searchParam } = this.state;
        Export.exportAsset('设备列表.xlsx', `/bioec/w/device/export${Api.bodyToParm(searchParam)}`);
    };

    getTypeFilters = () => {
        const typeArray = [];
        enums.deviceStatus.map((item) => {
            const typeItem = {};
            typeItem.label = item.name;
            typeItem.value = item.code;
            typeArray.push(typeItem);
        });
        return typeArray;
    };

    handleTableSearch = (confirm, columns) => {
        confirm();
        let filtersParam = {};
        const { startValue, endValue } = columns[7].filteredValue;
        if (startValue) {
            filtersParam.activeStartTime = startValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (endValue) {
            filtersParam.activeEndTime = endValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (columns[4].filteredValue.length > 0) {
            filtersParam.status = columns[4].filteredValue;
        }
        this.setState({ filtersParam }, () => {
            this.getTableViewList(0);
        });
    };

    render() {
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
        const { seriesTreeData } = this.state;
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
                fixed: 'left',
                width: 200,
                ellipsis: true,
            },
            {
                title: '系列型号',
                dataIndex: 'seriesName',
                ellipsis: true,
                width: 250,
            },
            {
                title: '所属客户',
                dataIndex: 'customerName',
                ellipsis: true,
                width: 250,
            },
            {
                title: '设备状态',
                dataIndex: 'status',
                filters: this.getTypeFilters(),
                render: (text) => {
                    return filters.deviceStatusFilter(text);
                },
                filterType: 'multipleChoice',
                width: 150,
                align: 'center',
                ellipsis: true,
            },
            {
                title: '运行监测',
                dataIndex: 'runningStatus',
                render: (text) => {
                    return filters.runningStatusFilter(text);
                },
                width: 150,
                align: 'center',
                ellipsis: true,
            },
            {
                title: '管理状态',
                dataIndex: 'managementStatus',
                render: (text) => {
                    return filters.managementStatusFilter(text);
                },
                width: 150,
                align: 'center',
                ellipsis: true,
            },
            {
                title: '激活时间',
                dataIndex: 'activeTime',
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
                                    return this.toDetail(record);
                                }}>
                                管理
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
                    <SearchForm handleSearch={this.handleSearch} resetSearch={this.resetSearch} seriesTreeData={seriesTreeData}></SearchForm>
                </div>
                <div className="content mt20 flex-1">
                    <div className="mb20 clearfix">
                        <span className="table-title">设备列表</span>
                        <div className="fr">
                            <Button onClick={this.export} className="mr8">
                                <span className="iconfont icon-export mr8 fz14"></span>导出
                            </Button>
                        </div>
                    </div>
                    <FilterSelectAllTable
                        columns={columns}
                        dataSource={data}
                        rowKey={(record) => {
                            return record.id;
                        }}
                        loading={this.props.loadingSearch}
                        onChange={this.tableChange}
                        pagination={pagination}
                        scroll={{ x: 1100 }}
                        handleTableSearch={this.handleTableSearch}></FilterSelectAllTable>
                </div>
            </>
        );
    }
}

export default TableView;
