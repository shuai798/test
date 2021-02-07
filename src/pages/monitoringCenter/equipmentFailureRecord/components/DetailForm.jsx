import React from 'react';
import { Modal, Form, Row, Col } from 'antd';
import { connect } from 'dva';
import styles from '../style.less';

const FormItem = Form.Item;

@connect()
@Form.create()
class DetailForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    clickOk = () => {
        this.props.cancleDispose();
    };

    clickCancel = () => {
        this.props.cancleDispose();
    };

    render() {
        let { detailRecord } = this.props;
        detailRecord = detailRecord || {};
        return (
            <div>
                <Modal title="故障记录详情" width={832} visible maskClosable={false} getContainer={false} centered footer={false} onCancel={this.clickCancel}>
                    <div className="formList100">
                        <div className={styles['title-style']}>
                            <div className={styles['icon-style']}></div>
                            <div className={styles['font-style']}>设备信息</div>
                        </div>
                        <div className="formList80">
                            <Form>
                                <Row type="flex" gutter={20}>
                                    <Col span={12}>
                                        <FormItem label="设备编码">{detailRecord.no || '--'}</FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="控制器编码">{detailRecord.controllerNo || '--'}</FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" gutter={20}>
                                    <Col span={12}>
                                        <FormItem label="系列型号">{detailRecord.seriesName || '--'}</FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="系列编码">{detailRecord.seriesCode || '--'}</FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" gutter={20}>
                                    <Col span={24}>
                                        <FormItem label="地理位置">{detailRecord.location || '--'}</FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" gutter={20}>
                                    <Col span={24}>
                                        <FormItem label="所属客户">{detailRecord.customerName || '--'}</FormItem>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div className="border mb20"></div>
                        <div className={styles['title-style']}>
                            <div className={styles['icon-style']}></div>
                            <div className={styles['font-style']}>故障信息</div>
                        </div>
                        <div className="formList80">
                            <Form>
                                <Row type="flex" gutter={20}>
                                    <Col span={12}>
                                        <FormItem label="故障类型">{detailRecord.type || '--'}</FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="发生时间">{detailRecord.breakdownTime || '--'}</FormItem>
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

export default DetailForm;
