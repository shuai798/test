import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Select, DatePicker, message } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class BaseSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleFormSearch = e => {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields(err => {
            if (err) { return; }
            message.info('搜索数据');
        });
    };

    handleFormReset = () => {
        const { form } = this.props;
        form.resetFields();
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="formList80 shortSearch">
                <Form layout="inline" onSubmit={this.handleFormSearch}>
                    <Row type="flex" gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={8} sm={24}>
                            <FormItem label="姓名">
                                {getFieldDecorator('name', {},
                                )(
                                    <Input placeholder="请输入"></Input>,
                                )}
                            </FormItem>
                        </Col>
                        <Col md={8} sm={24}>
                            <FormItem label="出入时间">
                                {getFieldDecorator('forDate', {},
                                )(
                                    <DatePicker placeholder="请选择日期" style={{ width: '100%' }} format="YYYY-MM-DD"></DatePicker>,
                                )}
                            </FormItem>
                        </Col>
                        <Col md={8} sm={24}>
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

export default BaseSearch;
