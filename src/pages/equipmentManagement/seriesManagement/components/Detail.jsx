import React from 'react';
import { Form, Row, Col, Modal, Upload, Spin, Input } from 'antd';
import { connect } from 'dva';
import storage from '@/utils/storage';
import validate from '@/utils/validation';

const FormItem = Form.Item;

@Form.create()
@connect(({ loading, seriesManagement }) => {
    return {
        seriesManagement,
        detailsLoading: loading.effects['seriesManagement/getDetailRecord'],
    };
})
class Details extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            seriesInfo: {},
            previewVisible: false,
            previewImage: '',
        };
    }

    componentDidMount() {
        const { juniorInfo, dispatch } = this.props;
        dispatch({
            type: 'seriesManagement/getDetailRecord',
            payload: juniorInfo.id,
            callback: (res) => {
                this.setState(
                    {
                        seriesInfo: res.data,
                    },
                    () => {
                        const { seriesInfo } = this.state;
                        if (seriesInfo?.imageUrl) {
                            const fileList = [
                                {
                                    uid: '-1',
                                    name: 'image.png',
                                    status: 'done',
                                    url: storage.getStorage('downloadUrl') + seriesInfo.imageUrl,
                                },
                            ];
                            this.setState({ fileList });
                        }
                    },
                );
            },
        });
    }

    handlePreview = async (file) => {
        const currentFile = file;
        this.setState({
            previewImage: currentFile.url,
            previewVisible: true,
        });
    };

    handleCancel = () => {
        return this.setState({ previewVisible: false });
    };

    render() {
        const { fileList, seriesInfo, previewVisible, previewImage } = this.state;
        const { showDetails, detailsLoading } = this.props;
        return (
            <Modal width={770} title="系列详情" maskClosable={false} visible destroyOnClose confirmLoading={this.props.editLoading} footer={null} onCancel={showDetails}>
                <Spin spinning={detailsLoading}>
                    <div className="formList80">
                        <Form>
                            <Row type="flex" gutter={{ md: 8, lg: 12, xl: 24 }}>
                                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="上级系列">{seriesInfo && seriesInfo.parentName ? seriesInfo.parentName : ''}</FormItem>
                                </Col>
                            </Row>
                            <Row type="flex" gutter={{ md: 8, lg: 12, xl: 24 }}>
                                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="系列名称">{seriesInfo && seriesInfo.name ? seriesInfo.name : ''}</FormItem>
                                </Col>
                                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="系列编码">{seriesInfo && seriesInfo.code ? seriesInfo.code : ''}</FormItem>
                                </Col>
                            </Row>
                            <Row type="flex" gutter={{ md: 8, lg: 12, xl: 24 }}>
                                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="维保阈值">{seriesInfo && seriesInfo.maintenanceThreshold ? seriesInfo.maintenanceThreshold : ''}</FormItem>
                                </Col>
                                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="报废阈值">{seriesInfo && seriesInfo.scrapThreshold ? seriesInfo.scrapThreshold : ''}</FormItem>
                                </Col>
                            </Row>
                            <Row type="flex" gutter={{ md: 8, lg: 12, xl: 24 }}>
                                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="过期时长">{seriesInfo && seriesInfo.expiredTimeNum ? seriesInfo.expiredTimeNum : ''}</FormItem>
                                </Col>
                                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="固件系列">
                                        {seriesInfo && seriesInfo.firmwareSeries ? seriesInfo.firmwareSeries : ''}
                                    </FormItem>
                                </Col>
                                <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <FormItem label="系列图片">
                                        <Upload showUploadList={{ showPreviewIcon: true, showRemoveIcon: false, showDownloadIcon: false }} accept=".jpg,.png,.gif" listType="picture-card" fileList={fileList} onPreview={this.handlePreview}></Upload>
                                        <Modal maskClosable={false} visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                            <img alt="example" style={{ width: '100%' }} src={previewImage}></img>
                                        </Modal>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Spin>
            </Modal>
        );
    }
}

export default Details;
