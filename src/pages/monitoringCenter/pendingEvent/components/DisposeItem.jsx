import React from 'react';
import { Modal, Form, Row, Col, Input, Tag, Select } from 'antd';
import { HxSelect } from '@/components/hx-components';
// import validate from '@/utils/validation';
import { connect } from 'dva';
import filters from '@/filters';
import styles from '../style.less';

const { Option } = Select;
const FormItem = Form.Item;

@connect(({ pendingEventSpace, loading }) => {
    return {
        pendingEventSpace,
        loading,
    };
})
@Form.create()
class DisposeItem extends React.Component {
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
        const { disposeRecord, dispatch } = this.props;
        dispatch({
            type: 'pendingEventSpace/getDetailList',
            payload: {
                id: disposeRecord.id,
            },
            callback: (response) => {
                this.setState({
                    detailList: response.data,
                });
            },
        });
    };

    clickOk = () => {
        const { form, dispatch, disposeRecord } = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const ids = [];
            ids.push(disposeRecord.id);
            dispatch({
                type: 'pendingEventSpace/dispose',
                payload: {
                    ...values,
                    ids,
                },
                callback: () => {
                    this.props.okDispose();
                },
            });
        });
    };

    clickCancel = () => {
        this.props.cancleDispose();
    };

    getTitle = () => {
        const { disposeRecord } = this.props;
        if (disposeRecord && disposeRecord.type) {
            if (disposeRecord.type === 'TO_BE_MAINTAINED') {
                return '待保养提醒';
            }
            if (disposeRecord.type === 'TO_BE_SCRAPPED') {
                return '待报废提醒';
            }
            if (disposeRecord.type === 'BREAKDOWN') {
                return '故障记录详情';
            }
            if (disposeRecord.type === 'EXPIRED') {
                return '已过期提醒';
            }
            return '报修详情';
        }
    };

    render() {
        const {
            form: { getFieldDecorator },
            disposeRecord,
        } = this.props;
        const { detailList } = this.state;
        return (
            <div>
                <Modal title={this.getTitle()} width={832} visible maskClosable={false} getContainer={false} centered onOk={this.clickOk} okText="确定" onCancel={this.clickCancel} cancelText="取消">
                    <div className="formList100">
                        <div>
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
                        </div>
                        <div className="border mb20"></div>
                        {(disposeRecord && disposeRecord.type && disposeRecord.type === 'TO_BE_MAINTAINED') || (disposeRecord && disposeRecord.type && disposeRecord.type === 'TO_BE_SCRAPPED') ? (
                            <div>
                                <div className={styles['title-style']}>
                                    <div className={styles['icon-style']}></div>
                                    <div className={styles['font-style']}>提醒信息</div>
                                </div>
                                <div className="formList80">
                                    <Form>
                                        <Row type="flex" gutter={20}>
                                            <Col span={12}>
                                                <FormItem label="设备状态">{detailList && detailList.maintainedReminderDTO?.type ? detailList.maintainedReminderDTO.type : '--'}</FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label="发生时间">{detailList && detailList.maintainedReminderDTO?.eventTime ? detailList.maintainedReminderDTO.eventTime : '--'}</FormItem>
                                            </Col>
                                        </Row>
                                        <Row type="flex" gutter={20}>
                                            <Col span={12}>
                                                <FormItem label="运行总次数">{detailList && detailList.maintainedReminderDTO?.runNum ? detailList.maintainedReminderDTO.runNum : '--'}</FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label="上次维保次数">{detailList && detailList.maintainedReminderDTO?.lastMaintenanceNum ? detailList.maintainedReminderDTO.lastMaintenanceNum : '--'}</FormItem>
                                            </Col>
                                        </Row>
                                        <Row type="flex" gutter={20}>
                                            <Col span={12}>
                                                <FormItem label="维保阈值">{detailList && detailList.maintainedReminderDTO?.maintenanceThreshold ? detailList.maintainedReminderDTO.maintenanceThreshold : '--'}</FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label="报废阈值">{detailList && detailList.maintainedReminderDTO?.scrapThreshold ? detailList.maintainedReminderDTO.scrapThreshold : '--'}</FormItem>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                                <div className="border mb20"></div>
                            </div>
                        ) : null}
                        {disposeRecord && disposeRecord.type && disposeRecord.type === 'BREAKDOWN' ? (
                            <div>
                                <div className={styles['title-style']}>
                                    <div className={styles['icon-style']}></div>
                                    <div className={styles['font-style']}>故障信息</div>
                                </div>
                                <div className="formList80">
                                    <Form>
                                        <Row type="flex" gutter={20}>
                                            <Col span={12}>
                                                <FormItem label="故障类型">{detailList && detailList.breakdownReminderDTO?.deviceBreakdownTypeEnum ? filters.deviceTroubleTypeFilter(detailList.breakdownReminderDTO.deviceBreakdownTypeEnum) : '--'}</FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label="发生时间">{detailList && detailList.breakdownReminderDTO?.eventTime ? detailList.breakdownReminderDTO.eventTime : '--'}</FormItem>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                                <div className="border mb20"></div>
                            </div>
                        ) : null}
                        {disposeRecord && disposeRecord.type && disposeRecord.type === 'EXPIRED' ? (
                            <div>
                                <div className={styles['title-style']}>
                                    <div className={styles['icon-style']}></div>
                                    <div className={styles['font-style']}>提醒信息</div>
                                </div>
                                <div className="formList80">
                                    <Form>
                                        <Row type="flex" gutter={20}>
                                            <Col span={12}>
                                                <FormItem label="激活时间">{detailList && detailList.expiredReminderDTO?.activeTime ? detailList.expiredReminderDTO.activeTime : '--'}</FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label="到期时间">
                                                    {detailList && detailList.expiredReminderDTO?.expireTime ? detailList.expiredReminderDTO.expireTime : '--'}
                                                    {detailList && detailList.expiredReminderDTO?.expireTime && detailList.expiredReminderDTO?.expireTime < new Date() ? (
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
                        {disposeRecord && disposeRecord.type && disposeRecord.type === 'REPAIR' ? (
                            <div>
                                <div className={styles['title-style']}>
                                    <div className={styles['icon-style']}></div>
                                    <div className={styles['font-style']}>报修信息</div>
                                </div>
                                <div className="formList80">
                                    <Form>
                                        <Row type="flex" gutter={20}>
                                            <Col span={12}>
                                                <FormItem label="OpenID">{detailList && detailList.repairReminderDTO?.openId ? detailList.repairReminderDTO.openId : '--'}</FormItem>
                                            </Col>
                                        </Row>
                                        <Row type="flex" gutter={20}>
                                            <Col span={12}>
                                                <FormItem label="联系人">{detailList && detailList.repairReminderDTO?.contactName ? detailList.repairReminderDTO.contactName : '--'}</FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label="联系电话">{detailList && detailList.repairReminderDTO?.contactMobile ? detailList.repairReminderDTO.contactMobile : '--'}</FormItem>
                                            </Col>
                                        </Row>
                                        <Row type="flex" gutter={20}>
                                            <Col span={12}>
                                                <FormItem label="问题描述">{detailList && detailList.repairReminderDTO?.description ? detailList.repairReminderDTO.description : '--'}</FormItem>
                                            </Col>
                                        </Row>
                                        <Row type="flex" gutter={20}>
                                            <Col span={12}>
                                                <FormItem label="现场照片">
                                                    <img alt="" className={styles['scene-pic']} src={detailList && detailList.repairReminderDTO && detailList.repairReminderDTO.imageUrls ? detailList.repairReminderDTO.imageUrls : null}></img>
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                                <div className="border mb20"></div>
                            </div>
                        ) : null}
                        <div className="formList80 shortSearch">
                            <Form>
                                <Row type="flex" gutter={20}>
                                    <Col span={12}>
                                        <FormItem label="处理结果">
                                            {getFieldDecorator('deviceEventResult', {
                                                initialValue: 'MANUAL_HANDLE',
                                            })(
                                                <HxSelect placeholder="请选择">
                                                    <Option value="MANUAL_HANDLE">人工现场处理</Option>
                                                    <Option value="RETURNED_TO_NORMAL">系统已恢复正常</Option>
                                                    <Option value="NO_HANDLE">暂不处理</Option>
                                                </HxSelect>,
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="备注信息">
                                            {getFieldDecorator('remark', {
                                                // initialValue: true,
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

export default DisposeItem;
