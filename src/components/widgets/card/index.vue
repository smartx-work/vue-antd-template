<template>
  <a-card class="wgt-card" v-bind="$props">
    <slot />
  </a-card>
</template>
<script>
export default {

}
</script>

<style lang="less">
.wgt-card {
  border-radius: 10px;
  margin: 20px;
}
</style>
