<template>
  <wgt-card class="certificattion-info">
    <h3 class="title">
      电子签约-众签实名认证状态
    </h3>

    <template v-if="detailInfo.isSuccess">
      <ul>
        <li>
          <span>商家编号: </span>
          <span>{{ detailInfo.merchantCode }}</span>
        </li>
        <li>
          <span>统一的企业信用代码: </span>
          <span>{{ detailInfo.certificateNo }}</span>
        </li>
        <!--        <li>-->
        <!--          <span>企业名称</span>-->
        <!--          <span>{{detailInfo.supplierName}}</span>-->
        <!--        </li>-->
        <li>
          <span>企业法人姓名: </span>
          <span>{{ detailInfo.legalPerson }}</span>
        </li>
        <li>
          <span>企业法人身份证: </span>
          <span>{{ detailInfo.legalPersonIdCardNo }}</span>
        </li>
        <li>
          <span>众签实名认证状态: </span>
          <span>已认证</span>
        </li>
      </ul>
    </template>
    <template v-else>
      <div>
        待认证
        <a-button
          type="primary"
          style="margin-left: 20px;"
          @click="$router.push('/merchant/certification')"
        >
          实名认证
        </a-button>
      </div>
    </template>
  </wgt-card>
</template>

<script>
export default {
    components: {
    },
    data () {
        return {
            detailInfo: {},
        }
    },
    created () {
        this.getDetail()
    },
    methods: {
        getDetail () {
            this.$services.getCertificattionDetail((res) => {
                this.detailInfo = res
            })
        },
    },
}
</script>

<style lang="less">
.certificattion-info {
  .button-box {
    display: inline;
    margin-left: 40px;
  }

  ul {
    padding: 0;

    li {
      height: 40px;
      line-height: 40px;
      list-style: none;

      span:first-child {
        color: #333;
        display: inline-block;
        width: 170px;
      }
    }
  }
}
</style>
