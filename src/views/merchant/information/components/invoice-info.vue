<template>
  <wgt-card class="invoice-info">
    <h3 class="title">
      发票信息
    </h3>
    <wgt-form :option="form" />
  </wgt-card>
</template>

<script>
export default {
    props: {
        option: {
            required: true,
            type: Object,
        },
    },
    data () {
        return {
            form: {
                data: this.option.data,
                gridLayout: { labelCol: { span: 5 }, wrapperCol: { span: 19 } },
                fields: [
                    {
                        label: '发票类型',
                        name: 'ticket',
                        type: 'checkbox',
                        options: [
                            { label: '电子发票', value: '电子发票' },
                            { label: '纸质发票', value: '纸质发票' },
                            { label: '增值税发票', value: '增值税发票' },
                        ],
                        decorator: [ 'ticket', {
                            initialValue: this.option.data.ticket || [],
                        } ],
                    },
                ],
            },
        }
    },
    watch: {
        'option.data' (data) {
            const { ticket } = data
            if (ticket && ticket.length) {
                this.form.handle.setFieldsValue({ ticket })
            }
        },
    },
    created () {
        this.option.getValues = (callback) => {
            this.form.handle.validateFieldsAndScroll((errors, values) => {
                callback(errors, values)
            })
        }
    },

}
</script>
