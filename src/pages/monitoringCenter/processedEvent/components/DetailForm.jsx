import React from 'react';
import { Modal, Form, Row, Col, Tag } from 'antd';
// import validate from '@/utils/validation';
import { connect } from 'dva';
import filters from '@/filters/index';
import styles from '../style.less';

const FormItem = Form.Item;

@connect(({ processedEventSpace, loading }) => {
    return {
        processedEventSpace,
        loading,
    };
})
@Form.create()
class DetailForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detailList: {},
        };
    }

    componentDidMount() {
        this.getDetailList();
    }

    getDetailList = () => {
        const { detailRecord, dispatch } = this.props;
        dispatch({
            type: 'processedEventSpace/getDetailList',
            payload: {
                id: detailRecord.id,
            },
            callback: (response) => {
                this.setState({
                    detailList: response.data,
                });
            },
        });
    };

    clickCancel = () => {
        this.props.detailForm();
    };

    getTitle = () => {
        const { detailRecord } = this.props;
        if (detailRecord && detailRecord.type) {
            if (detailRecord.type === 'TO_BE_MAINTAINED') {
                return '待保养提醒';
            }
            if (detailRecord.type === 'TO_BE_SCRAPPED') {
                return '待报废提醒';
            }
            if (detailRecord.type === 'BREAKDOWN') {
                return '故障记录详情';
            }
            if (detailRecord.type === 'EXPIRED') {
                return '已过期提醒';
            }
            return '报修详情';
        }
    };

    render() {
        const { detailRecord } = this.props;
        const { detailList } = this.state;
        return (
            <div>
                <Modal title={this.getTitle()} width={832} visible maskClosable={false} getContainer={false} centered footer={false} onCancel={this.clickCancel}>
                    <div className="formList100">
                        <div className={styles['title-style']}>
                            <div className={styles['icon-style']}></div>
                            <div className={styles['font-style']}>设备信息</div>
                        </div>
                        <div className="formList80">
                            <Form>
                                <Row type="flex" gutter={20}>
                                    <Col span={12}>
                                        <FormItem label="设备编码">{detailList && detailList.no ? detailList.no : '--'}</FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="控制器编码">{detailList && detailList.controllerNo ? detailList.controllerNo : '--'}</FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" gutter={20}>
                                    <Col span={12}>
                                        <FormItem label="系列型号">{detailList && detailList.seriesName ? detailList.seriesName : '--'}</FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="系列编码">{detailList && detailList.seriesCode ? detailList.seriesCode : '--'}</FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" gutter={20}>
                                    <Col span={24}>
                                        <FormItem label="地理位置">{detailList && detailList.areaName ? detailList.areaName : '--'}</FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" gutter={20}>
                                    <Col span={24}>
                                        <FormItem label="所属客户">{detailList && detailList.customerName ? detailList.customerName : '--'}</FormItem>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div className="border mb20"></div>
                        {(detailRecord && detailRecord.type && detailRecord.type === 'TO_BE_MAINTAINED') || (detailRecord && detailRecord.type && detailRecord.type === 'TO_BE_SCRAPPED') ? (
                            <div>
                                <div className={styles['title-style']}>
                                    <div className={styles['icon-style']}></div>
                                    <div className={styles['font-style']}>提醒信息</div>
                                </div>
                                <div className="formList80">
                                    <Form>
                                        <Row type="flex" gutter={20}>
                                            <Col span={12}>
                                                <FormItem label="设备状态">{detailList && detailList.maintainedReminderDTO && detailList.maintainedReminderDTO.type ? detailList.maintainedReminderDTO.type : '--'}</FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label="发生时间">{detailList && detailList.maintainedReminderDTO && detailList.maintainedReminderDTO.eventTime ? detailList.maintainedReminderDTO.eventTime : '--'}</FormItem>
                                            </Col>
                                        </Row>
                                        <Row type="flex" gutter={20}>
                                            <Col span={12}>
                                                <FormItem label="运行总次数">{detailList && detailList.maintainedReminderDTO && detailList.maintainedReminderDTO.runNum ? detailList.maintainedReminderDTO.runNum : '--'}</FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label="上次维保次数">{detailList && detailList.maintainedReminderDTO && detailList.maintainedReminderDTO.lastMaintenanceNum ? detailList.maintainedReminderDTO.lastMaintenanceNum : '--'}</FormItem>
                                            </Col>
                                        </Row>
                                        <Row type="flex" gutter={20}>
                                            <Col span={12}>
                                                <FormItem label="维保阈值">{detailList && detailList.maintainedReminderDTO && detailList.maintainedReminderDTO.maintenanceThreshold ? detailList.maintainedReminderDTO.maintenanceThreshold : '--'}</FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label="报废阈值">{detailList && detailList.maintainedReminderDTO && detailList.maintainedReminderDTO.scrapThreshold ? detailList.maintainedReminderDTO.scrapThreshold : '--'}</FormItem>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                                <div className="border mb20"></div>
                            </div>
                        ) : null}
                        {detailRecord && detailRecord.type && detailRecord.type === 'BREAKDOWN' ? (
                            <div>
                                <div className={styles['title-style']}>
                                    <div className={styles['icon-style']}></div>
                                    <div className={styles['font-style']}>故障信息</div>
                                </div>
                                <div className="formList80">
                                    <Form>
                                        <Row type="flex" gutter={20}>
                                            <Col span={12}>
                                                <FormItem label="故障类型">{detailList && detailList.breakdownReminderDTO && detailList.breakdownReminderDTO.deviceBreakdownTypeEnum ? detailList.breakdownReminderDTO.deviceBreakdownTypeEnum : '--'}</FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label="发生时间">{detailList && detailList.breakdownReminderDTO && detailList.breakdownReminderDTO.eventTime ? detailList.breakdownReminderDTO.eventTime : '--'}</FormItem>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                                <div className="border mb20"></div>
                            </div>
                        ) : null}
                        {detailRecord && detailRecord.type && detailRecord.type === 'EXPIRED' ? (
                            <div>
                                <div className={styles['title-style']}>
                                    <div className={styles['icon-style']}></div>
                                    <div className={styles['font-style']}>提醒信息</div>
                                </div>
                                <div className="formList80">
                                    <Form>
                                        <Row type="flex" gutter={20}>
                                            <Col span={12}>
                                                <FormItem label="激活时间">{detailList && detailList.expiredReminderDTO && detailList.expiredReminderDTO.activeTime ? detailList.expiredReminderDTO.activeTime : '--'}</FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label="到期时间">
                                                    {detailList && detailList.expiredReminderDTO && detailList.expiredReminderDTO.expireTime ? detailList.expiredReminderDTO.expireTime : '--'}
                                                    {detailRecord && detailRecord.dqsj && detailRecord.dqsj < new Date() ? (
                                                        <Tag color="red" style={{ marginLeft: 20 }}>
                                                            已过期
                                                        </Tag>
                                                    ) : null}
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                                <div className="border mb20"></div>
                            </div>
                        ) : null}
                        {detailRecord && detailRecord.type && detailRecord.type === 'REPAIR' ? (
                            <div>
                                <div className={styles['title-style']}>
                                    <div className={styles['icon-style']}></div>
                                    <div className={styles['font-style']}>报修信息</div>
                                </div>
                                <div className="formList80">
                                    <Form>
                                        <Row type="flex" gutter={20}>
                                            <Col span={12}>
                                                <FormItem label="OpenID">{detailList && detailList.repairReminderDTO && detailList.repairReminderDTO.openId ? detailList.repairReminderDTO.openId : '--'}</FormItem>
                                            </Col>
                                        </Row>
                                        <Row type="flex" gutter={20}>
                                            <Col span={12}>
                                                <FormItem label="联系人">{detailList && detailList.repairReminderDTO && detailList.repairReminderDTO.contactName ? detailList.repairReminderDTO.contactName : '--'}</FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label="联系电话">{detailList && detailList.repairReminderDTO && detailList.repairReminderDTO.contactMobile ? detailList.repairReminderDTO.contactMobile : '--'}</FormItem>
                                            </Col>
                                        </Row>
                                        <Row type="flex" gutter={20}>
                                            <Col span={12}>
                                                <FormItem label="问题描述">{detailList && detailList.repairReminderDTO && detailList.repairReminderDTO.description ? detailList.repairReminderDTO.description : '--'}</FormItem>
                                            </Col>
                                        </Row>
                                        <Row type="flex" gutter={20}>
                                            <Col span={12}>
                                                <FormItem label="现场照片">
                                                    {detailList && detailList.repairReminderDTO && detailList.repairReminderDTO.imageUrls && detailList.repairReminderDTO.imageUrls.length > 0 ? (
                                                        detailList.repairReminderDTO.imageUrls.map((item) => {
                                                            return <img key={item} alt="" className={styles['scene-pic']} src={item}></img>;
                                                        })
                                                    ) : (
                                                        <div></div>
                                                    )}
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                                <div className="border mb20"></div>
                            </div>
                        ) : null}
                        <div className="formList80">
                            <Form>
                                <Row type="flex" gutter={20}>
                                    <Col span={12}>
                                        <FormItem label="处理结果">{detailList && detailList.handleResult ? filters.resultFilter(detailList.handleResult) : '--'}</FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="备注信息">{detailList && detailList.remark ? detailList.remark : '--'}</FormItem>
                                    </Col>
                                </Row>
                                <Row type="flex" gutter={20}>
                                    <Col span={12}>
                                        <FormItem label="操作人">{detailList && detailList.operatorName ? detailList.operatorName : '--'}</FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="操作时间">{detailList && detailList.operationTime ? detailList.operationTime : '--'}</FormItem>
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
