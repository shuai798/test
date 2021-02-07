import { Row, Col, Modal, Form, Input, Select, TreeSelect } from 'antd';
import React from 'react';
import { connect } from 'dva';
import validate from '@/utils/validation';
import indexStyle from '../index.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ loading, deviceAssignment }) => {
    return {
        deviceAssignment,
        loadingUpdate: loading.effects['deviceAssignment/updateDeviceAssignment'],
    };
})
@Form.create()
class EditFormModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            distributionObjectType: '',
            deviceNoList: [],
        };
    }

    componentDidMount() {
        const {
            deviceAssignmentDetail: { type, seriesId, no },
        } = this.props.deviceAssignment;
        this.getDeviceNoListBySeriesId(seriesId);
        this.props.form.setFieldsValue({ no });
        this.setState({ distributionObjectType: type });
    }

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
        const { form, dispatch, editTableListOK } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            const { distributionObjectType } = this.state;
            const item = {
                ...fieldsValue,
                type: distributionObjectType,
            };
            delete item.distributionObjectName;
            dispatch({
                type: 'deviceAssignment/updateDeviceAssignment',
                payload: item,
                callback: () => {
                    editTableListOK();
                },
            });
        });
    };

    cancelEdit = () => {
        this.props.hideEditModal();
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

    handleChangeSeries = (seriesId) => {
        if (seriesId) {
            this.getDeviceNoListBySeriesId(seriesId);
        } else {
            this.setState({ deviceNoList: [] });
        }
        this.props.form.resetFields(['no']);
    };

    getDeviceNoListBySeriesId = (seriesId) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceAssignment/getDeviceNoListBySeriesId',
            payload: { seriesId },
            callback: () => {
                const { deviceNoList = [], deviceAssignmentDetail = {} } = this.props.deviceAssignment;
                if (seriesId === deviceAssignmentDetail.seriesId) {
                    deviceNoList.push({
                        id: deviceAssignmentDetail.no,
                        no: deviceAssignmentDetail.no,
                    });
                }
                this.setState({ deviceNoList });
            },
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { seriesTreeData = [] } = this.props;
        const { deviceNoList = [] } = this.state;
        const treeData = this.changeDataToTreeSelect(seriesTreeData);
        const { deviceAssignmentDetail = {} } = this.props.deviceAssignment;
        return (
            <div>
                <Modal title="编辑分配" centered confirmLoading={this.props.loadingUpdate} destroyOnClose visible maskClosable={false} onOk={this.handleEdit} onCancel={this.cancelEdit} width={440}>
                    <div className="formList100">
                        <Form>
                            <Row type="flex">
                                <FormItem style={{ display: 'none' }}>
                                    {getFieldDecorator('distributionObjectId', {
                                        initialValue: deviceAssignmentDetail.distributionObjectId,
                                    })(<Input></Input>)}
                                </FormItem>
                                <Col span={24}>
                                    <FormItem label="分配对象">
                                        <span>{deviceAssignmentDetail.distributionObjectName}</span>
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="系列型号">
                                        {getFieldDecorator('seriesId', {
                                            rules: [validate.Rule_require],
                                            initialValue: deviceAssignmentDetail.seriesId,
                                        })(<TreeSelect treeData={treeData} style={{ width: 260 }} placeholder="请选择" showSearch treeNodeLabelProp="newValue" treeNodeFilterProp="title" dropdownClassName={indexStyle['over-ant-select-tree']} allowClear onChange={this.handleChangeSeries}></TreeSelect>)}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="设备编码">
                                        {getFieldDecorator('no', {
                                            rules: [validate.Rule_require],
                                        })(
                                            <Select showSearch placeholder="请选择" allowClear>
                                                {deviceNoList.map((deviceNo) => {
                                                    return (
                                                        <Option key={deviceNo.id} value={deviceNo.no}>
                                                            {deviceNo.no}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={24}>
                                    <FormItem label="控制器编码">
                                        {getFieldDecorator('controllerNo', {
                                            rules: [validate.Rule_require],
                                            initialValue: deviceAssignmentDetail.controllerNo,
                                        })(<Input placeholder="请输入" allowClear autoComplete="off"></Input>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            {/* 方便获取id */}
                            <div style={{ display: 'none' }}>
                                <FormItem label="id">
                                    {getFieldDecorator('id', {
                                        initialValue: deviceAssignmentDetail.id,
                                    })(<Input></Input>)}
                                </FormItem>
                            </div>
                        </Form>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default EditFormModal;
