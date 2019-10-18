import cookie from 'js-cookie'

const LOGIN_TOKEN = 'login-token'

export default {
    config: {
        state: {
            name: '', // 用户名
            avatar: '', // 用户图标
            token: cookie.get(LOGIN_TOKEN) || '', // 用户登陆信息标识
            merchantCode: '', // 商家编码
            authorityConfigs: '', // 权限配置文件
            sgMerchantInfo: '',
        },
        getters: {
            name: state => state.name,
            avatar: state => state.avatar,
            isLogin: state => !!state.token,
            token: state => state.token,
            merchantCode: state => state.merchantCode,
            authoritys: state => state.authoritys,
            sgMerchantCode: state => state.sgMerchantCode,
        },
        actions: {

        },
        mutations: {
            LOGIN (state, data) {
                state.nick = data.nick
                state.avatar = data.avatar
                state.token = data.token
                cookie.set(LOGIN_TOKEN, data.token)
            },
            LOGOUT (state) {
                state.token = ''
                state.merchantCode = ''
                state.authoritys = ''
                cookie.set(LOGIN_TOKEN, '')
            },
            MERCHANT_LOGOUT (state) {
                state.merchantCode = ''
                state.authoritys = ''
                state.sgMerchantCode = ''
            },
            SET_AUTHORITY (state, data) {
                state.merchantCode = data.merchantCode
                state.authoritys = data.authoritys
            },
            SET_SG_MERCHANT_CODE (state, data) {
                state.sgMerchantCode = data
            },

        },
    },
    paths: [
        'name', 'avatar', 'merchantCode', 'authorityConfigs', 'sgMerchantCode',
    ],
}
