import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Input, Row, Col, Radio, Checkbox } from 'antd';
import validate from '@/utils/validation';
import styles from '../style.less';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const optionStatus = [
    { label: '在职', value: true },
    { label: '离职', value: false },
];

@connect(({ accountKeeperSpace, loading }) => {
    return {
        accountKeeperSpace,
        loading,
    };
})
@Form.create()
class Curd extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            checkedValues: this.props.detailRecord.mobileRoleIds,
            webCheckedList: this.props.detailRecord.roleIds,
            currentCheckedList: this.props.detailRecord.customerIds,
            webCheckAll: this.props.detailRecord.roleIds.length === this.props.webData.length,
            currentCheckAll: this.props.detailRecord.customerIds.length === this.props.currentData.length,
        };
    }

    componentDidMount() {
        const currentData = this.changeDataToCheckBox(this.props.currentData);
        const appData = this.changeDataToCheckBox(this.props.appData);
        const webData = this.changeDataToCheckBox(this.props.webData);
        this.setState({
            currentData,
            appData,
            webData,
        });
    }

    changeDataToCheckBox = (dataList) => {
        const list = dataList;
        if (list.length > 0) {
            for (let i = 0; i < list.length; i += 1) {
                list[i].label = list[i].name;
                list[i].value = list[i].id;
            }
        }
        return list;
    };

    submit = () => {
        const { form, dispatch, editRecord } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            const value = {
                ...fieldsValue,
                organizationId: editRecord.organizationId,
                id: editRecord.employeeId,
                mobileRoleIds: this.state.checkedValues,
                roleIds: this.state.webCheckedList,
                customerIds: this.state.currentCheckedList,
            };
            dispatch({
                type: 'accountKeeperSpace/editTenantEmployee',
                payload: {
                    ...value,
                },
                callback: () => {
                    this.props.editListOk();
                },
            });
        });
    };

    onChange = (checkedValues) => {
        this.setState({
            checkedValues,
        });
    };

    webOnChange = (webCheckedList) => {
        const { webData } = this.state;
        if (webData.length === webCheckedList.length) {
            this.setState({
                webCheckedList,
                webCheckAll: true,
            });
        } else {
            this.setState({
                webCheckedList,
                webCheckAll: false,
            });
        }
    };

    currentOnChange = (currentCheckedList) => {
        const { currentData } = this.state;
        if (currentData.length === currentCheckedList.length) {
            this.setState({
                currentCheckedList,
                currentCheckAll: true,
            });
        } else {
            this.setState({
                currentCheckedList,
                currentCheckAll: false,
            });
        }
    };

    webOnCheckAllChange = (e) => {
        const { webData } = this.state;
        const dataSource = webData.map((item) => {
            return item.id;
        });
        this.setState({
            webCheckedList: e.target.checked ? dataSource : [],
            webCheckAll: e.target.checked,
        });
    };

    currentOnCheckAllChange = (e) => {
        const { currentData } = this.state;
        const dataSource = currentData.map((item) => {
            return item.id;
        });
        this.setState({
            currentCheckedList: e.target.checked ? dataSource : [],
            currentCheckAll: e.target.checked,
        });
    };

    render() {
        const {
            detailRecord,
            form: { getFieldDecorator },
        } = this.props;
        const { currentData, appData, webData, webCheckAll, currentCheckAll } = this.state;
        return (
            <div>
                <Modal
                    visible
                    width={832}
                    maskClosable={false}
                    className={styles.myButton}
                    confirmLoading={this.props.loading.effects['accountKeeperSpace/editTenantEmployee']}
                    style={{ height: '100%' }}
                    title="编辑账户"
                    onOk={this.submit}
                    okText="确定"
                    cancelText="取消"
                    onCancel={() => {
                        return this.props.editListCancel();
                    }}>
                    <div className="formList100">
                        <Form>
                            <Row type="flex">
                                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="人员姓名">
                                        {getFieldDecorator('name', {
                                            validate: [
                                                {
                                                    trigger: 'onChange',
                                                    rules: [validate.Rule_require],
                                                },
                                            ],
                                            initialValue: detailRecord ? detailRecord.name : true,
                                        })(<Input placeholder="请输入" maxLength={32}></Input>)}
                                    </FormItem>
                                </Col>
                                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="手机号码">
                                        {getFieldDecorator('mobile', {
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
                                            initialValue: detailRecord ? detailRecord.mobile : true,
                                        })(<Input placeholder="请输入" maxLength={32}></Input>)}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row type="flex">
                                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="在职状态">
                                        {getFieldDecorator('status', {
                                            validate: [
                                                {
                                                    trigger: 'onChange',
                                                    rules: [validate.Rule_require],
                                                },
                                            ],
                                            initialValue: detailRecord?.status,
                                        })(<Radio.Group options={optionStatus}></Radio.Group>)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="移动端角色">
                                        <Checkbox.Group options={appData} value={this.state.checkedValues} onChange={this.onChange} />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row type="flex" gutter={20}>
                                <Col span={24}>
                                    <FormItem label="后台角色">
                                        <span>
                                            <span style={{ marginRight: 10 }}>
                                                <Checkbox onChange={this.webOnCheckAllChange} checked={webCheckAll}>
                                                    全选
                                                </Checkbox>
                                            </span>
                                            <CheckboxGroup options={webData} value={this.state.webCheckedList} onChange={this.webOnChange} />
                                        </span>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row type="flex" gutter={20}>
                                <Col span={24}>
                                    <FormItem label="负责客户">
                                        <span>
                                            <span style={{ marginRight: 10 }}>
                                                <Checkbox onChange={this.currentOnCheckAllChange} checked={currentCheckAll}>
                                                    全选
                                                </Checkbox>
                                            </span>
                                            <CheckboxGroup options={currentData} value={this.state.currentCheckedList} onChange={this.currentOnChange} />
                                        </span>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Curd;
