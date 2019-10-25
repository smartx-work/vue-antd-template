
<template functional>
  <a-sub-menu :key="props.menuItem.path">
    <span slot="title">
      <a-icon v-if="props.menuItem.icon" :type="props.menuItem.icon" />
      <span>{{ props.menuItem.label }}</span>
    </span>

    <template v-for="item in props.menuItem.children">
      <sub-menu v-if="item.children" :key="item.path" :menu-item="item" />
      <a-menu-item v-else :key="item.path">
        <a-icon v-if="item.icon" :type="item.icon" />
        <span>{{ item.label }}</span>
      </a-menu-item>
    </template>
  </a-sub-menu>
</template>

<script>
export default {
    props: {
        menuItem: {
            type: Object,
            required: true,
        },
    },
}
</script>
