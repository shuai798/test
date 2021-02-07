import testRouter from './testRouter';

const routes = [
    // {
    //     path: '/',
    //     redirect: '/commonIntro/basic/introduce',
    // },
    {
        path: '/',
        name: '登录',
        component: '../../src/pages/login/index',
    },
    {
        path: '/dataCockpit',
        name: '数据驾驶舱',
        component: '../../src/pages/dataCockpit/index',
    },
    {
        path: '/forgetPassword',
        name: '忘记密码',
        component: '../../src/pages/login/components/ForgetPassword',
    },
    {
        path: '/login',
        name: '登录',
        component: '../../src/pages/login/index',
    },
    {
        path: '/',
        name: '布局',
        component: '../../src/layouts/index',
        routes: [
            {
                path: '/test',
                name: 'test',
                routes: testRouter,
            },
            {
                path: '/welcome',
                component: '../../src/components/placeholder-page/welcome/index',
                name: '欢迎页',
            },
            {
                path: '/notFound',
                component: '../../src/components/placeholder-page/not-found',
                name: '找不到资源',
            },
            {
                path: '/comingSoon',
                component: '../../src/components/placeholder-page/coming-soon',
                name: '即将推出',
            },
            {
                icon: 'icon-home',
                path: '/home',
                name: '首页',
                component: '../../src/pages/home/index',
            },
            {
                path: '/dataCockpit',
                name: '数据驾驶舱',
            },
            {
                path: '/monitoringCenter',
                name: '监控中心',
                routes: [
                    {
                        path: '/monitoringCenter/pendingEvent',
                        name: '待处理事件',
                        component: '../../src/pages/monitoringCenter/pendingEvent/index',
                    },
                    {
                        path: '/monitoringCenter/processedEvent',
                        name: '已处理事件',
                        component: '../../src/pages/monitoringCenter/processedEvent/index',
                    },
                    {
                        path: '/monitoringCenter/equipmentFailureRecord',
                        name: '设备故障记录',
                        component: '../../src/pages/monitoringCenter/equipmentFailureRecord/index',
                    },
                ],
            },
            {
                path: '/equipmentManagement',
                name: '设备管理',
                routes: [
                    {
                        path: '/equipmentManagement/deviceCodeManagement',
                        name: '设备编码管理',
                        component: '../../src/pages/equipmentManagement/deviceCodeManagement/index',
                    },
                    {
                        path: '/equipmentManagement/deviceAssignment',
                        name: '设备分配',
                        component: '../../src/pages/equipmentManagement/deviceAssignment/index',
                    },
                    {
                        path: '/equipmentManagement/deviceAssignment/addDeviceAssignment',
                        name: '新增分配',
                        component: '../../src/pages/equipmentManagement/deviceAssignment/components/AddForm',
                    },
                    {
                        path: '/equipmentManagement/deviceAssignment/import',
                        name: '数据导入',
                        component: '../../src/pages/equipmentManagement/deviceAssignment/components/Import',
                    },
                    {
                        path: '/equipmentManagement/deviceList',
                        name: '设备列表',
                        component: '../../src/pages/equipmentManagement/deviceList/index',
                    },
                    {
                        path: '/equipmentManagement/batchOperation',
                        name: '批量操作',
                        component: '../../src/pages/equipmentManagement/batchOperation/index',
                    },
                    {
                        path: '/equipmentManagement/batchOperation/details',
                        name: '操作详情',
                        component: '../../src/pages/equipmentManagement/batchOperation/components/Details',
                    },
                    {
                        path: '/equipmentManagement/batchOperation/addForm',
                        name: '批量操作',
                        component: '../../src/pages/equipmentManagement/batchOperation/components/addForm',
                    },
                    {
                        path: '/equipmentManagement/deviceList/deviceDetail',
                        name: '设备详情',
                        component: '../../src/pages/equipmentManagement/deviceList/components/detail/DeviceDetail',
                    },
                    {
                        path: '/equipmentManagement/seriesManagement',
                        name: '系列管理',
                        component: '../../src/pages/equipmentManagement/seriesManagement/index',
                    },
                ],
            },
            {
                path: '/statisticAnalysis',
                name: '统计分析',
                routes: [
                    {
                        path: '/statisticAnalysis/eventStatistics',
                        name: '事件统计',
                        component: '../../src/pages/statisticAnalysis/eventStatistics/index',
                    },
                    {
                        path: '/statisticAnalysis/deviceAccessStatistics',
                        name: '设备接入统计',
                        component: '../../src/pages/statisticAnalysis/deviceAccessStatistics/index',
                    },
                    {
                        path: '/statisticAnalysis/equipmentModelStatistics',
                        name: '设备型号统计',
                        component: '../../src/pages/statisticAnalysis/equipmentModelStatistics/index',
                    },
                    {
                        path: '/statisticAnalysis/trafficBehaviorStatistics',
                        name: '通行故障统计',
                        component: '../../src/pages/statisticAnalysis/trafficBehaviorStatistics/index',
                    },
                    {
                        path: '/statisticAnalysis/trafficBehaviorStatistics/troubleType',
                        name: '故障类型统计',
                        component: '../../src/pages/statisticAnalysis/trafficBehaviorStatistics/components/FaultType',
                    },
                    {
                        path: '/statisticAnalysis/trafficBehaviorStatistics/faultTypeNum',
                        name: '故障型号统计',
                        component: '../../src/pages/statisticAnalysis/trafficBehaviorStatistics/components/FaultTypeNum',
                    },
                    {
                        path: '/statisticAnalysis/customerDistributionStatistics',
                        name: '客户分布统计',
                        component: '../../src/pages/statisticAnalysis/customerDistributionStatistics/index',
                    },
                    {
                        path: '/statisticAnalysis/customerDistributionStatistics/IndustryMore',
                        name: '客户行业统计',
                        component: '../../src/pages//statisticAnalysis/customerDistributionStatistics/components/IndustryMore',
                    },
                ],
            },
            {
                path: '/customerManagement',
                name: '客户管理',
                routes: [
                    {
                        path: '/customerManagement/eventStatistics',
                        name: '客户管理',
                        component: '../../src/pages/customerManagement/accountManagement/index',
                    },
                    {
                        path: '/customerManagement/details',
                        name: '详情',
                        component: '../../src/pages/customerManagement/accountManagement/components/Details',
                    },
                    {
                        path: '/customerManagement/setting',
                        name: '设置',
                        component: '../../src/pages/customerManagement/accountManagement/components/Setting',
                    },
                    {
                        path: '/customerManagement/repairsRecords',
                        name: '报修记录',
                        component: '../../src/pages/customerManagement/repairsRecords/index',
                    },
                    {
                        path: '/customerManagement/trackIntention',
                        name: '意向跟踪',
                        component: '../../src/pages/customerManagement/trackIntention/index',
                    },
                ],
            },
            {
                path: '/accountManagement',
                name: '账户管理',
                routes: [
                    {
                        path: '/accountManagement/accountKeeper',
                        name: '账户管理',
                        component: '../../src/pages/accountManagement/accountKeeper/index',
                    },
                    {
                        path: '/accountManagement/organizationChart',
                        name: '组织架构',
                        component: '../../src/pages/accountManagement/organizationChart/index',
                    },
                ],
            },
            {
                path: '/systemManagement',
                name: '系统管理',
                routes: [
                    {
                        path: '/systemManagement/personalCenter',
                        name: '个人中心',
                        component: '../../src/pages/systemManagement/personalCenter/index',
                    },
                    {
                        path: '/systemManagement/roleManagement',
                        name: '角色管理',
                        component: '../../src/pages/systemManagement/roleManagement/index',
                    },
                    {
                        path: '/systemManagement/dataDictionary',
                        name: '数据字典',
                        component: '../../src/pages/systemManagement/dataDictionary/index',
                    },
                    {
                        path: '/systemManagement/operationLog',
                        name: '操作日志',
                        component: '../../src/pages/systemManagement/operationLog/index',
                    },
                    {
                        path: '/systemManagement/systemLog',
                        name: '系统日志',
                        component: '../../src/pages/systemManagement/systemLog/index',
                    },
                ],
            },
            {
                component: '../../src/components/placeholder-page/not-found',
            },
        ],
    },
];
export default routes;
