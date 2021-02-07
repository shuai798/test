import React, { Component } from 'react';
import { Icon, Dropdown, Menu } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import storage from '@/utils/storage';
import AvatarDropdown from './AvatarDropdown';
import styles from '../index.less';

@connect(({ login }) => {
    return {
        login,
    };
})
class HeaderContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuStatus: this.props.collapsed,
            visible: false,
        };
    }

    componentDidMount() {
    }

    toggle = () => {
        this.setState(
            preState => {
                return { menuStatus: !preState.menuStatus };
            },
            () => {
                this.props.clickIcon(this.state.menuStatus);
            },
        );
    };

    handleVisibleChange = flag => {
        this.setState({
            visible: flag,
        });
    };

    handleProjectMenuClick = ({ key }) => {
        this.setState({
            visible: false,
        });
        const { dispatch } = this.props;
        const systemList = JSON.parse(storage.getStorage('systemList')) || [];
        let selectedSystem = JSON.parse(storage.getStorage('choosedSystem')) || '';
        systemList.forEach(item => {
            if (item.id === key) {
                selectedSystem = item;
            }
        });
        dispatch({
            type: 'login/authMe',
            payload: { clientId: selectedSystem.id },
            callback: () => {
                storage.saveStorage('choosedSystem', selectedSystem);
                const curPath = window.location.hash.split('#')[1];
                const nextPath = '/welcome';
                if (curPath === nextPath) {
                    router.replace(nextPath);
                } else {
                    router.push(nextPath);
                }
                // 设置当前选中的系统id，参数加在header里
                storage.saveStorage('clientId', selectedSystem.id);
            },
        });
    };

    render() {
        const systemList = storage.getStorage('systemList') || [];
        const selectedSystem = storage.getStorage('choosedSystem') || '';
        const menu = (
            <Menu onClick={this.handleProjectMenuClick}>
                {systemList.length > 0 && systemList.map(item => {
                    return (
                        <Menu.Item key={item.id}>{item.name}</Menu.Item>
                    );
                })}
            </Menu>
        );
        return (
            <div className="clearfix bg-header" style={{ height: 60 }}>
                <Icon className={styles.collapsedIcon} type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle}></Icon>
                <div className="fz16 ml32 color-font-title fl">
                </div>
                <div className={styles.avatarPosition}>
                    <div className="mr16 dib">
                        {
                            systemList.length > 1 ?
                                (
                                    <Dropdown overlay={menu} onVisibleChange={this.handleVisibleChange} visible={this.state.visible} placement="bottomCenter" trigger={['click']}>
                                        <a className="ant-dropdown-link" onClick={e => { return e.preventDefault(); }}>
                                            {selectedSystem ? selectedSystem.name : ''}<Icon type="down" />
                                        </a>
                                    </Dropdown>
                                ) :
                                (
                                    <span className={styles.mainMenu}>
                                        <span style={{ marginLeft: 5, marginRight: 5, fontSize: 16 }}>{selectedSystem ? selectedSystem.name : ''}</span>
                                    </span>
                                )
                        }
                    </div>
                    <AvatarDropdown></AvatarDropdown>
                </div>
            </div>
        );
    }
}

export default HeaderContent;
