import { Row, Col, Form, Modal, Radio } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import enums from '@/i18n/zh-CN/zhCN';
import validate from '@/utils/validation';
import { HxIcon } from '@/components/hx-components';
import styles from '../../../index.less';

const FormItem = Form.Item;

@connect(({ deviceList, loading }) => {
    return {
        deviceList,
        loadingEditManagementStatus: loading.effects['deviceList/editManagementStatus'],
    };
})
@Form.create()
class EditManagementStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // 确定
    editManagementStatus = () => {
        const { form, dispatch, updateEditManagementStatusModal, getDeviceDetail } = this.props;
        const {
            deviceDetail: { id },
        } = this.props.deviceList;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            dispatch({
                type: 'deviceList/editManagementStatus',
                payload: {
                    ...fieldsValue,
                    id,
                },
                callback: () => {
                    getDeviceDetail();
                    updateEditManagementStatusModal();
                },
            });
        });
    };

    // 取消
    updateEditManagementStatusModal = () => {
        this.props.updateEditManagementStatusModal();
    };

    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <div>
                <Modal centered title="状态设置" confirmLoading={this.props.loadingEditManagementStatus} destroyOnClose visible maskClosable={false} onOk={this.editManagementStatus} onCancel={this.updateEditManagementStatusModal} width={440}>
                    <div className="formList80">
                        <Form>
                            <Row type="flex">
                                <Col span={24}>
                                    <FormItem label="管理状态">
                                        {getFieldDecorator('managementStatus', {
                                            rules: [validate.Rule_require],
                                        })(
                                            <Radio.Group>
                                                {enums.managementStatus.map((item) => {
                                                    return (
                                                        <Radio key={item.code} value={item.code}>
                                                            {item.name}
                                                        </Radio>
                                                    );
                                                })}
                                            </Radio.Group>,
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <div>
                        <div className={styles['edit-management-icon']}>
                            <HxIcon type="icon-ask"></HxIcon>
                        </div>
                        <div className={styles['edit-management-tip']}>设置禁用后，该设备不可用</div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default EditManagementStatus;
