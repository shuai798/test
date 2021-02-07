import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/breadcrumb';
import { Form, Divider, Button, Modal, Input, Tree, Popover, Icon } from 'antd';
import FilterSelectAllTable from '@/components/filter-selectall-table';
import SearchForm from './components/SearchForm';
import UpdateForm from './components/UpdateForm';
import DetailForm from './components/DetailForm';
import AddForm from './components/AddForm';
import DirectResetPassword from './components/DirectResetPassword';
import UpdatePhone from './components/UpdatePhone';
import styles from './style.less';
import { HxIcon } from '@/components/hx-components';

const { Search } = Input;
const { TreeNode } = Tree;
const { confirm } = Modal;

@connect(({ accountKeeperSpace, areaCity, loading }) => {
    return {
        accountKeeperSpace,
        areaCity,
        loading,
    };
})
@Form.create()
class Curd extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            editShowModal: false,
            detailShowModal: false,
            isShowUpdatePhone: false,
            userDetail: {},
            addVisable: false,
            condition: {},
            dataSource: [],
            detailRecord: {},
            getDepartmentList: [],
            departertment: {},
            selectRecord: {},
            updateMobile: {},
            currentData: [],
            appData: [],
            webData: [],
            pagination: {
                pageSize: 10,
                current: 0,
                total: 0,
            },
            searchValue: '',
            filtersParam: {},
        };
    }

    componentDidMount() {
        this.initData();
        this.datasourceOfIds();
    }

    // 获取checkbox ids
    datasourceOfIds = () => {
        const { dispatch } = this.props;
        const { departertment } = this.state;
        dispatch({
            type: 'accountKeeperSpace/getCurrentCustomer',
            payload: { organizationId: departertment.id },
            callback: (resone) => {
                dispatch({
                    type: 'accountKeeperSpace/getAppList',
                    callback: (restwo) => {
                        dispatch({
                            type: 'accountKeeperSpace/getWebList',
                            callback: (resthree) => {
                                this.setState({
                                    appData: restwo.data,
                                    currentData: resone.data,
                                    webData: resthree.data,
                                });
                            },
                        });
                    },
                });
            },
        });
    };

    initData = () => {
        const { dispatch } = this.props;
        const { orgId } = JSON.parse(localStorage.getItem('userInfo'));
        dispatch({
            type: 'accountKeeperSpace/getTableListInfo',
            payload: {
                orgId,
            },
            callback: (response) => {
                const getDepartmentList = [];
                getDepartmentList.push(response.data);
                this.changeDataToTreeSelect(getDepartmentList);
                this.departertmentChange(getDepartmentList[0], '1');
                this.setState(() => {
                    return {
                        getDepartmentList,
                        selectRecord: getDepartmentList[0].id,
                    };
                });
            },
        });
    };

    changeDataToTreeSelect = (data) => {
        const list = data;
        if (list.length > 0) {
            for (let i = 0; i < list.length; i += 1) {
                list[i].key = list[i].id;
                list[i].title = list[i].name;
                if (list[i].children && list[i].children.length > 0) {
                    list[i].children = this.changeDataToTreeSelect(list[i].children, list[i].newValue);
                } else {
                    list[i].children = null;
                }
            }
        }
        return list;
    };

    editShow = (record) => {
        const { dispatch } = this.props;

        dispatch({
            type: 'accountKeeperSpace/detailRecord',
            payload: {
                id: record.employeeId,
            },
            callback: (response) => {
                this.setState((prevState) => {
                    return {
                        editShowModal: !prevState.editShowModal,
                        updateRecord: record,
                        detailRecord: response.data,
                    };
                });
            },
        });
    };

    editListOk = () => {
        this.setState(
            {
                editShowModal: false,
            },
            () => {
                this.searchList(0);
            },
        );
    };

    editListCancel = () => {
        this.setState({
            editShowModal: false,
        });
    };

    detailShow = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'accountKeeperSpace/detailRecord',
            payload: {
                id: record.employeeId,
            },
            callback: (response) => {
                this.setState({
                    detailShowModal: true,
                    detailRecord: response.data,
                });
            },
        });
    };

    detailCancel = () => {
        this.setState({
            detailShowModal: false,
        });
    };

    UpdatePhoneModalOk = (record) => {
        this.setState(
            (prevState) => {
                return {
                    isShowUpdatePhone: !prevState.isShowUpdatePhone,
                    updateMobile: record,
                };
            },
            () => {
                this.searchList(0);
            },
        );
    };

    UpdatePhoneModal = (record) => {
        this.setState((prevState) => {
            return {
                isShowUpdatePhone: !prevState.isShowUpdatePhone,
                updateMobile: record,
            };
        });
    };

    // 显示重置密码modal
    setIfchangePasswordStatus = (record) => {
        this.setState({
            resetModalVisiable: false,
            userDetail: record,
        });
    };

    cancleResetPassword = () => {
        this.setState({ resetModalVisiable: false });
    };

    resetPassword = (record) => {
        this.setState({
            userDetail: record,
            resetModalVisiable: true,
        });
    };

    onRef = (ref) => {
        this.child = ref;
    };

    getPersonalInformationDetail = () => {
        this.child.getPersonalInformationDetail();
    };

    deleteShow = (record) => {
        const { departertment } = this.state;
        confirm({
            content: ` 确认将${record.name}从${departertment.name}移除？`,
            title: '删除人员',
            okText: '确定',
            cancelText: '取消',
            width: 450,
            // icon: <Icon style={{ color: 'rgba(245, 78, 68, 1)' }} type="exclamation-circle"></Icon>,
            icon: <HxIcon type="icon-ask" className="fz24"></HxIcon>,
            onOk: () => {
                return this.deleteModel(record.employeeId);
            },
        });
    };

    deleteModel = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'accountKeeperSpace/deleteTenantEmployee',
            payload: {
                id,
            },
            callback: () => {
                this.searchList(0);
            },
        });
    };

    searchList = (page, size) => {
        const { dispatch } = this.props;
        const { condition, pagination, departertment, filtersParam } = this.state;
        let value = {};
        value = {
            ...condition,
            ...filtersParam,
            organization: departertment.id,
            size: size || pagination.pageSize,
            page,
        };
        dispatch({
            type: 'accountKeeperSpace/getTableListByCondition',
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

    NewChange = () => {
        this.setState({
            addVisable: true,
        });
    };

    okAdd = () => {
        this.setState(
            {
                addVisable: false,
            },
            () => {
                this.searchList(0);
            },
        );
    };

    cancleAdd = () => {
        this.setState({
            addVisable: false,
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

    reset = () => {
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
        if (columns[3].filteredValue.length > 0) {
            filtersParam.status = columns[3].filteredValue;
        }
        this.setState({ filtersParam }, () => {
            this.searchList(0);
        });
    };

    departertmentChange = (departertment) => {
        this.setState(
            {
                departertment,
            },
            () => {
                this.searchList(0);
                this.datasourceOfIds();
            },
        );
    };

    onSelect = (id, record) => {
        if (!record.selected) {
            return;
        }
        this.departertmentChange({ id });
        this.setState({
            selectRecord: id[0],
        });
    };

    onSearchChange = (e) => {
        const { value } = e.target;
        this.setState({
            searchValue: value,
        });
    };

    loop = (data) => {
        const { searchValue } = this.state;
        return data.map((item) => {
            const index = item.title.indexOf(searchValue);
            const beforeStr = item.title.substr(0, index);
            const afterStr = item.title.substr(index + searchValue.length);
            const title =
                index > -1 ? (
                    <span>
                        {beforeStr}
                        <span style={{ color: 'red' }}>{searchValue}</span>
                        {afterStr}
                    </span>
                ) : (
                    <span>{item.title}</span>
                );
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={title}>
                        {this.loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={title} />;
        });
    };

    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'NO',
                width: 68,
                align: 'center',
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                },
                fixed: 'left',
            },
            {
                title: '人员姓名',
                dataIndex: 'name',
                key: 'name',
                ellipsis: true,
            },
            {
                title: '手机号码',
                dataIndex: 'mobile',
                key: 'mobile',
                // width: 130,
                ellipsis: true,
            },
            {
                title: '状态',
                dataIndex: 'status',
                // width: 170,
                filterType: 'multipleChoice',
                filterMultiple: false,
                filters: [
                    {
                        label: '在职',
                        value: 'true',
                    },
                    {
                        label: '离职',
                        value: 'false',
                    },
                ],
                // align: 'center',
                ellipsis: true,
                render: (text) => {
                    if (text) {
                        return (
                            <div>
                                <div
                                    className="dib"
                                    style={{
                                        width: 8,
                                        height: 8,
                                        background: '#01B538',
                                        borderRadius: '50%',
                                        marginRight: 7,
                                    }}></div>
                                <div className="dib">在职</div>
                            </div>
                        );
                    }
                    return (
                        <div>
                            <div
                                className="dib"
                                style={{
                                    width: 8,
                                    height: 8,
                                    background: '#FF3B3B',
                                    borderRadius: '50%',
                                    marginRight: 7,
                                }}></div>
                            <div className="dib">离职</div>
                        </div>
                    );
                },
            },
            {
                title: '操作',
                key: 'tags',
                dataIndex: 'tags',
                width: 167,
                fixed: 'right',
                render: (text, record) => {
                    return (
                        <div>
                            <a
                                onClick={() => {
                                    return this.detailShow(record);
                                }}>
                                详情
                            </a>
                            <Divider type="vertical" />
                            <a
                                onClick={() => {
                                    return this.editShow(record);
                                }}>
                                编辑
                            </a>
                            <Divider type="vertical" />
                            <Popover
                                placement="bottom"
                                title={text}
                                content={
                                    <div className={styles.popover}>
                                        <a
                                            onClick={() => {
                                                return this.resetPassword(record);
                                            }}>
                                            重置密码
                                        </a>
                                        <a
                                            onClick={() => {
                                                return this.UpdatePhoneModal(record);
                                            }}>
                                            变更手机号
                                        </a>
                                        <a
                                            className="link-delete"
                                            onClick={() => {
                                                return this.deleteShow(record);
                                            }}>
                                            删除
                                        </a>
                                    </div>
                                }>
                                <a>更多</a>
                            </Popover>
                        </div>
                    );
                },
            },
        ];
        const { selectRecord, dataSource, getDepartmentList, addVisable, detailShowModal, editShowModal, resetModalVisiable, updateRecord, detailRecord, isShowUpdatePhone, updateMobile, currentData, appData, webData } = this.state;
        return (
            <div className={styles.content}>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className={styles.middleContent}>
                    <div className="content treeWidth">
                        <Search
                            style={{
                                background: 'rgba(161,168,179,0.15)',
                                borderRadius: 4,
                                marginBottom: 13,
                            }}
                            placeholder="请输入搜索内容"
                            onChange={this.onSearchChange}
                        />
                        {getDepartmentList && getDepartmentList.length > 0 ? (
                            <Tree onSelect={this.onSelect} blockNode defaultExpandAll selectedKeys={[selectRecord]}>
                                {this.loop(getDepartmentList)}
                            </Tree>
                        ) : null}
                    </div>
                    <div className={styles.rightContent}>
                        <div className="content formList80">
                            <SearchForm getDepartmentList={getDepartmentList} handleSearch={this.handleSearch} reset={this.reset}></SearchForm>
                        </div>
                        <div className="content mt12 tableList">
                            <div className="mb12 clearfix">
                                <span className="table-title">账户列表</span>
                                <Button
                                    className="fr"
                                    icon="plus"
                                    onClick={() => {
                                        return this.NewChange();
                                    }}
                                    type="primary">
                                    账户
                                </Button>
                            </div>
                            <div
                                style={{
                                    width: '100%',
                                    overflowX: 'auto',
                                    marginTop: 10,
                                }}
                                className="tebleOverflow">
                                <FilterSelectAllTable
                                    columns={columns}
                                    dataSource={dataSource}
                                    rowKey={(record) => {
                                        return record.id;
                                    }}
                                    loading={this.props.loading.effects['accountKeeperSpace/getTableListByCondition']}
                                    onChange={this.handleTableChange}
                                    pagination={this.state.pagination}
                                    scroll={{ x: 1100 }}
                                    handleTableSearch={this.handleTableSearch}></FilterSelectAllTable>
                            </div>
                        </div>
                    </div>
                </div>
                {addVisable && <AddForm NewChange={this.NewChange} okAdd={this.okAdd} cancleAdd={this.cancleAdd} selectRecord={selectRecord} currentData={currentData} appData={appData} webData={webData}></AddForm>}
                {editShowModal && <UpdateForm editRecord={updateRecord} detailRecord={detailRecord} editListCancel={this.editListCancel} editListOk={this.editListOk} currentData={currentData} appData={appData} webData={webData} />}
                {detailShowModal && <DetailForm detailRecord={detailRecord} detailCancel={this.detailCancel} currentData={currentData} appData={appData} webData={webData} />}
                {isShowUpdatePhone && <UpdatePhone updateMobile={updateMobile} UpdatePhoneModal={this.UpdatePhoneModal} UpdatePhoneModalOk={this.UpdatePhoneModalOk}></UpdatePhone>}
                {resetModalVisiable && <DirectResetPassword setIfchangePasswordStatus={this.setIfchangePasswordStatus} cancleResetPassword={this.cancleResetPassword} userDetail={this.state.userDetail} />}
            </div>
        );
    }
}

export default Curd;
