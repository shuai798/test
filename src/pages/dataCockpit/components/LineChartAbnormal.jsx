import React, { Component } from 'react';
// 按需导入
import 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import ReactEcharts from 'echarts-for-react';
import styles from '../index.less';
import { connect } from 'dva';
import moment from 'moment';

@connect(({ statisticsBreakdownSpace }) => {
    return {
        statisticsBreakdownSpace,
    };
})
class LineChartAbnormal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventNumStatisticsTrendChartData: [],
        };
    }

    componentDidMount() {
        this.eventNumStatisticsTrendChartData();
        setInterval(() => {
            this.eventNumStatisticsTrendChartData();
        }, 600000);
    }

    // 通行趋势
    eventNumStatisticsTrendChartData = () => {
        const { dispatch } = this.props;
        const startDate = moment(new Date()).subtract(10, 'days').format('YYYY-MM-DD');
        const endDate = moment().subtract(0, 'days').format('YYYY-MM-DD');
        // 客户数量
        dispatch({
            type: 'statisticsBreakdownSpace/eventNumStatisticsTrendChartData',
            payload: {
                startDate,
                endDate,
                hasDataAuth: false,
            },
            callback: (res) => {
                this.setState({
                    eventNumStatisticsTrendChartData: res.data,
                });
            },
        });
    };

    getOption = () => {
        const { eventNumStatisticsTrendChartData } = this.state;
        const xData = [];
        const passNum = []; // 通行次数
        const breakdownNum = []; // 故障数量
        eventNumStatisticsTrendChartData &&
            eventNumStatisticsTrendChartData.length > 0 &&
            eventNumStatisticsTrendChartData.forEach((item) => {
                xData.push(item.date);
                passNum.push(item.passNum);
                breakdownNum.push(item.breakdownNum);
            });
        const option = {
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer: {
                    // 坐标轴指示器，坐标轴触发有效
                    type: 'line', // 默认为直线，可选为：'line' | 'shadow'
                    lineStyle: {
                        // 阴影指示器样式设置
                        width: 1, // 阴影大小
                        color: 'rgba(255,255,255,0.20)', // 阴影颜色
                    },
                },
                extraCssText: 'box-shadow: 0px 4px 10px 0px rgba(0,55,103,0.2);',
                backgroundColor: '#0033FF50',
                textStyle: {
                    color: 'rgba(255,255,255,0.85)',
                },
                padding: 10,
                formatter: '{b}<br /><span style="margin-bottom:8px;">{a0}：</span>{c0}<br /><span style="">{a1}：</span>{c1}',
                position(point, params, dom, rect, size) {
                    // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
                    // 提示框位置
                    let x = 0; // x坐标位置
                    let y = 0; // y坐标位置
                    // 当前鼠标位置
                    const pointX = point[0];
                    const pointY = point[1];
                    // 提示框大小
                    const boxWidth = size.contentSize[0];
                    const boxHeight = size.contentSize[1];
                    // boxWidth > pointX 说明鼠标左边放不下提示框
                    if (boxWidth > pointX) {
                        x = 5;
                    } else {
                        // 左边放的下
                        x = pointX - boxWidth;
                    }
                    // boxHeight > pointY 说明鼠标上边放不下提示框
                    if (boxHeight > pointY) {
                        y = 5;
                    } else {
                        // 上边放得下
                        y = pointY - boxHeight;
                    }
                    return [x, y];
                },
            },
            grid: {
                top: 35,
                left: 10,
                right: 20,
                bottom: 20,
                containLabel: true,
            },
            legend: {
                show: true,
                icon: 'circle',
                orient: 'horizontal',
                itemWidth: 8,
                itemHeight: 8,
                itemGap: 35,
                right: 10,
                top: 0,
                // bottom: 20,
                textStyle: {
                    fontSize: 14,
                    lineHeight: 20,
                    color: '#5392CB',
                },
                data: ['通行次数', '故障数量'],
            },
            xAxis: {
                type: 'category',
                data: xData,
                axisLabel: {
                    //坐标轴刻度标签的相关设置。
                    // interval: '1', //设置为 1，表示『隔一个标签显示一个标签』
                    formatter: (params) => {
                        return params.substr(5);
                    },
                    textStyle: {
                        color: 'rgba(255,255,255,0.85)',
                        fontStyle: 'normal',
                        fontSize: 14,
                        lineHeight: 20,
                    },
                },
                axisTick: {
                    //坐标轴刻度相关设置。
                    show: true,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.30)',
                        opacity: 0.2,
                    },
                },
                axisLine: {
                    //坐标轴轴线相关设置
                    lineStyle: {
                        color: 'rgba(255,255,255,0.10)',
                        opacity: 0.2,
                    },
                },
                splitLine: {
                    //坐标轴在 grid 区域中的分隔线。
                    show: false,
                    lineStyle: {
                        color: '#fff',
                        opacity: 0.1,
                    },
                },
                boundaryGap: [0, 20], //坐标轴两边留白
            },
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        textStyle: {
                            color: 'rgba(255,255,255,0.85)',
                            fontStyle: 'normal',
                            fontFamily: 'PingFangSC-Regular',
                            fontSize: 14,
                            lineHeight: 20,
                        },
                        formatter: (value) => {
                            if (value < 10000) {
                                return value;
                            }
                            const v = value / 10000;
                            if (v < 1) {
                                return v;
                            }
                            return `${v}万`;
                        },
                    },
                    axisLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#ffffff',
                            opacity: 0.1,
                        },
                    },
                    min: 0,
                    minInterval: 1,
                },
            ],
            series: [
                {
                    name: ['通行次数'],
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 5,
                    showAllSymbol: true,
                    barWidth: 8,
                    barGap: '50%',
                    itemStyle: {
                        color: '#0070FF',
                    },
                    data: passNum,
                },
                {
                    name: ['故障数量'],
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 5,
                    showAllSymbol: true,
                    barWidth: 8,
                    itemStyle: {
                        color: '#E2D080',
                    },
                    data: breakdownNum,
                },
            ],
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

export default LineChartAbnormal;
