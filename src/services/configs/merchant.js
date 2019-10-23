export const getMerchantList = [ 'merchants', {
    method: 'get',
    mockLocal () {
        return {
            data: {
                code: 0,
                data: {
                    currentPage: 1,
                    total: 100,
                    data: [
                        { name: '张三' },
                        { name: '李四' },
                    ],
                },
            },
        }
    },
} ]
