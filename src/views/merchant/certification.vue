<template>
  <div class="view-information-certification">
    <wgt-card>
      <a-form :form="form" @submit.prevent="submitForm">
        <a-form-item
          v-for="(item, i) in formItems"
          :key="i"
          :label="item.label"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="item.decorator"
            :maxlength="item.maxlength"
            :placeholder="item.placeholder"
            @change="(e) => e.target.value = e.target.value.trim()"
          />
        </a-form-item>
        <a-row>
          <a-col span="2" />
          <a-col span="4">
            <a-button
              :disabled2="!$auth.has('modify')"
              :loading="formLoading"
              type="primary"
              html-type="submit"
            >
              提交认证
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </wgt-card>
  </div>
</template>
<script>
export default {
    components: {},
    data () {
        return {
            form: this.$form.createForm(this),
            formItems: this.formatFormItems([
                [ '统一的企业信用代码', 'certificate', { maxlength: 32 } ],
                [ '企业法人姓名', 'legalPerson' ],
                [ '企业法人身份证', 'legalPersonIdCardNo' ],
                [ '企业联系人姓名', 'contact' ],
                [ '企业联系人手机号码', 'mobile' ],
                [ '企业注册地址', 'address' ],
            ]),
            formLoading: false,
        }
    },
    methods: {
        formatFormItems (items) {
            return items.map((item, i) => {
                const [ label, name, { rules = [], maxlength } = {} ] = item
                const placeholder = `请输入${label}`
                const decorator = [ name, {
                    initialValue: process.env.NODE_ENV === 'development' ? [ 'xxx', '陈大哥', '332522198806066124', '陈大哥', '18888888888', '企业AAA' ][i] : undefined,
                    rules: [
                        { required: true, message: placeholder },
                        ...rules,
                    ],
                } ]
                const option = { maxlength }
                for (const key in option) {
                    if (option[key] === undefined) {
                        delete option[key]
                    }
                }

                return {
                    label: label,
                    placeholder,
                    decorator,
                    ...option,
                }
            })
        },

        submitForm () {
            this.form.validateFields((err, params) => {
                if (!err) {
                    this.formLoading = true
                    this.$services.submitCertification(params).then(() => {
                        this.$services.getCertificationDigital(params, (res, err) => {
                            if (!err) {
                                this.openFeedbackDialog()
                            }
                            this.formLoading = false
                        })
                    }).catch(() => {
                        this.formLoading = false
                    })
                }
            })
        },

        openFeedbackDialog () {
            const { referer, contractId } = this.$route.query
            this.$success({
                title: '认证成功',
                content: '实名认证成功',
                onOk: () => {
                    if (referer) {
                        this.$router.push({
                            path: referer, // 根据来源决定确定的跳走 electronicContractDetail(来源于签署合同页，则会跳走),
                            query: { contractId },
                        })
                    }
                },
            })
        },
    },
}
</script>

<style lang="less">
.view-information-certification {
  .ant-form {
    min-width: 600px;
  }

  .textInput {
    width: 400px;
  }

  .ant-col-4.ant-form-item-label {
    width: 160px;
  }

  .ant-col-12.ant-form-item-control-wrapper {
    width: 420px;
  }
}
</style>
