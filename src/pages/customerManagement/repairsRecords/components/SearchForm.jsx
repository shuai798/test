import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col, Icon, Input, Select, Cascader } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
let timeout;
let currentValue;

@connect(({ inspectionStandard }) => {
    return {
        inspectionStandard,
    };
})
@Form.create()
class Curd extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expandForm: false,
            treeData: [],
            locationData: [],
            customerData: [],
        };
    }

    componentDidMount() {
        this.getTreeData();
        this.getLocationData();
    }

    getTreeData = () => {
        const { dispatch } = this.props;
        const { orgId } = JSON.parse(localStorage.getItem('userInfo'));
        dispatch({
            type: 'organizationChartSpace/getTableListInfo',
            payload: {
                orgId,
            },
            callback: (res) => {
                const list = res || [];
                this.changeDataToTreeSelect(list);
                this.setState({
                    treeData: list,
                });
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

    changeCityData = (dataList) => {
        const list = dataList;
        if (list.length > 0) {
            for (let i = 0; i < list.length; i += 1) {
                list[i].key = list[i].code;
                list[i].label = list[i].name;
                list[i].value = list[i].code;
                if (list[i].childrenList && list[i].childrenList.length > 0) {
                    list[i].children = this.changeCityData(list[i].childrenList, list[i].newValue);
                } else {
                    list[i].children = null;
                }
            }
        }
        return list;
    };

    // 获取地理位置
    getLocationData = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'pendingEventSpace/getLocationData',
            callback: (res) => {
                const list = res.data || [];
                this.changeCityData(list);
                this.setState({
                    locationData: list,
                });
            },
        });
    };

    handleFormSearch = (e) => {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, value) => {
            if (err) {
                return;
            }
            let values = {};
            if (value.areaParamCode && value.areaParamCode.length > 1) {
                value.areaParamCode = value.areaParamCode[value.areaParamCode.length - 1];
            }
            if (value.orgParamId && value.orgParamId.length > 1) {
                value.orgParamId = value.orgParamId[value.orgParamId.length - 1];
            }
            values = {
                ...value,
            };
            const params = {
                ...values,
            };
            this.props.handleSearch(params);
        });
    };

    handleFormReset = () => {
        const { form } = this.props;
        form.resetFields();
        this.props.resetSearch();
    };

    toggleForm = () => {
        this.setState((preState) => {
            return { expandForm: !preState.expandForm };
        });
    };

    fetch = (value, callback) => {
        const { dispatch } = this.props;
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        currentValue = value;

        function fake() {
            dispatch({
                type: 'deviceList/getCustomerList',
                callback: (res) => {
                    if (currentValue === value) {
                        const result = res.data;
                        const data = [];
                        result.forEach((item) => {
                            if (item.name.indexOf(value) !== -1) {
                                data.push({
                                    text: item.name,
                                    value: item.id,
                                });
                            }
                        });
                        callback(data);
                    }
                },
            });
        }

        timeout = setTimeout(fake, 300);
    };

    customerSearch = (value) => {
        if (value) {
            this.fetch(value, (data) => {
                return this.setState({ customerData: data });
            });
        } else {
            this.setState({ customerData: [] });
        }
    };

    customerChange = (value) => {
        if (!value) {
            this.setState({
                customerData: [],
            });
        }
    };

    renderCommonForm = () => {
        const {
            form: { getFieldDecorator },
        } = this.props;
        const { treeData, locationData, customerData } = this.state;
        const options = customerData.map((data) => {
            return (
                <Option key={data.value} value={data.value}>
                    {data.text}
                </Option>
            );
        });
        return (
            <>
                <Col span={8}>
                    <FormItem label="所属组织">{getFieldDecorator('orgParamId')(<Cascader options={treeData} changeOnSelect />)}</FormItem>
                </Col>
                <Col span={8}>
                    <FormItem label="所属客户">
                        {getFieldDecorator('customerParamId')(
                            <Select showSearch allowClear placeholder="请输入" defaultActiveFirstOption={false} showArrow notFoundContent={null} filterOption={false} onSearch={this.customerSearch} onChange={this.customerChange}>
                                {options}
                            </Select>,
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem label="地理位置">{getFieldDecorator('areaParamCode')(<Cascader options={locationData} changeOnSelect />)}</FormItem>
                </Col>
            </>
        );
    };

    renderSimpleForm() {
        return (
            <Form layout="inline" onSubmit={this.handleFormSearch}>
                <Row type="flex" gutter={20}>
                    {this.renderCommonForm()}
                </Row>
                <div style={{ overflow: 'hidden' }}>
                    <div className="fr">
                        <Button type="primary" htmlType="submit">
                            <span className="iconfont icon-search mr8 fz14"></span>
                            查询
                        </Button>
                        <Button className="ml8 bg-button-reset" onClick={this.handleFormReset}>
                            <span className="iconfont icon-reset mr8 fz14"></span>
                            重置
                        </Button>
                        <a className="ml32 fz14" onClick={this.toggleForm}>
                            更多条件 <Icon type="down"></Icon>
                        </a>
                    </div>
                </div>
            </Form>
        );
    }

    // 展开后的样式
    renderAdvancedForm() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <Form layout="inline" onSubmit={this.handleFormSearch}>
                <Row type="flex" gutter={20}>
                    {this.renderCommonForm()}
                    <Col span={8}>
                        <FormItem label="联系人">{getFieldDecorator('contactName')(<Input allowClear placeholder="请输入"></Input>)}</FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="联系电话">{getFieldDecorator('contactMobile')(<Input allowClear placeholder="请输入"></Input>)}</FormItem>
                    </Col>
                </Row>
                <div style={{ overflow: 'hidden' }}>
                    <div className="fr">
                        <Button type="primary" htmlType="submit">
                            <span className="iconfont icon-search mr8 fz14"></span>
                            查询
                        </Button>
                        <Button className="ml8 bg-button-reset" onClick={this.handleFormReset}>
                            <span className="iconfont icon-reset mr8 fz14"></span>
                            重置
                        </Button>
                        <a className="ml32 fz14" onClick={this.toggleForm}>
                            收起 <Icon type="up" />
                        </a>
                    </div>
                </div>
            </Form>
        );
    }

    render() {
        const { expandForm } = this.state;
        return <div className="formList80">{expandForm ? this.renderAdvancedForm() : this.renderSimpleForm()}</div>;
    }
}

export default Curd;
