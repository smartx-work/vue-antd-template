<template>
  <div class="view-merchant-selector">
    xxxxxxxxxxx
  </div>
</template>

<script>
export default {
    data () {
        return {

        }
    },
    beforeCreate () {
        this.$services.getMerchantList(null, res => {
            console.info(res, '###')
        })
    },
    mounted () {

    },
    methods: {
        getMerchantList () {

        },
    },

}
</script>

export default {
    data () {
        return {
            pageData: {
                pageSize: 20,
                page: 1,
                total: 0,
            },
            dataFilter: {
                params: {},
                fields: {
                    merchantCode: {
                        label: '商家ID',
                        type: 'input',
                    },
                    merchantName: {
                        label: '商家名称',
                        type: 'input',
                    },
                },
                submit: () => {
                    this.getList()
                },
            },
            list: [],
        }
    },
    methods: {
        goToIndex (item) {
            item.merchantCount = this.pageData.total
            this.$store.dispatch('GetMerchantPrivilege', item).then((permissionArray) => {
                routes.injection(permissionArray)
                this.$openWindow('/home/index')
            })
        },
        onShowSizeChange (value, pageSize) {
            this.pageData.pageSize = pageSize
            this.getList()
        },
        pageChange (page, pageSize) {
            this.pageData.page = page
            this.getList()
        },
        getList () {
            this.$api.getMerchantsPage({ ...this.pageData, ...this.dataFilter.params }).then(res => {
                this.list = res.data
                this.pageData.page = res.currentPage
                this.pageData.total = res.totalNum
            })
        },
    },
    mounted () {
        this.getList()
    },
}
