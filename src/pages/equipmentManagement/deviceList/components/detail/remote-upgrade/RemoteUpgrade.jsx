import { Form, Modal, Row, Col, Select } from 'antd';
import React, { Component } from 'react';
import validate from '@/utils/validation';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ deviceList, loading }) => {
    return {
        deviceList,
        loadingRemoteUpgrade: loading.effects['deviceList/remoteUpgrade'],
    };
})
@Form.create()
class RemoteUpgrade extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.getDestVersionList();
    }

    getDestVersionList() {
        const deviceId = this.props.deviceList.deviceDetail.id;
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceList/getDestVersionList',
            payload: {
                id: deviceId,
            },
        });
    }

    // 取消
    updateUpgradeModalStatus = () => {
        this.props.updateUpgradeModalStatus();
    };

    remoteUpgrade = () => {
        const { form, dispatch, updateUpgradeModalStatus, getTableViewList, getVersionInfo } = this.props;
        const {
            deviceDetail: { id },
        } = this.props.deviceList;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            dispatch({
                type: 'deviceList/remoteUpgrade',
                payload: {
                    ...fieldsValue,
                    deviceId: id,
                },
                callback: () => {
                    updateUpgradeModalStatus();
                    getVersionInfo();
                    getTableViewList();
                },
            });
        });
    };

    render() {
        const {
            form: { getFieldDecorator },
            deviceList: { versionInfo = {}, destVersionList = [] },
        } = this.props;
        return (
            <Modal
                centered title="远程升级" destroyOnClose visible maskClosable={false}
                onCancel={this.updateUpgradeModalStatus} width={440} confirmLoading={this.props.loadingRemoteUpgrade}
                onOk={this.remoteUpgrade}>
                <div className="formList80">
                    <Form>
                        <Row type="flex">
                            <Col span={24}>
                                <FormItem label="当前版本">{getFieldDecorator('sourceVersionNo', {
                                    initialValue: versionInfo.currentVersionNo || '',
                                })(
                                    <span>{versionInfo.currentVersionNo}</span>)}</FormItem>
                            </Col>
                            <Col span={24}>
                                <FormItem label="目标版本">
                                    {getFieldDecorator('destVersionNo', {
                                        rules: [validate.Rule_require],
                                    })(<Select placeholder="请选择">
                                        {destVersionList.map(version => {
                                            return <Option key={version}
                                                value={version}>{version}</Option>;
                                        })}
                                    </Select>)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>
        );
    }
}

export default RemoteUpgrade;
