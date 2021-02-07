import React from 'react';
import { Form, Row, Col, Input, Modal, Select } from 'antd';
import { connect } from 'dva';
import validate from '@/utils/validation';
import zhCN from '@/i18n/zh-CN/zhCN';
import { HxSelect } from '@/components/hx-components';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
@connect(({ loading, dataDictionarySpace }) => {
    return {
        dataDictionarySpace,
        editLoading: loading.effects['dataDictionarySpace/AddItem'],
    };
})
class Details extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            industryTypeList: [],
        };
    }

    componentDidMount() {
        //获取行业类型
        this.getIndustryTypeList();
    }

    // 获取行业类型
    getIndustryTypeList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'customerManagement/getIndustryTypeList',
            payload: {
                code: 'HYLX',
            },
            callback: (res) => {
                this.setState({
                    industryTypeList: res.data,
                });
            },
        });
    };

    editShow = () => {
        const { form, dispatch, changeClientEditModal, customerInfo } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            dispatch({
                type: 'customerManagement/editTableInfo',
                payload: {
                    ...fieldsValue,
                    organizationId: customerInfo && customerInfo.organizationId ? customerInfo.organizationId : '',
                    id: customerInfo && customerInfo.id ? customerInfo.id : '',
                },
                callback: () => {
                    changeClientEditModal();
                },
            });
        });
    };

    render() {
        const {
            form: { getFieldDecorator },
            changeClientEditModal,
            customerInfo,
        } = this.props;
        const { industryTypeList } = this.state;
        return (
            <Modal title="编辑客户" width={800} centered maskClosable={false} visible destroyOnClose confirmLoading={this.props.editLoading} onOk={this.editShow} onCancel={changeClientEditModal}>
                <div className="formList80">
                    <Form>
                        <Row
                            type="flex"
                            gutter={{
                                md: 8,
                                lg: 12,
                                xl: 24,
                            }}>
                            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                <FormItem label="所属组织">{customerInfo && customerInfo.organizationName ? customerInfo.organizationName : ''}</FormItem>
                            </Col>
                            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                <FormItem label="客户名称">
                                    {getFieldDecorator('name', {
                                        rules: [validate.Rule_require, { validator: validate.Rule_name }],
                                        initialValue: customerInfo && customerInfo.name ? customerInfo.name : '',
                                    })(<Input allowClear autoComplete="off" placeholder="请输入" maxLength={20}></Input>)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row
                            type="flex"
                            gutter={{
                                md: 8,
                                lg: 12,
                                xl: 24,
                            }}>
                            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                <FormItem label="行业类型">
                                    {getFieldDecorator('industryType', {
                                        rules: [validate.Rule_require],
                                        initialValue: customerInfo && customerInfo.industryType ? customerInfo.industryType : undefined,
                                    })(
                                        <HxSelect
                                            showSearch
                                            placeholder="请选择"
                                            allowClear
                                            filterOption={(input, option) => {
                                                return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                            }}>
                                            {(industryTypeList || []).map((item) => {
                                                return (
                                                    <Option key={item.code} value={item.code}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                        </HxSelect>,
                                    )}
                                </FormItem>
                            </Col>
                            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                <FormItem label="企业规模">
                                    {getFieldDecorator('staffSize', {
                                        rules: [validate.Rule_require],
                                        initialValue: customerInfo && customerInfo.staffSize ? customerInfo.staffSize : undefined,
                                    })(
                                        <HxSelect placeholder="请选择" allowClear>
                                            {zhCN.staffSizeType.map((item) => {
                                                return (
                                                    <Option key={item.code} value={item.code}>
                                                        {item.name}
                                                    </Option>
                                                );
                                            })}
                                        </HxSelect>,
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row
                            type="flex"
                            gutter={{
                                md: 8,
                                lg: 12,
                                xl: 24,
                            }}>
                            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                <FormItem label="联系人">
                                    {getFieldDecorator('contactName', {
                                        rules: [validate.Rule_require],
                                        initialValue: customerInfo && customerInfo.contactName ? customerInfo.contactName : undefined,
                                    })(<Input allowClear autoComplete="off" placeholder="请输入" maxLength={20}></Input>)}
                                </FormItem>
                            </Col>
                            <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                <FormItem label="联系电话">
                                    {getFieldDecorator('contactTel', {
                                        rules: [validate.Rule_require, validate.Rule_tel],
                                        initialValue: customerInfo && customerInfo.contactTel ? customerInfo.contactTel : undefined,
                                    })(<Input allowClear autoComplete="off" placeholder="请输入" maxLength={20}></Input>)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>
        );
    }
}

export default Details;
