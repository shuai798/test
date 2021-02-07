import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Select, Icon } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

@connect()
@Form.create()
class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.container = React.createRef();
        this.state = {
            expandForm: false,
        };
    }

    handleFormSearch = (e) => {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, formValue) => {
            if (err) {
                return;
            }
            let value = formValue;
            value = {
                ...value,
            };
            this.props.handleSearch(value);
        });
    };

    handleFormReset = () => {
        const { form } = this.props;
        form.resetFields();
        this.setState({});
        this.props.resetSearch();
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="formList80 shortSearch">
                <Form layout="inline" onSubmit={this.handleFormSearch}>
                    <Row type="flex" gutter={20}>
                        <Col md={8}>
                            <FormItem label="字典名称">{getFieldDecorator('name')(<Input allowClear placeholder="请输入"></Input>)}</FormItem>
                        </Col>
                        <Col md={8}>
                            <Button type="primary" htmlType="submit">
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
            </div>
        );
    }
}

export default SearchForm;
