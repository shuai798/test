/*
 * @Author: wangdi
 * @Date: 2020-03-25 14:51:55
 * @Last Modified by: wangdi
 * @Last Modified time: 2020-03-25 16:06:12
 */
import React, { PureComponent } from 'react';
import notFound from '@/assets/images/notFound.png';
import styles from '../index.less';

class NotFound extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="content">
                <div className={styles.imagePosition}>
                    <img src={notFound} alt=""></img>
                    <div className="text-center m20">抱歉，您访问的页面不存在。</div>
                </div>
            </div>
        );
    }
}

export default NotFound;
