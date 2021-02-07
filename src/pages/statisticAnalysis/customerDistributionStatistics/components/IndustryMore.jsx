import React from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { Form, Table, Button } from 'antd';
import { connect } from 'dva';
import Export from '@/utils/export';
import Api from '@/utils/api';
import CommonPageHeader from './CommonPageHeader';
import SearchForm from './SearchForm';
import CustomerBarChart from './CustomerBarChart';
import styles from '../style.less';
import moment from 'moment';

@Form.create()
@connect(({ loading, customerStatisticSpace }) => {
    return {
        customerStatisticSpace,
        loadingSearch: loading.effects['customerStatisticSpace/getIndustryListInfo'],
    };
})
class Setting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchParam: {},
            top30Data: [],
        };
    }

    componentDidMount = () => {
        this.getTableViewList(0);
        this.getIndustryDistributionWhole();
    };

    getTableViewList = (page = 0, size = 10) => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        dispatch({
            type: 'customerStatisticSpace/getIndustryListInfo',
            payload: {
                page,
                size,
                ...searchParam,
            },
        });
    };

    // 获取行业分布前三十
    getIndustryDistributionWhole = () => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        dispatch({
            type: 'customerStatisticSpace/getIndustryDistributionWhole',
            payload: {
                ...searchParam,
            },
            callback: (res) => {
                this.setState({
                    top30Data: res.data,
                });
            },
        });
    };

    // 查询数据
    handleSearch = (value) => {
        this.setState(
            {
                searchParam: value,
            },
            () => {
                this.getTableViewList();
                this.getIndustryDistributionWhole();
            },
        );
    };

    // 重置查询条件
    resetSearch = () => {
        this.setState({
            searchParam: {},
        });
    };

    // 点击下一页 或者切换某页，选择每页条数
    tableChange = (pagination) => {
        return this.getTableViewList(pagination.current - 1, pagination.pageSize);
    };

    export = () => {
        const { searchParam } = this.state;
        const date = moment().format('YYYY-MM-DD HHmmss');
        Export.exportAsset(`客户行业数量${date}.xlsx`, `/bioec/w/customerDistribution/industryExport${Api.bodyToParm(searchParam)}`);
    };

    render() {
        const columns = [
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
                title: '行业类型',
                dataIndex: 'industryName',
                align: 'left',
                ellipsis: true,
            },
            {
                title: '客户数量',
                dataIndex: 'customerNum',
                align: 'right',
                ellipsis: true,
            },
            {
                title: '数量占比',
                dataIndex: 'customerPercent',
                align: 'right',
                ellipsis: true,
            },
        ];

        const {
            customerStatisticSpace: { industryInfo },
            loadingSearch,
        } = this.props;
        const { data = [], pageable = {} } = industryInfo;
        const { top30Data } = this.state;
        const pagination = {
            showTotal: () => {
                return (
                    <span className="pagination">
                        共<a>{pageable.totalPages}</a>页/<a>{pageable.totalElements}</a>条
                    </span>
                );
            },
            total: pageable.totalElements,
            pageSize: pageable.size,
            current: parseInt(pageable.number + 1, 10) || 1,
            showSizeChanger: true,
        };
        return (
            <div>
                <PageHeaderWrapper></PageHeaderWrapper>
                <CommonPageHeader titleName="故障类型统计"></CommonPageHeader>
                <div className="content mt12">
                    <SearchForm handleSearch={this.handleSearch} resetSearch={this.resetSearch}></SearchForm>
                </div>

                <div className="content mt12">
                    <div className="mb12 clearfix">
                        <span className="table-title">行业分布Top30</span>
                    </div>
                    <div className="border"></div>
                    <div className={styles.echartsSize}>
                        <CustomerBarChart top30Data={top30Data}></CustomerBarChart>
                    </div>
                </div>
                <div className="content mt12">
                    <div className="mb12 clearfix">
                        <span className="table-title">客户行业数量</span>
                        <div className="fr">
                            <Button onClick={this.export}>
                                <span className="iconfont icon-export mr8 fz14"></span>导出
                            </Button>
                        </div>
                    </div>
                    <Table
                        rowKey={(record) => {
                            return record.industryName;
                        }}
                        loading={loadingSearch}
                        // bordered
                        scroll={{ x: 1100 }}
                        columns={columns}
                        dataSource={data}
                        pagination={pagination}
                        onChange={this.tableChange}></Table>
                </div>
            </div>
        );
    }
}

export default Setting;
