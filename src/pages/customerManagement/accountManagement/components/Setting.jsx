import React from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { Form, Button, Descriptions, Tabs, Modal, Divider, Table, Spin } from 'antd';
import { connect } from 'dva';
import filters from '@/filters/index';
import { HxIcon } from '@/components/hx-components';
import CommonPageHeader from './CommonPageHeader';
import ClientEditModal from './ClientEditModal';
import ProjectListAdd from './ProjectListAdd';
import ChannelManagementAdd from './ChannelManagementAdd';

const { TabPane } = Tabs;
const { confirm } = Modal;

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
            ellipsis: true,
        },
        {
            title: '地理位置',
            dataIndex: 'areaName',
            render: (text) => {
                return text || '--';
            },
            align: 'left',
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
                                return this.toProjectListEdit(record);
                            }}>
                            编辑
                        </a>
                        <Divider type="vertical"></Divider>
                        <a
                            className="link-delete"
                            onClick={() => {
                                return this.showProjectListConfirm(record);
                            }}>
                            删除
                        </a>
                    </div>
                );
            },
            fixed: 'right',
            width: 118,
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
            ellipsis: true,
        },
        {
            title: '通道名称',
            dataIndex: 'name',
            render: (text) => {
                return text || '--';
            },
            align: 'left',
            ellipsis: true,
        },
        {
            title: '所属项目',
            dataIndex: 'customerProjectName',
            render: (text) => {
                return text || '--';
            },
            align: 'left',
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
                                return this.toChannelManagementEdit(record);
                            }}>
                            编辑
                        </a>
                        <Divider type="vertical"></Divider>
                        <a
                            className="link-delete"
                            onClick={() => {
                                return this.showChannelManagementConfirm(record);
                            }}>
                            删除
                        </a>
                    </div>
                );
            },
            fixed: 'right',
            width: 167,
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
            clientEditModal: false, // 客户编辑
            projectListAdd: false, // 新增项目
            channelManagementAdd: false, // 新增通道
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

    // 新增项目
    toProjectListAdd = () => {
        this.setState(
            (preState) => {
                return {
                    projectListAdd: !preState.projectListAdd,
                    projectRecord: '',
                };
            },
            () => {
                this.getProjectList(0);
            },
        );
    };

    // 编辑项目
    toProjectListEdit = (record) => {
        this.setState(
            (preState) => {
                return {
                    projectListAdd: !preState.projectListAdd,
                    projectRecord: record,
                };
            },
            () => {
                this.getProjectList(0);
            },
        );
    };

    // 新增通道
    toChannelManagementAdd = () => {
        this.setState(
            (preState) => {
                return {
                    channelManagementAdd: !preState.channelManagementAdd,
                    channelManagementRecord: '',
                };
            },
            () => {
                this.getChannelManagement(0);
            },
        );
    };

    // 编辑通道
    toChannelManagementEdit = (record) => {
        this.setState(
            (preState) => {
                return {
                    channelManagementAdd: !preState.channelManagementAdd,
                    channelManagementRecord: record,
                };
            },
            () => {
                this.getChannelManagement(0);
            },
        );
    };

    // 判断按钮类别
    getOperations = () => {
        const { activeKey } = this.state;
        if (activeKey === 'projectList') {
            return (
                <Button type="primary" onClick={this.toProjectListAdd}>
                    <span className="iconfont icon-add mr8 fz14"></span>项目
                </Button>
            );
        }
        if (activeKey === 'channelManagement') {
            return (
                <Button type="primary" onClick={this.toChannelManagementAdd}>
                    <span className="iconfont icon-add mr8 fz14"></span>通道
                </Button>
            );
        }
    };

    // 编辑客户
    changeClientEditModal = () => {
        this.setState(
            (preState) => {
                return {
                    clientEditModal: !preState.clientEditModal,
                };
            },
            () => {
                this.getCustomerInfo();
            },
        );
    };

    // 删除客户
    changeClientCofirm = () => {
        const { customerInfo } = this.state;
        confirm({
            content: (
                <div>
                    <div>确定要删除该数据吗？</div>
                    <div>客户名称：{customerInfo && customerInfo.name ? customerInfo.name : ''}</div>
                </div>
            ),
            title: '提示',
            okText: '确定',
            cancelText: '取消',
            icon: <HxIcon type="icon-ask" className="fz24"></HxIcon>,
            onOk: () => {
                return this.handleDelete();
            },
            className: 'confirmStyle',
        });
    };

    handleDelete = () => {
        const { dispatch } = this.props;
        const { customerInfo } = this.state;
        dispatch({
            type: 'customerManagement/deleteTableInfo',
            payload: { id: customerInfo && customerInfo.id ? customerInfo.id : '' },
            callback: () => {
                this.props.history.push('/customerManagement/eventStatistics');
            },
        });
    };

    // 删除项目
    showProjectListConfirm = (record) => {
        confirm({
            content: (
                <div>
                    <div>确定要删除该数据吗？</div>
                    <div>项目名称：{record && record.name ? record.name : ''}</div>
                </div>
            ),
            title: '提示',
            okText: '确定',
            cancelText: '取消',
            icon: <HxIcon type="icon-ask" className="fz24"></HxIcon>,
            onOk: () => {
                return this.handleProjectDelete(record.id);
            },
            className: 'confirmStyle',
        });
    };

    handleProjectDelete = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'projectList/deleteTableInfo',
            payload: id,
            callback: () => {
                this.getProjectList(0);
            },
        });
    };

    // 删除通道
    showChannelManagementConfirm = (record) => {
        confirm({
            content: (
                <div>
                    <div>确定要删除该数据吗？</div>
                    <div>通道名称：{record && record.name ? record.name : ''}</div>
                    <div>删除通道后，通道下的设备绑定到该客户上</div>
                </div>
            ),
            title: '提示',
            okText: '确定',
            cancelText: '取消',
            icon: <HxIcon type="icon-ask" className="fz24"></HxIcon>,
            onOk: () => {
                return this.handleChannelManagementDelete(record.id);
            },
            className: 'confirmStyle',
        });
    };

    handleChannelManagementDelete = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'channelManagement/deleteTableInfo',
            payload: id,
            callback: () => {
                this.getChannelManagement(0);
            },
        });
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
        const { activeKey, clientEditModal, projectListAdd, channelManagementAdd, customerInfo, projectData, projectPageable, channelManagementData, channelManagementPageable, projectRecord, channelManagementRecord } = this.state;
        const operations = this.getOperations();
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
                <CommonPageHeader titleName="客户设置"></CommonPageHeader>
                <div className="content mt12">
                    <div className="mb12 clearfix">
                        <span className="info-title">基本信息</span>
                        <div className="fr">
                            <Button onClick={this.changeClientEditModal} className="mr8">
                                <span className="iconfont icon-edit mr8 fz14"></span>编辑
                            </Button>
                            <Button type="danger" ghost onClick={this.changeClientCofirm}>
                                <span className="iconfont icon-delete mr8 fz14"></span>删除
                            </Button>
                        </div>
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
                    <Tabs activeKey={activeKey} onChange={this.saveActiveKey} tabBarExtraContent={operations}>
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
                {clientEditModal ? <ClientEditModal customerInfo={customerInfo} changeClientEditModal={this.changeClientEditModal}></ClientEditModal> : null}
                {projectListAdd ? <ProjectListAdd customerInfo={customerInfo} toProjectListAdd={this.toProjectListAdd} record={projectRecord}></ProjectListAdd> : null}
                {channelManagementAdd ? <ChannelManagementAdd customerInfo={customerInfo} toChannelManagementAdd={this.toChannelManagementAdd} record={channelManagementRecord}></ChannelManagementAdd> : null}
            </div>
        );
    }
}

export default Setting;
