<template>
  <div>
    <div class="pay-box">
      <div class="logo-box">
        <div class="logo"><img src="@/assets/WePayLogo.png" style="height: 100; width: 80%" /></div>
        <div>收银台</div>
      </div>
      <div class="order-box">
        <div class="order">
          <div>订单编号 :   {{orderInfo.out_trade_no}}</div>
          <div>订单类型 :   {{orderInfo.trade_type}}</div>
        </div>
        <div class="order-pay">应付金额 :  ￥{{orderInfo.many}}</div>
      </div>
      <div class="qr-box">
        <div class="qr-title">
          <div><img src="@/assets/we.png" style="height: 40px; width: 40px;"/>  微信支付</div>
          <div>支付 :  <span class="many">{{orderInfo.many}}</span>元</div>
        </div>
        <div class="qr-cons">
          <div class="qr-con">
            <div><vue-qr :text="orderInfo.url" :size="250"></vue-qr><p class="qr-error" v-show="orderInfoError">订单生成错误</p></div>
            <div style="margin: 0"><img src="@/assets/shuoming.png" style="height: 100%; width: 100%;"/></div>
          </div>
          <div>
            <div><img src="@/assets/shuoming-copy.jpg" style="height: 100%; width: 100%" /></div>
          </div>
        </div>
      </div>
      <div class="many-box">
        <div class="select-box">
          <div @click="_many(20, 0)" :class="manyCon[0]? 'diaplay': ''">20元</div>
          <div @click="_many(50, 1)" :class="manyCon[1]? 'diaplay': ''">50元</div>
          <div @click="_many(100, 2)" :class="manyCon[2]? 'diaplay': ''">100元</div>
          <div @click="_many(200, 3)" :class="manyCon[3]? 'diaplay': ''">200元</div>
          <div @click="_many(500, 4)" :class="manyCon[4]? 'diaplay': ''">500元</div>
        </div>
      </div>
    </div>
    <mu-dialog :overlay-close="false" title="设置支付密码" width="50%" :open.sync="noPassword">
      <mu-text-field v-model="password" label="密码" :action-icon="visibility ? 'visibility_off' : 'visibility'" :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'"></mu-text-field><br/>
      <mu-text-field v-model="passwordCopy" label="在次输入密码" :action-icon="visibilityCopy ? 'visibility_off' : 'visibility'" :action-click="() => (visibilityCopy = !visibilityCopy)" :type="visibilityCopy ? 'text' : 'password'"></mu-text-field><br/>
      <div class="password-box">请牢记您的密码 不要向外人泄露</div>
      <mu-button slot="actions" flat color="primary" @click="_sure">确定</mu-button>
    </mu-dialog>
  </div>
</template>

<script>
import {lookPassword, setPassword, createOrder, checkPay} from '@/api/pay'
import VueQr from 'vue-qr'
import { mapMutations, mapActions } from 'vuex'
export default {
  data () {
    return {
      visibility: false,
      visibilityCopy: false,
      noPassword: false, // true 为不存在密码
      orderInfoError: false,
      password: '',
      notOrder: false,
      manyCon: [true, false, false, false, false],
      passwordCopy: '',
      orderInfo: {url: '订单生成中'}, // 订单数据
      info: {} // 账户数据
    }
  },
  components: {VueQr},
  created () {
    this._getBaseInfo()
    this._createOrder(20)
  },
  beforeRouteLeave (to, from, next) {
    clearInterval(this.pay)
    next()
  },
  methods: {
    ...mapMutations(['setLoding', 'removeLoding']),
    ...mapActions(['getUserInfo']),
    _many (many, i) {
      if (this.notOrder) {
        this.$alert('订单正在生成中', '提示')
        return
      }
      this.manyCon = new Array(6).fill(false)
      this.manyCon[i] = true
      this._createOrder(many)
    },
    _getBaseInfo () {
      lookPassword().then((result) => {
        if (!result) return
        result = result.data
        this.info = result.info
        if (result.password) return
        this.noPassword = true
      })
    },
    _checkPay () {
      clearInterval(this.pay)
      this.pay = setInterval(async () => {
        try {
          let pay = await checkPay({out_trade_no: this.orderInfo.out_trade_no})
          if (!pay) return
          clearInterval(this.pay)
          let {order} = pay.data
          this.$alert(`充值成功 金额${parseFloat(order[0].many)}元, 恭喜您成为会员`, '提示')
          this._createOrder(this.orderInfo.many)
          this.getUserInfo()
        } catch (e) {
          console.log(e)
        }
      }, 5000)
    },
    _createOrder (many) {
      try {
        this.setLoding()
        this.notOrder = true
        createOrder({many}).then((result) => {
          this.removeLoding()
          if (!result) {
            this.orderInfoError = true
            this.notOrder = false
            return null
          } else {
            result = result.data
            this.orderInfoError = false
            this.orderInfo = result.orderInfo
            this._checkPay()
            this.notOrder = false
          }
        })
      } catch (e) {
        this.removeLoding()
        this.orderInfoError = true
        this.notOrder = false
      }
    },
    _sure () {
      let {password, passwordCopy} = this
      password = password.trim()
      passwordCopy = passwordCopy.trim()
      let myReg = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
      if (password === '' || passwordCopy === '') {
        this.$alert('密码不能为空', '提示')
      } else if (password !== passwordCopy) {
        this.$alert('两次输入密码不一致', '提示')
      } else if (myReg.test(password)) {
        this.$alert(`不能包含特殊字符`, '提示')
      } else if (/[\u4e00-\u9fa5]/.test(password)) {
        this.$alert('不能含有中文', '提示')
      } else if (!(/[a-zA-Z]/g.test(password))) {
        this.$alert('必须含有字母', '提示')
      } else if (password.length <= 6) {
        this.$alert('密码不能少于6位', '提示')
      } else {
        setPassword({password: password}).then((result) => {
          if (!result) {
            this.$alert('设置失败, 请重试', '提示')
            return null
          } else {
            this.$alert('设置成功, 请牢记密码', '提示')
            this.noPassword = false
          }
        })
      }
    }
  }
}
</script>

<style>
.diaplay {
  background: red;
  color: white;
}
.password-box {
  height: 50px;
  font-size: 16px;
  width: 100%;
  color: red;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pay-box {
  border: 1px solid #999999;
  width: 1024px;
  margin: 0 auto;
  margin-top: 50px;
}
.logo-box {
  height: 100px;
  display: flex;
  padding-left: 20px;
  padding-right: 20px;
  justify-content: flex-start;
  align-items: center;
  font-size: 20px;
}
.logo {
  height: 100%;
  width: 200px;
  display: flex;
  justify-content: flex-start;
  align-items: center
}
.order-box {
  height: 100px;
  background: #f2f2f2;
  display: flex;
  flex-direction: row;
}
.order {
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.order div {
  padding-left: 20px;
  white-space: pre;
}
.order-pay {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: pre
}
.qr-box {
  min-height: 400px;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.qr-title {
  height: 50px;
  border: 1px solid #999999;
  width: 100%;
  display: flex;
}
.qr-title div:nth-child(1) {
  display: flex;
  width: 30%;
  justify-content: flex-start;
  height: 100%;
  margin-left: 10px;
  white-space: pre;
  align-items: center;
}
.qr-title div:nth-child(2) {
  width: 70%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 20px;
  white-space: pre;
}
.many {
  color: red
}
.qr-cons {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 10px;
}
.qr-cons div:nth-child(2) {
  flex: 1;
  margin-left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.qr-con {
  width: 250px;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.qr-con div:nth-child(1) {
  height: 250px;
  width: 250px;
  position: relative;
}
.qr-error {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: 2px;
  color: white;
}
.qr-con div:nth-child(2) {
  flex: 1;
  width: 250px;
}
.many-box {
  height: 200px;
  border-top: 5px solid #e4e4e4;
}
.select-box {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  align-items: center;
}
.select-box div {
  height: 50px;
  width: 100px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e4e4e4;
  margin: 0 auto;
}
</style>
