import React from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { Form, Button, Row, Col, Spin } from 'antd';
import filters from '@/filters/index';
import { connect } from 'dva';
import enums from '@/i18n/zh-CN/zhCN';
import FilterSelectAllTable from '@/components/filter-selectall-table';
import CommonPageHeader from './CommonPageHeader';
import SearchForm from './BatchSearchForm';

const FormItem = Form.Item;

@Form.create()
@connect(({ loading, batchOperationSpace }) => {
    return {
        batchOperationSpace,
        loadingSearch: loading.effects['batchOperationSpace/getDetaiTablelList'],
        applyLoadingSearch: loading.effects['batchOperationSpace/issuedAgain'],
        batchApplyLoadingSearch: loading.effects['batchOperationSpace/batchIssuedAgain'],
    };
})
class Setting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchParam: {},
            detailList: {}, // 详情数据
            failureData: [], // 批量失败下发ids
            applyLoading: false,
            batchApplyLoading: false,
            filtersParam: {},
        };
    }

    componentDidMount = () => {
        this.getSceneList();
        this.getCharactersList();
        this.getTableViewList(0);
    };

    // 获取播报场景
    getSceneList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'batchOperationSpace/getSceneList',
            payload: {
                code: 'YYBBCJ',
            },
        });
    }

    // 获取播报语音
    getCharactersList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'batchOperationSpace/getCharactersList',
            payload: {
                code: 'YYBBWZ',
            },
        });
    }

    // 分页
    getTableViewList = (page = 0, size = 10) => {
        const { dispatch } = this.props;
        let batchOperationId;
        const failureData = [];
        if (this.props.location.query.id) {
            batchOperationId = this.props.location.query.id;
        }
        const { searchParam, pagination, filtersParam } = this.state;
        const value = {
            page,
            size: size || pagination.pageSize,
            ...searchParam,
            batchOperationId,
            ...filtersParam,
        };
        dispatch({
            type: 'batchOperationSpace/getDetaiTablelList',
            payload: {
                ...value,
            },
            callback: (res) => {
                if (res.data.length > 0) {
                    res.data.map((item) => {
                        if (item.issueStatus === 'FAILURE') {
                            failureData.push(item.id);
                        }
                    });
                    this.setState({
                        failureData,
                    });
                }
            },
        });
        dispatch({
            type: 'batchOperationSpace/getDetaiList',
            payload: {
                id: batchOperationId,
            },
            callback: (res) => {
                this.setState({
                    detailList: res.data,
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
                this.getTableViewList(0);
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
        this.getTableViewList(pagination.current - 1, pagination.pageSize);
    };

    // 设备状态
    getTypeFilters = () => {
        const typeArray = [];
        enums.batchStatus.map((item) => {
            const typeItem = {};
            typeItem.label = item.name;
            typeItem.value = item.code;
            typeArray.push(typeItem);
        });
        return typeArray;
    };

    // 运行监测
    operationMonitorFilter = () => {
        const typeArray = [];
        enums.operationMonitor.map((item) => {
            const typeItem = {};
            typeItem.label = item.name;
            typeItem.value = item.code;
            typeArray.push(typeItem);
        });
        return typeArray;
    };

    // 管理状态
    manageStatusFilter = () => {
        const typeArray = [];
        enums.manageStatus.map((item) => {
            const typeItem = {};
            typeItem.label = item.name;
            typeItem.value = item.code;
            typeArray.push(typeItem);
        });
        return typeArray;
    };

    // 操作结果
    operationResultFilter = () => {
        const typeArray = [];
        enums.operationResult.map((item) => {
            const typeItem = {};
            typeItem.label = item.name;
            typeItem.value = item.code;
            typeArray.push(typeItem);
        });
        return typeArray;
    };

    // 再次下发
    issuedAgain = (id) => {
        const { dispatch } = this.props;
        this.setState({
            applyLoading: true,
        });
        dispatch({
            type: 'batchOperationSpace/issuedAgain',
            payload: {
                operationDeviceId: id,
            },
            callback: (res) => {
                if (res.status === 200) {
                    this.setState({
                        applyLoading: false,
                    });
                }
            },
        });
    };

    // 批量再次下发
    batchIssuedAgain = () => {
        const { dispatch } = this.props;
        let batchOperationId;
        if (this.props.location.query.id) {
            batchOperationId = this.props.location.query.id;
        }
        this.setState({
            batchApplyLoading: true,
        });
        dispatch({
            type: 'batchOperationSpace/batchIssuedAgain',
            payload: {
                id: batchOperationId,
            },
            callback: (res) => {
                if (res.status === 200) {
                    this.setState({
                        batchApplyLoading: false,
                    });
                }
            },
        });
    };

    handleTableSearch = (confirm, columns) => {
        confirm();
        const filtersParam = {};
        if (columns[4].filteredValue.length > 0) {
            filtersParam.statusList = columns[4].filteredValue;
        }
        if (columns[5].filteredValue.length > 0) {
            filtersParam.runningStatusList = columns[5].filteredValue;
        }
        if (columns[6].filteredValue.length > 0) {
            filtersParam.managementStatusList = columns[6].filteredValue;
        }
        if (columns[7].filteredValue.length > 0) {
            filtersParam.issueResultList = columns[7].filteredValue;
        }
        this.setState({ filtersParam }, () => {
            this.getTableViewList(0);
        });
    };

    render() {
        const { detailList, applyLoading, batchApplyLoading, failureData } = this.state;
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
                title: '设备编码',
                dataIndex: 'no',
                ellipsis: true,
                // width: 106,
            },
            {
                title: '系列型号',
                dataIndex: 'seriesName',
                ellipsis: true,
            },
            {
                title: '所属客户',
                dataIndex: 'customerName',
                ellipsis: true,
            },
            {
                title: '设备状态',
                dataIndex: 'status',
                align: 'center',
                ellipsis: true,
                filterType: 'multipleChoice',
                filters: this.getTypeFilters(),
                render: (text) => {
                    if (text === 'RUNNING') {
                        return (
                            <div>
                                <div
                                    className="dib"
                                    style={{
                                        width: 8,
                                        height: 8,
                                        background: '#01B538',
                                        borderRadius: '50%',
                                        marginRight: 7,
                                    }}></div>
                                <div className="dib">{filters.getDeviceStatusData(text) || '--'}</div>
                            </div>
                        );
                    }
                    if (text === 'TO_BE_MAINTAINED') {
                        return (
                            <div>
                                <div
                                    className="dib"
                                    style={{
                                        width: 8,
                                        height: 8,
                                        background: '#0086FF',
                                        borderRadius: '50%',
                                        marginRight: 7,
                                    }}></div>
                                <div className="dib">{filters.getDeviceStatusData(text) || '--'}</div>
                            </div>
                        );
                    }
                    if (text === 'TO_BE_SCRAPPED') {
                        return (
                            <div>
                                <div
                                    className="dib"
                                    style={{
                                        width: 8,
                                        height: 8,
                                        background: '#FF3B3B',
                                        borderRadius: '50%',
                                        marginRight: 7,
                                    }}></div>
                                <div className="dib">{filters.getDeviceStatusData(text) || '--'}</div>
                            </div>
                        );
                    }
                    return (
                        <div>
                            <div
                                className="dib"
                                style={{
                                    width: 8,
                                    height: 8,
                                    background: '#81878E',
                                    borderRadius: '50%',
                                    marginRight: 7,
                                }}></div>
                            <div className="dib">{filters.getDeviceStatusData(text) || '--'}</div>
                        </div>
                    );
                },
            },
            {
                title: '运行监测',
                dataIndex: 'runningStatus',
                align: 'center',
                ellipsis: true,
                filterType: 'multipleChoice',
                filters: this.operationMonitorFilter(),
                render: (text) => {
                    if (text === 'NORMAL') {
                        return (
                            <div>
                                <div
                                    className="dib"
                                    style={{
                                        width: 8,
                                        height: 8,
                                        background: '#0086FF',
                                        borderRadius: '50%',
                                        marginRight: 7,
                                    }}></div>
                                <div className="dib">{filters.operationMonitorFilter(text) || '--'}</div>
                            </div>
                        );
                    }
                    if (text === 'BREAKDOWN') {
                        return (
                            <div>
                                <div
                                    className="dib"
                                    style={{
                                        width: 8,
                                        height: 8,
                                        background: '#FF3B3B',
                                        borderRadius: '50%',
                                        marginRight: 7,
                                    }}></div>
                                <div className="dib">{filters.operationMonitorFilter(text) || '--'}</div>
                            </div>
                        );
                    }
                    return (
                        <div>
                            <div
                                className="dib"
                                style={{
                                    width: 8,
                                    height: 8,
                                    background: '#81878E',
                                    borderRadius: '50%',
                                    marginRight: 7,
                                }}></div>
                            <div className="dib">{filters.operationMonitorFilter(text) || '--'}</div>
                        </div>
                    );
                },
            },
            {
                title: '管理状态',
                dataIndex: 'managementStatus',
                align: 'center',
                ellipsis: true,
                filterType: 'multipleChoice',
                filters: this.manageStatusFilter(),
                render: (text) => {
                    if (text === 'ENABLE') {
                        return (
                            <div>
                                <div
                                    className="dib"
                                    style={{
                                        width: 8,
                                        height: 8,
                                        background: '#01B538',
                                        borderRadius: '50%',
                                        marginRight: 7,
                                    }}></div>
                                <div className="dib">{filters.manageStatusFilter(text) || '--'}</div>
                            </div>
                        );
                    }
                    return (
                        <div>
                            <div
                                className="dib"
                                style={{
                                    width: 8,
                                    height: 8,
                                    background: '#FF3B3B',
                                    borderRadius: '50%',
                                    marginRight: 7,
                                }}></div>
                            <div className="dib">{filters.manageStatusFilter(text) || '--'}</div>
                        </div>
                    );
                },
            },
            {
                title: '操作结果',
                dataIndex: 'issueStatus',
                filterType: 'multipleChoice',
                ellipsis: true,
                filters: this.operationResultFilter(),
                render: (text) => {
                    if (text === 'SUCCESS') {
                        return (
                            <div>
                                <div
                                    className="dib"
                                    style={{
                                        width: 8,
                                        height: 8,
                                        background: '#01B538',
                                        borderRadius: '50%',
                                        marginRight: 7,
                                    }}></div>
                                <div className="dib">{filters.operationResultFilter(text) || '--'}</div>
                            </div>
                        );
                    }
                    if (text === 'FAILURE') {
                        return (
                            <div>
                                <div
                                    className="dib"
                                    style={{
                                        width: 8,
                                        height: 8,
                                        background: '#FF3B3B',
                                        borderRadius: '50%',
                                        marginRight: 7,
                                    }}></div>
                                <div className="dib">{filters.operationResultFilter(text) || '--'}</div>
                            </div>
                        );
                    }
                    return (
                        <div>
                            <div
                                className="dib"
                                style={{
                                    width: 8,
                                    height: 8,
                                    background: '#FF9A00',
                                    borderRadius: '50%',
                                    marginRight: 7,
                                }}></div>
                            <div className="dib">{filters.operationResultFilter(text) || '--'}</div>
                        </div>
                    );
                },
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    return record.issueStatus === 'FAILURE' ? (
                        <a
                            onClick={() => {
                                return this.issuedAgain(record.operationDeviceId);
                            }}>
                            再次下发
                        </a>
                    ) :
                        '--';
                },
                fixed: 'right',
                width: 120,
            },
        ];

        const {
            batchOperationSpace: { detailListInfo, sceneList = [], charactersList = [] },
            loadingSearch,
            applyLoadingSearch,
            batchApplyLoadingSearch,
        } = this.props;
        const { data = [], pageable = {} } = detailListInfo;
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
        let pathTypeListStr = '';
        if (detailList && detailList.operationType && detailList.operationType === 'INFORMATION_PUBLISH') {
            const arr = [];
            detailList.pathTypelist.map((item) => {
                enums.pathTypeList.map((pathType) => {
                    if (item === pathType.code) {
                        arr.push(pathType.name);
                    }
                });
            });
            pathTypeListStr = arr.join('、');
        }
        return (
            <>
                <PageHeaderWrapper></PageHeaderWrapper>
                <CommonPageHeader titleName="操作详情"></CommonPageHeader>
                <div className="content mt12">
                    <SearchForm handleSearch={this.handleSearch} resetSearch={this.resetSearch}></SearchForm>
                </div>
                <div className="content mt12">
                    <div className="mb12 clearfix">
                        <span className="table-title">设备列表</span>
                        {failureData.length > 0 ? (
                            <div className="fr">
                                <Button onClick={this.batchIssuedAgain} className="mr8" type="primary">
                                    批量失败下发
                                </Button>
                            </div>
                        ) :
                            ''
                        }
                    </div>
                    <Spin size="large" tip="系统操作中" spinning={ applyLoading ? applyLoadingSearch : batchApplyLoading ? batchApplyLoadingSearch : false}>
                        <FilterSelectAllTable
                            rowKey={(record) => {
                                return record.id;
                            }}
                            loading={loadingSearch}
                            scroll={{ x: 1300 }}
                            columns={columns}
                            dataSource={data}
                            pagination={pagination}
                            onChange={this.tableChange}
                            handleTableSearch={this.handleTableSearch}></FilterSelectAllTable>
                    </Spin>
                </div>
                <div className="content mt12">
                    <div className="formList88">
                        <Form className="m5" layout="inline" onSubmit={this.submitAddForm}>
                            <Row gutter={20}>
                                <Col span={24}>
                                    <FormItem label="操作类型">{detailList && detailList.operationType ? filters.getOperationType(detailList.operationType) : '--'}</FormItem>
                                </Col>
                            </Row>
                            {detailList && detailList.operationType && detailList.operationType === 'UPGRADE' ? (
                                <Row gutter={20}>
                                    <Col span={8}>
                                        <FormItem label="系列型号">{detailList && detailList.seriesName ? detailList.seriesName : '--'}</FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="目标版本">{detailList && detailList.destVersionNo ? detailList.destVersionNo : '--'}</FormItem>
                                    </Col>
                                </Row>
                            ) : (
                                <div></div>
                            )}
                            {detailList && detailList.operationType && detailList.operationType === 'INFORMATION_PUBLISH' ? (
                                <div>
                                    <Row gutter={20}>
                                        <Col span={8}>
                                            <FormItem label="发布标题">{detailList && detailList.title ? detailList.title : '--'}</FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label="通道类型">{pathTypeListStr}</FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={20}>
                                        <Col span={8}>
                                            <FormItem label="显示位置">{detailList && detailList.location ? filters.deviceInformationLocationFilter(detailList.location) : '--'}</FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label="媒体文件">{detailList && detailList.fileName ? detailList.fileName : '--'}</FormItem>
                                        </Col>
                                    </Row>
                                </div>
                            ) : (
                                <div></div>
                            )}
                            {detailList && detailList.operationType && detailList.operationType === 'VOICE_BROADCAST' ? (
                                <Row gutter={20}>
                                    <Col span={8}>
                                        <FormItem label="播报场景">{detailList && detailList.scene ? sceneList.find((item) => {
                                            return item.code === detailList.scene;
                                        })?.name : '--'}</FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="播报模式">{detailList && detailList.mode ? filters.voiceBroadcastModeFilter(detailList.mode) : '--'}</FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="播报内容">{detailList.mode === 'INTERNAL' ? charactersList.find((item) => {
                                            return item.code === detailList.characters;
                                        })?.name : detailList.fileName}</FormItem>
                                    </Col>
                                </Row>
                            ) : (
                                <div></div>
                            )}
                            {detailList && detailList.operationType && (detailList.operationType === 'REBOOT' || detailList.operationType === 'OPEN' || detailList.operationType === 'CLOSE') ? (
                                <Row gutter={20}>
                                    <Col span={8}>
                                        <FormItem label="控制类型">{detailList && detailList.operationType ? filters.getOperationType(detailList.operationType) : '--'}</FormItem>
                                    </Col>
                                </Row>
                            ) : (
                                <div></div>
                            )}
                            {detailList && detailList.operationType && detailList.operationType === 'STATUS_SET' ? (
                                <Row gutter={20}>
                                    <Col span={8}>
                                        <FormItem label="管理状态">{detailList && detailList.managementStatus ? filters.managementStatusFilter(detailList.managementStatus) : '--'}</FormItem>
                                    </Col>
                                </Row>
                            ) : (
                                <div></div>
                            )}
                            <Row gutter={20}>
                                <Col span={8}>
                                    <FormItem label="操作时间">{detailList && detailList.operationTime ? detailList.operationTime : '--'}</FormItem>
                                </Col>
                                <Col span={8}>
                                    <FormItem label="操作人">{detailList && detailList.operatorName ? detailList.operatorName : '--'}</FormItem>
                                </Col>{' '}
                                <Col span={8}>
                                    <FormItem label="所属组织">{detailList && detailList.organizationName ? detailList.organizationName : '--'}</FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </>
        );
    }
}

export default Setting;
