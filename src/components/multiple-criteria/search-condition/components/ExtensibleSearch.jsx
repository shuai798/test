import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Select, Icon, DatePicker, message } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@Form.create()
class ExtensibleSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandForm: false,
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

    toggleForm = () => {
        this.setState(preState => { return { expandForm: !preState.expandForm }; });
    };

    renderCommonForm = () => {
        const {
            form: { getFieldDecorator },
            doorList = [],
        } = this.props;
        const doorOption = doorList.map(door => {
            return (
                <Option value={door.id} key={door.id}>
                    {door.name}
                </Option>
            );
        });
        return <>
            <Col md={8} sm={24}>
                <FormItem label="名称">
                    {getFieldDecorator('name', {},
                    )(
                        <Input placeholder="请输入"></Input>,
                    )}
                </FormItem>
            </Col>
            <Col md={8} sm={24}>
                <FormItem label="地址">
                    {getFieldDecorator('address', {},
                    )(
                        <Input placeholder="请输入"></Input>,
                    )}
                </FormItem>
            </Col>
            <Col md={8} sm={24}>
                <FormItem label="出入口">
                    {getFieldDecorator('doorId', {},
                    )(
                        <Select placeholder="请选择">
                            {doorOption}
                        </Select>,
                    )}
                </FormItem>
            </Col>
        </>;
    }

    renderSimpleForm() {
        return (
            <Form layout="inline" onSubmit={this.handleFormSearch}>
                <Row type="flex" gutter={{ md: 8, lg: 24, xl: 48 }}>
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
                            更多条件 <Icon type="down" />
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
                <Row type="flex" gutter={{ md: 8, lg: 24, xl: 48 }}>
                    {this.renderCommonForm()}
                    <Col md={8} sm={24}>
                        <FormItem label="出入身份">
                            {getFieldDecorator('personType', {
                                initialValue: 'ALL',
                            },
                            )(
                                <Select placeholder="请选择">
                                    <Option key="ALL" value="ALL">
                                        全部
                                    </Option>
                                    <Option key="STAFF" value="STAFF">
                                        常驻人员
                                    </Option>
                                    <Option key="GUEST" value="GUEST">
                                        外来人员
                                    </Option>
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="体温情况">
                            {getFieldDecorator('temperatureResultType', {
                                initialValue: 'ALL',
                            },
                            )(
                                <Select placeholder="请选择">
                                    <Option key="ALL" value="ALL">
                                        全部
                                    </Option>
                                    <Option key="NORMAL" value="NORMAL">
                                        正常
                                    </Option>
                                    <Option key="FEVER" value="FEVER">
                                        发热
                                    </Option>
                                    <Option key="UNENFORCED" value="UNENFORCED">
                                        未测
                                    </Option>
                                </Select>,
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="时间段">
                            {getFieldDecorator('time', {},
                            )(
                                <RangePicker style={{ width: '100%' }} placeholder={['开始时间', '结束时间']} allowClear>
                                </RangePicker>,
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
                            收起 <Icon type="up" />
                        </a>
                    </div>
                </div>
            </Form>
        );
    }

    render() {
        const { expandForm } = this.state;
        return (
            <div className="formList80">
                {expandForm ? this.renderAdvancedForm() : this.renderSimpleForm()}
            </div>
        );
    }
}

export default ExtensibleSearch;
