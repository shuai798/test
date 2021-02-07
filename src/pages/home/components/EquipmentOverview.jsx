import React, { Component } from 'react';
import { Card, Row, Col, Radio, Badge } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PieChart from './EquipmentPieChart';
import BarChart from './BarChart';
import LineChart from './LineChart';
import styles from '../index.less';

@connect(({ deviceAccessStatisticSpace }) => {
    return {
        deviceAccessStatisticSpace,
    };
})
class EquipmentOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultRadioValue: 'add',
            activeRadioValue: 'add',
            accessTrendChartData: [], // 设备概览
            deviceStatusData: [], // 设备状态数据
        };
    }

    componentDidMount = () => {
        this.accessTrendChartData();
        this.deviceStatusData();
    };

    // 获取设备接入趋势
    accessTrendChartData = () => {
        const { dispatch } = this.props;
        const startDate = moment(new Date()).subtract(10, 'days').format('YYYY-MM-DD');
        const endDate = moment().subtract(0, 'days').format('YYYY-MM-DD');
        // 客户数量
        dispatch({
            type: 'deviceAccessStatisticSpace/accessTrendChartData',
            payload: {
                startDate,
                endDate,
            },
            callback: (res) => {
                this.setState({
                    accessTrendChartData: res.data,
                });
            },
        });
    };

    // 获取设备状态
    deviceStatusData = () => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        // 客户数量
        dispatch({
            type: 'deviceAccessStatisticSpace/deviceStatusData',
            payload: {
                ...searchParam,
            },
            callback: (res) => {
                this.setState({
                    deviceStatusData: res.data,
                });
            },
        });
    };

    radioChange = (e) => {
        this.setState({
            activeRadioValue: e.target.value,
        });
    };

    render() {
        const { defaultRadioValue, activeRadioValue, accessTrendChartData, deviceStatusData } = this.state;
        const cardExtra = (
            <Radio.Group defaultValue={defaultRadioValue} onChange={this.radioChange}>
                <Radio.Button value="add">新增</Radio.Button>
                <Radio.Button className="radio-total" value="addUp">累计</Radio.Button>
            </Radio.Group>
        );
        return (
            <Card className="mr10" style={{ flex: 1 }} title="设备概览" extra={cardExtra}>
                <Row
                    type="flex"
                    gutter={{
                        md: 8,
                        lg: 24,
                        xl: 48,
                    }}>
                    {activeRadioValue === 'add' ? <BarChart accessTrendChartData={accessTrendChartData}></BarChart> : <LineChart accessTrendChartData={accessTrendChartData}></LineChart>}
                </Row>
                <Row
                    type="flex"
                    gutter={{
                        md: 8,
                        lg: 24,
                        xl: 48,
                    }}>
                    <Col span={14} className={styles.pieChartPad}>
                        <PieChart deviceStatusData={deviceStatusData}></PieChart>
                    </Col>
                    <Col span={10} className={styles.tabBox}>
                        <div className={styles.boxTitle}>
                            <div className={`${styles.title} ${styles.statueTitle}`}>状态</div>
                            <div className={`${styles.title} ${styles.numTitle}`}>数量</div>
                        </div>
                        <div className={styles.boxTitle}>
                            <div className={`${styles.title} ${styles.statueTitle}`}>
                                <Badge color="#60B1FD" text="运行中"></Badge>
                            </div>
                            <div className={`${styles.title} ${styles.numTitle} fz16`}>{deviceStatusData && deviceStatusData[0] ? deviceStatusData[0].deviceNum : 0}</div>
                        </div>
                        <div className={styles.boxTitle}>
                            <div className={`${styles.title} ${styles.statueTitle}`}>
                                <Badge color="#FFAA63" text="待维保"></Badge>
                            </div>
                            <div className={`${styles.title} ${styles.numTitle} fz16`}>{deviceStatusData && deviceStatusData[1] ? deviceStatusData[1].deviceNum : 0}</div>
                        </div>
                        <div className={styles.boxTitle}>
                            <div className={`${styles.title} ${styles.statueTitle}`}>
                                <Badge color="#FFDA63" text="待报废"></Badge>
                            </div>
                            <div className={`${styles.title} ${styles.numTitle} fz16`}>{deviceStatusData && deviceStatusData[2] ? deviceStatusData[2].deviceNum : 0}</div>
                        </div>
                    </Col>
                </Row>
            </Card>
        );
    }
}

export default EquipmentOverview;
