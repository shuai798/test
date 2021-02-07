import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { Table, Button, Form, Row, Col, Statistic, Divider, Icon, DatePicker } from 'antd';
import { connect } from 'dva';
import Export from '@/utils/export';
import Api from '@/utils/api';
import moment from 'moment';
import SearchForm from './components/SearchForm';
import PieChart from './components/EventPieChart';
import ScalePieChart from './components/ScalePieChart';
import LineChart from './components/LineChart';
import styles from './style.less';

const { RangePicker } = DatePicker;

@connect(({ loading, statisticsBreakdownSpace }) => {
    return {
        statisticsBreakdownSpace,
        loadingSearch: loading.effects['statisticsBreakdownSpace/getTableListInfo'],
    };
})
@Form.create()
class TableView extends Component {
    columns = [
        {
            title: '序号',
            dataIndex: 'index',
            width: 68,
            align: 'center',
            render: (text, record, index) => {
                return <span>{index + 1}</span>;
            },
            fixed: 'left',
        },
        {
            title: '日期',
            dataIndex: 'date',
            align: 'center',
            width: 125,
            ellipsis: true,
        },
        {
            title: '通行次数',
            dataIndex: 'passNum',
            align: 'right',
            ellipsis: true,
        },
        {
            title: '故障数量',
            dataIndex: 'breakdownNum',
            align: 'right',
            ellipsis: true,
        },
    ];

    constructor(props) {
        super(props);
        this.state = {
            searchParam: {},
            totalNumStatisticsData: {},
            activeTime: [],
            eventNumStatisticsTrendChartData: [],
            troubleType: [], // 故障类型
            troubleModel: [], // 故障型号
        };
    }

    componentDidMount = () => {
        this.getTableViewList(0);
        this.getTotalNumStatisticsData();
        this.eventNumStatisticsTrendChartData();
        this.statisticsByType();
        this.statisticsBySeries();
    };

    // 获取总体统计数据
    getTotalNumStatisticsData = () => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        // 客户数量
        dispatch({
            type: 'statisticsBreakdownSpace/getTotalNumStatisticsData',
            payload: {
                ...searchParam,
            },
            callback: (res) => {
                this.setState({
                    totalNumStatisticsData: res.data,
                });
            },
        });
    };

    // 通行趋势
    eventNumStatisticsTrendChartData = () => {
        const { dispatch } = this.props;
        const { searchParam, activeTime } = this.state;
        const startDate = activeTime && activeTime.length > 0 && activeTime[0] !== '' ? activeTime[0] : moment(new Date()).subtract(30, 'days').format('YYYY-MM-DD');
        const endDate = activeTime && activeTime.length > 0 && activeTime[1] !== '' ? activeTime[1] : moment().subtract(0, 'days').format('YYYY-MM-DD');
        // 客户数量
        dispatch({
            type: 'statisticsBreakdownSpace/eventNumStatisticsTrendChartData',
            payload: {
                ...searchParam,
                startDate,
                endDate,
            },
            callback: (res) => {
                this.setState({
                    eventNumStatisticsTrendChartData: res.data,
                });
            },
        });
    };

    // 故障类型
    statisticsByType = () => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        dispatch({
            type: 'statisticsBreakdownSpace/statisticsByType',
            payload: {
                ...searchParam,
                limit: 5,
            },
            callback: (res) => {
                this.setState({
                    troubleType: res.data,
                });
            },
        });
    };

    // 故障型号
    statisticsBySeries = () => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        dispatch({
            type: 'statisticsBreakdownSpace/statisticsBySeries',
            payload: {
                ...searchParam,
                limit: 5,
            },
            callback: (res) => {
                this.setState({
                    troubleModel: res.data,
                });
            },
        });
    };

    // 分页
    getTableViewList = (page = 0, size = 10) => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        dispatch({
            type: 'statisticsBreakdownSpace/getTableListInfo',
            payload: {
                page,
                size,
                ...searchParam,
            },
        });
    };

    // 点击下一页 或者切换某页，选择每页条数
    tableChange = (pagination) => {
        return this.getTableViewList(pagination.current - 1, pagination.pageSize);
    };

    // 查询数据
    handleSearch = (value) => {
        this.setState(
            {
                searchParam: value,
            },
            () => {
                this.getTableViewList(0);
                this.getTotalNumStatisticsData();
                this.eventNumStatisticsTrendChartData();
                this.statisticsByType();
                this.statisticsBySeries();
            },
        );
    };

    // 重置查询条件
    resetSearch = () => {
        this.props.form.resetFields();
    };

    export = () => {
        const { searchParam } = this.state;
        const date = moment().format('YYYY-MM-DD HHmmss');
        Export.exportAsset(`通行趋势数据${date}.xlsx`, `/bioec/w/statisticsBreakdown/export${Api.bodyToParm(searchParam)}`);
    };

    // 故障类型
    showFaultType = () => {
        this.props.history.push('/statisticAnalysis/trafficBehaviorStatistics/troubleType');
    };

    // 故障型号
    showFaultTypeNum = () => {
        this.props.history.push('/statisticAnalysis/trafficBehaviorStatistics/faultTypeNum');
    };

    onChange = (date, dateString) => {
        this.setState({ activeTime: dateString }, () => {
            this.eventNumStatisticsTrendChartData();
        });
    };

    disabledDate = (current) => {
        return current && current > moment().endOf('day');
    }

    render() {
        const {
            // form: { getFieldDecorator },
            statisticsBreakdownSpace: { tableInfo },
        } = this.props;
        const { totalNumStatisticsData, eventNumStatisticsTrendChartData, troubleType, troubleModel } = this.state;
        const { data = [], pageable = {} } = tableInfo;
        const pagination = {
            showTotal: () => {
                return (
                    <span className="pagination">
                        共<a>{pageable.totalPages}</a>页/<a>{pageable.totalElements}</a>条数据
                    </span>
                );
            },
            total: pageable.totalElements,
            pageSize: pageable.size,
            current: parseInt(pageable.number + 1, 10) || 1,
            showSizeChanger: true,
        };
        return (
            <div className={styles['traffic-behavior-statistics']}>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <SearchForm handleSearch={this.handleSearch} resetSearch={this.resetSearch}></SearchForm>
                </div>
                <div className="content mt12">
                    <Row type="flex" justify="space-around">
                        <Col span={4}>
                            <Statistic style={{ textAlign: 'center' }} title="总通行次数" value={totalNumStatisticsData && totalNumStatisticsData.passNum ? totalNumStatisticsData.passNum : 0}></Statistic>
                        </Col>
                        <Divider type="vertical" style={{ height: 80 }}></Divider>
                        <Col span={4}>
                            <Statistic style={{ textAlign: 'center' }} title="总故障数量" value={totalNumStatisticsData && totalNumStatisticsData.breakdownNum ? totalNumStatisticsData.breakdownNum : 0}></Statistic>
                        </Col>
                        <Divider type="vertical" style={{ height: 80 }}></Divider>
                        <Col span={4}>
                            <Statistic style={{ textAlign: 'center' }} title="客户数量" value={totalNumStatisticsData && totalNumStatisticsData.customerNum ? totalNumStatisticsData.customerNum : 0}></Statistic>
                        </Col>
                        <Divider type="vertical" style={{ height: 80 }}></Divider>
                        <Col span={4}>
                            <Statistic style={{ textAlign: 'center' }} title="项目数量" value={totalNumStatisticsData && totalNumStatisticsData.projectNum ? totalNumStatisticsData.projectNum : 0}></Statistic>
                        </Col>
                        <Divider type="vertical" style={{ height: 80 }}></Divider>
                        <Col span={4}>
                            <Statistic style={{ textAlign: 'center' }} title="接入设备数" value={totalNumStatisticsData && totalNumStatisticsData.deviceNum ? totalNumStatisticsData.deviceNum : 0}></Statistic>
                        </Col>
                    </Row>
                </div>
                <div
                    style={{
                        display: 'flex',
                    }}>
                    <div className={styles.customer} style={{ marginRight: 12 }}>
                        <div className="content mt12">
                            <div className="mb12 clearfix">
                                <span className="table-title">故障类型</span>
                                <div className="dib fr lh32">
                                    <a onClick={this.showFaultType}>
                                        更多 <Icon type="right"></Icon>
                                    </a>
                                </div>
                            </div>
                            <div className="border mb12"></div>
                            <div className={styles.troubleType}>
                                <div className={styles.echartsSize}>
                                    <PieChart troubleType={troubleType}></PieChart>
                                </div>
                                <div className={styles['troubleType-right']}>
                                    <div className={styles['troubleType-right-top']}>
                                        <div className={styles['troubleType-right-head']}>类型</div>
                                        <div className={styles['troubleType-right-head-right']}>数量</div>
                                    </div>
                                    {troubleType &&
                                        troubleType.length > 0 &&
                                        troubleType.map((item) => {
                                            return (
                                                <div key={item.type} className={styles['troubleType-right-content']}>
                                                    <div className={styles['troubleType-right-content-left']}>{item.typeName}</div>
                                                    <div className={styles['troubleType-right-content-right']}>{item.num}</div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.customer}>
                        <div className="content mt12">
                            <div className="mb12 clearfix">
                                <span className="table-title">故障型号</span>
                                <div className="dib fr lh32">
                                    <a onClick={this.showFaultTypeNum}>
                                        更多 <Icon type="right"></Icon>
                                    </a>
                                </div>
                            </div>
                            <div className="border mb12"></div>
                            <div className={styles.troubleType}>
                                <div className={styles.echartsSize}>
                                    <ScalePieChart troubleModel={troubleModel}></ScalePieChart>
                                </div>
                                <div className={styles['troubleType-right']}>
                                    <div className={styles['troubleType-right-top']}>
                                        <div className={styles['troubleType-right-head']}>类型</div>
                                        <div className={styles['troubleType-right-head-right']}>数量</div>
                                    </div>
                                    {(troubleModel || []).map((item) => {
                                        return (
                                            <div key={item.seriesName} className={styles['troubleType-right-content']}>
                                                <div className={styles['troubleType-right-content-left']}>{item.seriesName}</div>
                                                <div className={styles['troubleType-right-content-right']}>{item.num}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content mt12">
                    <div className="mb12 clearfix">
                        <span className="table-title">通行趋势</span>
                        <div className="fr dib">
                            <RangePicker disabledDate={this.disabledDate} onChange={this.onChange} />
                        </div>
                    </div>
                    <div className="border"></div>
                    <div className={styles.echartsSize}>
                        <LineChart eventNumStatisticsTrendChartData={eventNumStatisticsTrendChartData}></LineChart>
                    </div>
                </div>
                <div className="content mt12">
                    <div className="mb12 clearfix">
                        <span className="table-title">通行趋势数据</span>
                        <div className="fr">
                            <Button onClick={this.export}>
                                <span className="iconfont icon-export mr8 fz14"></span>导出
                            </Button>
                        </div>
                    </div>
                    <Table
                        rowKey="id"
                        loading={this.props.loadingSearch}
                        scroll={{ x: 1100 }}
                        columns={this.columns}
                        dataSource={data}
                        pagination={pagination}
                        onChange={this.tableChange}></Table>
                </div>
            </div>
        );
    }
}

export default TableView;
