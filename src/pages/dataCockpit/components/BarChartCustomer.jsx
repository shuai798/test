import React, { Component } from 'react';
// 按需导入
import 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import ReactEcharts from 'echarts-for-react';
import Echarts from 'echarts';
import styles from '../index.less';
import { connect } from 'dva';

@connect(({ customerStatisticSpace }) => {
    return {
        customerStatisticSpace,
    };
})
class BarChartCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemNumberData: [], // 项目数量分布数据
        };
    }

    componentDidMount() {
        this.getProjectCountAndAccessDeviceCountByProvince();
    }

    // 获取项目数量分布
    getProjectCountAndAccessDeviceCountByProvince = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'customerStatisticSpace/getProjectCountAndAccessDeviceCountByProvince',
            payload: {
                tag: 'project',
                hasDataAuth: false,
            },
            callback: (res) => {
                this.setState({
                    itemNumberData: res.data,
                });
            },
        });
    };

    getOption = () => {
        const { itemNumberData } = this.state;
        const areaName = [];
        const projectNum = [];
        (itemNumberData || []).map((item) => {
            areaName.push(item.areaName);
            projectNum.push(item.projectNum);
        });
        const option = {
            grid: {
                left: 10,
                right: 10,
                bottom: -5,
                top: 10,
                containLabel: true,
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
                        show: false,
                    },
                    data: areaName,
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
                    data: projectNum,
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
                                    color: 'rgba(89,160,251,0.00)',
                                },
                                {
                                    offset: 1,
                                    color: '#59A0FB',
                                },
                            ]),
                        },
                    },
                    barWidth: 7,
                    data: projectNum,
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

export default BarChartCustomer;
