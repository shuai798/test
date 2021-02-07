import { Row, Col, Form, Input, Button, Table, Modal, Select } from 'antd';
import React from 'react';
import { connect } from 'dva';
import validate from '@/utils/validation';
import { HxTreeSelect, HxSelect } from '@/components/hx-components/index';
import PageHeaderWrapper from '@/components/breadcrumb';
import { router } from 'umi';
import indexStyle from '../index.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ deviceAssignment, loading }) => {
    return {
        deviceAssignment,
        loadingAdd: loading.effects['deviceAssignment/batchAddDeviceAssignment'],
    };
})
@Form.create()
class AddForm extends React.Component {
    columns = [
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
            title: '设备编码',
            dataIndex: 'no',
        },
        {
            title: '控制器编码',
            dataIndex: 'controllerNo',
        },
        {
            title: '系列型号',
            dataIndex: 'seriesName',
        },
        {
            title: '分配对象',
            dataIndex: 'distributionObjectName',
        },
        {
            title: '操作',
            dataIndex: 'id',
            render: (text, record) => {
                return (
                    <div>
                        <a
                            className="link-delete"
                            onClick={() => {
                                return this.deleteItem(record);
                            }}>
                            删除
                        </a>
                    </div>
                );
            },
            width: 150,
        },
    ];

    constructor(props) {
        super(props);
        this.state = {
            tableKey: 0,
            seriesTreeData: [],
            addList: [],
            customerList: [],
            distributionObjectType: '',
            seriesName: '',
            distributionObjectName: '',
            deviceNoList: [],
        };
    }

    componentDidMount() {
        this.getSeriesTree();
        this.getCustomerList();
    }

    getSeriesTree = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceAssignment/getSeriesTree',
            callback: () => {
                const {
                    deviceAssignment: { seriesTree = [] },
                } = this.props;
                const seriesTreeData = this.changeDataToTreeSelect(seriesTree, '');
                this.setState({ seriesTreeData });
            },
        });
    };

    getCustomerList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceAssignment/getCustomerList',
        });
    };

    changeDataToTreeSelect = (dataList, name) => {
        const list = dataList;
        if (list.length > 0) {
            for (let i = 0; i < list.length; i += 1) {
                list[i].value = list[i].id;
                list[i].title = list[i].name;
                // 用于回显全路径
                list[i].newValue = name !== '' ? `${name} / ${list[i].name}` : list[i].name;
                if (list[i].children && list[i].children.length > 0) {
                    list[i].disabled = true;
                    list[i].children = this.changeDataToTreeSelect(list[i].children, list[i].newValue);
                } else {
                    list[i].children = null;
                }
            }
        }
        return list;
    };

    addItem = () => {
        const { form } = this.props;
        const { addList, distributionObjectType, distributionObjectName, seriesName } = this.state;
        let { tableKey } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            tableKey += 1;
            const item = {
                ...fieldsValue,
                type: distributionObjectType,
                distributionObjectName,
                seriesName,
                tableKey,
            };
            addList.push(item);
            this.setState({
                addList,
                tableKey,
            });
            form.resetFields(['no', 'controllerNo']);
        });
    };

    deleteItem = (record) => {
        let { addList } = this.state;
        addList = addList.filter((item) => {
            return item.tableKey !== record.tableKey;
        });
        this.setState({ addList });
    };

    cancelSubmit = () => {
        router.push('/equipmentManagement/deviceAssignment');
    };

    submit = () => {
        const { addList } = this.state;
        if (addList.length === 0) {
            Modal.info({
                title: '提示',
                content: (
                    <div>
                        <p>您还未添加任何数据</p>
                    </div>
                ),
                onOk: () => {},
                okText: '我知道了',
                centered: true,
            });
        } else {
            const { dispatch } = this.props;
            dispatch({
                type: 'deviceAssignment/batchAddDeviceAssignment',
                payload: addList,
                callback: () => {
                    this.cancelSubmit();
                },
            });
        }
    };

    handleSearch = (value) => {
        if (value) {
            this.fetch(value, (data) => {
                return this.setState({ customerList: data });
            });
        } else {
            this.setState({ customerList: [] });
        }
    };

    fetch = (value, callback) => {
        let {
            deviceAssignment: { customerList = [] },
        } = this.props;
        customerList = customerList.filter((customer) => {
            return customer.name.indexOf(value) > -1;
        });
        callback(customerList);
    };

    handleChangeCustomer = (customerId, event) => {
        if (!customerId) {
            this.setState({
                customerList: [],
                distributionObjectType: '',
                distributionObjectName: '',
            });
        } else {
            const {
                props: { type, name },
            } = event;
            this.setState({
                distributionObjectType: type,
                distributionObjectName: name,
            });
        }
    };

    handleChangeSeries = (seriesId, seriesName) => {
        if (seriesId) {
            this.setState({ seriesName: seriesName[0] });
            this.getDeviceNoListBySeriesId(seriesId);
        } else {
            this.setState({ deviceNoList: [] });
        }
        this.props.form.resetFields(['no']);
    };

    getDeviceNoListBySeriesId = (seriesId) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceAssignment/getDeviceNoListBySeriesId',
            payload: { seriesId },
            callback: () => {
                const { deviceNoList = [] } = this.props.deviceAssignment;
                this.setState({ deviceNoList });
            },
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { seriesTreeData = [], addList = [], customerList = [], deviceNoList = [] } = this.state;
        const options = customerList.map((customer) => {
            return (
                <Option key={customer.id} value={customer.id} type={customer.type} name={customer.name}>
                    {customer.name}
                </Option>
            );
        });
        return (
            <div>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <div className="formList120">
                        <Form onSubmit={this.addItem}>
                            <Row type="flex" gutter={20}>
                                <Col md={8} sm={24}>
                                    <FormItem label="分配对象">
                                        {getFieldDecorator('distributionObjectId', {
                                            rules: [validate.Rule_require],
                                        })(
                                            <HxSelect showSearch placeholder="请输入" defaultActiveFirstOption={false} showArrow={false} filterOption={false} onSearch={this.handleSearch} notFoundContent={null} allowClear onChange={this.handleChangeCustomer}>
                                                {options}
                                            </HxSelect>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={8} sm={24}>
                                    <FormItem label="系列型号">
                                        {getFieldDecorator('seriesId', {
                                            rules: [validate.Rule_require],
                                        })(<HxTreeSelect treeData={seriesTreeData} placeholder="请选择" showSearch treeNodeLabelProp="newValue" treeNodeFilterProp="title" dropdownClassName={indexStyle['over-ant-select-tree']} allowClear onChange={this.handleChangeSeries}></HxTreeSelect>)}
                                    </FormItem>
                                </Col>
                                <Col md={8} sm={24}>
                                    <FormItem label="设备编码">
                                        {getFieldDecorator('no', {
                                            rules: [validate.Rule_require],
                                        })(
                                            <HxSelect showSearch placeholder="请选择" allowClear>
                                                {deviceNoList.map((deviceNo) => {
                                                    return (
                                                        <Option key={deviceNo.id} value={deviceNo.no}>
                                                            {deviceNo.no}
                                                        </Option>
                                                    );
                                                })}
                                            </HxSelect>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col md={8} sm={24}>
                                    <FormItem label="控制器编码">
                                        {getFieldDecorator('controllerNo', {
                                            rules: [validate.Rule_require],
                                        })(<Input placeholder="请输入" allowClear autoComplete="off"></Input>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <div style={{ overflow: 'hidden' }}>
                                <div className="fr">
                                    <Button type="primary" htmlType="submit">
                                        <span className="iconfont icon-add mr8 fz14"></span>添加
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
                <div className="content mt20">
                    <div className="mb20 clearfix">
                        <span className="table-title">待分配</span>
                    </div>
                    <Table
                        rowKey="tableKey"
                        scroll={{ x: 1100 }}
                        columns={this.columns}
                        dataSource={addList}
                        pagination={false}
                        locale={{
                            emptyText: (
                                <div className="fz12 mt20 mb20">
                                    请选择分配对象、系列型号（最末级节点）、输入设备编码后点击“添加”或按下回车键
                                    <br />
                                    快速添加完成后，点击页面右下角“确定”键完成提交
                                </div>
                            ),
                        }}></Table>
                    <div className="text-right mt20">
                        <Button onClick={this.cancelSubmit} className="mr8">
                            取消
                        </Button>
                        <Button type="primary" onClick={this.submit}>
                            确定
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddForm;
