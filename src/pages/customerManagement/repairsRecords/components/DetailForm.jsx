import React from 'react';
import { Modal, Form, Row, Col } from 'antd';
// import validate from '@/utils/validation';
import { connect } from 'dva';
import storage from '@/utils/storage';
import styles from '../style.less';

const FormItem = Form.Item;

@connect()
// @connect(({ repairsRecords, loading }) => {
//     return {
//         repairsRecords,
//         loading,
//     };
// })
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
        const { detailRecord } = this.props;
        return (
            <div>
                <Modal title="报修详情" width={832} visible maskClosable={false} getContainer={false} centered footer={false} onCancel={this.clickCancel}>
                    <div className="formList100">
                        <div className={styles.titleStyle}>
                            <div className={styles.iconStyle}></div>
                            <div className={styles.fontStyle}>设备信息</div>
                        </div>
                        <div className="formList80">
                            <Form>
                                <Row type="flex" gutter={20}>
                                    <Col span={12}>
                                        <FormItem label="设备编码">{detailRecord && detailRecord.no ? detailRecord.no : '--'}</FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="控制器编码">{detailRecord && detailRecord.controllerNo ? detailRecord.controllerNo : '--'}</FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" gutter={20}>
                                    <Col span={12}>
                                        <FormItem label="系列型号">{detailRecord && detailRecord.seriesName ? detailRecord.seriesName : '--'}</FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="系列编码">{detailRecord && detailRecord.seriesCode ? detailRecord.seriesCode : '--'}</FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" gutter={20}>
                                    <Col span={24}>
                                        <FormItem label="地理位置">{detailRecord && detailRecord.areaName ? detailRecord.areaName : '--'}</FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" gutter={20}>
                                    <Col span={24}>
                                        <FormItem label="所属客户">{detailRecord && detailRecord.customerName ? detailRecord.customerName : '--'}</FormItem>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div className="border mb20"></div>
                        <div className={styles.titleStyle}>
                            <div className={styles.iconStyle}></div>
                            <div className={styles.fontStyle}>报修信息</div>
                        </div>
                        <div className="formList80">
                            <Form>
                                <Row type="flex" gutter={20}>
                                    <Col span={24}>
                                        <FormItem label="OpenId">{detailRecord && detailRecord.repairReminderDTO && detailRecord.repairReminderDTO.openId ? detailRecord.repairReminderDTO.openId : '--'}</FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" gutter={20}>
                                    <Col span={12}>
                                        <FormItem label="联系人">{detailRecord && detailRecord.repairReminderDTO && detailRecord.repairReminderDTO.contactName ? detailRecord.repairReminderDTO.contactName : '--'}</FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="联系电话">{detailRecord && detailRecord.repairReminderDTO && detailRecord.repairReminderDTO.contactMobile ? detailRecord.repairReminderDTO.contactMobile : '--'}</FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" gutter={20}>
                                    <Col span={24}>
                                        <FormItem label="问题描述">{detailRecord && detailRecord.repairReminderDTO && detailRecord.repairReminderDTO.description ? detailRecord.repairReminderDTO.description : '--'}</FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" gutter={20}>
                                    <Col span={24}>
                                        {/*<FormItem label="现场照片">{detailRecord && detailRecord.repairReminderDTO && detailRecord.repairReminderDTO.imageUrls ? detailRecord.repairReminderDTO.imageUrls : '--'}</FormItem>*/}
                                        <FormItem label="现场照片">
                                            {detailRecord && detailRecord.repairReminderDTO && detailRecord.repairReminderDTO.imageUrls && detailRecord.repairReminderDTO.imageUrls.length > 0 ?
                                                detailRecord.repairReminderDTO.imageUrls.map((item) => {
                                                    return <img key={item} alt="" className={styles['scene-pic']} src={storage.getStorage('downloadUrl') + item}></img>;
                                                })
                                                : (
                                                    <div></div>
                                                )}
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

export default DetailForm;
