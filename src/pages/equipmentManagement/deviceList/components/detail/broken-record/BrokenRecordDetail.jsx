import { Form, Modal, Descriptions, Divider } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import filters from '@/filters/index';
import styles from '../../../index.less';

@connect(({ deviceList }) => {
    return {
        deviceList,
    };
})
@Form.create()
class BrokenRecordDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // 取消
    updateDetailModalStatus = () => {
        this.props.updateDetailModalStatus();
    };

    render() {
        const { brokenRecordDetail = {} } = this.props.deviceList;
        return (
            <Modal centered title="故障记录详情" destroyOnClose visible maskClosable={false} onCancel={this.updateDetailModalStatus} width={832} footer={null}>
                <div>
                    <div className={styles['descriptions-title-block']}>
                        <span className={`${styles['descriptions-title-divider']} ${styles['divider-color-base']}`}></span>
                        <span className={styles['descriptions-title']}>设备信息</span>
                    </div>
                    <div className="descriptions140">
                        <Descriptions column={2} className="mt20">
                            <Descriptions.Item label="设备编码" span={1}>
                                {brokenRecordDetail.deviceSn}
                            </Descriptions.Item>
                            <Descriptions.Item label="系列型号" span={1}>
                                {brokenRecordDetail.seriesName}
                            </Descriptions.Item>
                            <Descriptions.Item label="系列编码" span={1}>
                                {brokenRecordDetail.seriesCode}
                            </Descriptions.Item>
                            <Descriptions.Item label="地理位置" span={1}>
                                {brokenRecordDetail.location}
                            </Descriptions.Item>
                            <Descriptions.Item label="所属客户" span={2}>
                                {brokenRecordDetail.customerName}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                    <Divider></Divider>
                    <div className={styles['descriptions-title-block']}>
                        <span className={`${styles['descriptions-title-divider']} ${styles['divider-color-normal']}`}></span>
                        <span className={styles['descriptions-title']}>故障信息</span>
                    </div>
                    <div className="descriptions140">
                        <Descriptions column={2} className="mt20">
                            <Descriptions.Item label="故障类型" span={1}>
                                {filters.deviceBrokenTypeFilter(brokenRecordDetail.type)}
                            </Descriptions.Item>
                            <Descriptions.Item label="发生时间" span={1}>
                                {brokenRecordDetail.breakdownTime}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default BrokenRecordDetail;
