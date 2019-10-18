<template>
  <a-layout class="basic-layout">
    <h1>导航</h1>
    <div>
      <router-link to="/b">
        页面B
      </router-link>
      <router-link to="/home">
        页面Home
      </router-link>
    </div>

    <a-layout class="basic-content">
      <router-view />
    </a-layout>
  </a-layout>
</template>
<script>
export default {
    components: {

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
    beforeMount () {
    // ...
    },
    mounted () {},
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
