import React from 'react';
import { Modal, Table, Form, Button, Divider, Icon, Switch, message, Tooltip, Popover } from 'antd';
import { connect } from 'dva';
import AddItem from './AddItem';
import styles from '../index.less';
import { HxIcon } from '@/components/hx-components';

const { confirm } = Modal;

@connect(({ dataDictionarySpace, loading }) => {
    return {
        dataDictionarySpace,
        tableLoading: loading.effects['dataDictionarySpace/getSettingDataDictionaryList'],
        switchLoading: loading.effects['dataDictionarySpace/changeSettingItemStatus'],
    };
})
@Form.create()
class Setting extends React.Component {
    columns = [
        {
            title: '显示顺序',
            dataIndex: 'order',
            width: 100,
            align: 'center',
            ellipsis: true,
            // fixed: 'left',
        },
        {
            title: '枚举名称',
            dataIndex: 'name',
            width: 124,
            ellipsis: true,
        },
        {
            title: '枚举code',
            dataIndex: 'enumCode',
            ellipsis: true,
            // width: 120,
        },
        {
            title: '系统ID',
            dataIndex: 'code',
            ellipsis: true,
            // width: 120,
        },
        {
            title: '是否可用',
            dataIndex: 'available',
            ellipsis: true,
            align: 'center',
            render: (text, record) => {
                return (
                    <Switch
                        checkedChildren={<Icon type="check" />}
                        unCheckedChildren={<Icon type="close" />}
                        checked={text}
                        onChange={() => {
                            return this.switch(record);
                        }}
                    />
                );
            },
        },
        {
            title: '操作',
            dataIndex: 'control',
            // fixed: 'right',
            width: 167,
            render: (text, record) => {
                return (
                    <span className={styles.dividerStyle}>
                        <a
                            onClick={() => {
                                return this.selectRowUp(record);
                            }}>
                            上移
                        </a>
                        <Divider type="vertical" />
                        <a
                            onClick={() => {
                                return this.selectRowDown(record);
                            }}>
                            下移
                        </a>
                        <Divider type="vertical" />
                        <Popover
                            placement="bottom"
                            title={text}
                            overlayClassName={styles.table}
                            content={
                                <div className={styles.popover}>
                                    <a
                                        onClick={() => {
                                            return this.editShow(record);
                                        }}>
                                        编辑
                                    </a>
                                    <a
                                        className="link-delete"
                                        onClick={() => {
                                            return this.deleteShow(record.id);
                                        }}>
                                        删除
                                    </a>
                                </div>
                            }>
                            <a>更多</a>
                        </Popover>
                    </span>
                );
            },
        },
    ];

    constructor(props) {
        super(props);
        this.state = {
            editShowModal: false,
            editRecord: {}, // 编辑的数据
            selectedRowKeys: [],
            pageInfo: {
                page: 0,
                size: 10,
            },
        };
    }

    componentDidMount() {
        this.getSettingDataDictionaryList(0);
    }

    // 可用切换
    switch = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'dataDictionarySpace/changeSettingItemStatus',
            payload: {
                available: !record.available,
                id: record.id,
            },
            callback: () => {
                const { page, size } = this.state.pageInfo;
                this.getSettingDataDictionaryList(page, size);
            },
        });
    };

    // 获取分页数据
    getSettingDataDictionaryList = (page, size) => {
        const { settingId, dispatch } = this.props;
        this.setState(
            {
                pageInfo: {
                    page,
                    size,
                },
            },
            () => {
                dispatch({
                    type: 'dataDictionarySpace/getSettingDataDictionaryList',
                    payload: {
                        ...this.state.pageInfo,
                        typeId: settingId,
                    },
                });
            },
        );
    };

    // 切换分页
    tableChange = (pagination) => {
        this.getSettingDataDictionaryList(pagination.current - 1, pagination.pageSize);
    };

    // 显示编辑框
    editShow = (record) => {
        this.setState((preState) => {
            return {
                editShowModal: !preState.editShowModal,
                editRecord: record,
            };
        });
    };

    // 确定编辑
    editOk = (values) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'dataDictionarySpace/editSettingItem',
            payload: values,
            callback: () => {
                const { page, size } = this.state.pageInfo;
                this.setState((preState) => {
                    return {
                        editShowModal: !preState.editShowModal,
                    };
                });
                this.getSettingDataDictionaryList(page, size);
            },
        });
    };

    // 确定添加
    addOk = (values) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'dataDictionarySpace/addSettingItem',
            payload: values,
            callback: () => {
                const { page, size } = this.state.pageInfo;
                this.setState((preState) => {
                    return {
                        editShowModal: !preState.editShowModal,
                        selectedRowKeys: [], // 添加成功后将选定状态取消
                    };
                });
                this.getSettingDataDictionaryList(page, size);
            },
        });
    };

    deleteShow = (id) => {
        confirm({
            title: '确定要删除该数据吗',
            icon: <HxIcon type="icon-ask" className="fz24"></HxIcon>,
            // content: '确定要删除这条信息吗？',
            okText: '确定',
            cancelText: '取消',
            width: 450,
            onOk: () => {
                return this.deleteOk(id);
            },
        });
    };

    // 确定删除
    deleteOk = (id) => {
        const {
            dispatch,
            dataDictionarySpace: { dataSettingDictionaryList },
        } = this.props;
        const { pageable = {} } = dataSettingDictionaryList;
        let page = pageable.number || 0;
        const size = pageable.size || 10;
        const total = pageable.totalElements || 0;
        if (pageable.last && page !== 0 && total % size === 1) {
            page -= 1;
        }
        dispatch({
            type: 'dataDictionarySpace/deleteSettingItem',
            payload: { id },
            callback: () => {
                this.getSettingDataDictionaryList(page, size);
                this.setState({
                    selectedRowKeys: [], // 删除成功后将选定状态取消
                });
            },
        });
    };

    settingShow = () => {
        this.props.settingShow();
    };

    up = () => {
        const { dispatch } = this.props;
        const { moveId } = this.state;
        if (this.state.selectedRowKeys[0] === 1) {
            message.warn('已经是第一个了，无法上移');
            return;
        }
        dispatch({
            type: 'dataDictionarySpace/up',
            payload: { id: moveId },
            callback: () => {
                const { page, size } = this.state.pageInfo;
                this.setState((preState) => {
                    return {
                        selectedRowKeys: [...[], preState.selectedRowKeys[0] - 1],
                    };
                });
                this.getSettingDataDictionaryList(page, size);
            },
        });
    };

    // 下移
    down = () => {
        const {
            dispatch,
            dataDictionarySpace: { dataSettingDictionaryList },
        } = this.props;
        const { moveId } = this.state;
        if (this.state.selectedRowKeys[0] === dataSettingDictionaryList.pageable.totalElements) {
            message.warn('已经是最后一个了，无法下移');
            return;
        }
        dispatch({
            type: 'dataDictionarySpace/down',
            payload: { id: moveId },
            callback: () => {
                const { page, size } = this.state.pageInfo;
                this.setState((preState) => {
                    return {
                        selectedRowKeys: [...[], preState.selectedRowKeys[0] + 1],
                    };
                });
                this.getSettingDataDictionaryList(page, size);
            },
        });
    };

    // 点击列表该行 选中checkbox
    selectRowUp = (record) => {
        if (record.disable) {
            return;
        }
        this.setState(
            {
                moveId: record.id,
                selectedRowKeys: [record.order],
            },
            () => {
                this.up();
            },
        );
    };

    // 点击列表该行 选中checkbox
    selectRowDown = (record) => {
        if (record.disable) {
            return;
        }
        this.setState(
            {
                moveId: record.id,
                selectedRowKeys: [record.order],
            },
            () => {
                this.down();
            },
        );
    };

    render() {
        const { editShowModal, editRecord } = this.state;

        const {
            dataDictionarySpace: { dataSettingDictionaryList },
            tableLoading,
            settingId,
        } = this.props;

        const { pageable, data } = dataSettingDictionaryList;
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

        return (
            <div className={styles.modalStyle}>
                <Modal title="设置字典" destroyOnClose visible maskClosable={false} footer={null} onCancel={this.settingShow} bodyStyle={{ padding: '0' }} width={1000}>
                    <div className="content">
                        <div className="mb20 clearfix">
                            <span className="table-title">字典名称</span>
                            <div className="fr">
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        return this.editShow();
                                    }}>
                                    <span className="iconfont icon-add mr8 fz14"></span>枚举项
                                </Button>
                            </div>
                        </div>

                        <Table rowKey="order" scroll={{ x: 800 }} onChange={this.tableChange} loading={tableLoading} columns={this.columns} dataSource={data} pagination={pagination}></Table>
                        {editShowModal ? <AddItem settingId={settingId} editShow={this.editShow} addOk={this.addOk} editOk={this.editOk} editRecord={editRecord}></AddItem> : null}
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Setting;
