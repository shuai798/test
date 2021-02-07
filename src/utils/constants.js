const menuList = [
    {
        path: '/home',
        name: '首页',
        icon: 'icon-home',
    },
    {
        path: '/dataCockpit',
        name: '数据驾驶舱',
        icon: 'icon-data-from-the-cockpit',
    },
    {
        path: '/monitoringCenter',
        name: '监控中心',
        icon: 'icon-monitoring-center',
        children: [
            {
                path: '/monitoringCenter/pendingEvent',
                name: '待处理事件',
            },
            {
                path: '/monitoringCenter/processedEvent',
                name: '已处理事件',
            },
            {
                path: '/monitoringCenter/equipmentFailureRecord',
                name: '设备故障记录',
            },
        ],
    },
    {
        path: '/equipmentManagement',
        name: '设备管理',
        icon: 'icon-equipment-management',
        children: [
            {
                path: '/equipmentManagement/deviceCodeManagement',
                name: '设备编码管理',
            },
            {
                path: '/equipmentManagement/deviceAssignment',
                name: '设备分配',
            },
            {
                path: '/equipmentManagement/deviceList',
                name: '设备列表',
            },
            {
                path: '/equipmentManagement/batchOperation',
                name: '批量操作',
            },
            {
                path: '/equipmentManagement/seriesManagement',
                name: '系列管理',
            },
        ],
    },
    {
        path: '/statisticAnalysis',
        name: '统计分析',
        icon: 'icon-statistic-analysis',
        children: [
            {
                path: '/statisticAnalysis/eventStatistics',
                name: '事件统计',
            },
            {
                path: '/statisticAnalysis/deviceAccessStatistics',
                name: '设备接入统计',
            },
            {
                path: '/statisticAnalysis/equipmentModelStatistics',
                name: '设备型号统计',
            },
            {
                path: '/statisticAnalysis/trafficBehaviorStatistics',
                name: '通行故障统计',
            },
            {
                path: '/statisticAnalysis/customerDistributionStatistics',
                name: '客户分布统计',
            },
        ],
    },
    {
        path: '/customerManagement',
        name: '客户管理',
        icon: 'icon-customer-management',
        children: [
            {
                path: '/customerManagement/eventStatistics',
                name: '客户管理',
            },
            {
                path: '/customerManagement/repairsRecords',
                name: '报修记录',
            },
            {
                path: '/customerManagement/trackIntention ',
                name: '意向跟踪',
            },
        ],
    },
    {
        path: '/accountManagement',
        name: '账户管理',
        icon: 'icon-account-management',
        children: [
            {
                path: '/accountManagement/accountKeeper',
                name: '账户管理',
            },
            {
                path: '/accountManagement/organizationChart',
                name: '组织架构',
            },
        ],
    },
    {
        path: '/systemManagement',
        name: '系统管理',
        icon: 'icon-system-management',
        children: [
            {
                path: '/systemManagement/personalCenter',
                name: '个人中心',
            },
            {
                path: '/systemManagement/roleManagement',
                name: '角色管理',
            },
            {
                path: '/systemManagement/dataDictionary',
                name: '数据字典',
            },
            {
                path: '/systemManagement/operationLog',
                name: '操作日志',
            },
            {
                path: '/systemManagement/systemLog',
                name: '系统日志',
            },
        ],
    },
];

export { menuList };
