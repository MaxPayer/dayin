<template>
  <div>
    <mu-dialog title="价格表一览" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert">
      <div class="prize-box">
        <div class="title">
          <div style="width: 20%; height: 40px">价格</div>
          <div style="width: 20%; height: 40px">纸张尺寸</div>
          <div style="width: 30%; height: 40px">单面</div>
          <div style="width: 30%; height: 40px">双面</div>
        </div>
        <div v-for="(item, i) in list" :key="i" class="content">
          <div style="width: 20%" class="format-box">
            {{i === 0? '黑白': '彩色'}}
          </div>
          <div style="width: 20%">
            <div class="size">A4</div>
            <div class="size">A3</div>
            <div class="size">B5</div>
          </div>
          <div class="content-prize" style="flex: 1">
            <div v-for="(less, index) in item" :key="String(less) + index">
              <div>
                <div>
                  <div>{{less[0][0]}}</div>
                  <div>{{less[0][1]}}</div>
                </div>
              </div>
              <div>
                <div>
                  <div>{{less[1][0]}}</div>
                  <div>{{less[1][1]}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="prompt-box">
        <div>* 灰色框为不到一百张价格</div>
        <div>* 蓝色框内为一百张价格</div>
      </div>
      <div class="vip-box">一次充满20元即成为会员尽享8折优惠!</div>
      <mu-button slot="actions" flat color="primary" @click="changeAlert(false)">确定</mu-button>
    </mu-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {}
  },
  computed: {
    ...mapState([
      'openAlert',
      'prize'
    ]),
    list () {
      return Array.from(Object.values(this.prize))
    }
  },
  methods: {
    ...mapMutations(['changeAlert'])
  }
}
</script>

<style scoped>
  .prize-box {
    width: 100%;
    border: 3px solid #17b7eb;
  }
  .title {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title div{
    border: 1px solid #E2E3E3;
    border-top: 0px solid #E2E3E3;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .format-box {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #E2E3E3;
  }
  .content {
    display: flex;
  }
  .size{
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #E2E3E3;
  }
  .content-prize {
    display: flex;
    flex-direction: column;
  }
  .content-prize div{
    display: flex;
    width: 100%;
  }
  .content-prize div div div div{
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    color: white;
    font-size: 16px;
    border: 1px solid #E2E3E3;
  }
  .content-prize div div div div:nth-child(1){
    background: #D9D9D9;
  }
  .content-prize div div div div:nth-child(2){
    background:  #16B7EB;
  }
  .prompt-box {
    width: 100%;
    display: flex;
  }
  .prompt-box div {
    width: 50%;
    height: 50px;
    letter-spacing: 2px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 16px;
  }
  .prompt-box div:nth-child(2) {
    color: #16B7EB
  }
  .vip-box {
    display: flex;
    height: 60px;
    font-size: 22px;
    letter-spacing: 2px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #EB161C;
  }
</style>
