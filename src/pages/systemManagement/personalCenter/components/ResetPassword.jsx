import { Row, Col, Form, Input, Modal } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import validate from '@/utils/validation';

const FormItem = Form.Item;

@connect(({ personalCenter, loading }) => {
    return {
        personalCenter,
        loadingResetPassword: loading.effects['personalCenter/resetPassword'],
    };
})
@Form.create()
class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // 确定
    resetPassword = () => {
        const { form, dispatch, updateResetPasswordModal } = this.props;
        const { personalInformationDetail = {} } = this.props.personalCenter;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            dispatch({
                type: 'personalCenter/resetPassword',
                payload: {
                    ...fieldsValue,
                    mobile: personalInformationDetail.mobile,
                },
                callback: () => {
                    updateResetPasswordModal();
                },
            });
        });
    };

    // 取消
    updateResetPasswordModal = () => {
        this.props.updateResetPasswordModal();
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('您输入的两个密码不一致!');
        } else {
            callback();
        }
    };

    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <div>
                <Modal centered title="重置密码" confirmLoading={this.props.loadingResetPassword} destroyOnClose visible maskClosable={false} onOk={this.resetPassword} onCancel={this.updateResetPasswordModal} width={440}>
                    <div className="formList80">
                        <Form>
                            <Row>
                                <Col span={24}>
                                    <FormItem label="新密码">
                                        {getFieldDecorator('password', {
                                            rules: [
                                                validate.Rule_require,
                                                {
                                                    validator: validate.Rule_password,
                                                },
                                            ],
                                        })(<Input.Password placeholder="请输入" allowClear autoComplete="off"></Input.Password>)}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="确认密码">
                                        {getFieldDecorator('confirm', {
                                            rules: [
                                                validate.Rule_require,
                                                {
                                                    validator: this.compareToFirstPassword,
                                                },
                                            ],
                                        })(<Input.Password placeholder="请输入" allowClear autoComplete="off"></Input.Password>)}
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

export default ResetPassword;
