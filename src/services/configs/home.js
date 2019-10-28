export const getInfomationStatistics = [ 'merchant/statistics/infomation', { // 获取商家信息统计
    method: 'get',
    mockLocal () {
        return {
            data: {
                code: 0,
                data: {
                    status: 1,
                    content: '商家信息已就绪',
                },
            },
        }
    },
} ]

export const getGoodsStatistics = [ 'merchant/statistics/goods', { // 获取商家商品信息统计
    resa: {
        waitExamineNum: true, // 待审核的商品数量
        onSaleNum: true, // 出售中的商品数量
        inWarehouseNum: true, // 仓库中的商品数量
    },
    mockLocal () {
        return {
            data: {
                code: 0,
                data: {
                    waitExamineNum: 12,
                    onSaleNum: 33,
                    inWarehouseNum: 12,
                },
            },
        }
    },
} ]

export const getOrderStatistics = [ 'merchant/statistics/order', {
    resa: {
        waitSendNum: true, // 待发货的订单数量
        waitReciveNum: true, // 待收货的订单数量
        waitAppraiseNum: true, // 待评价的订单数量
        afterSaleNum: true, // 售后的订单数量

        yesterdayNum: true, // 昨日订单数量
        yesterdayAmount: true, // 昨日订单金额
        todayNum: true, // 今日订单数量
        todayAmount: true, // 今日订单金额
    },
    mockLocal () {
        return {
            data: {
                code: 0,
                data: {
                    waitSendNum: 1,
                    waitReciveNum: 2,
                    waitAppraiseNum: 3,
                    afterSaleNum: 4,

                    yesterdayNum: 55,
                    yesterdayAmount: '1256.00',
                    todayNum: 8,
                    todayAmount: '152.00',
                },
            },
        }
    },
} ]

export const getSettlementStatistic = [ 'merchant/statistics/settlement', {
    resa: {
        lastMonthSettlementAmount: true, // 上个月结算金额
        thisMonthSettlementAmount: true, // 当前月结算金额
        lastMonthRefundAmount: true, // 上个月退款金额
        thisMonthRefundAmount: true, // 当前月退款金额
    },
    mockLocal () {
        return {
            data: {
                code: 0,
                data: {
                    lastMonthSettlementAmount: '12253.00',
                    thisMonthSettlementAmount: '22252.00',
                    lastMonthRefundAmount: '12.00',
                    thisMonthRefundAmount: '26.00',
                },
            },
        }
    },
} ]

export const getHomeImgs = [ 'merchant/home-imgs', {
    resa: {
        list: {
            src: true, // 图片地址
            type: true, // 类型
            href: true, // 链接地址
        },
    },
    mockLocal () {
        return {
            data: {
                code: 0,
                data: {
                    list: [
                        item(),
                        item(),
                        item(),
                        item(),
                        item(),
                    ],
                },
            },
        }

        function item () {
            return {
                src: [ 'https://img.zcool.cn/community/011e125db57114a801209e1f415534.jpg@1280w_1l_2o_100sh.jpg', 'https://img.zcool.cn/community/0199ea5db57114a8012163ba330d5f.jpg@1280w_1l_2o_100sh.jpg', 'https://img.zcool.cn/community/01518c5db57112a801209e1f43424c.jpg@1280w_1l_2o_100sh.jpg' ][Math.floor(Math.random() * 3)],
                type: 6,
                href: '#666',
            }
        }
    },
} ]
