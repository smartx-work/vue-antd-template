<template>
  <div class="wgt-area-picker">
    <a-row>
      <a-col :span="6">
        <a-select
          :placeholder="provincesLoading ? '省份加载中...' : '请选择省份'"
          :loading="provincesLoading"
          :allow-clear="true"
          :options="provinces"
          :value="provincesLoading ? undefined : province"
          @change="provinceChange"
        />
      </a-col>

      <a-col :span="6" style="padding-left:12px">
        <a-select
          :placeholder="citysLoading ? '城市加载中...' : '请选择城市'"
          :loading="citysLoading"
          :allow-clear="true"
          :options="citys"
          :value="citysLoading ? undefined : city"
          @change="cityChange"
        />
      </a-col>

      <a-col :span="6" style="padding-left:12px">
        <a-select
          :placeholder="areasLoading ? '地区加载中...' : '请选择地区'"
          :loading="areasLoading"
          :allow-clear="true"
          :options="areas"
          :value="areasLoading ? undefined : area"
          @change="areaChange"
        />
      </a-col>

      <a-col :span="6" style="padding-left:12px">
        <a-select
          :placeholder="streetsLoading ? '地区加载中...' : '请选择街道'"
          :loading="streetsLoading"
          :allow-clear="true"
          :options="streets"
          :value="streetsLoading ? undefined : street"
          @change="streetChange"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
    components: {
    },
    props: {
        value: [ Array ],
    },
    data () {
        return {
            provincesLoading: true,
            citysLoading: false,
            areasLoading: false,
            streetsLoading: false,

            provinces: [],
            citys: [],
            areas: [],
            streets: [],

            province: undefined,
            city: undefined,
            area: undefined,
            street: undefined,

            provinceName: '',
            cityName: '',
            areaName: '',
            streetName: '',
        }
    },
    watch: {
        value (value) {
            const [ province, city, area, street ] = value

            if (this.province !== province) {
                this.province = province
                if (province != null) {
                    this.getCitys()
                }
            }

            if (this.city !== city) {
                this.city = city
                if (city != null) {
                    this.getAreas()
                }
            }

            if (this.area !== area) {
                this.area = area
                if (area != null) {
                    this.getStreets()
                }
            }

            if (this.street !== street) {
                this.street = street
            }
        },
    },
    created () {
        this.$services.getAreaPickerDatas({ code: 0 }, (res) => {
            if (!res.err) {
                this.provinces = res
            }
            this.provincesLoading = false
        })
    },

    beforeMount () {
        if (this.city) {
            this.cityChange()
        }
        if (this.area) {
            this.areaChange()
        }
        if (this.street) {
            this.streetChange()
        }
    },

    methods: {
        provinceChange (code, node) {
            this.provinceName = node ? node.componentOptions.children[0].text : ''
            this.province = code
            this.city = this.area = this.street = undefined
            this.citys = []
            this.areas = []
            this.streets = []
            this.getCitys()
            this.changeValue()
        },
        cityChange (code, node) {
            this.cityName = node ? node.componentOptions.children[0].text : ''
            this.city = code
            this.area = this.street = undefined
            this.areas = []
            this.streets = []
            this.getAreas()
            this.changeValue()
        },
        areaChange (code, node) {
            this.areaName = node ? node.componentOptions.children[0].text : ''
            this.area = code
            this.street = undefined
            this.streets = []
            this.getStreets()
            this.changeValue()
        },
        streetChange (code, node) {
            this.streetName = node ? node.componentOptions.children[0].text : ''
            this.street = code
            this.changeValue()
        },
        changeValue () {
            this.$emit('change', [ this.province, this.city, this.area, this.street ], [ this.provinceName, this.cityName, this.areaName, this.streetName ])
        },

        getCitys () {
            // 未选中省
            if (this.province === undefined) {
                return
            }

            this.citysLoading = true
            this.$services.getAreaPickerDatas({ code: this.province }, (res) => {
                if (!res.err) {
                    this.citys = res
                }
                this.citysLoading = false
            })
        },
        getAreas () {
            // 未选中省
            if (this.city === undefined) {
                return
            }

            this.areasLoading = true
            this.$services.getAreaPickerDatas({ code: this.city }, (res) => {
                if (!res.err) {
                    this.areas = res
                }
                this.areasLoading = false
            })
        },
        getStreets () {
            if (this.area === undefined) {
                return
            }
            this.streetsLoading = true
            this.$services.getAreaPickerDatas({ code: this.area }, (res) => {
                if (!res.err) {
                    this.streets = res
                }
                this.streetsLoading = false
            })
        },
    },
}
</script>
<style lang="scss">
</style>
