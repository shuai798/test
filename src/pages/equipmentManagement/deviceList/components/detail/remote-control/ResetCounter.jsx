import { Form, Modal, Row, Col, Checkbox } from 'antd';
import React, { Component } from 'react';
import validate from '@/utils/validation';
import { connect } from 'dva';
import enums from '@/i18n/zh-CN/zhCN';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

@connect(({ deviceList, loading }) => {
    return {
        deviceList,
        loadingResetCounter: loading.effects['deviceList/addControlRecord'],
    };
})
@Form.create()
class ResetCounter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            indeterminate: false,
            checkAll: false,
        };
    }

    componentDidMount() {
        const options = [];
        enums.resetCounter.forEach(item => {
            const option = {};
            option.label = item.name;
            option.value = item.code;
            options.push(option);
        });
        this.setState({ options });
    }

    // 取消
    updateResetCounterModalStatus = () => {
        this.props.updateResetCounterModalStatus();
    };

    resetCounter = () => {
        const { form, dispatch, updateResetCounterModalStatus, getTableViewList } = this.props;
        const {
            deviceDetail: { id },
        } = this.props.deviceList;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            dispatch({
                type: 'deviceList/addControlRecord',
                payload: {
                    ...fieldsValue,
                    type: 'RESET_COUNTER',
                    deviceId: id,
                },
                callback: () => {
                    updateResetCounterModalStatus();
                    getTableViewList();
                },
            });
        });
    };

    onChange = checkedList => {
        const { options } = this.state;
        this.setState({
            indeterminate: !!checkedList.length && checkedList.length < options.length,
            checkAll: checkedList.length === enums.resetCounter.length,
        });
    };

    onCheckAllChange = e => {
        const { options } = this.state;
        const optionsValue = [];
        for (let i = 0; i < options.length; i += 1) {
            optionsValue.push(options[i].value);
        }
        if (e.target.checked) {
            this.props.form.setFieldsValue({ resetCounterTypeList: optionsValue });
        } else {
            this.props.form.setFieldsValue({ resetCounterTypeList: [] });
        }
        this.setState({
            indeterminate: false,
            checkAll: e.target.checked,
        });
    };

    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        const { options } = this.state;
        return (
            <Modal
                centered title="复位计数器" destroyOnClose visible maskClosable={false}
                onCancel={this.updateResetCounterModalStatus} width={440} confirmLoading={this.props.loadingResetCounter}
                onOk={this.resetCounter}>
                <div className="formList80">
                    <Form>
                        <Row type="flex">
                            <Col span={24}>
                                <div>
                                    <div>
                                        <Checkbox
                                            indeterminate={this.state.indeterminate}
                                            onChange={this.onCheckAllChange}
                                            checked={this.state.checkAll}
                                        >
                                            全选
                                        </Checkbox>
                                    </div>
                                </div>
                                <FormItem>
                                    {getFieldDecorator('resetCounterTypeList', {
                                        rules: [validate.Rule_require],
                                    })(<CheckboxGroup
                                        options={options}
                                        onChange={this.onChange}
                                    />)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>
        );
    }
}

export default ResetCounter;
