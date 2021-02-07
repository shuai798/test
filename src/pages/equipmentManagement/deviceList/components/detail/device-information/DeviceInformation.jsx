import React, { Component } from 'react';
import { Descriptions, Row, Col, Divider, Tooltip, Modal } from 'antd';
import { connect } from 'dva';
import { HxIcon } from '@/components/hx-components';
import filter from '@/filters/index';
import EditManagementStatus from './EditManagementStatus';
import styles from '../../../index.less';

const { confirm } = Modal;

@connect(({ deviceList }) => {
    return {
        deviceList,
    };
})
class DeviceInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowEditManagementStatusModal: false,
        };
    }

    unbindComfirm = () => {
        confirm({
            content: (
                <div>
                    <div>
                        确定要 <span style={{ color: '#ff3b3b' }}>解绑</span> 该设备从该客户吗？
                    </div>
                    <div>解绑后，该设备从属关系恢复到上级组织</div>
                    <div>请在“设备分配”中重新分配客户</div>
                </div>
            ),
            title: '提示',
            okText: '确定',
            cancelText: '取消',
            icon: <HxIcon type="icon-ask" className="fz24"></HxIcon>,
            onOk: () => {
                return this.unbind();
            },
            className: 'confirmStyle',
        });
    };

    updateEditManagementStatusModal = () => {
        this.setState((prevState) => {
            return { isShowEditManagementStatusModal: !prevState.isShowEditManagementStatusModal };
        });
    };

    unbind = () => {
        const { deviceDetail = {} } = this.props.deviceList;
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/unbind',
            payload: {
                id: deviceDetail.id,
            },
            callback: () => {
                this.props.getDeviceDetail();
            },
        });
    };

    render() {
        const { deviceDetail = {}, monitorDetail = {} } = this.props.deviceList;
        const { isShowEditManagementStatusModal } = this.state;
        return (
            <div>
                <div>
                    <div className={styles['information-top']}>
                        <div className={styles['information-title']}>设备信息</div>
                        <span>
                            <a onClick={this.unbindComfirm}>解绑客户</a>
                        </span>
                    </div>
                    <div className={styles['information-descriptions']}>
                        <Descriptions bordered size="small">
                            <Descriptions.Item label="系列型号" span={1}>
                                {deviceDetail.seriesName}
                            </Descriptions.Item>
                            <Descriptions.Item label="所属客户" span={2}>
                                {deviceDetail.customerName}
                            </Descriptions.Item>
                            <Descriptions.Item label="设备编码" span={1}>
                                {deviceDetail.no}
                            </Descriptions.Item>
                            <Descriptions.Item label="控制器编码" span={1}>
                                {deviceDetail.controllerNo}
                            </Descriptions.Item>
                            <Descriptions.Item label="系列编码" span={1}>
                                {deviceDetail.seriesCode}
                            </Descriptions.Item>
                            <Descriptions.Item label="地理位置" span={1}>
                                {deviceDetail.location}
                            </Descriptions.Item>
                            <Descriptions.Item label="激活时间" span={1}>
                                {deviceDetail.activeTime}
                            </Descriptions.Item>
                            <Descriptions.Item label="到期时间" span={1}>
                                <div className={styles['descriptions-content-operation']}>
                                    <span>{deviceDetail.expireTime}</span>
                                    {deviceDetail.ifExpire ? <div className={styles['device-expired-true']}>已过期</div> : <div className={styles['device-expired-false']}>未过期</div>}
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="运行总次数" span={1}>
                                {deviceDetail.runNum}
                            </Descriptions.Item>
                            <Descriptions.Item label="设备状态" span={1}>
                                <div className={styles['descriptions-content-operation']}>
                                    <span>{filter.deviceStatusFilter(deviceDetail.status)}</span>
                                    <Tooltip
                                        placement="bottom"
                                        overlayStyle={{ background: '#FFFFFF' }}
                                        title={
                                            <div>
                                                <div>维保阈值：{deviceDetail.maintenanceThreshold}次</div>
                                                <div>报废阈值：{deviceDetail.scrapThreshold}次</div>
                                            </div>
                                        }>
                                        <span className="iconfont icon-help fz14" style={{ color: '#4db22f' }}></span>
                                    </Tooltip>
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label="管理状态" span={1}>
                                <div className={styles['descriptions-content-operation']}>
                                    <span>{filter.managementStatusFilter(deviceDetail.managementStatus)}</span>
                                    <a onClick={this.updateEditManagementStatusModal}>
                                        <span className="iconfont icon-focus-edit fz14" style={{ color: '#2F6CFF' }}></span>
                                    </a>
                                </div>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>
                <div className="mt20">
                    <div className={styles['information-title']}>实时监测</div>
                    <div className={styles['device-monitor']}>
                        <Row type="flex" gutter={12}>
                            {monitorDetail.motor ? (
                                <Col span={8} className="mb12">
                                    <div className={styles['device-card']}>
                                        <div className={styles['device-card-title']}>
                                            <HxIcon type="icon-electrical-machinery" className="fz18 mr8"></HxIcon>
                                            <span>电机</span>
                                        </div>
                                        <div className={styles['device-card-content']}>
                                            <Row type="flex" className="text-center pt20" justify="space-around">
                                                <Col span={11}>
                                                    <div>#01</div>
                                                    <div className={styles[monitorDetail.motor[0].result ? 'device-normal' : 'device-malfunction-short']}>{monitorDetail.motor[0].result ? '正常' : '故障'}</div>
                                                </Col>
                                                <Divider type="vertical" style={{ height: 56 }}></Divider>
                                                <Col span={11}>
                                                    <div>#02</div>
                                                    <div className={styles[monitorDetail.motor[1].result ? 'device-normal' : 'device-malfunction-short']}>{monitorDetail.motor[1].result ? '正常' : '故障'}</div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </Col>
                            ) : null}
                            {monitorDetail.encoder ? (
                                <Col span={8} className="mb12">
                                    <div className={styles['device-card']}>
                                        <div className={styles['device-card-title']}>
                                            <HxIcon type="icon-encoder" className="fz18 mr8"></HxIcon>
                                            <span>编码器</span>
                                        </div>
                                        <div className={styles['device-card-content']}>
                                            <Row type="flex" className="text-center pt20" justify="space-around">
                                                <Col span={11}>
                                                    <div>#01</div>
                                                    <div className={styles[monitorDetail.encoder[0].result ? 'device-normal' : 'device-malfunction-short']}>{monitorDetail.encoder[0].result ? '正常' : '故障'}</div>
                                                </Col>
                                                <Divider type="vertical" style={{ height: 56 }}></Divider>
                                                <Col span={11}>
                                                    <div>#02</div>
                                                    <div className={styles[monitorDetail.encoder[1].result ? 'device-normal' : 'device-malfunction-short']}>{monitorDetail.encoder[1].result ? '正常' : '故障'}</div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </Col>
                            ) : null}
                            {monitorDetail.clutch ? (
                                <Col span={8} className="mb12">
                                    <div className={styles['device-card']}>
                                        <div className={styles['device-card-title']}>
                                            <HxIcon type="icon-electromagnetic-clutch" className="fz18 mr8"></HxIcon>
                                            <span>电磁离合器</span>
                                        </div>
                                        <div className={styles['device-card-content']}>
                                            <Row type="flex" className="text-center pt20" justify="space-around">
                                                <Col span={11}>
                                                    <div>#01</div>
                                                    <div className={styles['device-normal']}>正常</div>
                                                </Col>
                                                <Divider type="vertical" style={{ height: 56 }}></Divider>
                                                <Col span={11}>
                                                    <div>#02</div>
                                                    <div className={styles['device-malfunction-short']}>故障</div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </Col>
                            ) : null}
                            {monitorDetail.infrared ? (
                                <Col span={8} className="mb12">
                                    <div className={styles['device-card']}>
                                        <div className={styles['device-card-title']}>
                                            <HxIcon type="icon-infrared-sensor" className="fz18 mr8"></HxIcon>
                                            <span>红外感应器</span>
                                        </div>
                                        <div className={styles['device-card-content']}>
                                            <Row type="flex" className="text-center pt20" justify="space-around">
                                                <Col span={11}>
                                                    <div>正常</div>
                                                    <div className={styles['device-normal-num']}>{monitorDetail.infrared[0].normalNum}</div>
                                                </Col>
                                                <Divider type="vertical" style={{ height: 56 }}></Divider>
                                                <Col span={11}>
                                                    <div>异常</div>
                                                    <div className={styles['device-malfunction-num']}>{monitorDetail.infrared[0].anomalNum}</div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </Col>
                            ) : null}
                            {monitorDetail.switch ? (
                                <Col span={8} className="mb12">
                                    <div className={styles['device-card']}>
                                        <div className={styles['device-card-title']}>
                                            <HxIcon type="icon-proximity-switch" className="fz18 mr8"></HxIcon>
                                            <span>接近开关</span>
                                        </div>
                                        <div className={styles['device-card-content']}>
                                            <Row type="flex" className="text-center pt20" justify="space-around">
                                                <Col span={7}>
                                                    <div>#01</div>
                                                    <div className={styles['device-normal']}>正常</div>
                                                </Col>
                                                <Divider type="vertical" style={{ height: 56 }}></Divider>
                                                <Col span={7}>
                                                    <div>#01</div>
                                                    <div className={styles['device-malfunction-short']}>故障</div>
                                                </Col>
                                                <Divider type="vertical" style={{ height: 56 }}></Divider>
                                                <Col span={7}>
                                                    <div>#01</div>
                                                    <div className={styles['device-normal']}>正常</div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </Col>
                            ) : null}
                            {monitorDetail.head ? (
                                <Col span={8} className="mb12">
                                    <div className={styles['device-card']}>
                                        <div className={styles['device-card-title']}>
                                            <HxIcon type="icon-read-head" className="fz18 mr8"></HxIcon>
                                            <span>读头</span>
                                        </div>
                                        <div className={styles['device-card-content']}>
                                            <Row type="flex" className="text-center pt20" justify="space-around">
                                                <Col span={11}>
                                                    <div>正常</div>
                                                    <div className={styles['device-normal-num']}>6</div>
                                                </Col>
                                                <Divider type="vertical" style={{ height: 56 }}></Divider>
                                                <Col span={11}>
                                                    <div>异常</div>
                                                    <div className={styles['device-malfunction-num']}>0</div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </Col>
                            ) : null}
                            {monitorDetail.knob ? (
                                <Col span={8} className="mb12">
                                    <div className={styles['device-card']}>
                                        <div className={styles['device-card-title']}>
                                            <HxIcon type="icon-shift-knob" className="fz18 mr8"></HxIcon>
                                            <span>开关按钮</span>
                                        </div>
                                        <div className={styles['device-card-content']}>
                                            <Row type="flex" className="text-center pt20" justify="space-around">
                                                <Col span={11}>
                                                    <div>正常</div>
                                                    <div className={styles['device-normal-num']}>6</div>
                                                </Col>
                                                <Divider type="vertical" style={{ height: 56 }}></Divider>
                                                <Col span={11}>
                                                    <div>异常</div>
                                                    <div className={styles['device-malfunction-num']}>0</div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </Col>
                            ) : null}
                            {monitorDetail.recognition ? (
                                <Col span={16} className="mb12">
                                    <div className={styles['device-card']}>
                                        <div className={styles['device-card-title']}>
                                            <HxIcon type="icon-face-recognition" className="fz18 mr8"></HxIcon>
                                            <span>人脸识别一体机</span>
                                        </div>
                                        <div className={styles['device-card-content']}>
                                            <Row type="flex" className="text-center pt20" justify="space-around">
                                                <Col span={3}>
                                                    <div>#01</div>
                                                    <div className={styles['device-normal']}>正常</div>
                                                </Col>
                                                <Divider type="vertical" style={{ height: 56 }}></Divider>
                                                <Col span={3}>
                                                    <div>#01</div>
                                                    <div className={styles['device-malfunction-short']}>故障</div>
                                                </Col>
                                                <Divider type="vertical" style={{ height: 56 }}></Divider>
                                                <Col span={3}>
                                                    <div>#01</div>
                                                    <div className={styles['device-normal']}>正常</div>
                                                </Col>
                                                <Divider type="vertical" style={{ height: 56 }}></Divider>
                                                <Col span={3}>
                                                    <div>#01</div>
                                                    <div className={styles['device-normal']}>正常</div>
                                                </Col>
                                                <Divider type="vertical" style={{ height: 56 }}></Divider>
                                                <Col span={3}>
                                                    <div>#01</div>
                                                    <div className={styles['device-malfunction-short']}>故障</div>
                                                </Col>
                                                <Divider type="vertical" style={{ height: 56 }}></Divider>
                                                <Col span={3}>
                                                    <div>#01</div>
                                                    <div className={styles['device-normal']}>正常</div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </Col>
                            ) : null}
                        </Row>
                    </div>
                </div>
                {isShowEditManagementStatusModal && <EditManagementStatus updateEditManagementStatusModal={this.updateEditManagementStatusModal} getDeviceDetail={this.props.getDeviceDetail}></EditManagementStatus>}
            </div>
        );
    }
}

export default DeviceInformation;
