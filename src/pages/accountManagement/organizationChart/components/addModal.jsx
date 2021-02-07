import React from 'react';
import { Modal, Form, Row, Col, Input } from 'antd';
import validate from '@/utils/validation';
import { connect } from 'dva';
import styles from '../index.less';

const FormItem = Form.Item;
@connect()
@Form.create()
class AddItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    clickOk = () => {
        const { form, addRecord } = this.props;
        // 新增
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let value = values;
            value = {
                ...value,
                parentId: addRecord.id,
                type: addRecord && addRecord.type && addRecord.type === 'HEAD_OFFICE' ? 'BRANCH_OFFICE' : 'AGENT',
            };
            this.props.addOk(value);
        });
    };

    clickCancel = () => {
        this.props.addShow();
    };

    render() {
        const {
            form: { getFieldDecorator },
            addRecord,
        } = this.props;
        return (
            <div className={styles.modalCss}>
                <Modal title="新增组织" width={832} visible maskClosable={false} getContainer={false} centered onOk={this.clickOk} okText="确定" onCancel={this.clickCancel} cancelText="取消">
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
                                            <span>{addRecord && addRecord.parentId ? addRecord.nameContainsParent : addRecord.name}</span>
                                        </FormItem>
                                    </Col>
                                    <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                        <FormItem label="组织类型">
                                            <span>{addRecord && addRecord.type && addRecord.type === 'HEAD_OFFICE' ? '分公司' : '经销商'}</span>
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
                                            })(<Input placeholder="请输入" maxLength={32}></Input>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div className="border mb20"></div>
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
