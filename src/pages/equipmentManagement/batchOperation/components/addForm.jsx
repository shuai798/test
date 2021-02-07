import React from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { Form, Table, Row, Col, Radio, Input, Upload, message, Select, Button, Modal, Icon, Cascader, Checkbox } from 'antd';
import filters from '@/filters/index';
import validate from '@/utils/validation';
import { HxIcon, HxSelect } from '@/components/hx-components';
import { connect } from 'dva';
import FilterSelectAllTable from '@/components/filter-selectall-table';
import storage from '@/utils/storage';
import Api from '@/utils/api';
import enums from '@/i18n/zh-CN/zhCN';
import BatchPageHeader from './BatchPageHeader';
import SearchForm from './BatchSearchForm';
import styles from '../index.less';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;

const optionStatus = [
    {
        label: '远程升级',
        value: 1,
    },
    {
        label: '信息发布',
        value: 2,
    },
    {
        label: '语音播报',
        value: 3,
    },
    {
        label: '远程控制',
        value: 4,
    },
    {
        label: '状态设置',
        value: 5,
    },
];

const channelType = [
    {
        label: 'in通道',
        value: 'IN',
    },
    {
        label: 'out通道',
        value: 'OUT',
    },
];

@Form.create()
@connect(({ loading, batchOperationSpace }) => {
    return {
        batchOperationSpace,
        loadingSearch: loading.effects['batchOperationSpace/getBatchOperationList'],
    };
})
class Setting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchParam: {},
            radioChecked: 1, //默认选中的radio
            selectedRows: [],
            locationValue: null,
            seriesTreeData: [], // 系列型号
            destVersionData: [], // 目标版本
            fileList: [],
            filtersParam: {},
        };
    }

    componentDidMount = () => {
        this.getTableViewList(0);
        this.getSeriesTree();
        this.getSceneList();
        this.getCharactersList();
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

    // 系列型号
    getSeriesTree = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceCodeManagement/getSeriesTree',
            callback: (res) => {
                const seriesTreeData = this.changeDataToTreeSelect(res.data, '');
                this.setState({ seriesTreeData });
            },
        });
    };

    changeDataToTreeSelect = (dataList) => {
        const list = dataList;
        if (list.length > 0) {
            for (let i = 0; i < list.length; i += 1) {
                list[i].key = list[i].id;
                list[i].label = list[i].name;
                list[i].value = list[i].id;
                if (list[i].children && list[i].children.length > 0) {
                    list[i].children = this.changeDataToTreeSelect(list[i].children, list[i].newValue);
                } else {
                    list[i].children = null;
                }
            }
        }
        return list;
    };

    // 分页
    getTableViewList = (page = 0, size = 10) => {
        const { dispatch } = this.props;
        const { searchParam, pagination, filtersParam } = this.state;
        const value = {
            page,
            size: size || pagination.pageSize,
            ...searchParam,
            ...filtersParam,
        };
        dispatch({
            type: 'batchOperationSpace/getBatchOperationList',
            payload: {
                ...value,
            },
            callback: (res) => {
                const defaultSelected = [];
                if (res.data && res.data.length > 0) {
                    res.data.forEach((item) => {
                        defaultSelected.push(item.id);
                    });
                    this.setState({
                        selectedRows: defaultSelected,
                    });
                }
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
            filtersParam: {},
        });
    };

    // 点击下一页 或者切换某页，选择每页条数
    tableChange = (pagination) => {
        this.getTableViewList(pagination.current - 1, pagination.pageSize);
    };

    handleTableSearch = (confirmSearch, columns) => {
        confirmSearch();
        const filtersParam = {};
        if (columns[4].filteredValue.length > 0) {
            filtersParam.statusList = columns[4].filteredValue;
        }
        if (columns[5].filteredValue.length > 0) {
            filtersParam.runningStatusList = columns[5].filteredValue;
        }
        if (columns[6].filteredValue.length > 0) {
            filtersParam.managementStatus = columns[6].filteredValue;
        }

        this.setState({ filtersParam }, () => {
            this.getTableViewList(0);
        });
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

    onChange = (e) => {
        this.setState({
            radioChecked: e.target.value,
        });
    };

    beforeUpload = (file) => {
        const { locationValue } = this.state;
        if (locationValue === 'VIDEO') {
            if (file.size / 1024 > 512000) {
                message.error('上传文件不得大于500MB!');
                return false;
            }
        }
        if (locationValue === 'BACKGROUND') {
            if (file.size / 1024 > 102400) {
                message.error('上传文件不得大于100MB!');
                return false;
            }
        }
        if (locationValue === 'IMAGE') {
            if (file.size / 1024 > 10240) {
                message.error('上传文件不得大于10MB!');
                return false;
            }
        }
        return true;
    };

    handleFileChange = ({ file, fileList }) => {
        if (file.status) {
            this.setState({ fileList: fileList.slice(-1) });
        }
        if (file.status === 'done') {
            const { fileId } = this.state.fileList[0].response.data;
            this.props.form.setFieldsValue({ fileUrl: fileId });
            message.success('上传成功');
        }
        if (file.status === 'error') {
            this.setState({ fileList: [] });
            message.error('上传失败');
        }
    };

    handleRemoveFile = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/removeFile',
            payload: {
                id,
            },
            callback: () => {
                this.setState({ fileList: [] });
                this.props.form.resetFields(['fileUrl']);
            },
        });
    };

    submitAddForm = () => {
        const { form, dispatch } = this.props;
        const { fileList, selectedRows, searchParam, radioChecked } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            if (!selectedRows.length > 0) {
                message.error('数量为0无法操作');
                return;
            }
            let operationTypes;
            let name;
            let fileUrl;
            if (radioChecked === 1) {
                operationTypes = 'UPGRADE';
            }
            if (radioChecked === 2) {
                operationTypes = 'INFORMATION_PUBLISH';
                const file = fileList.length > 0 && fileList[0].response?.data;
                if (file !== undefined) {
                    name = file.fileName;
                    fileUrl = file.fileId;
                }
            }
            if (radioChecked === 3) {
                operationTypes = 'VOICE_BROADCAST';
                const file = fileList.length > 0 && fileList[0].response?.data;
                if (file !== undefined) {
                    name = file.fileName;
                    fileUrl = file.fileId;
                }
            }
            if (radioChecked === 4) {
                operationTypes = fieldsValue.operationType;
            }
            if (radioChecked === 5) {
                operationTypes = 'STATUS_SET';
            }
            if (fieldsValue.seriesId && fieldsValue.seriesId.length > 0) {
                fieldsValue.seriesId = fieldsValue.seriesId[fieldsValue.seriesId.length - 1];
            }
            const value = {
                ...fieldsValue,
                ...searchParam,
                deviceIdList: selectedRows,
                operationType: operationTypes,
                fileName: name,
                fileUrl,
            };
            dispatch({
                type: 'batchOperationSpace/addBatchOperation',
                payload: {
                    ...value,
                },
                callback: () => {
                    this.props.history.push('/equipmentManagement/batchOperation');
                },
            });
        });
    };

    // 取消弹窗
    handleCancel = () => {
        confirm({
            content: <div>确定要放弃当前操作吗？</div>,
            title: '提示',
            okText: '确定',
            cancelText: '取消',
            icon: <HxIcon type="icon-warning" className="fz24"></HxIcon>,
            onOk: () => {
                this.props.history.push('/equipmentManagement/batchOperation');
            },
            className: 'confirmStyle',
        });
    };

    seriesTypeChange = (ids) => {
        let id;
        if (ids && ids.length > 0) {
            id = ids[ids.length - 1];
        }
        const { dispatch } = this.props;
        dispatch({
            type: 'batchOperationSpace/getDestVersion',
            payload: {
                id,
            },
            callback: (res) => {
                this.setState({
                    destVersionData: res.data,
                });
            },
        });
    };

    locationChange = (value) => {
        this.setState({
            locationValue: value,
            fileList: [],
        });
    };

    parameterLimit = (rule, value, callback, min, max) => {
        const reg = new RegExp(/^[0-9]+$/);
        if (value && !reg.test(value)) {
            callback('请输入正整数');
        }
        const valueNum = parseInt(value);
        if (valueNum < min || valueNum > max) {
            callback(`请输入${min}到${max}的整数`);
        }
        callback();
    };

    getSelectedRowKeys = (selectedRowKeys) => {
        this.setState({
            selectedRows: selectedRowKeys,
        });
    };

    handleModeChange = (e) => {
        const mode = e.target.value;
        this.setState({ mode, fileList: [] }, () => {
            this.props.form.resetFields(['fileUrl']);
        });
    };

    render() {
        const {
            form: { getFieldDecorator },
            batchOperationSpace: { sceneList = [], charactersList = [] },
        } = this.props;
        const { radioChecked, selectedRows, searchParam, locationValue, seriesTreeData, destVersionData, mode } = this.state;
        const file = this.state.fileList.length > 0 && this.state.fileList[0].response?.data;
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
                // width: 106,
                ellipsis: true,
                render: (text) => {
                    return text || '--';
                },
            },
            {
                title: '系列型号',
                dataIndex: 'seriesName',
                ellipsis: true,
                render: (text) => {
                    return text || '--';
                },
            },
            {
                title: '所属客户',
                dataIndex: 'customerName',
                ellipsis: true,
                render: (text) => {
                    return text || '--';
                },
            },
            {
                title: '设备状态',
                dataIndex: 'status',
                align: 'center',
                filterType: 'multipleChoice',
                filters: this.getTypeFilters(),
                ellipsis: true,
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
                filterType: 'multipleChoice',
                filters: this.operationMonitorFilter(),
                ellipsis: true,
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
                filterType: 'multipleChoice',
                filters: this.manageStatusFilter(),
                ellipsis: true,
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
        ];
        const colSmall = [
            {
                title: '显示区域',
                dataIndex: 'displayArea',
                width: 126,
            },
            {
                title: '文件格式',
                dataIndex: 'fileFormat',
                width: 126,
            },
            {
                title: '文件大小',
                dataIndex: 'fileSize',
                width: 126,
            },
            {
                title: '备注说明',
                dataIndex: 'remark',
            },
        ];
        const dataSmall = [
            {
                displayArea: '视频区',
                fileFormat: 'ZIP',
                fileSize: '≤500M',
                remark: '名称重复覆盖原有文件，最多轮播数量20',
            },
            {
                displayArea: '状态背景',
                fileFormat: 'ZIP',
                fileSize: '≤10M',
                remark: '名称重复覆盖原有文件，最多轮播数量1',
            },
            {
                displayArea: '图片区',
                fileFormat: 'ZIP',
                fileSize: '≤10M',
                remark: '名称重复覆盖原有文件，最多轮播数量20',
            },
        ];
        const {
            batchOperationSpace: { batchOperationInfo },
            loadingSearch,
        } = this.props;
        const { data = [], pageable = {} } = batchOperationInfo;
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
        // const rowSelection = {
        //     selectedRowKeys: selectedRows,
        //     onChange: (selecte) => {
        //         this.setState({
        //             selectedRows: selecte,
        //         });
        //     },
        // };
        const Authorization = storage.getStorage('authorization');
        const clientId = storage.getStorage('clientId');
        return (
            <>
                <PageHeaderWrapper></PageHeaderWrapper>
                <BatchPageHeader titleName="批量操作"></BatchPageHeader>
                <div className="content mt12">
                    <SearchForm handleSearch={this.handleSearch} resetSearch={this.resetSearch}></SearchForm>
                </div>
                {Object.keys(searchParam).length !== 0 && data && data.length > 0 ? (
                    <div>
                        <div className="content mt12">
                            <div className="mb12 clearfix">
                                <span className="table-title">设备列表</span>
                                <span style={{ marginLeft: 8 }}>{selectedRows && selectedRows.length > 0 ? `(已选择${selectedRows.length}条)` : ''}</span>
                            </div>
                            <FilterSelectAllTable
                                rowKey={(record) => {
                                    return record.id;
                                }}
                                selectedRows={selectedRows}
                                getSelectedRowKeys={this.getSelectedRowKeys}
                                loading={loadingSearch}
                                scroll={{ x: 1100 }}
                                columns={columns}
                                dataSource={data}
                                pagination={pagination}
                                onChange={this.tableChange}
                                handleTableSearch={this.handleTableSearch}></FilterSelectAllTable>
                        </div>
                        <div className="content mt12">
                            <div className="formListAuto">
                                <Form className="m5" layout="inline" onSubmit={this.submitAddForm}>
                                    <Row gutter={20}>
                                        <Col span={24}>
                                            <FormItem label="操作类型">
                                                {getFieldDecorator('opType', {
                                                    initialValue: radioChecked,
                                                })(<Radio.Group onChange={this.onChange} options={optionStatus}></Radio.Group>)}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    {radioChecked && radioChecked === 1 && (
                                        <Row gutter={20}>
                                            <Col span={8}>
                                                <FormItem label="系列型号">
                                                    {getFieldDecorator('seriesId', {
                                                        validate: [
                                                            {
                                                                trigger: 'onChange',
                                                                rules: [validate.Rule_require],
                                                            },
                                                        ],
                                                    })(<Cascader placeholder="请选择" options={seriesTreeData} onChange={this.seriesTypeChange}></Cascader>)}
                                                </FormItem>
                                            </Col>
                                            <Col span={8}>
                                                <FormItem label="目标版本">
                                                    {getFieldDecorator('destVersionNo', {
                                                        validate: [
                                                            {
                                                                trigger: 'onChange',
                                                                rules: [validate.Rule_require],
                                                            },
                                                        ],
                                                    })(
                                                        <HxSelect placeholder="请选择">
                                                            {destVersionData.map((item) => {
                                                                return (
                                                                    <Option key={item} value={item}>
                                                                        {item}
                                                                    </Option>
                                                                );
                                                            })}
                                                        </HxSelect>,
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={8}>
                                                <div className={styles.reminder}>
                                                    <HxIcon type="icon-warning" className="fz24"></HxIcon>
                                                    <div>请确保选择系列与设备系列匹配</div>
                                                </div>
                                            </Col>
                                        </Row>
                                    )}
                                    {radioChecked && radioChecked === 2 && (
                                        <div>
                                            <Row gutter={20}>
                                                <Col span={8}>
                                                    <FormItem label="发布标题">
                                                        {getFieldDecorator('title', {
                                                            validate: [
                                                                {
                                                                    trigger: 'onChange',
                                                                    rules: [validate.Rule_require],
                                                                },
                                                            ],
                                                        })(<Input placeholder="请输入" maxLength={32}></Input>)}
                                                    </FormItem>
                                                </Col>
                                                <Col span={8}>
                                                    <FormItem label="通道类型">
                                                        {getFieldDecorator('pathTypelist', {
                                                            validate: [
                                                                {
                                                                    trigger: 'onChange',
                                                                    rules: [validate.Rule_require],
                                                                },
                                                            ],
                                                        })(<Checkbox.Group options={channelType} />)}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Row gutter={20}>
                                                <Col span={8}>
                                                    <FormItem label="显示位置">
                                                        {getFieldDecorator('location', {
                                                            validate: [
                                                                {
                                                                    trigger: 'onChange',
                                                                    rules: [validate.Rule_require],
                                                                },
                                                            ],
                                                        })(
                                                            <HxSelect placeholder="请选择" onChange={this.locationChange}>
                                                                <Option value="VIDEO">视频区</Option>
                                                                <Option value="BACKGROUND">状态背景</Option>
                                                                <Option value="IMAGE">图片区</Option>
                                                            </HxSelect>,
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                {locationValue === 'IMAGE' ? (
                                                    <Col span={8}>
                                                        <FormItem label="轮播间隔">
                                                            {getFieldDecorator('carouselinterval', {
                                                                rules: [
                                                                    {
                                                                        required: true,
                                                                        message: '该项不能为空',
                                                                    },
                                                                    {
                                                                        validator: (rule, value, callback) => {
                                                                            return this.parameterLimit(rule, value, callback, 1, 30);
                                                                        },
                                                                    },
                                                                ],
                                                                initialValue: 5,
                                                            })(
                                                                <div className="dfx">
                                                                    <Input allowClear placeholder="请输入" addonAfter="秒"></Input>
                                                                    <span className="ml5">1~30</span>
                                                                </div>,
                                                            )}
                                                        </FormItem>
                                                    </Col>
                                                ) :
                                                    ''
                                                }
                                            </Row>
                                            <Row gutter={20}>
                                                <Col span={8}>
                                                    <FormItem label="媒体文件">
                                                        {getFieldDecorator('fileUrl', {
                                                            validate: [
                                                                {
                                                                    trigger: 'onChange',
                                                                    rules: [validate.Rule_require],
                                                                },
                                                            ],
                                                        })(
                                                            file ? (
                                                                <div className={styles['file-block']}>
                                                                    <span className={styles['file-list']}>
                                                                        <Icon type="link" className={styles['file-icon']}></Icon>
                                                                        <span className={styles['file-name']}>{file.fileName}</span>
                                                                    </span>
                                                                    <span
                                                                        onClick={() => {
                                                                            return this.handleRemoveFile(file.id);
                                                                        }}
                                                                        className={`${styles['file-list-delete']} icon-delete iconfont mr8 fz14`}></span>
                                                                </div>
                                                            ) : (
                                                                <Upload
                                                                    action={`${Api.host.default}/fileservice/w/fileManage/common/file?business=SYSTEM`}
                                                                    name="file"
                                                                    accept=".zip"
                                                                    headers={{
                                                                        Authorization,
                                                                        clientId,
                                                                    }}
                                                                    onChange={this.handleFileChange}
                                                                    beforeUpload={this.beforeUpload}
                                                                    showUploadList={false}>
                                                                    <a>请选择文件</a>
                                                                </Upload>
                                                            ),
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Row gutter={20}>
                                                <Col span={16}>
                                                    <Table
                                                        rowKey={(record) => {
                                                            return record.displayArea;
                                                        }}
                                                        bordered
                                                        columns={colSmall}
                                                        pagination={false}
                                                        dataSource={dataSmall}></Table>
                                                </Col>
                                            </Row>
                                        </div>
                                    )}
                                    {radioChecked && radioChecked === 3 && (
                                        <Row gutter={20}>
                                            <Col span={8}>
                                                <FormItem label="播报场景" className="large-form-item">
                                                    {getFieldDecorator('scene', {
                                                        validate: [
                                                            {
                                                                trigger: 'onChange',
                                                                rules: [validate.Rule_require],
                                                            },
                                                        ],
                                                    })(
                                                        <Select placeholder="请选择">
                                                            {sceneList.map((item) => {
                                                                return (
                                                                    <Option value={item.code} key={item.code}>
                                                                        {item.name}
                                                                    </Option>
                                                                );
                                                            })}
                                                        </Select>,
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={8}>
                                                <FormItem label="播报模式">
                                                    {getFieldDecorator('mode', {
                                                        rules: [validate.Rule_require],
                                                        initialValue: 'INTERNAL',
                                                    })(
                                                        <Radio.Group onChange={this.handleModeChange}>
                                                            {enums.voiceBroadcastMode.map((item) => {
                                                                return (
                                                                    <Radio value={item.code} key={item.code}>
                                                                        {item.name}
                                                                    </Radio>
                                                                );
                                                            })}
                                                        </Radio.Group>,
                                                    )}
                                                </FormItem>
                                            </Col>
                                            {mode !== 'CUSTOMIZE' ? (
                                                <Col span={8}>
                                                    <FormItem label="播报文字">
                                                        {getFieldDecorator('characters', {
                                                            rules: [validate.Rule_require],
                                                        })(
                                                            <Select placeholder="请选择" allowClear>
                                                                {charactersList.map((characters) => {
                                                                    return (
                                                                        <Option key={characters.code} value={characters.code}>
                                                                            {characters.name}
                                                                        </Option>
                                                                    );
                                                                })}
                                                            </Select>,
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            ) : (
                                                <Col span={8}>
                                                    <FormItem label="媒体文件">
                                                        {getFieldDecorator('voicebroadcastFileUrl', {
                                                            rules: [validate.Rule_require],
                                                        })(
                                                            file ? (
                                                                <div className={styles['file-block']}>
                                                                    <span className={styles['file-list']}>
                                                                        <Icon type="link" className={styles['file-icon']}></Icon>
                                                                        <span className={styles['file-name']}>{file.fileName}</span>
                                                                    </span>
                                                                    <span
                                                                        onClick={() => {
                                                                            return this.handleRemoveFile(file.fileId);
                                                                        }}
                                                                        className={`${styles['file-list-delete']} icon-delete iconfont mr8 fz14`}></span>
                                                                </div>
                                                            ) : (
                                                                <Upload
                                                                    action={`${Api.host.default}/fileservice/w/fileManage/common/file?business=SYSTEM`}
                                                                    name="file"
                                                                    accept=".wav"
                                                                    headers={{
                                                                        Authorization,
                                                                        clientId,
                                                                    }}
                                                                    onChange={this.handleFileChange}
                                                                    beforeUpload={this.beforeUpload}
                                                                    showUploadList={false}>
                                                                    <Button type="link">请选择文件</Button>
                                                                </Upload>
                                                            ),
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            )}
                                        </Row>
                                    )}
                                    {radioChecked && radioChecked === 4 && (
                                        <Row gutter={20}>
                                            <Col span={8}>
                                                <FormItem label="控制类型">
                                                    {getFieldDecorator('operationType', {
                                                        validate: [
                                                            {
                                                                trigger: 'onChange',
                                                                rules: [validate.Rule_require],
                                                            },
                                                        ],
                                                    })(
                                                        <HxSelect placeholder="请选择">
                                                            <Option value="REBOOT">远程重启</Option>
                                                            <Option value="OPEN">远程开闸</Option>
                                                            <Option value="CLOSE">远程关闸</Option>
                                                        </HxSelect>,
                                                    )}
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    )}
                                    {radioChecked && radioChecked === 5 && (
                                        <Row gutter={20}>
                                            <Col span={6}>
                                                <FormItem label="管理状态">
                                                    {getFieldDecorator('managementStatus', {
                                                        validate: [
                                                            {
                                                                trigger: 'onChange',
                                                                rules: [validate.Rule_require],
                                                            },
                                                        ],
                                                        initialValue: 'ENABLE',
                                                    })(
                                                        <Radio.Group>
                                                            <Radio value="ENABLE">启用</Radio>
                                                            <Radio value="DISABLE">禁用</Radio>
                                                        </Radio.Group>,
                                                    )}
                                                </FormItem>
                                            </Col>
                                            <Col span={8}>
                                                <div className={styles.reminder}>
                                                    <HxIcon type="icon-ask" className="fz24"></HxIcon>
                                                    <div>设置禁用后，该设备不可用</div>
                                                </div>
                                            </Col>
                                        </Row>
                                    )}
                                    <div style={{ overflow: 'hidden' }}>
                                        <div className="fr">
                                            <Button className="bg-button-reset" onClick={this.handleCancel}>
                                                <span className="fz14">取消</span>
                                            </Button>
                                            <Button className="ml8" type="primary" htmlType="submit">
                                                <span className="fz14">确定</span>
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="content mt12 dfx dfx-aic dfx-jcc flex-1">请选择查询条件筛选所要批量操作的设备</div>
                )}
            </>
        );
    }
}

export default Setting;
