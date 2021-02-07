import { Row, Col, Form, Input, Modal } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import validate from '@/utils/validation';

const FormItem = Form.Item;

@connect(({ personalCenter, loading }) => {
    return {
        personalCenter,
        loadingUpdateName: loading.effects['personalCenter/updateName'],
    };
})
@Form.create()
class UpdateName extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // 确定
    updateName = () => {
        const { form, dispatch, updateUpdateNameModal, getPersonalInformationDetail } = this.props;
        const { personalInformationDetail = {} } = this.props.personalCenter;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            dispatch({
                type: 'personalCenter/updateName',
                payload: {
                    ...fieldsValue,
                    mobile: personalInformationDetail.mobile,
                },
                callback: () => {
                    getPersonalInformationDetail();
                    updateUpdateNameModal();
                },
            });
        });
    };

    // 取消
    updateUpdateNameModal = () => {
        this.props.updateUpdateNameModal();
    };

    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        const { personalInformationDetail = {} } = this.props.personalCenter;
        return (
            <div>
                <Modal centered title="编辑信息" confirmLoading={this.props.loadingUpdateName} destroyOnClose visible maskClosable={false} onOk={this.updateName} onCancel={this.updateUpdateNameModal} width={440}>
                    <div className="formList80">
                        <Form>
                            <Row>
                                <Col span={24}>
                                    <FormItem label="人员姓名">
                                        {getFieldDecorator('realName', {
                                            rules: [validate.Rule_require, validate.Rule_max32_length],
                                            initialValue: personalInformationDetail.name,
                                        })(<Input placeholder="请输入" allowClear autoComplete="off"></Input>)}
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

export default UpdateName;
