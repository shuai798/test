import React, { Component } from 'react';
// 按需导入
import 'echarts/lib/echarts';
// 导入柱形图
// import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/title';
// import 'echarts/lib/component/legend';
// import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
import styles from '../index.less';
import filters from '@/filters';

class PieChartDevice extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getOption = (deviceStatusData) => {
        const name = [];
        (deviceStatusData || []).map((item) => {
            name.push(filters.getDeviceStatusData(item.status));
            item.name = filters.getDeviceStatusData(item.status);
            item.value = item.deviceNum;
        });
        const colorList = ['#0070FF', '#E2D080', '#B793FF'];
        const option = {
            tooltip: {
                show: false,
                extraCssText: 'box-shadow: 0px 4px 10px 0px rgba(0,55,103,0.2);',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderColor: 'rgba(0, 55, 103, 0.2)',
                textStyle: {
                    color: 'rgba(0, 0, 0, 0.85)',
                },
                padding: 10,
            },
            legend: {
                icon: 'circle',
                orient: 'vertical',
                itemWidth: 8,
                itemHeight: 8,
                align: 'left',
                x: 'right',
                y: 'center',
                itemGap: 6,
                // right: 10,
                // top: 20,
                // bottom: 20,
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
                    center: ['38%', '55%'],
                    radius: ['45%', '70%'],
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
                        color: '#fff',
                        fontSize: 14,
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
                            length2: 2,
                            lineStyle: {
                                width: 1,
                                type: 'solid',
                            },
                        },
                    },
                    data: deviceStatusData,
                },
            ],
        };
        return option;
    };

    render() {
        const { deviceStatusData } = this.props;
        return (
            <div className={styles.flowTrendBox}>
                <ReactEcharts
                    option={this.getOption(deviceStatusData)}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}></ReactEcharts>
            </div>
        );
    }
}

export default PieChartDevice;
