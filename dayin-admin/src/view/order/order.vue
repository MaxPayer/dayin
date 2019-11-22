<template>
  <div>
    <div class="title-box">
      <div>姓名</div>
      <div>电话</div>
      <div>配送时间</div>
      <div>地址</div>
      <div>支付状态</div>
      <div>合并装钉</div>
      <div>留言</div>
      <div>订单</div>
      <div>处理状态</div>
    </div>
    <div v-for="(item, index) in list" :key="index" class="list-box">
      <div>{{item.consignee}}</div>
      <div>{{item.phone}}</div>
      <div>{{item.date}}——{{item.timer}}</div>
      <div>{{item.address}}——{{item.floor}}</div>
      <div>{{item.payStatus}}</div>
      <div>{{item.merge}}</div>
      <div>{{item.leaveWord}}</div>
      <div><Button type="primary" @click="_open(index)">订单数据</Button></div>
      <div v-show="!item.payStatus">未支付</div>
      <div v-show="item.handleStatus && item.payStatus">已处理</div>
      <div v-show="!item.handleStatus && item.payStatus"><Button type="primary" @click="_dealWith(item._id)">设为已处理</Button></div>
    </div>
    <div>
      <Modal
        v-model="printConr"
        title="订单数据"
        width="100%"
        @on-ok="_ok">
        <div class="operation">
          <div>文件名称</div>
          <div>颜色</div>
          <div>尺寸</div>
          <div>单双面</div>
          <div>装订方式</div>
          <div>原页数</div>
          <div>每版打印页数</div>
          <div>实际张数</div>
          <div>每张单价</div>
          <div>打印份数</div>
          <div>优惠</div>
          <div>总计</div>
          <div>操作</div>
        </div>
        <div v-for="(less, i) in printData" :key="'dayin'+i" class="operation-list">
          <div>{{less.name}}</div>
          <div>{{less.colorRadio === 0? '黑白': '彩色'}}</div>
          <div v-show="less.sizeRadio === 0" >A4</div>
          <div v-show="less.sizeRadio === 1" >A3</div>
          <div v-show="less.sizeRadio === 2" >B5</div>
          <div>{{less.singleRadio === 0? '单面': '双面'}}</div>
          <div v-show="less.bindRadio === 0" >不装钉</div>
          <div v-show="less.bindRadio === 1" >普通装钉</div>
          <div v-show="less.bindRadio === 2" >胶装</div>
          <div>{{less.pages}}</div>
          <div>{{less.editionPage}}</div>
          <div>{{less.sheets}}</div>
          <div>{{less.unitPrice[0]}}——{{less.unitPrice[1]}}</div>
          <div>{{less.copies}}</div>
          <div>{{less.discount}}</div>
          <div>{{less.total}}</div>
          <div>
            <a :href="less.name.split('.')[0]+'.pdf'" :download="less.name.split('.')[0]+'.pdf'"><Button type="primary">pdf下载</Button></a>
            <a :href="less.name" :download="less.name"><Button type="primary">源文件下载</Button></a>
          </div>
        </div>
      </Modal>
    </div>
    <Modal
        v-model="deal"
        @on-ok="_sure">
        <p>确定设置为处理状态吗</p>
    </Modal>
    <div class="page-box"><Page :total="count" :page-size="20" @on-change="_page"/></div>
  </div>
</template>

<script>
import {printList, printStatus} from '@/api/print.js'
export default {
  data () {
    return {
      list: [],
      printConr: false,
      printData: [],
      id: null,
      deal: false,
      index: null,
      count: null
    }
  },
  created () {
    this._getList()
  },
  methods: {
    _getList (pg) {
      let page = pg || 1
      printList({page}).then((result) => {
        this.list = result.data
        this.count = result.count
      })
    },
    _open (index) {
      this.index = index
      this.printData = this.list[index].printData
      this.printConr = true
    },
    _ok () {
      this.printConr = false
    },
    _dealWith (_id) {
      this.id = _id
      this.deal = true
    },
    _page (page) {
      this._getList(page)
    },
    _sure () {
      printStatus({_id: this.id}).then((result) => {
        this.list[this.index].printData.handleStatus = true
      })
    }
  }
}
</script>

<style>
.title-box {
  height: 50px;
  display: flex;
}
.title-box div {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid gray;
}
.list-box {
  min-height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.list-box div{
  flex: 1;
  min-height: 50px;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-left: 1px solid gray;
  border-bottom: 1px solid gray;
  border-right: 1px solid gray;
}
.operation {
  height: 50px;
  display: flex;
}
.operation div{
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid gray;
}
.operation-list {
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.operation-list div{
  flex: 1;
  overflow: hidden;
  min-height: 100px;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-left: 1px solid gray;
  border-bottom: 1px solid gray;
  border-right: 1px solid gray;
}
.page-box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px
}
</style>
