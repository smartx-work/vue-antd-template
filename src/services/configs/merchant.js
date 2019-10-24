export const getMerchantList = [ 'merchants', {
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
                    total: 100,
                    data: [
                        { name: '张三', code: 'MC0001', statusLabel: '正常', typeLabel: '自营商家' },
                        { name: '李四', code: 'MC0002', statusLabel: '停用', typeLabel: '联营商家' },
                    ],
                },
            },
        }
    },
} ]
