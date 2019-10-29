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
                        '/merchant/information#modify',
                        '/merchant/information#bindBankCard',
                        '/merchant/electronic-contract/detail',
                        '/merchant/electronic-contract/detail#sign',
                        '/merchant/electronic-contract/detail#download',
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

export const saveMerchantInformation = [ 'merchants/:code/information', {
    method: 'post',
    datam () {
        return {}
    },
} ]

export const getInformationDetail = [ 'merchant/information', { // 获取商家详情数据
    resa: {

    },
    datam () {
        const cardGroupType = 1
        const cardOption = { validateRules: [ { pattern: /^([a-z0-9]+)$/i, message: '请输入数字,字母' } ], maxlength: 18 } // 身份证字段配置信息
        const cardItems = [
            {},
            { cardName: '多证合一', cardId: 1, option: cardOption, maxlength: 18 },
            { cardName: '法人身份证', cardId: 2, option: cardOption },
            { cardName: '企业名称', cardId: 999, cardValue: '公司名称', option: { maxlength: 50, validateRules: [ { min: 1, max: 50, message: '请输入公司名称' } ] } },
            { cardName: '营业执照', cardId: 3, option: { maxlength: 15, validateRules: [ { min: 15, max: 15, message: '请输入长度为15' } ] } },
            { cardName: '组织机构代码证', cardId: 4, option: { maxlength: 10, validateRules: [ { min: 10, max: 10, message: '请输入长度为10' } ] } },
            { cardName: '税务登记证', cardId: 5, option: { maxlength: 18, validateRules: [ { min: 15, max: 18, message: '请输入长度为15-18' } ] } },
            { cardName: '法人身份证', cardId: 6, option: cardOption },
        ].map(item => {
            item.cardValue = '填充值'
            item.cardValidityTime = []
            item.cardImgs = []
            item.imgUploading = false
            return item
        })

        const cardList = {
            cardType1: cardItems.slice(1, 4),
            cardType2: cardItems.slice(4),
        }

        return {
            baseInfo: {
                code: 'SGXX000005',
                name: '树商家',
                type: 1,
                nature: 1,
                aliasName: '树',
                contacts: '大哥树',
                telephone: '18868688888',
                areaCodes: [ 'P1', 'C1-2', 'C1-2-1', 'C1-2-1-1' ],
                address: '天上人间第一楼',
                cardGroupType,
                cardList,
                remark: '备注内容666',
            },

            proxyInfo: {
                category: {
                    nowDatas: [
                        {
                            id: 'CT03',
                            name: '苹果手机',
                            settlementInterval: 66,
                        },
                    ],

                },
                brand: {
                    nowDatas: [
                        {
                            id: 1,
                            name: '类目1',
                            qualification: 2,
                            qualifiedProve: '',
                            qualificationValidityPeriod: [],
                            qualificationProveImgs: [],
                            imgUploading: false,
                        },
                    ],
                },
            },

            invoiceInfo: {
                ticket: '电子发票,增值税发票'.split(','),
            },

            customerServiceInfo: {
                enabled: true,
                workTime: '10:00-16:00',
                workDays: '周一 - 周六',
                statusText: '启用',
            },
        }
    },
    delay: 1,
} ]

export const getProxyGoodsCategorys = [ 'merchant/goods-categorys', { // 获取商家代理商品类目列表
    datam () {
        return {
            data: [
                { key: 'CT01', title: '华为手机' },
                { key: 'CT02', title: '小米手机' },
                { key: 'CT03', title: '苹果手机' },
            ],
        }
    },
} ]

export const getProxyGoodsBrands = [ 'merchant/goods-brands', { // 获取商家代理商品品牌列表
    datam () {
        return {
            data: [
                { key: 'CT01', title: '华为手机' },
                { key: 'CT02', title: '小米手机' },
                { key: 'CT03', title: '苹果手机' },
            ],
        }
    },
} ]

export const getCertificattionDetail = [ 'merchant/certificattion', { // 获取商家实名认证信息
    datam () {
        return {
            isSuccess: !true, //  0未通过,1成功,2失效(实名认证信息变更会失效）
            merchantCode: '商家编码', // 商家编码
            supplierName: '商家名称', // 商家名称
            certificateNo: '统一的企业信用代码', // 统一的企业信用代码
            legalPerson: '企业法人代表', //  企业法人代表，支持汉字、英文、空格，·（姓名分隔符）
            legalPersonIdCardNo: '企业法人身份证号', // 企业法人身份证号
        }
    },
} ]

export const getInformationBankDetail = [ 'merchant/bankDetail', { // 获取银行绑卡信息
    datam () {
        return {
            bankCardData: {
                accountName: true, /// string 户名
                authenticateTime: true, /// 验证时间
                durationToNextAuth: true, /// 下次允许验证倒计时
                bankCard: true, /// 银行卡号
                bankName: true, /// 开户银行名称，比如中国银行，建设银行等
                bankNumber: true, /// 开户支行联行行号
                bindStatus: 0, /// int 0:未创建，1：信息校验通过，2：验证通过
                bankStatus: 0, /// int 0未绑卡 1已绑卡 2已解绑
                certificateType: 1, /// 认证类型, 1:企业，2：个人
                idType: 1, /// 证件类型， 1: 身份证，73: 统一社会信用代码
                codeVerifiableValidPeriod: true, /// 短信验证错误次数
                verifyFailedCount: true, /// 验证失败次数
                idCode: true, /// 个人则是身份证，企业则是社会信用代码
                mobile: 18666565656, /// 手机号码
                bankOpening: '124541254', /// 开户支行号
                superBankCode: 's5445a4s5a4a5s', /// 超级网银号
            },
        }
    },
} ]

export const getSuperBankCodeOptions = [ 'xxx', { // 获取超级网银号选项列表
    datam () {
        return [
            { label: '中国银行', value: '111' },
            { label: '工商银行', value: '222' },
        ]
    },
} ]
