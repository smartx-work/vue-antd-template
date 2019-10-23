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

    let authoritys = null

    router.beforeEach((to, from, next) => {
        const { path } = to
        const { isLogin } = state

        console.info(option.state)

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

        // 处理权限白名单
        if (authIgnoreRoutes.some(route => route.pathRegexp.test(path))) {
            return next()
        }

        // 初始化权限配置
        if (!authoritys) {
            authoritys = state.authoritys.split(',').reduce((results, item) => (results[item] = true, results), {})
        }

        // 有权限
        if (path.substr(1) in authoritys) {
            return next()
        }

        // 无权限
        return next(nameRoutes.page403)
    })

    Vue.use(Router)

    return router
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
                    eachRoutes(route.children, fullpaths)
                }
            }

            return route
        })
    }
}
