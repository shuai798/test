import React, { Component } from 'react';
// 按需导入
import 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';
import styles from '../index.less';

@connect(({ customerStatisticSpace }) => {
    return {
        customerStatisticSpace,
    };
})
class PieChartCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            industryData: [], // 获取行业分布占比前五
        };
    }

    componentDidMount() {
        this.getIndustryDistributionOverview();
    }

    // 获取行业分布占比前五
    getIndustryDistributionOverview = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'customerStatisticSpace/getIndustryDistributionOverview',
            payload: {
                hasDataAuth: false,
            },
            callback: (res) => {
                this.setState({
                    industryData: res.data,
                });
            },
        });
    };

    getOption = () => {
        const { industryData } = this.state;
        const industryName = [];
        (industryData || []).map((item) => {
            industryName.push(item.industryName);
            item.name = item.industryName;
            item.value = item.customerNum;
        });
        const arrName = [];
        const arrValue = [];
        let sum = 0;
        const pieSeries = [];
        const lineYAxis = [];
        industryData.forEach((v, i) => {
            arrName.push(v.name);
            arrValue.push(v.value);
            sum += v.value + i;
        });
        industryData.forEach((v, i) => {
            pieSeries.push({
                name: '行业类型',
                type: 'pie',
                clockWise: true,
                hoverAnimation: false,
                radius: [`${73 - (i - 1) * 15}%`, `${68 - (i - 1) * 15}%`],
                center: ['45%', '56%'],
                label: {
                    show: false,
                },
                data: [
                    {
                        name: v.name,
                        value: v.value,
                    },
                    {
                        value: sum - v.value,
                        name: '',
                        itemStyle: {
                            color: 'rgba(0,0,0,0)',
                        },
                    },
                ],
            });
            lineYAxis.push({
                value: i,
            });
        });
        const option = {
            color: '#0070FF',
            grid: {
                top: '15%',
                bottom: '35%',
                left: '55%',
                containLabel: false,
            },
            yAxis: [
                {
                    type: 'category',
                    inverse: true,
                    z: 3,
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        formatter(params) {
                            const item = industryData[params];
                            return `{name|${item.name}}{value|${item.value}}`;
                        },
                        interval: 0,
                        inside: false,
                        textStyle: {
                            // padding: [0, 0, 10, 10],
                            color: 'rgba(255,255,255,0.85)',
                            fontSize: 14,
                            rich: {
                                name: {
                                    padding: [10, 10, 0, 0],
                                    color: 'rgba(255,255,255,0.85)',
                                    fontSize: 12,
                                },
                                value: {
                                    color: '#FFFFFF',
                                    fontSize: 12,
                                    padding: [10, 25, 0, 0],
                                },
                            },
                        },
                        show: true,
                    },
                    data: lineYAxis,
                },
            ],
            xAxis: [
                {
                    show: false,
                },
            ],
            series: pieSeries,
        };
        return option;
    };

    render() {
        return (
            <div className={styles.flowTrendBox}>
                <ReactEcharts
                    option={this.getOption()}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}></ReactEcharts>
            </div>
        );
    }
}

export default PieChartCustomer;
