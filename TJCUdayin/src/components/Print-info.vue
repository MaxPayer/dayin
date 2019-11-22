<template>
  <div>
    <mu-flex class="print-box">
      <div class="print-cont">
        <mu-flex class="print-from" justify-content="space-between" direction="column">
        <mu-flex justify-content="start" align-items="end">
          <mu-button color="primary" large>打印选项</mu-button>
          <mu-button color="primary" @click="changeAlert(true)">价格表</mu-button>
        </mu-flex>
        <div>
          <p class="other-box">颜色:</p>
          <div>
            <mu-radio :key="i" v-for="(item, i) in ['黑白','彩色']" @change="_changeColorRadio" :value="i" v-model="info.colorRadio"  :label="item"></mu-radio>
          </div>
        </div>
        <div>
          <p class="other-box">纸张尺寸:</p>
          <div>
            <span :key="i" v-for="(item, i) in ['A4','A3', 'B5']">
              <mu-radio :value="i" @change="_changesizeRadio" v-model="info.sizeRadio" :label="item"></mu-radio>
            </span>
          </div>
        </div>
        <div>
          <p class="other-box">单双面:</p>
          <div>
            <span :key="i" v-for="(item, i) in ['单面','双面']">
              <mu-radio :value="i" @change="_changesingleRadio" v-model="info.singleRadio" :label="item"></mu-radio>
            </span>
          </div>
        </div>
        <div>
          <p class="other-box">装订方式:</p>
          <div>
            <span :key="i" v-for="(item, i) in ['不装钉','普通装订', '胶装(论文)']">
              <mu-radio :value="i" v-model="info.bindRadio" :label="item"></mu-radio>
            </span>
          </div>
        </div>
        <div><mu-button color="primary" @click="_sure">确定</mu-button></div>
      </mu-flex>
      <div class="show-box">
        <keep-alive>
          <transition name="fade">
            <img src="@/assets/guide.jpg" class="img-full" v-if="swatch[0]"/>
            <img src="@/assets/wd-color.jpg" class="img-full" v-if="swatch[1]"/>
            <img src="@/assets/wd-page.jpg" class="img-full"  v-if="swatch[3]" />
            <img src="@/assets/wd-size.jpg" class="img-full"  v-if="swatch[2]" />
          </transition>
        </keep-alive>
      </div>
      </div>
    </mu-flex>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      swatch: [true, false, false, false]
    }
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          colorRadio: null,
          sizeRadio: null,
          singleRadio: null,
          bindRadio: null
        }
      }
    },
    sureBack: {type: Function}
  },
  watch: {
    info () {
      if (!this.info) return
      const {colorRadio, sizeRadio, bindRadio, singleRadio} = this.info
      this.colorRadio = colorRadio
      this.sizeRadio = sizeRadio
      this.bindRadio = bindRadio
      this.singleRadio = singleRadio
    }
  },
  computed: {
    ...mapState(['basicPrinting'])
  },
  methods: {
    ...mapMutations(['changeAlert', '_basicPrinting']),
    _changeColorRadio () {
      this.swatch = new Array(4).fill(false)
      this.swatch[1] = true
    },
    _changesizeRadio () {
      this.swatch = new Array(4).fill(false)
      this.swatch[2] = true
    },
    _changesingleRadio () {
      this.swatch = new Array(4).fill(false)
      this.swatch[3] = true
    },
    _sure () {
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
      let flag = {}
      let {colorRadio, sizeRadio, bindRadio, singleRadio} = this.info
      flag.colorRadio = colorRadio
      flag.sizeRadio = sizeRadio
      flag.bindRadio = bindRadio
      flag.singleRadio = singleRadio
      if (this.sureBack) {
        this.sureBack(flag)
        return
      }
      if (!Object.values(flag).every((item) => String(item) !== 'null')) {
        this.$alert('请先确定打印选项', {icon: 'warningIcon', transition: 'slide-left'})
        return
      }
      this._basicPrinting(flag)
    }
  }
}
</script>

<style>
  .print-box {
    padding-bottom: 100px!important;
    border-bottom: 2px solid #e6e6e6!important;
  }
  .print-cont {
    width: 1024px;
    display: flex;
    margin: 0 auto;
  }
  .print-from {
    width: 60%;
    height: 100%;
  }
  .print-from div {
    display: flex;
    font-size: 16px;
  }
  .print-from div:nth-child(1) button{
    margin-left: 10px!important;
  }
  .print-from div:nth-child(1) button:nth-child(1){
    margin-left: 0px!important;
  }
  .other-box {
    width: 100px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .print-from div div:nth-child(2) {
    margin-left: 10px;
    display: flex;
    flex: 1;
    justify-content: flex-start;
    align-items: center;
  }
  .mu-radio-icon {
    margin: 0!important;
    padding: 0!important;
  }
  .show-box {
    flex: 1;
    max-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .show-box div{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .img-full {
    max-width: 100%;
    max-height: 300px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 3.2s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
