export const getMerchantList = [ 'merchants', { // 获取商家列表
    method: 'get',

    resa: {
        page: true,
        total: true,
        data: {
            name: true,
            code: true,
            status: [ // 商家状态
                { $key: 'status' },
                { $key: 'statusLabel', $enum: [ '删除', '正常', '停用' ] },
            ],
            type: [ // 商家类型
                true,
                { $target: 'typeLabel', $enum: [ '', '自营商家', '联营商家' ] },
            ],
        },
    },

    mockLocal ({ params }) {
        return {
            data: {
                code: 0,
                data: {
                    page: params.page,
                    total: 2,
                    data: [
                        { name: '老张店铺', code: 'MC0001', statusLabel: '正常', typeLabel: '自营商家' },
                        { name: '李四炒饭', code: 'MC0002', statusLabel: '停用', typeLabel: '联营商家' },
                    ],
                },
            },
        }
    },
    delay: 50,
} ]

export const selectMerchant = [ 'merchant/tokens/:code', { // 选择商家，会返回商家token
    method: 'get',
    mockLocal () {
        return {
            headers: { 'sg-merchant-code': 'merchantToken' },
            data: {
                code: 0,
                data: {
                    authoritys: [
                        '/merchant/information',
                        '/merchant/electronic-contract/detail',
                        '/goods/list',
                        '/business/order',
                        '/business/order',
                        '/finance/bill-list',
                    ].join(),
                },
            },
        }
    },
} ]

export const submitCertification = [ 'certifications', { // 提交实名认证
    method: 'post',
    error: true,
    mockLocal () {
        return {
            data: {
                code: 0,
            },
        }
    },
} ]

export const getCertificationDigital = [ 'certification/digital', { // 获取实名认证数字证书
    method: 'get',
    error: true,
    mockLocal () {
        return {
            data: { code: 0 },
        }
    },
} ]
