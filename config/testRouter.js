export default [
    {
        path: '/test/test1',
        name: 'test1',
        routes: [
            {
                path: '/test/test1/test2',
                name: 'test2',
                routes: [
                    {
                        path: '/test/test1/test2/test3',
                        name: 'test3',
                        component: '../../src/components/placeholder-page/welcome/index',
                    },
                    {
                        path: '/test/test1/test2/test4',
                        name: 'test4',
                        component: '../../src/components/placeholder-page/welcome/index',
                    },
                ],
            },
        ],
    },
];