import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, TreeSelect } from 'antd';
import { connect } from 'dva';
import indexStyle from '../index.less';

const FormItem = Form.Item;

@connect(({ customerManagement, organizationChartSpace }) => {
    return {
        customerManagement,
        organizationChartSpace,
    };
})
@Form.create()
class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        };
    }

    componentDidMount() {
        const { dispatch, userInfo } = this.props;
        const { orgId } = userInfo;
        dispatch({
            type: 'organizationChartSpace/getTableListInfo',
            payload: orgId,
            callback: (res) => {
                this.changeDataToTreeSelect(res, '');
                this.setState({
                    dataSource: res,
                });
            },
        });
        dispatch({
            type: 'organizationChartSpace/getTableListInfo',
            payload: orgId,
            callback: (res) => {
                this.changeDataToTreeSelect(res, '');
                this.setState({
                    dataSource: res,
                });
            },
        });
    }

    changeDataToTreeSelect = (dataList, name) => {
        const list = dataList;
        if (list.length > 0) {
            for (let i = 0; i < list.length; i += 1) {
                list[i].value = list[i].id;
                list[i].title = list[i].name;
                // 用于回显全路径
                list[i].newValue = name !== '' ? `${name} / ${list[i].name}` : list[i].name;
                if (list[i].children && list[i].children.length > 0) {
                    list[i].children = this.changeDataToTreeSelect(list[i].children, list[i].newValue);
                } else {
                    list[i].children = null;
                }
            }
        }
        return list;
    };

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
            if (value.orgId === '') {
                delete value.orgId;
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
        const { dataSource } = this.state;
        return (
            <Form layout="inline" onSubmit={this.handleFormSearch}>
                <Row type="flex" gutter={20}>
                    <Col md={8} sm={24}>
                        <FormItem label="客户名称">{getFieldDecorator('name')(<Input autoComplete="off" placeholder="请输入" allowClear></Input>)}</FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="所属组织">{getFieldDecorator('orgIdParam')(<TreeSelect treeDefaultExpandAll allowClear placeholder="请选择" treeNodeLabelProp="newValue" treeNodeFilterProp="title" treeData={dataSource} showSearch dropdownClassName={indexStyle['over-ant-select-tree']}></TreeSelect>)}</FormItem>
                    </Col>
                    <Col md={8} sm={24}>
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
