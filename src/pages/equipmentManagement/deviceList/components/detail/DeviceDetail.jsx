import { Form, Divider, Tabs } from 'antd';
import PageHeaderWrapper from '@/components/breadcrumb';
import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import Export from '@/utils/export';
import DeviceInformation from './device-information/DeviceInformation';
import ParameterSettings from './parameter-settings/ParameterSettings';
// import ExceptionRecordTable from './exception-record/ExceptionRecordTable';
import BrokenRecordTable from './broken-record/BrokenRecordTable';
import RemoteControlTable from './remote-control/RemoteControlTable';
import RemoteUpgradeTable from './remote-upgrade/RemoteUpgradeTable';
import InformationReleaseTable from './information-release/InformationReleaseTable';
import VoiceBroadcastTable from './voice-broadcast/VoiceBroadcastTable';
import RepairRecordTable from './repair-record/RepairRecordTable';
import MaintenanceRecordTable from './maintenance-record/MaintenanceRecordTable';

const { TabPane } = Tabs;
let timeId = 0;

@connect(({ deviceList }) => {
    return {
        deviceList,
    };
})
@Form.create()
class DeviceDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.getDeviceDetail();
        this.getSceneList();
        this.getCharactersList();
    }

    componentWillUnmount() {
        clearInterval(timeId);
    }

    // 获取播报场景
    getSceneList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/getSceneList',
            payload: {
                code: 'YYBBCJ',
            },
        });
    };

    // 获取播报语音
    getCharactersList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/getCharactersList',
            payload: {
                code: 'YYBBWZ',
            },
        });
    };

    getDeviceDetail = () => {
        const { id } = this.props.history.location.query;
        if (id && id !== 'undefined') {
            const { dispatch } = this.props;
            dispatch({
                type: 'deviceList/getDeviceDetail',
                payload: {
                    id,
                },
                callback: () => {
                    this.getDeviceMonitor(id);
                    const deviceId = id;
                    timeId = setInterval(() => {
                        this.getDeviceMonitor(deviceId);
                    }, 5000);
                },
            });
        }
    };

    getDeviceMonitor = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/monitor',
            payload: {
                id,
            },
        });
    };

    downloadWhiteListTemplate = () => {
        const uri = '/collectivization/w/standardContent/export/template';
        Export.exportContent('标准内容模板.xlsx', uri);
    };

    // 返回
    goBack = () => {
        router.push('/equipmentManagement/deviceList');
    };

    handleChangeTabs = (tabKey) => {
        if (tabKey === 'deviceInformation') {
            const { id } = this.props.history.location.query;
            this.getDeviceMonitor(id);
            const deviceId = id;
            timeId = setInterval(() => {
                this.getDeviceMonitor(deviceId);
            }, 5000);
        } else {
            clearInterval(timeId);
        }
    }

    render() {
        return (
            <div>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content page-header-content mt20">
                    <div className="page-header">
                        <div className="fz14 clearfix">
                            <div className="fl w70">
                                <a onClick={this.goBack}>
                                    <span className=" fz10 iconfont icon-return mr4"></span>
                                    <span>返回</span>
                                </a>
                            </div>
                            <Divider type="vertical" className="h30 fl color-font-black10"></Divider>
                        </div>
                    </div>
                </div>
                <div className="content mt20">
                    <Tabs defaultActiveKey="deviceInformation" animated={false} onChange={this.handleChangeTabs}>
                        <TabPane tab="设备信息" key="deviceInformation">
                            <DeviceInformation getDeviceDetail={this.getDeviceDetail}></DeviceInformation>
                        </TabPane>
                        <TabPane tab="参数设置" key="parameterSettings">
                            <ParameterSettings></ParameterSettings>
                        </TabPane>
                        {/* <TabPane tab="异常记录" key="3">
                            <ExceptionRecordTable></ExceptionRecordTable>
                        </TabPane> */}
                        <TabPane tab="故障记录" key="brokenRecordTable">
                            <BrokenRecordTable></BrokenRecordTable>
                        </TabPane>
                        <TabPane tab="远程控制" key="remoteControlTable">
                            <RemoteControlTable></RemoteControlTable>
                        </TabPane>
                        <TabPane tab="远程升级" key="remoteUpgradeTable">
                            <RemoteUpgradeTable></RemoteUpgradeTable>
                        </TabPane>
                        <TabPane tab="信息发布" key="informationReleaseTable">
                            <InformationReleaseTable></InformationReleaseTable>
                        </TabPane>
                        <TabPane tab="语音播报" key="voiceBroadcastTable">
                            <VoiceBroadcastTable></VoiceBroadcastTable>
                        </TabPane>
                        <TabPane tab="维修记录" key="repairRecordTable">
                            <RepairRecordTable></RepairRecordTable>
                        </TabPane>
                        <TabPane tab="维保记录" key="maintenanceRecordTable">
                            <MaintenanceRecordTable></MaintenanceRecordTable>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default DeviceDetail;
