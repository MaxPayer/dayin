import Vuex from 'vuex'
import Vue from 'vue'
import {userInfo} from '@/api/user'
import {submissionPrint} from '@/api'
import Cookies from 'js-cookie'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    openAlert: false,
    print: {}, // 订单数据
    basicPrinting: {
      colorRadio: 0,
      sizeRadio: 0,
      singleRadio: 0,
      bindRadio: 0
    }, // 打印选项数据
    school: '', // 学校数据
    locationInfo: {},
    updateSum: [0.00, 0.00], // 价格计算值
    loginStatus: 0, // 登陆状态
    userInfo: { // 用户信息
      freeSheets: 20, // 删
      member: true // 删
    },
    loading: false,
    prize: { // 价格
      blackAndWhite: [
        [[0.20, 0.15], [0.30, 0.20]],
        [[0.50, 0.30], [0.80, 0.60]],
        [[0.20, 0.15], [0.30, 0.20]]
      ],
      colour: [
        [[1.00, 0.80], [1.50, 1.20]],
        [[2.00, 1.50], [3.00, 2.00]],
        [[1.00, 0.80], [1.50, 1.20]]
      ]
    }
  },
  mutations: {
    changeAlert (state, data) {
      state.openAlert = data
    },
    setLoding (state) {
      state.loading = true
    },
    removeLoding (state) {
      state.loading = false
    },
    updateSumAccount (state, data) {
      state.updateSum = data
    },
    _basicPrinting (state, data) {
      state.basicPrinting = data
    },
    setSchool (state, school) {
      state.school = school
    },
    setLocation (state, data) {
      state.locationInfo = data
    },
    setLoginStatus (state, status) {
      state.loginStatus = status
    },
    setUserInfo (state, data) {
      state.userInfo = data
    },
    getPrint (state, data) {
      state.print = data
    }
  },
  actions: {
    getUserInfo (context) {
      userInfo().then((result) => {
        if (!result) {
          Cookies.remove('token')
          context.commit('setLoginStatus', 0)
          return
        }
        result = result.data
        context.commit('setUserInfo', result.userinfo)
      })
    },
    submission ({ commit, state }, data) {
      Object.assign(data, state.print)
      // console.log(JSON.stringify(data))
      return new Promise((resolve, reject) => {
        submissionPrint(data).then((result) => {
          if (!result) {
            resolve(false)
          }
          resolve(result)
        })
      })
    }
  }
})

export default store
