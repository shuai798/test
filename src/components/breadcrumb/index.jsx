import React from 'react';
import { withRouter } from 'react-router-dom';
import { Breadcrumb } from 'antd';
// import { menuList } from '@/utils/constants.js';
import routers from '../../../config/router';
import styles from './index.less';


@withRouter
export default class NewBreadcrumb extends React.Component {
    tempBreadcrumbList = []; // 方法里临时保存被找到的面包屑路径

    realBreadcrumbList = []; // 保存被找到的面包屑路径

    constructor(props) {
        super(props);
        this.state = {
            extraBreadcrumbItems: '',
        };
    }

    componentDidMount() {
        this.getPath();
    }

    getPath = () => {
        this.tempBreadcrumbList = [];
        this.realBreadcrumbList = [];
        this.getPathnameInMenulist(routers, this.props.match.path);
        const breadcrumbItems = this.realBreadcrumbList.map(item => {
            return (
                <Breadcrumb.Item key={item}>
                    <span>{item}</span>
                </Breadcrumb.Item>
            );
        });

        this.setState({ extraBreadcrumbItems: breadcrumbItems });
    };

    getPathnameInMenulist = (routerList, url) => {
        if (!url || url === '/') {
            return;
        }
        // 遍历菜单，根据当前url查找到它菜单中的路径
        routerList.forEach(router => {
            // 得到值后 取出来
            if (router.path !== '/' && url.indexOf(router.path) === 0) {
                this.tempBreadcrumbList.push(router.name);
                this.realBreadcrumbList = JSON.parse(JSON.stringify(this.tempBreadcrumbList));
            }
            if (router.path !== url && router.routes && router.routes.length > 0) {
                this.getPathnameInMenulist(router.routes, url);
            }
        });
    };

    render() {
        return (
            <div className={styles.breadcrumb}>
                <Breadcrumb>
                    {this.state.extraBreadcrumbItems}
                </Breadcrumb>
            </div>
        );
    }
}
