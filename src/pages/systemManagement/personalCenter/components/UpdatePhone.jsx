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
        const { form, dispatch, updateUpdatePhoneModal, getPersonalInformationDetail } = this.props;
        const { personalInformationDetail = {} } = this.props.personalCenter;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            dispatch({
                type: 'personalCenter/updatePhone',
                payload: {
                    ...fieldsValue,
                    mobile: personalInformationDetail.mobile,
                },
                callback: () => {
                    getPersonalInformationDetail();
                    updateUpdatePhoneModal();
                },
            });
        });
    };

    // 取消
    updateUpdatePhoneModal = () => {
        this.props.updateUpdatePhoneModal();
    };

    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        const { personalInformationDetail = {} } = this.props.personalCenter;
        return (
            <div>
                <Modal centered title="变更手机号码" confirmLoading={this.props.loadingUpdatePhone} destroyOnClose visible maskClosable={false} onOk={this.updatePhone} onCancel={this.updateUpdatePhoneModal} width={440}>
                    <div className="formList80">
                        <Form>
                            <Row>
                                <Col span={24}>
                                    <FormItem label="新手机号">
                                        {getFieldDecorator('newMobile', {
                                            rules: [
                                                validate.Rule_require,
                                                {
                                                    validator: validate.Rule_tel,
                                                },
                                            ],
                                            initialValue: personalInformationDetail.mobile,
                                        })(<Input placeholder="请输入" autoComplete="off" allowClear></Input>)}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <div>
                        <div className={styles['tip-icon']}>
                            <span className="iconfont icon-ask ml8 fz14" style={{ color: '#FF9A02' }}></span>
                        </div>
                        <div className={styles['update-phone-tip']}>
                            <div>变更后该用户将使用新手机号登录系统</div>
                            <div>原手机号将无法登录系统，请慎重操作！</div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default UpdatePhone;
