<template>
  <wgt-card class="base-info">
    <h3 class="title">
      基础信息
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
        const { data } = this.option
        data.nature = data.nature == null ? 1 : data.nature
        data.type = data.type == null ? 2 : data.nature
        return {
            editMode: true, // 默认是编辑模式
            form: {
                data,
                gridLayout: { labelCol: { span: 5 }, wrapperCol: { span: 19 } },
                fields: [
                    [ '商家编号', 'code', {
                        disabled: true,
                        width: 300,
                        rules: [
                            { message: '' },
                        ],
                    } ],
                    [ '商家性质', 'nature', {
                        disabled: () => this.editMode,
                        type: 'radio',
                        options: [
                            { label: '供应商', value: 1 },
                            { label: '店铺入驻', value: 2, disabled: true },
                        ],
                        rules: [
                            { required: true, message: '请选择商家性质' },
                        ],
                    } ],
                    [ '商家类型', 'type', {
                        disabled: () => this.editMode,
                        type: 'radio',
                        options: [
                            { label: '自营商家', value: 1, disabled: true },
                            { label: '联营商家', value: 2 },
                        ],
                        rules: [
                            { required: true, message: '请选择商家类型' },
                        ],
                    } ],
                    [ '商家名称', 'name', {
                        disabled: true, // () => this.editMode,
                        width: 300,
                        rules: [
                            { required: true, message: '请填写商家名称' },
                        ],
                    } ],
                    [ '商家别名', 'aliasName', {
                        width: 300,
                        maxlength: 20,
                    } ],

                    [ '联系人', 'contacts', {
                        width: 300,
                        maxlength: 50,
                        rules: [
                            { required: true, message: '请输入联系人' },
                        ],
                    } ],
                    [ '联系人电话', 'telephone', {
                        width: 300,
                        maxlength: 12,
                        rules: [
                            { required: true, message: '请输入联系人电话' },
                        ],
                    } ],
                    [ '省市区', 'areaCodes', {
                        width: 600,
                        customRender: (value, option) => {
                            return (<wgt-area-picker v-decorator={option.decorator} />)
                        },
                        rules: [
                            { required: true },
                            {
                                validator (rule, value, callback) {
                                    const [ , , area ] = value
                                    if (area == null) {
                                        return callback('请选择省市区!')
                                    }
                                    callback()
                                },
                            },
                        ],
                    } ],
                    [ '详细地址', 'address', {
                        width: 600,
                        maxlength: 50,
                        rules: [
                            { required: true, message: '详细地址不能为空！' },

                        ],
                    } ],
                    [ '证件类型', 'cardGroupType', {
                        width: 1000,
                        options: [
                            { label: '多证合一', value: 1 },
                            { label: '普通三证', value: 2 },
                        ],
                        customOption: {
                            dataProp: 'cardList',
                            columns: [
                                {
                                    title: '证件类型',
                                    dataIndex: 'cardName',
                                    width: 180,
                                    customRender: (value) => {
                                        return (<div class="ant-form-item-required">{value}</div>)
                                    },
                                },
                                {
                                    title: '证件号',
                                    dataIndex: 'cardValue',
                                    customRender: (value, row) => {
                                        const obj = {
                                            attrs: { colSpan: 1 },
                                        }
                                        let message = '请输入证件号'
                                        if (row.cardId === 999) {
                                            obj.attrs.colSpan = 2
                                            message = '请输入公司名称'
                                        }

                                        const name = `cardValue_${row.cardId}`
                                        const decorator = [
                                            name,
                                            {
                                                initialValue: value,
                                                rules: [
                                                    { required: true, message },
                                                    ...row.option.validateRules,
                                                ],
                                            },
                                        ]
                                        obj.children = (<a-form-item><a-input maxlength={row.option.maxlength} v-decorator={decorator} /></a-form-item>)
                                        return obj
                                    },
                                    width: 360,
                                },
                                {
                                    title: '证件有效期',
                                    dataIndex: 'cardValidityTime',
                                    customRender: (value, row) => {
                                        if (row.cardId === 999) {
                                            return {
                                                attrs: { colSpan: 0 },
                                            }
                                        }
                                        const name = `cardValidityTime_${row.cardId}`
                                        const decorator = [
                                            name,
                                            {
                                                initialValue: value,
                                                rules: [
                                                    { required: true, message: '请选择证件有效期' },
                                                ],
                                            },
                                        ]
                                        return (<a-form-item><a-range-picker v-decorator={decorator} /></a-form-item>)
                                    },
                                    width: 360,
                                },
                                {
                                    title: '证件图片',
                                    dataIndex: 'cardImgs',
                                    customRender: (value, row) => {
                                        if (row.cardId === 999) {
                                            return {
                                                attrs: { colSpan: 1 },
                                            }
                                        }
                                        const makeJsxContent = (imgSrc, buttonText, i) => {
                                            const images = imgSrc ? [ imgSrc ] : []
                                            const src = imgSrc || require('./imgs/default.png')

                                            return (
                                                <div class="card-img-box">
                                                    <viewer images={images}>
                                                        <img src={src} alt="" />
                                                    </viewer>
                                                    <div>
                                                        <a-upload
                                                            accept=".jpg, .jpeg, .png"
                                                            action={this.$OSSURL}
                                                            showUploadList={false}
                                                            onChange={(...args) => this.handleChange(...args, row, i)}
                                                            disabled={row.imgUploading}
                                                            beforeUpload={(...args) => this.handleBeforeUpload(...args, row)}
                                                        >
                                                            <a-button type="primary">
                                                                <a-icon type={row.imgUploading ? 'loading' : 'upload'} disabled={row.imgUploading} />{buttonText}
                                                            </a-button>
                                                        </a-upload>
                                                        <p>上传5MB以内的图片</p>
                                                    </div>
                                                </div>
                                            )
                                        }

                                        if (row.cardName === '法人身份证') {
                                            return (
                                                <div style="margin-bottom: -8px;">
                                                    {makeJsxContent(value[0], '上传正面图片', 0)}
                                                    {makeJsxContent(value[1], '上传反面图片', 1)}
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div style="margin-bottom: -8px;">
                                                    {makeJsxContent(value[0], '上传图片', 0)}
                                                </div>
                                            )
                                        }
                                    },
                                    width: 240,
                                },
                            ],
                        },

                        customRender: (value, option) => {
                            const { customOption } = option
                            const { cardList } = this.option.data

                            const dataSource = cardList ? cardList[`cardType${value}`] : [] // 根据类型分别取不同的数据列表

                            return (
                                <div>
                                    <a-radio-group v-decorator={option.decorator} disabled={option.disabled} options={option.options} onChange={(e) => option.onChange(e, option)} />
                                    {
                                        value ? (
                                            <a-table locale={{ emptyText: '没有相关的数据' }} class="card-list-box" bordered pagination={false} rowKey={(record, index) => index} dataSource={dataSource} columns={customOption.columns}>

                                            </a-table>
                                        ) : ''
                                    }
                                </div>
                            )
                        },
                        onChange: (e, option) => {
                            option.value = e.target.value
                        },
                    } ],
                    [ '备注', 'remark', {
                        width: 1000,
                        maxlength: 180,
                        onChange: (e, option) => {
                            option.value = e.target.value
                        },
                        trim: true,
                        customRender: (value, option) => {
                            return (
                                <div>
                                    <a-textarea v-decorator={option.decorator} maxlength={option.maxlength} rows={6} onChange={(e) => option.onChange(e, option)} />
                                    <span>{value.length}/{option.maxlength}</span>
                                </div>
                            )
                        },
                    } ],
                ],
            },
        }
    },
    watch: {
        'option.data' (data) {
            this.form.data = data
            this.editMode = Boolean(data.contractId)
        },
    },
    created () {
        this.option.getValues = (callback) => {
            this.form.validate((errors, values) => {
                const newCardList = []
                const newValues = { ...values, cardList: newCardList }

                const cardList = this.form.data.cardList[`cardType${values.cardGroupType}`]

                cardList.forEach(item => {
                    newCardList.push({
                        cardId: item.cardId,
                        cardValue: values[`cardValue_${item.cardId}`],
                        cardValidityTime: values[`cardValidityTime_${item.cardId}`],
                        cardImgs: item.cardImgs,
                    })
                })
                // console.info(newValues)
                callback(errors, newValues)
            })
        }
        this.option.reset = () => {
            this.form.handle.resetFields()
        }
    },
    methods: {
        handleChange (evnet, row, i) {
            const { status, response } = evnet.file
            if (status === 'uploading') {
                row.imgUploading = true
            } else {
                if (evnet.file.status === 'done') {
                    const imgUrl = response.data
                    row.cardImgs[i] = imgUrl
                }
                row.imgUploading = false
            }
        },
        handleBeforeUpload (file, row) {
            const isImg = /^image\/(jpg|jpeg|png)$/.test(file.type)
            if (!isImg) {
                this.$message.error('请上传（jpg，jpeg，png）格式的图片文件')
                return false
            }

            const isLt5M = file.size / 1024 / 1024 < 5
            if (!isLt5M) {
                this.$message.error('请上传小于5MB的文件')
                return false
            }

            return true
        },
    },
}
</script>
<style lang="less">
.base-info {
  .card-list-box {
    .ant-form-item {
      margin-bottom: 0;
    }
  }

  .card-img-box {
    display: flex;
    text-align: center;

    img {
      border-radius: 8px;
      height: 60px;
      margin-bottom: 8px;
      margin-right: 8px;
      width: 60px;
    }
  }
}
</style>
