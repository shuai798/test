import React from 'react';
import { Form, Row, Col, Input, Modal, Select, Divider, Button } from 'antd';
import { connect } from 'dva';
import zhCN from '@/i18n/zh-CN/zhCN';
import validate from '@/utils/validation';
import { HxSelect } from '@/components/hx-components';
import indexStyle from '../index.less';

const FormItem = Form.Item;
const { Option } = Select;
let id = 0;

@Form.create()
@connect(({ loading, customerManagement }) => {
    return {
        customerManagement,
        addLoading: loading.effects['customerManagement/addTableInfo'],
    };
})
class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            areaFirstList: [],
            areaSecondList: [[]],
            areaThirdList: [[]],
            areaId: [],
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'customerManagement/getAreaInfo',
            callback: (res) => {
                this.setState({
                    areaFirstList: res.data,
                });
            },
        });
    }

    editShow = () => {
        const { form, dispatch, toAddForm, userInfo } = this.props;
        const { areaId } = this.state;
        form.validateFields((err, fieldsValue) => {
            const customerProjectList = [];
            fieldsValue.projectName.map((item, index) => {
                return customerProjectList.push({
                    name: item,
                    areaId: areaId[index],
                });
            });
            delete fieldsValue.projectName;
            delete fieldsValue.areaName;
            delete fieldsValue.keys;
            fieldsValue = {
                ...fieldsValue,
                organizationId: userInfo.orgId,
                customerProjectList,
            };
            if (err) {
                return;
            }
            dispatch({
                type: 'customerManagement/addTableInfo',
                payload: {
                    ...fieldsValue,
                },
                callback: () => {
                    toAddForm();
                },
            });
        });
    };

    editCancel = () => {
        this.props.toAddForm();
    };

    // 删除
    remove = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }
        form.setFieldsValue({
            keys: keys.filter((key) => {
                return key !== k;
            }),
        });
    };

    // 添加
    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id += 1);
        form.setFieldsValue({
            keys: nextKeys,
        });
        const { areaSecondList, areaThirdList } = this.state;
        areaSecondList.push([]);
        areaThirdList.push([]);
        this.setState({
            areaSecondList,
            areaThirdList,
        });
    };

    // 获取市
    getSecondList = (k, e) => {
        const { dispatch, form } = this.props;
        const { areaSecondList, areaThirdList } = this.state;
        form.resetFields(`areaSecondId[${k}]`);
        form.resetFields(`areaThirdId[${k}]`);
        form.resetFields(`areaThirdId[${k}]`);
        if (e) {
            dispatch({
                type: 'customerManagement/getAreaInfo',
                payload: {
                    parentCode: e,
                },
                callback: (res) => {
                    const value = areaSecondList;
                    value[k] = res.data;
                    this.setState({
                        areaSecondList: value,
                    });
                },
            });
        } else {
            areaSecondList[k] = [];
            areaThirdList[k] = [];
            this.setState({
                areaSecondList,
                areaThirdList,
            });
        }
    };

    // 获取县
    getThirdList = (k, e) => {
        const { dispatch, form } = this.props;
        const { areaThirdList } = this.state;
        form.resetFields(`areaThirdId[${k}]`);
        if (e) {
            dispatch({
                type: 'customerManagement/getAreaInfo',
                payload: {
                    parentCode: e,
                },
                callback: (res) => {
                    const value = areaThirdList;
                    value[k] = res.data;
                    this.setState({
                        areaThirdList: value,
                    });
                },
            });
        } else {
            areaThirdList[k] = [];
            this.setState({
                areaThirdList,
            });
        }
    };

    getareaId = (k, e) => {
        const { areaId } = this.state;
        areaId.push(e);
    };

    validateAreaName = (rule, value, callback, index) => {
        const {
            form: { getFieldValue },
        } = this.props;
        //  获取地理位置县的值
        const countyValue = getFieldValue(`areaThirdId[${index}]`);
        if (!countyValue) {
            callback('该项不能为空');
        }
        callback();
    };

    render() {
        const {
            customerManagement: { industryTypeList },
            form: { getFieldDecorator, getFieldValue },
            addLoading,
            userInfo,
        } = this.props;
        const { areaFirstList, areaSecondList, areaThirdList } = this.state;
        getFieldDecorator('keys', { initialValue: [0] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            return (
                <Row key={k}>
                    <div className="border"></div>
                    <div className={indexStyle.subheadBox}>
                        <Divider type="vertical" className={indexStyle['divider-title']}></Divider>
                        <span className={indexStyle.subhead}>项目信息</span>
                        <div className="fr">
                            {index === 0 ? (
                                <Button onClick={this.add}>
                                    <span className="iconfont icon-add mr8 fz14"></span>追加项目
                                </Button>
                            ) : null}
                            {index > 0 ? (
                                <Button
                                    type="danger"
                                    ghost
                                    onClick={() => {
                                        return this.remove(k);
                                    }}>
                                    <span className="iconfont icon-delete mr8 fz14"></span>删除项目
                                </Button>
                            ) : null}
                        </div>
                    </div>
                    <Row
                        type="flex"
                        gutter={{
                            md: 8,
                            lg: 12,
                            xl: 24,
                        }}>
                        <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                            <FormItem label="项目名称">
                                {getFieldDecorator(`projectName[${k}]`, {
                                    rules: [
                                        {
                                            required: true,
                                            whitespace: true,
                                            message: '该项不能为空',
                                        },
                                        {
                                            validator: validate.Rule_name,
                                        },
                                    ],
                                })(<Input allowClear autoComplete="off" placeholder="请输入" maxLength={20}></Input>)}
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem label="地理位置" required>
                        {getFieldDecorator(`areaName[${k}]`, {
                            rules: [
                                {
                                    validator: (rule, value, callback) => {
                                        this.validateAreaName(rule, value, callback, k);
                                    },
                                },
                            ],
                        })(
                            <Row
                                type="flex"
                                gutter={{
                                    md: 8,
                                    lg: 12,
                                    xl: 24,
                                }}>
                                <Col span={8} className="pr4">
                                    <FormItem>
                                        {getFieldDecorator(`areaFirstId[${k}]`, {
                                            rules: [
                                                {
                                                    validator: (rule, value, callback) => {
                                                        this.props.form.validateFields([`areaName[${k}]`], { force: true });
                                                        callback();
                                                    },
                                                },
                                            ],
                                        })(
                                            <HxSelect
                                                placeholder="请选择"
                                                allowClear
                                                onChange={(e) => {
                                                    this.getSecondList(k, e);
                                                }}>
                                                {areaFirstList.map((item) => {
                                                    return (
                                                        <Option key={item.code} value={item.code}>
                                                            {item.name}
                                                        </Option>
                                                    );
                                                })}
                                            </HxSelect>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8} className="pr4 pl4">
                                    <FormItem>
                                        {getFieldDecorator(`areaSecondId[${k}]`, {
                                            rules: [
                                                {
                                                    validator: (rule, value, callback) => {
                                                        this.props.form.validateFields([`areaName[${k}]`], { force: true });
                                                        callback();
                                                    },
                                                },
                                            ],
                                        })(
                                            <HxSelect
                                                placeholder="请选择"
                                                allowClear
                                                onChange={(e) => {
                                                    this.getThirdList(k, e);
                                                }}>
                                                {areaSecondList[k].map((item) => {
                                                    return (
                                                        <Option key={item.code} value={item.code}>
                                                            {item.name}
                                                        </Option>
                                                    );
                                                })}
                                            </HxSelect>,
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={8} className="pr4 pl4">
                                    <FormItem>
                                        {getFieldDecorator(`areaThirdId[${k}]`, {
                                            rules: [
                                                {
                                                    validator: (rule, value, callback) => {
                                                        this.props.form.validateFields([`areaName[${k}]`], { force: true });
                                                        callback();
                                                    },
                                                },
                                            ],
                                        })(
                                            <HxSelect
                                                placeholder="请选择"
                                                allowClear
                                                onChange={(e) => {
                                                    this.getareaId(k, e);
                                                }}>
                                                {areaThirdList[k].map((item) => {
                                                    return (
                                                        <Option key={item.id} value={item.id}>
                                                            {item.name}
                                                        </Option>
                                                    );
                                                })}
                                            </HxSelect>,
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>,
                        )}
                    </FormItem>
                </Row>
            );
        });
        return (
            <Modal className={indexStyle.modalBoay} width={832} centered title="新增客户" visible destroyOnClose maskClosable={false} confirmLoading={addLoading} onOk={this.editShow} onCancel={this.editCancel}>
                <div className="formList88">
                    <Form>
                        <Row
                            type="flex"
                            gutter={{
                                md: 8,
                                lg: 12,
                                xl: 24,
                            }}>
                            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                <FormItem label="所属组织">{userInfo.orgName}</FormItem>
                            </Col>
                            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                <FormItem label="客户名称">
                                    {getFieldDecorator('name', {
                                        rules: [validate.Rule_require, { validator: validate.Rule_name }],
                                    })(<Input allowClear autoComplete="off" placeholder="请输入" maxLength={20}></Input>)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row
                            type="flex"
                            gutter={{
                                md: 8,
                                lg: 12,
                                xl: 24,
                            }}>
                            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                <FormItem label="行业类型">
                                    {getFieldDecorator('industryType', {
                                        rules: [validate.Rule_require],
                                    })(
                                        <HxSelect
                                            showSearch
                                            placeholder="请选择"
                                            allowClear
                                            filterOption={(input, option) => {
                                                return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                            }}>
                                            {(industryTypeList || []).map((item) => {
                                                return (
                                                    <Option key={item.code} value={item.code}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                        </HxSelect>,
                                    )}
                                </FormItem>
                            </Col>
                            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                <FormItem label="人员规模">
                                    {getFieldDecorator('staffSize', {
                                        rules: [validate.Rule_require],
                                    })(
                                        <HxSelect placeholder="请选择" allowClear>
                                            {zhCN.staffSizeType.map((item) => {
                                                return (
                                                    <Option key={item.code} value={item.code}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                        </HxSelect>,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        {formItems}
                    </Form>
                </div>
            </Modal>
        );
    }
}

export default Add;
