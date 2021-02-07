import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col, Cascader, Icon, Select } from 'antd';
import { HxSelect } from '@/components/hx-components';

const FormItem = Form.Item;
const { Option } = Select;
let timeout;
let currentValue;

@connect(({ deviceCodeManagement }) => {
    return {
        deviceCodeManagement,
    };
})
@Form.create()
class Curd extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            seriesTreeData: [], // 系列型号
            customerData: [], // 所属客户
            expandForm: false,
            areaFirstList: [],
            areaSecondList: [],
            areaThirdList: [],
            areaId: [],
            provinceValue: undefined,
            cityValue: undefined,
            countyValue: undefined,
        };
    }

    componentDidMount() {
        this.getTreeData();
        this.getAreaList();
        this.getSeriesTree();
    }

    // 所属组织
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

    handleFormSearch = (e) => {
        e.preventDefault();
        const { form } = this.props;
        const { provinceValue, cityValue, countyValue } = this.state;
        form.validateFields((err, value) => {
            if (err) {
                return;
            }
            let values = {};
            if (value.organizationId && value.organizationId.length > 1) {
                value.organizationId = value.organizationId[value.organizationId.length - 1];
            }
            if (value.seriesParamId && value.seriesParamId.length > 1) {
                value.seriesParamId = value.seriesParamId[value.seriesParamId.length - 1];
            }
            if (provinceValue === undefined) {
                values = {
                    ...value,
                };
            } else if (cityValue === undefined) {
                values = {
                    ...value,
                    areaCode: provinceValue,
                };
            } else if (countyValue === undefined) {
                values = {
                    ...value,
                    areaCode: cityValue,
                };
            } else {
                values = {
                    ...value,
                    areaCode: countyValue,
                };
            }
            const params = {
                ...values,
            };
            this.props.handleSearch(params);
        });
    };

    handleFormReset = () => {
        const { form } = this.props;
        this.setState({
            provinceValue: undefined,
            cityValue: undefined,
            countyValue: undefined,
        });
        form.resetFields();
        this.props.resetSearch();
    };

    toggleForm = () => {
        this.setState((preState) => {
            return { expandForm: !preState.expandForm };
        });
    };

    renderCommonForm = () => {
        const {
            form: { getFieldDecorator },
        } = this.props;
        const { treeData, seriesTreeData, customerData } = this.state;
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
                    <FormItem label="系列型号">{getFieldDecorator('seriesParamId')(<Cascader options={seriesTreeData} changeOnSelect />)}</FormItem>
                </Col>
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
            </>
        );
    };

    // 获取省
    getAreaList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'customerManagement/getAreaInfo',
            callback: (res) => {
                this.setState({
                    areaFirstList: res.data,
                });
            },
        });
    };

    // 获取市
    getSecondList = (e) => {
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
                        provinceValue: e,
                        cityValue: undefined,
                        countyValue: undefined,
                    });
                },
            });
        } else {
            this.setState({
                areaSecondList: [],
                areaThirdList: [],
                provinceValue: e,
                cityValue: undefined,
                countyValue: undefined,
            });
        }
    };

    // 获取县
    getThirdList = (e) => {
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
                        cityValue: e,
                        countyValue: undefined,
                    });
                },
            });
        } else {
            this.setState({
                areaThirdList: [],
                cityValue: e,
                countyValue: undefined,
            });
        }
    };

    getareaId = (e) => {
        const { areaId } = this.state;
        areaId.push(e);
        this.setState({
            countyValue: e,
        });
    };

    renderSimpleForm() {
        return (
            <Form className="m5" layout="inline" onSubmit={this.handleFormSearch}>
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

    renderAdvancedForm() {
        const { areaFirstList, areaSecondList, areaThirdList, provinceValue, cityValue, countyValue } = this.state;
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <Form className="m5" layout="inline" onSubmit={this.handleFormSearch}>
                <Row type="flex" gutter={20}>
                    {this.renderCommonForm()}
                    <Col span={16}>
                        <FormItem label="地理位置">
                            {getFieldDecorator('areaCode')(
                                <Row type="flex" gutter={20}>
                                    <Col span={8}>
                                        <HxSelect placeholder="请选择" allowClear value={provinceValue} onChange={this.getSecondList}>
                                            {areaFirstList.map((item) => {
                                                return (
                                                    <Option key={item.code} value={item.code}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                        </HxSelect>
                                    </Col>
                                    <Col span={8}>
                                        <HxSelect placeholder="请选择" allowClear value={cityValue} onChange={this.getThirdList}>
                                            {areaSecondList.map((item) => {
                                                return (
                                                    <Option key={item.code} value={item.code}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                        </HxSelect>
                                    </Col>
                                    <Col span={8}>
                                        <HxSelect placeholder="请选择" allowClear value={countyValue} onChange={this.getareaId}>
                                            {areaThirdList.map((item) => {
                                                return (
                                                    <Option key={item.code} value={item.code}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                        </HxSelect>
                                    </Col>
                                </Row>,
                            )}
                        </FormItem>
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
                            收起 <Icon type="up"></Icon>
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
