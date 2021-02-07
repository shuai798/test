import React, { Component } from 'react';
import router from 'umi/router';
import { Divider, Button } from 'antd';
import PageHeaderWrapper from '@/components/breadcrumb';
import CommonPageHeader from '@/components/multiple-criteria/title-bar/CommonPageHeader';

class TitleBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    goBack = () => {
        router.goBack(-1);
    }

    render() {
        return (
            <div>
                <PageHeaderWrapper></PageHeaderWrapper>
                {/* <div className="content page-header-content">
                    <div className="mb8">
                        <span className="fz16 fw500 color-font-title lh22">
                            页面标题
                        </span>
                    </div>
                    <div>
                        <span className="fz14 fw400 color-font-main lh20">
                            标题描述文本标题描述文本标题描述文本
                        </span>
                    </div>
                </div>
                <div className="content page-header-content mt20">
                    <div className="page-header">
                        <div className="fz14 clearfix">
                            <div className="fl w70">
                                <a onClick={this.goBack}>
                                    <span className="iconfont icon-back mr5"></span>
                                    <span>返回</span>
                                </a>
                            </div>
                            <Divider type="vertical" className="h50 fl color-font-black10"></Divider>
                            <div className="fl ml20">
                                <div className="mb8">
                                    <span className="fz16 fw500 color-font-title lh22">
                                        页面标题
                                    </span>
                                </div>
                                <div>
                                    <span className="fz14 fw400 color-font-main lh20">
                                        标题描述文本标题描述文本标题描述文本
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                <CommonPageHeader detailName="页面标题"></CommonPageHeader>

                <div className="content page-header-content mt20">
                    <div className="fz14 page-header">
                        <a onClick={this.goBack}>
                            <span className="iconfont icon-back mr5"></span>
                            <span>返回</span>
                        </a>
                    </div>
                </div>
                <div className="content page-header-content mt20">
                    <div className="page-header">
                        <span className="fz14 clearfix">
                            <div className="fl w70" style={{ paddingTop: 3 }}>
                                <a onClick={this.goBack}>
                                    <span className="iconfont icon-back mr5"></span>
                                    <span>返回</span>
                                </a>
                            </div>
                            <Divider type="vertical" className="h30 fl color-font-black10" style={{ paddingTop: 3 }}></Divider>
                            <div className="fl ml20" style={{ paddingTop: 3 }}>
                                <div>
                                    <span className="iconfont icon-guanzhu mr5 mt5" style={{ color: 'rgba(250, 180, 39, 1)' }}></span>
                                    <span className="color-font-black85 fw400">已关注</span>
                                </div>
                            </div>
                            <div className="fr">
                                <Button type="primary" className="mr30">
                                    <span className="iconfont icon-peizhi mr8 fz14"></span>
                                    分配
                                </Button>
                                <span >取消工单</span>
                            </div>
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default TitleBar;
