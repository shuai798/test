/*
 * @Author: wangdi
 * @Date: 2020-03-25 14:51:25
 * @Last Modified by: wangdi
 * @Last Modified time: 2020-03-25 16:02:16
 */
import React, { PureComponent } from 'react';
import comingSoon from '@/assets/images/comingSoon.png';
import styles from '../index.less';

class ComingSoon extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="content">
                <div className={styles.imagePosition}>
                    <img src={comingSoon} alt=""></img>
                    <div className="text-center m20">即将推出，敬请关注。</div>
                </div>
            </div>
        );
    }
}

export default ComingSoon;
