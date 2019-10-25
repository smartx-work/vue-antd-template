<template>
  <div class="view-merchant-selector">
    <wgt-data-filter :option="dataFilter" />

    <a-list
      :grid="{ gutter: 16, column: 4 }"
      :data-source="list"
    >
      <a-list-item slot="renderItem" slot-scope="item">
        <a-card :title="item.name">
          <ul class="business-list">
            <li>
              <span>商家ID：</span>
              <span>{{ item.code }}</span>
            </li>
            <li>
              <span>商家类型：</span>
              <span>{{ item.typeLabel }}</span>
            </li>
            <li>
              <span>商家状态：</span>
              <span>{{ item.statusLabel }}</span>
            </li>
            <li style="text-align: right;">
              <a @click="selectMerchant(item.code)">进入商家中心 <a-icon type="right" /></a>
            </li>
          </ul>
        </a-card>
      </a-list-item>
    </a-list>

    <a-pagination
      v-model="pagination.page"
      show-size-changer
      :page-size.sync="pagination.pageSize"
      :total="pagination.total"
      @change="(page, pageSize) => getList({ page, pageSize })"
      @showSizeChange="(page, pageSize) => getList({ page, pageSize })"
    />
  </div>
</template>

<script>
export default {
    data () {
        return {
            list: [],
            pagination: {
                page: 1,
                total: 0,
                pageSize: 20,
            },
            dataFilter: {
                fields: {
                    merchantCode: { label: '商家ID' },
                    merchantName: { label: '商家名称' },
                },
                submit: () => {
                    this.getList()
                },
            },
        }
    },

    created () {
        this.getList()
    },

    methods: {
        getList (params) {
            this.$services.getMerchantList({ ...this.pagination, ...this.dataFilter.params, ...params }, ({ page, total, data }, err) => {
                if (total === 0) {
                    return this.$message.error('此账号已停用')
                }

                // 仅存在一个商家，则直接选择此商家
                if (total === 1) {
                    return this.$store.commit('SET_MERCHANT')
                }

                // 显示商家列表
                this.list = data
                this.pagination.page = page
                this.pagination.total = total
            })
        },
        selectMerchant (code) {

        },
    },

}
</script>
<style lang="less">
.view-merchant-selector {
  margin: 30px;
}
</style>
