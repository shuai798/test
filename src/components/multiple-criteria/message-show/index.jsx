import React, { Component } from 'react';
import { Divider } from 'antd';
import PageHeaderWrapper from '@/components/breadcrumb';
import DetailDescriptions from './components/DetailDescriptions';
import indexStyle from './index.less';

class MessageShow extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <PageHeaderWrapper></PageHeaderWrapper>
                <div className="content">
                    <div className="mb24">
                        <span className="fz16 fw500 color-font-black85 lh22">
                            物业方信息
                        </span>
                    </div>
                    <div className="mb10">
                        <span>
                            <Divider type="vertical" className={indexStyle['divider-title']}></Divider>
                        客户公司信息
                        </span>
                    </div>
                    <DetailDescriptions></DetailDescriptions>
                </div>
            </div>
        );
    }
}

export default MessageShow;
