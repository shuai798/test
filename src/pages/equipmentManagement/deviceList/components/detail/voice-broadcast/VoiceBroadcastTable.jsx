import React, { Component } from 'react';
import { Form, Modal } from 'antd';
import { connect } from 'dva';
import filters from '@/filters/index';
import enums from '@/i18n/zh-CN/zhCN';
import FilterSelectAllTable from '@/components/filter-selectall-table';
import EditVoiceBroadcast from './EditVoiceBroadcast';

@connect(({ deviceList, loading }) => {
    return {
        deviceList,
        loadingSearch: loading.effects['deviceList/getVoiceBroadcastList'],
    };
})
@Form.create()
class VoiceBroadcastTable extends Component {
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
            isShowEditVoiceBroadcastModal: false,
        };
    }

    componentDidMount() {
        this.getTableViewList(0);
    }

    getTableViewList = (page, size) => {
        const { dispatch } = this.props;
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
        dispatch({
            type: 'deviceList/getVoiceBroadcastList',
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

    // 点击下一页 或者切换某页，选择每页条数
    tableChange = (pagination, tableFilters) => {
        let { filtersParam } = this.state;
        filtersParam = {
            ...filtersParam,
            ...tableFilters,
        };
        this.setState({ filtersParam }, () => {
            this.getTableViewList(pagination.current - 1, pagination.pageSize);
        });
    };

    updateEditVoiceBroadcastModalStatus = (id) => {
        if (id) {
            const { dispatch } = this.props;
            dispatch({
                type: 'deviceList/getVoiceBroadcastDetail',
                payload: {
                    id,
                },
                callback: () => {
                    this.setState((prevState) => {
                        return { isShowEditVoiceBroadcastModal: !prevState.isShowEditVoiceBroadcastModal };
                    });
                },
            });
        } else {
            this.setState((prevState) => {
                return { isShowEditVoiceBroadcastModal: !prevState.isShowEditVoiceBroadcastModal };
            });
        }
    };

    showPublishConfirm = (id) => {
        Modal.confirm({
            content: '确定要再次发布该播报数据吗？',
            title: '提示',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                return this.publishVoiceBroadcast(id);
            },
        });
    };

    publishVoiceBroadcast = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/publishVoiceBroadcast',
            payload: {
                id,
            },
            callback: () => {
                this.getTableViewList();
            },
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
        const { startValue, endValue } = columns[5].filteredValue;
        if (startValue) {
            filtersParam.publishStartTime = startValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (endValue) {
            filtersParam.publishEndTime = endValue.format('YYYY-MM-DD HH:mm:ss');
        }
        if (columns[4].filteredValue.length > 0) {
            filtersParam.status = columns[4].filteredValue;
        }
        this.setState({ filtersParam }, () => {
            this.getTableViewList(0);
        });
    };

    render() {
        const { isShowEditVoiceBroadcastModal } = this.state;
        const {
            deviceList: { voiceBroadcastList, sceneList = [], charactersList = [] },
        } = this.props;
        const { data = [], pageable = {} } = voiceBroadcastList;
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
                title: '播报场景',
                dataIndex: 'scene',
                render: (text) => {
                    return sceneList.find((item) => {
                        return item.code === text;
                    })?.name;
                },
                ellipsis: true,
            },
            {
                title: '播报模式',
                dataIndex: 'mode',
                ellipsis: true,
                render: (text) => {
                    return filters.voiceBroadcastModeFilter(text);
                },
            },
            {
                title: '播报内容',
                dataIndex: 'characters',
                ellipsis: true,
                render: (text, record) => {
                    if (record.mode === 'INTERNAL') {
                        return charactersList.find((item) => {
                            return item.code === text;
                        })?.name;
                    }
                    return record.fileName;
                },
            },
            {
                title: '下发结果',
                dataIndex: 'status',
                filters: this.getTypeFilters(),
                filterType: 'multipleChoice',
                render: (text) => {
                    return filters.publishResultFilter(text);
                },
                width: 200,
                align: 'center',
                ellipsis: true,
            },
            {
                title: '下发时间',
                dataIndex: 'publishTime',
                filterType: 'timeRanger',
                width: 189,
                align: 'center',
            },
            {
                title: '操作',
                dataIndex: 'id',
                render: (text, record) => {
                    const { id, status } = record;
                    return (
                        <div>
                            {(status === 'SUCCESS' || status === 'FAILURE') && (
                                <a
                                    onClick={() => {
                                        return this.updateEditVoiceBroadcastModalStatus(id);
                                    }}>
                                    编辑
                                </a>
                            )}
                            {/*{status === 'FAILURE' && (*/}
                            {/*    <a*/}
                            {/*        onClick={() => {*/}
                            {/*            return this.showPublishConfirm(id);*/}
                            {/*        }}>*/}
                            {/*        发布*/}
                            {/*    </a>*/}
                            {/*)}*/}
                            {status === 'PROCESSING' && '--'}
                        </div>
                    );
                },
                width: 68,
            },
        ];
        return (
            <div>
                <div className="mb20 clearfix">
                    <span className="table-title">语音播报列表</span>
                </div>
                <FilterSelectAllTable
                    rowKey={(record) => {
                        return record.id;
                    }}
                    columns={columns}
                    dataSource={data}
                    loading={this.props.loadingSearch}
                    onChange={this.tableChange}
                    pagination={pagination}
                    scroll={{ x: 1100 }}
                    handleTableSearch={this.handleTableSearch}></FilterSelectAllTable>
                {isShowEditVoiceBroadcastModal && <EditVoiceBroadcast updateEditVoiceBroadcastModalStatus={this.updateEditVoiceBroadcastModalStatus} getTableViewList={this.getTableViewList}></EditVoiceBroadcast>}
            </div>
        );
    }
}

export default VoiceBroadcastTable;
