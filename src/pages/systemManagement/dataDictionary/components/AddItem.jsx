import React from 'react';
import { Modal, Form, Row, Col, Input, Icon, Switch } from 'antd';
import { connect } from 'dva';
import validate from '@/utils/validation';
import styles from '../index.less';

const FormItem = Form.Item;

@connect(({ dataDictionarySpace, loading }) => {
    return {
        dataDictionarySpace,
        loadingAdd: loading.effects['dataDictionarySpace/addSettingItem'],
        loadingEdit: loading.effects['dataDictionarySpace/editSettingItem'],
    };
})
@Form.create()
class AddItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '', // 做名字重复性校验用
            enumCode: '',
        };
    }

    componentDidMount() {
        const { editRecord } = this.props;
        if (editRecord) {
            this.setState({
                name: editRecord.name,
                enumCode: editRecord.enumCode,
            });
        }
    }

    clickOk = () => {
        const { form, editRecord, settingId } = this.props;
        if (editRecord) {
            // 编辑
            form.validateFields((err, values) => {
                if (err) {
                    return;
                }
                let value = values;
                value = {
                    ...value,
                    id: editRecord.id,
                    typeId: settingId,
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
                    typeId: settingId,
                };
                this.props.addOk(value);
            });
        }
    };

    clickCancel = () => {
        this.props.editShow();
    };

    // 名字重复性校验
    checkName = (rule, value, callback) => {
        const { name } = this.state;
        const { editRecord, settingId } = this.props;
        if (name === '') {
            // 新增
            if (value === undefined || value === '' || value.trim() === '') {
                this.props.form.setFieldsValue({
                    name: undefined,
                });
                callback();
            } else {
                const { dispatch } = this.props;
                dispatch({
                    type: 'dataDictionarySpace/checkSettingName',
                    payload: {
                        name: value,
                        typeId: settingId,
                    },
                    callback: (result) => {
                        if (result) {
                            callback('该名称已存在');
                        } else {
                            callback();
                        }
                    },
                });
            }
        } else {
            // 编辑
            // eslint-disable-next-line no-lonely-if
            if (value === undefined || value === '' || value.trim() === '') {
                this.props.form.setFieldsValue({
                    name: undefined,
                });
                callback();
            } else if (name === value) {
                callback();
            } else {
                const { dispatch } = this.props;
                dispatch({
                    type: 'dataDictionarySpace/checkSettingName',
                    payload: {
                        name: value,
                        typeId: settingId,
                        id: editRecord.id,
                    },
                    callback: (result) => {
                        if (result) {
                            callback('该名称已存在');
                        } else {
                            callback();
                        }
                    },
                });
            }
        }
    };

    // 名字重复性校验
    checkEnumCode = (rule, value, callback) => {
        const { enumCode } = this.state;
        const { editRecord, settingId } = this.props;
        if (enumCode === '') {
            // 新增
            if (value === undefined || value === '' || value.trim() === '') {
                this.props.form.setFieldsValue({
                    enumCode: undefined,
                });
                callback();
            } else {
                const { dispatch } = this.props;
                dispatch({
                    type: 'dataDictionarySpace/checkEnumCode',
                    payload: {
                        code: value,
                        typeId: settingId,
                    },
                    callback: (result) => {
                        if (result) {
                            callback('该code已存在');
                        } else {
                            callback();
                        }
                    },
                });
            }
        } else {
            // 编辑
            // eslint-disable-next-line no-lonely-if
            if (value === undefined || value === '' || value.trim() === '') {
                this.props.form.setFieldsValue({
                    enumCode: undefined,
                });
                callback();
            } else if (enumCode === value) {
                callback();
            } else {
                const { dispatch } = this.props;
                dispatch({
                    type: 'dataDictionarySpace/checkEnumCode',
                    payload: {
                        code: value,
                        typeId: settingId,
                        id: editRecord.id,
                    },
                    callback: (result) => {
                        if (result) {
                            callback('该code已存在');
                        } else {
                            callback();
                        }
                    },
                });
            }
        }
    };

    render() {
        const {
            form: { getFieldDecorator },
            editRecord,
        } = this.props;
        return (
            <div className={styles.modalCss}>
                <Modal title={editRecord ? '编辑枚举项' : '新增枚举项'} confirmLoading={editRecord ? this.props.loadingEdit : this.props.loadingAdd} destroyOnClose visible maskClosable={false} onOk={this.clickOk} okText="确定" onCancel={this.clickCancel} cancelText="取消" width={440} getContainer={false}>
                    <div className="formList80">
                        <Form>
                            <Row type="flex" gutter={20}>
                                <Col span={24}>
                                    <FormItem label="枚举名称">
                                        {getFieldDecorator('name', {
                                            validate: [
                                                {
                                                    trigger: 'onChange',
                                                    rules: [validate.Rule_require],
                                                },
                                                {
                                                    trigger: 'onBlur', // 失去焦点做名称重复性校验
                                                    rules: [{ validator: this.checkName }],
                                                },
                                            ],
                                            initialValue: editRecord ? editRecord.name : undefined,
                                        })(<Input placeholder="请输入" maxLength={32}></Input>)}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="枚举code">
                                        {getFieldDecorator('enumCode', {
                                            validate: [
                                                {
                                                    trigger: 'onChange',
                                                    rules: [validate.Rule_require],
                                                },
                                                {
                                                    trigger: 'onBlur', // 失去焦点做名称重复性校验
                                                    rules: [{ validator: this.checkEnumCode }],
                                                },
                                            ],
                                            initialValue: editRecord ? editRecord.enumCode : undefined,
                                        })(<Input placeholder="请输入" maxLength={32}></Input>)}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="是否可用">
                                        {getFieldDecorator('available', {
                                            rules: [validate.Rule_require],
                                            initialValue: editRecord ? editRecord.available : true,
                                        })(<Switch checkedChildren={<Icon type="check" />} defaultChecked={editRecord ? editRecord.available : true} unCheckedChildren={<Icon type="close" />} />)}
                                    </FormItem>
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
