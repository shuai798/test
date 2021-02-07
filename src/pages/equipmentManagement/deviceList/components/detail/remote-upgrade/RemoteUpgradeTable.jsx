import React, { Component } from 'react';
import { Table, Button, Form, Icon, Descriptions } from 'antd';
import { HxRangePicker } from '@/components/hx-components';
import { connect } from 'dva';
import filters from '@/filters/index';
import moment from 'moment';
import enums from '@/i18n/zh-CN/zhCN';
import FilterSelectAllTable from '@/components/filter-selectall-table';
import styles from '../../../index.less';
import RemoteUpgrade from './RemoteUpgrade';

@connect(({ deviceList, loading }) => {
    return {
        deviceList,
        loadingSearch: loading.effects['deviceList/getDeviceUpgradeRecordList'],
    };
})
@Form.create()
class RemoteUpgradeTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageInfo: {
                page: 0,
                size: 10,
            },
            searchParam: {
                deviceId: this.props.deviceList.deviceDetail.id,
            },
            filtersParam: {},
            isShowRemoteUpgradeModal: false,
        };
    }

    componentDidMount = () => {
        this.getTableViewList(0);
        this.getVersionInfo();
    };

    getTableViewList = (page, size) => {
        const { pageInfo, searchParam, filtersParam } = this.state;
        let flag = 0;
        if (page || page === 0) {
            pageInfo.page = page;
            flag = 1;
        }
        if (size) {
            pageInfo.size = size;
            flag = 1;
        }
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/getDeviceUpgradeRecordList',
            payload: {
                ...pageInfo,
                ...searchParam,
                ...filtersParam,
            },
        });
        if (flag) {
            this.setState({
                pageInfo,
            });
        }
    };

    getVersionInfo = () => {
        const { dispatch } = this.props;
        const { deviceId } = this.state.searchParam;
        dispatch({
            type: 'deviceList/getVersionInfo',
            payload: {
                id: deviceId,
            },
        });
    };

    // 点击下一页 或者切换某页，选择每页条数
    tableChange = (pagination) => {
        this.getTableViewList(pagination.current - 1, pagination.pageSize);
    };

    updateUpgradeModalStatus = () => {
        // const { id } = record;
        this.setState((prevState) => {
            return { isShowRemoteUpgradeModal: !prevState.isShowRemoteUpgradeModal };
        });
    };

    getTypeFilters = () => {
        const typeArray = [];
        enums.publishResult.map((item) => {
            const typeItem = {};
            typeItem.label = item.name;
            typeItem.value = item.code;
            typeArray.push(typeItem);
        });
        return typeArray;
    };

    handleTableSearch = (confirm, columns) => {
        confirm();
        const filtersParam = {};
        const { startValue, endValue } = columns[4].filteredValue;
        if (startValue) {
            filtersParam.upgradeStartTime = startValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (endValue) {
            filtersParam.upgradeEndTime = endValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (columns[3].filteredValue.length > 0) {
            filtersParam.statusList = columns[3].filteredValue;
        }
        this.setState({ filtersParam }, () => {
            this.getTableViewList(0);
        });
    };

    render() {
        const { isShowRemoteUpgradeModal } = this.state;
        const {
            deviceList: { deviceUpgradeRecordList, versionInfo },
        } = this.props;
        const { data = [], pageable = {} } = deviceUpgradeRecordList;
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
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                width: 68,
                align: 'center',
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                },
            },
            {
                title: '目标版本',
                dataIndex: 'destVersionNo',
                ellipsis: true,
            },
            {
                title: '出发版本',
                dataIndex: 'sourceVersionNo',
                ellipsis: true,
            },
            {
                title: '下发结果',
                dataIndex: 'status',
                filters: this.getTypeFilters(),
                filterType: 'multipleChoice',
                ellipsis: true,
                render: (text) => {
                    return filters.publishResultFilter(text);
                },
                width: 200,
                align: 'center',
            },
            {
                title: '下发时间',
                dataIndex: 'upgradeTime',
                filterType: 'timeRanger',
                width: 189,
                align: 'center',
                ellipsis: true,
            },
        ];
        return (
            <div>
                <div className="mb20">
                    <div className={styles['information-title']}>升级监测</div>
                </div>
                <div className={styles['information-descriptions']}>
                    <Descriptions bordered size="small" column={3}>
                        <Descriptions.Item label="当前版本" span={1}>
                            {versionInfo.currentVersionNo}
                        </Descriptions.Item>
                        <Descriptions.Item label="最新版本" span={1}>
                            {versionInfo.highestVersionNo}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
                <div className="mb20 mt20">
                    <span className={styles['information-title']} style={{ lineHeight: '32px' }}>
                        升级记录
                    </span>
                    <div className="fr">
                        <Button onClick={this.updateUpgradeModalStatus} className="mr8" type="primary">
                            远程升级
                        </Button>
                    </div>
                </div>
                <FilterSelectAllTable
                    columns={columns}
                    dataSource={data}
                    rowKey={(record) => {
                        return record.id;
                    }}
                    loading={this.props.loadingSearch}
                    onChange={this.tableChange}
                    pagination={pagination}
                    scroll={{ x: 1100 }}
                    handleTableSearch={this.handleTableSearch}></FilterSelectAllTable>
                {isShowRemoteUpgradeModal && <RemoteUpgrade updateUpgradeModalStatus={this.updateUpgradeModalStatus} getTableViewList={this.getTableViewList} getVersionInfo={this.getVersionInfo}></RemoteUpgrade>}
            </div>
        );
    }
}

export default RemoteUpgradeTable;
