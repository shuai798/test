import React, { Component } from 'react';
import { Card, Row, Col, Statistic, Divider, Icon, Badge } from 'antd';
import PieChart from './EventPieChart';
import styles from '../index.less';
import { connect } from 'dva';

@connect(({ eventStatisticsSpace }) => {
    return {
        eventStatisticsSpace,
    };
})
class OverviewEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalNumStatisticsData: {},
            pendingData: [], // 设备状态数据
        };
    }

    componentDidMount = () => {
        this.getTotalNumStatisticsData();
        this.statisticsByType();
    };

    // 获取总体统计数据
    getTotalNumStatisticsData = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'eventStatisticsSpace/getTotalNumStatisticsData',
            payload: {},
            callback: (res) => {
                this.setState({
                    totalNumStatisticsData: res.data,
                });
            },
        });
    };

    // 事件概览饼图
    statisticsByType = () => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        // 待处理
        dispatch({
            type: 'eventStatisticsSpace/statisticsByType',
            payload: {
                ...searchParam,
                handled: true,
            },
            callback: (res) => {
                this.setState({
                    pendingData: res.data,
                });
            },
        });
    };

    toPendingEvent = () => {
        const { history } = this.props;
        history.push('/monitoringCenter/pendingEvent');
    };

    render() {
        const { totalNumStatisticsData, pendingData } = this.state;
        return (
            <Card
                style={{ flex: 1 }}
                title="事件概览"
                extra={
                    <a
                        style={{ lineHeight: '32px' }}
                        onClick={() => {
                            return this.toPendingEvent();
                        }}>
                        去处理 <Icon type="right"></Icon>
                    </a>
                }>
                <Row className={styles.topBox} type="flex" justify="space-around">
                    <Col span={6}>
                        <Statistic style={{ textAlign: 'center' }} title="今日新增事件数" value={totalNumStatisticsData && totalNumStatisticsData.todayEventNum ? totalNumStatisticsData.todayEventNum : 0}></Statistic>
                    </Col>
                    <Divider type="vertical" style={{ height: 69 }}></Divider>
                    <Col span={6}>
                        <Statistic style={{ textAlign: 'center' }} title="昨日处理事件数" value={totalNumStatisticsData && totalNumStatisticsData.yesterdayHandledEventNum ? totalNumStatisticsData.yesterdayHandledEventNum : 0}></Statistic>
                    </Col>
                    <Divider type="vertical" style={{ height: 69 }}></Divider>
                    <Col span={6}>
                        <Statistic style={{ textAlign: 'center' }} title="累计处理" value={totalNumStatisticsData && totalNumStatisticsData.accumulateHandledEventNum ? totalNumStatisticsData.accumulateHandledEventNum : 0}></Statistic>
                    </Col>
                </Row>
                <Row className={styles.bottomBox} type="flex" gutter={20}>
                    <Col span={14} className={styles.pieChartPad}>
                        <PieChart pendingData={pendingData}></PieChart>
                    </Col>
                    <Col span={10} className={styles.tabBox}>
                        <div className={styles.boxTitle}>
                            <div className={`${styles.title} ${styles.statueTitle}`}>类型</div>
                            <div className={`${styles.title} ${styles.numTitle}`}>数量</div>
                        </div>
                        <div className={styles.boxTitle}>
                            <div className={`${styles.title} ${styles.statueTitle}`}>
                                <Badge color="#60B1FD" text="故障"></Badge>
                            </div>
                            <div className={`${styles.title} ${styles.numTitle} fz16`}>{pendingData && pendingData[0] ? pendingData[0].deviceEventNum : 0}</div>
                        </div>
                        <div className={styles.boxTitle}>
                            <div className={`${styles.title} ${styles.statueTitle}`}>
                                <Badge color="#4FCBCB" text="报修"></Badge>
                            </div>
                            <div className={`${styles.title} ${styles.numTitle} fz16`}>{pendingData && pendingData[1] ? pendingData[1].deviceEventNum : 0}</div>
                        </div>
                        <div className={styles.boxTitle}>
                            <div className={`${styles.title} ${styles.statueTitle}`}>
                                <Badge color="#F3657C" text="待维保"></Badge>
                            </div>
                            <div className={`${styles.title} ${styles.numTitle} fz16`}>{pendingData && pendingData[2] ? pendingData[2].deviceEventNum : 0}</div>
                        </div>
                        <div className={styles.boxTitle}>
                            <div className={`${styles.title} ${styles.statueTitle}`}>
                                <Badge color="#FFDA63" text="待报废"></Badge>
                            </div>
                            <div className={`${styles.title} ${styles.numTitle} fz16`}>{pendingData && pendingData[3] ? pendingData[3].deviceEventNum : 0}</div>
                        </div>
                        <div className={styles.boxTitle}>
                            <div className={`${styles.title} ${styles.statueTitle}`}>
                                <Badge color="#00BCFF" text="已过期"></Badge>
                            </div>
                            <div className={`${styles.title} ${styles.numTitle} fz16`}>{pendingData && pendingData[4] ? pendingData[4].deviceEventNum : 0}</div>
                        </div>
                    </Col>
                </Row>
            </Card>
        );
    }
}

export default OverviewEvent;
