import React from 'react';
import { Modal, Form, Row, Col, Input } from 'antd';
import validate from '@/utils/validation';
import filters from '@/filters/index';
import { connect } from 'dva';
import styles from '../index.less';

const FormItem = Form.Item;
@connect()
@Form.create()
class AddItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {}, // 用户信息
        };
    }

    componentDidMount() {
        this.getdetailList();
    }

    getdetailList = () => {
        const { dispatch, editRecord } = this.props;
        dispatch({
            type: 'organizationChartSpace/getDetailRecord',
            payload: { id: editRecord.id },
            callback: (response) => {
                this.setState({
                    userInfo: response.data,
                });
            },
        });
    };

    clickOk = () => {
        const { form, editRecord } = this.props;
        const { userInfo } = this.state;
        // 编辑
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let value = values;
            value = {
                ...value,
                id: editRecord.id,
                parentId: editRecord.id,
                type: editRecord && editRecord.type && editRecord.type === 'HEAD_OFFICE' ? 'BRANCH_OFFICE' : 'AGENT',
                primaryAccountId: userInfo.primaryAccountId,
            };
            this.props.editOk(value);
        });
    };

    clickCancel = () => {
        this.props.editShow();
    };

    render() {
        const {
            form: { getFieldDecorator },
            editRecord,
        } = this.props;
        const { userInfo } = this.state;
        return (
            <div className={styles.modalCss}>
                <Modal title="编辑组织" width={832} visible maskClosable={false} getContainer={false} centered onOk={this.clickOk} okText="确定" onCancel={this.clickCancel} cancelText="取消">
                    <div className="formList100">
                        <div>
                            <div className={styles.titleStyle}>
                                <div className={styles.iconStyle}></div>
                                <div className={styles.fontStyle}>组织信息</div>
                            </div>
                            <Form>
                                <Row type="flex">
                                    <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                        <FormItem label="上级组织">
                                            <span>{editRecord && editRecord.type && editRecord.type === 'AGENT' ? `${editRecord.nameContainsParent.split('/')[0]}/${editRecord.nameContainsParent.split('/')[1]}` : editRecord.nameContainsParent.split('/')[0]}</span>
                                        </FormItem>
                                    </Col>
                                    <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                        <FormItem label="组织类型">
                                            <span>{editRecord.type ? filters.organizationTypeFilter(editRecord.type) : null}</span>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex">
                                    <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                        <FormItem label="组织名称">
                                            {getFieldDecorator('name', {
                                                validate: [
                                                    {
                                                        trigger: 'onChange',
                                                        rules: [validate.Rule_require],
                                                    },
                                                ],
                                                initialValue: editRecord ? editRecord.name : null,
                                            })(<Input placeholder="请输入" maxLength={32}></Input>)}
                                        </FormItem>
                                    </Col>
                                    <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                        <FormItem label="组织编码">
                                            {getFieldDecorator('code', {
                                                validate: [
                                                    {
                                                        trigger: 'onChange',
                                                        rules: [validate.Rule_require],
                                                    },
                                                ],
                                                initialValue: editRecord ? editRecord.code : null,
                                            })(<Input placeholder="请输入" maxLength={32}></Input>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div>
                            <div className={styles.titleStyle}>
                                <div className={styles.iconStyle}></div>
                                <div className={styles.fontStyle}>管理员账号</div>
                            </div>
                            <Form>
                                <Row type="flex">
                                    <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                        <FormItem label="人员姓名">
                                            {getFieldDecorator('primaryAccountName', {
                                                validate: [
                                                    {
                                                        trigger: 'onChange',
                                                        rules: [validate.Rule_require],
                                                    },
                                                ],
                                                initialValue: userInfo?.primaryAccountName || null,
                                            })(<Input placeholder="请输入" maxLength={32}></Input>)}
                                        </FormItem>
                                    </Col>
                                    <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                        <FormItem label="手机号码">
                                            {getFieldDecorator('primaryAccountMobile', {
                                                validate: [
                                                    {
                                                        trigger: 'onChange',
                                                        rules: [validate.Rule_require],
                                                    },
                                                    {
                                                        trigger: 'onChange',
                                                        rules: [validate.Rule_tel],
                                                    },
                                                ],
                                                initialValue: userInfo?.primaryAccountMobile || null,
                                            })(<Input placeholder="请输入" maxLength={32}></Input>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default AddItem;
