import routes from './router';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import webpackPlugin from './webpack-plugin.config';

const routesCreate = routes;
if (process.env.NODE_ENV === 'development') {
    routesCreate.unshift({
        path: '/generator',
        name: '生成',
        component: '../../generator/pages/index',
    });
}

const plugin = [
    [
        'umi-plugin-react',
        {
            dva: true,
            antd: true,
        },
    ],
];
export default {
    history: 'hash',
    targets: {
        ie: 11,
    },
    proxy: {
        /*********** 自动生成代码代理 start ****************/
        '/generator': {
            target: 'http://localhost:3000/',
            changeOrigin: true,
        },
        /*********** 自动生成代码代理 end ****************/

        //业务代码代理
        '/bart': {
            // target: 'http://192.168.10.57:3010/',
            target: 'http://192.168.101.110:3010/',
            // target: 'http://192.168.10.84:3010/',
            changeOrigin: true,
            pathRewrite: {
                '^/bart': '',
            },
        },
        '/api': {
            target: 'https://www.tianqiapi.com/',
            ws: true,
            changeOrigin: true,
        },
        '/weather': {
            target: 'http://gfapi.mlogcn.com',
            ws: true,
            changeOrigin: true,
        },
    },
    plugins: plugin,
    routes: routesCreate,
    theme: defaultSettings.defaultTheme,
    chainWebpack: webpackPlugin,
};
