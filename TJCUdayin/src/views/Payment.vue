<template>
  <div class="payment-box">
    <div class="payment-list">
      <div class="payment-list-box">
        <div :class="paymentList[0]? 'active-list': ''" @click="_payMent(0)">余额支付</div>
        <div :class="paymentList[1]? 'active-list': ''" @click="_payMent(1)">微信支付</div>
      </div>
    </div>
    <div class="pyment-con">
      <div class="pyment-con-status">
        <div>支付状态</div>
        <div style="color: red">{{payStatus? '已支付': '未支付'}}</div>
      </div>
      <div class="pyment-con-frist" v-show="!payStatus">
        <div class="pyment-yuer" v-show="paymentList[0]">
          <div class="pay-prize">
            <div>当前余额 : {{balance}}</div>
            <div>应付金额 : {{sum}}</div>
          </div>
          <div class="balance-box" v-show="balance < sum">
            <div class="balance-box-div">余额不足</div>
            <div class="balance-box-div">
              <mu-button color="primary" @click="$router.push('/recharge')">去充值</mu-button>
            </div>
          </div>
          <div class="password-box" v-show="balance >= sum">
            <mu-text-field v-model="password" label="请输入支付密码" :action-icon="visibility ? 'visibility_off' : 'visibility'" :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'"></mu-text-field><br/>
            <mu-button slot="actions" flat color="primary" @click="_pay">确定</mu-button>
          </div>
        </div>
        <div class="pyment-weChat" v-show="paymentList[1]">
          <div class="qr-payment-con">
            <div>
              <vue-qr :text="paymenyInfo.url" :size="250"></vue-qr>
              <p class="qr-payment-error" v-show="paymenyInfoError">订单生成错误</p>
            </div>
            <div><img src="@/assets/shuoming.png" style="height: 100%; width: 250px;"/></div>
          </div>
          <div class="qr-img-box">
            <img src="@/assets/zhifu.jpg" style="width: 100%;"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getpaymentInfo, payBalance, createOrder, checkPay} from '@/api/pay'
import VueQr from 'vue-qr'
export default {
  data () {
    return {
      paymentList: [true, false],
      balance: '',
      sum: '',
      payStatus: '',
      password: '',
      preferential: '',
      paymenyInfoError: false,
      paymenyInfo: {},
      notOrder: false
    }
  },
  components: {VueQr},
  created () {
    this._getpaymentInfo()
  },
  beforeRouteLeave (to, from, next) {
    clearInterval(this.payMent)
    next()
  },
  methods: {
    _getpaymentInfo () {
      getpaymentInfo({_id: this.$route.params._id}).then((result) => {
        if (!result) {
          return
        }
        const {balance, sum, payStatus, preferential} = result.data
        this.balance = balance
        this.sum = sum
        this.payStatus = payStatus
        this.preferential = preferential
      })
    },
    _payMent (index) {
      this.paymentList = new Array(2).fill(false)
      this.paymentList[index] = true
      if (index) {
        if (this.payStatus) return
        this._createOrder((parseFloat(this.sum) + parseFloat(this.preferential)).toFixed(2), this.$route.params._id)
      }
    },
    _checkPayMent () {
      clearInterval(this.payMent)
      this.payMent = setInterval(async () => {
        try {
          let pay = await checkPay({out_trade_no: this.paymenyInfo.out_trade_no, _id: this.$route.params._id})
          if (!pay) return
          clearInterval(this.payMent)
          let {order} = pay.data
          this.$alert(`订单支付成功, 正在处理 金额${parseFloat(order[0].many)}元`, '提示')
          this._getpaymentInfo()
        } catch (e) {
          console.log(e)
        }
      }, 5000)
    },
    _createOrder (many, _id) {
      try {
        this.notOrder = true
        createOrder({many, _id}).then((result) => {
          if (!result) {
            this.paymenyInfoError = true
            this.notOrder = false
            return null
          } else {
            result = result.data
            this.paymenyInfoError = false
            this.paymenyInfo = result.orderInfo
            this._checkPayMent()
            this.notOrder = false
          }
        })
      } catch (e) {
        this.paymenyInfoError = true
        this.notOrder = false
      }
    },
    _pay () {
      if (!this.password) {
        this.$alert('密码不能为空', '提示')
        return
      }
      payBalance({password: this.password, _id: this.$route.params._id}).then((result) => {
        if (!result) {
          this.$alert('错误', '提示')
          return
        }
        this.$alert('支付成功', '提示')
        this._getpaymentInfo()
      })
    }
  }
}
</script>

<style>
.active-list {
  background: #17b7eb;
  color: white;
}
.payment-box {
  display: flex;
  margin-top: 50px;
}
.payment-list {
  width: 30%;
  display: flex;
  justify-content: center;
}
.payment-list-box {
  width: 50%;
  height: 160px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3)
}
.payment-list-box div{
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
}
.pyment-con {
  flex: 1;
}
.pyment-con-status {
  width: 80%;
  margin: 0 auto;
  margin-bottom: 20px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  height: 50px;
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
  align-items: center;
  font-size: 20px;
}
.pyment-con-frist {
  width: 80%;
  margin: 0 auto;
  min-height: 300px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3)
}
.pay-prize {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pay-prize div {
  width: 50%;
  font-size: 16px;
  color: red;
  text-align: center
}
.pyment-yuer {
  width: 100%!important;
  margin: 0px;
}
.balance-box-div{
  margin-top: 20px;
  font-size: 20px;
  margin-left: 10px;
}
.password-box {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  flex-direction: column;
  margin-left: 10px;
}
.pyment-weChat {
  display: flex;
}
.qr-payment-con {
  height: 350px;
  width: 250px;
  position: relative;
}
.qr-img-box {
  flex: 1;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.qr-payment-error {
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
</style>
