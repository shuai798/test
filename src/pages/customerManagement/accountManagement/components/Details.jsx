import React from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { Form, Descriptions, Tabs, Table, Spin } from 'antd';
import { connect } from 'dva';
import filters from '@/filters/index';
import CommonPageHeader from './CommonPageHeader';

const { TabPane } = Tabs;

@Form.create()
@connect(({ loading, customerManagement, projectList, channelManagement }) => {
    return {
        customerManagement,
        projectList,
        channelManagement,
        addLoading: loading.effects['customerManagement/AddItem'],
        projectListLoading: loading.effects['projectList/getTableListInfo'],
        channelManagementLoading: loading.effects['channelManagement/getTableListInfo'],
        detailsLoading: loading.effects['customerManagement/getDetailRecord'],
    };
})
class Setting extends React.Component {
    //  项目管理
    projectListColumns = [
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
            title: '项目名称',
            dataIndex: 'name',
            render: (text) => {
                return text || '--';
            },
            align: 'left',
        },
        {
            title: '地理位置',
            dataIndex: 'areaName',
            render: (text) => {
                return text || '--';
            },
            align: 'left',
        },
    ];

    // 通道管理
    channelManagementColumns = [
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
            title: '通道名称',
            dataIndex: 'name',
            render: (text) => {
                return text || '--';
            },
            align: 'left',
        },
        {
            title: '所属项目',
            dataIndex: 'customerProjectName',
            render: (text) => {
                return text || '--';
            },
            align: 'left',
        },
    ];

    constructor(props) {
        super(props);
        this.state = {
            pageInfo: {
                page: 0,
                size: 10,
            },
            activeKey: 'projectList',
            customerInfo: '', //客户信息
        };
    }

    componentDidMount() {
        this.getCustomerInfo();
        this.getProjectList(0);
        this.getChannelManagement(0);
    }

    // 获取客户信息
    getCustomerInfo = () => {
        const { id } = this.props.history.location.query;
        const { dispatch } = this.props;
        dispatch({
            type: 'customerManagement/getDetailRecord',
            payload: { id },
            callback: (res) => {
                this.setState(
                    {
                        customerInfo: res.data,
                    },
                    () => {
                        dispatch({
                            type: 'customerManagement/getIndustryTypeList',
                            payload: {
                                code: 'HYLX',
                            },
                        });
                    },
                );
            },
        });
    };

    // 项目列表
    getProjectList = (page, size) => {
        const { id } = this.props.history.location.query;
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
            type: 'projectList/getTableListInfo',
            payload: {
                ...pageInfo,
                ...searchParam,
                customerId: id,
            },
            callback: () => {
                const {
                    projectList: { tableInfo },
                } = this.props;
                const { data = [], pageable = {} } = tableInfo;
                this.setState({
                    projectData: data,
                    projectPageable: pageable,
                });
            },
        });
        if (flag) {
            this.setState({
                pageInfo,
            });
        }
    };

    // 通道管理
    getChannelManagement = (page, size) => {
        const { id } = this.props.history.location.query;
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
            type: 'channelManagement/getTableListInfo',
            payload: {
                ...pageInfo,
                ...searchParam,
                customerId: id,
            },
            callback: () => {
                const {
                    channelManagement: { tableInfo },
                } = this.props;
                const { data = [], pageable = {} } = tableInfo;
                this.setState({
                    channelManagementData: data,
                    channelManagementPageable: pageable,
                });
            },
        });
        if (flag) {
            this.setState({
                pageInfo,
            });
        }
    };

    // table切换
    saveActiveKey = (activeKey) => {
        this.setState({
            activeKey,
        });
        if (activeKey === 'projectList') {
            // 项目列表
            this.getProjectList(0);
        }
        if (activeKey === 'channelManagement') {
            // 通道管理
            this.getChannelManagement(0);
        }
    };

    // 点击下一页 或者切换某页，选择每页条数
    tableChange = (pagination) => {
        const { activeKey } = this.state;
        if (activeKey === 'projectList') {
            // 项目列表
            this.getProjectList(pagination.current - 1, pagination.pageSize);
        }
        if (activeKey === 'channelManagement') {
            // 通道管理
            this.getChannelManagement(pagination.current - 1, pagination.pageSize);
        }
    };

    // 获取行业类型
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

    render() {
        const { projectListLoading, channelManagementLoading, detailsLoading } = this.props;
        const { activeKey, customerInfo, projectData, projectPageable, channelManagementData, channelManagementPageable } = this.state;
        const projectPagination = {
            showTotal: () => {
                return (
                    <span className="pagination">
                        共<a>{projectPageable.totalPages || null}</a>页/<a>{projectPageable.totalElements || null}</a>条数据
                    </span>
                );
            },
            total: projectPageable && projectPageable.totalElements ? projectPageable.totalElements : null,
            pageSize: projectPageable && projectPageable.size ? projectPageable.size : null,
            current: parseInt(projectPageable && projectPageable.number ? projectPageable.number : null + 1, 10) || 1,
            showSizeChanger: true,
        };
        const channelManagementPagination = {
            showTotal: () => {
                return (
                    <span className="pagination">
                        共<a>{channelManagementPageable.totalPages || null}</a>页/<a>{channelManagementPageable.totalElements || null}</a>条数据
                    </span>
                );
            },
            total: channelManagementPageable && channelManagementPageable.totalElements ? channelManagementPageable.totalElements : null,
            pageSize: channelManagementPageable && channelManagementPageable.size ? channelManagementPageable.size : null,
            current: parseInt(channelManagementPageable && channelManagementPageable.number ? channelManagementPageable.number : null + 1, 10) || 1,
            showSizeChanger: true,
        };
        return (
            <div>
                <PageHeaderWrapper></PageHeaderWrapper>
                <CommonPageHeader titleName="客户详情"></CommonPageHeader>
                <div className="content mt12">
                    <div className="mb12 clearfix">
                        <span className="info-title">基本信息</span>
                    </div>
                    <Spin spinning={detailsLoading}>
                        <div className="descriptions120">
                            <Descriptions bordered column={3}>
                                <Descriptions.Item label="客户名称">{customerInfo && customerInfo.name ? customerInfo.name : '--'}</Descriptions.Item>
                                <Descriptions.Item label="行业类型">{customerInfo && customerInfo.industryType ? this.getIndustryTypeName(customerInfo.industryType) : '--'}</Descriptions.Item>
                                <Descriptions.Item label="人员规模">{customerInfo && customerInfo.staffSize ? filters.staffSizeTypeFilter(customerInfo.staffSize) : '--'}</Descriptions.Item>
                                <Descriptions.Item label="所属组织">{customerInfo && customerInfo.organizationName ? customerInfo.organizationName : '--'}</Descriptions.Item>
                                <Descriptions.Item label="联系人">{customerInfo && customerInfo.contactName ? customerInfo.contactName : '--'}</Descriptions.Item>
                                <Descriptions.Item label="联系电话">{customerInfo && customerInfo.contactTel ? customerInfo.contactTel : '--'}</Descriptions.Item>
                            </Descriptions>
                        </div>
                    </Spin>
                </div>
                <div className="content mt12">
                    <Tabs activeKey={activeKey} onChange={this.saveActiveKey}>
                        <TabPane tab="项目列表" key="projectList">
                            <Table
                                rowKey={(record) => {
                                    return record.id;
                                }}
                                loading={projectListLoading}
                                className="tebleOverflow"
                                columns={this.projectListColumns}
                                dataSource={projectData}
                                pagination={projectPagination}
                                onChange={this.tableChange}></Table>
                        </TabPane>
                        <TabPane tab="通道管理" key="channelManagement">
                            <Table
                                rowKey={(record) => {
                                    return record.id;
                                }}
                                loading={channelManagementLoading}
                                className="tebleOverflow"
                                columns={this.channelManagementColumns}
                                pagination={channelManagementPagination}
                                dataSource={channelManagementData}
                                onChange={this.tableChange}></Table>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default Setting;
