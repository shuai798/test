import React, { Component } from 'react';
// 按需导入
import Echarts from 'echarts';
import moment from 'moment';
import { connect } from 'dva';
import ReactEcharts from 'echarts-for-react';
import styles from '../index.less';

@connect(({ eventStatisticsSpace }) => {
    return {
        eventStatisticsSpace,
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

    // 事件趋势
    eventNumStatisticsTrendChartData = () => {
        const { dispatch } = this.props;
        const startDate = moment(new Date()).subtract(30, 'days').format('YYYY-MM-DD');
        const endDate = moment().subtract(0, 'days').format('YYYY-MM-DD');
        // 客户数量
        dispatch({
            type: 'eventStatisticsSpace/eventNumStatisticsTrendChartData',
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
        const breakdownTotalNum = []; // 故障累计
        const expiredTotalNum = []; // 已过期累计
        const maintainedTotalNum = []; // 待维保累计
        const repairTotalNum = []; // 报修累计
        const scrappedTotalNum = []; // 待报废累计
        (eventNumStatisticsTrendChartData || []).map((item) => {
            xData.push(item.date);
            breakdownTotalNum.push(item.breakdownTotalNum);
            expiredTotalNum.push(item.expiredTotalNum);
            maintainedTotalNum.push(item.maintainedTotalNum);
            repairTotalNum.push(item.repairTotalNum);
            scrappedTotalNum.push(item.scrappedTotalNum);
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
                formatter: '{b}<br /><span style="margin-left:15px;margin-bottom:8px;">{a0}：</span>{c0}<br /><span style="margin-left:15px;">{a1}：</span>{c1}<br /><span style="">{a2}：</span>{c2}<br /><span style="">{a3}：</span>{c3}<br /><span style="">{a4}：</span>{c4}',
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
                top: 40,
                left: 10,
                right: 20,
                bottom: 0,
                containLabel: true,
            },
            legend: {
                show: true,
                icon: 'circle',
                orient: 'horizontal',
                itemWidth: 8,
                itemHeight: 8,
                itemGap: 25,
                right: 10,
                top: 0,
                // bottom: 20,
                textStyle: {
                    fontSize: 14,
                    lineHeight: 20,
                    color: '#5392CB',
                },
                data: ['故障', '报修', '待维保', '待报废', '已过期'],
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
                boundaryGap: false,
            },
            yAxis: [
                {
                    type: 'value',
                    min: 0,
                    minInterval: 1,
                    axisLabel: {
                        textStyle: {
                            color: 'rgba(255,255,255,0.85)',
                            fontStyle: 'normal',
                            fontFamily: 'PingFangSC-Regular',
                            fontSize: 14,
                            lineHeight: 20,
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
                },
            ],
            series: [
                {
                    name: ['故障'],
                    type: 'line',
                    stack: '总量',
                    smooth: true,
                    symbol: 'none',
                    itemStyle: {
                        normal: {
                            color: '#FF6D6D',
                            lineStyle: {
                                color: '#FF6D6D',
                                width: 2,
                            },
                            areaStyle: {
                                color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: '#FF6D6D40',
                                    },
                                    {
                                        offset: 1,
                                        color: '#FF6D6D00',
                                    },
                                ]),
                            },
                        },
                    },

                    data: breakdownTotalNum,
                },
                {
                    name: ['报修'],
                    type: 'line',
                    stack: '总量',
                    symbol: 'none',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#B793FF',
                            lineStyle: {
                                color: '#B793FF',
                                width: 2,
                            },
                            areaStyle: {
                                color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: '#B793FF40',
                                    },
                                    {
                                        offset: 1,
                                        color: '#B793FF00',
                                    },
                                ]),
                            },
                        },
                    },
                    data: repairTotalNum,
                },
                {
                    name: ['待维保'],
                    type: 'line',
                    stack: '总量',
                    smooth: true,
                    symbol: 'none',
                    itemStyle: {
                        normal: {
                            color: '#00BCFF',
                            lineStyle: {
                                color: '#00BCFF',
                                width: 2,
                            },
                            areaStyle: {
                                color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: '#00BCFF40',
                                    },
                                    {
                                        offset: 1,
                                        color: '#00BCFF00',
                                    },
                                ]),
                            },
                        },
                    },
                    data: maintainedTotalNum,
                },
                {
                    name: ['待报废'],
                    type: 'line',
                    stack: '总量',
                    symbol: 'none',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#E2D080',
                            lineStyle: {
                                color: '#E2D080',
                                width: 2,
                            },
                            areaStyle: {
                                color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: '#E2D08040',
                                    },
                                    {
                                        offset: 1,
                                        color: '#E2D08000',
                                    },
                                ]),
                            },
                        },
                    },
                    data: scrappedTotalNum,
                },
                {
                    name: ['已过期'],
                    type: 'line',
                    stack: '总量',
                    symbol: 'none',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#59A0FB',
                            lineStyle: {
                                color: '#59A0FB',
                                width: 2,
                            },
                            areaStyle: {
                                color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: '#59A0FB40',
                                    },
                                    {
                                        offset: 1,
                                        color: '#59A0FB00',
                                    },
                                ]),
                            },
                        },
                    },
                    data: expiredTotalNum,
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
