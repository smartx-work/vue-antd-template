<template>
  <div class="view-electronic-contract-has-effective">
    <wgt-data-filter :option="dataFilter" />
    <wgt-data-view :option="dataView" />
  </div>
</template>
<script>
export default {
    components: {},
    data () {
        return {
            activeKey: 'hasEffective',
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
                dataSource: (params) => {
                    return this.$services.getElectronicContractList({
                        ...params,
                        ...this.dataFilter.params,
                        contractStatus: 'hasEffective',
                    })
                },
                rowKey: 'code',
                scrollX: 1000,
                columns: [
                    [ '序号', null, { key: 'index', customRender: (value, row, i) => i } ],
                    [ '合同编号', 'code' ],
                    [ '合同名称', 'name' ],
                    [ '业务类型', 'businessType' ],
                    [ '合同有效期', 'validityTime' ],
                    [ '管理', 'code', {
                        key: 'operate',
                        customRender: (contractId) => {
                            if (!this.$auth.has('/merchant/electronic-contract/detail')) {
                                return '-'
                            }
                            return (<a onClick={ () => { this.$openWindow({ path: '/merchant/electronic-contract/detail', query: { contractId } }) } }>查看详情</a>)
                        },
                    } ],
                ],
            },
        }
    },
}
</script>
