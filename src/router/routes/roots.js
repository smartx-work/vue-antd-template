import BasicLayout from '@/components/basic-layout'

export default [
    {
        name: 'login',
        path: 'login',
        loginIgnore: true,
        component: () => import(/* webpackChunkName: "index" */ '@/views/login'),
    },
    {
        name: 'index',
        path: '',
        component: BasicLayout,
        redirect: '/dashboard',
        children: [
            {
                name: 'dashboard',
                path: 'dashboard',
                authIgnore: true,
                menu: true,
                meta: { icon: 'dashboard', label: '概览' },
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

]
