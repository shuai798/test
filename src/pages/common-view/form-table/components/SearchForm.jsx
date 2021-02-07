import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Select, Icon, TreeSelect } from 'antd';
import { connect } from 'dva';
import indexStyle from '../index.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ loading, formTableSpace }) => {
    return {
        formTableSpace,
        loadingSearch: loading.effects['formTableSpace/getTableListInfo'],
    };
})
@Form.create()
class SearchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandForm: false,
            dataSource: [],
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'formTableSpace/getSystemDataInfo',
            callback: () => {
                const {
                    formTableSpace: { systemDataList },
                } = this.props;
                this.changeDataToTreeSelect(systemDataList, '');
                systemDataList.unshift({
                    key: 'ALL',
                    value: 'ALL',
                    newValue: '全部',
                    title: '全部',
                });
                this.setState({
                    dataSource: systemDataList,
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
            if (!value.no) {
                delete value.no;
            }
            if (value.rootSubSystemId === 'ALL') {
                delete value.rootSubSystemId;
            }
            if (value.managementStatus === 'ALL') {
                delete value.managementStatus;
            }
            this.props.handleSearch(value);
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

    renderCommonForm = () => {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <>
                <Col md={8} sm={24}>
                    <FormItem label="分组名称">{getFieldDecorator('name', {})(<Input placeholder="请输入" allowClear></Input>)}</FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <FormItem label="分组编码">{getFieldDecorator('no', {})(<Input placeholder="请输入" allowClear></Input>)}</FormItem>
                </Col>
                <Col md={8} sm={24}>
                    <FormItem label="所属系统">
                        {getFieldDecorator('rootSubSystemId', {
                            initialValue: 'ALL',
                        })(<TreeSelect treeData={this.state.dataSource} showSearch treeNodeLabelProp="newValue" treeNodeFilterProp="title" dropdownClassName={indexStyle['over-ant-select-tree']}></TreeSelect>)}
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
                        <a className="ml32 fz14" onClick={this.toggleForm}>
                            更多条件 <Icon type="down"></Icon>
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
            <Form className="m5" layout="inline" onSubmit={this.handleFormSearch}>
                <Row type="flex" gutter={20}>
                    {this.renderCommonForm()}
                    <Col md={8} sm={24}>
                        <FormItem label="管理状态：">
                            {getFieldDecorator('managementStatus', {
                                initialValue: 'ALL',
                            })(
                                <Select placeholder="请选择">
                                    <Option key="ALL" value="ALL">
                                        全部
                                    </Option>
                                    <Option key="VALID" value="VALID">
                                        启用
                                    </Option>
                                    <Option key="INVALID" value="INVALID">
                                        禁用
                                    </Option>
                                </Select>,
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
