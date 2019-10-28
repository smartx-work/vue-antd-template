<template>
  <div class="view-home">
    <a-alert
      type="warning"
      show-icon
      message="财务系统升级中，暂不支持银行卡重新绑定服务，如需重新绑卡请联系客服。"
      style="margin:30px"
    />

    <a-alert
      type="warning"
      show-icon
      message="【重要】“待发货”状态下若用户申请仅退款，系统将自动退款给用户，请商家发货后及时回传物流单号！"
      style="margin:30px; margin-top:-40px; border-top:none"
    />

    <div style="margin: 30px">
      <a-row class="card-list" :gutter="20">
        <a-col v-if="$auth.has('/merchant/information')" span="6">
          <div class="card-item">
            <div class="card-main">
              <h4>信息管理</h4>
              <!--                            0 未申请-->
              <!--                            * * CHECKING(1, "待审核"),-->
              <!--                            * *     PASS(2, "审核通过"),-->
              <!--                            * *     REJECT(3, "审核驳回"),-->
              <p>{{ infomationStatistics.content }}</p>
            </div>
            <div class="card-footer">
              <div class="operator-group">
                <a @click="$openWindow('/merchant/information')">
                  {{ infomationStatistics.status === 1 ? '查看信息' : '填写信息' }}
                </a>
              </div>
            </div>
          </div>
        </a-col>
        <a-col v-if="$auth.has('/goods/list')" span="6">
          <div class="card-item">
            <div class="card-main">
              <h4>商品管理</h4>
              <p>待审核的商品：{{ goodsStatistics.waitExamineNum }}件</p>
              <p>出售中的商品：{{ goodsStatistics.onSaleNum }}件</p>
              <p>仓库中的商品：{{ goodsStatistics.inWarehouseNum }}件</p>
            </div>
            <div class="card-footer">
              <div class="operator-group">
                <a @click="$openWindow('/goods/list')">商品列表</a>
              </div>
            </div>
          </div>
        </a-col>
        <a-col v-if="$auth.has('/business/order')" span="6">
          <div class="card-item">
            <div class="card-main">
              <h4>订单管理</h4>
              <p>待发货的订单：{{ orderStatistics.waitSendNum }}笔</p>
              <p>待收货的订单：{{ orderStatistics.waitReciveNum }}笔</p>
              <p>待评价的订单：{{ orderStatistics.waitAppraiseNum }}笔</p>
              <p>售后中的订单：{{ orderStatistics.afterSaleNum }}笔</p>
            </div>
            <div class="card-footer">
              <div class="operator-group">
                <a @click="$openWindow('/business/order')">订单列表</a>
                <a v-if="$auth.has('/business/aftersale')" @click="$openWindow('/business/aftersale')">售后列表</a>
              </div>
            </div>
          </div>
        </a-col>
        <a-col v-if="$auth.has('/finance/bill-list')" span="6">
          <div class="card-item">
            <div class="card-main">
              <h4>结算管理</h4>
              <p>上月结算金额：{{ settlementStatistics.lastMonthSettlementAmount }}元</p>
              <p>上月退款金额：{{ settlementStatistics.lastMonthRefundAmount }}元</p>
              <p>本月结算金额：{{ settlementStatistics.thisMonthSettlementAmount }}元</p>
              <p>本月退款金额：{{ settlementStatistics.thisMonthRefundAmount }}元</p>
            </div>
            <div class="card-footer">
              <div class="operator-group">
                <!--                                <a>结算汇总</a>-->
                <!--                                <a>结算明细</a>-->
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row v-if="$auth.has('/business/order')" class="card-list" :gutter="20">
        <a-col span="6">
          <div class="card-item">
            <div class="card-main">
              <h4>业务看板</h4>
              <p>昨日订单数量：{{ orderStatistics.yesterdayNum }}笔</p>
              <p>昨日订单金额：{{ orderStatistics.yesterdayAmount }}笔</p>
              <p>今日订单数量：{{ orderStatistics.todayNum }}笔</p>
              <p>今日订单金额：{{ orderStatistics.todayAmount }}元</p>
            </div>
            <div class="card-footer">
              <div class="operator-group">
                <!--                                <a>类目报表</a>-->
                <!--                                <a>商品报表</a>-->
                <!--                                <a>订单报表</a>-->
              </div>
            </div>
          </div>
        </a-col>
        <a-col span="12">
          <div class="card-item">
            <img style="border-radius: 8px; height: 100%; width: 100%;" :src="chartImg" alt>
          </div>
        </a-col>
      </a-row>
    </div>

    <div style="margin:30px; height:400px; overflow:hidden; border-radius:8px">
      <a-carousel autoplay touch-move draggable>
        <img
          v-for="(item, index) in imgList"
          :key="index"
          :src="item.src"
          style="border-radius: 6px;"
          @mousedown="startX = $event.x"
          @mouseup="openWindow($event.x, item)"
        >
      </a-carousel>
    </div>
  </div>
</template>

<script>
import chartImg from './imgs/eg-chart.png'

export default {
    data () {
        return {
            chartImg,

            infomationStatistics: {},
            goodsStatistics: {},
            orderStatistics: {},
            settlementStatistics: {},

            // 图片列表数据
            startX: 0,
            imgList: [],
        }
    },
    created () {
        // 合同状态
        if (this.$auth.has('/merchant/information')) {
            this.$services.getInfomationStatistics(res => {
                this.infomationStatistics = res
            })
        }

        // 商品统计
        if (this.$auth.has('/goods/list')) {
            this.$services.getGoodsStatistics(res => {
                this.goodsStatistics = res
            })
        }

        // 结算统计
        if (this.$auth.has('/finance/bill-list')) {
            this.$services.getSettlementStatistic(res => {
                this.settlementStatistics = res
            })
        }

        // 订单统计
        if (this.$auth.has('/business/order')) {
            this.$services.getOrderStatistics(res => {
                this.orderStatistics = res
            })
        }


        this.$services.getHomeImgs(null, (res) => {
            this.imgList = res.list
        })
    },

    methods: {
        openWindow (endX, item) {
            if (Math.abs(this.startX - endX) > 50 || item.type !== 6) { // 是滑动操作或者非链接类型
                return
            }
            location.href = item.href
        },
    },
}
</script>

<style lang="less">
.view-home {
  .operator-group {
    button + button {
      margin-left: 15px;
    }
  }

  .card-list {
    .card-item {
      background-color: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      margin-bottom: 20px;
      position: relative;
      transition: all 0.3s;

      &:hover {
        border-color: rgba(0, 0, 0, 0.09);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
      }

      .card-category {
        background-color: #e8e8e8;
        color: #333;
        display: block;
        font-size: 14px;
        height: 40px;
        left: 20px;
        line-height: 40px;
        position: absolute;
        text-align: center;
        top: -20px;
        width: 100px;
      }

      .card-main {
        height: 180px;
        padding: 20px 20px 10px;

        h4 {
          font-size: 24px;
        }

        p {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
          margin-bottom: 5px;
        }
      }

      .card-footer {
        .operator-group {
          a {
            padding-right: 14px;
          }
        }

        display: block;
        padding: 10px 20px 20px;
      }
    }
  }
}
</style>
