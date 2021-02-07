import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { Table, Button, Form, Row, Col, Statistic, Divider, Radio, Card, Icon } from 'antd';
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

@connect(({ loading, customerStatisticSpace }) => {
    return {
        customerStatisticSpace,
        loadingSearch: loading.effects['customerStatisticSpace/getTableListInfo'],
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
            title: '地理位置',
            dataIndex: 'areaName',
            align: 'left',
            ellipsis: true,
        },
        {
            title: '项目数量',
            dataIndex: 'projectNum',
            align: 'right',
            ellipsis: true,
        },
        {
            title: '设备数量',
            dataIndex: 'accessDeviceNum',
            align: 'right',
            ellipsis: true,
        },
    ];

    constructor(props) {
        super(props);
        this.state = {
            searchParam: {},
            defaultRadioValue: 'project',
            activeRadioValue: 'project',
            countData: {}, // 客户数量、项目数量、销售设备数
            industryData: [], // 获取行业分布占比前五
            itemNumberData: [], // 项目数量分布数据
            customerScale: [], // 客户规模
        };
    }

    componentDidMount = () => {
        this.getTableViewList(0);
        this.getCountInfo();
        this.getIndustryDistributionOverview();
        this.getProjectCountAndAccessDeviceCountByProvince();
        this.getStaffSizeDistributionList();
    };

    // 获取客户数量、项目数量、销售设备数
    getCountInfo = () => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        dispatch({
            type: 'customerStatisticSpace/getCountInfo',
            payload: {
                ...searchParam,
            },
            callback: (res) => {
                this.setState({
                    countData: res.data,
                });
            },
        });
    };

    // 获取行业分布占比前五
    getIndustryDistributionOverview = () => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        dispatch({
            type: 'customerStatisticSpace/getIndustryDistributionOverview',
            payload: {
                ...searchParam,
            },
            callback: (res) => {
                this.setState({
                    industryData: res.data,
                });
            },
        });
    };

    // 获取客户规模
    getStaffSizeDistributionList = () => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        dispatch({
            type: 'customerStatisticSpace/getStaffSizeDistributionList',
            payload: {
                ...searchParam,
            },
            callback: (res) => {
                this.setState({
                    customerScale: res.data,
                });
            },
        });
    };

    // 获取项目数量分布
    getProjectCountAndAccessDeviceCountByProvince = () => {
        const { dispatch } = this.props;
        const { searchParam, activeRadioValue } = this.state;
        dispatch({
            type: 'customerStatisticSpace/getProjectCountAndAccessDeviceCountByProvince',
            payload: {
                ...searchParam,
                tag: activeRadioValue,
            },
            callback: (res) => {
                this.setState({
                    itemNumberData: res.data,
                });
            },
        });
    };

    // 分页
    getTableViewList = (page = 0, size = 10) => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        dispatch({
            type: 'customerStatisticSpace/getTableListInfo',
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
                this.getCountInfo();
                this.getIndustryDistributionOverview();
                this.getProjectCountAndAccessDeviceCountByProvince();
                this.getStaffSizeDistributionList();
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
                this.getProjectCountAndAccessDeviceCountByProvince();
            },
        );
    };

    // 客户行业
    showIndustryMore = () => {
        this.props.history.push('/statisticAnalysis/customerDistributionStatistics/IndustryMore');
    };

    export = () => {
        const { searchParam } = this.state;
        const date = moment().format('YYYY-MM-DD HHmmss');
        Export.exportAsset(`项目分布数据${date}.xlsx`, `/bioec/w/customerDistribution/projectExport${Api.bodyToParm(searchParam)}`);
    };

    render() {
        const {
            customerStatisticSpace: { tableInfo },
        } = this.props;
        const { defaultRadioValue, activeRadioValue, countData, industryData, itemNumberData, customerScale } = this.state;
        const cardExtra = (
            <Radio.Group defaultValue={defaultRadioValue} onChange={this.radioChange}>
                <Radio.Button value="project">项目数量</Radio.Button>
                <Radio.Button className="radio-total" value="device">
                    设备数量
                </Radio.Button>
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
            <div className={styles['costomer-statistics']}>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <SearchForm handleSearch={this.handleSearch} resetSearch={this.resetSearch}></SearchForm>
                </div>
                <div className="content mt12">
                    <Row type="flex" justify="space-around">
                        <Col span={6}>
                            <Statistic style={{ textAlign: 'center' }} title="客户数量" value={countData && countData.customerTotalCount ? countData.customerTotalCount : 0}></Statistic>
                        </Col>
                        <Divider type="vertical" style={{ height: 80 }}></Divider>
                        <Col span={6}>
                            <Statistic style={{ textAlign: 'center' }} title="项目数量" value={countData && countData.projectTotalCount ? countData.projectTotalCount : 0}></Statistic>
                        </Col>
                        <Divider type="vertical" style={{ height: 80 }}></Divider>
                        <Col span={6}>
                            <Statistic style={{ textAlign: 'center' }} title="接入设备数" value={countData && countData.soldDeviceTotalCount ? countData.soldDeviceTotalCount : 0}></Statistic>
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
                                <span className="table-title">客户行业</span>
                                <div className="dib fr lh32">
                                    <a onClick={this.showIndustryMore}>
                                        更多 <Icon type="right"></Icon>
                                    </a>
                                </div>
                            </div>
                            <div className="border mb12"></div>
                            <div className={styles.troubleType}>
                                <div className={styles.echartsSize}>
                                    <PieChart industryData={industryData}></PieChart>
                                </div>
                                <div className={styles['troubleType-right']}>
                                    <div className={styles['troubleType-right-top']}>
                                        <div className={styles['troubleType-right-head']}>类型</div>
                                        <div className={styles['troubleType-right-head-right']}>数量</div>
                                    </div>
                                    {(industryData || []).map((item) => {
                                        return (
                                            <div key={item.industryName} className={styles['troubleType-right-content']}>
                                                <div className={styles['troubleType-right-content-left']}>{item.industryName}</div>
                                                <div className={styles['troubleType-right-content-right']}>{item.customerNum}</div>
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
                                <span className="table-title">客户规模</span>
                            </div>
                            <div className="border mb12"></div>
                            <div className={styles.troubleType}>
                                <div className={styles.echartsSize}>
                                    <ScalePieChart customerScale={customerScale}></ScalePieChart>
                                </div>
                                <div className={styles['troubleType-right']}>
                                    <div className={styles['troubleType-right-top']}>
                                        <div className={styles['troubleType-right-head']}>类型</div>
                                        <div className={styles['troubleType-right-head-right']}>数量</div>
                                    </div>
                                    {(customerScale || []).map((item) => {
                                        return (
                                            <div key={item.staffSize} className={styles['troubleType-right-content']}>
                                                <div className={styles['troubleType-right-content-left']}>{filters.getCustomerScale(item.staffSize)}</div>
                                                <div className={styles['troubleType-right-content-right']}>{item.customerNum}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.projectDevice}>
                    <Card className="mt12" title="项目数量分布" extra={cardExtra}>
                        <div className={styles.echartsSize}>{activeRadioValue === 'project' ? <BarChart itemNumberData={itemNumberData}></BarChart> : <DeviceBarChart itemNumberData={itemNumberData}></DeviceBarChart>}</div>
                    </Card>
                </div>
                {/* </div> */}
                <div className="content mt12">
                    <div className="mb12 clearfix">
                        <span className="table-title">项目分布数据</span>
                        <div className="fr">
                            <Button onClick={this.export}>
                                <span className="iconfont icon-export mr8 fz14"></span>导出
                            </Button>
                        </div>
                    </div>
                    <Table
                        rowKey={(record) => {
                            return record.areaName;
                        }}
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
