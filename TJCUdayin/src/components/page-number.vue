<template>
  <mu-dialog title="每版打印页数选择" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openPage">
    <div class="page-box">
      <div class="page-child">
        <mu-paper class="paper" :z-depth="1">
          <div class="page-img"></div>
          <div class="page-but"><mu-radio :value="1" v-model="normal"  label="每版打印1页"></mu-radio></div>
        </mu-paper>
        <mu-paper class="paper" :z-depth="1">
          <div class="page-img"></div>
          <div class="page-but"><mu-radio :value="2" v-model="normal"  label="每版打印2页"></mu-radio></div>
        </mu-paper>
        <mu-paper class="paper" :z-depth="1">
          <div class="page-img"></div>
          <div class="page-but"><mu-radio :value="4" v-model="normal"  label="每版打印4页"></mu-radio></div>
        </mu-paper>
      </div>
      <div class="page-child">
        <mu-paper class="paper" :z-depth="1">
          <div class="page-img"></div>
          <div class="page-but"><mu-radio :value="6" v-model="normal"  label="每版打印6页"></mu-radio></div>
        </mu-paper>
        <mu-paper class="paper" :z-depth="1">
          <div class="page-img"></div>
          <div class="page-but"><mu-radio :value="9" v-model="normal"  label="每版打印9页"></mu-radio></div>
        </mu-paper>
        <mu-paper class="paper" :z-depth="1">
          <div class="page-img"></div>
          <div class="page-but"><mu-radio :value="16" v-model="normal"  label="每版打印16页"></mu-radio></div>
        </mu-paper>
      </div>
      <div class="sure-but" style="margin: 20px;" @click="_sure">
        <mu-button full-width color="primary">确定</mu-button>
      </div>
    </div>
  </mu-dialog>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    openPage: {
      type: Boolean,
      default: () => false
    },
    normal: {
      type: Number,
      default: () => 1
    },
    surePageNumber: {type: Function}
  },
  methods: {
    _sure () {
      this.surePageNumber(this.normal)
      this.openPage = false
    }
  }
}
</script>

<style>
.page-box {
  display: flex;
  flex-direction: column;
}
.page-child {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.paper {
  width: 33%;
  height: 200px;
  margin: 20px;
  display: flex;
  flex-direction: column;
}
.page-img {
  height: 80%;
  width: 100%;
  margin: 0px;
}
.page-but {
  height: 20%;
  width: 100%;
  display: flex;
  margin: 0px;
  justify-content: center;
  align-items: center;
}
.sure-but {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
