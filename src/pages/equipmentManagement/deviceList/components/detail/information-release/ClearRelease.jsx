import { Form, Modal, Row, Col, Input, Upload, Button, message, Icon, Table, Select, Checkbox } from 'antd';
import React, { Component } from 'react';
import Api from '@/utils/api';
import storage from '@/utils/storage';
import validate from '@/utils/validation';
import { connect } from 'dva';
import styles from '../../../index.less';
import enums from '@/i18n/zh-CN/zhCN';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ deviceList, loading }) => {
    return {
        deviceList,
        loadingClearInformationRelease: loading.effects['deviceList/clearInformationRelease'],
    };
})
@Form.create()
class ClearRelease extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLocation: '',
        };
    }

    // 取消
    updateClearReleaseModalStatus = () => {
        this.props.updateClearReleaseModalStatus();
    };

    clearInformationRelease = () => {
        const { form, dispatch, updateClearReleaseModalStatus, getTableViewList } = this.props;
        const {
            deviceDetail: { id },
        } = this.props.deviceList;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            const values = {
                ...fieldsValue,
                deviceId: id,
                operationType: 'CLEAR',
            };
            dispatch({
                type: 'deviceList/addInformationRelease',
                payload: values,
                callback: () => {
                    getTableViewList();
                    updateClearReleaseModalStatus();
                },
            });
        });
    };

    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        const pathTypeOptions = [];
        enums.pathTypeList.map(pathType => {
            pathTypeOptions.push({ label: pathType.name, value: pathType.code });
        });
        return (
            <Modal centered title="清除发布" destroyOnClose visible maskClosable={false}
                   onCancel={this.updateClearReleaseModalStatus} width={440}
                   confirmLoading={this.props.loadingClearInformationRelease} onOk={this.clearInformationRelease}
            >
                <div className="formList80">
                    <Form>
                        <Row type="flex">
                            <Col span={24}>
                                <FormItem label="通道类型">
                                    {getFieldDecorator('pathTypelist', {
                                        rules: [validate.Rule_require],
                                    })(
                                        <Checkbox.Group options={pathTypeOptions} />,
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="显示位置">
                                    {getFieldDecorator('location', {
                                        rules: [validate.Rule_require],
                                    })(<Select placeholder="请选择" onChange={this.locationChange}>
                                        {enums.deviceInformationLocation.map(pathType => <Option key={pathType.code}
                                                                                                 value={pathType.code}>{pathType.name}</Option>)}
                                    </Select>)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>
        );
    }
}

export default ClearRelease;
