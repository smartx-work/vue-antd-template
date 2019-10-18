import BasicLayout from '@/components/basic-layout'
export default [
    {
        path: 'login',
        name: 'login',
        authIgnore: true,
        component: () => import(/* webpackChunkName: "index" */ '@/views/roots/login'),
    },
    {
        path: '',
        component: BasicLayout,
        redirect: '/home',
        children: [
            {
                path: 'home',
                name: 'home',
                authIgnore: true,
                meta: { label: '首页' },
                component: () => import(/* webpackChunkName: "index" */ '@/views/home'),
            },
            {
                path: 'dashboard',
                menu: true,
                meta: { label: '概况', icon: 'dashboard' },
                component: () => import(/* webpackChunkName: "index" */ '@/views/dashboard'),
            },
            {
                path: 'merchant-list',
                meta: { label: '商家列表' },
                component: () => import(/* webpackChunkName: "index" */ '@/views/merchant-list'),
            },

            {
                path: 'page403',
                name: 'page403',
                authIgnore: true,
                meta: { label: '无权限提示页' },
                component: () => import(/* webpackChunkName: "index" */ '@/views/roots/page403'),
            },
            {
                path: 'page404',
                name: 'page404',
                meta: { label: '访问页不存在' },
                authIgnore: true,
                component: () => import(/* webpackChunkName: "index" */ '@/views/roots/page404'),
            },
        ],
    },
]
