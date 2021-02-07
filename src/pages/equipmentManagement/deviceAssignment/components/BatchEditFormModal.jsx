import { Row, Col, Modal, Form, Select } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { HxSelect } from '@/components/hx-components/index';
import validate from '@/utils/validation';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ loading, deviceAssignment }) => {
    return {
        deviceAssignment,
        loadingUpdate: loading.effects['deviceAssignment/batchUpdateDeviceAssignment'],
    };
})
@Form.create()
class BatchEditFormModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customerList: [],
            distributionObjectType: '',
        };
    }

    componentDidMount() {}

    changeDataToTreeSelect = (dataList, name) => {
        const list = dataList;
        if (list.length > 0) {
            for (let i = 0; i < list.length; i += 1) {
                list[i].value = list[i].id;
                list[i].title = list[i].name;
                // 用于回显全路径
                list[i].newValue = name !== '' ? `${name} / ${list[i].name}` : list[i].name;
                if (list[i].children && list[i].children.length > 0) {
                    list[i].children = this.changeDataToTreeSelect(list[i].children, list[i].newValue);
                } else {
                    list[i].children = null;
                }
            }
        }
        return list;
    };

    handleEdit = () => {
        const { form, dispatch, updateBatchEditModalStatus, getTableViewList, selectedRowList } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            const { distributionObjectType } = this.state;
            const { distributionObjectId } = fieldsValue;
            const editList = [];
            selectedRowList.map((item) => {
                const editItem = {
                    id: item.id,
                    distributionObjectId,
                    type: distributionObjectType,
                };
                editList.push(editItem);
            });
            dispatch({
                type: 'deviceAssignment/batchUpdateDeviceAssignment',
                payload: editList,
                callback: () => {
                    getTableViewList();
                    updateBatchEditModalStatus();
                },
            });
        });
    };

    cancelBatchEdit = () => {
        this.props.updateBatchEditModalStatus();
    };

    handleSearch = (value) => {
        if (value) {
            this.fetch(value, (data) => {
                return this.setState({ customerList: data });
            });
        } else {
            this.setState({ customerList: [] });
        }
    };

    fetch = (value, callback) => {
        let {
            deviceAssignment: { customerList = [] },
        } = this.props;
        customerList = customerList.filter((customer) => {
            return customer.name.indexOf(value) > -1;
        });
        callback(customerList);
    };

    handleChangeCustomer = (customerId, event) => {
        if (!customerId) {
            this.setState({
                customerList: [],
                distributionObjectType: '',
            });
        } else {
            const {
                props: { type },
            } = event;
            this.setState({ distributionObjectType: type });
        }
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
        const { getFieldDecorator } = this.props.form;
        const { selectedRowList = [] } = this.props;
        const { customerList = [] } = this.state;
        const options = customerList.map((customer) => {
            return (
                <Option key={customer.id} value={customer.id} type={customer.type}>
                    {customer.name}
                </Option>
            );
        });
        return (
            <div>
                <Modal title="批量分配" centered confirmLoading={this.props.loadingUpdate} destroyOnClose visible maskClosable={false} onOk={this.handleEdit} onCancel={this.cancelBatchEdit} width={440}>
                    <div className="formList100">
                        <Form>
                            <Row type="flex" gutter={20}>
                                <Col span={24}>
                                    <FormItem label="设备数量">
                                        <span>{selectedRowList.length}</span>
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="分配对象">
                                        {getFieldDecorator('distributionObjectId', {
                                            rules: [validate.Rule_require],
                                        })(
                                            <HxSelect showSearch placeholder="请输入" style={{ width: 244 }} defaultActiveFirstOption={false} showArrow={false} filterOption={false} onSearch={this.handleSearch} notFoundContent={null} allowClear onChange={this.handleChangeCustomer}>
                                                {options}
                                            </HxSelect>,
                                        )}
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

export default BatchEditFormModal;
