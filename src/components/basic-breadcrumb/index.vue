<template>
  <a-breadcrumb class="basic-breadcrumb">
    <a-breadcrumb-item v-for="(item, index) in items" :key="index">
      <router-link v-if="item.name === 'index'" :to="{ path: item.path }">
        {{ item.meta.label }}
      </router-link>
      <span v-else>{{ item.meta.label }}</span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
export default {
    computed: {
        items () {
            const items = [ { name: 'index', path: '/', meta: { label: '首页' } } ]
            for (let i = 1; i < this.$route.matched.length; i++) {
                items.push(this.$route.matched[i])
            }
            return items
        },
    },
}
</script>
