import React, { Component } from 'react';
import { Card, Row, Col, Statistic, Divider } from 'antd';
import { connect } from 'dva';

@connect(({ deviceAccessStatisticSpace }) => {
    return {
        deviceAccessStatisticSpace,
    };
})
class OverviewData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalData: {},
            organizationInfo: [],
        };
    }

    componentDidMount() {
        this.getCustomerData();
        this.getOrganization();
    }

    getOrganization = () => {
        const { dispatch } = this.props;
        const { orgId } = JSON.parse(localStorage.getItem('userInfo'));
        dispatch({
            type: 'organizationChartSpace/getTableListInfo',
            payload: {
                orgId,
            },
            callback: (res) => {
                this.setState({
                    organizationInfo: res && res !== null ? res : [],
                });
            },
        });
    };

    getCustomerData = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceAccessStatisticSpace/deviceStatisticsTotalData',
            callback: (res) => {
                this.setState({
                    totalData: res.data,
                });
            },
        });
    };

    render() {
        const { totalData, organizationInfo } = this.state;
        return (
            <Card title="数据概览" extra={<span>{organizationInfo && organizationInfo[0] && organizationInfo[0].nameContainsParent}</span>}>
                <Row type="flex" justify="space-around">
                    <Col span={4}>
                        <Statistic style={{ textAlign: 'center' }} title="客户数量" value={totalData && totalData.customerNum ? totalData.customerNum : 0}></Statistic>
                    </Col>
                    <Divider type="vertical" style={{ height: 69 }}></Divider>
                    <Col span={4}>
                        <Statistic style={{ textAlign: 'center' }} title="项目数量" value={totalData && totalData.projectNum ? totalData.projectNum : 0}></Statistic>
                    </Col>
                    <Divider type="vertical" style={{ height: 69 }}></Divider>
                    <Col span={4}>
                        <Statistic style={{ textAlign: 'center' }} title="接入设备数" value={totalData && totalData.deviceNum ? totalData.deviceNum : 0}></Statistic>
                    </Col>
                    <Divider type="vertical" style={{ height: 69 }}></Divider>
                    <Col span={4}>
                        <Statistic style={{ textAlign: 'center' }} title="总通行次数" value={totalData && totalData.passNum ? totalData.passNum : 0}></Statistic>
                    </Col>
                    <Divider type="vertical" style={{ height: 60 }}></Divider>
                    <Col span={4}>
                        <Statistic style={{ textAlign: 'center' }} title="总运行时长（小时）" value={totalData && totalData.runningTimeNum ? totalData.runningTimeNum : 0}></Statistic>
                    </Col>
                </Row>
            </Card>
        );
    }
}

export default OverviewData;
