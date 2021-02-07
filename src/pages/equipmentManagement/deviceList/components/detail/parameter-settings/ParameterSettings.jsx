import React, { Component } from 'react';
import { Descriptions } from 'antd';
import { connect } from 'dva';
import filter from '@/filters/index';
import EditParameter from './EditParameter';
import styles from '../../../index.less';

@connect(({ deviceList }) => {
    return {
        deviceList,
    };
})
class ParameterSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowEditParameterModal: false,
        };
    }

    componentDidMount() {
        this.getParameterSettings();
    }

    getParameterSettings = () => {
        const {
            deviceDetail: { id },
        } = this.props.deviceList;
        if (id) {
            const { dispatch } = this.props;
            dispatch({
                type: 'deviceList/getParameterSettings',
                payload: {
                    id,
                },
            });
        }
    };

    updateEditParameterModal = () => {
        this.setState((prevState) => {
            return { isShowEditParameterModal: !prevState.isShowEditParameterModal };
        });
    };

    render() {
        const { parameterSettings = {} } = this.props.deviceList;
        const { isShowEditParameterModal } = this.state;
        return (
            <div>
                <div className={styles['information-top']}>
                    <div className={styles['information-title']}>设备参数</div>
                    <span>
                        <a onClick={this.updateEditParameterModal}>参数设置</a>
                    </span>
                </div>
                <div className={styles['parameter-settings-descriptions']}>
                    <Descriptions bordered size="small" column={2}>
                        <Descriptions.Item label="禁用报警提醒" span={1}>
                            {parameterSettings.disableAlarm ? '是' : '否'}
                        </Descriptions.Item>
                        <Descriptions.Item label="延迟关闸时间（秒）" span={1}>
                            {parameterSettings.delayClosingTime}
                        </Descriptions.Item>
                        <Descriptions.Item label="无人通行时间（秒）" span={1}>
                            {parameterSettings.unattendedTime}
                        </Descriptions.Item>
                        <Descriptions.Item label="开闸速度" span={1}>
                            {parameterSettings.openingSpeed}
                        </Descriptions.Item>
                        <Descriptions.Item label="关闸速度" span={1}>
                            {parameterSettings.closingSpeed}
                        </Descriptions.Item>
                        <Descriptions.Item label="开闸减速速度" span={1}>
                            {parameterSettings.openingDecelerationSpeed}
                        </Descriptions.Item>
                        <Descriptions.Item label="关闸减速速度" span={1}>
                            {parameterSettings.closingDecelerationSpeed}
                        </Descriptions.Item>
                        <Descriptions.Item label="开闸减速行程" span={1}>
                            {parameterSettings.openingDecelerationTravel}
                        </Descriptions.Item>
                        <Descriptions.Item label="关闸减速行程" span={1}>
                            {parameterSettings.closingDecelerationTravel}
                        </Descriptions.Item>
                        <Descriptions.Item label="冲门行程" span={1}>
                            {parameterSettings.rushTravel}
                        </Descriptions.Item>
                        <Descriptions.Item label="力度调节" span={1}>
                            {parameterSettings.strengthAdjustment}
                        </Descriptions.Item>
                        <Descriptions.Item label="离合报警设置" span={1}>
                            {filter.clutchAlarmSettingFilter(parameterSettings.clutchAlarmSetting)}
                        </Descriptions.Item>
                        <Descriptions.Item label="逗留时间（秒）" span={1}>
                            {parameterSettings.residenceTime}
                        </Descriptions.Item>
                        <Descriptions.Item label="反向闯入" span={1}>
                            {filter.gateSettingFilter(parameterSettings.reverseEntry)}
                        </Descriptions.Item>
                        <Descriptions.Item label="尾随进入" span={1}>
                            {filter.gateSettingFilter(parameterSettings.followIn)}
                        </Descriptions.Item>
                        <Descriptions.Item label="防夹区域设置" span={1}>
                            {filter.infraredRegionFilter(parameterSettings.infraredRegion)}
                        </Descriptions.Item>
                        <Descriptions.Item label="防夹设置" span={1}>
                            {filter.avoidPinchedSettingFilter(parameterSettings.avoidPinchedSetting)}
                        </Descriptions.Item>
                        <Descriptions.Item label="消防模式" span={1}>
                            {filter.fireProtectionModeFilter(parameterSettings.fireProtectionMode)}
                        </Descriptions.Item>
                        <Descriptions.Item label="音量设置" span={1}>
                            {parameterSettings.volumeSetting}
                        </Descriptions.Item>
                        <Descriptions.Item label="语音切换" span={1}>
                            {filter.voiceSwitchFilter(parameterSettings.voiceSwitch)}
                        </Descriptions.Item>
                        <Descriptions.Item label="验证方式" span={1}>
                            {parameterSettings.verifyInChannel ? '允许通道内验证' : '不允许通道内验证'}
                        </Descriptions.Item>
                        <Descriptions.Item label="记忆开闸" span={1}>
                            {parameterSettings.memoryOpen ? '开启' : '关闭'}
                        </Descriptions.Item>
                        <Descriptions.Item label="报警音设置" span={1}>
                            {parameterSettings.alarmSetting ? '开启' : '关闭'}
                        </Descriptions.Item>
                        <Descriptions.Item label="出入口交换" span={1}>
                            {parameterSettings.gateSwitch ? '开启' : '关闭'}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
                {isShowEditParameterModal && <EditParameter updateEditParameterModal={this.updateEditParameterModal} getParameterSettings={this.getParameterSettings}></EditParameter>}
            </div>
        );
    }
}

export default ParameterSettings;
