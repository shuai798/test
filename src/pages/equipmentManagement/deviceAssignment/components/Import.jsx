import { Form, Button, Table, Steps, Icon, Upload, message, Divider } from 'antd';
import PageHeaderWrapper from '@/components/breadcrumb';
import React, { Component } from 'react';
import router from 'umi/router';
import Api from '@/utils/api';
import storage from '@/utils/storage';
import { connect } from 'dva';
import Export from '@/utils/export';
import styles from '../index.less';

const { Step } = Steps;

@connect(({ deviceAssignment }) => {
    return {
        deviceAssignment,
    };
})
@Form.create()
class Import extends Component {
    columns = [
        {
            title: '行数',
            dataIndex: 'num',
            align: 'center',
            width: 120,
        },
        {
            title: '设备编码',
            dataIndex: 'no',
            width: 300,
        },
        {
            title: '提示信息',
            dataIndex: 'errorInfo',
            render: (text) => {
                return <span style={{ color: '#FF3B3B' }}>{text}</span>;
            },
        },
    ];

    constructor(props) {
        super(props);
        this.state = {
            currentStep: 0,
            showUploadButton: true,
            nextButton: false,
            fileName: '',
            uploadData: {},
            uploadFile: {},
        };
    }

    downloadWhiteListTemplate = () => {
        const uri = '/bioec/w/device/allocation/download';
        Export.exportAsset('设备分配模板.xlsx', uri);
    };

    getUploadProps = () => {
        const newThis = this;
        const Authorization = storage.getStorage('authorization');
        const clientId = storage.getStorage('clientId');
        // 模块信息，后端统计时使用
        const uploadProps = {
            name: 'file',
            action: `${Api.host.default}//fileservice/w/fileManage/common/file?business=SYSTEM`,
            headers: {
                Authorization,
                clientId,
            },
            // 文件类型筛选
            accept: '.xls,.xlsx',
            // 上传文件前进一步过滤
            beforeUpload(file) {
                if (file.size / 1024 > 10240) {
                    message.error('上传文件不得大于10MB!');
                    return false;
                }
                return true;
            },
            onChange(info) {
                // 上传成功
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 上传成功！`);
                    newThis.setState({
                        showUploadButton: false,
                        fileName: info.file.name,
                        uploadFile: info.file.response.data,
                    });
                    // 上传失败
                } else if (info.file.status === 'error') {
                    // 此处需要自己处理，全局拦截不到，如果不处理不显示提示信息
                    message.error(info.file.response.message);
                }
            },
        };
        return uploadProps;
    };

    closeIcon = () => {
        this.setState({
            showUploadButton: true,
            fileName: '',
        });
    };

    clickToNext = () => {
        const {
            uploadFile: { fullPath },
        } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceAssignment/checkImportFile',
            payload: {
                excelUrl: fullPath,
            },
            callback: () => {
                const { importDetail = {} } = this.props.deviceAssignment;
                const { failureCount, successCount, failureList } = importDetail;
                if (failureCount === 0 && successCount === 0 && failureList.length === 0) {
                    message.warning('上传文件没有数据，请填写正确数据重新上传');
                } else {
                    this.setState((preState) => {
                        return {
                            currentStep: preState.currentStep + 1,
                            uploadData: importDetail,
                            nextButton: failureCount === 0 && successCount === 0 && failureList.length === 0,
                        };
                    });
                }
            },
        });
    };

    clickToUploadFinish = () => {
        const {
            uploadFile: { fullPath },
        } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'deviceAssignment/importAssignment',
            payload: {
                excelUrl: fullPath,
            },
            callback: () => {
                const { importDetail = {} } = this.props.deviceAssignment;
                this.setState({
                    currentStep: 2,
                    uploadData: importDetail,
                });
            },
        });
    };

    reuploadFile = () => {
        this.setState({
            currentStep: 0,
        });
    };

    clickToDeviceAssignmentList = () => {
        router.push('/equipmentManagement/deviceAssignment');
    };

    clickToReupload = () => {
        this.setState({
            currentStep: 0,
            showUploadButton: true,
            fileName: '',
            uploadData: {},
        });
    };

    renderContent = (currentStep) => {
        const { uploadData = {} } = this.state;
        const { failureList = [], successCount = 0, failureCount = 0 } = uploadData || {};
        if (currentStep === 0) {
            const { showUploadButton, fileName } = this.state;
            return (
                <div>
                    <div style={{ height: 180, border: '1px solid rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ backgroundColor: 'rgba(247, 248, 249, 1)', float: 'left', height: '100%', width: 156, paddingLeft: 42, paddingTop: 42, borderRight: '1px solid rgba(0, 0, 0, 0.1)' }}>
                            <span style={{ color: 'rgba(0, 136, 255, 0.3)', fontSize: 60 }}>
                                <Icon type="download" style={{ color: '#E5E5E5', fontSize: 'larger' }}></Icon>
                            </span>
                        </div>
                        <div style={{ float: 'left', padding: 20 }}>
                            <div style={{ marginBottom: 10 }}>
                                <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>下载文件模板，填写导入信息</span>
                            </div>
                            <div>
                                <span style={{ color: 'rgba(0, 0, 0, 0.40)' }}>必填字段：设备编码、设备系列编号、绑定对象编号</span>
                            </div>
                            <div>
                                <span style={{ color: 'rgba(0, 0, 0, 0.40)' }}>禁止重复：设备编码</span>
                            </div>
                            <Button type="primary" onClick={this.downloadWhiteListTemplate} className={styles.downLoadButton}>
                                <span className="iconfont icon-download mr8 fz14"></span>
                                <span>下载模板</span>
                            </Button>
                        </div>
                    </div>
                    <div style={{ marginTop: 30, height: 180, border: '1px solid rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ backgroundColor: 'rgba(247, 248, 249, 1)', float: 'left', height: '100%', width: 156, paddingLeft: 42, paddingTop: 42, borderRight: '1px solid rgba(0, 0, 0, 0.1)' }}>
                            <span style={{ color: 'rgba(0, 136, 255, 0.3)', fontSize: 60 }}>
                                <Icon type="cloud-upload" style={{ color: '#E5E5E5', fontSize: 'larger' }}></Icon>
                            </span>
                        </div>
                        <div style={{ float: 'left', height: '100%', padding: 20 }}>
                            <div style={{ marginBottom: 10 }}>
                                <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>上传填写的白名单信息表</span>
                            </div>
                            <div>
                                <span style={{ color: 'rgba(0, 0, 0, 0.40)' }}>
                                    支持文件格式：
                                    <br />
                                    xls/xlsx （即Excel格式）文件大小不超过10M，数据1000行以内
                                </span>
                            </div>
                            {showUploadButton ? (
                                <Upload name="上传文件" showUploadList={false} {...this.getUploadProps()}>
                                    <div style={{ marginTop: 20 }}>
                                        <a>选择文件</a>
                                    </div>
                                </Upload>
                            ) : null}
                            {!showUploadButton ? (
                                <div style={{ marginTop: 15 }}>
                                    <Icon type="link" style={{ marginRight: 8 }}></Icon>
                                    <span style={{ cursor: 'pointer', color: '#4DB22F', marginRight: 16 }}>{fileName}</span>
                                    <span onClick={this.closeIcon} className={`${styles.iconCloseStyle} icon-delete iconfont mr8 fz14`}></span>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className={styles.centerOver} style={{ marginTop: 30, marginBottom: 10 }}>
                        <Button onClick={this.clickToNext} disabled={showUploadButton} type="primary" className="primaryButtonStyle" style={{ height: 32, width: 74 }}>
                            下一步
                        </Button>
                    </div>
                </div>
            );
        }
        if (currentStep === 1) {
            const { nextButton } = this.state;
            return (
                <div>
                    <div style={{ height: 110, width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)' }}>
                        <div className={styles.centerOver} style={{ backgroundColor: 'rgba(247, 248, 249, 1)', float: 'left', height: '100%', width: 140, borderRight: '1px solid rgba(0, 0, 0, 0.1)' }}>
                            <span className="iconfont icon-success" style={{ fontSize: 36, color: '#05B439' }}></span>
                        </div>
                        <div style={{ float: 'left', padding: 20 }}>
                            <div style={{ marginBottom: 10 }}>
                                <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>可导入【设备分配信息】数量</span>
                            </div>
                            <div>
                                <span style={{ color: '#4DB22F' }}>{successCount}条</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 30, height: 110, width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)' }}>
                        <div className={styles.centerOver} style={{ backgroundColor: 'rgba(247, 248, 249, 1)', float: 'left', height: '100%', width: 140, borderRight: '1px solid rgba(0, 0, 0, 0.1)' }}>
                            <span className="iconfont icon-ask" style={{ fontSize: 36, color: '#FF9A02' }}></span>
                        </div>
                        <div style={{ float: 'left', padding: 20 }}>
                            <div style={{ marginBottom: 10 }}>
                                <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>不可导入【设备分配信息】数量</span>
                            </div>
                            <div>
                                <span style={{ color: '#FF9A00' }}>{failureCount}条</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.centerOver} style={{ marginTop: 24, marginBottom: 24 }}>
                        <Button
                            onClick={() => {
                                return this.clickToUploadFinish();
                            }}
                            disabled={nextButton}
                            type="primary"
                            className="primaryButtonStyle"
                            style={{ height: 32, width: 74, marginRight: 8 }}>
                            下一步
                        </Button>
                        <Button onClick={this.reuploadFile} style={{ height: 32, width: 116 }}>
                            返回重新上传
                        </Button>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>不可导入</span>
                        <Table rowKey="num" columns={this.columns} dataSource={failureList} bordered style={{ marginTop: 16, marginBottom: 16 }}></Table>
                        <span style={{ position: 'absolute', bottom: 24 }}>
                            <span className="iconfont icon-caution mr8 fz14" style={{ color: '#0088FF' }}></span>
                            <span style={{ color: 'rgba(0,0,0,0.65)' }}>共{successCount + failureCount}条数据</span>
                        </span>
                    </div>
                </div>
            );
        }
        if (currentStep === 2) {
            return (
                <div>
                    <div style={{ boxShadow: '0 2px 8px 0 rgba(0,55,103,0.04)', padding: '24px 0', margin: '20px 0', background: '#F9FAFB', borderRadius: 4, border: '1px solid rgba(0, 0, 0, 0.05)' }}>
                        <div className={styles.centerOver}>
                            <span style={{ fontSize: 64, color: 'rgba(50, 184, 76, 1)' }}>
                                <Icon type="check-circle" theme="filled"></Icon>
                            </span>
                        </div>
                        <div className={styles.centerOver}>
                            <span style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 16 }}>批量导入完成</span>
                        </div>
                        <div className={styles.centerOver} style={{ marginTop: 40 }}>
                            <span style={{ color: 'rgba(0, 0, 0, 0.6)' }}>本次导入【设置分配信息】数量</span>
                        </div>
                        <div className={styles.centerOver} style={{ marginTop: 8, color: '#4DB22F' }}>
                            {successCount}条
                        </div>
                    </div>
                    <div className={styles.centerOver} style={{ marginTop: 30, marginBottom: 30 }}>
                        <Button onClick={this.clickToDeviceAssignmentList} type="primary" style={{ height: 32, marginRight: 8 }}>
                            完成
                        </Button>
                        <Button onClick={this.clickToReupload} style={{ height: 32, width: 88 }}>
                            再次导入
                        </Button>
                    </div>
                </div>
            );
        }
        return currentStep;
    };

    // 返回
    goBack = () => {
        router.push('/equipmentManagement/deviceAssignment');
    };

    render() {
        const { currentStep } = this.state;
        return (
            <div>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content page-header-content mt20">
                    <div className="page-header">
                        <div className="fz14 clearfix">
                            <div className="fl w70">
                                <a onClick={this.goBack}>
                                    <span className=" fz10 iconfont icon-return mr4"></span>
                                    <span>返回</span>
                                </a>
                            </div>
                            <Divider type="vertical" className="h30 fl color-font-black10"></Divider>
                            <div className="fl ml20">
                                <span className="fz16 fw500 color-font-title lh30">数据导入</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content mt20">
                    <div className="mb20">
                        <div className={styles.stepsStyle}>
                            <Steps size="small" current={currentStep} labelPlacement="vertical" style={{ marginLeft: '25%', marginTop: 20, marginBottom: 30, width: '50%' }}>
                                <Step title="下载模板/上传文件"></Step>
                                <Step title="数据检测/执行导入"></Step>
                                <Step title="确认结果/完成导入"></Step>
                            </Steps>
                            <div style={{ marginLeft: '20%', width: '60%' }}>{this.renderContent(currentStep)}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Import;
