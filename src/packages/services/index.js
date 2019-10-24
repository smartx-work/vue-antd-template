// axios文档： https://www.npmjs.com/package/axios
const axios = require('axios')


class APIService {
    constructor (config, setting = {}) {
        if (typeof setting.init === 'function') {
            setting.init(config)
        }

        this.AXIOS_CONFIG = {
            url: config.url,
            method: config.method || 'get',
            timeout: config.timeout,
            transformRequest: config.transformRequest,
            transformResponse: config.transformResponse,
            headers: config.headers,
        }

        this.CUSTOM_CONFIG = {
            reqa: config.reqa,
            resa: config.resa,
            mock: config.mock,
            error: config.error, // undefined:执行onError句柄，不抛出异常，true:执行onError句柄，抛出异常，false：不执行onError句柄，抛出异常
            mockLocal: config.mockLocal,
            delay: config.delay,
        }

        this.SETTING = setting
    }

    execute (params, callback) {
        params = params || {} // params ==  null 的时候，设置为空对象
        if (callback === undefined) {
            return new Promise((resolve, reject) => {
                this.request(params, resolve, reject)
            })
        }

        this.request(params, (res) => callback(res), (err) => callback(null, err))
    }

    request (params, resolve, reject) {
        let onResponse = (responseObject) => {
            let error = null
            let res = responseObject.data


            const { headers, response } = this.SETTING

            if (headers && headers.getter) {
                headers.getter({ headers: responseObject.headers || {} })
            }


            if (response && response.getter) {
                ({ res, error } = response.getter({ res, config: { resa: this.CUSTOM_CONFIG.resa } }))
            }

            // 响应状态错误
            if (error) {
                let defaultError = true // 是否启用默认错误提示
                let throwError = true // 是否抛出异常，让程序自己处理
                let configError = this.CUSTOM_CONFIG.error

                if (typeof configError === 'function') {
                    configError = configError(error)
                }

                if (configError === false) {
                    defaultError = false
                } else if (configError === undefined) {
                    throwError = false
                }

                if (defaultError && this.SETTING.onError) {
                    this.SETTING.onError({ error })
                }

                if (throwError) {
                    reject(error)
                }

                return
            }

            resolve(res.data)
        }

        // 延迟处理
        const { delay } = this.CUSTOM_CONFIG
        if (delay > 0) {
            const originOnRespons = onResponse
            onResponse = function () {
                setTimeout(() => originOnRespons(...arguments), delay)
            }
        }

        if (this.CUSTOM_CONFIG.mockLocal) {
            const mockData = this.CUSTOM_CONFIG.mockLocal(this.axiosConfig(params))
            // eslint-disable-next-line no-console
            console.info({ mockData })
            return onResponse(this.CUSTOM_CONFIG.mockLocal(this.axiosConfig(params)))
        }

        axios(this.axiosConfig(params)).then(onResponse).catch((err) => {
            // 系统错误不做处理，一般是404，网络错误等
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ code: -1, message: err.message, origin: err })
            console.error(err)
        })
    }

    axiosConfig (params) {
        const { url, headers } = this.AXIOS_CONFIG
        const { mockLocal } = this.CUSTOM_CONFIG
        let reqUrl = url // 请求的路径
        let reqParams = params // 请求的参数
        let reqHeaders = {} // 请求的头

        // 通用配置头信息
        if (headers) {
            Object.assign(reqHeaders, headers)
        }

        // 头信息拦截器
        if (this.SETTING.headers) {
            reqHeaders = this.SETTING.headers.setter({ headers: reqHeaders })
        }

        // 私有配置头信息
        if ('$headers' in params) {
            Object.assign(reqHeaders, params.$headers)
            delete params.$headers
        }

        // restful风格，则解析路径参数
        if (/:\w+/.test(url)) {
            const pathParams = {}
            reqParams = {}
            reqUrl = url.replace(/:(\w+)/g, (all, name) => {
                return pathParams[name] = params[name]
            })

            for (const name in params) {
                if (!mockLocal && name in pathParams) {
                    continue
                }
                reqParams[name] = params[name]
            }
        }

        const config = { url: reqUrl, headers: reqHeaders }
        if (mockLocal) { // 模拟数据，字段名则使用params
            config.params = reqParams
        } else { // axios字段名则使用data
            config.data = reqParams
        }
        return config
    }
}


class WORKService {


}


function createService (option, { apiSetting = {}, workSetting = {} }) {
    let serviceType = 'API'
    if (Array.isArray(option)) {
        const url = option[0]
        option = option[1]
        option.url = url
    } else if (typeof option.work === 'function') {
        serviceType = 'WORK'
    }

    const service = serviceType === 'API' ? new APIService(option, apiSetting) : new WORKService(option, workSetting)

    return function () {
        return service.execute(...arguments)
    }
}


export default function (option) {
    const { configs, apiSetting = {}, workSetting = {} } = option

    // axios配置项
    if (apiSetting.baseURL) {
        axios.defaults.baseURL = apiSetting.baseURL
    }

    // 初始化服务项
    const services = {}
    for (const groupId in configs) {
        const serviceOptions = configs[groupId]
        for (const serviceId in serviceOptions) {
            if (services[serviceId]) {
                console.error(`注册服务${groupId} - ${serviceId}失败，存在同名服务`)
                continue
            }
            services[serviceId] = createService(serviceOptions[serviceId], { apiSetting, workSetting })
        }
    }

    return services
}
