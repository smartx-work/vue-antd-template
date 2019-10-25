import BasicLayout from '@/components/basic-layout'
import RouterView from '@/components/router-view'
export default [
    {
        path: '',
        component: BasicLayout,
        redirect: '/merchant/selector',
        children: [
            {
                menu: true,
                path: 'merchant/selector',
                authIgnore: true,
                meta: { label: '商家列表', icon: 'home' },
                component: () => import(/* webpackChunkName: "index" */ '@/views/merchant/selector'),
            },
        ],
    },

    {
        menu: true,
        path: 'merchant',
        component: BasicLayout,
        meta: { icon: 'solution', label: '商家管理', retain: true },
        children: [
            /* {
                disabled: true,
                menu: true,
                path: 'information',
                component: () => import('@/views/merchant/information/editor'),
                meta: { label: '信息管理' },
            }, */
            {
                menu: true,
                authIgnore: true,
                path: 'certification',
                component: () => import('@/views/merchant/certification'),
                meta: { label: '实名认证' },
            },
            {
                path: 'electronic-contract',
                component: RouterView,
                meta: { label: '合同管理' },
                children: [
                    {
                        menu: true,
                        authIgnore: true,
                        path: 'will-effective',
                        component: () => import('@/views/merchant/electronic-contract/will-effective'),
                        meta: { label: '待生效合同' },
                    },
                    {
                        menu: true,
                        authIgnore: true,
                        path: 'has-effective',
                        component: () => import('@/views/merchant/electronic-contract/has-effective'),
                        meta: { label: '生效中合同' },
                    },
                    {
                        menu: true,
                        authIgnore: true,
                        path: 'lose-effective',
                        component: () => import('@/views/merchant/electronic-contract/lose-effective'),
                        meta: { label: '已失效合同' },
                    },
                    {
                        authIgnore: true,
                        path: 'detail',
                        component: () => import('@/views/merchant/electronic-contract/detail'),
                        meta: { label: '合同详情' },
                    },
                ],
            },
        ],
    },

]
