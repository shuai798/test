import React, { Component } from 'react';
// 按需导入
import 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import { connect } from 'dva';
import styles from '../index.less';

@connect(({ deviceAccessStatisticSpace }) => {
    return {
        deviceAccessStatisticSpace,
    };
})
class BarhartOfDevice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accessTrendChartData: [], // 设备接入趋势数据
        };
    }

    componentDidMount() {
        this.accessTrendChartData();
    }

    // 获取设备接入趋势
    accessTrendChartData = () => {
        const { dispatch } = this.props;
        const startDate = moment(new Date()).subtract(30, 'days').format('YYYY-MM-DD');
        const endDate = moment().subtract(0, 'days').format('YYYY-MM-DD');
        // 客户数量
        dispatch({
            type: 'deviceAccessStatisticSpace/accessTrendChartData',
            payload: {
                startDate,
                endDate,
                hasDataAuth: false,
            },
            callback: (res) => {
                this.setState({
                    accessTrendChartData: res.data,
                });
            },
        });
    };

    // 人数统计折线图
    getOption = () => {
        const { accessTrendChartData } = this.state;
        const xData = [];
        const swingGateNewNum = []; // 摆闸新增数量
        const wingGateNewNum = []; // 翼闸新增数量
        const tripodTurnstileNewNum = []; // 三辊闸新增数量
        (accessTrendChartData || []).map((item) => {
            xData.push(item.date);
            swingGateNewNum.push(item.swingGateNewNum);
            wingGateNewNum.push(item.wingGateNewNum);
            tripodTurnstileNewNum.push(item.tripodTurnstileNewNum);
        });
        const option = {
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer: {
                    // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                    shadowStyle: {
                        // 阴影指示器样式设置
                        width: 'auto', // 阴影大小
                        color: 'rgba(24,144,255,0.15)', // 阴影颜色
                    },
                },
                extraCssText: 'box-shadow: 0px 4px 10px 0px rgba(0,55,103,0.2);',
                backgroundColor: '#0033FF50',
                textStyle: {
                    color: 'rgba(255,255,255,0.85)',
                },
                padding: 10,
                formatter: '{b}<br /><span style="margin-bottom:8px;">{a0}：</span>{c0}<br /><span style="margin-left:15px;">{a1}：</span>{c1}<br /><span style="margin-left:15px;">{a2}：</span>{c2}<br />',
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
            legend: {
                show: true,
                top: 10,
                right: 5,
                itemWidth: 8,
                itemHeight: 8,
                itemGap: 25,
                data: ['翼闸', '摆闸', '三辊闸'],
                icon: 'circle',
                textStyle: {
                    color: '#5392CB',
                },
            },
            grid: {
                left: '14px',
                right: '14px',
                bottom: '0',
                top: '40px',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                x: 'center',
                axisTick: {
                    alignWithLabel: true,
                },
                axisLabel: {
                    // rotate: -50,
                    formatter: (params) => {
                        return params.substr(5);
                    },
                    textStyle: {
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: 14,
                        lineHeight: 20,
                    },
                },
                axisLine: {
                    // 坐标轴轴线相关设置。
                    lineStyle: {
                        // 线条样式。
                        color: 'rgba(255,255,255,0.10)',
                    },
                },
                data: xData,
            },
            yAxis: {
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    textStyle: {
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: 14,
                        lineHeight: 20,
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        width: 1,
                        color: 'rgba(255,255,255,0.10)',
                    },
                },
                min: 0,
                minInterval: 1,
                type: 'value',
            },
            series: [
                {
                    name: '三辊闸',
                    type: 'bar',
                    barWidth: 10,
                    stack: '总量',
                    areaStyle: {},
                    showSymbol: false,
                    color: '#B793FF',
                    itemStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: 'rgba(183,147,255,0.54)', // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: '#B793FF', // 100% 处的颜色
                                    },
                                ],
                                global: false, // 缺省为 false
                            },
                        },
                    },
                    data: tripodTurnstileNewNum,
                },
                {
                    name: '摆闸',
                    type: 'bar',
                    barWidth: 'auto',
                    stack: '总量',
                    areaStyle: {},
                    showSymbol: false,
                    itemStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: 'rgba(226,208,128,0.46)', // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: '#E2D080', // 100% 处的颜色
                                    },
                                ],
                                global: false, // 缺省为 false
                            },
                        },
                    },
                    data: swingGateNewNum,
                },
                {
                    name: '翼闸',
                    type: 'bar',
                    barWidth: 'auto',
                    stack: '总量',
                    areaStyle: {},
                    showSymbol: false,
                    itemStyle: {
                        normal: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: 'rgba(0,112,255,0.45)', // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: '#0070FF', // 100% 处的颜色
                                    },
                                ],
                                global: false, // 缺省为 false
                            },
                        },
                    },
                    data: wingGateNewNum,
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

export default BarhartOfDevice;
