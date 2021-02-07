import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Input, Col } from 'antd';

const FormItem = Form.Item;

@connect(({ inspectionStandard }) => {
    return {
        inspectionStandard,
    };
})
@Form.create()
class Curd extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    handleFormSearch = (e) => {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, value) => {
            const params = {
                ...value,
                status: value.status === 'ALL' ? '' : value.status,
            };
            this.props.handleSearch(params);
        });
    };

    handleFormReset = () => {
        const { form } = this.props;
        form.resetFields();
        this.props.reset();
    };

    render() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <div className="formList80 shortSearch">
                <Form layout="inline" onSubmit={this.handleFormSearch}>
                    <Row type="flex" gutter={20}>
                        <Col span={8}>
                            <FormItem label="人员姓名">{getFieldDecorator('name')(<Input allowClear autoComplete="off" placeholder="请输入" />)}</FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem label="手机号码">{getFieldDecorator('mobile')(<Input allowClear autoComplete="off" placeholder="请输入" />)}</FormItem>
                        </Col>
                        <Col span={8}>
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

export default Curd;
