import React from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { Form, Table, Button } from 'antd';
import { connect } from 'dva';
import Export from '@/utils/export';
import Api from '@/utils/api';
import TypeNumHeader from './TypeNumHeader';
import SearchForm from './SearchForm';
import ModelBarChart from './ModelBarChart';
import styles from '../style.less';
import moment from 'moment';

@Form.create()
@connect(({ loading, statisticsBreakdownSpace }) => {
    return {
        statisticsBreakdownSpace,
        loadingSearch: loading.effects['statisticsBreakdownSpace/getTroubleModelList'],
    };
})
class Setting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchParam: {},
            troubleModel: [],
        };
    }

    componentDidMount = () => {
        this.getTableViewList(0);
        this.statisticsBySeries();
    };

    // 故障型号
    statisticsBySeries = () => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        dispatch({
            type: 'statisticsBreakdownSpace/statisticsBySeries',
            payload: {
                ...searchParam,
                limit: 30,
            },
            callback: (res) => {
                this.setState({
                    troubleModel: res.data,
                });
            },
        });
    };

    getTableViewList = (page = 0, size = 10) => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        dispatch({
            type: 'statisticsBreakdownSpace/getTroubleModelList',
            payload: {
                page,
                size,
                ...searchParam,
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
                this.getTableViewList(0);
                this.statisticsBySeries();
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
        Export.exportAsset(`故障型号数量${date}.xlsx`, `/bioec/w/statisticsBreakdown/seriesExport${Api.bodyToParm(searchParam)}`);
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
                title: '设备型号',
                dataIndex: 'seriesName',
                ellipsis: true,
                // width: 106,
            },
            {
                title: '故障数量',
                dataIndex: 'num',
                ellipsis: true,
                align: 'right',
            },
            {
                title: '数量占比',
                dataIndex: 'percentage',
                align: 'right',
                ellipsis: true,
            },
        ];

        const {
            statisticsBreakdownSpace: { troubleModelInfo },
            loadingSearch,
        } = this.props;
        const { troubleModel } = this.state;
        const { content = [], pageable = {} } = troubleModelInfo;
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
                <TypeNumHeader titleName="故障型号统计"></TypeNumHeader>
                <div className="content mt12">
                    <SearchForm handleSearch={this.handleSearch} resetSearch={this.resetSearch}></SearchForm>
                </div>
                <div className="content mt12">
                    <div className="mb12 clearfix">
                        <span className="table-title">故障型号Top30</span>
                    </div>
                    <div className="border"></div>
                    <div className={styles.echartsSize}>
                        <ModelBarChart troubleModel={troubleModel}></ModelBarChart>
                    </div>
                </div>
                <div className="content mt12">
                    <div className="mb12 clearfix">
                        <span className="table-title">故障型号数量</span>
                        <div className="fr">
                            <Button onClick={this.export}>
                                <span className="iconfont icon-export mr8 fz14"></span>导出
                            </Button>
                        </div>
                    </div>
                    <Table
                        rowKey={(record) => {
                            return record.id;
                        }}
                        loading={loadingSearch}
                        scroll={{ x: 1100 }}
                        columns={columns}
                        dataSource={content}
                        pagination={pagination}
                        onChange={this.tableChange}></Table>
                </div>
            </div>
        );
    }
}

export default Setting;
