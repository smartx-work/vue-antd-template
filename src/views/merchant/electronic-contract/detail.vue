<template>
  <div class="view-electronic-contract-detail">
    <mr-card>
      <a-row>
        <a-col :span="12">
          <div class="info-p">
            商家合同编号：{{ detail.contractId }}
          </div>
        </a-col>
        <a-col :span="12">
          <div class="info-p">
            合同状态：{{ detail.contractStatusText }}
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <div class="info-p">
            签约状态：{{ detail.signStatusText }}
          </div>
        </a-col>
        <a-col :span="12">
          <div
            class="info-p"
          >
            签约截止日期：{{ detail.platformSignDeadline >= detail.merchantSignDeadline ? detail.platformSignEndTime : detail.merchantSignEndTime }}
          </div>
        </a-col>
      </a-row>
    </mr-card>

    <mr-card v-if="detail.signEnabled">
      <a-button
        :disabled="!HAS_PERMISSION('merchant.electronic-contract.detail.sign.auth')"
        type="primary"
        @click="openSignDialog"
      >
        签约
      </a-button>
    </mr-card>

    <mr-card>
      <a-row>
        <a-col :span="12">
          <h3 class="info-title">
            基础信息
          </h3>
          <div class="info-p">
            合同名称：{{ detail.contractName }}
          </div>
          <div class="info-p">
            商家编号：{{ detail.merchantId }}
          </div>
          <div class="info-p">
            商家名称：{{ detail.merchantName }}
          </div>
          <div class="info-p">
            合同模板编号：{{ detail.templateId }}
          </div>
          <div class="info-p">
            业务类型：{{ detail.businessType }}
          </div>
        </a-col>
        <a-col :span="12">
          <h3 class="info-title">
            其它信息
          </h3>
          <div class="info-p">
            发起邀请时间：{{ detail.signApplyTime }}
          </div>
          <div class="info-p">
            邀请人：{{ detail.signApplyName }}
          </div>
          <div class="info-p">
            签约截止时间：{{ detail.deadlineDays }}
          </div>
          <div class="info-p">
            合同有效期：{{ detail.remainEffectiveDays }}
          </div>

          <div class="info-p">
            【平台】签约时间：{{ detail.platformSignTime }}
          </div>
          <div class="info-p">
            【商家】签约时间：{{ detail.merchantSignTime }}
          </div>
          <div class="info-p">
            合同生效时间：{{ detail.effectiveTime }}
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <h3 class="info-title">
            合同原文
          </h3>
          <div class="info-p">
            <span class="fileName">{{ detail.contractName }}</span>
            <a-button
              :disabled="!HAS_PERMISSION('merchant.electronic-contract.detail.download.auth')"
              type="primary"
              @click="downloadFile(detail.contractId)"
            >
              下载
            </a-button>
          </div>
        </a-col>
      </a-row>

      <a-row v-if="detail.masterContractName">
        <a-col :span="24">
          <h3 class="info-title">
            失效合同原文
          </h3>
          <div class="info-p">
            <span class="fileName">{{ detail.masterContractName }}</span>
            <a-button
              :disabled="!HAS_PERMISSION('merchant.electronic-contract.detail.download.auth')"
              type="primary"
              @click="downloadFile(detail.masterContractNo)"
            >
              下载
            </a-button>
            <a-button
              :disabled="!HAS_PERMISSION('merchant.electronic-contract.detail')"
              type="primary"
              @click="viewDetail(detail.masterContractNo)"
            >
              查看详情
            </a-button>
          </div>
        </a-col>
      </a-row>
    </mr-card>

    <mr-dialog :option="zqDialog" />
  </div>
</template>
<script>
import pdfViewer from './pdf-viewer'
export default {
    components: { pdfViewer },
    data () {
        return {
            contractId: this.$route.query.contractId, // 合同编号
            detail: {}, // 合同详情

            // 众签签约弹窗
            zqDialog: {
                className: 'zq-sign-dialog',
                title: '签署合同',
                props: { width: '880px', maskClosable: false },
                data: { listenFinishTimer: null, formData: null, pdfViewer: { }, signLoading: false },
                onOpen: ({ data }, form) => {
                    data.form = form
                    /*
                    data.listenFinishTimer = setInterval(() => {
                        this.zqDialog.checkSignIsFinish()
                    }, 2000) */
                },
                onClose: ({ data }) => {
                    clearInterval(data.listenFinishTimer)
                    this.getDetailInfo()
                },
                submit: () => {

                },
                submitSign: (data) => {
                    data.signLoading = true
                    this.$api
                        .electronicContractSubmitSign({
                            contractNo: this.contractId,
                        })
                        .then(res => {
                            data.signLoading = false
                            this.$message.success('签署成功')
                            this.zqDialog.close()
                            this.getDetailInfo()
                        })
                        .catch(() => {
                            data.signLoading = false
                            // this.$message.error(err.msg)
                        })
                },
                render: ({ data }) => {
                    this.$nextTick(() => {
                        if (data.pdfViewer.draw) {
                            data.pdfViewer.draw({
                                url: `${window.origin}/merchant-gw/merchant/download?contractNo=${this.contractId}`,
                                httpHeaders: {
                                    token: this.$store.getters.token,
                                },
                            })
                        }
                    })

                    return (
                        <div>
                            <div style="margin-bottom:20px; text-align:right">
                                <a-button loading={data.signLoading} type="primary" onClick={() => this.zqDialog.submitSign(data)}>签署合同</a-button>
                            </div>
                            <pdf-viewer option={data.pdfViewer} />
                        </div>
                    )
                },

                // 检查是否已经签约完成
                checkSignIsFinish: () => {
                    const params = {
                        contractNo: this.contractId,
                    }
                    this.$api.checkSignIsFinish(params, (res) => {
                        if (res.err) {
                            this.$message.error(res.err)
                        } else {
                            if (res === 'FAILED') {
                                this.$message.error(res.msg)
                            } else if (res === 'WAIT') {
                                return
                            }
                        }
                        this.zqDialog.close()
                    })
                },
            },
        }
    },
    watch: {
        $route () {
            this.contractId = this.$route.query.contractId
            this.getDetailInfo()
        },
    },
    created () {
        this.getDetailInfo()
    },
    methods: {

        // 获取合同详情
        getDetailInfo () {
            this.$api
                .getElectronicContractDetail({ contractId: this.contractId }, (res) => {
                    if (!res.err) {
                        this.detail = res
                    }
                })
        },

        // 打开签约弹窗，前置校验包含实名认证和数字证书
        openSignDialog () {
            this.$api
                .getElectronicContractSignFields({ contractId: this.contractId })
                .then((data) => {
                    this.zqDialog.open(data)
                })
                .catch(err => {
                    if (err.code === 70205 || err.code === 70206) {
                        // 需要企业实名认证
                        this.$router.push({
                            path: '/merchant/certification',
                            query: {
                                referer: '/merchant/electronic-contract/detail',
                                contractId: this.contractId,
                            },
                        })
                    } else {
                        this.$message.error(err.err.message)
                    }
                })
        },

        downloadFile (contractId) {
            this.$services.downloadFile({
                source: '/merchant/download',
                name: `${contractId}.pdf`,
                type: 'application/pdf',
                code: contractId,
            })

            /*
            axios.get('/merchant/download', {
                headers: { token: this.$store.getters.token },
                responseType: 'arraybuffer',
                params: { contractNo: contractId },
            }).then(res => {
                const blob = new Blob([ res.data ], { type: 'application/pdf' })
                saveAs(blob, `${contractId}.pdf`)
                this.$message.success('下载成功')
            }) */
        },
        viewDetail (contractId) {
            this.$router.push({
                path: '/merchant/electronic-contract/detail',
                query: {
                    contractId,
                },
            })
        },

    },
}
</script>
<style lang="less">
.view-electronic-contract-detail {
  .info-title {
    font-size: 18px;
    margin-bottom: 8px;
  }

  .info-p {
    font-size: 14px;
    line-height: 3;
  }

  .upload-img {
    display: inline;

    .el-upload {
      border: none;
      display: inline;
    }
  }

  .fileName {
    margin: 0 40px 0 16px;
  }
}

.zq-sign-dialog {
  iframe {
    border: none;
    height: 100%;
    min-height: 600px;
    width: 100%;
  }

  .ant-modal-footer {
    display: none;
  }
}
</style>
