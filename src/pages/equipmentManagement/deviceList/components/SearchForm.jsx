import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Select } from 'antd';
import { connect } from 'dva';
import { HxTreeSelect, HxSelect } from '@/components/hx-components/index';
import indexStyle from '../index.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ deviceList }) => {
    return {
        deviceList,
    };
})
@Form.create()
class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandForm: false,
            customerList: [],
        };
    }

    handleFormSearch = (e) => {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, formValue) => {
            if (err) {
                return;
            }
            this.props.handleSearch(formValue);
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
            deviceList: { customerList = [] },
        } = this.props;
        customerList = customerList.filter((customer) => {
            return customer.name.indexOf(value) > -1;
        });
        callback(customerList);
    };

    handleChangeCustomer = (customerId) => {
        if (!customerId) {
            this.setState({ customerList: [] });
        }
    };

    renderCommonForm = () => {
        const {
            form: { getFieldDecorator },
            seriesTreeData = [],
        } = this.props;
        const options = this.state.customerList.map((customer) => {
            return (
                <Option key={customer.id} value={customer.id}>
                    {customer.name}
                </Option>
            );
        });
        return (
            <>
                <Col span={8}>
                    <FormItem label="设备编码">{getFieldDecorator('no')(<Input placeholder="请输入" allowClear autoComplete="off"></Input>)}</FormItem>
                </Col>
                <Col span={8}>
                    <FormItem label="系列型号">{getFieldDecorator('seriesParamId')(<HxTreeSelect treeData={seriesTreeData} placeholder="请选择" showSearch treeNodeLabelProp="newValue" treeNodeFilterProp="title" dropdownClassName={indexStyle['over-ant-select-tree']} allowClear></HxTreeSelect>)}</FormItem>
                </Col>
                <Col span={8}>
                    <FormItem label="所属客户">
                        {getFieldDecorator('customerId')(
                            <HxSelect showSearch placeholder="请输入" defaultActiveFirstOption={false} showArrow={false} filterOption={false} onSearch={this.handleSearch} notFoundContent={null} allowClear onChange={this.handleChangeCustomer}>
                                {options}
                            </HxSelect>,
                        )}
                    </FormItem>
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
                    </div>
                </div>
            </Form>
        );
    }

    render() {
        return <div className="formList80">{this.renderSimpleForm()}</div>;
    }
}

export default SearchForm;
