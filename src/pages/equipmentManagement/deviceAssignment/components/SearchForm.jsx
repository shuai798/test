import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Select, Icon } from 'antd';
import { connect } from 'dva';
import { HxTreeSelect, HxSelect } from '@/components/hx-components/index';
import indexStyle from '../index.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ deviceAssignment }) => {
    return {
        deviceAssignment,
    };
})
@Form.create()
class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandForm: false,
            customerList: [],
            distributionObjectType: '',
        };
    }

    handleFormSearch = (e) => {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, formValue) => {
            if (err) {
                return;
            }
            const { distributionObjectType } = this.state;
            const values = {
                ...formValue,
                type: distributionObjectType,
            };
            this.props.handleSearch(values);
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
            });
        } else {
            const {
                props: { type },
            } = event;
            this.setState({ distributionObjectType: type });
        }
    };

    renderCommonForm = () => {
        const {
            form: { getFieldDecorator },
            seriesTreeData = [],
        } = this.props;
        return (
            <>
                <Col md={8} sm={24}>
                    <FormItem label="设备编码">{getFieldDecorator('no')(<Input placeholder="请输入" allowClear autoComplete="off"></Input>)}</FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <FormItem label="控制器编码">{getFieldDecorator('controllerNoStr')(<Input placeholder="请输入" allowClear autoComplete="off"></Input>)}</FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <FormItem label="系列型号">{getFieldDecorator('seriesModelId')(<HxTreeSelect treeData={seriesTreeData} placeholder="请选择" showSearch treeNodeLabelProp="newValue" treeNodeFilterProp="title" dropdownClassName={indexStyle['over-ant-select-tree']} allowClear></HxTreeSelect>)}</FormItem>
                </Col>
            </>
        );
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
        const {
            form: { getFieldDecorator },
        } = this.props;
        const options = this.state.customerList.map((customer) => {
            return (
                <Option key={customer.id} value={customer.id} type={customer.type}>
                    {customer.name}
                </Option>
            );
        });
        return (
            <Form className="m5" layout="inline" onSubmit={this.handleFormSearch}>
                <Row type="flex" gutter={20}>
                    {this.renderCommonForm()}
                    <Col md={8} sm={24}>
                        <FormItem label="分配对象">
                            {getFieldDecorator('distributionObjectId')(
                                <HxSelect showSearch placeholder="请输入" defaultActiveFirstOption={false} showArrow={false} filterOption={false} onSearch={this.handleSearch} notFoundContent={null} allowClear onChange={this.handleChangeCustomer}>
                                    {options}
                                </HxSelect>,
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

export default SearchForm;
