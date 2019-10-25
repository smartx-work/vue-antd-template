<template>
  <div class="page-login">
    <img class="leaf-img" :src="leafImg" alt>
    <div class="page-login-box">
      <div class="login-form-outer">
        <h4 class="title">
          <svg-icon type="share-goods" alt="logo" />
          <div>秀购商家中心</div>
        </h4>

        <div class="login-type">
          <a :class="{ active: loginType === 'ACCOUNT' }" @click="loginType = 'ACCOUNT'">账号登录</a>
          <a :class="{ active: loginType === 'PHONE' }" @click="loginType = 'PHONE'">手机号登录</a>
        </div>

        <a-form :form="form" class="login-form" @submit.prevent="handleSubmit">
          <a-form-item v-show="loginType === 'ACCOUNT'">
            <a-input
              v-decorator="formDecorators.account"
              :placeholder="formDecorators.account[1].rules[0].message"
              @change="$input.trim"
            >
              <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25);" />
            </a-input>
          </a-form-item>
          <a-form-item v-show="loginType === 'ACCOUNT'">
            <a-input
              v-decorator="formDecorators.password"
              type="password"
              :placeholder="formDecorators.password[1].rules[0].message"
            >
              <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25);" />
            </a-input>
          </a-form-item>


          <a-form-item v-show="loginType === 'PHONE'">
            <a-input
              v-decorator="formDecorators.mobile"
              :placeholder="formDecorators.mobile[1].rules[0].message"
              @change="$input.trim"
            >
              <a-icon slot="prefix" type="mobile" style="color: rgba(0, 0, 0, 0.25);" />
            </a-input>
          </a-form-item>
          <a-form-item v-show="loginType === 'PHONE'">
            <a-input-group compact>
              <a-input
                v-decorator="formDecorators.verificationCode"
                style="width: 70%;"
                type="text"
                :placeholder="formDecorators.verificationCode[1].rules[0].message"
              >
                <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25);" />
              </a-input>
              <a-button
                type="primary"
                class="code-button"
                :disabled="countdown > 0"
                @click="getCode"
              >
                {{ countdown ? countdown + '秒' : '获取验证码' }}
              </a-button>
            </a-input-group>
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              class="login-form-button"
              :loading="loginLoading"
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
      <img class="login-img" :src="loginImg" alt>
    </div>
    <div class="footer">
      Copyright © 2018 杭州名融网络有限公司 All Rights Reserved
    </div>
  </div>
</template>
<script>
import logoImg from '@/assets/logo.png'
import leafImg from './assets/leaf.png'
import loginImg from './assets/login.png'

export default {
    data () {
        return {
            // 图片资源
            logoImg,
            leafImg,
            loginImg,


            loginType: 'ACCOUNT',
            loginLoading: false,

            form: this.$form.createForm(this),
            formDecorators: {
                account: [ 'account', {
                    initialValue: 'xxx',
                    rules: [ { required: true, message: '请输入用户名' } ],
                } ],
                password: [ 'password', {
                    initialValue: 'xxx',
                    rules: [ { required: true, message: '请输入密码' } ],
                } ],
                mobile: [ 'mobile', {
                    rules: [ { required: true, message: '请输入手机号' } ],
                } ],
                verificationCode: [ 'verificationCode', {
                    rules: [ { required: true, message: '请输入验证码' } ],
                } ],
            },

            countdown: 0,
            countdownTimer: null,
        }
    },


    methods: {
        getCode () { // 错误处理，不抛出的，使用统一状态码处理，抛出的，res, err
            const { validateFields } = this.form
            validateFields([ 'mobile' ], (err, values) => {
                if (!err) {
                    this.$api.getVerificationCode({ mobile: values.mobile }, () => {
                        this.$message.success('验证码发送成功')
                        this.countdown = 120
                        this.countdownTimer = setInterval(() => {
                            if (--this.countdown === 0) {
                                clearInterval(this.countdownTimer)
                            }
                        }, 1000)
                    })
                }
            })
        },
        handleSubmit () {
            const service = this.loginType ? { name: 'loginByAccount', params: [ 'account', 'password' ] } : { name: 'loginByMobile', params: [ 'mobile', 'verificationCode' ] }
            this.form.validateFields(service.params, (err, params) => {
                if (err) {
                    return
                }
                this.loginLoading = true
                this.$services[service.name](params, (res, err) => {
                    if (!err) {
                        this.$store.commit('LOGIN', res)
                        this.$router.push({ name: 'merchant-selector' })
                    }
                    this.loginLoading = false
                })
            })
        },
    },
}
</script>
<style lang="less">
.page-login {
  background: linear-gradient(to bottom right, #ebf5fc, #f3f6fe);
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;

  .leaf-img {
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 1500px;
  }

  .page-login-box {
    background-color: #fff;
    border-radius: 10px;
    height: 600px;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 1000px;

    h4 {
      padding-top: 14px;

      img {
        width: 40px;
      }

      .xiugou {
        font-weight: bold;
        margin: 0 8px 0 14px;
      }

      span:last-child {
        opacity: 0.6;
      }
    }

    input {
      height: 40px;
      line-height: 40px;
    }

    .login-form-outer {
      margin-left: 50px;
      width: 350px;

      .ant-form-item-control-wrapper {
        margin-bottom: 14px;
      }

      .ant-form-explain {
        color: #9fa8af;
        margin-top: 8px;
      }

      svg {
        color: #9fa8af;
      }

      input {
        color: #9fa8af;
      }

      .login-form-button {
        border-radius: 20px;
        box-shadow: 0 4px 8px rgba(101, 196, 255, 0.55);
        width: 150px;
      }
    }

    .login-img {
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  .title {
    svg {
      font-size: 50px;
      height: 100px;
    }

    color: #333;
    font-size: 30px;
    margin: 0 auto 100px;
  }

  .login-form {
    width: 300px;

    &-button {
      height: 40px;
      line-height: 40px;
      width: 100%;
    }
  }

  .footer {
    bottom: 30px;
    color: #aaa;
    font-size: 14px;
    left: 0;
    opacity: 0.5;
    position: fixed;
    text-align: center;
    width: 100%;
  }

  .login-type {
    margin: 30px auto;

    a {
      color: #9fa8af;
      display: inline-block;
      font-size: 16px;
      padding-right: 14px;
      text-align: center;

      &.active {
        color: #333;
        font-weight: bold;
      }
    }
  }

  .code-button {
    height: 40px;
    line-height: 40px;
    width: 30%;
  }
}
</style>
