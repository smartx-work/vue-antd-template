<template>
  <wgt-card class="service-info">
    <h3 class="title">
      七鱼客服组
    </h3>

    <a-form v-if="detail.enabled">
      <a-form-item label="在线时间" v-bind="layoutConfig">
        {{ detail.workTime }}
      </a-form-item>
      <a-form-item label="在线工作日" v-bind="layoutConfig">
        {{ detail.workDays }}
      </a-form-item>
      <a-form-item label="状态" v-bind="layoutConfig">
        {{ detail.statusText }}
      </a-form-item>
    </a-form>

    <p v-else>
      暂无客服信息
    </p>
  </wgt-card>
</template>
<script>
export default {
    props: {
        option: {
            type: Object,
            required: true,
        },
    },
    data () {
        return {
            layoutConfig: { labelCol: { span: 5 }, wrapperCol: { span: 19 } },
        }
    },
    computed: {
        detail () {
            return this.option.data
        },
    },
}
</script>
