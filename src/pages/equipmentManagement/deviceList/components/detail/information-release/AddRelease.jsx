import { Form, Modal, Row, Col, Input, Upload, Button, message, Icon, Table, Select, Checkbox } from 'antd';
import React, { Component } from 'react';
import Api from '@/utils/api';
import storage from '@/utils/storage';
import validate from '@/utils/validation';
import { connect } from 'dva';
import enums from '@/i18n/zh-CN/zhCN';
import FilterSelectAllTable from '@/components/filter-selectall-table';
import styles from '../../../index.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ deviceList, loading }) => {
    return {
        deviceList,
        loadingAddInformationRelease: loading.effects['deviceList/addInformationRelease'],
    };
})
@Form.create()
class AddRelease extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLocation: '',
            fileList: [],
        };
    }

    fileDescriptionColumns = [
        {
            title: '显示区域',
            dataIndex: 'location',
        },
        {
            title: '文件格式',
            dataIndex: 'fileType',
        },
        {
            title: '文件大小',
            dataIndex: 'fileSize',
        },
        {
            title: '备注说明',
            dataIndex: 'remarks',
        },
    ];

    fileDescriptionData = [
        {
            id: 1,
            location: '视频区',
            fileType: 'ZIP',
            fileSize: '≤500M',
            remarks: '名称重复覆盖原有文件，最多轮播数量20',
        },
        {
            id: 2,
            location: '状态背景',
            fileType: 'ZIP',
            fileSize: '≤10M',
            remarks: '名称重复覆盖原有文件，最多轮播数量1',
        },
        {
            id: 3,
            location: '图片区',
            fileType: 'ZIP',
            fileSize: '≤10M',
            remarks: '名称重复覆盖原有文件，最多轮播数量20',
        },
    ];

    // 取消
    updateAddReleaseModalStatus = () => {
        this.props.updateAddReleaseModalStatus();
    };

    addInformationRelease = () => {
        const { form, dispatch, updateAddReleaseModalStatus, getTableViewList } = this.props;
        const {
            deviceDetail: { id },
        } = this.props.deviceList;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            const { fileName, fileId } = this.state.fileList[0].response.data;
            const values = {
                ...fieldsValue,
                fileName,
                fileUrl: fileId,
                deviceId: id,
                operationType: 'CREATE',
            };
            dispatch({
                type: 'deviceList/addInformationRelease',
                payload: values,
                callback: () => {
                    getTableViewList();
                    updateAddReleaseModalStatus();
                },
            });
        });
    };

    handleChange = ({ file, fileList }) => {
        if (file.status) {
            this.setState({ fileList: fileList.slice(-1) });
        }
        if (file.status === 'done') {
            const { fileId } = this.state.fileList[0].response.data;
            this.props.form.setFieldsValue({ fileUrl: fileId });
            message.success('上传成功');
        }
        if (file.status === 'error') {
            this.setState({ fileList: [] });
            message.error('上传失败');
        }
    };

    handleRemoveFile = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/removeFile',
            payload: {
                id,
            },
            callback: () => {
                this.setState({ fileList: [] });
                this.props.form.resetFields(['fileUrl']);
            },
        });
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

    locationChange = (currentLocation) => {
        this.setState({
            currentLocation,
            fileList: [],
        });
    };

    beforeUpload = (file) => {
        const { currentLocation } = this.state;
        if (currentLocation === 'VIDEO') {
            if (file.size / 1024 > 512000) {
                message.error('上传文件不得大于500MB!');
                return false;
            }
        } else if (file.size / 1024 > 10240) {
            message.error('上传文件不得大于10MB!');
            return false;
        }
        return true;
    };

    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        const file = this.state.fileList.length > 0 && this.state.fileList[0].response?.data;
        const Authorization = storage.getStorage('authorization');
        const clientId = storage.getStorage('clientId');
        const { currentLocation } = this.state;
        const pathTypeOptions = [];
        enums.pathTypeList.map((pathType) => {
            pathTypeOptions.push({
                label: pathType.name,
                value: pathType.code,
            });
        });
        return (
            <Modal centered title="信息发布" destroyOnClose visible maskClosable={false} onCancel={this.updateAddReleaseModalStatus} width={832} confirmLoading={this.props.loadingAddInformationRelease} onOk={this.addInformationRelease}>
                <div className="formList80">
                    <Form>
                        <Row type="flex" gutter={20}>
                            <Col span={12}>
                                <FormItem label="发布标题">
                                    {getFieldDecorator('title', {
                                        rules: [validate.Rule_require, validate.Rule_max20_length],
                                    })(<Input placeholder="请输入" allowClear autoComplete="off"></Input>)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="通道类型">
                                    {getFieldDecorator('pathTypelist', {
                                        rules: [validate.Rule_require],
                                    })(<Checkbox.Group options={pathTypeOptions} />)}
                                </FormItem>
                            </Col>
                            <Col span={12}>
                                <FormItem label="显示位置">
                                    {getFieldDecorator('location', {
                                        rules: [validate.Rule_require],
                                    })(
                                        <Select placeholder="请选择" onChange={this.locationChange}>
                                            {enums.deviceInformationLocation.map((pathType) => {
                                                return (
                                                    <Option key={pathType.code} value={pathType.code}>
                                                        {pathType.name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>,
                                    )}
                                </FormItem>
                            </Col>
                            {currentLocation === 'IMAGE' && (
                                <Col span={10}>
                                    <FormItem label="轮播间隔">
                                        {getFieldDecorator('carouselinterval', {
                                            rules: [
                                                validate.Rule_require,
                                                {
                                                    validator: (rule, value, callback) => {
                                                        return this.parameterLimit(rule, value, callback, 1, 30);
                                                    },
                                                },
                                            ],
                                        })(<Input placeholder="请输入" addonAfter="秒" autoComplete="off" allowClear></Input>)}
                                    </FormItem>
                                </Col>
                            )}
                            {currentLocation === 'IMAGE' && (
                                <Col span={2} className={styles['parameter-limit']}>
                                    1~30
                                </Col>
                            )}
                            <Col span={24}>
                                <FormItem label="媒体文件">
                                    {getFieldDecorator('fileUrl', {
                                        rules: [validate.Rule_require],
                                    })(
                                        file ? (
                                            <div className={styles['file-block']}>
                                                <span className={styles['file-list']}>
                                                    <Icon type="link" className={styles['file-icon']}></Icon>
                                                    <span className={styles['file-name']}>{file.fileName}</span>
                                                </span>
                                                <span
                                                    onClick={() => {
                                                        return this.handleRemoveFile(file.id);
                                                    }}
                                                    className={`${styles['file-list-delete']} icon-delete iconfont mr8 fz14`}></span>
                                            </div>
                                        ) : (
                                            <Upload
                                                action={`${Api.host.default}/fileservice/w/fileManage/common/file?business=SYSTEM`}
                                                name="file"
                                                accept=".zip"
                                                headers={{
                                                    Authorization,
                                                    clientId,
                                                }}
                                                onChange={this.handleChange}
                                                beforeUpload={this.beforeUpload}
                                                showUploadList={false}>
                                                <Button type="link">请选择文件</Button>
                                            </Upload>
                                        ),
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <Table
                    rowKey={(record) => {
                        return record.id;
                    }}
                    columns={this.fileDescriptionColumns}
                    dataSource={this.fileDescriptionData}
                    pagination={false}></Table>
            </Modal>
        );
    }
}

export default AddRelease;
