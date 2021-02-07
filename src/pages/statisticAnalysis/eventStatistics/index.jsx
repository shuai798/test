import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { Table, Button, Form, Row, Col, Statistic, Divider, Radio, Card, DatePicker } from 'antd';
import { connect } from 'dva';
import Export from '@/utils/export';
import Api from '@/utils/api';
import filters from '@/filters/index';
import moment from 'moment';
import SearchForm from './components/SearchForm';
import BarChart from './components/BarChart';
import PieChart from './components/EventPieChart';
import DeviceBarChart from './components/DeviceBarChart';
import ScalePieChart from './components/ScalePieChart';
import styles from './style.less';

const { RangePicker } = DatePicker;

@connect(({ loading, eventStatisticsSpace }) => {
    return {
        eventStatisticsSpace,
        loadingSearch: loading.effects['eventStatisticsSpace/getTableListInfo'],
    };
})
@Form.create()
class TableView extends Component {
    columns = [
        {
            title: '序号',
            dataIndex: 'No',
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
            title: '故障',
            dataIndex: 'breakdown',
            align: 'center',
            children: [
                {
                    title: '新增',
                    dataIndex: 'breakdownNewNum',
                    width: 87,
                    align: 'right',
                    ellipsis: true,
                },
                {
                    title: '累计',
                    dataIndex: 'breakdownTotalNum',
                    width: 87,
                    align: 'right',
                    ellipsis: true,
                },
            ],
        },
        {
            title: '报修',
            dataIndex: 'repair',
            align: 'center',
            children: [
                {
                    title: '新增',
                    dataIndex: 'repairNewNum',
                    width: 87,
                    align: 'right',
                    ellipsis: true,
                },
                {
                    title: '累计',
                    dataIndex: 'repairTotalNum',
                    width: 87,
                    align: 'right',
                    ellipsis: true,
                },
            ],
        },
        {
            title: '待维保',
            dataIndex: 'maintained',
            align: 'center',
            children: [
                {
                    title: '新增',
                    dataIndex: 'maintainedNewNum',
                    width: 87,
                    align: 'right',
                    ellipsis: true,
                },
                {
                    title: '累计',
                    dataIndex: 'maintainedTotalNum',
                    width: 87,
                    align: 'right',
                    ellipsis: true,
                },
            ],
        },
        {
            title: '待报废',
            dataIndex: 'scrapped',
            align: 'center',
            children: [
                {
                    title: '新增',
                    dataIndex: 'scrappedNewNum',
                    width: 87,
                    align: 'right',
                    ellipsis: true,
                },
                {
                    title: '累计',
                    dataIndex: 'scrappedTotalNum',
                    width: 87,
                    align: 'right',
                    ellipsis: true,
                },
            ],
        },
        {
            title: '已过期',
            dataIndex: 'expired',
            align: 'center',
            children: [
                {
                    title: '新增',
                    dataIndex: 'expiredNewNum',
                    width: 87,
                    align: 'right',
                    ellipsis: true,
                },
                {
                    title: '累计',
                    dataIndex: 'expiredTotalNum',
                    width: 87,
                    align: 'right',
                    ellipsis: true,
                },
            ],
        },
        {
            title: '总新增',
            dataIndex: 'newNum',
            align: 'right',
            // width: 87,
            ellipsis: true,
        },
        {
            title: '总累计',
            dataIndex: 'totalNum',
            align: 'right',
            // width: 87,
            ellipsis: true,
        },
    ];

    constructor(props) {
        super(props);
        this.state = {
            searchParam: {},
            defaultRadioValue: 'project',
            activeRadioValue: 'project',
            totalNumStatisticsData: {},
            eventNumStatisticsTrendChartData: [],
            activeTime: [],
            pendingData: [], // 待处理事件数据
            processedData: [], // 已处理事件数据
        };
    }

    componentDidMount = () => {
        this.getTableViewList(0);
        this.getTotalNumStatisticsData();
        this.eventNumStatisticsTrendChartData();
        this.statisticsByType();
    };

    // 获取总体统计数据
    getTotalNumStatisticsData = () => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        // 客户数量
        dispatch({
            type: 'eventStatisticsSpace/getTotalNumStatisticsData',
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

    // 事件趋势
    eventNumStatisticsTrendChartData = () => {
        const { dispatch } = this.props;
        const { searchParam, activeTime } = this.state;
        const startDate = activeTime && activeTime.length > 0 && activeTime[0] !== '' ? activeTime[0] : moment(new Date()).subtract(30, 'days').format('YYYY-MM-DD');
        const endDate = activeTime && activeTime.length > 0 && activeTime[1] !== '' ? activeTime[1] : moment().subtract(0, 'days').format('YYYY-MM-DD');
        // 客户数量
        dispatch({
            type: 'eventStatisticsSpace/eventNumStatisticsTrendChartData',
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

    // 获取待处理已处理事件
    statisticsByType = () => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        // 待处理
        dispatch({
            type: 'eventStatisticsSpace/statisticsByType',
            payload: {
                ...searchParam,
                handled: true,
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
                ...searchParam,
                handled: false,
            },
            callback: (res) => {
                this.setState({
                    processedData: res.data,
                });
            },
        });
    };

    // 分页
    getTableViewList = (page = 0, size = 10) => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        dispatch({
            type: 'eventStatisticsSpace/getTableListInfo',
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
            },
        );
    };

    // 重置查询条件
    resetSearch = () => {
        this.props.form.resetFields();
    };

    radioChange = (e) => {
        this.setState(
            {
                activeRadioValue: e.target.value,
            },
            () => {
                this.eventNumStatisticsTrendChartData();
            },
        );
    };

    onChange = (date, dateString) => {
        this.setState({ activeTime: dateString }, () => {
            this.eventNumStatisticsTrendChartData();
        });
    };

    disabledDate = (current) => {
        return current && current > moment().endOf('day');
    };

    export = () => {
        const { searchParam } = this.state;
        const date = moment().format('YYYY-MM-DD HHmmss');
        Export.exportAsset(`事件趋势数据${date}.xlsx`, `/bioec/w/deviceEventStatistics/eventTrendDataExport${Api.bodyToParm(searchParam)}`);
    };

    render() {
        const {
            eventStatisticsSpace: { tableInfo },
        } = this.props;
        const { defaultRadioValue, activeRadioValue, totalNumStatisticsData, eventNumStatisticsTrendChartData, pendingData, processedData } = this.state;
        const cardExtra = (
            <Radio.Group defaultValue={defaultRadioValue} onChange={this.radioChange}>
                <Radio.Button value="project">新增</Radio.Button>
                <Radio.Button className="radio-total" value="device">
                    累计
                </Radio.Button>
                <div
                    style={{
                        display: 'inline-block',
                        paddingLeft: 16,
                    }}>
                    <RangePicker disabledDate={this.disabledDate} onChange={this.onChange} />
                </div>
            </Radio.Group>
        );
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
            <div className={styles['event-statistics']}>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <SearchForm handleSearch={this.handleSearch} resetSearch={this.resetSearch}></SearchForm>
                </div>
                <div className="content mt12">
                    <Row type="flex" justify="space-around">
                        <Col span={4}>
                            <Statistic style={{ textAlign: 'center' }} title="今日新增事件数" value={totalNumStatisticsData && totalNumStatisticsData.todayEventNum ? totalNumStatisticsData.todayEventNum : 0}></Statistic>
                        </Col>
                        <Divider type="vertical" style={{ height: 80 }}></Divider>
                        <Col span={4}>
                            <Statistic style={{ textAlign: 'center' }} title="昨日处理事件数" value={totalNumStatisticsData && totalNumStatisticsData.yesterdayHandledEventNum ? totalNumStatisticsData.yesterdayHandledEventNum : 0}></Statistic>
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
                                <span className="table-title">待处理事件</span>
                            </div>
                            <div className="border mb12"></div>
                            <div className={styles.troubleType}>
                                <div className={styles.echartsSize}>
                                    <PieChart pendingData={pendingData}></PieChart>
                                </div>
                                <div className={styles['troubleType-right']}>
                                    <div className={styles['troubleType-right-top']}>
                                        <div className={styles['troubleType-right-head']}>类型</div>
                                        <div className={styles['troubleType-right-head-right']}>数量</div>
                                    </div>
                                    {(pendingData || []).map((item) => {
                                        return (
                                            <div key={item.type} className={styles['troubleType-right-content']}>
                                                <div className={styles['troubleType-right-content-left']}>{filters.eventTypeSingleFilter(item.type)}</div>
                                                <div className={styles['troubleType-right-content-right']}>{item.deviceEventNum}</div>
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
                                <span className="table-title">已处理事件</span>
                            </div>
                            <div className="border mb12"></div>
                            <div className={styles.troubleType}>
                                <div className={styles.echartsSize}>
                                    <ScalePieChart processedData={processedData}></ScalePieChart>
                                </div>
                                <div className={styles['troubleType-right']}>
                                    <div className={styles['troubleType-right-top']}>
                                        <div className={styles['troubleType-right-head']}>类型</div>
                                        <div className={styles['troubleType-right-head-right']}>数量</div>
                                    </div>
                                    {(processedData || []).map((item) => {
                                        return (
                                            <div key={item.type} className={styles['troubleType-right-content']}>
                                                <div className={styles['troubleType-right-content-left']}>{filters.eventTypeSingleFilter(item.type)}</div>
                                                <div className={styles['troubleType-right-content-right']}>{item.deviceEventNum}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.projectDevice}>
                    <Card className="mt12" title="事件趋势" extra={cardExtra}>
                        <div className={styles.echartsSize}>{activeRadioValue === 'project' ? <BarChart eventNumStatisticsTrendChartData={eventNumStatisticsTrendChartData}></BarChart> : <DeviceBarChart eventNumStatisticsTrendChartData={eventNumStatisticsTrendChartData}></DeviceBarChart>}</div>
                    </Card>
                </div>
                <div className="content mt12">
                    <div className="mb12 clearfix">
                        <span className="table-title">事件趋势数据</span>
                        <div className="fr">
                            <Button onClick={this.export}>
                                <span className="iconfont icon-export mr8 fz14"></span>导出
                            </Button>
                        </div>
                    </div>
                    <Table
                        rowKey={(record) => {
                            return record.date;
                        }}
                        loading={this.props.loadingSearch}
                        scroll={{ x: 1200 }}
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
