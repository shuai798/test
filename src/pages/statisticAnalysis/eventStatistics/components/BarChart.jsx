import React, { Component } from 'react';
import echarts from 'echarts';
import styles from '../style.less';

class BarChart extends Component {
    constructor(props) {
        super(props);
        this.elref = React.createRef();
        this.barChart = null;
        this.option = null;
        this.state = {
            eventNumStatisticsTrendChartData: [],
        };
    }

    componentDidMount() {
        this.initChart();
        window.addEventListener('resize', this.barChart.resize);
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.eventNumStatisticsTrendChartData !== this.state.eventNumStatisticsTrendChartData) {
            return true;
        }
        return false;
    }

    componentDidUpdate() {
        setTimeout(() => {
            this.barChart.resize();
        }, 300);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.eventNumStatisticsTrendChartData !== prevState.eventNumStatisticsTrendChartData) {
            return { eventNumStatisticsTrendChartData: nextProps.eventNumStatisticsTrendChartData };
        }
        return null;
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.barChart.resize);
    }

    getSnapshotBeforeUpdate(nextProps, prevState) {
        if (nextProps.eventNumStatisticsTrendChartData !== prevState.eventNumStatisticsTrendChartData) {
            return { eventNumStatisticsTrendChartData: nextProps.eventNumStatisticsTrendChartData };
        }
        this.initChart();
        return null;
    }

    initOption = () => {
        const { eventNumStatisticsTrendChartData } = this.state;
        const xData = [];
        const breakdownNewNum = []; // 故障新增
        const expiredNewNum = []; // 已过期新增
        const maintainedNewNum = []; // 待维保新增
        const repairNewNum = []; // 报修新增
        const scrappedNewNum = []; // 待报废新增
        let arr = eventNumStatisticsTrendChartData;
        if (eventNumStatisticsTrendChartData && eventNumStatisticsTrendChartData.length > 0) {
            if (eventNumStatisticsTrendChartData.length > 30) {
                arr = eventNumStatisticsTrendChartData.slice(-30);
            }
            arr.forEach((item) => {
                xData.push(item.date);
                breakdownNewNum.push(item.breakdownNewNum);
                expiredNewNum.push(item.expiredNewNum);
                maintainedNewNum.push(item.maintainedNewNum);
                repairNewNum.push(item.repairNewNum);
                scrappedNewNum.push(item.scrappedNewNum);
            });
        }
        const option = {
            backgroundColor: 'transparent',
            textStyle: {
                color: '#999999',
            },
            /**
             * 直角坐标系内绘图网格，单个 grid 内最多可以放置上下两个 X 轴，左右两个 Y 轴。
             * 可以在网格上绘制折线图，柱状图，散点图（气泡图）
             */
            grid: {
                top: 52, // grid 组件离容器上侧的距离。
                right: 12, // grid 组件离容器右侧的距离。
                bottom: 12, // grid 组件离容器下侧的距离。
                left: 12, // grid 组件离容器左侧的距离。
                containLabel: true,
            },
            tooltip: {
                // 提示框组件。
                /**
                 * 触发类型。
                 * 可选：
                 * 'item',数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
                 * 'axis',坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
                 * 在 ECharts 2.x 中只支持类目轴上使用 axis trigger，在 ECharts 3 中支持在直角坐标系和极坐标系上的所有类型的轴。
                 * 并且可以通过 axisPointer.axis 指定坐标轴。
                 * 'none',什么都不触发。
                 */
                extraCssText: 'box-shadow: 0px 4px 10px 0px rgba(0,55,103,0.2);',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderColor: 'rgba(0, 55, 103, 0.2)',
                textStyle: {
                    color: 'rgba(0, 0, 0, 0.85)',
                },
                padding: 10,
                trigger: 'axis',
                axisPointer: {
                    // 坐标轴指示器配置项。
                    /**
                     * 指示器类型。可选
                     * 'line' 直线指示器
                     * 'shadow' 阴影指示器
                     * 'none' 无指示器
                     * 'cross' 十字准星指示器。其实是种简写，表示启用两个正交的轴的 axisPointer。
                     */
                    type: 'shadow',
                    label: {
                        // 坐标轴指示器的文本标签。
                        backgroundColor: '#6a7985',
                    },
                },
            },
            legend: {
                show: true,
                icon: 'circle',
                orient: 'horizontal',
                itemWidth: 8,
                itemHeight: 8,
                itemGap: 25,
                top: 'top',
                left: 'center',
                // bottom: 20,
                textStyle: {
                    color: 'rgba(0, 0, 0, 0.65)',
                },
                data: ['故障', '报修', '待维保', '待报废', '已过期'],
            },
            xAxis: {
                show: true,
                type: 'category',
                data: xData,
                nameTextStyle: {
                    // 坐标轴名称的文字样式。
                    color: 'auto', // 坐标轴名称的颜色
                    fontStyle: 'normal', // 坐标轴名称文字字体的风格
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
                    // 坐标轴轴线相关设置。
                    lineStyle: {
                        // 线条样式。
                        color: 'rgba(69,120,230,0.14)',
                    },
                },
                splitLine: {
                    //坐标轴在 grid 区域中的分隔线。
                    show: true,
                    lineStyle: {
                        color: 'rgba(69,120,230,0.14)',
                        opacity: 0.1,
                    },
                },
                boundaryGap: [0, 20], //坐标轴两边留白
            },
            yAxis: [
                {
                    type: 'value',
                    min: 0,
                    minInterval: 1,
                    splitLine: {
                        // 坐标轴在 grid 区域中的分隔线。
                        show: true,
                        lineStyle: {
                            // 线条样式。
                            color: 'rgba(69,120,230,0.14)',
                        },
                    },
                    axisLine: {
                        show: true,
                        // 坐标轴轴线相关设置。
                        lineStyle: {
                            // 线条样式。
                            color: 'rgba(69,120,230,0.14)',
                        },
                    },
                },
            ],
            series: [
                {
                    name: ['故障'],
                    type: 'bar',
                    barWidth: 16,
                    stack: '总量',
                    symbol: 'none',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#FF6D6D',
                            lineStyle: {
                                color: '#FF6D6D',
                                width: 2,
                            },
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: '#FF6D6D50',
                                    },
                                    {
                                        offset: 1,
                                        color: '#FF6D6D00',
                                    },
                                ]),
                            },
                        },
                    },
                    data: breakdownNewNum,
                },
                {
                    name: ['报修'],
                    type: 'bar',
                    barWidth: 16,
                    stack: '总量',
                    symbol: 'none',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#A2E3FF',
                            lineStyle: {
                                color: '#A2E3FF',
                                width: 2,
                            },
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: '#A2E3FF50',
                                    },
                                    {
                                        offset: 1,
                                        color: '#A2E3FF00',
                                    },
                                ]),
                            },
                        },
                    },
                    data: repairNewNum,
                },

                {
                    name: ['待维保'],
                    type: 'bar',
                    barWidth: 16,
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
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: '#B793FF50',
                                    },
                                    {
                                        offset: 1,
                                        color: '#B793FF00',
                                    },
                                ]),
                            },
                        },
                    },
                    data: maintainedNewNum,
                },
                {
                    name: ['待报废'],
                    type: 'bar',
                    barWidth: 16,
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
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: '#59A0FB50',
                                    },
                                    {
                                        offset: 1,
                                        color: '#59A0FB00',
                                    },
                                ]),
                            },
                        },
                    },
                    data: scrappedNewNum,
                },
                {
                    name: ['已过期'],
                    type: 'bar',
                    barWidth: 16,
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
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: '#E2D08050',
                                    },
                                    {
                                        offset: 1,
                                        color: '#E2D08000',
                                    },
                                ]),
                            },
                        },
                    },
                    data: expiredNewNum,
                },
            ],
        };

        return option;
    };

    initChart = () => {
        this.barChart = echarts.init(this.elref.current);
        this.option = this.initOption();
        this.barChart.setOption(this.option);
    };

    render() {
        return <div className={styles.flowTrendBox} ref={this.elref}></div>;
    }
}

export default BarChart;
