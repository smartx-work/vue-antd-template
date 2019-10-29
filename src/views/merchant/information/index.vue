<template>
  <div class="view-information">
    <template v-if="checkInfo.checkStatus === 1 || checkInfo.checkStatus === 3 ">
      <wgt-card>
        <a-alert
          :message=" `审核状态：${checkInfo.checkStatusText}`"
          banner
          style="margin-bottom: 10px;"
        />
        <a-alert
          v-if="checkInfo.checkContent"
          :message="`审核内容：${checkInfo.checkContent}`"
          banner
        />
      </wgt-card>
    </template>


    <base-info :option="baseInfo" />
    <certificattion-info :option="certificattionInfo" />
    <proxy-info :option="proxyInfo" />
    <finance-info :option="financeInfo" />
    <!-- <after-sale-info :option="afterSaleInfo"/> -->
    <invoice-info :option="invoiceInfo" />
    <customer-service-info :option="customerServiceInfo" />


    <wgt-card>
      <a-button
        v-if="$auth.has('#modify')"
        type="primary"
        :loading="saveLoading"
        @click="submitAll"
      >
        保存
      </a-button>
    </wgt-card>
  </div>
</template>
<script>
import BaseInfo from './components/base-info'
import CertificattionInfo from './components/certificattion-info'
import ProxyInfo from './components/proxy-info'
import FinanceInfo from './components/finance-info'
import invoiceInfo from './components/invoice-info'
// import AfterSaleInfo from './components/after-sale-info'
import CustomerServiceInfo from './components/customer-service-info'

export default {
    components: {
        BaseInfo,
        CertificattionInfo,
        ProxyInfo,
        FinanceInfo,
        invoiceInfo,
        // AfterSaleInfo,
        CustomerServiceInfo,
    },
    data () {
        return {
            saveLoading: false,
            checkInfo: { },
            baseInfo: { data: {} },
            certificattionInfo: { },
            proxyInfo: { data: {} },
            financeInfo: { data: {} },
            invoiceInfo: { data: {} },
            // afterSaleInfo: {  data: {} },
            customerServiceInfo: { data: {} },
        }
    },

    created () {
        this.getInformationDetail()
    },
    mounted () {

    },

    methods: {

        getInformationDetail () {
            this.$services.getInformationDetail(null, (res) => {
                if (!res.err) {
                    this.checkInfo = res.checkInfo || {}
                    this.baseInfo.data = res.baseInfo || {}
                    this.proxyInfo.data = res.proxyInfo || {}
                    this.invoiceInfo.data = res.invoiceInfo || []
                    this.customerServiceInfo.data = res.customerServiceInfo || {}
                }
            })
        },

        submitAll () {
            let isError = false
            const locationError = [] // 需要进行手工定位的错误
            const params = {}

            // 表单基础信息
            this.baseInfo.getValues((errors, values) => {
                if (errors) {
                    isError = true
                }
                params.baseInfo = values
            })

            // 表单代理信息
            this.proxyInfo.getValues((errors, values) => {
                if (errors) {
                    locationError.push(errors)
                }
                params.proxyInfo = values
            })

            // 表单发票信息
            this.invoiceInfo.getValues((errors, values) => {
                if (errors) {
                    isError = true
                }
                params.invoiceInfo = values
            })


            if (isError) {
                return
            }

            // 存在定位错误
            if (locationError.length) {
                const { elementId, message } = locationError[0]
                this.$message.error(message)
                document.getElementById(elementId).scrollIntoView()
                return
            }

            this.saveLoading = true
            // return console.info({ params })

            this.$services.saveMerchantInformation(params).then(() => {
                this.$success({
                    title: '温馨提示',
                    content: '操作成功',
                    onOk () { location.reload() },
                })
            }).finally(() => {
                this.saveLoading = false
            })
        },
    },
}
</script>

<style lang="less">
.view-information {
  min-width: 880px;

  .title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 12px;
  }

  .ant-form-item-label.ant-col-5 {
    width: 120px;
  }
}
</style>
