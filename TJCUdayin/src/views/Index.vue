<template>
  <div>
    <div>
      <mu-carousel hide-controls>
        <mu-carousel-item>
          <img src="@/assets/index.jpg" style="width: 100%; height: 100%">
        </mu-carousel-item>
        <mu-carousel-item>
          <img src="@/assets/index-copy.jpg" style="width: 100%; height: 100%">
        </mu-carousel-item>
        <mu-carousel-item>
          <img src="@/assets/index-copy.jpg" style="width: 100%; height: 100%">
        </mu-carousel-item>
      </mu-carousel>
    </div>
    <div class="body-box">
      <!--<div class="update" v-if="JSON.stringify(basicPrinting) === '{}'">
        <mu-button color="secondary" style="height: 80px;width: 300px;font-size: 36px;" large @click="updateFile">
          <mu-icon left size="46"  style="margin-top: 5px;" value="open_in_browser"></mu-icon>
          上传文件
        </mu-button>
      </div>-->
      <keep-alive>
        <transition name="slide-left">
          <!--<PrintInfo v-if="JSON.stringify(basicPrinting) === '{}'"/>-->
          <div>
            <upload-file></upload-file>
          </div>
        </transition>
      </keep-alive>
      <div class="price-box">
        <div class="price-box_left">
          <div>
            <div class="prize-lf_title">
              <mu-icon size="36" value="add_location" style="margin-right: 10px"></mu-icon>
              配送至:
            </div>
            <div class="prize-lf_con">
              <mu-select v-model="school" @change="_changeSchool">
                <mu-option v-for="option in indexInfo.locationInfo" :key="option.address" :label="option.address" :value="option.address"></mu-option>
              </mu-select>
              <mu-select v-model="backIndexInfo.floor" style="width: 150px">
                <mu-option v-for="(option, index) in indexInfo.locationInfo[0].floor" :key="option + index" :label="option" :value="option"></mu-option>
              </mu-select>
              <div class="important">*</div>
            </div>
          </div>
          <div>
            <div class="prize-lf_title">
              <mu-icon size="36" value="alarm_on" style="margin-right: 10px"></mu-icon>
              配送时间:
            </div>
            <div class="prize-lf_con">
              <mu-col span="12" lg="4" sm="6">
                <mu-date-input
                  :min-date="minDate"
                  value-format="YYYY-MM-DD"
                  v-model="backIndexInfo.date"
                  label-float full-width landscape/>
              </mu-col>
              <mu-select v-model="backIndexInfo.timer" style="margin-bottom: 22px;">
                <mu-option v-for="option in indexInfo.locationInfo[0].timer" :key="option" :label="option" :value="option"></mu-option>
              </mu-select>
            </div>
            <div class="important">*</div>
          </div>
          <div>
            <div class="prize-lf_title">
            </div>
            <div class="prize-lf_con">
              <mu-text-field v-model="backIndexInfo.consignee" type="text" placeholder="收货人" icon="person"></mu-text-field><br/>
            </div>
            <div class="important">*</div>
          </div>
          <div>
            <div class="prize-lf_title">
            </div>
            <div class="prize-lf_con">
              <mu-text-field v-model="backIndexInfo.phone" type="text" placeholder="联系电话" icon="phone"></mu-text-field><br/>
            </div>
            <div class="important">*</div>
          </div>
          <div class="leave">
            <div class="prize-lf_title">
              <mu-icon size="36" value="favorite_border" style="margin-right: 10px"></mu-icon>
              留言:
            </div>
            <div class="prize-lf_con">
                <mu-text-field v-model="backIndexInfo.leaveWord" multi-line :rows="4" full-width></mu-text-field>
            </div>
          </div>
        </div>
        <div class="price-box_right">
          <div class="pay-line">
            <div>应付金额:</div>
            <div>￥ {{(Number(updateSum[0]) + Number(updateSum[1])).toFixed(2)}}</div>
          </div>
          <div class="pay-line">
            <div>优惠:</div>
            <div>￥ {{Number(updateSum[1]).toFixed(2)}}</div>
          </div>
          <div class="pay-line">
            <div>实付金额:</div>
            <div>￥ {{Number(updateSum[0]).toFixed(2)}}</div>
          </div>
          <div class="pay-line">
            <div>支付方式:</div>
            <div></div>
          </div>
          <div class="pay-line svg-box">
            <!--
              <icon name="支付宝支付" scale="5" title="支付宝"></icon>
              <icon name="微信支付" scale="5"></icon>
            -->
            <img src="@/assets/we.png" style="height: 50px; width: 50px;" />
            <icon name="余额支付" scale="5"></icon>
          </div>
        </div>
        <prize />
      </div>
      <div class="gz-box">
        <mu-button large color="red" @click="_pay" style="height: 50px; width: 150px;">
          <mu-icon left></mu-icon>
          去支付
        </mu-button>
        <div style="height: 100px; width: 100px">
          <img src="@/assets/qr.jpg" style="height: 100%; width: 100%;" />
        </div>
      </div>
    </div>
    <div class="qrcode">微信扫一扫关注 "校园打印" 公众号</div>
    <div class="corpt">校园打印 版权所有@天津市天印科技有限公司 | 津ICP备18006493号-1 | 联系电话/微信 13034366590</div>
  </div>
</template>

<script>
import PrintInfo from '@/components/Print-info'
import Dayjs from 'dayjs'
import Prize from '@/components/Prize'
import Cookies from 'js-cookie'
import UploadFile from '@/components/Upload-file'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    PrintInfo,
    UploadFile,
    Prize
  },
  computed: {
    ...mapState(['basicPrinting', 'school', 'updateSum'])
  },
  data () {
    return {
      indexInfo: {
        locationInfo: [
          {
            address: '天津商业大学',
            floor: ['1栋', '2栋', '2栋', '4栋', '5栋', '6栋', '7栋', '8栋',
              '9栋', '10栋', '11栋', '12栋', '13栋', '14栋', '15栋', '16栋', '17栋', '18栋',
              '19栋', '20栋', '22栋', '23栋', '24栋', '24栋', '25栋', '26栋', '27栋', '28栋',
              '29栋', '30栋', '31栋', '32栋', '33栋', '34栋', '35栋', '36栋', '37栋', '38栋',
              '39栋', '40栋', '41栋', '42栋', '43栋', '44栋', '45栋', '46栋', '图书馆', 'FIU'],
            timer: ['18:00-21:00']
          }
        ]
      },
      // 结果
      backIndexInfo: {
        address: '',
        floor: '',
        date: new Date(),
        timer: '',
        consignee: '',
        phone: '',
        leaveWord: null
      },
      minDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    }
  },
  created () {
    this.getIndexInfo()
  },
  mounted () {
    this._delTime()
  },
  methods: {
    ...mapMutations(['setSchool', 'setLocation', 'setLoginStatus', '_basicPrinting', 'updateSumAccount']),
    ...mapActions(['submission', 'getUserInfo']),
    _delTime () {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth()
      let dat = date.getDate()
      if (Dayjs().isBefore(Dayjs(new Date(year, month, dat, 18)))) {
        this.indexInfo.locationInfo[0].timer.unshift('11:00-13:00')
      }
    },
    getIndexInfo () {
      const {locationInfo} = this.indexInfo
      this.backIndexInfo.address = locationInfo[0].address
      this.backIndexInfo.floor = locationInfo[0].floor[0]
      this.backIndexInfo.timer = locationInfo[0].timer[0]
      this.setSchool(locationInfo[0].address)
      this.setLocation(locationInfo)
    },
    updateFile () {
      let token = Cookies.get('token')
      if (!token) {
        this.$confirm('未登录, 去登陆', '提示', {
          type: 'warning'
        }).then(({ result }) => {
          if (result) {
            this.$root._login()
          }
        })
        return
      }
      if (JSON.stringify(this.basicPrinting) === '{}') {
        this.$alert('请先确定打印选项或点击确定', '提示')
        return null
      }
    },
    _changeSchool (value) {
      this.indexInfo.locationInfo.forEach((item, i) => {
        if (item.address === value) {
          this.backIndexInfo.address = this.indexInfo.locationInfo[i].address
          this.backIndexInfo.floor = this.indexInfo.locationInfo[i].floor[0]
          this.backIndexInfo.timer = this.indexInfo.locationInfo[i].timer[0]
        }
        this.setSchool(value)
      })
    },
    _pay () {
      return
      let phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/
      let phone = this.backIndexInfo.phone.trim()
      if (!Cookies.get('token')) {
        this.$confirm('未登录, 去登陆', '提示', {
          type: 'warning'
        }).then(({ result }) => {
          if (result) {
            this.$root._login()
          }
        })
        this.setLoginStatus(0)
        return null
      } else if (JSON.stringify(this.basicPrinting) === '{}') {
        this.$alert('不是订单页面', '提示')
        return null
      } else if (!Object.values(this.backIndexInfo).every((item) => item !== '')) {
        this.$alert('信息不能为空', '提示')
        return null
      } else if (!phoneReg.test(phone)) {
        this.$alert('手机号不正确', '提示')
        return null
      } else if (Number(this.updateSum[0]) === 0 || Number(this.updateSum[0]) === 0.00) {
        this.$alert('金钱不能少于等于 0.00', '提示')
        return null
      } else {
        let data = JSON.parse(JSON.stringify(this.backIndexInfo))
        data.updateSum = this.updateSum
        this.submission(data).then((result) => {
          if (!result) {
            this.$alert('订单生成失败', '提示')
            return
          }
          this.backIndexInfo = {
            address: '',
            floor: '',
            date: new Date(),
            timer: '',
            consignee: '',
            phone: '',
            leaveWord: null
          }
          let {_id} = result.data
          this._basicPrinting({})
          this.getUserInfo()
          this.updateSumAccount([0.00, 0.00])
          localStorage.removeItem('print')
          this.$router.push(`/pay/${_id}`)
        })
      }
    }
  }
}
</script>

<style scoped>
.body-box {
    padding: 5%;
    padding-top: 2%;
    padding-bottom: 2%;
    box-sizing: border-box;
  }
  .body-box:nth-child(1) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .print-select {
    margin-top: 10px;
    min-height: 0px!important;
    letter-spacing: 2px;
    color: #f71a1f;
  }
  .price-box {
    padding-top: 50px;
    display: flex;
    padding-bottom: 50px;
    border-bottom: 2px solid #e6e6e6;
  }
  .price-box_left {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-between!important;
  }
  .price-box_right {
    width: 50%;
  }
  .price-box_left > div {
    width: 100%;
    display: flex;
    height: 70px;
    flex-direction: row!important;
    justify-content: flex-start!important;
  }
  .leave {
    height: 100px!important;
  }
  .prize-lf_title{
    width: 30%;
    display: flex;
    flex-direction: row!important;
    height: 70px;
    padding-left: 8%;
    color: #020202!important;
    justify-content: flex-start!important;
    font-size: 16px;
  }
  .prize-lf_con {
    flex: 1;
    margin: 0px;
    height: 100%;
    display: flex;
    justify-content: space-between;
  }
  .important {
    width: 50px;
    height: 100%;
    display: flex;
    font-size: 25px;
    justify-content: center;
    align-items: center;
    color: red;
  }
  .pay-line {
    height: 70px;
    display: flex;
    flex-direction: row!important;
    justify-content: center;
  }
  .pay-line > div {
    width: 20%;
    height: 100%;
    display: flex;
    flex-direction: row!important;
    font-size: 18px;
    justify-content: flex-start!important;
    align-items: center;
  }
  .pay-line > div:nth-child(2) {
    color: red;
  }
  .svg-box {
    align-items: center!important;
  }
  .svg-box svg{
    margin-left: 10px;
    margin-right: 10px;
    cursor: pointer;
  }
  .slide-left-enter-active {
   transition: all .5s ease;
  }
  .slide-left-enter, .slide-left-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }
  .update {
    height: 150px;
    padding-bottom: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .gz-box {
    height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 2%;
  }
  .qrcode {
    height: 50px;
    background: #17b7eb;
    font-size: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    letter-spacing: 5px;
    color: white;
  }
  .corpt {
    height: 40px;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    letter-spacing: 2px;
    background: #e6e6e6;
  }
</style>
