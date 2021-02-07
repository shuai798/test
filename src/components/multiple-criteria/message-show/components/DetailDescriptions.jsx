import React, { Component } from 'react';
import { Descriptions } from 'antd';

const DescriptionsItem = Descriptions.Item;

class DetailDescriptions extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="descriptions140">
                <Descriptions column={{ lg: 3, md: 2, sm: 1 }}>
                    <DescriptionsItem label="企业名称" column>
                        <span>西安华信智慧数字科技有限公司</span>
                    </DescriptionsItem>
                    <DescriptionsItem label="注册资本">
                        <span>3000万</span>
                    </DescriptionsItem>
                    <DescriptionsItem label="成立日期">
                        <span>2018.06.01</span>
                    </DescriptionsItem>
                    <DescriptionsItem label="营业状态">
                        <span>在业</span>
                    </DescriptionsItem>
                    <DescriptionsItem label="实缴资本">
                        <span>3000万</span>
                    </DescriptionsItem>
                    <DescriptionsItem label="统一社会信用代码">
                        <span>879760091214</span>
                    </DescriptionsItem>
                    <DescriptionsItem label="注册地址" span={3}>
                        <span>陕西省西安市雁塔区云水一路与天谷八路交汇处云汇谷软件新城二期C2栋15层</span>
                    </DescriptionsItem>
                </Descriptions>
            </div >
        );
    }
}

export default DetailDescriptions;
