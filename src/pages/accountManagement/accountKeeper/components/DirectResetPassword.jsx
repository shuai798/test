import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Row, Col, Modal } from 'antd';

const FormItem = Form.Item;

@connect(({ accountKeeperSpace, loading }) => {
    return {
        accountKeeperSpace,
        loading,
    };
})
@Form.create()
class DirectResetPassword extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
        };
    }

    submitChangePassword = () => {
        const { dispatch, form } = this.props;
        const { password } = this.state;
        form.validateFields((err) => {
            if (err) {
                return;
            }
            const { userDetail } = this.props;
            const { mobile } = userDetail;
            const values = {
                mobile,
                password,
            };
            dispatch({
                type: 'accountKeeperSpace/resetPassword',
                payload: {
                    ...values,
                },
                callback: () => {
                    this.props.setIfchangePasswordStatus();
                },
            });
        });
    };

    cancleResetPassword = () => {
        this.props.cancleResetPassword();
    };

    validateStatus = (rule, value, callback) => {
        const { password } = this.state;
        if (password !== value) {
            callback('两次输入的密码不一致，请重新输入!');
        }
        callback();
    };

    setPassword = (e) => {
        this.setState({
            password: e.target.value,
        });
    };

    render() {
        const {
            form: { getFieldDecorator },
            loading,
            userDetail,
        } = this.props;
        const dataloading = loading.effects['accountKeeperSpace/resetPassword'];
        return (
            <div>
                <Modal loading={dataloading} visible maskClosable={false} width={440} title="重置密码" onOk={this.submitChangePassword} onCancel={this.cancleResetPassword} okText="确定" cancelText="取消">
                    <div className="formList100">
                        <Form>
                            <Row>
                                <Col span={24}>
                                    <FormItem label="人员姓名">{userDetail.name}</FormItem>
                                    <FormItem label="新密码">
                                        {getFieldDecorator('password', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '密码必填',
                                                },
                                                {
                                                    max: 32,
                                                    message: '最大长度32',
                                                },
                                                {
                                                    min: 6,
                                                    message: '最少输入6个字符',
                                                },
                                            ],
                                        })(<Input.Password autoComplete="off" onChange={this.setPassword} placeholder="请输入" />)}
                                    </FormItem>
                                    <FormItem label="确认密码">
                                        {getFieldDecorator('confirmPassword', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '确认密码必填',
                                                },
                                                {
                                                    validator: this.validateStatus,
                                                },
                                                {
                                                    max: 32,
                                                    message: '最大长度32',
                                                },
                                            ],
                                        })(<Input.Password autoComplete="off" placeholder="请输入" />)}
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

export default DirectResetPassword;
