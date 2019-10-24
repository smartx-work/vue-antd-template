<template>
  <a-breadcrumb class="basic-breadcrumb">
    <a-breadcrumb-item v-for="(item, index) in list" :key="item.name">
      <router-link
        v-if="item.name != name && index != 1"
        :to="{ path: item.path === '' ? '/' : item.path }"
      >
        {{ item.meta.label }}
      </router-link>
      <span v-else>{{ item.meta.label }}</span>
    </a-breadcrumb-item>
    <a-breadcrumb-item class="last-router-link">
      <router-link :to="{ path: last.path === '' ? '/' : last.path }">
        {{ last.meta.label }}
      </router-link>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
export default {
    data () {
        return {
            name: '',
            list: [],
            last: {},
        }
    },
    watch: {
        $route () {
            this.initList()
        },
    },
    created () {
        this.initList()
    },
    methods: {
        initList () {
            this.list = [ { name: 'index', path: '/', meta: { label: '首页' } } ]
            if (/^(dashboard|index)$/.test(this.$route.name)) {
                return
            }
            for (let i = 0; i < this.$route.matched.length - 1; i++) {
                this.list.push(this.$route.matched[i])
            }
            this.last = this.$route.matched[this.$route.matched.length - 1]
        },
    },
}
</script>

<style scoped>
</style>
