<template>
  <a-locale-provider :locale="zhCN">
    <div id="main">
      <router-view />
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

export default {
    data () {
        return {
            zhCN,
        }
    },
}
</script>
