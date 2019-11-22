<template>
  <div class="person-box">
    <div class="person-header">
      <div class="header">
        <div>
          <div></div>
        </div>
        <div>
          <div>余额 : {{userInfo.balance}}元</div>
          <div @click="_out">退出</div>
        </div>
      </div>
      <div class="header-img">
        <img src="@/assets/daotu.jpg" style="height: 100%; width: 100%"/>
      </div>
    </div>
    <div class="person-body">
      <div class="person-list">
        <div :class="listConr[0]? 'active-list': ''" @click="_del(0)">订单管理</div>
        <div :class="listConr[1]? 'active-list': ''" @click="_del(1)">充值记录</div>
        <div :class="listConr[2]? 'active-list': ''" @click="_del(2)">密码修改</div>
      </div>
      <div class="person-content">
        <div class="prints-box" v-if="listConr[0]">
          <div class="prints-title">
            <div>id</div>
            <div>姓名</div>
            <div>时间</div>
            <div>合并装钉</div>
            <div>打印数据</div>
            <div>支付状态</div>
            <div>操作</div>
          </div>
          <div class="prints-list" v-for="(item, i) in printInfo" :key="item + i">
            <div>{{i}}</div>
            <div>{{item.consignee}}</div>
            <div>{{item.timer}}</div>
            <div>{{item.merge}}</div>
            <div><mu-icon value="visibility"></mu-icon></div>
            <div>{{item.payStatus? '已支付': '未支付'}}</div>
            <div>
              <div v-show="!item.payStatus">
                <mu-button small style="display: flex" @click="_delPrint(item._id, i)">
                  <mu-icon left value="delete"></mu-icon>
                  删除
                </mu-button>
                <mu-button small style="display: flex" color="primary" @click="_goPay(item._id)">去支付</mu-button>
              </div>
            </div>
          </div>
        </div>
        <div class="order-boxs" v-if="listConr[1]">
          <div class="order-title">
            <div>id</div>
            <div>订单号</div>
            <div>商户号</div>
            <div>金额</div>
            <div>时间</div>
          </div>
          <div class="order-list" v-for="(item, i) in order" :key="i">
            <div>{{i}}</div>
            <div>{{item._id}}</div>
            <div>{{item.transaction_id}}</div>
            <div>{{item.many}}</div>
            <div>{{item.time}}</div>
          </div>
        </div>
        <div class="password-box" v-if="listConr[2]">
          <mu-text-field v-model="passwords" label="密码" :action-icon="visibility ? 'visibility_off' : 'visibility'" :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'"></mu-text-field><br/>
          <mu-text-field v-model="passwordCopys" label="在次输入密码" :action-icon="visibilityCopy ? 'visibility_off' : 'visibility'" :action-click="() => (visibilityCopy = !visibilityCopy)" :type="visibilityCopy ? 'text' : 'password'"></mu-text-field><br/>
          <mu-button slot="actions" flat color="primary" @click="_changePas">确定</mu-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {record, setPassword, delPrint} from '@/api/pay.js'
import Cookie from 'js-cookie'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      listConr: [true, false, false],
      userInfo: {},
      order: {},
      printInfo: {},
      passwords: '',
      passwordCopys: '',
      visibility: false,
      visibilityCopy: false
    }
  },
  created () {
    this._getInfo()
  },
  methods: {
    ...mapMutations(['setLoginStatus', 'setLoding', 'removeLoding']),
    _changePas () {
      this.$confirm('确定要更改', '提示', {
        type: 'warning'
      }).then(({ result }) => {
        if (result) {
          let {passwords, passwordCopys} = this
          let password = passwords
          let passwordCopy = passwordCopys
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
                this.$alert('更新失败, 请重试', '提示')
                return null
              } else {
                this.$alert('更新成功, 请牢记密码', '提示')
                this.noPassword = false
                this.password = ''
                this.passwordCopy = ''
              }
            })
          }
        } else {
          this.$toast.message('取消更改')
        }
      })
    },
    _goPay (_id) {
      if (!_id) return
      this.$router.push(`/pay/${_id}`)
    },
    _getInfo () {
      try {
        this.setLoding()
        record().then((result) => {
          if (!result) {
            this.$alert('信息获取失败', '提示')
            return
          }
          this.removeLoding()
          const {userInfo, order, printInfo} = result.data
          order.forEach((element, i) => {
            let timer = new Date(Number(element.time))
            let nian = timer.getFullYear()
            let yue = timer.getMonth() + 1
            let tian = timer.getDate()
            order[i].time = `${nian}-${yue}-${tian}`
          })
          this.userInfo = userInfo
          this.order = order
          this.printInfo = printInfo
        })
      } catch (e) {
        console.log(e)
        this.removeLoding()
        this.$alert('未知错误', '提示')
      }
    },
    _del (flag) {
      this.listConr = new Array(3).fill(false)
      this.listConr[flag] = true
    },
    _delPrint (_id, i) {
      this.$confirm('确定要删除？', '提示', {
        type: 'warning'
      }).then(({ result }) => {
        if (result) {
          delPrint({_id}).then((result) => {
            if (!result) {
              this.$alert('删除失败', '提示')
              return
            }
            this.$alert('删除成功', '提示')
            this.printInfo.splice(i, 1)
          })
        }
      })
    },
    _out () {
      Cookie.remove('token')
      this.setLoginStatus(0)
      this.$router.push('/')
    }
  }
}
</script>

<style>
.person-box {
  height: 100%;
  width: 100%;
  padding: 20px;
}
.person-header {
  height: 250px;
  padding-left: 5%;
  padding-right: 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header {
  width: 25%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3)
}
.header div:nth-child(1) {
  height: 60%;
  width: 100%;
  padding-left: 20%;
  padding-right: 20%;
  box-sizing: border-box;
  border-bottom: 1px solid #C9C9C9;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header div:nth-child(1) div{
  height: 100px;
  width: 100px;
  border-radius: 50%;
  background: #C9C9C9;
}
.header div:nth-child(2) {
  display: flex;
  justify-content: center;
  height: 40%;
  padding: 0px;
}
.header div:nth-child(2) div {
  width: 50%;
  padding: 0px;
  height: 100%;
  border: 0px solid #C9C9C9;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.header-img {
  width: 65%;
  height: 100%;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3)
}
.person-body {
  padding-left: 5%;
  padding-right: 5%;
  margin-top: 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.person-list {
  width: 25%;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3)
}
.person-list div{
  height: 80px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.active-list {
  background: #17b7eb;
  color: white;
}
.person-content {
  width: 65%;
  height: 100%;
  min-height: 240px;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3)
}
.order-boxs {
  display: flex;
  flex-direction: column;
}
.order-title {
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.order-title div{
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  background: #C9C9C9;
  color: white;
}
.order-title div:nth-child(2) {
  flex: 1
}
.order-title div:nth-child(3) {
  flex: 1
}
.order-list{
  height: 50px!important;
  display: flex;
}
.order-list div {
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}
.order-list div:nth-child(2) {
  flex: 1
}
.order-list div:nth-child(3) {
  flex: 1
}
.password-box {
  display: flex;
  min-height: 240px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.prints-title{
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.prints-title div {
  width: 12.9%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  background: #C9C9C9;
  color: white;
}
.prints-title div:last-child {
  flex: 1;
}
.prints-list  {
  height: 50px;
  display: flex;
}
.prints-list div {
  width: 12.9%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.prints-list div:last-child {
  flex: 1
}
</style>
