<template>
  <div class="view-electronic-contract-detail">
    <wgt-card>
      <a-row>
        <a-col :span="12">
          <div class="info-p">
            合同编号：{{ detail.code }}
          </div>
        </a-col>
        <a-col :span="12">
          <div class="info-p">
            合同状态：{{ detail.statusLabel }}
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <div class="info-p">
            签约状态：{{ detail.signStatusLabel }}
          </div>
        </a-col>
        <a-col :span="12">
          <div
            class="info-p"
          >
            签约截止日期：{{ detail.signDeadline }}
          </div>
        </a-col>
      </a-row>
    </wgt-card>

    <wgt-card class="btns-box">
      <a-button
        v-if="detail.signEnabled"
        type="primary"
        :disabled="!$auth.has('#sign')"
        @click="openSignDialog"
      >
        签约
      </a-button>

      <a-button
        type="primary"
        :disabled="!$auth.has('#download')"
        @click="downloadFile(detail.code)"
      >
        下载合同原文
      </a-button>

      <template v-if="detail.loseContractCode">
        <a-button
          type="primary"
          :disabled="!$auth.has('#download')"
          @click="downloadFile(detail.loseContractCode)"
        >
          下载失效合同
        </a-button>

        <a-button
          type="primary"
          @click="$openWindow({ path: '/merchant/electronic-contract/detail', query: { code: detail.loseContractCode } })"
        >
          查看失效合同详情
        </a-button>
      </template>
    </wgt-card>


    <wgt-card>
      <a-row>
        <a-col :span="12">
          <h3 class="info-title">
            基础信息
          </h3>
          <div class="info-p">
            合同名称：{{ detail.name }}
          </div>
          <div class="info-p">
            商家编号：{{ detail.merchantCode }}
          </div>
          <div class="info-p">
            商家名称：{{ detail.merchantName }}
          </div>
          <div class="info-p">
            合同模板编号：{{ detail.templateCode }}
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
            邀请人：{{ detail.applyPeople }}
          </div>
          <div class="info-p">
            合同有效期：{{ detail.effectiveEndTime }}
          </div>

          <div class="info-p">
            【平台】签约时间：{{ detail.platformSignTime }}
          </div>
          <div class="info-p">
            【商家】签约时间：{{ detail.merchantSignTime }}
          </div>
          <div class="info-p">
            合同生效时间：{{ detail.effectiveBeginTime }}
          </div>
        </a-col>
      </a-row>
    </wgt-card>

    <wgt-dialog :option="signDialog" />
  </div>
</template>
<script>
import pdfViewer from './pdf-viewer'
export default {
    // eslint-disable-next-line vue/no-unused-components
    components: { pdfViewer },
    data () {
        return {
            code: this.$route.query.code, // 合同编号
            detail: {}, // 合同详情

            // 众签签约弹窗
            signDialog: {
                className: 'view-electronic-contract-detail-signDialog-dialog',
                title: '签署合同',
                props: { width: '880px', maskClosable: false },
                data: { pdfViewer: { }, signLoading: false },
                onOpen: ({ data }, form) => {

                },
                onClose: ({ data }) => {

                },
                submitSign: (data) => {
                    data.signLoading = true
                    this.$services
                        .submitSignElectronicContract({
                            contractNo: this.code,
                        })
                        .then(res => {
                            data.signLoading = false
                            this.$message.success('签署成功')
                            this.signDialog.close()
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
                                url: `${window.origin}/merchant-gw/merchant/download?code=${this.code}`,
                                httpHeaders: {
                                    token: this.$store.getters.token,
                                },
                            })
                        }
                    })

                    return (
                        <div>
                            <div style="margin-bottom:20px; text-align:right">
                                <a-button loading={data.signLoading} type="primary" onClick={() => this.signDialog.submitSign(data)}>签署合同</a-button>
                            </div>
                            <pdf-viewer option={data.pdfViewer} />
                        </div>
                    )
                },
            },
        }
    },
    watch: {
        $route () {
            this.code = this.$route.query.code
            this.getDetailInfo()
        },
    },
    created () {
        this.getDetailInfo()
    },

    methods: {

        // 获取合同详情
        getDetailInfo () {
            this.$services.getElectronicContractDetail({ code: this.code }, (res) => {
                this.detail = res
            })
        },

        // 打开签约弹窗，前置校验包含实名认证和数字证书
        openSignDialog () {
            this.$services.getElectronicContractSignInfo({ code: this.code }).then((data) => {
                this.signDialog.open(data)
            }).catch(err => {
                if (err.code === 70205 || err.code === 70206) {
                    // 需要企业实名认证
                    this.$router.push({
                        path: '/merchant/certification',
                        query: {
                            referer: '/merchant/electronic-contract/detail',
                            code: this.code,
                        },
                    })
                } else {
                    this.$message.error(err.message)
                }
            })
        },

        downloadFile (code) {
            this.$services.downloadFile({
                source: '/merchant/download',
                name: `${code}.pdf`,
                type: 'application/pdf',
                code,
            })
        },

        viewDetail (code) {
            this.$router.push({
                path: '/merchant/electronic-contract/detail',
                query: { code },
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

  .btns-box {
    .ant-btn {
      margin-right: 20px;
    }
  }

  &-signDialog-dialog {
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
}
</style>
