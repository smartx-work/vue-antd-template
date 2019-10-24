import cookie from 'js-cookie'

const userToken = 'userToken'

export default {
    config: {
        state: {
            // 用户通用信息
            name: '', // 用户名
            avatar: '', // 用户图标
            token: cookie.get(userToken) || '', // 用户身份标识

            // 已选商家信息
            merchant: {
                token: '', // 商家token
                name: '未选择', // 商家名称
                code: null, // 商家编码
                authoritys: {}, // 商家权限
            },
        },
        getters: {
            name: state => state.name,
            avatar: state => state.avatar,
            isLogin: state => !!state.token,
            token: state => state.token,
            merchantCode: state => state.merchant.code,
            merchantToken: state => state.merchant.token,
            merchantAuthoritys: state => state.merchant.authoritys,
        },
        actions: {

        },
        mutations: {
            LOGIN (state, data) {
                state.name = data.name
                state.avatar = data.avatar
                state.token = data.token
                cookie.set(userToken, data.token)
            },
            LOGOUT (state) {
                state.token = ''
                state.merchant.code = null
                state.merchant.token = ''
                state.merchant.authoritys = {}
                cookie.set(userToken, '')
            },
            SET_MERCHANT (state, { code, token, authoritys, total }) {
                state.merchant.code = code
                state.merchant.token = token
                state.merchant.authoritys = (() => {
                    authoritys = authoritys.split(',').reduce((results, id) => (results[id] = true, results), {})

                    // 仅存在一个商家时，则禁用商家选择页
                    if (total === 1) {
                        delete authoritys['merchant-selector']
                    }
                    return authoritys
                })()
            },
        },
    },
    paths: [
        'name', 'avatar', 'merchant.code', 'merchant.token', 'merchant.authoritys',
    ],
}
