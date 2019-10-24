<template>
  <a-layout class="basic-layout">
    <basic-sidebar :collapsed="collapsed" />
    <a-layout class="basic-content">
      <basic-header :collapsed="collapsed" @toggle="toggle" />
      <router-view />
    </a-layout>
  </a-layout>
</template>
<script>
import BasicSidebar from '@/components/basic-sidebar'
import BasicHeader from '@/components/basic-header'

// import { sensorsInit } from '@/utils/sensors'

export default {
    components: {
        BasicSidebar,
        BasicHeader,
    },
    data () {
        return {}
    },
    computed: {
        collapsed () {
            return this.$state.app.sidebar.collapsed
        },
        paddingLeft () {
            return this.collapsed ? '80px' : '200px'
        },
    },
    mounted () {
        // sensorsInit(this.$state.user && this.$state.user.userCode)
    },
    methods: {
        toggle () {
            this.$store.commit('TOGGLE_SIDEBAR')
        },
    },
}
</script>
<style lang="less">
.basic-layout {
  height: auto;
  overflow-x: hidden;

  .basic-content {
    overflow-y: scroll;
    height: 100vh;
  }
}
</style>
