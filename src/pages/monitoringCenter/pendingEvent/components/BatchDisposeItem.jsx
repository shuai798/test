import React from 'react';
import { Modal, Form, Row, Col, Input, Select } from 'antd';
import { connect } from 'dva';
import { HxSelect } from '@/components/hx-components';

const { Option } = Select;
const FormItem = Form.Item;

@connect(({ dataDictionarySpace, loading }) => {
    return {
        dataDictionarySpace,
        loading,
    };
})
@Form.create()
class DisposeItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    clickOk = () => {
        const { form, dispatch, ids } = this.props;
        // 新增
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            dispatch({
                type: 'pendingEventSpace/dispose',
                payload: {
                    ...values,
                    ids,
                },
                callback: () => {
                    this.props.okBatchDispose();
                },
            });
        });
    };

    clickCancel = () => {
        this.props.cancleBatchDispose();
    };

    handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    render() {
        const {
            form: { getFieldDecorator },
            ids,
        } = this.props;
        return (
            <div>
                <Modal title="批量处理" destroyOnClose visible maskClosable={false} onOk={this.clickOk} okText="确定" onCancel={this.clickCancel} cancelText="取消" width={440} getContainer={false}>
                    <div className="formList80">
                        <Form>
                            <Row type="flex" gutter={20}>
                                <Col span={24}>
                                    <FormItem label="事件数量">{ids && ids.length > 0 ? ids.length : null}</FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="处理结果">
                                        {getFieldDecorator('deviceEventResult', {
                                            initialValue: 'MANUAL_HANDLE',
                                        })(
                                            <HxSelect placeholder="请选择">
                                                <Option value="MANUAL_HANDLE">人工现场处理</Option>
                                                <Option value="RETURNED_TO_NORMAL">系统已恢复正常</Option>
                                                <Option value="NO_HANDLE">暂不处理</Option>
                                            </HxSelect>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="备注信息">
                                        {getFieldDecorator('remark', {
                                            // initialValue: true,
                                        })(<Input placeholder="请输入" maxLength={32}></Input>)}
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

export default DisposeItem;
