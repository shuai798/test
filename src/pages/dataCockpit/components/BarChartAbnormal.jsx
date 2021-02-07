import React, { Component } from 'react';
// 按需导入
import 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import ReactEcharts from 'echarts-for-react';
import Echarts from 'echarts';
import styles from '../index.less';
import { connect } from 'dva';

@connect(({ statisticsBreakdownSpace }) => {
    return {
        statisticsBreakdownSpace,
    };
})
class BarChartAbnormal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            troubleModel: [], // 故障型号
        };
    }

    componentDidMount() {
        this.statisticsBySeries();
        setInterval(() => {
            this.statisticsBySeries();
        }, 600000);
    }

    // 故障型号
    statisticsBySeries = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'statisticsBreakdownSpace/statisticsBySeries',
            payload: {
                limit: 5,
                hasDataAuth: false,
            },
            callback: (res) => {
                this.setState({
                    troubleModel: res.data,
                });
            },
        });
    };

    getOption = () => {
        const { troubleModel } = this.state;
        const dataType = [];
        const dataNum = [];
        (troubleModel || []).map((item) => {
            dataType.push(item.seriesName);
            dataNum.push(item.num);
        });
        const option = {
            color: ['red'],
            grid: {
                left: 10,
                right: 10,
                bottom: -5,
                top: 10,
                containLabel: true,
            },
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
                // formatter: '{b}<br /><span style="margin-bottom:8px;">故障数量：</span>{c}',
                formatter(param) {
                    return `${param[0].axisValue}<br />${param[0].marker} 故障数量：${param[0].value}`;
                },
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
            xAxis: {
                show: false,
                type: 'value',
            },
            yAxis: [
                {
                    type: 'category',
                    inverse: true,
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: 'rgba(255,255,255,0.85)',
                            fontSize: 11,
                        },
                    },
                    splitLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            // 属性lineStyle控制线条样式
                            color: 'rgba(255,255,255,0.10)',
                            width: 2,
                            type: 'solid',
                        },
                    },
                    data: dataType,
                },
                {
                    type: 'category',
                    inverse: true,
                    axisTick: 'none',
                    axisLine: 'none',
                    show: true,
                    axisLabel: {
                        textStyle: {
                            color: 'rgba(255,255,255,0.85)',
                            fontSize: 11,
                        },
                    },
                    data: dataNum,
                },
            ],
            series: [
                {
                    name: '',
                    type: 'bar',
                    zlevel: 1,
                    itemStyle: {
                        normal: {
                            barBorderRadius: 2,
                            color: new Echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                {
                                    offset: 0,
                                    color: '#0070FF00',
                                },
                                {
                                    offset: 1,
                                    color: '#0070FF',
                                },
                            ]),
                        },
                    },
                    barWidth: 7,
                    data: dataNum,
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

export default BarChartAbnormal;
