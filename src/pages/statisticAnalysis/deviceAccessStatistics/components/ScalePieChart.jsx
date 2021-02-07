import React, { Component } from 'react';
import echarts from 'echarts';
import filters from '@/filters/index';
import indexStyle from '../style.less';

class PieChart extends Component {
    constructor(props) {
        super(props);
        this.elref = React.createRef();
        this.pieChart = null;
        this.option = null;
        this.state = {
            deviceStatusData: [],
        };
    }

    componentDidMount() {
        this.initChart();
        window.addEventListener('resize', this.pieChart.resize);
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.deviceStatusData !== this.state.deviceStatusData) {
            return true;
        }
        return false;
    }

    componentDidUpdate() {
        setTimeout(() => {
            this.pieChart.resize();
        }, 300);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.deviceStatusData !== prevState.deviceStatusData) {
            return { deviceStatusData: nextProps.deviceStatusData };
        }
        return null;
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.pieChart.resize);
    }

    getSnapshotBeforeUpdate(nextProps, prevState) {
        if (nextProps.deviceStatusData !== prevState.deviceStatusData) {
            return { deviceStatusData: nextProps.deviceStatusData };
        }
        this.initChart();
        return null;
    }

    initOption = () => {
        const { deviceStatusData } = this.state;
        const name = [];
        let itemStyle = {};
        let data = [];
        if (deviceStatusData && deviceStatusData.length > 0) {
            deviceStatusData.map((item) => {
                name.push(filters.getDeviceStatusData(item.status));
                item.name = filters.getDeviceStatusData(item.status);
                item.value = item.deviceNum;
            });
            itemStyle = {};
            data = deviceStatusData;
        } else {
            itemStyle = { color: '#CCCCCC' };
            data = [0];
        }
        const option = {
            backgroundColor: 'transparent',
            color: ['#6395f9', '#62daab', '#657798'],
            textStyle: {
                color: '#999999',
            },
            title: {
                show: false,
                text: `{name|已处理}\n\n{val|${4172}}`,
                top: '40%',
                left: '39%',
                textAlign: 'center',
                textStyle: {
                    rich: {
                        val: {
                            fontSize: 18,
                            color: 'rgba(0,0,0,0.85)',
                            fontWeight: 500,
                        },
                        name: {
                            fontSize: 14,
                            color: 'rgba(0,0,0,0.60)',
                            letterSpacing: 0,
                            textAlign: 'center',
                        },
                    },
                },
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
                formatter(param) {
                    return `${param.marker} ${param.name}：${param.value}  ${param.percent}%`;
                },
                padding: 10,
            },
            legend: {
                type: 'plain',
                icon: 'circle',
                top: 'center',
                right: 10,
                align: 'left',
                orient: 'vertical',
                symbolKeepAspect: false,
                itemWidth: 8,
                itemHeight: 8,
                itemGap: 10,
                data: name,
                textStyle: {
                    fontSize: 14,
                    rich: {
                        name: {
                            color: 'rgba(0, 0, 0, 0.65)',
                            fontSize: 14,
                        },
                    },
                },
            },
            series: [
                // 系列列表。每个系列通过 type 决定自己的图表类型
                {
                    data,
                    type: 'pie', // 类型
                    /**
                     * 饼图的半径。可以为如下类型：
                     * number：直接指定外半径值。
                     * string：例如，'20%'，表示外半径为可视区尺寸（容器高宽中较小一项）的 20% 长度。
                     * Array.<number|string>：数组的第一项是内半径，第二项是外半径。每一项遵从上述 number string 的描述。
                     * 可以将内半径设大显示成圆环图（Donut chart）。
                     */
                    radius: '60%',
                    /**
                     * 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。支持设置成百分比，
                     * 设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度。
                     */
                    center: ['40%', '50%'],
                    /**
                     * 当使用 dataset 时，seriesLayoutBy 指定了 dataset 中用行还是列对应到系列上，
                     * 也就是说，系列“排布”到 dataset 的行还是列上，可取值：'column'，'row'。
                     */
                    seriesLayoutBy: 'column',
                    labelLine: {
                        show: true,
                        length: 5,
                        lineStyle: {
                            // color: 各异,
                            width: 1,
                            type: 'solid',
                        },
                    },
                    emphasis: {
                        // 高亮的扇区和标签样式。
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                    label: {
                        formatter: '{d}%',
                    },
                    itemStyle,
                },
            ],
        };

        return option;
    };

    initChart = () => {
        this.pieChart = echarts.init(this.elref.current);
        this.option = this.initOption();
        this.pieChart.clear();
        this.pieChart.setOption(this.option);
    };

    refreshChart = (data) => {
        // 校验参数合法性
        const dataSource = data || {};
        const { xData, seriesData } = dataSource;
        if (!xData || xData.length <= 0 || !seriesData || seriesData.length <= 0) {
            return;
        }
        this.barChart.setOption({
            xAxis: {
                data: xData,
            },
        });
    };

    render() {
        return <div className={indexStyle.pieChartStyle} ref={this.elref}></div>;
    }
}

export default PieChart;
