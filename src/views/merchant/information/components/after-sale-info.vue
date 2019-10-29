<template>
  <wgt-card class="after-sale-info">
    <h3 class="title">
      售后信息
    </h3>
    <wgt-form :option="form" />
  </wgt-card>
</template>

<script>
import props from '@/utils/vue-props'

export default {

    props: props.validator({
        option: {
            required: true,
            children: {
                loading: {
                    required: true,
                    type: Boolean,
                },
                data: {
                    required: true,
                    type: Object,
                },
            },
        },
    }),
    data () {
        return {
            form: {
                data: this.option.data,
                gridLayout: { labelCol: { span: 5 }, wrapperCol: { span: 19 } },
                fields: [
                    {
                        label: '退货联系人',
                        name: 'name',
                        maxlength: 10,
                        rules: [
                            { required: true, message: '请填写退货联系人' },
                        ],
                    },

                    {
                        label: '联系人电话',
                        name: 'telephone',
                        maxlength: 12,
                        rules: [
                            { required: true, message: '请填写联系人电话' },
                        ],
                    },
                    {
                        label: '退货省市区',
                        name: 'areaCodes',
                        customRender: (value, option) => {
                            return (<mr-area-picker v-decorator={option.decorator} />)
                        },
                        rules: [
                            { required: true },
                            {
                                validator (rule, value, callback) {
                                    const [ , , area ] = value
                                    if (area == null) {
                                        // eslint-disable-next-line standard/no-callback-literal
                                        return callback('请选择省市区!')
                                    }
                                    callback()
                                },
                            },
                        ],
                    },
                    {
                        label: '详细地址',
                        name: 'address',
                        maxlength: 50,
                        rules: [
                            { required: true, message: '请填写详细地址' },
                        ],
                    },
                ],
            },
        }
    },
    watch: {
        'option.data' (value) {
            this.form.data = value
        },
    },

    created () {
        this.option.getValues = (callback) => {
            this.form.handle.validateFieldsAndScroll(callback)
        }
    },
}
</script>
