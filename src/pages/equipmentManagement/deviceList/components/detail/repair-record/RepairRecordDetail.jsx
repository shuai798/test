import { Form, Modal, Upload, Descriptions } from 'antd';
import React, { Component } from 'react';
import filters from '@/filters/index';
import { connect } from 'dva';
import _ from 'lodash';
import storage from '@/utils/storage';
import styles from '../../../index.less';

@connect(({ deviceList }) => {
    return {
        deviceList,
    };
})
@Form.create()
class RepairRecordDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
        };
    }

    // 取消
    updateRepairRecordDetailModalStatus = () => {
        this.props.updateRepairRecordDetailModalStatus();
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
        const { repairRecordDetail = {} } = this.props.deviceList;
        const { imageUrlList = [] } = repairRecordDetail;
        const fileList = [];
        imageUrlList.map((image, index) => {
            const item = {};
            item.key = index;
            item.uid = index;
            item.status = 'done';
            item.url = storage.getStorage('downloadUrl') + image;
            fileList.push(item);
        });
        const unitTypeList = [];
        repairRecordDetail.unitTypeList.map((scene) => {
            return unitTypeList.push(filters.deviceUnitTypeFilter(scene));
        });
        return (
            <Modal centered title="维修详情" destroyOnClose visible maskClosable={false} onCancel={this.updateRepairRecordDetailModalStatus} width={832} confirmLoading={this.props.loadingAddRepairRecord} onOk={this.addRepairRecord}>
                <div className="descriptions80">
                    <Descriptions column={2}>
                        <Descriptions.Item label="维修单元" span={2}>
                            {_.join(unitTypeList, '、')}
                        </Descriptions.Item>
                        <Descriptions.Item label="维修人员" span={1}>
                            {repairRecordDetail.employeeName}
                            {repairRecordDetail.employeeMobile ? (
                                <span>
                                    <span className="mr5 ml5">/</span>
                                    <span>{repairRecordDetail.employeeMobile}</span>
                                </span>
                            ) : null}
                        </Descriptions.Item>
                        <Descriptions.Item label="维修时间" span={1}>
                            {repairRecordDetail.maintenanceTime}
                        </Descriptions.Item>
                        <Descriptions.Item label="情况描述" span={2}>
                            <span style={{ maxWidth: 654, display: 'inline-block' }}>{repairRecordDetail.description}</span>
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

export default RepairRecordDetail;
