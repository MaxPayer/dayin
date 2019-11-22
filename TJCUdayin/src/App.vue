<template>
  <div id="app">
    <div>
      <mu-appbar style="width: 100%;" color="primary" z-depth="0">
        <mu-button icon slot="left">
          <mu-icon value="account_balance"></mu-icon>
        </mu-button>
        <div>
          <mu-row>
            <mu-col span="2">
              <mu-select v-model="school" style="width: 80%" class="select-school" :solo="true" popover-class="white" @change="_changeSchool">
                <mu-option v-for="option in locationInfo" :key="option.address" :label="option.address" :value="option.address"></mu-option>
              </mu-select>
            </mu-col>
            <mu-col span="7" style="font-size: 22px;">
              校园打印 - 校园云打印平台 ￥0 起送 配送费 ￥0
            </mu-col>
            <mu-col span="3">
               <mu-flex justify-content="center" style="height: 6.4rem">
                <mu-button color="primary" flat style="font-size: 18px"  @click="$router.push('/')" v-if="$route.path !== '/'">首页</mu-button>
                <mu-button color="primary" flat style="font-size: 18px" @click="_login" v-if="!loginStatus">登录</mu-button>
                <mu-button color="primary" flat style="font-size: 18px" @click="$router.push('/Person')" v-if="loginStatus">个人中心</mu-button>
                <mu-button color="primary" flat style="font-size: 18px" @click="_recharge">充值</mu-button>
                <mu-button color="primary" flat style="font-size: 18px" @click="_qq">
                  <mu-icon value=":iconfont icon-qq" size="24" style="margin-top: 5px;"></mu-icon>
                  联系客服
                </mu-button>
              </mu-flex>
            </mu-col>
          </mu-row>
        </div>
      </mu-appbar>
    </div>
    <mu-dialog title="登录" width="360" :open.sync="openLogin" :overlay-close="false">
      <div class="qr-box"><vue-qr :text="text" :size="200"></vue-qr></div>
      <div class="saosao">微信扫一扫登录</div>
      <mu-button slot="actions" flat color="primary" @click="_closeLogin">关闭</mu-button>
    </mu-dialog>
    <router-view/>
    <!-- 全屏加载 -->
    <div class="screen-loading" v-show="loading">
      <vue-loading type="bars" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { VueLoading } from 'vue-loading-template'
import { sign, checkLogin } from './api'
import Cookies from 'js-cookie'
import VueQr from 'vue-qr'
export default {
  name: 'App',
  components: {VueQr, VueLoading},
  computed: {
    ...mapState(['school', 'locationInfo', 'loginStatus', 'loading'])
  },
  data () {
    return {
      text: null,
      openLogin: false,
      notOpenLogin: false,
      login: null
    }
  },
  mounted () {
    let token = Cookies.get('token')
    this.$root._login = this._login
    if (!token) return
    if (token) {
      this.setLoginStatus(1)
      this.getUserInfo()
    }
  },
  methods: {
    ...mapActions(['getUserInfo']),
    ...mapMutations(['setSchool', 'setLoginStatus', '_basicPrinting']),
    _changeSchool (value) {
      this.setSchool(value)
    },
    _qq () {
      window.location.href = 'tencent://message/?uin=2757625378&Site=https://www.schooldayin.com/&Menu=yes'
    },
    _recharge () {
      if (!Cookies.get('token')) {
        this.$confirm('未登录, 去登陆', '提示', {
          type: 'warning'
        }).then(({ result }) => {
          if (result) {
            this._login()
          }
        })
        this.setLoginStatus(0)
        return null
      }
      this.$router.push('/recharge')
    },
    _closeLogin () {
      clearInterval(this.login)
      this.openLogin = false
    },
    async _checkLogin () {
      clearInterval(this.login)
      this.login = setInterval(async () => {
        try {
          let signCookie = Cookies.get('sign')
          if (!signCookie || signCookie === 'undefined') {
            this.setLoginStatus(0)
            clearInterval(this.login)
            Cookies.remove('sign')
            this.$alert('登录失败', {icon: 'warningIcon', transition: 'slide-left'})
            this.openLogin = false
          }
          let loginStatus = await checkLogin({sign: signCookie})
          let { token } = loginStatus.data
          if (token) {
            this.setLoginStatus(1)
            Cookies.set('token', token, {expires: 1 / 24})
            this.$alert('登录成功', '提示')
            this.openLogin = false
            clearInterval(this.login)
            this.getUserInfo()
          }
        } catch (e) {
          console.log(e)
          this.setLoginStatus(0)
          clearInterval(this.login)
          Cookies.remove('sign')
          this.$alert('登录失败', {icon: 'warningIcon', transition: 'slide-left'})
          this.openLogin = false
        }
      }, 5000)
    },
    async _login () {
      try {
        if (this.notOpenLogin) return
        this.notOpenLogin = true
        let url = null
        let signCookie = Cookies.get('sign')
        if (signCookie && signCookie !== 'undefined') {
          url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx69ac56ec1fde94b1&redirect_uri=http://rex.schooldayin.com&response_type=code&scope=snsapi_userinfo&state=${signCookie}#wechat_redirect=1`
        } else {
          let info = await sign()
          info = info.data
          Cookies.set('sign', info.sign, {expires: 2 / (24 * 60)})
          url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx69ac56ec1fde94b1&redirect_uri=http://rex.schooldayin.com&response_type=code&scope=snsapi_userinfo&state=${info.sign}#wechat_redirect=1`
        }
        this.text = url
        this.openLogin = true
        this._checkLogin()
        this.notOpenLogin = false
      } catch (e) {
        console.log(e)
        this.notOpenLogin = false
        this.$alert('登录错误, 请联系管理员或稍后重试', {icon: 'warningIcon', transition: 'slide-left'})
      }
    }
  }
}
</script>

<style>
@import url('./assets/fonts/material-icons.css');
@import url('./assets/font_QQ/iconfont.css');
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.select-school {
  margin: 0!important;
  padding: 0!important;
  color: white;
}
.select-school .mu-select-input {
  font-size: 18px!important;
  color: white!important;
}
.mu-select-action {
  color: white!important;
}
.qr-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
.screen-loading {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.saosao {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  letter-spacing: 2px;
}
</style>
