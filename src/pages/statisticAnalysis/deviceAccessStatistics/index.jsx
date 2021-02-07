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

@connect(({ loading, deviceAccessStatisticSpace }) => {
    return {
        deviceAccessStatisticSpace,
        loadingSearch: loading.effects['deviceAccessStatisticSpace/getTableListInfo'],
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
            title: '翼闸',
            dataIndex: 'wingGate',
            align: 'center',
            children: [
                {
                    title: '新增',
                    dataIndex: 'wingGateNewNum',
                    width: 87,
                    align: 'right',
                    ellipsis: true,
                },
                {
                    title: '累计',
                    dataIndex: 'wingGateTotalNum',
                    width: 87,
                    align: 'right',
                    ellipsis: true,
                },
            ],
        },
        {
            title: '摆闸',
            dataIndex: 'swingGate',
            align: 'center',
            children: [
                {
                    title: '新增',
                    dataIndex: 'swingGateNewNum',
                    width: 87,
                    align: 'right',
                    ellipsis: true,
                },
                {
                    title: '累计',
                    dataIndex: 'swingGateTotalNum',
                    width: 87,
                    align: 'right',
                    ellipsis: true,
                },
            ],
        },
        {
            title: '三辊闸',
            dataIndex: 'tripodTurnstile',
            align: 'center',
            children: [
                {
                    title: '新增',
                    dataIndex: 'tripodTurnstileNewNum',
                    width: 87,
                    align: 'right',
                    ellipsis: true,
                },
                {
                    title: '累计',
                    dataIndex: 'tripodTurnstileTotalNum',
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
            // width: 86,
            ellipsis: true,
        },
        {
            title: '总累计',
            dataIndex: 'totalNum',
            align: 'right',
            // width: 86,
            ellipsis: true,
        },
    ];

    constructor(props) {
        super(props);
        this.state = {
            searchParam: {},
            defaultRadioValue: 'project',
            activeRadioValue: 'project',
            deviceStatisticsTotalData: {},
            deviceTypeData: [], // 设备类型数据
            deviceStatusData: [], // 设备状态数据
            accessTrendChartData: [], // 设备接入趋势数据
            activeTime: [],
        };
    }

    componentDidMount = () => {
        this.getTableViewList(0);
        this.getDeviceData();
        this.customerIndustryTop5();
        this.deviceStatusData();
        this.accessTrendChartData();
    };

    // 分页
    getTableViewList = (page = 0, size = 10) => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        dispatch({
            type: 'deviceAccessStatisticSpace/getTableListInfo',
            payload: {
                page,
                size,
                ...searchParam,
            },
        });
    };

    // 获取总体统计数据
    getDeviceData = () => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        // 客户数量
        dispatch({
            type: 'deviceAccessStatisticSpace/deviceStatisticsTotalData',
            payload: {
                ...searchParam,
            },
            callback: (res) => {
                this.setState({
                    deviceStatisticsTotalData: res.data,
                });
            },
        });
    };

    // 获取设备类型
    customerIndustryTop5 = () => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        // 客户数量
        dispatch({
            type: 'deviceAccessStatisticSpace/customerIndustryTop5',
            payload: {
                ...searchParam,
            },
            callback: (res) => {
                this.setState({
                    deviceTypeData: res.data,
                });
            },
        });
    };

    // 获取设备状态
    deviceStatusData = () => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        // 客户数量
        dispatch({
            type: 'deviceAccessStatisticSpace/deviceStatusData',
            payload: {
                ...searchParam,
            },
            callback: (res) => {
                this.setState({
                    deviceStatusData: res.data,
                });
            },
        });
    };

    // 获取设备接入趋势
    accessTrendChartData = () => {
        const { dispatch } = this.props;
        const { searchParam, activeTime } = this.state;
        const startDate = activeTime && activeTime.length > 0 && activeTime[0] !== '' ? activeTime[0] : moment(new Date()).subtract(30, 'days').format('YYYY-MM-DD');
        const endDate = activeTime && activeTime.length > 0 && activeTime[1] !== '' ? activeTime[1] : moment().subtract(0, 'days').format('YYYY-MM-DD');
        // 客户数量
        dispatch({
            type: 'deviceAccessStatisticSpace/accessTrendChartData',
            payload: {
                ...searchParam,
                startDate,
                endDate,
            },
            callback: (res) => {
                this.setState({
                    accessTrendChartData: res.data,
                });
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
                this.getDeviceData();
                this.customerIndustryTop5();
                this.deviceStatusData();
                this.accessTrendChartData();
            },
        );
    };

    // 重置查询条件
    resetSearch = () => {
        this.props.form.resetFields();
    };

    radioChange = (e) => {
        this.setState({
            activeRadioValue: e.target.value,
        });
    };

    onChange = (date, dateString) => {
        this.setState({ activeTime: dateString }, () => {
            this.accessTrendChartData();
        });
    };

    disabledDate = (current) => {
        return current && current > moment().endOf('day');
    };

    export = () => {
        const { searchParam } = this.state;
        const date = moment().format('YYYY-MM-DD HHmmss');
        Export.exportAsset(`接入趋势数据${date}.xlsx`, `/bioec/w/deviceStatistics/accessTrendDataExport${Api.bodyToParm(searchParam)}`);
    };

    render() {
        const {
            // form: { getFieldDecorator },
            deviceAccessStatisticSpace: { tableInfo },
        } = this.props;
        const { defaultRadioValue, activeRadioValue, deviceStatisticsTotalData, deviceTypeData, deviceStatusData, accessTrendChartData } = this.state;
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
            <div className={styles['device-access-statistics']}>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <SearchForm handleSearch={this.handleSearch} resetSearch={this.resetSearch}></SearchForm>
                </div>
                <div className="content mt12">
                    <Row type="flex" justify="space-around">
                        <Col span={4}>
                            <Statistic style={{ textAlign: 'center' }} title="总通行次数" value={deviceStatisticsTotalData && deviceStatisticsTotalData.passNum ? deviceStatisticsTotalData.passNum : 0}></Statistic>
                        </Col>
                        <Divider type="vertical" style={{ height: 80 }}></Divider>
                        <Col span={4}>
                            <Statistic style={{ textAlign: 'center' }} title="总运行时长（小时）" value={deviceStatisticsTotalData && deviceStatisticsTotalData.runningTimeNum ? deviceStatisticsTotalData.runningTimeNum : 0}></Statistic>
                        </Col>
                        <Divider type="vertical" style={{ height: 80 }}></Divider>
                        <Col span={4}>
                            <Statistic style={{ textAlign: 'center' }} title="客户数量" value={deviceStatisticsTotalData && deviceStatisticsTotalData.customerNum ? deviceStatisticsTotalData.customerNum : 0}></Statistic>
                        </Col>
                        <Divider type="vertical" style={{ height: 80 }}></Divider>
                        <Col span={4}>
                            <Statistic style={{ textAlign: 'center' }} title="项目数量" value={deviceStatisticsTotalData && deviceStatisticsTotalData.projectNum ? deviceStatisticsTotalData.projectNum : 0}></Statistic>
                        </Col>
                        <Divider type="vertical" style={{ height: 80 }}></Divider>
                        <Col span={4}>
                            <Statistic style={{ textAlign: 'center' }} title="接入设备数" value={deviceStatisticsTotalData && deviceStatisticsTotalData.deviceNum ? deviceStatisticsTotalData.deviceNum : 0}></Statistic>
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
                                <span className="table-title">设备类型</span>
                            </div>
                            <div className="border mb12"></div>
                            <div className={styles.troubleType}>
                                <div className={styles.echartsSize}>
                                    <PieChart deviceTypeData={deviceTypeData}></PieChart>
                                </div>
                                <div className={styles['troubleType-right']}>
                                    <div className={styles['troubleType-right-top']}>
                                        <div className={styles['troubleType-right-head']}>类型</div>
                                        <div className={styles['troubleType-right-head-right']}>数量</div>
                                    </div>
                                    {(deviceTypeData || []).map((item) => {
                                        return (
                                            <div key={item.name} className={styles['troubleType-right-content']}>
                                                <div className={styles['troubleType-right-content-left']}>{item.name}</div>
                                                <div className={styles['troubleType-right-content-right']}>{item.deviceNum}</div>
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
                                <span className="table-title">设备状态</span>
                            </div>
                            <div className="border mb12"></div>
                            <div className={styles.troubleType}>
                                <div className={styles.echartsSize}>
                                    <ScalePieChart deviceStatusData={deviceStatusData}></ScalePieChart>
                                </div>
                                <div className={styles['troubleType-right']}>
                                    <div className={styles['troubleType-right-top']}>
                                        <div className={styles['troubleType-right-head']}>状态</div>
                                        <div className={styles['troubleType-right-head-right']}>数量</div>
                                    </div>
                                    {(deviceStatusData || []).map((item) => {
                                        return (
                                            <div key={item.status} className={styles['troubleType-right-content']}>
                                                <div className={styles['troubleType-right-content-left']}>{filters.getDeviceStatusData(item.status)}</div>
                                                <div className={styles['troubleType-right-content-right']}>{item.deviceNum}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.projectDevice}>
                    <Card className="mt12" title="设备接入趋势" extra={cardExtra}>
                        <div className={styles.echartsSize}>{activeRadioValue === 'project' ? <BarChart accessTrendChartData={accessTrendChartData}></BarChart> : <DeviceBarChart accessTrendChartData={accessTrendChartData}></DeviceBarChart>}</div>
                    </Card>
                </div>
                <div className="content mt12">
                    <div className="mb12 clearfix">
                        <span className="table-title">接入趋势数据</span>
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
                        bordered
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
