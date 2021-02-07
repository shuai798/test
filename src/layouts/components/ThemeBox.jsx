import React, { Component } from 'react';
import { Icon } from 'antd';
import styles from '../index.less';
import storage from '@/utils/storage';

class ThemeBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: '',
        };
    }

    componentDidMount = () => {
        const primaryColor = storage.getStorage('primaryColor');
        if (primaryColor) {
            this.setState({
                checked: primaryColor,
            });
        } else {
        }
    }

    checkClick = color => {
        const { changeCheckedColor } = this.props;
        if (color !== this.state.checked) {
            changeCheckedColor(color);
        }
        this.setState({
            checked: color,
        });
    }

    render() {
        const { colorList = [] } = this.props;
        const { checked } = this.state;
        const colorDivList = colorList.map(colorInfo => {
            const display = checked === colorInfo ? 'block' : 'none';
            return <div key={colorInfo} className={styles.colorDiv} style={{ backgroundColor: colorInfo }} onClick={() => { return this.checkClick(colorInfo); }}>
                <span className="color-white" style={{ display }}>
                    <Icon type="check"></Icon>
                </span>
            </div>;
        });
        return (
            <div className="clearfix">
                {colorDivList}
            </div>
        );
    }
}

export default ThemeBox;
