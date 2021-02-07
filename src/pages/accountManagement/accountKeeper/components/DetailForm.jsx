import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Modal, Row, Col } from 'antd';
import styles from '../style.less';

const FormItem = Form.Item;

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
        this.state = {};
    }

    render() {
        const { detailRecord } = this.props;
        return (
            <div>
                <Modal
                    visible
                    width={832}
                    maskClosable={false}
                    className={styles.myButton}
                    confirmLoading={this.props.loading.effects['accountKeeperSpace/editTenantEmployee']}
                    style={{ height: '100%' }}
                    title="账户详情"
                    footer={false}
                    onCancel={() => {
                        return this.props.detailCancel();
                    }}>
                    <div className="formList100">
                        <Form>
                            <Row type="flex" gutter={20}>
                                <Col span={12}>
                                    <FormItem label="人员姓名">{detailRecord.name || '--'}</FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="手机号码">{detailRecord.mobile || '--'}</FormItem>
                                </Col>
                            </Row>
                            <Row type="flex" gutter={20}>
                                <Col span={12}>
                                    <FormItem label="在职状态">{detailRecord.status ? '在职' : '离职'}</FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem label="移动端角色">
                                        {detailRecord && detailRecord.mobileRoleNames.length > 0
                                            ? detailRecord.mobileRoleNames.map((item, index) => {
                                                if (index === detailRecord.mobileRoleNames.length - 1) {
                                                    return item;
                                                }
                                                return `${item}、`;
                                            })
                                            : '--'}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row type="flex" gutter={20}>
                                <Col span={24}>
                                    <FormItem label="后台角色">
                                        {detailRecord && detailRecord.roleNames.length > 0
                                            ? detailRecord.roleNames.map((item, index) => {
                                                if (index === detailRecord.roleNames.length - 1) {
                                                    return item;
                                                }
                                                return `${item}、`;
                                            })
                                            : '--'}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row type="flex" gutter={20}>
                                <Col span={24}>
                                    <FormItem label="负责客户">
                                        {detailRecord && detailRecord.customerNames.length > 0
                                            ? detailRecord.customerNames.map((item, index) => {
                                                if (index === detailRecord.customerNames.length - 1) {
                                                    return item;
                                                }
                                                return `${item}、`;
                                            })
                                            : '--'}
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
