import Vue from 'vue'
import Router from 'vue-router'
import pathToRegexp from 'path-to-regexp'

export default function (option) {
    const { mode, base, routes, state } = option
    const { nameRoutes, allRoutes, loginIgnoreRoutes, authIgnoreRoutes } = routesFormat(routes)

    const router = new Router({
        mode,
        base,
        routes: allRoutes,
    })

    let authoritys

    router.beforeEach((to, from, next) => {
        const { path } = to
        const { isLogin } = state

        // 处理登录白名单
        if (loginIgnoreRoutes.some(route => route.pathRegexp.test(path))) {
            if (nameRoutes.login.pathRegexp.test(path) && isLogin) { // 已登录的情况下，登录页直接跳转到首页
                return next(nameRoutes.home)
            }
            return next()
        }

        // 未登录，去登录页
        if (!isLogin) {
            return next(nameRoutes.login)
        }

        // 初始化权限配置
        if (!authoritys) {
            authoritys = typeof state.merchantAuthoritys === 'string' ? state.authoritys.split(',').reduce((results, item) => (results[item] = true, results), {}) : state.merchantAuthoritys
        }

        // 处理权限白名单
        if (authIgnoreRoutes.some(route => route.pathRegexp.test(path))) {
            return next()
        }

        // 有权限
        if (path in authoritys) {
            return next()
        }

        // 无权限
        return next(nameRoutes.page403)
    })

    Vue.use(Router)

    Vue.prototype.$auth = {
        has (id = '') {
            if (!authoritys) {
                return false
            }

            // 假如参数不带路径，则使用当前环境中的路由路径作为前缀
            if (!/\//.test(id)) {
                id = router.app.$route.path + id
            }

            return id in authoritys
        },
    }


    /*
    function () {
        const $vm = this
        return {
            has: (id) => {
                console.info(this.$router)
                return authoritys && id in authoritys
            },
        }
    } */

    return { router, menulist: () => createMenulist(allRoutes, authoritys) }
}


// 生成路由菜单
function createMenulist (allRoutes, authoritys = {}) {
    return forEachRoutes(allRoutes)

    function forEachRoutes (routes) {
        const newRoutes = []
        routes.forEach(route => {
            const isLeaf = !route.children

            // 过滤非菜单路由
            if (isLeaf && route.menu !== true) {
                return
            }

            // 过滤非登录白名单，权限白名单，无权限路由
            if (isLeaf && !route.loginIgnore && !route.authIgnore && !authoritys[route.path]) {
                return
            }

            // 处理子级路由
            let children
            if (route.children) {
                children = forEachRoutes(route.children)
                if (children.length === 1 && (!route.meta || !route.meta.retain)) {
                    const routeImage = children[0]
                    // 仅有一个子项，并且子项不保留，则子项直接替换上级
                    route = {
                        meta: {
                            icon: routeImage.icon,
                            label: routeImage.label,
                        },
                        path: routeImage.path,
                    }
                    children = null
                }
            }

            // 生成菜单路由项
            const newRoute = {
                path: route.path,
            }

            const meta = route.meta
            if (meta) {
                if (meta.label) {
                    newRoute.label = meta.label
                }
                if (meta.icon) {
                    newRoute.icon = meta.icon
                }
            }

            if (children && children.length >= 1) {
                newRoute.children = children
            }

            newRoutes.push(newRoute)
        })

        return newRoutes
    }
}

function routesFormat (routes) {
    const loginIgnoreRoutes = [] // 登录白名单
    const authIgnoreRoutes = [] // 权限白名单
    const nameRoutes = {} // 具名路由表
    const allRoutes = eachRoutes(routes, []) // 完整路由表

    return { loginIgnoreRoutes, authIgnoreRoutes, nameRoutes, allRoutes }

    function eachRoutes (routes, paths) {
        return routes.map(route => {
            // 具名函数进行冲突判断
            const routeName = route.name
            if (routeName) {
                if (routeName in nameRoutes) {
                    throw Error('路由配置命名冲突', route)
                }
                nameRoutes[routeName] = route
            }

            if (/^https?:\/\/.+/.test(route.path)) {
                // 链接类型路由项
                route.url = route.path
            } else {
                const fullpaths = [ ...paths, route.path ]

                // 储存原始路径值
                route.$path = route.path

                // 生成路径匹配正则
                route.pathRegexp = pathToRegexp(
                    (route.path = `/${fullpaths.join('/')}`.replace(/\/+/g, '/')),
                )

                if (route.loginIgnore) {
                    loginIgnoreRoutes.push(route)
                }

                if (route.authIgnore) {
                    authIgnoreRoutes.push(route)
                }

                // 继续子级路由处理
                if (route.children) {
                    route.children = eachRoutes(route.children, fullpaths)
                }
            }

            return route
        })
    }
}
