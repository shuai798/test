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
class ExceptionRecordDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // 取消
    updateDetailModalStatus = () => {
        this.props.updateDetailModalStatus();
    };

    render() {
        const { exceptionRecordDetail = {} } = this.props.deviceList;
        return (
            <Modal title="异常记录详情" destroyOnClose visible maskClosable={false} onCancel={this.updateDetailModalStatus} width={832} footer={null} centered>
                <div>
                    <div className={styles['descriptions-title-block']}>
                        <span className={`${styles['descriptions-title-divider']} ${styles['divider-color-base']}`}></span>
                        <span className={styles['descriptions-title']}>设备信息</span>
                    </div>
                    <div className="descriptions140">
                        <Descriptions column={2} className="mt20">
                            <Descriptions.Item label="设备编码" span={1}>
                                {exceptionRecordDetail.deviceSn}
                            </Descriptions.Item>
                            <Descriptions.Item label="系列型号" span={1}>
                                {exceptionRecordDetail.seriesName}
                            </Descriptions.Item>
                            <Descriptions.Item label="系列编码" span={1}>
                                {exceptionRecordDetail.seriesCode}
                            </Descriptions.Item>
                            <Descriptions.Item label="地理位置" span={1}>
                                {exceptionRecordDetail.location}
                            </Descriptions.Item>
                            <Descriptions.Item label="所属客户" span={2}>
                                {exceptionRecordDetail.customerName}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                    <Divider></Divider>
                    <div className={styles['descriptions-title-block']}>
                        <span className={`${styles['descriptions-title-divider']} ${styles['divider-color-normal']}`}></span>
                        <span className={styles['descriptions-title']}>异常信息</span>
                    </div>
                    <div className="descriptions140">
                        <Descriptions column={2} className="mt20">
                            <Descriptions.Item label="异常类型" span={1}>
                                {filters.deviceExceptionTypeFilter(exceptionRecordDetail.type)}
                            </Descriptions.Item>
                            <Descriptions.Item label="发生时间" span={1}>
                                {exceptionRecordDetail.abnormalTime}
                            </Descriptions.Item>
                            <Descriptions.Item label="读头名称" span={1}>
                                {exceptionRecordDetail.readingHeadName}
                            </Descriptions.Item>
                            <Descriptions.Item label="验证方式" span={1}>
                                {filters.verifyFilter(exceptionRecordDetail.verify)}
                            </Descriptions.Item>
                            <Descriptions.Item label="卡号" span={1}>
                                {exceptionRecordDetail.cardNo}
                            </Descriptions.Item>
                            <Descriptions.Item label="人员编号" span={1}>
                                {exceptionRecordDetail.userNo}
                            </Descriptions.Item>
                            <Descriptions.Item label="人员姓名" span={1}>
                                {exceptionRecordDetail.userName}
                            </Descriptions.Item>
                            <Descriptions.Item label="部门名称" span={1}>
                                {exceptionRecordDetail.departmentName}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default ExceptionRecordDetail;
