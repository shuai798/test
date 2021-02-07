import React, { Component } from 'react';
// import { HxSelect } from '@/components/hx-components';
import { Select } from 'antd';
import styles from './index.less';
import Barchart from './components/BarChart';
import BarhartOfDevice from './components/BarhartOfDevice';
import LinehartOfDevice from './components/LineChartOfDevice';
import LineChartOfEvent from './components/LineChartOfEvent';
import PieChartDevice from './components/PieChartDevice';
import PieChartDeviceTwo from './components/PieChartDeviceTwo';
import PieChartEvent from './components/PieChartEvent';
import BarChartOfEvent from './components/BarChartOfEvent';
import PieChartCustomer from './components/PieChartCustomer';
import FoolPieChartCustomer from './components/FoolPieChartCustomer';
import BarChartCustomer from './components/BarChartCustomer';
import LineChartAbnormal from './components/LineChartAbnormal';
import BarChartAbnormal from './components/BarChartAbnormal';
import BarChartPass from './components/BarChartPass';
import MapChart from './components/MapChart';
import { connect } from 'dva';

const { Option } = Select;

@connect(({ cockpitSpace, loading }) => {
    return {
        cockpitSpace,
        loading,
    };
})
class TableView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabsDevice: [
                {
                    tabName: '新增数量',
                    id: 1,
                },
                {
                    tabName: '累计数量',
                    id: 2,
                },
            ],
            tabsEvent: [
                {
                    tabName: '新增事件',
                    id: 1,
                },
                {
                    tabName: '累计事件',
                    id: 2,
                },
            ],
            deviceCurrentIndex: 1,
            eventCurrentIndex: 1,
            provinceValue: '',
            eventList: [],
            weatherData: {},
            deviceStatisticsTotalData: {},
            deviceTypeData: [], // 设备类型数据
            deviceStatusData: [], // 设备状态数据
            areaFirstList: [], // 省份
            deviceRestData: [], // map地图数据
        };
    }

    componentDidMount = () => {
        this.getProvinceList();
        this.getWeatherData();
        this.getDeviceData();
        this.deviceType();
        this.deviceStatusData();
        this.getEventList();
        this.getDeviceRest();
        const { eventList } = this.state;
        setInterval(() => {
            this.getDeviceData();
            this.deviceType();
            this.deviceStatusData();
        }, 600000);
        setInterval(() => {
            this.getDevice();
            this.getEvent();
            if (eventList && eventList.length > 4) {
                eventList.shift();
                this.setState({
                    eventList,
                });
            }
        }, 5000);
    };

    // 获取实时事件
    getEventList = () => {
        const { dispatch } = this.props;
        const date = new Date().getTime();
        dispatch({
            type: 'dataCockpitSpace/getEventList',
            payload: { timestamp: date },
            callback: (res) => {
                this.setState({
                    eventList: res.data,
                });
            },
        });
    };

    // 获取省
    getProvinceList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'customerManagement/getAreaInfo',
            callback: (res) => {
                this.setState({
                    areaFirstList: res.data,
                });
            },
        });
    };

    // 获取总体统计数据
    getDeviceData = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceAccessStatisticSpace/deviceStatisticsTotalData',
            payload: {
                hasDataAuth: false,
            },
            callback: (res) => {
                this.setState({
                    deviceStatisticsTotalData: res.data,
                });
            },
        });
    };

    // 获取设备类型
    deviceType = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceAccessStatisticSpace/customerIndustryTop5',
            payload: {
                hasDataAuth: false,
            },
            callback: (res) => {
                this.setState({
                    deviceTypeData: res.data,
                });
            },
        });
    };

    // 获取设备状态
    deviceStatusData = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceAccessStatisticSpace/deviceStatusData',
            payload: {
                hasDataAuth: false,
            },
            callback: (res) => {
                this.setState({
                    deviceStatusData: res.data,
                });
            },
        });
    };

    getWeatherData = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'cockpitSpace/getWeatherData',
            callback: (res) => {
                if (res?.result?.realtime?.code === '00') {
                    res.result.realtime.text = 'qing';
                }
                if (res?.result?.realtime?.code === '01') {
                    res.result.realtime.text = 'yun';
                }
                if (res?.result?.realtime?.code === '02') {
                    res.result.realtime.text = 'yin';
                }
                if (res?.result?.realtime?.code === '03' || res?.result?.realtime?.code === '04' || res?.result?.realtime?.code === '05' || res?.result?.realtime?.code === '06' || res?.result?.realtime?.code === '07' || res?.result?.realtime?.code === '08' || res?.result?.realtime?.code === '09' || res?.result?.realtime?.code === '10' || res?.result?.realtime?.code === '11' || res?.result?.realtime?.code === '12') {
                    res.result.realtime.text = 'yu';
                }
                this.setState({
                    weatherData: res || {},
                });
            },
        });
    };

    getDevice = () => {
        const { deviceCurrentIndex } = this.state;
        let index = deviceCurrentIndex;
        index += 1;
        if (index > 2) {
            this.setState({
                deviceCurrentIndex: 1,
            });
        } else {
            this.setState({
                deviceCurrentIndex: 2,
            });
        }
    };

    getEvent = () => {
        const { eventCurrentIndex } = this.state;
        let index = eventCurrentIndex;
        index += 1;
        if (index > 2) {
            this.setState({
                eventCurrentIndex: 1,
            });
        } else {
            this.setState({
                eventCurrentIndex: 2,
            });
        }
    };

    selectChange = (value) => {
        this.setState(
            {
                provinceValue: value,
            },
            () => {
                this.getDeviceRest();
            },
        );
    };

    getDeviceRest = () => {
        const { dispatch } = this.props;
        let { provinceValue } = this.state;
        if (provinceValue === '') {
            provinceValue = undefined;
        }
        dispatch({
            type: 'dataCockpitSpace/getDeviceRest',
            payload: {
                hasDataAuth: false,
                areaCode: provinceValue,
            },
            callback: (res) => {
                this.setState({
                    deviceRestData: res.data,
                });
            },
        });
    };

    // 判断实时事件颜色
    getItemColor = (value) => {
        if (value) {
            if (value === 'BREAKDOWN') {
                return '#FF6D6D';
            }
            if (value === 'REPAIR') {
                return '#B793FF';
            }
            if (value === 'TO_BE_MAINTAINED') {
                return '#00BCFF';
            }
            if (value === 'TO_BE_SCRAPPED') {
                return '#E2D080';
            }
            if (value === 'EXPIRED') {
                return '#A2E3FF';
            }
            return '#FFF';
        }
    };

    render() {
        const tabsDevice = this.state.tabsDevice.map((res) => {
            // 遍历标签页，如果标签的id等于tabid，那么该标签就加多一个active的className
            const tabStyle = res.id === this.state.deviceCurrentIndex ? `${styles.active} ${styles.subCtrl}` : `${styles.subCtrl}`;
            return (
                <div style={{ marginRight: 30 }} className={tabStyle} key={res.id}>
                    {res.tabName}
                </div>
            );
        });
        const tabsEvent = this.state.tabsEvent.map((res) => {
            // 遍历标签页，如果标签的id等于tabid，那么该标签就加多一个active的className
            const tabStyle = res.id === this.state.eventCurrentIndex ? `${styles.active} ${styles.subCtrl}` : `${styles.subCtrl}`;
            return (
                <div style={{ marginRight: 30 }} className={tabStyle} key={res.id}>
                    {res.tabName}
                </div>
            );
        });
        const { deviceCurrentIndex, eventCurrentIndex, provinceValue, eventList, weatherData, deviceTypeData, deviceStatusData, deviceStatisticsTotalData, areaFirstList, deviceRestData } = this.state;
        const date = new Date();
        const Week = ['日', '一', '二', '三', '四', '五', '六'];
        const day = Week[date.getDay()];
        return (
            <div className={styles.container}>
                <div className={styles['baseTop-content']}>
                    <div className={styles['top-title']}>
                        <div
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                overflow: 'hidden',
                            }}>
                            <div className={styles['top-title-logo']}></div>
                            <div className={styles['top-title-font']}>
                                {/*<div className={styles['title-font-style-in']}>{weatherData?.result?.last_update?.slice(0, 4)}</div>*/}
                                <div className={styles['title-font-style-in']}>{date.getFullYear()}</div>
                                <div className={styles['title-font-style']} style={{ marginLeft: 4 }}>
                                    年
                                </div>
                                {/*<div className={styles['title-font-style-in']}>{weatherData?.result?.last_update?.slice(5, 7)}</div>*/}
                                <div className={styles['title-font-style-in']}>{date.getMonth() + 1}</div>
                                <div className={styles['title-font-style']}>月</div>
                                {/*<div className={styles['title-font-style-in']}>{weatherData?.result?.last_update?.slice(8, 10)}</div>*/}
                                <div className={styles['title-font-style-in']}>{date.getDate()}</div>
                                <div className={styles['title-font-style']}>日</div>
                                <div
                                    className={styles['title-font-style']}
                                    style={{
                                        marginLeft: 16,
                                        marginRight: 4,
                                    }}>
                                    星期
                                </div>
                                <div
                                    className={styles['title-font-style']}
                                    style={{
                                        marginRight: 23,
                                        color: '#1890ff',
                                        fontWeight: 600,
                                    }}>
                                    {/*{weatherData?.week?.slice(2, 3)}*/}
                                    {day}
                                </div>
                                {/*<div className={styles['title-font-style-in']}>{weatherData?.result?.last_update?.slice(11, 19)}</div>*/}
                                <div className={styles['title-font-style-in']}>
                                    {date.getHours()}:{date.getUTCMinutes()}
                                </div>
                            </div>
                        </div>
                        <div className={styles['top-title-middle']}>
                            <div className={styles['top-title-middle-image']}></div>
                            <div className={styles['top-title-middle-right']}>
                                <div className={styles['top-title-middle-line']}></div>
                                <div className={styles['top-title-middle-select']}>
                                    <Select defaultValue="全国" onChange={this.selectChange}>
                                        <Option value="">全国</Option>
                                        {areaFirstList.map((item) => {
                                            return (
                                                <Option key={item.code} value={item.code}>
                                                    {item.name}
                                                </Option>
                                            );
                                        })}
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className={styles['title-right-content']}>
                            <div className={styles['top-title-right']}>
                                <div className={styles['top-title-right-location']}></div>
                                {/*<div className={styles['top-title-right-city']}>{weatherData?.result?.location?.name}</div>*/}
                                <div className={styles['top-title-right-city']}>重庆</div>
                                {/*<img className={styles['top-title-right-weather']} src={`/weather_icon/${weatherData?.result?.realtime?.text}.png`} />*/}
                                {/*<img className={styles['top-title-right-weather']} src="/weather_icon/yun.png" />*/}
                                <div className={styles['top-title-right-weather']}></div>
                                {/*<div className={styles['top-title-right-temp']}>{weatherData?.result?.realtime?.temp}</div>*/}
                                <div className={styles['top-title-right-temp']}>15~24</div>
                                <div className={styles['top-title-right-tempNum']}>℃</div>
                                <div className={styles['top-title-right-humidity']}>湿度：</div>
                                {/*<div className={styles['top-title-right-percent']}>{weatherData?.result?.realtime?.rh}%</div>*/}
                                <div className={styles['top-title-right-percent']}>83%</div>
                            </div>
                        </div>
                        <div className={styles['title-bottom-line-left']}></div>
                        <div className={styles['title-bottom-line-right']}></div>
                    </div>
                </div>
                <div className={styles['base-container']}>
                    <div className={styles['content-left']}>
                        <div className={styles['left-parcel-top']}>
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    paddingTop: 55,
                                    display: 'flex',
                                }}>
                                <div className={styles['left-parcel-top-left']}>
                                    <div className={styles['left-parcel-top-left-top']}>
                                        <div className={styles['event-center-container']}>
                                            <div className={styles['container-title-container']}>
                                                <div className={styles.title}>
                                                    <span>设备接入</span>
                                                </div>
                                            </div>
                                            <div className={styles['echarts-container-sbjr']}>
                                                <div style={{ flex: 2 }}>
                                                    <div className={styles['echarts-title']}>{tabsDevice}</div>
                                                    {deviceCurrentIndex === 2 ? <LinehartOfDevice /> : <BarhartOfDevice />}
                                                </div>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flex: 3,
                                                        alignItems: 'center',
                                                        flexDirection: 'column',
                                                    }}>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            flex: 1,
                                                            alignItems: 'center',
                                                            width: '100%',
                                                        }}>
                                                        <div
                                                            style={{
                                                                flex: 1,
                                                                width: '100%',
                                                                height: '100%',
                                                            }}>
                                                            <PieChartDevice deviceTypeData={deviceTypeData} />
                                                        </div>
                                                        <div className={styles['echarts-line']}></div>
                                                        <div
                                                            style={{
                                                                flex: 1,
                                                                width: '100%',
                                                                height: '100%',
                                                            }}>
                                                            <PieChartDeviceTwo deviceStatusData={deviceStatusData} />
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            height: 95,
                                                            width: '100%',
                                                        }}>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                flex: 1,
                                                                marginLeft: 14,
                                                                marginRight: 14,
                                                            }}>
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    flex: 1,
                                                                    width: 102,
                                                                    height: 85,
                                                                    fontSize: 14,
                                                                    textAlign: 'center',
                                                                    backgroundImage: 'linear-gradient(90deg, #004CFF30 0%, rgba(0,76,255,0.00) 100%)',
                                                                }}>
                                                                <div className={styles['device-content']}>翼闸</div>
                                                                <div className={styles['device-content']}>摆闸</div>
                                                                <div className={styles['device-content']}>三辊闸</div>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    flex: 1,
                                                                    width: 102,
                                                                    height: 85,
                                                                    fontSize: 14,
                                                                    textAlign: 'center',
                                                                }}>
                                                                <div className={styles['device-content']}>{deviceTypeData && deviceTypeData[0] ? deviceTypeData[0].deviceNum : 0}</div>
                                                                <div className={styles['device-content']}>{deviceTypeData && deviceTypeData[1] ? deviceTypeData[1].deviceNum : 0}</div>
                                                                <div className={styles['device-content']}>{deviceTypeData && deviceTypeData[2] ? deviceTypeData[2].deviceNum : 0}</div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                flex: 1,
                                                                marginRight: 14,
                                                            }}>
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    flex: 1,
                                                                    width: 102,
                                                                    height: 85,
                                                                    fontSize: 14,
                                                                    textAlign: 'center',
                                                                    backgroundImage: 'linear-gradient(90deg, #004CFF30 0%, rgba(0,76,255,0.00) 100%)',
                                                                }}>
                                                                <div className={styles['device-content']}>运行中</div>
                                                                <div className={styles['device-content']}>维保中</div>
                                                                <div className={styles['device-content']}>待报废</div>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    flex: 1,
                                                                    width: 102,
                                                                    height: 85,
                                                                    fontSize: 14,
                                                                    textAlign: 'center',
                                                                }}>
                                                                <div className={styles['device-content']}>{deviceStatusData && deviceStatusData[0] ? deviceStatusData[0].deviceNum : 0}</div>
                                                                <div className={styles['device-content']}>{deviceStatusData && deviceStatusData[1] ? deviceStatusData[1].deviceNum : 0}</div>
                                                                <div className={styles['device-content']}>{deviceStatusData && deviceStatusData[2] ? deviceStatusData[2].deviceNum : 0}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles['left-parcel-top-left-bottom']}>
                                        <div className={styles['event-center-container']}>
                                            <div className={styles['container-title-container']}>
                                                <div className={styles.title}>
                                                    <span>型号分布</span>
                                                </div>
                                            </div>
                                            <div className={styles['echarts-container']}>
                                                <Barchart />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles['left-parcel-top-right']}>
                                    <div
                                        style={{
                                            width: '100%',
                                            height: 100,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            paddingTop: 24,
                                            boxSizing: 'border-box',
                                        }}>
                                        <div className={styles['map-top-list']}>
                                            <div className={styles['map-top-itemOne']}>{deviceStatisticsTotalData && deviceStatisticsTotalData.customerNum ? deviceStatisticsTotalData.customerNum : 0}</div>
                                            <div className={styles['map-top-itemTwo']}>客户数量</div>
                                        </div>
                                        <div className={styles['map-top-line']}></div>
                                        <div className={styles['map-top-list']}>
                                            <div className={styles['map-top-itemOne']}>{deviceStatisticsTotalData && deviceStatisticsTotalData.projectNum ? deviceStatisticsTotalData.projectNum : 0}</div>
                                            <div className={styles['map-top-itemTwo']}>项目数量</div>
                                        </div>
                                        <div className={styles['map-top-line']}></div>
                                        <div className={styles['map-top-list']}>
                                            <div className={styles['map-top-itemOne']}>{deviceStatisticsTotalData && deviceStatisticsTotalData.deviceNum ? deviceStatisticsTotalData.deviceNum : 0}</div>
                                            <div className={styles['map-top-itemTwo']}>接入设备数</div>
                                        </div>
                                        <div className={styles['map-top-line']}></div>
                                        <div className={styles['map-top-list']}>
                                            <div className={styles['map-top-itemOne']}>{deviceStatisticsTotalData && deviceStatisticsTotalData.accessNum ? deviceStatisticsTotalData.accessNum : 0}</div>
                                            <div className={styles['map-top-itemTwo']}>总通行次数</div>
                                        </div>
                                        <div className={styles['map-top-line']}></div>
                                        <div className={styles['map-top-list']}>
                                            <div className={styles['map-top-itemOne']}>{deviceStatisticsTotalData && deviceStatisticsTotalData.runningTimeNum ? deviceStatisticsTotalData.runningTimeNum : 0}</div>
                                            <div className={styles['map-top-itemTwo']}>总运行时长（时）</div>
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            flex: 1,
                                            position: 'relative',
                                        }}>
                                        <div className={styles['echarts-container']}>
                                            <MapChart provinceValue={provinceValue} deviceRestData={deviceRestData} />
                                        </div>
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 20,
                                                left: '50%',
                                                transform: 'translate(-50%)',
                                            }}>
                                            <span
                                                style={{
                                                    fontSize: 20,
                                                    color: '#59A0FB',
                                                    marginRight: 20,
                                                }}>
                                                今日通行次数
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 22,
                                                    color: '#fff',
                                                }}>
                                                {deviceStatisticsTotalData && deviceStatisticsTotalData.todayPassNum ? deviceStatisticsTotalData.todayPassNum : 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={styles['map-event']}>
                                        <div className={styles['event-center-container-event']}>
                                            <div className={styles['container-title-container']}>
                                                <div className={styles.title}>
                                                    <span>实时事件</span>
                                                </div>
                                            </div>
                                            {eventList &&
                                                eventList.length > 0 &&
                                                eventList.map((item, index) => {
                                                    if (index < 4) {
                                                        return (
                                                            <div
                                                                key={item.code}
                                                                style={{
                                                                    height: 30,
                                                                    width: '100%',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    textAlign: 'center',
                                                                    overflow: 'hidden',
                                                                    background: index % 2 ? '' : '#004CFF13',
                                                                    borderBottom: '1px solid #003D99',
                                                                }}>
                                                                <div
                                                                    style={{
                                                                        flex: 1,
                                                                        overflow: 'hidden',
                                                                        color: this.getItemColor(item.type),
                                                                    }}>
                                                                    {item.type}
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        flex: 1,
                                                                        overflow: 'hidden',
                                                                        color: '#FFF',
                                                                    }}>
                                                                    {item.areaName}
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        flex: 2.5,
                                                                        color: '#FFF',
                                                                        paddingLeft: 4,
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap',
                                                                        textAlign: 'left',
                                                                    }}>
                                                                    {item.projectName}
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        flex: 1,
                                                                        color: '#FFF',
                                                                        paddingLeft: 4,
                                                                        overflow: 'hidden',
                                                                        textOverflow: 'ellipsis',
                                                                        whiteSpace: 'nowrap',
                                                                        textAlign: 'left',
                                                                    }}>
                                                                    {item.time}
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles['left-parcel-bottom']}>
                            <div className={styles['event-center-container']}>
                                <div className={styles['container-title-container']}>
                                    <div className={styles.title}>
                                        <span>事件统计</span>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flex: 1,
                                        position: 'relative',
                                        alignItems: 'center',
                                        height: '100%',
                                    }}>
                                    <div
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            height: '100%',
                                        }}>
                                        <div className={styles['echarts-container']}>
                                            <PieChartEvent />
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            width: 1,
                                            height: 100,
                                            backgroundImage: 'linear-gradient(179deg, rgba(0,112,255,0.00) 1%, #0070FF 53%, rgba(0,112,255,0.00) 99%)',
                                        }}></div>
                                    <div
                                        style={{
                                            flex: 2,
                                            height: '100%',
                                        }}>
                                        <div className={styles['echarts-title']}>{tabsEvent}</div>
                                        <div className={styles['echarts-container']}>{eventCurrentIndex === 2 ? <LineChartOfEvent /> : <BarChartOfEvent />}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles['content-right']}>
                        <div className={styles['right-parcel-top']}>
                            <div
                                className={styles['event-center-container']}
                                style={{
                                    marginTop: 55,
                                    height: 'calc(100% - 55px)',
                                }}>
                                <div className={styles['container-title-container']}>
                                    <div className={styles.title}>
                                        <span>客户分布</span>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flex: 1,
                                    }}>
                                    <div
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}>
                                        <div
                                            style={{
                                                flex: 2,
                                                width: '100%',
                                            }}>
                                            <div className={styles['echarts-container']}>
                                                <PieChartCustomer />
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                flex: 3,
                                                width: '100%',
                                            }}>
                                            <div className={styles['echarts-container']}>
                                                <FoolPieChartCustomer />
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div className={styles['echarts-container']}>
                                            <BarChartCustomer />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles['right-parcel-bottom']}>
                            <div className={styles['event-center-container']}>
                                <div className={styles['container-title-container']}>
                                    <div className={styles.title}>
                                        <span>通行 / 故障</span>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flex: 1,
                                        flexDirection: 'column',
                                    }}>
                                    <div style={{ flex: 1 }}>
                                        <div className={styles['echarts-container']}>
                                            <LineChartAbnormal />
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                        }}>
                                        <div
                                            style={{
                                                flex: 1,
                                                width: '100%',
                                            }}>
                                            <div className={styles['echarts-container']}>
                                                <BarChartPass />
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                flex: 1,
                                                width: '100%',
                                            }}>
                                            <div className={styles['echarts-container']}>
                                                <BarChartAbnormal />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ;
            </div>
        );
    }
}

export default TableView;
