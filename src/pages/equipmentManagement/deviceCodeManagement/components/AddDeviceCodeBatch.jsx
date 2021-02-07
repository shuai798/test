import { Form, Modal, Row, Col, TreeSelect, InputNumber } from 'antd';
import React, { Component } from 'react';
import validate from '@/utils/validation';
import { connect } from 'dva';
import styles from '../index.less';

const FormItem = Form.Item;

@connect(({ deviceCodeManagement, loading }) => {
    return {
        deviceCodeManagement,
        loadingAddDeviceCodeBatch: loading.effects['deviceCodeManagement/addDeviceCodeBatch'],
    };
})
@Form.create()
class AddDeviceCodeBatch extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // 取消
    updateAddDeviceCodeBatchModalStatus = () => {
        this.props.updateAddDeviceCodeBatchModalStatus();
    };

    addDeviceCodeBatch = () => {
        const { form, dispatch, updateAddDeviceCodeBatchModalStatus, getTableViewList } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            const values = {
                ...fieldsValue,
            };
            dispatch({
                type: 'deviceCodeManagement/addDeviceCodeBatch',
                payload: values,
                callback: () => {
                    getTableViewList();
                    updateAddDeviceCodeBatchModalStatus();
                },
            });
        });
    };

    changeDataToTreeSelect = (dataList) => {
        const list = dataList;
        if (list.length > 0) {
            for (let i = 0; i < list.length; i += 1) {
                if (list[i].children && list[i].children.length > 0) {
                    list[i].disabled = true;
                    list[i].children = this.changeDataToTreeSelect(list[i].children, list[i].newValue);
                } else {
                    list[i].children = null;
                }
            }
        }
        return list;
    };

    render() {
        const {
            form: { getFieldDecorator },
            seriesTreeData = [],
        } = this.props;
        const treeData = this.changeDataToTreeSelect(seriesTreeData);
        return (
            <Modal centered title="新增批次" destroyOnClose visible maskClosable={false} onCancel={this.updateAddDeviceCodeBatchModalStatus} width={440} confirmLoading={this.props.loadingAddDeviceCodeBatch} onOk={this.addDeviceCodeBatch}>
                <div className="formList80">
                    <Form>
                        <Row type="flex">
                            <Col span={24}>
                                <FormItem label="系列型号">
                                    {getFieldDecorator('series.id', {
                                        rules: [validate.Rule_require],
                                    })(<TreeSelect style={{ width: 280 }} treeData={treeData} placeholder="请选择" showSearch treeNodeLabelProp="newValue" treeNodeFilterProp="title" dropdownClassName={styles['over-ant-select-tree']} allowClear></TreeSelect>)}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="编码数量">
                                    {getFieldDecorator('noNum', {
                                        rules: [validate.Rule_require],
                                    })(<InputNumber placeholder="请输入" allowClear autoComplete="off" max={100} style={{ width: '100%' }}></InputNumber>)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>
        );
    }
}

export default AddDeviceCodeBatch;
