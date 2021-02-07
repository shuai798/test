import { Form, Modal, Upload, Descriptions } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import storage from '@/utils/storage';
import styles from '../../../index.less';

@connect(({ deviceList }) => {
    return {
        deviceList,
    };
})
@Form.create()
class MaintenanceRecordDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
        };
    }

    // 取消
    updateMaintenanceRecordDetailModalStatus = () => {
        this.props.updateMaintenanceRecordDetailModalStatus();
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

    render() {
        const { previewVisible, previewImage } = this.state;
        const { maintenanceRecordDetail = {} } = this.props.deviceList;
        const { imageUrlList = [] } = maintenanceRecordDetail;
        const fileList = [];
        imageUrlList.map((image, index) => {
            const item = {};
            item.key = index;
            item.uid = index;
            item.status = 'done';
            item.url = storage.getStorage('downloadUrl') + image;
            fileList.push(item);
        });
        return (
            <Modal centered title="维保详情" destroyOnClose visible maskClosable={false} onCancel={this.updateMaintenanceRecordDetailModalStatus} width={832} confirmLoading={this.props.loadingAddMaintenanceRecord} onOk={this.addMaintenanceRecord}>
                <div className="descriptions80">
                    <Descriptions column={2}>
                        <Descriptions.Item label="维保人员" span={1}>
                            {maintenanceRecordDetail.employeeName}
                            {maintenanceRecordDetail.employeeMobile ? (
                                <span>
                                    <span className="mr5 ml5">/</span>
                                    <span>{maintenanceRecordDetail.employeeMobile}</span>
                                </span>
                            ) : null}
                        </Descriptions.Item>
                        <Descriptions.Item label="维保时间" span={1}>
                            {maintenanceRecordDetail.upkeepTime}
                        </Descriptions.Item>
                        <Descriptions.Item label="情况描述" span={2}>
                            <span style={{ maxWidth: 654, display: 'inline-block' }}>{maintenanceRecordDetail.description}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="现场图片" span={2}>
                            <span className={styles['picture-card-block']}>
                                <Upload listType="picture-card" fileList={fileList} onPreview={this.handlePreview}></Upload>
                            </span>
                        </Descriptions.Item>
                    </Descriptions>
                </div>
                <Modal centered width={440} visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </Modal>
        );
    }
}

export default MaintenanceRecordDetail;
