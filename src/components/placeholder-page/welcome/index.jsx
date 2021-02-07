/*
 * @Author: wangdi
 * @Date: 2020-03-25 14:52:21
 * @Last Modified by: wangdi
 * @Last Modified time: 2020-03-25 16:06:34
 */
import React, { PureComponent } from 'react';
import welcome from '@/assets/images/Welcome.png';
import styles from '../index.less';

class Welcome extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div style={{ width: '100%', height: '100%', paddingTop: 24 }}>
                <div className={styles.imagePosition}>
                    <img src={welcome} alt=""></img>
                    <div className="text-center m20">您好，欢迎开启智慧云厦！</div>
                </div>
            </div>
        );
    }
}

export default Welcome;
