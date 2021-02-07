import React, { Component } from 'react';
import { Layout, ConfigProvider } from 'antd';
import { Redirect } from 'umi';
import user from '@/utils/user';
import { connect } from 'dva';
import zhCN from 'antd/es/locale/zh_CN';
import HeaderContent from './components/Header';
import FooterContent from './components/Footer';
import SideBarContent from './components/SideBar';
import styles from './index.less';

const { Header, Footer, Sider } = Layout;

@connect(({ login }) => {
    return {
        login,
    };
})
class BasicLayout extends Component {
    constructor(props) {
        super(props);
        this.clickIcon = this.clickIcon.bind(this);
        this.state = {
            collapsed: false,
            menuList: [],
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        const clientId = sessionStorage.getItem('clientId');
        dispatch({
            type: 'login/menuList',
            payload: { clientId },
            callback: (response) => {
                this.setState({
                    menuList: response,
                });
            },
        });
    }

    clickIcon(data) {
        this.setState(
            {
                collapsed: data,
            },
            () => {},
        );
    }

    render() {
        const { collapsed } = this.state;
        const isLogin = user.checkLogin();
        return (
            <ConfigProvider locale={zhCN}>
                <Layout className={styles.layout}>
                    <Sider trigger={null} collapsible collapsed={collapsed} className={styles.layoutSiderBar} width={collapsed ? 80 : 240} theme="light">
                        <SideBarContent menuList={this.state.menuList} collapsed={collapsed}></SideBarContent>
                    </Sider>
                    <Layout style={{ overflow: 'hidden', height: '100%' }}>
                        <Header className={styles.layoutHeader}>
                            <HeaderContent collapsed={collapsed} clickIcon={this.clickIcon}></HeaderContent>
                        </Header>
                        <Layout style={{ height: 'calc(100vh - 60px)', overflow: 'auto', padding: '0 24px' }}>
                            {/*<div style={{ flex: 1 }}>{isLogin ? this.props.children : <Redirect to="/login" />}</div>*/}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{isLogin ? this.props.children : <Redirect to="/login" />}</div>
                            <Footer>
                                <FooterContent></FooterContent>
                            </Footer>
                        </Layout>
                    </Layout>
                </Layout>
            </ConfigProvider>
        );
    }
}

export default BasicLayout;
