
export const loginByAccount = [ 'authorizations/accounts/:account2', { // 账号登录
    method: 'post',
    reqa: {
        account: true,
        password: true,
    },
    resa: {
        name: { $mockValue: '张三' },
        type: { $mockValue: 8 },
    },
    mockLocal (config) {
        return {
            headers: { xxx: 111 },
            data: {
                code: 0,
                message: '登录成功',
                data: {
                    name: '树',
                    avatar: '',
                    token: String(Date.now()),
                },
            },
        }
    },
    mock: `
        @data{
            @header{
                @xxx 111
            }
            @data{
                @code 0
                @message '登录成功'
                @data{
                    @nick #cname
                    @avatar #random([1,2,3,4])
                    @token #step(1,8)
                }
                @list(20)[
                    @name #cname
                    @img #jpg(600,600)
                    @mobile #mobile
                ]
            }
        }
    `,
    delay: 10,
    error: true,
} ]


export const loginByMobile = [ 'authorizations/mobiles/:mobile', { // 手机号登录

} ]


export const makeList = {
    work ({ min = 0, max = 9, step = 1 }) {

    },
}

export const sortList = {
    work (params) {

    },
}

// const list1 = await this.$services.makeList({ min: 0, max: 100000000, step: 2 })
// const list2 = await this.$services.sortList({data:list1, asc:true})

// console.info(list2)
