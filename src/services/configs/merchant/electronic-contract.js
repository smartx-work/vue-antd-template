export const getElectronicContractList = [ 'merchant/electronic-contracts', { // 获取电子合同列表
    method: 'get',
    reqa: {
        page: true,
        pageSize: true,
        contractStatus: { // 0待生效合同 1已生效合同 2已失效合同
            $emap: {
                willEffective: 0,
                hasEffective: 1,
                loseEffective: 2,
            },
        },
        contractId: { $key: 'contractNo' }, // 合同编号
        startTimeRange: [ // 发起时间
            { $key: 'initiateStartTime', $value: value => value[0] },
            { $key: 'initiateEndTime', $return: value => value[1] },
        ],
        signStatus: { // 商品状态
            $key: 'signatureStatus',
            $enum: {
                willPlatform: 0, // 待平台签约
                willmerchant: 1, // 待签约
                loseEffwillBothective: 2, // 待双方签约
                all: null, // 全部待签约
            },
        },
    },
    resa: {
        page: true,
        total: true,
        data: {
            code: true, // 合同编号
            name: true, // 合同名称
            businessType: { $enum: [ '采购合同', '结算合同' ] }, // 业务类型
            signStatus: {
                $key: 'signStatusLabel',
                $enum: [
                    '待平台签约',
                    '待供应商签约',
                    '待双方签约',
                    '签约成功',
                    '签约失效',
                ],
            }, // 签约状态
            signEndTime: true, // 签约截止时间
            validityTime: true, // 合同有效期
            loseType: {
                $enum: [ '到期失效', '运维失效', '未签署失效', '作废失效' ],
            }, // 合同失效类型
            applyTime: true, // 邀请时间
        },
    },
    error: true,
    mockLocal ({ params: { page } }) {
        let id = 0
        const item = () => ({
            code: `DZHT-${page}.${id++}`,
            name: '合同名称',
            businessType: '采购合同',
            signStatusLabel: '待平台签约',
            signEndTime: `${new Date().getFullYear()}`,
            validityTime: `${new Date().getFullYear()}`,
            loseType: '到期失效',
            applyTime: `${new Date().getFullYear()}`,
        })
        return {
            data: {
                code: 0,
                data: {
                    page: page,
                    total: 100,
                    data: [
                        item(),
                        item(),
                        item(),
                        item(),
                        item(),
                        item(),
                        item(),
                    ],
                },
            },
        }
    },
} ]


export const getElectronicContractDetail = [ 'merchant/electronic-contracts/:code', { // 获取合同详情
    resa: {

    },
    resm ({ code }) {
        console.info(code)
        return {
            xxx: '6666',
        }
    },
} ]
