import React from 'react';
import { Form, Row, Input, Modal, Select, Spin } from 'antd';
import { connect } from 'dva';
import validate from '@/utils/validation';
import { HxSelect } from '@/components/hx-components';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ loading, channelManagement }) => {
    return {
        channelManagement,
        addLoading: loading.effects['channelManagement/addTableInfo'],
        editLoading: loading.effects['channelManagement/editTableInfo'],
        detailsLoading: loading.effects['channelManagement/getAllProjectList'],
    };
})
class ChannelManagementAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allProjectList: [],
        };
    }

    componentDidMount() {
        const { dispatch, customerInfo } = this.props;
        dispatch({
            type: 'channelManagement/getAllProjectList',
            payload: { id: customerInfo && customerInfo.id ? customerInfo.id : '' },
            callback: () => {
                const {
                    channelManagement: { allProjectList },
                } = this.props;
                this.setState({ allProjectList });
            },
        });
    }

    editShow = () => {
        const { form, dispatch, toChannelManagementAdd, customerInfo, record } = this.props;
        // 编辑
        if (record) {
            form.validateFields((err, fieldsValue) => {
                if (err) {
                    return;
                }
                dispatch({
                    type: 'channelManagement/editTableInfo',
                    payload: {
                        ...fieldsValue,
                        customerId: customerInfo && customerInfo.id ? customerInfo.id : '',
                        id: record.id,
                    },
                    callback: () => {
                        toChannelManagementAdd();
                    },
                });
            });
        } else {
            // 新增
            form.validateFields((err, fieldsValue) => {
                if (err) {
                    return;
                }
                dispatch({
                    type: 'channelManagement/addTableInfo',
                    payload: {
                        ...fieldsValue,
                        customerId: customerInfo && customerInfo.id ? customerInfo.id : '',
                    },
                    callback: () => {
                        toChannelManagementAdd();
                    },
                });
            });
        }
    };

    render() {
        const {
            form: { getFieldDecorator },
            toChannelManagementAdd,
            record,
            addLoading,
            editLoading,
            detailsLoading,
        } = this.props;
        const { allProjectList } = this.state;
        return (
            <Modal title={record?.id ? '编辑通道' : '新增通道'} width={420} centered maskClosable={false} visible destroyOnClose confirmLoading={record?.id ? editLoading : addLoading} onOk={this.editShow} onCancel={toChannelManagementAdd}>
                <Spin spinning={detailsLoading}>
                    <div className="formList80">
                        <Form>
                            <Row>
                                <FormItem label="通道名称">
                                    {getFieldDecorator('name', {
                                        initialValue: record && record.name ? record.name : undefined,
                                        rules: [validate.Rule_require, { validator: validate.Rule_name }],
                                    })(<Input allowClear autoComplete="off" placeholder="请输入" maxLength={20}></Input>)}
                                </FormItem>
                            </Row>
                            <FormItem label="所属项目" wrapperCol={{ span: 8 }}>
                                {getFieldDecorator('customerProjectId', {
                                    initialValue: record && record.customerProjectId ? record.customerProjectId : undefined,
                                    rules: [validate.Rule_require],
                                })(
                                    <HxSelect placeholder="请选择" allowClear>
                                        {(allProjectList || []).map((item) => {
                                            return (
                                                <Option key={item.id} value={item.id}>
                                                    {item.name}
                                                </Option>
                                            );
                                        })}
                                    </HxSelect>,
                                )}
                            </FormItem>
                        </Form>
                    </div>
                </Spin>
            </Modal>
        );
    }
}

export default ChannelManagementAdd;
