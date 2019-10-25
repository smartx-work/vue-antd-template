<template>
  <a-layout-sider
    v-model="collapsed"
    class="basic-sidebar"
    theme="light"
    :width="collapsed ? '60px' : '200px'"
  >
    <div class="logo">
      <router-link :to="{ name: 'index' }">
        <svg-icon type="logo" alt="logo" />
        <h1>{{ '秀购商家中心' }}</h1>
      </router-link>
    </div>


    <a-menu
      mode="inline"
      theme="light"
      :open-keys="openKeys"
      :selected-keys="selectedKeys"
      @select="onSelect"
      @click="onClick"
      @openChange="onOpenChange"
    >
      <template v-for="item in menulist">
        <sub-menu v-if="item.children" :key="item.path" :menu-item="item" />
        <a-menu-item v-else :key="item.path">
          <svg-icon v-if="item.icon" :type="item.icon" />
          <span>{{ item.label }}</span>
        </a-menu-item>
      </template>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import { menulist } from '@/router'
import subMenu from './sub-menu'
export default {
    components: {
        subMenu,
    },
    props: {
        collapsed: {
            type: Boolean,
        },
    },
    data () {
        return {
            defaultSelectedKeys: [],
            defaultOpenKeys: [],
            openKeys: [],
            selectedKeys: [],
            openKeysBackup: [], // 在展开方式切换的时候，openKeys会进行备份和回填
        }
    },
    computed: {
        menulist () {
            return menulist()
        },
    },
    watch: {
        // 路由变更时更新选中和打开的菜单配置
        $route () {
            this.updateKeys()
        },

        // 折叠的时候保存菜单openKeys
        collapsed (collapsed) {
            if (collapsed) {
                this.openKeysBackup = this.openKeys
                this.openKeys = []
            } else {
                this.openKeys = this.openKeysBackup
            }
        },
    },
    created () {
        this.updateKeys()
    },
    methods: {
        updateKeys () {
            const routePath = this.$route.path
            const paths = routePath.split('/')
            const curPaths = [ '' ]
            const openKeys = []

            for (let i = 1; i < paths.length - 1; i++) {
                curPaths.push(paths[i])
                openKeys.push(curPaths.join('/'))
            }

            // 根据当前菜单是否展开状态设置openkeys
            if (this.collapsed) {
                this.openKeysBackup = openKeys
            } else {
                this.openKeys = openKeys
            }
            this.selectedKeys = [ routePath ]
        },

        onSelect (menuItem) {
            this.$router.push({
                path: menuItem.key,
            })
        },
        onClick () {},
        onOpenChange (openKeys) {
            this.openKeys = openKeys
        },
    },
}
</script>
<style lang="less">
.basic-sidebar {
  width: 200px;

  .logo {
    background: linear-gradient(
      270deg,
      rgba(159, 136, 244, 1) 0%,
      rgba(56, 153, 218, 1) 100%
    );
    height: 64px;
    line-height: 64px;
    overflow: hidden;
    padding-left: 24px;
    position: relative;
    transition: all 0.3s;

    svg {
      display: inline-block;
      height: 32px;
      vertical-align: middle;
      width: 32px;
    }

    h1 {
      color: #fff;
      display: inline-block;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      font-size: 18px;
      font-weight: lighter;
      margin: 0 0 0 12px;
      vertical-align: middle;
    }
    margin-bottom: 20px;
  }

  &.collapsed {
    width: 80px;
  }

  .ant-menu-item.ant-menu-item-selected {
    background: linear-gradient(
      270deg,
      rgba(159, 136, 244, 1) 0%,
      rgba(56, 153, 218, 1) 100%
    );
    border-radius: 0 20px 20px 0;
    color: #fff;

    &::after {
      border: none;
    }
  }
}
</style>
