
<template>
  <div class="user-menu">
    <div class="content-box">
      <span class="user-nickname">
        <div>{{ $state.user.name }}</div>
        <div>当前商家：{{ $state.user.merchant.name }}</div>
      </span>
      <a-dropdown>
        <span class="button">
          <a-avatar :src="$state.user.avatar || logo" class="mr-avatar" />
          <a-icon type="caret-down" />
        </span>
        <a-menu slot="overlay">
          <a-menu-item key="0">
            <span @click="modifyPassword">
              <a-icon type="setting" />
              <span>修改密码</span>
            </span>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="1">
            <span @click="handleLogout">
              <a-icon type="logout" />
              <span>退出登录</span>
            </span>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import logo from '@/assets/logo.png'
export default {
    data () {
        return {
            logo,
        }
    },
    methods: {
        modifyPassword () {

        },
        handleLogout () {
            this.$store.commit('LOGOUT')
            this.$router.push('/login')
        },
    },
}
</script>

<style lang="less">
.basic-header {
  .user-menu {
    align-self: flex-end;
    margin-left: auto;

    .button {
      color: rgba(0, 0, 0, 0.65);
      cursor: pointer;
      display: inline-block;
      height: 100%;
      padding: 0 12px;
      -webkit-transition: all 0.3s;
      transition: all 0.3s;
    }

    .avatar {
      background: hsla(0, 0%, 100%, 0.85);
      color: #1890ff;
      margin: 20px 8px 20px 0;
      vertical-align: middle;
    }

    .mr-avatar {
      border: 1px solid rgba(56, 153, 218, 1);
      box-sizing: content-box;
    }

    .user-nickname {
      display: inline-block;
      line-height: 20px;
      padding: 0 5px;
      text-align: right;
      vertical-align: middle;

      div:first-child {
        color: #333;
        font-size: 14px;
        font-weight: 600;
      }

      div:last-child {
        color: #909399;
        font-size: 12px;
      }
    }
  }
}
</style>
