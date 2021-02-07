import React from 'react';
import { Modal, Form, Row, Col } from 'antd';
import { connect } from 'dva';
import filters from '@/filters/index';
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
        const { dispatch, detailRecord } = this.props;
        dispatch({
            type: 'organizationChartSpace/getDetailRecord',
            payload: { id: detailRecord.id },
            callback: (response) => {
                this.setState({
                    userInfo: response.data,
                });
            },
        });
    };

    clickCancel = () => {
        this.props.detailShow();
    };

    render() {
        const { detailRecord } = this.props;
        const { userInfo } = this.state;
        return (
            <div className={styles.modalCss}>
                <Modal title="组织详情" width={832} footer={false} visible onCancel={this.clickCancel} maskClosable={false} getContainer={false} centered>
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
                                            <span>{detailRecord && detailRecord.type && detailRecord.type === 'AGENT' ? `${detailRecord.nameContainsParent.split('/')[0]}/${detailRecord.nameContainsParent.split('/')[1]}` : detailRecord.nameContainsParent.split('/')[0]}</span>
                                        </FormItem>
                                    </Col>
                                    <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                        <FormItem label="组织类型">{detailRecord.type ? filters.organizationTypeFilter(detailRecord.type) : '--'}</FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex">
                                    <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                        <FormItem label="组织名称">{detailRecord?.name || '--'}</FormItem>
                                    </Col>
                                    <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                        <FormItem label="组织编码">{detailRecord?.code || '--'}</FormItem>
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
                                        <FormItem label="人员姓名">{userInfo?.primaryAccountName || '--'}</FormItem>
                                    </Col>
                                    <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                        <FormItem label="手机号码">{userInfo?.primaryAccountMobile || '--'}</FormItem>
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
