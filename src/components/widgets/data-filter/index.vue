

<script>
import moment from 'moment'

export default {
    props: {
        option: {
            type: Object,
            required: true,
        },
    },

    data () {
        return {
            // 查询表单
            form: this.$form.createForm(this, {
                onValuesChange: () => setTimeout(() => this.updateParams()),
            }),

            // 字段配置项
            fields: [],

            // 等待节点就绪的回调
            callbacks: null,
        }
    },

    created () {
        let isReady = false
        const callbacks = this.callbacks = [ () => isReady = true ]
        const { option } = this

        Object.assign(option, {
            waitReady (callback) {
                if (isReady) {
                    callback(option)
                } else {
                    callbacks.push(callback)
                }
            },
        })

        this.formatFields()
    },

    mounted () {
        this.updateParams()

        // 触发所有的callbacks
        this.callbacks.forEach(callback => callback())
        this.callbacks = null
    },

    methods: {

        formatFields () {
            const { fields } = this.option
            for (const name in fields) {
                this.formatField(name, fields[name])
            }
        },

        formatField (name, option) {
            // 基础配置项
            const field = {
                name,
                label: option.label,
                type: option.type || 'input', // 默认input类型
                allowClear: option.allowClear,
                placeholder: option.placeholder || '',
                decorator: [ name, { id: name, initialValue: option.defaultValue } ],
                colSpace: 1,
            }

            // 选项格式化
            if (option.options) {
                field.options = this.formatOption(option.options)
            }

            // 自定义渲染函数
            if (option.customRender) {
                field.customRender = option.customRender
            }

            // 自定义中间数据，常用于customRender的时候参与运算使用
            if (option.data) {
                field.data = option.data
            }

            // 时间区间组件
            if (option.type === 'date_range_picker') {
                field.colSpace = 2
            }

            this.fields.push(field)
        },

        formatOptions (options) {
            // 已经是数组，则原样返回
            if (Array.isArray(options)) {
                return options
            }
            // { k1: '未支付', k2: '已支付' } => [ { label:'未支付', value: 'k1' }, { label:'已支付', value:'k2' } ]
            const newOptions = []
            for (const key in options) {
                newOptions.push({
                    value: key,
                    label: options[key],
                })
            }
            return newOptions
        },

        updateParams () {
            const { fields } = this.option
            const values = this.form.getFieldsValue()
            const params = this.option.params = {}
            for (const name in values) {
                let value = values[name]
                const field = fields[name]

                // 统一处理首尾空格
                if (typeof value === 'string') {
                    value = value.trim()
                }

                // 过滤未设值和为空的查询条件
                if (value === undefined || value === '') {
                    continue
                }

                // 日期区间选择组件，时间转换成 00:00:00 - 23:59:59
                if (field.type === 'date_range_picker') {
                    if (value.length === 0) {
                        continue
                    }
                    value = [
                        moment(value[0]).format('YYYY-MM-DD 00:00:00'),
                        moment(value[1]).format('YYYY-MM-DD 23:59:59'),
                    ]
                }

                // 带时分秒的日期选择组件
                if (field.type === 'date_time_range_picker') {
                    if (value.length === 0) {
                        continue
                    }
                    value = [
                        moment(value[0]).format('YYYY-MM-DD HH:mm:ss'),
                        moment(value[1]).format('YYYY-MM-DD HH:mm:ss'),
                    ]
                }

                params[name] = value
            }
        },

        submit () {
            if (this.option.submit) {
                this.option.submit(this.option.params)
            } else {
                console.error('dataFilter.params', this.option.params)
            }
        },

        reset () {
            this.form.resetFields()
            this.option.reset && this.option.reset()
            this.updateParams()
            this.submit()
        },
    },
    render () {
        return (
            <div class="widget-data-filter">
                <a-form layout="inline" form={this.form} onSubmit={
                    (e) => {
                        e.preventDefault()
                        this.submit()
                    }
                }>
                    {this.fields.map(item => {
                        let itemJSX
                        if (typeof item.customRender === 'function') {
                            itemJSX = item.customRender(item)
                        } else if (item.type === 'select') {
                            itemJSX = (
                                <a-select
                                    v-decorator={item.decorator}
                                    allowClear={item.allowClear || false}
                                    placeholder={item.placeholder || '请选择'}
                                >
                                    {item.options.map((option) => {
                                        return <a-select-option key={option.value} value={option.value}>{option.label}</a-select-option>
                                    })}
                                </a-select>
                            )
                        } else if (item.type === 'date_range_picker') {
                            itemJSX = <a-range-picker
                                v-decorator={item.decorator}
                                format="YYYY-MM-DD"
                            />
                        } else if (item.type === 'date_time_range_picker') {
                            itemJSX = <a-range-picker
                                show-time
                                v-decorator={item.decorator}
                                format="YYYY-MM-DD HH:mm:ss"
                            />
                        } else {
                            itemJSX = <a-input v-decorator={item.decorator} placeholder={item.placeholder || `请输入${item.label}`} />
                        }

                        return (
                            <a-form-item key={item.name} label={item.label} class={item.colSpace === 2 ? 'ant-form-item-double' : '' }>{itemJSX}</a-form-item>
                        )
                    })}
                    <a-form-item style="margin-left:120px; width:200px;">
                        <a-button type="primary" html-type="submit">查询</a-button>
                        <a-button onClick={() => this.reset()} style="margin-left:20px">重置</a-button>
                    </a-form-item>
                </a-form>
            </div>
        )
    },
}
</script>
<style lang="less">
.widget-data-filter {
  margin: 20px;

  /* min-width: 1140px; */
  /* max-width: 1280px;*/

  .ant-form-item {
    margin: 0 20px 14px 0;
    width: 360px;

    .ant-form-item-label {
      text-align: right;
      width: 120px;
    }

    .ant-form-item-control-wrapper {
      width: 240px;
    }

    &-double {
      width: 360px;

      .ant-form-item-control-wrapper {
        width: 240px;
      }
    }
  }

  .ant-calendar-picker-input {
    width: 240px;
  }
}
</style>
