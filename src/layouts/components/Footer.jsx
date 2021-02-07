import React, { Component } from 'react';
import styles from '../index.less';

class FooterContent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() { }

    render() {
        return <div className={styles.footer}>Copyright ©  熵基科技股份有限公司 版权所有</div>;
    }
}

export default FooterContent;
