import React from 'react';
import { Form, Row, Col, Input, Modal, Icon, Upload, message, Spin } from 'antd';
import { connect } from 'dva';
import Api from '@/utils/api';
import validate from '@/utils/validation';
import storage from '@/utils/storage';

const FormItem = Form.Item;

@Form.create()
@connect(({ loading, seriesManagement }) => {
    return {
        seriesManagement,
        addLoading: loading.effects['seriesManagement/addTableInfo'],
        editLoading: loading.effects['seriesManagement/editTableInfo'],
        detailsLoading: loading.effects['seriesManagement/getDetailRecord'],
    };
})
class Details extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            seriesInfo: {},
            previewVisible: false,
            previewImage: '',
        };
    }

    componentDidMount() {
        const { addOrEdit, juniorInfo, dispatch } = this.props;
        if (addOrEdit === 'edit') {
            dispatch({
                type: 'seriesManagement/getDetailRecord',
                payload: juniorInfo.id,
                callback: (res) => {
                    this.setState(
                        {
                            seriesInfo: res.data,
                        },
                        () => {
                            const { seriesInfo } = this.state;
                            if (seriesInfo?.imageUrl) {
                                const fileList = [
                                    {
                                        uid: '-1',
                                        name: 'image.png',
                                        status: 'done',
                                        url: storage.getStorage('downloadUrl') + seriesInfo.imageUrl,
                                    },
                                ];
                                this.setState({ fileList });
                            }
                        },
                    );
                },
            });
        }
    }

    // 提交表单
    hideModal = () => {
        const { form, dispatch, addJunior, juniorInfo, addOrEdit } = this.props;
        const { imageUrl } = this.state;
        if (addOrEdit === 'add') {
            form.validateFields((err, fieldsValue) => {
                if (err) {
                    return;
                }
                const values = fieldsValue;
                delete values.imageUrl;
                dispatch({
                    type: 'seriesManagement/addTableInfo',
                    payload: {
                        ...values,
                        imageUrl,
                        parent: { id: juniorInfo.id },
                    },
                    callback: () => {
                        addJunior();
                    },
                });
            });
        } else {
            form.validateFields((err, fieldsValue) => {
                if (err) {
                    return;
                }
                const values = fieldsValue;
                delete values.imageUrl;
                dispatch({
                    type: 'seriesManagement/editTableInfo',
                    payload: {
                        ...values,
                        imageUrl: imageUrl || juniorInfo.imageUrl,
                        parent: { id: juniorInfo.parentId },
                        id: juniorInfo.id,
                    },
                    callback: () => {
                        addJunior();
                    },
                });
            });
        }
    };

    handleChange = ({ file, fileList }) => {
        if (file.status) {
            this.setState({ fileList: fileList.slice(-1) });
        }
        if (file.status === 'done') {
            this.setState(
                {
                    imageUrl: file.response.data.fileId,
                },
                () => {
                    message.success('上传成功');
                },
            );
        }
        if (file.status === 'error') {
            message.error('上传失败');
        }
    };

    onRemove = (file) => {
        const { fileList } = this.state;
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        this.setState({ fileList: newFileList });
    };

    getDownNum = (e) => {
        this.setState({ downNum: e.target.value });
    };

    getUpNum = (e) => {
        this.setState({ upNum: e.target.value });
    };

    setDownNum = () => {
        const { downNum, upNum } = this.state;
        if (downNum * 1 > upNum * 1) {
            this.props.form.setFieldsValue({ scrapThreshold: downNum });
        }
    };

    setUpNum = () => {
        const { downNum, upNum } = this.state;
        if (downNum * 1 > upNum * 1) {
            this.props.form.setFieldsValue({ scrapThreshold: downNum });
        }
    };

    handlePreview = async (file) => {
        const { addOrEdit } = this.props;
        if (addOrEdit === 'add') {
            const { imageUrl } = this.state;
            this.setState({
                previewImage: imageUrl,
                previewVisible: true,
            });
        } else {
            const currentFile = file;
            this.setState({
                previewImage: currentFile.url,
                previewVisible: true,
            });
        }
    };

    handleCancel = () => {
        return this.setState({ previewVisible: false });
    };

    uploadList = (rule, value, callback) => {
        const { fileList } = this.state;
        let num = 0;
        fileList.map((item) => {
            if (item.status === 'done') {
                num += 1;
            }
            return null;
        });
        if (num === 0) {
            callback('该项不能为空');
        }
        callback();
    };

    // 维保阈值报废阈值最大值校验
    validateMaintenanceThresholdNum = (rule, value, callback) => {
        if (value && value > 100000000) {
            callback('超过最大值');
        }
        callback();
    };

    // 过期时长最大值校验
    validateexpiredTimeNumNum = (rule, value, callback) => {
        if (value && value > 3650) {
            callback('超过最大值');
        }
        callback();
    };

    render() {
        const { fileList, seriesInfo, previewVisible, previewImage } = this.state;
        const {
            form: { getFieldDecorator },
            addJunior,
            juniorInfo,
            addOrEdit,
            addLoading,
            editLoading,
            detailsLoading,
        } = this.props;
        const uploadButton = (
            <div>
                <div className="ant-upload-text">点击上传</div>
                <Icon type="plus"></Icon>
            </div>
        );
        const Authorization = storage.getStorage('authorization');
        const clientId = storage.getStorage('clientId');
        return (
            <Modal width={770} title={addOrEdit === 'add' ? '新增系列' : '编辑系列'} maskClosable={false} visible destroyOnClose confirmLoading={addLoading || editLoading} onOk={this.hideModal} onCancel={addJunior}>
                <Spin spinning={addOrEdit === 'edit' ? detailsLoading : null}>
                    <div className="formList80">
                        <Form>
                            <Row
                                type="flex"
                                gutter={{
                                    md: 8,
                                    lg: 12,
                                    xl: 24,
                                }}>
                                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="上级系列">{juniorInfo && juniorInfo.parentName ? juniorInfo.parentName : ''}</FormItem>
                                </Col>
                            </Row>
                            <Row
                                type="flex"
                                gutter={{
                                    md: 8,
                                    lg: 12,
                                    xl: 24,
                                }}>
                                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="系列名称">
                                        {getFieldDecorator('name', {
                                            initialValue: seriesInfo && seriesInfo.name ? seriesInfo.name : '',
                                            rules: [validate.Rule_require, { validator: validate.Rule_name }],
                                        })(<Input autoComplete="off" placeholder="请输入" allowClear></Input>)}
                                    </FormItem>
                                </Col>
                                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="系列编码">
                                        {getFieldDecorator('code', {
                                            initialValue: seriesInfo && seriesInfo.code ? seriesInfo.code : '',
                                            rules: [validate.Rule_require, { validator: validate.Rule_code }],
                                        })(<Input autoComplete="off" placeholder="请输入" allowClear></Input>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row
                                type="flex"
                                gutter={{
                                    md: 8,
                                    lg: 12,
                                    xl: 24,
                                }}>
                                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="维保阈值">
                                        {getFieldDecorator('maintenanceThreshold', {
                                            initialValue: seriesInfo && seriesInfo.maintenanceThreshold ? seriesInfo.maintenanceThreshold : 1000000,
                                            rules: [
                                                validate.Rule_require,
                                                {
                                                    validator: validate.Rule_number,
                                                },
                                                { validator: this.validateMaintenanceThresholdNum },
                                            ],
                                        })(<Input onChange={this.getDownNum} onBlur={this.setDownNum} addonAfter="次" autoComplete="off" placeholder="请输入" allowClear></Input>)}
                                    </FormItem>
                                </Col>
                                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="报废阈值">
                                        {getFieldDecorator('scrapThreshold', {
                                            initialValue: seriesInfo && seriesInfo.scrapThreshold ? seriesInfo.scrapThreshold : 100000000,
                                            rules: [validate.Rule_require, { validator: validate.Rule_number }, { validator: this.validateMaintenanceThresholdNum }],
                                        })(<Input onChange={this.getUpNum} onBlur={this.setUpNum} addonAfter="次" autoComplete="off" placeholder="请输入" allowClear></Input>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row
                                type="flex"
                                gutter={{
                                    md: 8,
                                    lg: 12,
                                    xl: 24,
                                }}>
                                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="过期时长">
                                        {getFieldDecorator('expiredTimeNum', {
                                            initialValue: seriesInfo && seriesInfo.expiredTimeNum ? seriesInfo.expiredTimeNum : 1095,
                                            rules: [validate.Rule_require, { validator: validate.Rule_number }, { validator: this.validateexpiredTimeNumNum }],
                                        })(<Input addonAfter="天" autoComplete="off" placeholder="请输入" allowClear></Input>)}
                                    </FormItem>
                                </Col>
                                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="固件系列">
                                        {getFieldDecorator('firmwareSeries', {
                                            initialValue: seriesInfo && seriesInfo.firmwareSeries ? seriesInfo.firmwareSeries : '',
                                            rules: [validate.Rule_require, validate.Rule_max256_length],
                                        })(<Input autoComplete="off" placeholder="请输入" allowClear></Input>)}
                                    </FormItem>
                                </Col>
                                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="系列图片">
                                        {getFieldDecorator('imageUrl', {
                                            initialValue: seriesInfo && seriesInfo.imageUrl ? seriesInfo.imageUrl : 1,
                                            rules: [validate.Rule_require, { validator: this.uploadList }],
                                        })(
                                            <Upload
                                                action={`${Api.host.default}/fileservice/w/fileManage/common/file?business=SYSTEM`}
                                                name="file"
                                                headers={{
                                                    Authorization,
                                                    clientId,
                                                }}
                                                accept=".jpg,.png,.gif"
                                                listType="picture-card"
                                                fileList={fileList}
                                                onRemove={this.onRemove}
                                                onChange={this.handleChange}
                                                showUploadList={{
                                                    showPreviewIcon: true,
                                                    showRemoveIcon: true,
                                                    showDownloadIcon: false,
                                                }}
                                                onPreview={this.handlePreview}>
                                                {fileList.length >= 1 ? null : uploadButton}
                                            </Upload>,
                                        )}
                                        <Modal maskClosable={false} visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                            <img alt="example" style={{ width: '100%' }} src={previewImage}></img>
                                        </Modal>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Spin>
            </Modal>
        );
    }
}

export default Details;
