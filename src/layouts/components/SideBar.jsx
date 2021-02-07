import React, { Component } from 'react';
import router from 'umi/router';
import { Icon, Menu } from 'antd';
import { HxIcon } from '@/components/hx-components';
import logo from '@/assets/images/login/logo.png';
import { menuList } from '@/utils/constants';
import styles from '../index.less';

const { SubMenu } = Menu;
let selectedMenu = ''; // 当前真正url
// 获取当前path获取对应菜单的激活项
const getSelectKeyInMenu = (menuTree, url) => {
    menuTree.forEach((item) => {
        if (url.indexOf(item.path) === 0 && (!item.children || item.children.length === 0)) {
            selectedMenu = item.path;
        } else if (item.children && item.children.length > 0) {
            getSelectKeyInMenu(item.children, url);
        }
    });
};

class SideBar extends Component {
    constructor(props) {
        super(props);
        const curPath = window.location.hash.split('#')[1];
        this.state = {
            activeMenu: curPath, // 当前被选中的菜单，用于激活菜单
        };
        this.clickMenu = this.clickMenu.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const curPath = window.location.hash.split('#')[1];
        // const activeMenu = `/${curPath.split('/')[1]}`;
        getSelectKeyInMenu(menuList, curPath);
        return { ...prevState };
    }

    // 递归生成左侧菜单树,只在一级菜单添加icon
    renderMenu = (data, level) => {
        const { activeMenu } = this.state;
        const { collapsed } = this.props;
        let style = {};
        return data.map((item) => {
            if (item.children && item.children.length > 0) {
                return (
                    // 第一层菜单
                    <SubMenu
                        style={{ color: activeMenu === item.path ? '#32B84C' : 'rgba(0,0,0,.9)' }}
                        key={item.path}
                        title={
                            <span>
                                {level === 1 ? <HxIcon style={{ paddingRight: 0 }} type={item.icon} /> : null}
                                <span>{item.name}</span>
                            </span>
                        }>
                        {this.renderMenu(item.children)}
                    </SubMenu>
                );
            }
            if (collapsed) {
                style = { paddingLeft: 0 };
            } else if (item.icon) {
                style = { paddingLeft: 0 };
            } else if (!item.icon) {
                style = { paddingLeft: 29 };
            }
            return (
                <Menu.Item
                    style={{ padding: 0 }}
                    key={item.path}
                    onClick={() => {
                        return this.clickMenu(item, item.path);
                    }}>
                    <div className={`inner-container ${styles.oneLevel}`} style={{ color: activeMenu === item.path ? '#32B84C' : 'rgba(0,0,0,.9)' }}>
                        {level === 1 && item.icon ? <HxIcon style={{ paddingRight: 0 }} type={item.icon}></HxIcon> : null}
                        <span style={style}>{item.name}</span>
                    </div>
                </Menu.Item>
            );
        });
    };

    // 点击菜单，跳转对应路由。第二个参数是左侧一级菜单path
    clickMenu = (item, path) => {
        const curPath = window.location.hash.split('#')[1];
        if (path === '/dataCockpit') {
            window.open('/#/dataCockpit', '_blank');
            return;
        }
        if (curPath === item.path) {
            return;
        }
        this.setState({ activeMenu: path }, () => {
            router.push(item.path);
            window.scrollTo(0, 0);
        });
    };

    expandIcon = () => {
        return <Icon type="caret-right" className="arrow" style={{ fontSize: 8 }} />;
    };

    render() {
        const { activeMenu } = this.state;
        return (
            <div className="clearfix">
                <div className={styles.menuHeader} style={{ padding: this.props.collapsed ? '15px 6px 10px 6px' : '10px 0' }}>
                    <img src={logo} alt="" className={this.props.collapsed ? styles.menuSmallHeaderLogo : styles.menuHeaderLogo}></img>
                </div>
                <div className={styles.menuBox}>
                    <div className={styles.mainMenu}>
                        <Menu mode="inline" theme="light" style={{ border: 'none' }} selectedKeys={[activeMenu]} subMenuCloseDelay={0.2} subMenuOpenDelay={0.2} forceSubMenuRender>
                            {this.renderMenu(this.props.menuList, 1)}
                        </Menu>
                    </div>
                </div>
            </div>
        );
    }
}

export default SideBar;
