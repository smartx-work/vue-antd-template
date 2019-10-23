import BasicLayout from '@/components/basic-layout'

export default [
    {
        name: 'login',
        path: 'login',
        loginIgnore: true,
        component: () => import(/* webpackChunkName: "index" */ '@/views/login'),
    },
    {
        path: '',
        component: BasicLayout,
        redirect: '/home',
        children: [
            {
                name: 'home',
                path: 'home',
                authIgnore: true,
                meta: { label: '首页' },
                component: () => import(/* webpackChunkName: "index" */ '@/views/roots/home'),
            },
            {
                name: 'page403',
                path: 'page403',
                authIgnore: true,
                meta: { label: '无权限提示页' },
                component: () => import(/* webpackChunkName: "index" */ '@/views/roots/page403'),
            },
            {
                path: 'page404',
                name: 'page404',
                meta: { label: '404提示页' },
                authIgnore: true,
                component: () => import(/* webpackChunkName: "index" */ '@/views/roots/page404'),
            },
        ],
    },
    {
        menu: true,
        path: '',
        component: BasicLayout,
        meta: { label: '商家入口', icon: 'home' },
        redirect: '/merchant-selector',
        children: [
            {
                menu: true,
                name: 'merchant-selector',
                path: 'merchant-selector',
                authIgnore: true,
                meta: { label: '商家列表', icon: 'home' },
                component: () => import(/* webpackChunkName: "index" */ '@/views/merchant-selector'),
            },
        ],
    },
]
