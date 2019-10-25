<template>
  <transition name="basic-header-transition">
    <div class="basic-header-wrapper">
      <a-layout-header class="basic-header">
        <div class="basic-header-inner">
          <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="$emit('toggle')" />
          <basic-breadcrumb />
          <router-link class="help-link" target="_blank" :to="{ path: '/help-document' }">
            帮助文档
          </router-link>
          <user-menu />
        </div>
      </a-layout-header>
    </div>
  </transition>
</template>

<script>
import BasicBreadcrumb from '@/components/basic-breadcrumb'
import userMenu from './components/user-menu'
export default {
    components: { BasicBreadcrumb, userMenu },
    props: {
        collapsed: {
            type: Boolean,
        },
    },
    data () {
        return {

        }
    },
}
</script>

<style lang="less">
.basic-header-transition-enter-active {
  transition: all 0.25s ease;
}

.basic-header-transition-leave-active {
  transition: all 0.5s ease;
}

.basic-header-transition-enter,
.basic-header-transition-leave-to {
  opacity: 0;
}

.basic-header-wrapper {
  position: relative;
  z-index: 2;
}

.basic-header {
  padding: 0;
}

.basic-header-inner {
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  height: 64px;
  padding: 0 12px 0 0;
  position: relative;

  .trigger {
    cursor: pointer;
    font-size: 20px;
    line-height: 69px;
    padding: 0 24px;
    transition: color 0.3s;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .basic-breadcrumb {
    line-height: 63px;
    margin-right: 16px;
  }

  .help-link {
    align-self: flex-start;
    margin-right: auto;
    font-size: 16px;
    padding-left: 24px;
    background: url("./assets/help-icon.png") 0 center no-repeat;
  }
}
</style>
