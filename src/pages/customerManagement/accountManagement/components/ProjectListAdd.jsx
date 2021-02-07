import React from 'react';
import { Form, Row, Col, Input, Modal, Select, Spin } from 'antd';
import { connect } from 'dva';
import Roule from '@/utils/validation';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ loading, customerManagement, projectList }) => {
    return {
        customerManagement,
        projectList,
        addLoading: loading.effects['projectList/addTableInfo'],
        editLoading: loading.effects['projectList/editTableInfo'],
        detailsLoading: loading.effects['customerManagement/getAreaInfo'],
    };
})
class ProjectListAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            areaFirstList: [],
            areaSecondList: [],
            areaThirdList: [],
            areaId: '',
            projectList: {},
            cityCode: '',
            provinceCode: '',
        };
    }

    componentWillMount() {
        const { dispatch, record } = this.props;
        if (record) {
            dispatch({
                type: 'projectList/getDetailRecord',
                payload: { id: record && record.id ? record.id : '' },
                callback: (res) => {
                    this.setState(
                        {
                            projectList: res.data,
                        },
                        () => {
                            dispatch({
                                type: 'customerManagement/getAreaInfo',
                                callback: (res1) => {
                                    this.setState(
                                        {
                                            areaFirstList: res1.data,
                                        },
                                        () => {
                                            const { projectList } = this.state;
                                            dispatch({
                                                type: 'customerManagement/getAreaInfo',
                                                payload: {
                                                    parentCode: projectList.provinceCode,
                                                },
                                                callback: (res2) => {
                                                    this.setState(
                                                        {
                                                            areaSecondList: res2.data,
                                                        },
                                                        () => {
                                                            dispatch({
                                                                type: 'customerManagement/getAreaInfo',
                                                                payload: {
                                                                    parentCode: projectList.cityCode,
                                                                },
                                                                callback: (res3) => {
                                                                    this.setState({
                                                                        areaThirdList: res3.data,
                                                                    });
                                                                },
                                                            });
                                                        },
                                                    );
                                                },
                                            });
                                        },
                                    );
                                },
                            });
                        },
                    );
                },
            });
        } else {
            dispatch({
                type: 'customerManagement/getAreaInfo',
                callback: (res) => {
                    this.setState({
                        areaFirstList: res.data,
                    });
                },
            });
        }
    }

    editShow = () => {
        const { form, dispatch, toProjectListAdd, customerInfo, record } = this.props;
        const { areaId, cityCode, provinceCode } = this.state;
        if (record) {
            // 编辑
            form.validateFields((err, fieldsValue) => {
                if (err) {
                    return;
                }
                delete fieldsValue.areaName;
                fieldsValue = {
                    ...fieldsValue,
                    areaId: areaId || record.areaId,
                    cityCode,
                    provinceCode,
                    customerId: customerInfo.id,
                };
                dispatch({
                    type: 'projectList/editTableInfo',
                    payload: {
                        ...fieldsValue,
                        id: record.id,
                    },
                    callback: () => {
                        toProjectListAdd();
                    },
                });
            });
        } else {
            // 新增
            form.validateFields((err, fieldsValue) => {
                if (err) {
                    return;
                }
                delete fieldsValue.areaName;
                fieldsValue = {
                    ...fieldsValue,
                    areaId,
                    cityCode,
                    provinceCode,
                    customerId: customerInfo.id,
                };
                dispatch({
                    type: 'projectList/addTableInfo',
                    payload: {
                        ...fieldsValue,
                    },
                    callback: () => {
                        toProjectListAdd();
                    },
                });
            });
        }
    };

    // 获取市
    getSecondList = (e) => {
        this.props.form.setFieldsValue({
            cityCode: undefined,
            areaId: undefined,
        });
        this.setState(
            {
                provinceCode: e,
            },
            () => {
                if (e) {
                    const { dispatch } = this.props;
                    dispatch({
                        type: 'customerManagement/getAreaInfo',
                        payload: {
                            parentCode: e,
                        },
                        callback: (res) => {
                            this.setState({
                                areaSecondList: res.data,
                                areaThirdList: [],
                            });
                        },
                    });
                } else {
                    this.setState({
                        areaSecondList: [],
                        areaThirdList: [],
                    });
                }
            },
        );
    };

    // 获取县
    getThirdList = (e) => {
        this.props.form.setFieldsValue({ areaId: undefined });
        this.setState(
            {
                cityCode: e,
            },
            () => {
                if (e) {
                    const { dispatch } = this.props;
                    dispatch({
                        type: 'customerManagement/getAreaInfo',
                        payload: {
                            parentCode: e,
                        },
                        callback: (res) => {
                            this.setState({
                                areaThirdList: res.data,
                            });
                        },
                    });
                } else {
                    this.setState({ areaThirdList: [] });
                }
            },
        );
    };

    getareaId = (e) => {
        this.setState({ areaId: e });
    };

    validateAreaName = (rule, value, callback) => {
        const {
            form: { getFieldValue },
        } = this.props;
        //  获取地理位置县的值
        const countyValue = getFieldValue('areaId');
        if (!countyValue) {
            callback('该项不能为空');
        }
        callback();
    };

    render() {
        const {
            form: { getFieldDecorator },
            toProjectListAdd,
            record,
            addLoading,
            editLoading,
            detailsLoading,
        } = this.props;
        const { areaFirstList, areaSecondList, areaThirdList } = this.state;
        return (
            <Modal title={record?.id ? '编辑项目' : '新增项目'} width={832} centered maskClosable={false} visible destroyOnClose confirmLoading={record?.id ? editLoading : addLoading} onOk={this.editShow} onCancel={toProjectListAdd}>
                <Spin spinning={detailsLoading}>
                    <div className="formList80">
                        <Form>
                            <Row type="flex" gutter={20}>
                                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="项目名称">
                                        {getFieldDecorator('name', {
                                            initialValue: record && record.name ? record.name : undefined,
                                            rules: [Roule.Rule_require, { validator: Roule.Rule_name }],
                                        })(<Input allowClear autoComplete="off" placeholder="请输入" maxLength={20}></Input>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <FormItem label="地理位置" required>
                                {getFieldDecorator('areaName', {
                                    rules: [
                                        {
                                            validator: (rule, value, callback) => {
                                                this.validateAreaName(rule, value, callback);
                                            },
                                        },
                                    ],
                                })(
                                    <Row type="flex" gutter={20}>
                                        <Col span={8} className="pr4">
                                            <FormItem>
                                                {getFieldDecorator('provinceCode', {
                                                    rules: [
                                                        {
                                                            validator: (rule, value, callback) => {
                                                                this.props.form.validateFields(['areaName'], { force: true });
                                                                callback();
                                                            },
                                                        },
                                                    ],
                                                })(
                                                    <Select placeholder="请选择" allowClear onChange={this.getSecondList}>
                                                        {areaFirstList.map((item) => {
                                                            return (
                                                                <Option key={item.code} value={item.code}>
                                                                    {item.name}
                                                                </Option>
                                                            );
                                                        })}
                                                    </Select>,
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={8} className="pr4 pl4">
                                            <FormItem>
                                                {getFieldDecorator('cityCode', {
                                                    rules: [
                                                        {
                                                            validator: (rule, value, callback) => {
                                                                this.props.form.validateFields(['areaName'], { force: true });
                                                                callback();
                                                            },
                                                        },
                                                    ],
                                                })(
                                                    <Select placeholder="请选择" allowClear onChange={this.getThirdList}>
                                                        {areaSecondList.map((item) => {
                                                            return (
                                                                <Option key={item.code} value={item.code}>
                                                                    {item.name}
                                                                </Option>
                                                            );
                                                        })}
                                                    </Select>,
                                                )}
                                            </FormItem>
                                        </Col>
                                        <Col span={8} className="pr4 pl4">
                                            <FormItem>
                                                {getFieldDecorator('areaId', {
                                                    rules: [
                                                        {
                                                            validator: (rule, value, callback) => {
                                                                this.props.form.validateFields(['areaName'], { force: true });
                                                                callback();
                                                            },
                                                        },
                                                    ],
                                                })(
                                                    <Select placeholder="请选择" allowClear onChange={this.getareaId}>
                                                        {areaThirdList.map((item) => {
                                                            return (
                                                                <Option key={item.id} value={item.id}>
                                                                    {item.name}
                                                                </Option>
                                                            );
                                                        })}
                                                    </Select>,
                                                )}
                                            </FormItem>
                                        </Col>
                                    </Row>,
                                )}
                            </FormItem>
                        </Form>
                    </div>
                </Spin>
            </Modal>
        );
    }
}

export default ProjectListAdd;
