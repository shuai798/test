import { Row, Col, Form, Input, Modal } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import validate from '@/utils/validation';
import styles from '../style.less';

const FormItem = Form.Item;

@connect(({ personalCenter, loading }) => {
    return {
        personalCenter,
        loadingUpdatePhone: loading.effects['personalCenter/updatePhone'],
    };
})
@Form.create()
class UpdatePhone extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // 确定
    updatePhone = () => {
        const { form, dispatch, updateMobile } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            dispatch({
                type: 'accountKeeperSpace/updatePhone',
                payload: {
                    ...fieldsValue,
                    mobile: updateMobile.mobile,
                },
                callback: () => {
                    this.props.UpdatePhoneModalOk();
                },
            });
        });
    };

    // 取消
    UpdatePhoneModal = () => {
        this.props.UpdatePhoneModal();
    };

    render() {
        const {
            form: { getFieldDecorator },
            updateMobile,
        } = this.props;
        return (
            <div>
                <Modal title="变更手机号码" confirmLoading={this.props.loadingUpdatePhone} destroyOnClose visible maskClosable={false} onOk={this.updatePhone} onCancel={this.UpdatePhoneModal} width={440} okText="确定" cancelText="取消">
                    <div className="formList88">
                        <Form>
                            <Row>
                                <Col span={24}>
                                    <FormItem label="人员姓名">{updateMobile.name}</FormItem>
                                    <FormItem label="新手机号">
                                        {getFieldDecorator('newMobile', {
                                            rules: [
                                                validate.Rule_require,
                                                {
                                                    validator: validate.Rule_tel,
                                                },
                                            ],
                                        })(<Input placeholder="请输入" autoComplete="off" allowClear></Input>)}
                                    </FormItem>
                                    <FormItem
                                        label={
                                            <div className={styles['tip-icon']}>
                                                <span className="iconfont icon-ask ml8 fz14" style={{ color: '#FF9A02' }}></span>
                                            </div>
                                        }
                                        colon={false}>
                                        <div className={styles['update-phone-tip']}>
                                            <div>变更后该用户将使用新手机号登录系统</div>
                                            <div>原手机号将无法登录系统，请慎重操作！</div>
                                        </div>
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

export default UpdatePhone;
