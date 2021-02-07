import React from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { Form, Table, Button } from 'antd';
import { connect } from 'dva';
import Export from '@/utils/export';
import Api from '@/utils/api';
import moment from 'moment';
import CommonPageHeader from './CommonPageHeader';
import SearchForm from './SearchForm';
import DeviceBarChart from './DeviceBarChart';
import styles from '../style.less';

@Form.create()
@connect(({ loading, statisticsBreakdownSpace }) => {
    return {
        statisticsBreakdownSpace,
        loadingSearch: loading.effects['statisticsBreakdownSpace/getTroubleTypeList'],
    };
})
class Setting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchParam: {},
            troubleType: [],
        };
    }

    componentDidMount = () => {
        this.getTableViewList(0);
        this.statisticsByType();
    };

    // 故障类型
    statisticsByType = () => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        dispatch({
            type: 'statisticsBreakdownSpace/statisticsByType',
            payload: {
                ...searchParam,
                limit: 30,
            },
            callback: (res) => {
                this.setState({
                    troubleType: res.data,
                });
            },
        });
    };

    getTableViewList = (page = 0, size = 10) => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        dispatch({
            type: 'statisticsBreakdownSpace/getTroubleTypeList',
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
                this.statisticsByType();
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
        Export.exportAsset(`设备故障数量${date}.xlsx`, `/bioec/w/statisticsBreakdown/typeExport${Api.bodyToParm(searchParam)}`);
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
                ellipsis: true,
            },
            {
                title: '故障类型',
                dataIndex: 'typeName',
                ellipsis: true,
            },
            {
                title: '故障数量',
                dataIndex: 'num',
                align: 'right',
                ellipsis: true,
            },
            {
                title: '数量占比',
                dataIndex: 'percentage',
                align: 'right',
                ellipsis: true,
            },
        ];

        const {
            statisticsBreakdownSpace: { troubleTypeInfo },
            loadingSearch,
        } = this.props;
        const { troubleType } = this.state;
        const { content = [], pageable = {} } = troubleTypeInfo;
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
                        <span className="table-title">故障类型Top30</span>
                    </div>
                    <div className="border"></div>
                    <div className={styles.echartsSize}>
                        <DeviceBarChart troubleType={troubleType}></DeviceBarChart>
                    </div>
                </div>
                <div className="content mt12">
                    <div className="mb12 clearfix">
                        <span className="table-title">设备故障数量</span>
                        <div className="fr">
                            <Button onClick={this.export}>
                                <span className="iconfont icon-export mr8 fz14"></span>导出
                            </Button>
                        </div>
                    </div>
                    <Table
                        rowKey={(record) => {
                            return record.type;
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
