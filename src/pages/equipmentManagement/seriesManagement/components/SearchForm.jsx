import React, { Component } from 'react';
import { Row, Col, Form, Input, Button } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ customerManagement }) => {
    return {
        customerManagement,
    };
})
@Form.create()
class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleFormSearch = (e) => {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, formValue) => {
            if (err) {
                return;
            }
            const value = formValue;
            if (!value.name) {
                delete value.name;
            }
            if (value.no === '') {
                delete value.no;
            }
            this.props.handleSearch(value);
        });
    };

    handleFormReset = () => {
        const { form } = this.props;
        form.resetFields();
        this.props.resetSearch();
    };

    renderSimpleForm() {
        const {
            form: { getFieldDecorator },
            loadingSearch,
        } = this.props;
        return (
            <Form layout="inline" onSubmit={this.handleFormSearch}>
                <Row type="flex" gutter={20}>
                    <Col span={8}>
                        <FormItem label="系列名称">{getFieldDecorator('name')(<Input autoComplete="off" placeholder="请输入" allowClear></Input>)}</FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="系列编码">{getFieldDecorator('code')(<Input autoComplete="off" placeholder="请输入" allowClear></Input>)}</FormItem>
                    </Col>
                    <Col span={8}>
                        <Button type="primary" htmlType="submit" loading={loadingSearch}>
                            <span className="iconfont icon-search mr8 fz14"></span>
                            查询
                        </Button>
                        <Button className="ml8 bg-button-reset" onClick={this.handleFormReset}>
                            <span className="iconfont icon-reset mr8 fz14"></span>
                            重置
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        return <div className="formList80 shortSearch">{this.renderSimpleForm()}</div>;
    }
}

export default SearchForm;
