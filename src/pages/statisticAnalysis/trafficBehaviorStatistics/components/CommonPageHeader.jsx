import React, { Component } from 'react';
import { Divider } from 'antd';
import router from 'umi/router';
import { HxIcon } from '@/components/hx-components';

class CommonPageHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    goBack = () => {
        router.goBack(-1);
    };

    render() {
        return (
            <div>
                <div className="content page-header-content mt16">
                    <div className="page-header">
                        <div className="fz14 clearfix">
                            <div className="fl mr12">
                                <a onClick={this.goBack}>
                                    <span className=" fz10 iconfont icon-return mr4"></span>
                                    <span>返回</span>
                                </a>
                            </div>
                            <Divider type="vertical" className="h22 fl color-font-black10"></Divider>
                            <div className="fl ml12">
                                <span className="fz16 color-font-title lh22">故障类型统计</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CommonPageHeader;
