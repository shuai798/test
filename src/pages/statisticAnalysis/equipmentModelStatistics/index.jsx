import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import Export from '@/utils/export';
import Api from '@/utils/api';
import { Table, Button, Form } from 'antd';
import { connect } from 'dva';
import SearchForm from './components/SearchForm';
import BarChart from './components/BarChart';
import styles from './style.less';
import moment from 'moment';

@connect(({ loading, deviceTypeStatistics }) => {
    return {
        deviceTypeStatistics,
        loadingSearch: loading.effects['deviceTypeStatistics/getTableListInfo'],
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
            title: '型号名称',
            dataIndex: 'seriesName',
            align: 'left',
            ellipsis: true,
        },
        {
            title: '型号编码',
            dataIndex: 'seriesCode',
            align: 'left',
            ellipsis: true,
        },
        {
            title: '所属系列',
            dataIndex: 'parentNames',
            align: 'left',
            ellipsis: true,
        },
        {
            title: '设备数量',
            dataIndex: 'deviceNum',
            align: 'right',
            ellipsis: true,
        },
        {
            title: '数量占比',
            dataIndex: 'percent',
            align: 'right',
            ellipsis: true,
        },
    ];

    constructor(props) {
        super(props);
        this.state = {
            pageInfo: {
                page: 0,
                size: 10,
            },
            expand: false,
            searchParam: {},
            data: [],
            pageable: {},
            deviceTop30Data: [],
        };
    }

    componentDidMount = () => {
        this.getDeviceTop30();
        this.getTableViewList(0);
    };

    getDeviceTop30 = () => {
        const { dispatch } = this.props;
        const { searchParam } = this.state;
        dispatch({
            type: 'deviceTypeStatistics/getDeviceTop30',
            payload: {
                ...searchParam,
            },
            callback: (res) => {
                this.setState({
                    deviceTop30Data: res.data,
                });
            },
        });
    };

    getTableViewList = (page, size) => {
        const { dispatch } = this.props;
        const { pageInfo, searchParam } = this.state;
        let flag = 0;
        if (page || page === 0) {
            pageInfo.page = page;
            flag = 1;
        }
        if (size) {
            pageInfo.size = size;
            flag = 1;
        }
        dispatch({
            type: 'deviceTypeStatistics/getTableListInfo',
            payload: {
                ...pageInfo,
                ...searchParam,
            },
            callback: (res) => {
                this.setState({
                    data: res.data,
                    pageable: res.pageable,
                });
            },
        });
        if (flag) {
            this.setState({
                pageInfo,
            });
        }
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
                this.getDeviceTop30();
            },
        );
    };

    // 重置查询条件
    resetSearch = () => {
        this.props.form.resetFields();
    };

    toggleForm = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    };

    export = () => {
        const { searchParam } = this.state;
        const date = moment().format('YYYY-MM-DD HHmmss');
        Export.exportAsset(`设备型号数量${date}.xlsx`, `/bioec/w/statisticsSeries/export${Api.bodyToParm(searchParam)}`);
    };

    render() {
        const { data, pageable, deviceTop30Data } = this.state;
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
            <div>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <SearchForm handleSearch={this.handleSearch} resetSearch={this.resetSearch}></SearchForm>
                </div>
                <div className="content mt12">
                    <div className="mb12 clearfix">
                        <span className="table-title">型号数量Top30</span>
                    </div>
                    <div className="border"></div>
                    <div className={styles.echatsSize}>
                        <BarChart deviceTop30Data={deviceTop30Data}></BarChart>
                    </div>
                </div>
                <div className="content mt12">
                    <div className="mb12 clearfix">
                        <span className="table-title">设备型号数量</span>
                        <div className="fr">
                            <Button onClick={this.export}>
                                <span className="iconfont icon-export mr8 fz14"></span>导出
                            </Button>
                        </div>
                    </div>
                    <Table
                        rowKey={(record) => {
                            return record.seriesId;
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
