import React, { Component } from 'react';
import PageHeaderWrapper from '@/components/breadcrumb';
import { Table, Button, Icon, Form, Modal, Row, Input, Col } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ loading, formTableSpace }) => {
    return {
        formTableSpace,
        loadingSearch: loading.effects['formTableSpace/getTableListInfo'],
    };
})
@Form.create()
class TableView extends Component {
    columns = [];

    constructor(props) {
        super(props);
        this.state = {
            expand: false,
        };
    }

    componentDidMount = () => {
        this.getTableViewList(0);
    };

    getTableViewList = (page = 0, size = 10) => {
        const { dispatch } = this.props;
        const searchData = this.props.form.getFieldsValue();
        dispatch({
            type: 'formTableSpace/getTableListInfo',
            payload: {
                page,
                size,
                ...searchData,
            },
        });
    };

    // 点击下一页 或者切换某页，选择每页条数
    tableChange = (pagination) => {
        return this.getTableViewList(pagination.current - 1, pagination.pageSize);
    };

    // 查询数据
    handleSearch = () => {
        this.getTableViewList(0);
    };

    // 重置查询条件
    resetSearch = () => {
        this.props.form.resetFields();
    };

    toggleForm = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    }

    render() {
        console.log(this.state)
        const {
            form: { getFieldDecorator },
            formTableSpace: { tableInfo },
        } = this.props;
        const { data = [], pageable = {} } = tableInfo;
        const pagination = {
            showTotal: () => {
                return (
                    <span className="pagination">
                        共<a>{pageable.totalPages}</a>页/<a>{pageable.totalElements}</a>条数据
                    </span>
                );
            },
            total: pageable.totalElements,
            pageSize: pageable.size,
            current: parseInt(pageable.number + 1, 10) || 1,
            showSizeChanger: true,
        };
        return (
            <div>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <Form className="m5 formList80" layout="inline">
                        <Row type="flex" gutter={{ md: 8, lg: 24, xl: 48 }}>
                            <Col md={8} sm={24}>
                                <FormItem label="页面名称：">
                                    {getFieldDecorator('name1',
                                    )(
                                        <Input placeholder="请输入" />,
                                    )}
                                </FormItem>
                            </Col>
                            <Col md={8} sm={24}>
                                <FormItem label="页面名称：">
                                    {getFieldDecorator('name2',
                                    )(
                                        <Input placeholder="请输入" />,
                                    )}
                                </FormItem>
                            </Col>
                            <Col md={8} sm={24}>
                                <FormItem label="页面名称：">
                                    {getFieldDecorator('name3',
                                    )(
                                        <Input placeholder="请输入" />,
                                    )}
                                </FormItem>
                            </Col>
                            <Col md={8} sm={24} style={{ display: this.state.expand ? 'block' : 'none' }}>
                                <FormItem label="页面名称：">
                                    {getFieldDecorator('name4',
                                    )(
                                        <Input placeholder="请输入" />,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <div style={{ overflow: 'hidden' }}>
                            <div className="fr">
                                <Button type="primary" onClick={this.handleSearch}>
                                    <span className="iconfont icon-search mr8 fz14"></span>
                                    查询
                                </Button>
                                <Button className="ml8 bg-button-reset" onClick={this.resetSearch}>
                                    <span className="iconfont icon-reset mr8 fz14"></span>
                                    重置
                                </Button>
                                <a className="ml32 fz14" onClick={this.toggleForm}>
                                    更多条件 <Icon type={this.state.expand ? 'up' : 'down'} ></Icon>
                                </a>
                            </div>
                        </div>
                    </Form>
                </div>
                <div className="content mt20">
                    <div className="mb20 clearfix">
                        <span className="table-title">分组列表</span>
                        <div className="fr">
                            <Button type="primary" onClick={this.changeAddModal}>
                                <span className="iconfont icon-add mr8 fz14"></span>新增
                            </Button>
                        </div>
                    </div>
                    <Table
                        rowKey="id"
                        loading={this.props.loadingSearch}
                        scroll={{ x: 1100 }}
                        columns={this.columns}
                        dataSource={data}
                        pagination={pagination}
                        onChange={this.tableChange}></Table>
                </div>
            </div>
        );
    }
}

export default TableView;
