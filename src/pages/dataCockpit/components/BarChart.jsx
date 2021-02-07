import React, { Component } from 'react';
// 按需导入
import 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import ReactEcharts from 'echarts-for-react';
import styles from '../index.less';
import { connect } from 'dva';

@connect(({ deviceAccessStatisticSpace }) => {
    return {
        deviceAccessStatisticSpace,
    };
})
class Barchart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceTop30Data: [],
        };
    }

    componentDidMount() {
        this.getDeviceTop30();
        setInterval(() => {
            this.getDeviceTop30();
        }, 600000);
    }

    getDeviceTop30 = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceTypeStatistics/getDeviceTop30',
            payload: {
                hasDataAuth: false,
            },
            callback: (res) => {
                this.setState({
                    deviceTop30Data: res.data,
                });
            },
        });
    };

    // 人数统计折线图
    getOption = () => {
        const { deviceTop30Data } = this.state;
        const xdata = [];
        const data = [];
        (deviceTop30Data || []).map((item) => {
            xdata.push(item.seriesName);
            data.push(item.deviceNum);
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
                formatter: '{b}<br /><span style="margin-bottom:8px;">{a}：</span>{c}',
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
                show: false,
                top: 10,
                itemWidth: 8,
                itemHeight: 8,
                itemGap: 25,
                left: 'center',
                icon: 'rect',
                textStyle: {
                    color: '#fff',
                },
            },
            grid: {
                left: '12px',
                right: '27px',
                bottom: '15px',
                top: '25px',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                x: 'center',
                nameLocation: 'start',
                nameTextStyle: {
                    align: 'center',
                },
                axisTick: {
                    alignWithLabel: true,
                },
                axisLabel: {
                    rotate: -50,
                    textStyle: {
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: 12,
                        lineHeight: 17,
                    },
                },
                axisLine: {
                    // 坐标轴轴线相关设置。
                    lineStyle: {
                        // 线条样式。
                        color: 'rgba(255,255,255,0.10)',
                    },
                },
                data: xdata,
            },
            yAxis: {
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    show: false,
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        width: 1,
                        color: 'rgba(255,255,255,0.10)',
                    },
                },
                type: 'value',
            },
            series: [
                {
                    name: '设备数量',
                    type: 'bar',
                    stack: '总量',
                    barWidth: 16,
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
                                        color: 'rgba(147,194,253,0.96)', // 0% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: '#0070FF', // 100% 处的颜色
                                    },
                                ],
                                global: false, // 缺省为 false
                            },
                            label: {
                                show: false, //开启显示
                                position: 'top', //在上方显示
                                rotate: 40,
                                textStyle: {
                                    //数值样式
                                    color: 'rgba(255,255,255,0.85)',
                                    fontSize: 10,
                                },
                            },
                        },
                    },
                    data,
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

export default Barchart;
