// import adapter from '@smartx/adapter'
import { message, Modal } from 'ant-design-vue'

import store from '@/store'
import services from '@/packages/services'
import configs from './configs'


export default services({
    configs,
    apiSetting: {
        baseURL: '', // 基础路径
        init (config) {
            // 初始化适配器
            const { reqa, resa } = config
            if (typeof reqa === 'object') {
                config.reqa = (params) => params // adapter(reqa).input
            }
            if (typeof resa === 'object') {
                config.resa = (data) => data
                // config.resa = adapter(resa).input
            }
        },
        headers: {
            getter ({ headers }) {
                // 储存登录标识
                const { token } = headers
                if (token && token !== store.getters.token) {
                    store.commit('SET_TOKEN', token)
                }

                // 存储商家标识以备后续使用
                if (headers['sg-merchant-code']) {
                    store.commit('SET_SG_MERCHANT_CODE', headers['sg-merchant-code'])
                }
            },
            setter ({ headers }) {
                // 添加登录验签
                headers.token = store.getters.token

                // 添加商家标识
                if (store.getters.merchantToken) {
                    headers['sg-merchant-code'] = store.getters.merchantToken
                }

                return headers
            },
        },
        params: {
            setter ({ params, config: { reqa } }) {
                return reqa ? reqa(params) : params
            },
        },
        response: {
            getter ({ res, config }) {
                const { resa, responseType } = config
                if (responseType === 'arrayBuffer') { // 二进制，则不处理
                    resa(res, config)
                    return {}
                }

                const { code, data } = res
                let error = null

                if (code === 0 || code === 10000) {
                    // 分页数据适配
                    if (data && typeof data === 'object' && data.currentPage) {
                        res.data = {
                            ...data,
                            data: data.data || data.list, // 分页数据
                            page: data.currentPage || 1, // 分页页码
                            total: data.totalPageNum || data.totalNum || 0, // 分页数据总条数
                        }
                    }

                    // 调用数据适配器
                    if (resa) {
                        res.data = resa(res.data)
                    }
                } else {
                    error = { code, message: res.message || res.msg }
                }

                return { error, res }
            },
        },
        onError ({ error }) {
            if (error.code === 10101) { // 未登录
                Modal.confirm({
                    title: '确定重新登录',
                    content: '登录信息已失效，点击取消继续留在该页面，或者重新登录',
                    okText: '重新登录',
                    width: 500,
                    centered: true,
                    onOk () {
                        store.commit('LOGOUT')
                        store.commit('MERCHANT_LOGOUT')
                        window.location.href = '/login'
                    },
                    onCancel () {},
                })
            } else {
                message.error(error.message || '未知错误', 0.6)
                if (error.stack) {
                    console.error(error.stack)
                }
            }
        },
    },
    workSetting: {


    },
})
