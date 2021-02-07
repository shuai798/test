import React from 'react';
import { Modal, Form, Row, Col, Input, Radio, Tree, message } from 'antd';
import { connect } from 'dva';
import validate from '@/utils/validation';
import styles from '../index.less';

const optionStatus = [
    {
        label: '启用',
        value: false,
    },
    {
        label: '禁用',
        value: true,
    },
];

const FormItem = Form.Item;

@connect(({ roleMangementSpace, loading }) => {
    return {
        roleMangementSpace,
        loadingAdd: loading.effects['roleMangementSpace/addSettingItem'],
        loadingEdit: loading.effects['roleMangementSpace/editSettingItem'],
    };
})
@Form.create()
class AddItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuList: [],
            // resourceIds: [], // 传给后端数据
            treeDataSource: [], //编辑数据源
            resultData: [], //接受后台数据
        };
    }

    componentDidMount() {
        const { dispatch, editRecord } = this.props;
        if (editRecord) {
            dispatch({
                type: 'roleMangementSpace/getDetailRecord',
                payload: { id: editRecord.id },
                callback: (response) => {
                    this.setState(
                        {
                            resultData: response.data.resourceIds,
                            checkedKeysResult: response.data.resourceIds,
                        },
                        () => {
                            const menuList = JSON.parse(localStorage.getItem('menuTree'));
                            const dataSource = [];
                            this.loop(menuList, dataSource);
                            this.setState({
                                treeDataSource: dataSource,
                            });
                        },
                    );
                },
            });
        }
        const list = localStorage.getItem('menuTree');
        const menuList = JSON.parse(list);
        this.changeDataToTreeSelect(menuList);
        this.setState({
            menuList,
        });
    }

    changeDataToTreeSelect = (dataList) => {
        const list = dataList;
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

    loop = (data, list) => {
        const { resultData } = this.state;
        return data.map((item) => {
            if (item.children && item.children !== []) {
                const children = [];
                this.loop(item.children, children);
                list.push(...children);
            }
            if (item.children.length === 0) {
                if (resultData.indexOf(item.id) !== -1) {
                    list.push(item.id);
                }
            }
            return list;
        });
    };

    clickOk = () => {
        const { form, editRecord } = this.props;
        const { checkedKeysResult } = this.state;
        if (!checkedKeysResult || !checkedKeysResult.length > 0) {
            message.error('请至少选择一项菜单权限');
            return;
        }
        if (editRecord) {
            // 编辑
            form.validateFields((err, values) => {
                if (err) {
                    return;
                }
                let value = values;
                value = {
                    ...value,
                    dataType: 'CUSTOM',
                    id: editRecord.id,
                    resourceIds: checkedKeysResult,
                };
                this.props.editOk(value);
            });
        } else {
            // 新增
            form.validateFields((err, values) => {
                if (err) {
                    return;
                }
                let value = values;
                value = {
                    ...value,
                    dataType: 'CUSTOM',
                    resourceIds: checkedKeysResult,
                };
                this.props.addOk(value);
            });
        }
    };

    clickCancel = () => {
        this.props.editShow();
    };

    onCheck = (checkedKeys, e) => {
        const checkedKeysResult = [...checkedKeys, ...e.halfCheckedKeys];
        this.setState({
            treeDataSource: checkedKeys,
            checkedKeysResult,
        });
    };

    render() {
        const {
            form: { getFieldDecorator },
            editRecord,
        } = this.props;
        const { menuList, treeDataSource } = this.state;
        return (
            <div className={styles.modalCss}>
                <Modal title={editRecord ? '编辑角色' : '新增角色'} centered width={542} confirmLoading={editRecord ? this.props.loadingEdit : this.props.loadingAdd} destroyOnClose visible maskClosable={false} onOk={this.clickOk} okText="确定" onCancel={this.clickCancel} cancelText="取消" width={524} height={560} getContainer={false}>
                    <div className="formList100">
                        <Form>
                            <Row type="flex">
                                <Col>
                                    <FormItem label="角色名称">
                                        {getFieldDecorator('name', {
                                            validate: [
                                                {
                                                    trigger: 'onChange',
                                                    rules: [validate.Rule_require],
                                                },
                                            ],
                                            initialValue: editRecord ? editRecord.name : undefined,
                                        })(<Input placeholder="请输入" maxLength={32}></Input>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row type="flex">
                                <Col>
                                    <FormItem label="管理状态">
                                        {getFieldDecorator('disable', {
                                            initialValue: editRecord ? editRecord.disable : false,
                                        })(<Radio.Group options={optionStatus}></Radio.Group>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row type="flex">
                                <Col>
                                    <div className={styles.menuRole}>菜单权限</div>
                                    <div className={styles.treeStyle}>{menuList && menuList.length > 0 ? <Tree checkable treeData={menuList} onCheck={this.onCheck} defaultExpandAll checkedKeys={treeDataSource} onExpand={this.onExpand} selectable={false}></Tree> : null}</div>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default AddItem;
