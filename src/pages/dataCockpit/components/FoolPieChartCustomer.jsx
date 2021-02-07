import React, { Component } from 'react';
// 按需导入
import 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import ReactEcharts from 'echarts-for-react';
import styles from '../index.less';
import { connect } from 'dva';
import filters from '@/filters';

@connect(({ customerStatisticSpace }) => {
    return {
        customerStatisticSpace,
    };
})
class FoolPieChartCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerScale: [], // 客户规模
        };
    }

    componentDidMount() {
        this.getStaffSizeDistributionList();
    }

    // 获取客户规模
    getStaffSizeDistributionList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'customerStatisticSpace/getStaffSizeDistributionList',
            payload: {
                hasDataAuth: false,
            },
            callback: (res) => {
                this.setState({
                    customerScale: res.data,
                });
            },
        });
    };

    getOption = () => {
        const { customerScale } = this.state;
        const staffSize = [];
        (customerScale || []).map((item) => {
            staffSize.push(filters.getCustomerScale(item.staffSize));
            item.name = filters.getCustomerScale(item.staffSize);
            item.value = item.customerNum;
        });
        const colorList = ['#A2E3FF', '#0070FF', '#00DEEF', '#60C9FE', '#B793FF', '#E2D080'];
        const datasource = customerScale.sort((a, b) => {
            return b.value - a.value;
        });
        const legendOption = {
            textStyle: {
                fontSize: 14,
                rich: {
                    name: {
                        color: '#5392CB',
                        fontSize: 14,
                        width: 90,
                    },
                },
            },
            formatter(name) {
                // datasource.filter((v) => {
                //     return v.name === name;
                // });
                return `{name| ${name}}`;
            },
        };
        const option = {
            color: '#0070FF',
            legend: [
                {
                    type: 'plain',
                    icon: 'circle',
                    bottom: '0',
                    left: 10,
                    align: 'left',
                    orient: 'horizontal',
                    symbolKeepAspect: false,
                    itemWidth: 8,
                    itemHeight: 8,
                    itemGap: 5,
                    data: staffSize,
                    ...legendOption,
                },
                // {
                //     type: 'plain',
                //     icon: 'circle',
                //     bottom: '0',
                //     left: 10,
                //     align: 'left',
                //     orient: 'vertical',
                //     symbolKeepAspect: false,
                //     itemWidth: 8,
                //     itemHeight: 8,
                //     itemGap: 5,
                //     data: ['1~20人', '100~499人', '1000~9999人'],
                //     ...legendOption,
                // },
                // {
                //     type: 'plain',
                //     icon: 'circle',
                //     bottom: '0',
                //     left: 125,
                //     align: 'left',
                //     orient: 'vertical',
                //     symbolKeepAspect: false,
                //     itemWidth: 8,
                //     itemHeight: 8,
                //     itemGap: 5,
                //     data: ['20~99人', '500~999人', '10000人以上'],
                //     ...legendOption,
                // },
            ],
            series: [
                {
                    name: [datasource],
                    type: 'pie',
                    radius: '60%',
                    center: ['45%', '38%'],
                    clockwise: true,
                    avoidLabelOverlap: true,
                    label: {
                        show: true,
                        color: '#fff',
                        // position: 'inside',
                        formatter(params) {
                            return params.value;
                        },
                    },
                    labelLine: {
                        show: true,
                        length: -5,
                        lineStyle: {
                            /*color: '#ffffff85',*/
                            width: 1,
                            type: 'solid',
                        },
                    },
                    itemStyle: {
                        normal: {
                            color(params) {
                                return colorList[params.dataIndex];
                            },
                        },
                    },
                    data: datasource,
                    roseType: 'radius',
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

export default FoolPieChartCustomer;
