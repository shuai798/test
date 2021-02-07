import { Row, Col, Form, Input, Modal, Select, Radio } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import { HxSelect } from '@/components/hx-components';
import enums from '@/i18n/zh-CN/zhCN';
import validate from '@/utils/validation';
import styles from '../../../index.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ deviceList, loading }) => {
    return {
        deviceList,
        loadingEditParameter: loading.effects['deviceList/resetPassword'],
    };
})
@Form.create()
class EditParameter extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // 确定
    editParameter = () => {
        const { form, dispatch, updateEditParameterModal, getParameterSettings } = this.props;
        const {
            deviceDetail: { id },
        } = this.props.deviceList;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            dispatch({
                type: 'deviceList/editParameter',
                payload: {
                    ...fieldsValue,
                    id,
                },
                callback: () => {
                    getParameterSettings();
                    updateEditParameterModal();
                },
            });
        });
    };

    // 取消
    updateEditParameterModal = () => {
        this.props.updateEditParameterModal();
    };

    parameterLimit = (rule, value, callback, min, max) => {
        const reg = new RegExp(/^[0-9]+$/);
        if (value && !reg.test(value)) {
            callback('请输入正整数');
        }
        const valueNum = parseInt(value);
        if (valueNum < min || valueNum > max) {
            callback(`请输入${min}到${max}的整数`);
        }
        callback();
    };

    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        const { parameterSettings = {} } = this.props.deviceList;
        return (
            <div>
                <Modal centered title="参数设置" confirmLoading={this.props.loadingEditParameter} destroyOnClose visible maskClosable={false} onOk={this.editParameter} onCancel={this.updateEditParameterModal} width={1096} bodyStyle={{ height: 'calc(75vh - 92px)', overflow: 'auto' }}>
                    <div className="formList120">
                        <Form>
                            <Row type="flex" gutter={20}>
                                <Col span={10}>
                                    <FormItem label="禁用报警提醒">
                                        {getFieldDecorator('disableAlarm', { initialValue: parameterSettings.disableAlarm })(
                                            <Radio.Group>
                                                <Radio value>是</Radio>
                                                <Radio value={false}>否</Radio>
                                            </Radio.Group>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}>
                                </Col>
                                <Col span={10}>
                                    <FormItem label="延迟关闸时间">
                                        {getFieldDecorator('delayClosingTime', {
                                            rules: [
                                                validate.Rule_require,
                                                {
                                                    validator: (rule, value, callback) => {
                                                        return this.parameterLimit(rule, value, callback, 0, 60);
                                                    },
                                                },
                                            ],
                                            initialValue: parameterSettings.delayClosingTime,
                                        })(<Input placeholder="请输入" addonAfter="秒" autoComplete="off" allowClear></Input>)}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}>
                                    0~60
                                </Col>
                                <Col span={10}>
                                    <FormItem label="无人通行时间">
                                        {getFieldDecorator('unattendedTime', {
                                            rules: [
                                                validate.Rule_require,
                                                {
                                                    validator: (rule, value, callback) => {
                                                        return this.parameterLimit(rule, value, callback, 2, 60);
                                                    },
                                                },
                                            ],
                                            initialValue: parameterSettings.unattendedTime,
                                        })(<Input placeholder="请输入" addonAfter="秒" autoComplete="off" allowClear></Input>)}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}>
                                    2~60
                                </Col>
                                <Col span={10}>
                                    <FormItem label="开闸速度">
                                        {getFieldDecorator('openingSpeed', {
                                            rules: [
                                                validate.Rule_require,
                                                {
                                                    validator: (rule, value, callback) => {
                                                        return this.parameterLimit(rule, value, callback, 1, 100);
                                                    },
                                                },
                                            ],
                                            initialValue: parameterSettings.openingSpeed,
                                        })(<Input placeholder="请输入" autoComplete="off" allowClear></Input>)}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}>
                                    1~100
                                </Col>
                                <Col span={10}>
                                    <FormItem label="关闸速度">
                                        {getFieldDecorator('closingSpeed', {
                                            rules: [
                                                validate.Rule_require,
                                                {
                                                    validator: (rule, value, callback) => {
                                                        return this.parameterLimit(rule, value, callback, 1, 100);
                                                    },
                                                },
                                            ],
                                            initialValue: parameterSettings.closingSpeed,
                                        })(<Input placeholder="请输入" autoComplete="off" allowClear></Input>)}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}>
                                    1~100
                                </Col>
                                <Col span={10}>
                                    <FormItem label="开闸减速速度">
                                        {getFieldDecorator('openingDecelerationSpeed', {
                                            rules: [
                                                validate.Rule_require,
                                                {
                                                    validator: (rule, value, callback) => {
                                                        return this.parameterLimit(rule, value, callback, 2, 30);
                                                    },
                                                },
                                            ],
                                            initialValue: parameterSettings.openingDecelerationSpeed,
                                        })(<Input placeholder="请输入" autoComplete="off" allowClear></Input>)}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}>
                                    2~30
                                </Col>
                                <Col span={10}>
                                    <FormItem label="关闸减速速度">
                                        {getFieldDecorator('closingDecelerationSpeed', {
                                            rules: [
                                                validate.Rule_require,
                                                {
                                                    validator: (rule, value, callback) => {
                                                        return this.parameterLimit(rule, value, callback, 2, 30);
                                                    },
                                                },
                                            ],
                                            initialValue: parameterSettings.closingDecelerationSpeed,
                                        })(<Input placeholder="请输入" autoComplete="off" allowClear></Input>)}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}>
                                    2~30
                                </Col>
                                <Col span={10}>
                                    <FormItem label="开闸减速行程">
                                        {getFieldDecorator('openingDecelerationTravel', {
                                            rules: [
                                                validate.Rule_require,
                                                {
                                                    validator: (rule, value, callback) => {
                                                        return this.parameterLimit(rule, value, callback, 10, 25);
                                                    },
                                                },
                                            ],
                                            initialValue: parameterSettings.openingDecelerationTravel,
                                        })(<Input placeholder="请输入" autoComplete="off" allowClear></Input>)}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}>
                                    10~25
                                </Col>
                                <Col span={10}>
                                    <FormItem label="关闸减速行程">
                                        {getFieldDecorator('closingDecelerationTravel', {
                                            rules: [
                                                validate.Rule_require,
                                                {
                                                    validator: (rule, value, callback) => {
                                                        return this.parameterLimit(rule, value, callback, 10, 25);
                                                    },
                                                },
                                            ],
                                            initialValue: parameterSettings.closingDecelerationTravel,
                                        })(<Input placeholder="请输入" autoComplete="off" allowClear></Input>)}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}>
                                    10~25
                                </Col>
                                <Col span={10}>
                                    <FormItem label="冲门行程">
                                        {getFieldDecorator('rushTravel', {
                                            rules: [
                                                validate.Rule_require,
                                                {
                                                    validator: (rule, value, callback) => {
                                                        return this.parameterLimit(rule, value, callback, 1, 100);
                                                    },
                                                },
                                            ],
                                            initialValue: parameterSettings.rushTravel,
                                        })(<Input placeholder="请输入" autoComplete="off" allowClear></Input>)}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}>
                                    1~100
                                </Col>
                                <Col span={10}>
                                    <FormItem label="力度调节">
                                        {getFieldDecorator('strengthAdjustment', {
                                            rules: [
                                                validate.Rule_require,
                                                {
                                                    validator: (rule, value, callback) => {
                                                        return this.parameterLimit(rule, value, callback, 5, 50);
                                                    },
                                                },
                                            ],
                                            initialValue: parameterSettings.strengthAdjustment,
                                        })(<Input placeholder="请输入" autoComplete="off" allowClear></Input>)}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}>
                                    5~50
                                </Col>
                                <Col span={10}>
                                    <FormItem label="离合报警设置">
                                        {getFieldDecorator('clutchAlarmSetting', { initialValue: parameterSettings.clutchAlarmSetting })(
                                            <Select allowClear placeholder="请选择">
                                                {enums.clutchAlarmSetting.map((item) => {
                                                    return (
                                                        <Option key={item.code} value={item.code}>
                                                            {item.name}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}></Col>
                                <Col span={10}>
                                    <FormItem label="逗留时间">
                                        {getFieldDecorator('residenceTime', {
                                            rules: [
                                                validate.Rule_require,
                                                {
                                                    validator: (rule, value, callback) => {
                                                        return this.parameterLimit(rule, value, callback, 0, 60);
                                                    },
                                                },
                                            ],
                                            initialValue: parameterSettings.residenceTime,
                                        })(<Input placeholder="请输入" addonAfter="秒" autoComplete="off" allowClear></Input>)}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}>
                                    0~60
                                </Col>
                                <Col span={10}>
                                    <FormItem label="反向闯入">
                                        {getFieldDecorator('reverseEntry', { initialValue: parameterSettings.reverseEntry })(
                                            <HxSelect allowClear placeholder="请选择">
                                                {enums.gateSetting.map((item) => {
                                                    return (
                                                        <Option key={item.code} value={item.code}>
                                                            {item.name}
                                                        </Option>
                                                    );
                                                })}
                                            </HxSelect>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}></Col>
                                <Col span={10}>
                                    <FormItem label="尾随进入">
                                        {getFieldDecorator('followIn', { initialValue: parameterSettings.followIn })(
                                            <HxSelect allowClear placeholder="请选择">
                                                {enums.gateSetting.map((item) => {
                                                    return (
                                                        <Option key={item.code} value={item.code}>
                                                            {item.name}
                                                        </Option>
                                                    );
                                                })}
                                            </HxSelect>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}></Col>
                                <Col span={10}>
                                    <FormItem label="防夹区域设置">
                                        {getFieldDecorator('infraredRegion', { initialValue: parameterSettings.infraredRegion })(
                                            <HxSelect allowClear placeholder="请选择">
                                                {enums.infraredRegion.map((item) => {
                                                    return (
                                                        <Option key={item.code} value={item.code}>
                                                            {item.name}
                                                        </Option>
                                                    );
                                                })}
                                            </HxSelect>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}></Col>
                                <Col span={10}>
                                    <FormItem label="防夹设置">
                                        {getFieldDecorator('avoidPinchedSetting', { initialValue: parameterSettings.avoidPinchedSetting })(
                                            <HxSelect allowClear placeholder="请选择">
                                                {enums.avoidPinchedSetting.map((item) => {
                                                    return (
                                                        <Option key={item.code} value={item.code}>
                                                            {item.name}
                                                        </Option>
                                                    );
                                                })}
                                            </HxSelect>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}></Col>
                                <Col span={10}>
                                    <FormItem label="消防模式">
                                        {getFieldDecorator('fireProtectionMode', { initialValue: parameterSettings.fireProtectionMode })(
                                            <HxSelect allowClear placeholder="请选择">
                                                {enums.fireProtectionMode.map((item) => {
                                                    return (
                                                        <Option key={item.code} value={item.code}>
                                                            {item.name}
                                                        </Option>
                                                    );
                                                })}
                                            </HxSelect>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}></Col>
                                <Col span={10}>
                                    <FormItem label="音量设置">
                                        {getFieldDecorator('volumeSetting', {
                                            rules: [
                                                {
                                                    validator: (rule, value, callback) => {
                                                        return this.parameterLimit(rule, value, callback, 0, 100);
                                                    },
                                                },
                                            ],
                                            initialValue: parameterSettings.volumeSetting,
                                        })(<Input placeholder="请输入" allowClear autoComplete="off"></Input>)}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}>
                                    0~100
                                </Col>
                                <Col span={10}>
                                    <FormItem label="语音切换">
                                        {getFieldDecorator('voiceSwitch', { initialValue: parameterSettings.voiceSwitch })(
                                            <HxSelect allowClear placeholder="请选择">
                                                {enums.voiceSwitch.map((item) => {
                                                    return (
                                                        <Option key={item.code} value={item.code}>
                                                            {item.name}
                                                        </Option>
                                                    );
                                                })}
                                            </HxSelect>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}></Col>
                                <Col span={10}>
                                    <FormItem label="验证方式">
                                        {getFieldDecorator('verifyInChannel', { initialValue: parameterSettings.verifyInChannel })(
                                            <Radio.Group>
                                                <Radio value>允许通道内验证</Radio>
                                                <Radio value={false}>不允许通道内验证</Radio>
                                            </Radio.Group>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}></Col>
                                <Col span={10}>
                                    <FormItem label="记忆开闸">
                                        {getFieldDecorator('memoryOpen', { initialValue: parameterSettings.memoryOpen })(
                                            <Radio.Group>
                                                <Radio value={false}>关闭</Radio>
                                                <Radio value>开启</Radio>
                                            </Radio.Group>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}></Col>
                                <Col span={10}>
                                    <FormItem label="报警设置">
                                        {getFieldDecorator('alarmSetting', { initialValue: parameterSettings.alarmSetting })(
                                            <Radio.Group>
                                                <Radio value={false}>关闭</Radio>
                                                <Radio value>开启</Radio>
                                            </Radio.Group>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}></Col>
                                <Col span={10}>
                                    <FormItem label="出入口交换">
                                        {getFieldDecorator('gateSwitch', { initialValue: parameterSettings.gateSwitch })(
                                            <Radio.Group>
                                                <Radio value={false}>关闭</Radio>
                                                <Radio value>开启</Radio>
                                            </Radio.Group>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={2} className={styles['parameter-limit']}></Col>
                            </Row>
                        </Form>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default EditParameter;
