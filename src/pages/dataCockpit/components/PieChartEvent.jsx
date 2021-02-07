import React, { Component } from 'react';
// 按需导入
import 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import ReactEcharts from 'echarts-for-react';
import styles from '../index.less';
import { connect } from 'dva';
import filters from '@/filters';

@connect(({ eventStatisticsSpace }) => {
    return {
        eventStatisticsSpace,
    };
})
class PieChartEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pendingData: [], // 待处理事件数据
            processedData: [], // 已处理事件数据
        };
    }

    componentDidMount() {
        this.statisticsByType();
        setInterval(() => {
            this.statisticsByType();
        }, 600000);
    }

    // 获取待处理已处理事件
    statisticsByType = () => {
        const { dispatch } = this.props;
        // 待处理
        dispatch({
            type: 'eventStatisticsSpace/statisticsByType',
            payload: {
                handled: true,
                hasDataAuth: false,
            },
            callback: (res) => {
                this.setState({
                    pendingData: res.data,
                });
            },
        });
        // 已处理
        dispatch({
            type: 'eventStatisticsSpace/statisticsByType',
            payload: {
                handled: false,
                hasDataAuth: false,
            },
            callback: (res) => {
                this.setState({
                    processedData: res.data,
                });
            },
        });
    };

    getOption = () => {
        const { pendingData, processedData } = this.state;
        const name = [];
        let pendingTotal = 0;
        let processedTotal = 0;
        (pendingData || []).map((item) => {
            name.push(filters.eventTypeSingleFilter(item.type));
            item.name = filters.eventTypeSingleFilter(item.type);
            item.value = item.deviceEventNum;
            pendingTotal += item.deviceEventNum;
        });
        (processedData || []).map((item) => {
            // name.push(filters.eventTypeSingleFilter(item.type));
            item.name = filters.eventTypeSingleFilter(item.type);
            item.value = item.deviceEventNum;
            processedTotal += item.deviceEventNum;
        });
        const colorList = ['#FF6D6D', '#B793FF', '#00BCFF', '#E2D080', '#A2E3FF'];
        const subTitle = '待处理';
        const title = '已处理';
        const option = {
            title: [
                {
                    show: true,
                    text: `{val|${pendingTotal}}\n{name|${subTitle}}`,
                    top: '38%',
                    left: '21%',
                    textAlign: 'center',
                    textStyle: {
                        rich: {
                            val: {
                                fontSize: 16,
                                lineHeight: 22,
                                color: '#FFFFFF',
                                fontWeight: 500,
                            },
                            name: {
                                fontSize: 12,
                                lineHeight: 17,
                                color: '#5392CB',
                            },
                        },
                    },
                },
                {
                    show: true,
                    text: `{val|${processedTotal}}\n{name|${title}}`,
                    top: '38%',
                    left: '62%',
                    textAlign: 'center',
                    textStyle: {
                        rich: {
                            val: {
                                fontSize: 16,
                                lineHeight: 22,
                                color: '#FFFFFF',
                                fontWeight: 500,
                            },
                            name: {
                                fontSize: 12,
                                lineHeight: 17,
                                color: '#5392CB',
                            },
                        },
                    },
                },
            ],
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
                formatter: '{b}<br /><span style="margin-left:15px;margin-bottom:8px;">{a0}：</span>{c0}<br /><span style="margin-left:15px;">{a1}：</span>{c1}<br /><span style="">{a2}：</span>{c2}<br />',
            },
            legend: {
                show: true,
                icon: 'circle',
                orient: 'vertical',
                right: 15,
                top: 'center',
                align: 'left',
                itemWidth: 8,
                itemHeight: 8,
                itemGap: 2,
                textStyle: {
                    fontSize: 14,
                    lineHeight: 20,
                    color: '#5392CB',
                },
                data: name,
            },
            series: [
                {
                    type: 'pie',
                    center: ['22%', '53%'],
                    radius: ['40%', '60%'],
                    selectedMode: 'single',
                    clockwise: true,
                    avoidLabelOverlap: true,
                    hoverOffset: 5,
                    itemStyle: {
                        normal: {
                            color(params) {
                                return colorList[params.dataIndex];
                            },
                        },
                    },
                    label: {
                        show: false,
                        position: 'outside',
                        max: 100,
                        formatter: '{d}%',
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: 14,
                        lineHeight: 20,
                        rich: {
                            icon: {
                                fontSize: 16,
                            },
                            name: {
                                fontSize: 14,
                                padding: [0, 10, 0, 4],
                                color: 'rgba(255,255,255,0.85)',
                            },
                            value: {
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: 'rgba(255,255,255,0.85)',
                            },
                        },
                    },
                    labelLine: {
                        show: false,
                        normal: {
                            length: 5,
                            length2: 5,
                            lineStyle: {
                                width: 1,
                                type: 'solid',
                            },
                        },
                    },
                    data: pendingData,
                },
                {
                    type: 'pie',
                    center: ['63%', '53%'],
                    radius: ['40%', '60%'],
                    selectedMode: 'single',
                    clockwise: true,
                    avoidLabelOverlap: true,
                    hoverOffset: 5,
                    itemStyle: {
                        normal: {
                            color(params) {
                                return colorList[params.dataIndex];
                            },
                        },
                    },
                    label: {
                        show: false,
                        position: 'outside',
                        formatter: '{d}%',
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: 14,
                        lineHeight: 20,
                        rich: {
                            icon: {
                                fontSize: 16,
                            },
                            name: {
                                fontSize: 14,
                                padding: [0, 10, 0, 4],
                                color: 'rgba(255,255,255,0.85)',
                            },
                            value: {
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: 'rgba(255,255,255,0.85)',
                            },
                        },
                    },
                    labelLine: {
                        show: false,
                        normal: {
                            length: 5,
                            length2: 5,
                            lineStyle: {
                                width: 1,
                                type: 'solid',
                            },
                        },
                    },
                    data: processedData,
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

export default PieChartEvent;
