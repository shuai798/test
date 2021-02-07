import { Form, Modal, Row, Col, Select, Radio, Icon, Upload, Button, message } from 'antd';
import React, { Component } from 'react';
import validate from '@/utils/validation';
import enums from '@/i18n/zh-CN/zhCN';
import { connect } from 'dva';
import styles from '@/pages/equipmentManagement/deviceList/index.less';
import Api from '@/utils/api';
import storage from '@/utils/storage';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ deviceList, loading }) => {
    return {
        deviceList,
        loadingEditVoiceBroadcast: loading.effects['deviceList/editVoiceBroadcast'],
    };
})
@Form.create()
class EditVoiceBroadcast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: '',
            fileList: [],
        };
    }

    componentDidMount() {
        const { voiceBroadcastDetail = {} } = this.props.deviceList;
        const { mode, fileId, fileName } = voiceBroadcastDetail;
        if (mode === 'CUSTOMIZE' && fileId && fileName) {
            const file = {};
            file.uid = '1';
            file.status = 'done';
            file.response = { data: { fileId, fileName } };
            this.props.form.setFieldsValue({ fileUrl: fileId });
            this.setState({ fileList: [file] });
        }
    }

    // 取消
    updateEditVoiceBroadcastModalStatus = () => {
        this.props.updateEditVoiceBroadcastModalStatus();
    };

    editVoiceBroadcast = () => {
        const { form, dispatch, updateEditVoiceBroadcastModalStatus, getTableViewList } = this.props;
        const { voiceBroadcastDetail = {} } = this.props.deviceList;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            let fileName = '';
            let fileId = '';
            if (fieldsValue.mode === 'CUSTOMIZE') {
                const { fileList } = this.state;
                if (fileList && fileList.length > 0) {
                    const name = fileList[0].response.data.fileName;
                    const id = fileList[0].response.data.fileId;
                    fileName = name;
                    fileId = id;
                }
            }
            dispatch({
                type: 'deviceList/editVoiceBroadcast',
                payload: {
                    ...voiceBroadcastDetail,
                    ...fieldsValue,
                    fileName,
                    fileId,
                },
                callback: () => {
                    getTableViewList();
                    updateEditVoiceBroadcastModalStatus();
                },
            });
        });
    };

    handleModeChange = (e) => {
        const mode = e.target.value;
        this.setState({ mode }, () => {
            const { fileList } = this.state;
            if (fileList && fileList.length > 0) {
                const id = fileList[0].response.data.fileId;
                this.props.form.setFieldsValue({ fileUrl: id });
            }
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

    handleRemoveFile = (fileId) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/removeFileByFileId',
            payload: {
                fileId,
            },
            callback: () => {
                this.setState({ fileList: [] });
                this.props.form.resetFields(['fileUrl']);
            },
        });
    };

    beforeUpload = (file) => {
        if (file.size / 1024 > 102400) {
            message.error('上传文件不得大于100MB!');
            return false;
        }
        return true;
    };

    render() {
        const {
            form: { getFieldDecorator },
            deviceList: { voiceBroadcastDetail = {}, sceneList = [], charactersList = [] },
        } = this.props;
        const { mode, fileList } = this.state;
        const propsMode = voiceBroadcastDetail.mode;
        let ifShowUpload = false;
        if ((!mode && propsMode === 'CUSTOMIZE') || mode === 'CUSTOMIZE') {
            ifShowUpload = true;
        }
        const file = fileList && fileList.length > 0 ? fileList[0].response?.data : undefined;
        const Authorization = storage.getStorage('authorization');
        const clientId = storage.getStorage('clientId');
        return (
            <Modal centered title="编辑播报" destroyOnClose visible maskClosable={false} onCancel={this.updateEditVoiceBroadcastModalStatus} width={440} confirmLoading={this.props.loadingEditVoiceBroadcast} onOk={this.editVoiceBroadcast}>
                <Form className="formList88">
                    <Row type="flex">
                        <Col span={24}>
                            <FormItem label="播报场景">
                                <span>
                                    {
                                        sceneList.find((item) => {
                                            return item.code === voiceBroadcastDetail.scene;
                                        })?.name
                                    }
                                </span>
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <FormItem label="播报模式">
                                {getFieldDecorator('mode', {
                                    rules: [validate.Rule_require],
                                    initialValue: voiceBroadcastDetail.mode,
                                })(
                                    <Radio.Group onChange={this.handleModeChange}>
                                        {enums.voiceBroadcastMode.map((item) => {
                                            return (
                                                <Radio value={item.code} key={item.code}>
                                                    {item.name}
                                                </Radio>
                                            );
                                        })}
                                    </Radio.Group>,
                                )}
                            </FormItem>
                        </Col>
                        {!ifShowUpload ? (
                            <Col span={24}>
                                <FormItem label="播报文字">
                                    {getFieldDecorator('characters', {
                                        rules: [validate.Rule_require],
                                        initialValue: voiceBroadcastDetail.characters || undefined,
                                    })(
                                        <Select placeholder="请选择" allowClear>
                                            {charactersList.map((characters) => {
                                                return (
                                                    <Option key={characters.code} value={characters.code}>
                                                        {characters.name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>,
                                    )}
                                </FormItem>
                            </Col>
                        ) : (
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
                                                        return this.handleRemoveFile(file.fileId);
                                                    }}
                                                    className={`${styles['file-list-delete']} icon-delete iconfont mr8 fz14`}></span>
                                            </div>
                                        ) : (
                                            <Upload
                                                action={`${Api.host.default}/fileservice/w/fileManage/common/file?business=SYSTEM`}
                                                name="file"
                                                accept=".wav"
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
                        )}
                    </Row>
                </Form>
            </Modal>
        );
    }
}

export default EditVoiceBroadcast;
