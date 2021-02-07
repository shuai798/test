import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { connect } from 'dva';
import { Button, Divider, Table } from 'antd';
import filters from '@/filters/index';
import zhCN from '@/i18n/zh-CN/zhCN';
import Export from '@/utils/export';
import moment from 'moment';
import FilterSelectAllTable from '@/components/filter-selectall-table';
import SearchForm from './components/SearchForm';
import Add from './components/Add';

@connect(({ loading, customerManagement }) => {
    return {
        customerManagement,
        loadingSearch: loading.effects['customerManagement/getTableListInfo'],
        zhCN,
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
            showAddModal: false, // 是否展示新增模态框
            userInfo: '',
            industryList: [], // 行业类型
            staffSizeListAll: [], // 人员规模
        };
    }

    componentDidMount = () => {
        //获取行业类型
        this.getIndustryTypeList();
        //获取人员规模
        this.getStaffSizeList();
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.setState(
            {
                userInfo,
            },
            () => {
                this.getTableViewList(0);
            },
        );
    };

    //获取人员规模
    getStaffSizeList = () => {
        const { staffSizeListAll } = this.state;
        const { staffSizeType } = this.props.zhCN;
        if (staffSizeType.length > 0) {
            for (let i = 0; i < staffSizeType.length; i += 1) {
                staffSizeListAll.push({
                    value: staffSizeType[i].code,
                    label: staffSizeType[i].name,
                });
            }
        }
        this.setState({
            staffSizeListAll,
        });
    };

    getTableViewList = (page, size) => {
        const { dispatch } = this.props;
        const { pageInfo, searchParam, userInfo } = this.state;
        const { orgId } = userInfo;
        let flag = 0;
        if (page || page === 0) {
            pageInfo.page = page;
            flag = 1;
        }
        if (size) {
            pageInfo.size = size;
            flag = 1;
        }
        if (!searchParam.orgId) {
            dispatch({
                type: 'customerManagement/getTableListInfo',
                payload: {
                    ...pageInfo,
                    ...searchParam,
                    orgId,
                },
            });
        } else {
            dispatch({
                type: 'customerManagement/getTableListInfo',
                payload: {
                    ...pageInfo,
                    ...searchParam,
                },
            });
        }
        if (flag) {
            this.setState({
                pageInfo,
            });
        }
    };

    // 获取行业类型
    getIndustryTypeList = () => {
        const { dispatch } = this.props;
        const { industryList } = this.state;

        dispatch({
            type: 'customerManagement/getIndustryTypeList',
            payload: {
                code: 'HYLX',
            },
            callback: (res) => {
                if (res.data.length > 0) {
                    for (let i = 0; i < res.data.length; i += 1) {
                        industryList.push({
                            value: res.data[i].code,
                            label: res.data[i].name,
                        });
                    }
                }
                this.setState({
                    industryList,
                });
            },
        });
    };

    // 点击下一页 或者切换某页，选择每页条数
    tableChange = (pagination) => {
        this.getTableViewList(pagination.current - 1, pagination.pageSize);
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

    // 新增
    toAddForm = () => {
        this.setState(
            (preState) => {
                return {
                    showAddModal: !preState.showAddModal,
                };
            },
            () => {
                this.getTableViewList(0);
            },
        );
    };

    // 显示详情框
    showDetails = (id) => {
        this.props.history.push(`/customerManagement/details?id=${id}`);
    };

    // 显示设置框
    settingShow = (id) => {
        this.props.history.push(`/customerManagement/setting?id=${id}`);
    };

    getIndustryTypeName = (code) => {
        const {
            customerManagement: { industryTypeList },
        } = this.props;
        let industryTypeName = '';
        (industryTypeList || []).map((item) => {
            if (item.code === code) {
                industryTypeName = item.name;
            }
        });
        return industryTypeName;
    };

    handleTableSearch = (confirm, columns) => {
        confirm();
        const { dispatch } = this.props;
        const { searchParam, userInfo } = this.state;
        const { orgId } = userInfo;
        const industryTypeList = columns[2].filteredValue || [];
        const staffSizeList = columns[3].filteredValue || [];

        dispatch({
            type: 'customerManagement/getTableListInfo',
            payload: {
                industryTypeList: industryTypeList.length > 0 ? industryTypeList : null,
                staffSizeList: staffSizeList.length > 0 ? staffSizeList : null,
                orgId: searchParam.orgId ? searchParam.orgId : orgId,
            },
        });
    };

    // 导出
    export = () => {
        const data = new Date();
        Export.exportAsset(`客户列表 ${moment(data).format('YYYY-MM-DD HHmmss')}.xlsx`, '/bioec/w/customer/export');
    };

    render() {
        const { showAddModal, userInfo, industryList, staffSizeListAll } = this.state;
        const {
            customerManagement: { tableInfo },
            loadingSearch,
        } = this.props;
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
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                },
                align: 'center',
                fixed: 'left',
            },
            {
                title: '客户名称',
                dataIndex: 'name',
                render: (text) => {
                    return text || '--';
                },
                ellipsis: true,
            },
            {
                title: '行业类型',
                dataIndex: 'industryType',
                filterType: 'multipleChoice',
                filters: industryList,
                render: (text) => {
                    return this.getIndustryTypeName(text);
                },
                ellipsis: true,
            },
            {
                title: '人员规模',
                dataIndex: 'staffSize',
                filterType: 'multipleChoice',
                filters: staffSizeListAll,
                render: (text) => {
                    return filters.staffSizeTypeFilter(text);
                },
                ellipsis: true,
            },
            {
                title: '所属组织',
                dataIndex: 'organizationName',
                render: (text) => {
                    return text || '--';
                },
                ellipsis: true,
            },
            {
                title: '操作',
                dataIndex: 'operate',
                render: (text, record) => {
                    return (
                        <div>
                            <a
                                onClick={() => {
                                    return this.showDetails(record.id);
                                }}>
                                详情
                            </a>
                            <Divider type="vertical"></Divider>
                            <a
                                onClick={() => {
                                    return this.settingShow(record.id);
                                }}>
                                设置
                            </a>
                        </div>
                    );
                },
                fixed: 'right',
                width: 118,
            },
        ];
        return (
            <>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <SearchForm userInfo={userInfo} handleSearch={this.handleSearch} resetSearch={this.resetSearch}></SearchForm>
                </div>
                <div className="content mt12 flex-1">
                    <div className="mb20 clearfix">
                        <span className="table-title">客户列表</span>
                        <div className="fr">
                            <Button onClick={this.export} className="mr8">
                                <span className="iconfont icon-export mr8 fz14"></span>导出
                            </Button>
                            <Button type="primary" onClick={this.toAddForm}>
                                <span className="iconfont icon-add mr8 fz14"></span>客户
                            </Button>
                        </div>
                    </div>
                    <FilterSelectAllTable
                        rowKey={(record) => {
                            return record.id;
                        }}
                        loading={loadingSearch}
                        columns={columns}
                        dataSource={data}
                        scroll={{ x: 1100 }}
                        onChange={this.tableChange}
                        pagination={pagination}
                        handleTableSearch={this.handleTableSearch}></FilterSelectAllTable>
                    {showAddModal ? <Add userInfo={userInfo} toAddForm={this.toAddForm}></Add> : null}
                </div>
            </>
        );
    }
}

export default TableView;
