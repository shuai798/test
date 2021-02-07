import { Form, Modal, Row, Col, Input, Icon, Upload, message, Select, DatePicker } from 'antd';
import React, { Component } from 'react';
import validate from '@/utils/validation';
import Api from '@/utils/api';
import storage from '@/utils/storage';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ deviceList, loading }) => {
    return {
        deviceList,
        loadingAddMaintenanceRecord: loading.effects['deviceList/addMaintenanceRecord'],
    };
})
@Form.create()
class AddMaintenanceRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            employeeList: [],
        };
    }

    // 取消
    updateAddMaintenanceRecordModalStatus = () => {
        this.props.updateAddMaintenanceRecordModalStatus();
    };

    addMaintenanceRecord = () => {
        const { form, dispatch, updateAddMaintenanceRecordModalStatus, getTableViewList } = this.props;
        const {
            deviceDetail: { id },
        } = this.props.deviceList;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            const { fileList } = this.state;
            const imageUrlList = [];
            fileList.map((file) => {
                const { data } = file.response;
                imageUrlList.push(data.fileId);
            });
            dispatch({
                type: 'deviceList/addMaintenanceRecord',
                payload: {
                    ...fieldsValue,
                    upkeepTime: fieldsValue.upkeepTime.format('YYYY-MM-DD HH:mm:ss'),
                    deviceId: id,
                    imageUrlList,
                },
                callback: () => {
                    getTableViewList();
                    updateAddMaintenanceRecordModalStatus();
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
        const { employeeList = [] } = this.state;
        return (
            <Modal centered title="新增维保" destroyOnClose visible maskClosable={false} onCancel={this.updateAddMaintenanceRecordModalStatus} width={832} confirmLoading={this.props.loadingAddMaintenanceRecord} onOk={this.addMaintenanceRecord}>
                <div className="formList80">
                    <Form>
                        <Row type="flex" gutter={20}>
                            <Col span={12}>
                                <FormItem label="维保人员">
                                    {getFieldDecorator('employeeId', {
                                        rules: [validate.Rule_require],
                                    })(
                                        <Select style={{ width: 284 }} showSearch placeholder="请输入" defaultActiveFirstOption={false} showArrow={false} filterOption={false} onSearch={this.handleSearch} notFoundContent={null} allowClear onChange={this.handleChangeEmployee}>
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
                                <FormItem label="维保时间">
                                    {getFieldDecorator('upkeepTime', {
                                        rules: [validate.Rule_require],
                                    })(<DatePicker style={{ width: 284 }} placeholder="请选择" showTime></DatePicker>)}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="情况描述">
                                    {getFieldDecorator('description', {
                                        rules: [validate.Rule_max100_length],
                                    })(<TextArea placeholder="请输入" autoSize={{ minRows: 2, maxRows: 4 }}></TextArea>)}
                                </FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="现场图片">
                                    {getFieldDecorator('imageUrlList')(
                                        <Upload action={`${Api.host.default}/fileservice/w/fileManage/common/file?business=SYSTEM`} name="file" headers={{ Authorization, clientId }} accept=".jpg,.png,.gif,.jpeg" listType="picture-card" fileList={fileList} onPreview={this.handlePreview} onChange={this.handleChange} onRemove={this.handleRemovePhoto}>
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

export default AddMaintenanceRecord;
