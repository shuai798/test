import { Form, Modal, Row, Col, Checkbox, Input, Icon, Upload, message, Select, DatePicker } from 'antd';
import React, { Component } from 'react';
import validate from '@/utils/validation';
import Api from '@/utils/api';
import storage from '@/utils/storage';
import enums from '@/i18n/zh-CN/zhCN';
import { connect } from 'dva';
import moment from 'moment';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ deviceList, loading }) => {
    return {
        deviceList,
        loadingUpdateRepairRecord: loading.effects['deviceList/updateRepairRecord'],
    };
})
@Form.create()
class EditRepairRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            employeeList: [],
        };
    }

    componentDidMount() {
        let {
            deviceList: { employeeList = [] },
        } = this.props;
        const {
            deviceList: { repairRecordDetail = {} },
        } = this.props;
        employeeList = employeeList.filter((employee) => {
            return employee.id === repairRecordDetail.employeeId;
        });
        const { imageUrlList = [] } = repairRecordDetail;
        const fileList = [];
        imageUrlList.map((image, index) => {
            const item = {};
            item.key = index;
            item.uid = index;
            item.status = 'done';
            item.url = storage.getStorage('downloadUrl') + image;
            item.fileId = image;
            fileList.push(item);
        });
        this.setState({ employeeList, fileList });
    }

    // 取消
    updateEditRepairRecordModalStatus = () => {
        this.props.updateEditRepairRecordModalStatus();
    };

    updateRepairRecord = () => {
        const { form, dispatch, updateEditRepairRecordModalStatus, getTableViewList } = this.props;
        const {
            deviceDetail: { id },
            repairRecordDetail = {},
        } = this.props.deviceList;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            const { fileList } = this.state;
            const imageUrlList = [];
            fileList.map((file) => {
                const fileId = file.response ? file.response.data.fileId : file.fileId;
                imageUrlList.push(fileId);
            });
            dispatch({
                type: 'deviceList/updateRepairRecord',
                payload: {
                    ...fieldsValue,
                    maintenanceTime: fieldsValue.maintenanceTime.format('YYYY-MM-DD HH:mm:ss'),
                    deviceId: id,
                    id: repairRecordDetail.id,
                    imageUrlList,
                },
                callback: () => {
                    getTableViewList();
                    updateEditRepairRecordModalStatus();
                },
            });
        });
    };

    handleCancel = () => {
        return this.setState({ previewVisible: false });
    };

    handlePreview = async (file) => {
        const currentFile = file;
        if (!currentFile.url && !currentFile.preview) {
            currentFile.preview = await this.getBase64(currentFile.originFileObj);
        }
        this.setState({
            previewImage: currentFile.url || currentFile.preview,
            previewVisible: true,
        });
    };

    handleChange = ({ file, fileList }) => {
        if (file.status) {
            this.setState({ fileList });
        }
        if (file.status === 'done') {
            message.success('上传成功');
        }
        if (file.status === 'error') {
            message.error('上传失败');
        }
    };

    getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                return resolve(reader.result);
            };
            reader.onerror = (error) => {
                return reject(error);
            };
        });
    };

    handleRemovePhoto = (file) => {
        let { fileList } = this.state;
        fileList = fileList.filter((fileItem) => {
            return fileItem.uid !== file.uid;
        });
        this.setState({ fileList });
    };

    handleSearch = (value) => {
        if (value) {
            this.fetch(value, (data) => {
                return this.setState({ employeeList: data });
            });
        } else {
            this.setState({ employeeList: [] });
        }
    };

    fetch = (value, callback) => {
        let {
            deviceList: { employeeList = [] },
        } = this.props;
        employeeList = employeeList.filter((employee) => {
            return employee.name.indexOf(value) > -1 || employee.mobile.indexOf(value) > -1;
        });
        callback(employeeList);
    };

    handleChangeEmployee = (employeeId) => {
        if (!employeeId) {
            this.setState({ employeeList: [] });
        }
    };

    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">点击上传</div>
            </div>
        );
        const Authorization = storage.getStorage('authorization');
        const clientId = storage.getStorage('clientId');
        const { repairRecordDetail = {} } = this.props.deviceList;
        const { employeeList = [] } = this.state;
        return (
            <Modal
                centered title="编辑维修" destroyOnClose visible maskClosable={false}
                onCancel={this.updateEditRepairRecordModalStatus} width={832}
                confirmLoading={this.props.loadingUpdateRepairRecord} onOk={this.updateRepairRecord}>
                <div className="formList80">
                    <Form>
                        <Row type="flex" gutter={20}>
                            <Col span={24}>
                                <FormItem label="维修单元">
                                    {getFieldDecorator('unitTypeList', {
                                        rules: [validate.Rule_require],
                                        initialValue: repairRecordDetail.unitTypeList,
                                    })(
                                        <Checkbox.Group>
                                            <Row type="flex" gutter={20}>
                                                {enums.deviceUnitType.map((item) => {
                                                    return (
                                                        <Col span={6} key={item.code}>
                                                            <Checkbox value={item.code}>{item.name}</Checkbox>
                                                        </Col>
                                                    );
                                                })}
                                            </Row>
                                        </Checkbox.Group>,
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="维修人员">
                                    {getFieldDecorator('employeeId', {
                                        rules: [validate.Rule_require],
                                        initialValue: repairRecordDetail.employeeId,
                                    })(
                                        <Select
                                            showSearch style={{ width: 284 }} placeholder="请输入"
                                            defaultActiveFirstOption={false} showArrow={false} filterOption={false}
                                            onSearch={this.handleSearch} notFoundContent={null} allowClear
                                            onChange={this.handleChangeEmployee}>
                                            {employeeList.map((employee) => {
                                                return (
                                                    <Option key={employee.id} value={employee.id}>
                                                        {employee.name}
                                                        {employee.mobile ? (
                                                            <span>
                                                                <span className="mr5 ml5">/</span>
                                                                <span>{employee.mobile}</span>
                                                            </span>
                                                        ) : null}
                                                    </Option>
                                                );
                                            })}
                                        </Select>,
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="维修时间">
                                    {getFieldDecorator('maintenanceTime', {
                                        rules: [validate.Rule_require],
                                        initialValue: repairRecordDetail.maintenanceTime ? moment(repairRecordDetail.maintenanceTime, 'YYYY-MM-DD HH:mm:ss') : undefined,
                                    })(<DatePicker placeholder="请选择" showTime style={{ width: 284 }}></DatePicker>)}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="情况描述">
                                    {getFieldDecorator('description', {
                                        rules: [validate.Rule_max100_length],
                                        initialValue: repairRecordDetail.description,
                                    })(<TextArea placeholder="请输入" autoSize={{ minRows: 2, maxRows: 4 }}></TextArea>)}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="现场图片">
                                    {getFieldDecorator('imageUrlList')(
                                        <Upload
                                            action={`${Api.host.default}/fileservice/w/fileManage/common/file?business=SYSTEM`}
                                            name="file" headers={{ Authorization, clientId }}
                                            accept=".jpg,.png,.gif,.jpeg" listType="picture-card" fileList={fileList}
                                            onPreview={this.handlePreview} onChange={this.handleChange}
                                            onRemove={this.handleRemovePhoto}>
                                            {fileList.length >= 8 ? null : uploadButton}
                                        </Upload>,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <Modal centered width={440} visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </Modal>
        );
    }
}

export default EditRepairRecord;
