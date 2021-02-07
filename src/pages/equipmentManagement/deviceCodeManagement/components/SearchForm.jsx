import React, { Component } from 'react';
import { Row, Col, Form, Button } from 'antd';
import { connect } from 'dva';
import { HxTreeSelect } from '@/components/hx-components/index';
import indexStyle from '../index.less';

const FormItem = Form.Item;

@connect(({ deviceList }) => {
    return {
        deviceList,
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
            this.props.handleSearch(formValue);
        });
    };

    handleFormReset = () => {
        const { form } = this.props;
        form.resetFields();
        this.props.resetSearch();
    };

    renderCommonForm = () => {
        const {
            form: { getFieldDecorator },
            seriesTreeData = [],
        } = this.props;
        return (
            <>
                <Col span={8}>
                    <FormItem label="系列型号">{getFieldDecorator('seriesParamId')(<HxTreeSelect treeData={seriesTreeData} placeholder="请选择" showSearch treeNodeLabelProp="newValue" treeNodeFilterProp="title" dropdownClassName={indexStyle['over-ant-select-tree']} allowClear></HxTreeSelect>)}</FormItem>
                </Col>
            </>
        );
    };

    renderSimpleForm() {
        return (
            <Form className="m5" layout="inline" onSubmit={this.handleFormSearch}>
                <Row type="flex" gutter={20}>
                    {this.renderCommonForm()}
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
        );
    }

    render() {
        return <div className="formList80 shortSearch">{this.renderSimpleForm()}</div>;
    }
}

export default SearchForm;
