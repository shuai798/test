import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col, Select, Cascader } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
let timeout;
let currentValue;

@connect()
@Form.create()
class Curd extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
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
            if (value.areaCode && value.areaCode.length > 1) {
                value.areaCode = value.areaCode[value.areaCode.length - 1];
            }
            if (value.organizationId && value.organizationId.length > 1) {
                value.organizationId = value.organizationId[value.organizationId.length - 1];
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

    render() {
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
            <div className="formList80">
                <Form layout="inline" onSubmit={this.handleFormSearch}>
                    <Row type="flex" gutter={20}>
                        <Col span={8}>
                            <FormItem label="所属组织">{getFieldDecorator('organizationId')(<Cascader options={treeData} changeOnSelect />)}</FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="所属客户">
                                {getFieldDecorator('customerId')(
                                    <Select showSearch allowClear placeholder="请输入" defaultActiveFirstOption={false} showArrow notFoundContent={null} filterOption={false} onSearch={this.customerSearch} onChange={this.customerChange}>
                                        {options}
                                    </Select>,
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="地理位置">{getFieldDecorator('areaCode', {})(<Cascader options={locationData} changeOnSelect />)}</FormItem>
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
                        </div>
                    </div>
                </Form>
            </div>
        );
    }
}

export default Curd;
