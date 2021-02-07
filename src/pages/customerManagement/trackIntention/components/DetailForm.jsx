import React from 'react';
import { Modal, Form, Row, Col, Table, Input } from 'antd';
import validate from '@/utils/validation';
import { connect } from 'dva';
import styles from '../style.less';

const FormItem = Form.Item;

@connect(({ trackIntention, loading }) => {
    return {
        trackIntention,
        loading,
    };
})
@Form.create()
class DetailForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    clickOk = () => {
        const { form, dispatch, detailId } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            dispatch({
                type: 'trackIntention/trace',
                payload: {
                    id: detailId,
                    ...fieldsValue,
                },
                callback: () => {
                    this.props.cancleDispose();
                },
            });
        });
    };

    clickCancel = () => {
        this.props.cancleDispose();
    };

    render() {
        const {
            detailRecord,
            form: { getFieldDecorator },
        } = this.props;
        const columns = [
            {
                title: '序号',
                dataIndex: 'No',
                width: 68,
                align: 'center',
                render: (text, record, index) => {
                    return <span>{index + 1}</span>;
                },
                fixed: 'left',
            },
            {
                title: '跟踪人',
                dataIndex: 'employeeName',
            },
            {
                title: '跟踪时间',
                dataIndex: 'trackingTime',
            },
            {
                title: '跟踪结果',
                dataIndex: 'result',
                width: 150,
                align: 'center',
                ellipsis: true,
            },
        ];
        return (
            <div>
                <Modal title="意向跟踪" width={832} visible maskClosable={false} getContainer={false} centered onOk={this.clickOk} okText="确定" onCancel={this.clickCancel} cancelText="取消" bodyStyle={{ paddingBottom: 'unset' }}>
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                        }}>
                        <div className="formList100">
                            <div>
                                <div className={styles.titleStyle}>
                                    <div className={styles.iconStyle}></div>
                                    <div className={styles.fontStyle}>扫码信息</div>
                                </div>
                                <Form>
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
                            <div>
                                <div className={styles.titleStyle}>
                                    <div className={styles.iconStyle}></div>
                                    <div className={styles.fontStyle}>咨询信息</div>
                                </div>
                                <Form>
                                    <Row type="flex" gutter={20}>
                                        <Col span={24}>
                                            <FormItem label="OpenId">{detailRecord && detailRecord.openId ? detailRecord.openId : '--'}</FormItem>
                                        </Col>
                                    </Row>
                                    <Row type="flex" gutter={20}>
                                        <Col span={12}>
                                            <FormItem label="联系人">{detailRecord && detailRecord.contactName ? detailRecord.contactName : '--'}</FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label="联系电话">{detailRecord && detailRecord.contactMobile ? detailRecord.contactMobile : '--'}</FormItem>
                                        </Col>
                                    </Row>
                                    <Row type="flex" gutter={20}>
                                        <Col span={24}>
                                            <FormItem label="公司名称">{detailRecord && detailRecord.companyName ? detailRecord.companyName : '--'}</FormItem>
                                        </Col>
                                    </Row>
                                    <Row type="flex" gutter={20}>
                                        <Col span={24}>
                                            <FormItem label="咨询描述">{detailRecord && detailRecord.description ? detailRecord.description : '--'}</FormItem>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                            <div className="border mb20"></div>
                            <div>
                                <div className={styles.titleStyle}>
                                    <div className={styles.iconStyle}></div>
                                    <div className={styles.fontStyle}>跟踪进度</div>
                                </div>
                                <Table
                                    columns={columns}
                                    dataSource={detailRecord.progressList}
                                    rowKey={(record) => {
                                        return record.id;
                                    }}
                                    loading={this.props.loading.effects['trackIntention/getDetailList']}
                                    // onChange={this.handleTableChange}
                                    pagination={false}></Table>
                            </div>
                        </div>
                        <div className={styles.footer}>
                            <div className="border mb20"></div>
                            <div className="formList100 shortSearch">
                                <Row type="flex" gutter={20}>
                                    <Col span={24}>
                                        <FormItem label="跟踪结果">
                                            {getFieldDecorator('description', {
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
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default DetailForm;
