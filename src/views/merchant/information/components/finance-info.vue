<template>
  <wgt-card class="finance-info">
    <h3 class="title">
      财务信息
      <div class="button-box">
        <a-button
          v-if="$auth.has('#bindBankCard') && bankCardData.bindStatus < 2"
          type="primary"
          @click="() => openBindDialog(bankCardData.bindStatus)"
        >
          新建
        </a-button>

        <span
          v-if="$auth.has('merchant.information.bindBankCard.auth') && bankCardData.bindStatus === 2"
        >
          <!-- 暂时隐去重新绑卡按钮
          <a-button
            type="primary"
            v-if="$auth.has('merchant.information.bindBankCard.auth') && bankCardData.bindStatus === 2"
            @click="() => unbindBankCardDialog.open()"
          >重新绑卡</a-button>
          -->
          <span style="color:#999; font-size:12px; font-weight:normal">重新绑卡服务维护中</span>
        </span>
      </div>
    </h3>

    <div v-if="bankCardData.bankCard" class="detail">
      <a-row class="item">
        <a-col class="label" span="5">
          银行名称
        </a-col>
        <a-col span="8">
          {{ bankCardData.bankName }}
        </a-col>
        <a-col class="label" span="5">
          银行卡账号
        </a-col>
        <a-col span="8">
          {{ hiddenDatas.bankCard }}
          <a-icon
            class="toggle-hidden-button"
            :type="hiddenDatas.bankCardIcon"
            @click="toggleHiddenInfo('bankCard')"
          />
        </a-col>
      </a-row>

      <a-row class="item">
        <a-col class="label" span="5">
          户名
        </a-col>
        <a-col span="8">
          {{ bankCardData.accountName }}
        </a-col>
        <a-col class="label" span="5">
          手机号
        </a-col>
        <a-col span="8">
          {{ hiddenDatas.mobile }}
          <a-icon
            class="toggle-hidden-button"
            :type="hiddenDatas.mobileIcon"
            @click="toggleHiddenInfo('mobile')"
          />
        </a-col>
      </a-row>

      <a-row class="item">
        <a-col class="label" span="5">
          {{ bankCardData.certificateType === 1 ? '社会信用代码' : '身份证' }}
        </a-col>
        <a-col span="8">
          {{ hiddenDatas.idCode }}
          <a-icon
            class="toggle-hidden-button"
            :type="hiddenDatas.idCodeIcon"
            @click="toggleHiddenInfo('idCode')"
          />
        </a-col>
        <a-col class="label" span="5">
          开户支行
        </a-col>
        <a-col span="8">
          {{ bankCardData.bankOpening }}
        </a-col>
      </a-row>

      <a-row class="item">
        <a-col class="label" span="5">
          开户支行联行行号
        </a-col>
        <a-col span="8">
          {{ bankCardData.bankNumber }}
        </a-col>
        <a-col class="label" span="5">
          认证类型
        </a-col>
        <a-col span="8">
          {{ bankCardData.certificateType === 1 ? '企业' : '个人' }}
        </a-col>
      </a-row>

      <a-row class="item">
        <a-col class="label" span="5">
          超级网银号
        </a-col>
        <a-col span="8">
          {{ bankCardData.superBankCode }}
        </a-col>
      </a-row>
    </div>

    <wgt-dialog :option="bankCardFormDialog" />
    <wgt-dialog :option="validateByMoneyDialog" />
    <wgt-dialog :option="validateByMessageCodeDialog" />
  </wgt-card>
</template>

<script>
export default {
    components: {
    },
    data () {
        return {
            formParams: {},
            superBankCodeOptions: [],
            hiddenDatas: {},
            bankCardData: {},
            bankCardFormDialog: {
                title: '财务信息',
                data: {
                    form: {
                        gridLayout: {
                            labelCol: { span: 8 },
                            wrapperCol: { span: 15 },
                        },
                        data: {
                            certificateType: 1,
                            bankNumber: undefined,
                        },
                        fields: [
                            [ '认证类型', 'certificateType', {
                                type: 'custom',
                                customRender: (value, option, form) => {
                                    return (
                                        <a-select
                                            placeholder="请选择认证类型"
                                            options={option.options}
                                            v-decorator={option.decorator}
                                            onChange={(value) => option.onChange(value, form)}
                                        ></a-select>
                                    )
                                },
                                options: [
                                    { label: '企业', value: 1 },
                                    { label: '个人', value: 2 },
                                ],
                                rules: [
                                    { required: true, message: '请选择企业类型' },
                                ],
                                onChange: (value, form) => {
                                    form.data.certificateType = value
                                },
                            } ],
                            [ '银行名称', 'bankName1', { // 企业
                                rules: [
                                    { required: true, message: '请输入银行名称' },
                                ],
                                hidden: (value, option, form) => {
                                    return form.data.certificateType !== 1
                                },
                            } ],
                            [ '银行名称', 'bankName2', {
                                trim: true,
                                data: {
                                    options: (() => {
                                        const bankMap = {
                                            0: '渤海银行',
                                            1: '工商银行',
                                            2: '光大银行',
                                            3: '广发银行',
                                            4: '杭州银行',
                                            5: '恒丰银行',
                                            6: '华夏银行',
                                            7: '建设银行',
                                            8: '江苏银行',
                                            9: '交通银行',
                                            10: '民生银行',
                                            11: '南京银行',
                                            12: '宁波银行',
                                            13: '农业银行',
                                            14: '平安银行',
                                            15: '浦发银行',
                                            16: '兴业银行',
                                            17: '邮储银行',
                                            18: '招商银行',
                                            19: '浙江稠州商业银行',
                                            20: '浙江民泰商业银行',
                                            21: '浙江泰隆商业银行',
                                            22: '浙商银行',
                                            23: '中国银行',
                                            24: '中信银行',
                                        }
                                        const options = []
                                        for (const key in bankMap) {
                                            options.push({
                                                label: bankMap[key],
                                                value: bankMap[key],
                                            })
                                        }
                                        return options
                                    })(),
                                    filterOption (input, option) {
                                        return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
                                    },
                                },
                                rules: [
                                    { required: true, message: '请输入银行名称' },
                                ],
                                hidden: (value, option, form) => {
                                    return form.data.certificateType !== 2
                                },
                                customRender: (value, option, form) => {
                                    if (form.data.certificateType === 1) {
                                        return (
                                            <a-input v-decorator={option.decorator}/>
                                        )
                                    } else if (form.data.certificateType === 2) {
                                        return (
                                            <a-select
                                                showSearch
                                                placeholder="请选择银行"
                                                optionFilterProp="children"
                                                options={option.data.options}
                                                filterOption={option.data.filterOption}
                                                v-decorator={option.decorator}
                                            />
                                        )
                                    }
                                },
                            } ],
                            [ '银行卡账号', 'bankCard', {
                                rules: [
                                    { required: true, message: '请输入银行卡号' },
                                    {
                                        min: 1,
                                        max: 32,
                                        message: '长度在1-32之间',
                                    },
                                ],
                            } ],
                            [ '户名', 'accountName', {
                                rules: [
                                    { required: true, message: '请输入户名' },
                                ],
                            } ],
                            [ '手机号', 'mobile', {
                                rules: [
                                    { required: true, message: '请输入手机号' },
                                    { min: 11, max: 11, message: '请输入正确的手机格式' },
                                ],
                            } ],
                            [ '社会信用代码', 'idCode', {
                                hidden: (value, option, form) => {
                                    return form.data.certificateType !== 1
                                },
                                rules: [
                                    { required: true, message: '请输入社会信用代码' },
                                ],
                            } ],
                            [ '身份证', 'idCode', {
                                hidden: (value, option, form) => {
                                    return form.data.certificateType !== 2
                                },
                                rules: [
                                    { required: true, message: '请输入身份证号码' },
                                ],
                            } ],
                            [ '开户支行', 'bankOpening', {
                                rules: [
                                    { required: true, message: '请输入开户支行' },
                                ],
                            } ],
                            [ '超级网银号', 'superBankCode', {
                                data: {
                                    filterOption (input, option) {
                                        return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
                                    },
                                },
                                rules: [
                                    { required: true, message: '请选择超级网银号' },
                                ],
                                customRender: (value, option, form) => {
                                    return (
                                        <a-select
                                            showSearch
                                            placeholder="请选择超级网银号"
                                            optionFilterProp="children"
                                            options={this.superBankCodeOptions}
                                            v-decorator={option.decorator}
                                            filterOption={option.data.filterOption}
                                        />
                                    )
                                },
                            } ],
                            [ '开户支行联行行号', 'bankNumber', {
                                trim: true,
                                rules: [
                                    { required: true, message: '请输入开户支行联行行号' },
                                ],
                                customRender: (value, option, form) => {
                                    return (
                                        <div>
                                            <a-input v-decorator={option.decorator} style="width:219px; margin-right:12px;" placeholder="点击[查询]按钮进行查询"/>
                                            <a-button onClick={() => window.open('http://www.lianhanghao.com/')}>查询</a-button>
                                        </div>
                                    )
                                },
                            } ],
                        ],
                    },
                },
                onOpen: ({ data }) => {
                    const formData = this.bankCardData.bindStatus > 0 ? this.bankCardData : null

                    this.getSuperBankCodeOptions()
                    if (formData) {
                        this.bankCardFormDialog.data.form.data = {
                            ...formData,
                            [`bankName${formData.certificateType}`]: formData.bankName,
                        }
                    }
                },
                onClose: ({ data }) => {
                    data.form.handle.resetFields()
                },
                submit: ({ data }) => {
                    data.form.validate((errors, values) => {
                        if (errors) {
                            return
                        }
                        const parmams = this.formParams = { ...values, bankName: values[`bankName${values.certificateType}`] }
                        delete parmams.bankName1
                        delete parmams.bankName2
                        if (values.certificateType === 1) { // 企业
                            this.$services.saveBindBankCardInfoForEnterprise(parmams, (res) => {
                                if (!res.err) {
                                    this.bankCardFormDialog.close()
                                    this.validateByMoneyDialog.open(res)
                                } else if (res.code === 10003) {
                                    this.bankCardFormDialog.close()
                                    this.validateByMoneyDialog.open(this.bankCardData.durationToNextAuth)
                                }
                            })
                        } else if (values.certificateType === 2) { // 个人
                            this.$services.saveBindBankCardInfoForPersonal(parmams, (res) => {
                                if (!res.err) {
                                    this.bankCardFormDialog.close()
                                    this.validateByMessageCodeDialog.open(res)
                                } else if (res.code === 10003) {
                                    this.bankCardFormDialog.close()
                                    this.validateByMessageCodeDialog.open(this.bankCardData.durationToNextAuth)
                                }
                            })
                        }
                        // console.info({ errors, values })
                    })
                },
                render: ({ data }) => {
                    return (
                        <wgt-form option={data.form} />
                    )
                },
            },
            validateByMoneyDialog: {
                title: '银行卡大小额校验',
                props: {
                    cancelText: '返回上一步',
                },
                data: {
                    value: undefined,
                    waitTime: 0,
                    waitTimeText: 0,
                    reset: () => {
                        this.validateByMoneyDialog.close()
                    },
                },
                onOpen: ({ data }, waitTime) => {
                    data.value = undefined
                    data.waitTime = waitTime
                    if (data.waitTime) {
                        updateWaitTimeText()
                        data.timer = setInterval(() => {
                            data.waitTime--
                            updateWaitTimeText()
                            if (data.waitTime === 0) {
                                clearInterval(data.timer)
                            }
                        }, 1000)
                    }

                    function updateWaitTimeText () {
                        const { waitTime } = data
                        if (waitTime === 0) {
                            data.waitTimeText = ''
                        } else {
                            let hour = parseInt(waitTime / 3600)
                            let minute = parseInt(waitTime % 3600 / 60)
                            let second = waitTime - 3600 * hour - minute * 60
                            hour = hour < 10 ? `0${hour}` : hour
                            minute = minute < 10 ? `0${minute}` : minute
                            second = second < 10 ? `0${second}` : second
                            data.waitTimeText = `${hour}:${minute}:${second}`
                        }
                    }
                },
                onClose: ({ data }) => {
                    clearInterval(data.timer)
                    this.bankCardFormDialog.open()
                },
                submit: ({ data }) => {
                    const tranAmount = data.value
                    if (!tranAmount) {
                        return this.$message.warning('请输入有效金额')
                    }
                    this.$services.submitBindBankCardValidateWithMoney({ ...this.formParams, tranAmount }, (res) => {
                        if (!res.err) {
                            this.validateByMoneyDialog.close()
                            this.bankCardFormDialog.close()
                            this.$message.success('绑定成功！')
                            this.getbankDetail()
                        } else {
                            this.validateByMoneyDialog.close()
                            this.bankCardFormDialog.open()
                        }
                    })
                },
                render: ({ data }) => {
                    return (
                        <a-row>
                            <a-col span="6" style="text-align:right; line-height:32px;">输入金额</a-col>
                            <a-col span="18">
                                <a-input-number
                                    v-model={data.value}
                                    placeholder="请输入验数字"
                                    style="width:220px; margin:0 12px"
                                />
                                {data.waitTimeText ? (<a-button disabled={true}>{data.waitTimeText}</a-button>) : (<a-button onClick={() => data.reset()}>获取大小额</a-button>)}
                            </a-col>
                        </a-row>
                    )
                },
            },
            validateByMessageCodeDialog: {
                title: '银联校验',
                props: {
                    cancelText: '返回上一步',
                },
                data: {
                    value: undefined,
                    waitTime: 0,
                    waitTimeText: 0,
                    reset: () => {
                        this.validateByMessageCodeDialog.close()
                    },
                },
                onOpen: ({ data }, waitTime) => {
                    data.value = undefined
                    data.waitTime = waitTime
                    if (data.waitTime) {
                        updateWaitTimeText()
                        data.timer = setInterval(() => {
                            data.waitTime--
                            updateWaitTimeText()
                            if (data.waitTime === 0) {
                                clearInterval(data.timer)
                            }
                        }, 1000)
                    }

                    function updateWaitTimeText () {
                        const { waitTime } = data
                        if (waitTime === 0) {
                            data.waitTimeText = ''
                        } else {
                            data.waitTimeText = `${waitTime}s`
                        }
                    }
                },
                onClose: ({ data }) => {
                    clearInterval(data.timer)
                    this.bankCardFormDialog.open()
                },
                submit: ({ data }) => {
                    const messageCode = data.value
                    if (!messageCode) {
                        return this.$message.warning('请输入有效的验证码')
                    }

                    this.$services.submitBindBankCardValidateWithMessageCode({ ...this.formParams, messageCode }, (res) => {
                        if (!res.err) {
                            this.validateByMessageCodeDialog.close()
                            this.bankCardFormDialog.close()
                            this.$message.success('绑定成功！')
                            this.getbankDetail()
                        } else {
                            this.validateByMessageCodeDialog.close()
                            this.bankCardFormDialog.open()
                        }
                    })
                },
                render: ({ data }) => {
                    return (
                        <a-row>
                            <a-col span="6" style="text-align:right; line-height:32px;">输入短信验证码</a-col>
                            <a-col span="18">
                                <a-input
                                    v-model={data.value}
                                    placeholder="请输入短信验证码"
                                    style="width:220px; margin:0 12px"
                                />
                                {data.waitTimeText ? (<a-button disabled={true}>{data.waitTimeText}</a-button>) : (<a-button onClick={() => data.reset()}>获取验证码</a-button>)}
                            </a-col>
                        </a-row>
                    )
                },
            },
            unbindBankCardDialog: {
                open: () => {
                    this.$confirm({
                        title: '提示',
                        content: '确定要解绑吗？解绑会清空现有的绑卡信息',
                        onOk: () => {
                            this.$services.submitUnbindBankCard({ bankCard: this.bankCardData.bankCard }, (res) => {
                                if (!res.err) {
                                    this.$message.success('解绑成功！')
                                    this.getbankDetail()
                                    this.bankCardFormDialog.open({
                                        certificateType: this.bankCardData.certificateType,
                                    })
                                }
                            })
                        },
                    })
                },
            },
        }
    },
    created () {
        this.getbankDetail()
    },
    methods: {
        getbankDetail () {
            this.$services.getInformationBankDetail(null, (res) => {
                if (!res.err) {
                    this.bankCardData = res.bankCardData
                    this.initHiddenInfos('bankCard, idCode, mobile')
                }
            })
        },
        initHiddenInfos (keys) {
            const { hiddenDatas } = this
            keys.split(/,\s+/).forEach(key => {
                hiddenDatas[key] = '**********'
                hiddenDatas[`${key}Icon`] = 'eye-invisible'
            })
        },
        toggleHiddenInfo (key) {
            const { hiddenDatas } = this
            if (hiddenDatas[`${key}Icon`] === 'eye-invisible') {
                hiddenDatas[`${key}Icon`] = 'eye'
                this.hiddenDatas = {
                    ...hiddenDatas,
                    [key]: this.bankCardData[key],
                    [`${key}Icon`]: 'eye',
                }
            } else {
                this.hiddenDatas = {
                    ...hiddenDatas,
                    [key]: '**********',
                    [`${key}Icon`]: 'eye-invisible',
                }
            }
        },
        getSuperBankCodeOptions () {
            if (this.superBankCodeOptions.length > 0) {
                return
            }
            this.$services.getSuperBankCodeOptions(null, (res) => {
                if (!res.err) {
                    this.superBankCodeOptions = res
                    // console.info(this.superBankCodeOptions)
                }
            })
        },
        openBindDialog (bindStatus) {
            // 未填写信息状态，打开填写表单
            if (bindStatus === 0) {
                this.bankCardFormDialog.open()
            } else if (bindStatus === 1) {
                if (this.bankCardData.certificateType === 1) {
                    // 企业校验
                    this.validateByMoneyDialog.open(this.bankCardData.durationToNextAuth)
                } else if (this.bankCardData.certificateType === 2) {
                    // 个人校验
                    this.validateByMessageCodeDialog.open(this.bankCardData.durationToNextAuth)
                }
            }
        },
    },
}
</script>

<style lang="less">
.finance-info {
  .button-box {
    display: inline;
    margin-left: 40px;
  }

  .detail {
    .item {
      line-height: 3;
    }

    margin-top: 20px;

    .label.ant-col-5 {
      padding-right: 10px;
      text-align: right;
      width: 130px;
    }

    .toggle-hidden-button {
      cursor: pointer;
    }
  }
}
</style>
