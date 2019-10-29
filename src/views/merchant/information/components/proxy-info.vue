<script>
export default {
    props: {
        option: {
            type: Object,
            require: true,
        },
    },
    data () {
        return {
            category: { // 分类模块数据
                $vm: this,
                nowDatas: [], // 当前数据
                columns: [ // 表格配置
                    {
                        title: '序号',
                        customRender: (value, row, index) => index,
                        width: 70,
                    },
                    {
                        title: '分类名称',
                        dataIndex: 'name',
                    },
                    {
                        title: '清算周期',
                        dataIndex: 'settlementInterval',
                    },
                    {
                        title: '操作',
                        customRender: (row) => {
                            return (
                                <a-button type="danger" onClick={() => this.category.removeItem(row.id)}>删除</a-button>
                            )
                        },
                        width: 120,
                    },
                ],
                dialog: { // 弹窗
                    $vm: this,
                    data: {
                        $vm: this,
                        dataSource: [],
                        targetKeys: [],
                        selectedKeys: [],
                        onSelectChange (sourceSelectedKeys, targetSelectedKeys) {
                            this.selectedKeys = [ ...sourceSelectedKeys, ...targetSelectedKeys ]
                        },
                        onChange (nextTargetKeys, direction, moveKeys) {
                            this.targetKeys = nextTargetKeys
                        },
                        getDataSource () {
                            this.$vm.$services.getProxyGoodsCategorys((res) => {
                                this.dataSource = res.data
                                this.targetKeys = this.$vm.category.nowDatas.map(item => String(item.id))
                            })
                        },
                    },
                    title: '设置分类',
                    render: ({ data }) => {
                        return (
                            <div>
                                <a-transfer
                                    dataSource={data.dataSource}
                                    showSearch
                                    titles={[ '所有分类', '已添加分类' ]}
                                    targetKeys={data.targetKeys}
                                    selectedKeys={data.selectedKeys}
                                    render={item => item.title}
                                    onSelectChange={(...args) => data.onSelectChange(...args)}
                                    onChange={(...args) => data.onChange(...args)}
                                />
                            </div>
                        )
                    },
                    onOpen () {
                        this.data.getDataSource()
                        this.data.filterValue = ''
                    },
                    submit ({ data }) {
                        const dataMap = data.dataSource.reduce((result, item) => {
                            result[item.key] = item
                            return result
                        }, {})

                        const oldDatasIntervalMap = data.$vm.category.nowDatas.reduce((results, item) => {
                            results[item.id] = item.settlementInterval
                            return results
                        }, {})

                        data.$vm.category.nowDatas = data.targetKeys.map(id => ({ id, name: dataMap[id].name, settlementInterval: oldDatasIntervalMap[id] || '/' }))
                        this.close()
                    },
                },
                removeItem (id) {
                    this.$vm.$confirm({
                        title: '温馨提示',
                        content: '您确定要删除该数据？',
                        onOk: () => {
                            this.nowDatas.splice(this.nowDatas.findIndex(item => item.id === id), 1)
                        },
                    })
                },
            },
            brand: { // 品牌模块数据
                $vm: this,
                nowDatas: [], // 当前数据
                selectOptions: [ // 品牌资质下拉选项数据
                    { label: '品牌方', value: 1 },
                    { label: '一级代理', value: 2 },
                    { label: '二级代理', value: 3 },
                    { label: '网络总代', value: 4 },
                    { label: '其他', value: 5 },
                ],
                columns: [ // 表格配置
                    {
                        title: '序号',
                        customRender: (value, row, index) => index,
                        width: 70,
                    },
                    {
                        title: '名牌名称',
                        dataIndex: 'name',
                    },
                    {
                        title: () => {
                            return <div class="ant-form-item-required">代理资质</div>
                        },
                        dataIndex: 'qualification',
                        customRender: (value, row) => {
                            return (
                                <a-select placeholder="请选择代理资质" v-model={row.qualification} options={this.brand.selectOptions} style="width:100%;"></a-select>
                            )
                        },
                        width: 200,
                    },
                    {
                        title: () => {
                            return <div class="ant-form-item-required">资质有效期</div>
                        },
                        dataIndex: 'qualificationValidityPeriod',
                        customRender: (value, row) => {
                            return (
                                <a-range-picker v-model={row.qualificationValidityPeriod} />
                            )
                        },
                        width: 320,
                    },
                    {
                        title: () => {
                            return <div class="ant-form-item-required">资质证明（最多3张）</div>
                        },
                        dataIndex: 'qualificationProveImgs',
                        customRender: (value, row) => {
                            return (
                                <div class="imgs-box">
                                    {
                                        row.qualificationProveImgs.map((imgSrc, index) => {
                                            const src = imgSrc || require('./imgs/default.png')
                                            return (
                                                <viewer images={[ src ]} class="img-box">
                                                    <img src={src} alt="" />
                                                    <a-icon type="close-circle" onClick={() => this.brand.removeImg(row, index)} />
                                                </viewer>
                                            )
                                        })
                                    }
                                    {
                                        row.qualificationProveImgs.length < 3 ? (
                                            <a-upload
                                                accept=".jpg, .jpeg, .png"
                                                action={this.$OSSURL}
                                                listType="picture-card"
                                                showUploadList={false}
                                                onChange={(...args) => this.brand.handleChange(...args, row)}
                                                disabled={row.imgUploading}
                                                beforeUpload={(...args) => this.handleBeforeUpload(...args, row)}
                                            >
                                                <a-icon type={row.imgUploading ? 'loading' : 'plus'} />
                                            </a-upload>
                                        ) : ''
                                    }
                                </div>
                            )
                        },
                        width: 240,
                    },

                    {
                        title: '操作',
                        customRender: (row) => {
                            return (
                                <a-button type="danger" onClick={() => this.brand.removeItem(row.id)}>删除</a-button>
                            )
                        },
                        width: 120,
                    },
                ],
                dialog: { // 弹窗
                    $vm: this,
                    data: {
                        $vm: this,
                        dataSource: [],
                        targetKeys: [],
                        selectedKeys: [],
                        onSelectChange (sourceSelectedKeys, targetSelectedKeys) {
                            this.selectedKeys = [ ...sourceSelectedKeys, ...targetSelectedKeys ]
                        },
                        onChange (nextTargetKeys, direction, moveKeys) {
                            this.targetKeys = nextTargetKeys
                        },
                        getDataSource () {
                            this.$vm.$services.getProxyGoodsBrands(null, (res) => {
                                if (!res.err) {
                                    this.dataSource = res.data
                                    this.targetKeys = this.$vm.brand.nowDatas.map(item => String(item.id))
                                }
                            })
                        },
                    },
                    title: '设置品牌',
                    render: ({ data }) => {
                        return (
                            <div>
                                <a-transfer
                                    showSearch
                                    dataSource={data.dataSource}
                                    titles={[ '所有分类', '已添加分类' ]}
                                    targetKeys={data.targetKeys}
                                    selectedKeys={data.selectedKeys}
                                    render={item => item.title}
                                    onSelectChange={(...args) => data.onSelectChange(...args)}
                                    onChange={(...args) => data.onChange(...args)}
                                />
                            </div>
                        )
                    },
                    onOpen () {
                        this.data.getDataSource()
                        this.data.filterValue = ''
                    },
                    submit ({ data }) {
                        const dataMap = data.dataSource.reduce((result, item) => {
                            result[item.key] = item
                            return result
                        }, {})
                        const oldDatas = data.$vm.brand.nowDatas
                        const oldDataMap = oldDatas.reduce((result, item) => {
                            result[item.id] = item
                            return result
                        }, {})

                        data.$vm.brand.nowDatas = data.targetKeys.map(id => {
                            const oldData = oldDataMap[id]
                            const newData = {
                                id,
                                name: dataMap[id].name,
                            }
                            if (oldData) {
                                newData.qualification = oldData.qualification
                                newData.qualificationValidityPeriod = oldData.qualificationValidityPeriod
                                newData.qualificationProveImgs = oldData.qualificationProveImgs
                            } else {
                                newData.qualification = undefined
                                newData.qualificationValidityPeriod = undefined
                                newData.qualificationProveImgs = []
                            }
                            return newData
                        })
                        this.close()
                    },
                },
                removeItem (id) {
                    this.$vm.$confirm({
                        title: '温馨提示',
                        content: '您确定要删除该数据？',
                        onOk: () => {
                            this.nowDatas.splice(this.nowDatas.findIndex(item => item.id === id), 1)
                        },
                    })
                },
                handleChange (event, row) {
                    // console.info({ event, row })
                    const { status, response } = event.file
                    if (status === 'uploading') {
                        row.imgUploading = true
                    } else {
                        if (event.file.status === 'done') {
                            const imgUrl = response.data
                            row.qualificationProveImgs.push(imgUrl)
                        }
                        row.imgUploading = false
                    }
                },

                removeImg (row, index) {
                    row.qualificationProveImgs.splice(index, 1)
                },

            },
        }
    },
    watch: {
        'option.data' (value) {
            this.category.nowDatas = value.category.nowDatas || []
            this.brand.nowDatas = value.brand.nowDatas || []
        },
    },
    created () {
        this.option.getValues = (callback) => {
            let errors = null
            const values = {
                category: this.category.nowDatas,
                brand: this.brand.nowDatas,
            }
            const brands = values.brand
            for (let i = 0; i < brands.length; i++) {
                const brand = brands[i]
                if (!brand.qualification) {
                    errors = { elementId: 'financeProxyBrand', message: '代理资质不能为空' }
                    break
                }
                if (brand.qualificationValidityPeriod.length === 0 || !brand.qualificationValidityPeriod[0]) {
                    errors = { elementId: 'financeProxyBrand', message: '资质有效期不能为空' }
                    break
                }
                if (brand.qualificationProveImgs.length === 0) {
                    errors = { elementId: 'financeProxyBrand', message: '资质证明图片不能为空' }
                    break
                }
                // console.info(brand)
            }

            callback(errors, values)
        }
    },
    methods: {
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

    render () {
        const { category, brand } = this

        return (
            <wgt-card class="finance-info">
                <h3 class="title">代理信息 </h3>
                <div class="item">
                    <div class="header">
                        <span class="sub-title">代理分类</span>
                        <a-button type="primary" onClick={() => category.dialog.open()}>批量设置分类</a-button>
                    </div>
                    <wgt-dialog option={this.category.dialog} />
                    <a-table locale={{ emptyText: '没有相关的数据' }} bordered pagination={false} dataSource={category.nowDatas} columns={category.columns} rowKey={row => row.id} style="max-width:1200px">
                    </a-table>
                </div>

                <div class="item">
                    <div class="header">
                        <span class="sub-title" id="financeProxyBrand">代理品牌</span>
                        <a-button type="primary" onClick={() => brand.dialog.open()}>批量设置品牌</a-button>
                    </div>
                    <wgt-dialog option={this.brand.dialog} />
                    <a-table locale={{ emptyText: '没有相关的数据' }} bordered pagination={false} dataSource={brand.nowDatas} columns={brand.columns} rowKey={row => row.id} style="max-width:1200px">
                    </a-table>
                </div>
            </wgt-card>
        )
    },
}
</script>
<style lang="less">
.finance-info {
  .item {
    margin-bottom: 20px;

    .header {
      margin-bottom: 16px;

      .sub-title {
        display: inline-block;
        font-weight: bold;
        width: 120px;
      }
    }

    .ant-table-thead th,
    .ant-table-tbody {
      text-align: center;
    }

    .ant-upload-select-picture-card {
      border-radius: 6px;
      cursor: pointer;
      height: 60px;
      margin: 0;
      width: 60px;

      &.ant-upload-disabled {
        cursor: default;
      }

      &:hover {
        border-color: #1890ff;
      }
    }

    .imgs-box {
      display: flex;
      margin-right: -12px;

      .img-box {
        position: relative;

        img {
          border-radius: 8px;
          height: 60px;
          margin-right: 12px;
          width: 60px;
        }

        .anticon-close-circle {
          cursor: pointer;
          position: absolute;
          right: 5px;
          top: -3px;

          &:hover {
            color: red;
          }
        }
      }
    }
  }
}
</style>
