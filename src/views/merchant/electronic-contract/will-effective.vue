<template>
  <div class="view-electronic-contract-will-effective">
    <wgt-data-filter :option="dataFilter" />
    <wgt-data-view :option="dataView" />
  </div>
</template>

<script>
export default {
    components: {},
    data () {
        return {
            dataFilter: {
                fields: {
                    startTimeRange: {
                        label: '发起时间',
                        type: 'date_range_picker',
                    },
                    contractId: {
                        label: '合同编号',
                    },
                },
                submit: () => this.dataView.reload(),
            },
            dataView: {
                tabs: {
                    name: 'signStatus', // 签约状态
                    items: [
                        [ '待签约', 'willSupplier' ],
                        [ '待平台签约', 'willPlatform' ],
                        [ '待双方签约', 'loseEffwillBothective' ],
                        [ '全部待签约', 'all' ],
                    ],
                },
                dataSource: (params) => {
                    return this.$services.getElectronicContractList({
                        ...params,
                        ...this.dataFilter.params,
                        contractStatus: 'willEffective', // 合同状态
                    })
                },
                rowKey: 'code',
                scrollX: 1000,
                scrollY: false,
                columns: [
                    [ '序号', null, { key: 'index', customRender: (value, row, i) => i } ],
                    [ '合同编号', 'code' ],
                    [ '合同名称', 'name' ],
                    [ '业务类型', 'businessType' ],
                    [ '签约状态', 'signStatusLabel' ],
                    [ '签约截止时间', 'signEndTime' ],
                    [ '管理', 'code', {
                        key: 'operate',
                        customRender: (code) => {
                            if (!this.$auth.has('/merchant/electronic-contract/detail')) {
                                return (<span>-</span>)
                            }
                            return (<a onClick={ () => {
                                this.$openWindow({ path: '/merchant/electronic-contract/detail', query: { code } })
                            } }>查看详情</a>)
                        },
                    } ],
                ],
            },
        }
    },
}
</script>
