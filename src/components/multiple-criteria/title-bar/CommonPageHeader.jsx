import React, { Component } from 'react';
import { Divider } from 'antd';
import router from 'umi/router';

class CommonPageHeader extends Component {
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
                <div className="content page-header-content mt20">
                    <div className="page-header">
                        <div className="fz14 clearfix">
                            <div className="fl w70">
                                <a onClick={this.goBack}>
                                    <span className="iconfont icon-back mr5"></span>
                                    <span>返回</span>
                                </a>
                            </div>
                            <Divider type="vertical" className="h30 fl color-font-black10"></Divider>
                            <div className="fl ml20">
                                <span className="fz16 fw500 color-font-title lh30">
                                    {this.props.detailName}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CommonPageHeader;
