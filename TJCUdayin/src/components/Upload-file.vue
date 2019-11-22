<template>
  <div class="com-box">
    <div class="uploader-boxs">
        <uploader
          :options="options"
          @file-added="fileAdded"
          @file-success="fileSuccess"
          @file-error="fileError"
          :file-status-text="statusText"
          v-show="loginStatus"
        >
          <uploader-unsupport></uploader-unsupport>
          <uploader-drop class="uploader-box">
            <uploader-btn>文件上传</uploader-btn>
          </uploader-drop>
        </uploader>
        <mu-button color="secondary" style="height: 80px;width: 300px;font-size: 36px;" large @click="_checkLogin" v-show="!loginStatus">
          <mu-icon left size="46"  style="margin-top: 5px;" value="open_in_browser"></mu-icon>
          上传文件
        </mu-button>
    </div>
    <div class="prints-box">
      <div class="basic-file-box">
        <div class="file-title">
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
        <div v-for="(item, i) in print.printData" :key="i">
          <div class="file-title file-con">
            <div>{{item.name}}</div>
            <div @click="_changePrint(0, i, item.colorRadio)">{{item.colorRadio === 0? '黑白': '彩色'}}</div>
            <div v-if="item.sizeRadio === 0" @click="_changePrint(1, i, item.sizeRadio)">A4</div>
            <div v-if="item.sizeRadio === 1" @click="_changePrint(1, i, item.sizeRadio)">A3</div>
            <div v-if="item.sizeRadio === 2" @click="_changePrint(1, i, item.sizeRadio)">B5</div>
            <div @click="_changePrint(2, i, item.singleRadio)">{{item.singleRadio === 0? '单面': '双面'}}</div>
            <div v-if="item.bindRadio === 0" @click="_changePrint(3, i, item.bindRadio)">不装钉</div>
            <div v-if="item.bindRadio === 1" @click="_changePrint(3, i, item.bindRadio)">普通装钉</div>
            <div v-if="item.bindRadio === 2" @click="_changePrint(3, i, item.bindRadio)">胶装</div>
            <div>{{item.pages}}</div>
            <div @click="_openPage(i)">{{item.editionPage}}</div>
            <div>{{item.sheets}}</div>
            <div>{{item.sumSheets >= 100 ? item.unitPrice[1] : item.unitPrice[0]}}</div>
            <div class="copies-box">
              <div @click="_openPrintPage(i)">{{item.copies}}</div>
              <div class="copies-box-but">
                <div @click="_add(i)">＋</div>
                <div @click="_remove(i)">-</div>
              </div>
            </div>
            <div>{{item.discount}}</div>
            <div>{{item.total}}</div>
            <div>
              <mu-button small @click="_delect(i)">删除<mu-icon right value="delete"></mu-icon></mu-button>
              <mu-button small @click="_openPdf(item.name)">预览<mu-icon right value="visibility"></mu-icon></mu-button>
            </div>
          </div>
        </div>
        <div v-show="this.print.printData.length <= 0" class="tishi-box">
          <div>1: 为避免不同office版本造成排版差异, 仅支持上传word, pdf格式文件, 其他文件请先转为pdf</div>
          <div>2: 转换方式为: 打开文件-另存为-格式选择-PDF-保存</div>
          <div>3: 如有任何疑问, 可直接联系客服, 我们竭诚为你服务</div>
        </div>
      </div>
      <div class="opr">
        <div>活动单次充值20元即成为终身会员尽享8折优惠!</div>
        <div @click="changeAlert(true)">查看价格表</div>
        <mu-switch v-model="print.merge" label="以上文件合并装订"></mu-switch>
      </div>
    </div>

    <!-- 其他组件 -->
    <!--
    <div>
      <mu-dialog title="打印选择项设置" :open.sync="openSimple">
        <PrintInfo
          :sureBack="_sureBack"
          :info="info"
        />
      </mu-dialog>
    </div>
    -->

    <!-- 版式组件 -->
    <div>
      <page-number
        :openPage="openPage"
        :normal="normal"
        :surePageNumber="_surePageNumber"
      />
    </div>

    <!-- 打印份数选择 -->
    <mu-dialog title="打印份数" :overlay-close="false" :open.sync="printCopies">
      <mu-text-field v-model="copies" placeholder="打印份数输入"></mu-text-field><br/>
       <mu-button slot="actions" flat color="primary" @click="_closePrintPage">确认</mu-button>
    </mu-dialog>

    <!-- pdf组件 -->
    <mu-dialog title="pdf展示器" :open.sync="openDdf">
      <embed v-if="pdfSrc" width="800" height="600" :src="pdfSrc" />
    </mu-dialog>

    <!-- 打印选择项更改 -->
    <mu-dialog title="打印选项更改" width="360" scrollable :open.sync="openPrint">
    <mu-list>
      <mu-list-item :key="option" v-for="(option, i) in ['黑白','彩色']" v-show="printType.toString() !== 'false' && printType === 0">
        <mu-list-item-content>
          <mu-radio  :label="option" :value="i" v-model="IntermediateValue "></mu-radio>
        </mu-list-item-content>
      </mu-list-item>
      <mu-list-item :key="option" v-for="(option, i) in ['A4','A3', 'B5']" v-show="printType.toString() !== 'false' && printType === 1">
        <mu-list-item-content>
          <mu-radio  :label="option" :value="i" v-model="IntermediateValue "></mu-radio>
        </mu-list-item-content>
      </mu-list-item>
      <mu-list-item :key="option" v-for="(option, i) in ['单面','双面']" v-show="printType.toString() !== 'false' && printType === 2">
        <mu-list-item-content>
          <mu-radio  :label="option" :value="i" v-model="IntermediateValue "></mu-radio>
        </mu-list-item-content>
      </mu-list-item>
      <mu-list-item :key="option" v-for="(option, i) in ['不装钉','普通装订', '胶装(论文)']" v-show="printType.toString() !== 'false' && printType === 3">
        <mu-list-item-content>
          <mu-radio  :label="option" :value="i" v-model="IntermediateValue "></mu-radio>
        </mu-list-item-content>
      </mu-list-item>
    </mu-list>
    <mu-button slot="actions" flat color="primary" @click="_closePrintDialog">确定</mu-button>
  </mu-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import {deleteFile} from '@/api'
import PrintInfo from '@/components/Print-info'
import CryptoJS from 'crypto-js'
import PageNumber from '@/components/Page-number'
import Cookie from 'js-cookie'
export default {
  components: {PrintInfo, PageNumber},
  data () {
    return {
      print: {},
      openSimple: false,
      openPage: false,
      openDdf: false,
      printType: false,
      openPrint: false,
      IntermediateValue: null,
      printPage: false,
      printCopies: false,
      printCopiesPage: null,
      copies: '',
      options: {
        target: 'https://www.schooldayin.com/schoolDaYin/upload',
        testChunks: false,
        fileParameterName: 'pdf',
        categoryMap: {
          image: [],
          video: [],
          audio: [],
          document: ['doc', 'pdf']
        }
      },
      statusText: {
        success: '成功了',
        error: '出错了',
        uploading: '上传中',
        paused: '暂停中',
        waiting: '等待中'
      },
      normal: 1,
      nowPage: null,
      i: null,
      info: {},
      pdfSrc: null
    }
  },
  computed: {
    ...mapState(['loginStatus', 'basicPrinting', 'prize', 'userInfo'])
  },
  async created () {
    this.print = {
      merge: false,
      printData: []
    }
    if (localStorage.getItem('print')) {
      let prize = localStorage.getItem('print')
      prize = await CryptoJS.AES.decrypt(prize.toString(), 'dayin')
      prize = prize.toString(CryptoJS.enc.Utf8)
      this.print = JSON.parse(prize)
      this._sum()
    }
  },
  beforeUpdate () {
    this._updateData()
  },
  methods: {
    ...mapMutations(['updateSumAccount', 'changeAlert', 'getPrint', 'setLoding', 'removeLoding']),
    _checkLogin () {
      if (!this.loginStatus || !Cookie.get('token')) {
        this.$confirm('未登录, 去登陆', '提示', {
          type: 'warning'
        }).then(({ result }) => {
          if (result) {
            this.$root._login()
          }
        })
      }
    },
    _closePrintDialog () {
      if (this.printType === 0) {
        this.print.printData[this.i].colorRadio = this.IntermediateValue
      } else if (this.printType === 1) {
        this.print.printData[this.i].sizeRadio = this.IntermediateValue
      } else if (this.printType === 2) {
        this.print.printData[this.i].singleRadio = this.IntermediateValue
      } else if (this.printType === 3) {
        this.print.printData[this.i].bindRadio = this.IntermediateValue
      }
      const {colorRadio, sizeRadio, singleRadio} = this.print.printData[this.i]
      let prizes = []
      if (Number(colorRadio) === 0) {
        prizes = this.prize.blackAndWhite[sizeRadio][singleRadio]
      } else {
        prizes = this.prize.colour[sizeRadio][singleRadio]
      }
      this.print.printData[this.i].unitPrice = prizes
      this.openPrint = false
      this._sum()
    },
    _changePrint (type, i, value) {
      this.printType = type
      this.IntermediateValue = value
      this.i = i
      this.openPrint = true
    },
    async _updateData () {
      if (this.print.printData.length > 0) {
        let print = JSON.stringify(this.print)
        print = await CryptoJS.AES.encrypt(print, 'dayin')
        localStorage.setItem('print', print)
      } else {
        localStorage.removeItem('print')
      }
    },
    _add (u) {
      if (this.print.printData[u].copies < 1) return
      this.print.printData[u].copies = Number(this.print.printData[u].copies) + 1
      this._sum()
    },
    _remove (u) {
      if (this.print.printData[u].copies <= 1) return
      this.print.printData[u].copies = Number(this.print.printData[u].copies) - 1
      this._sum()
    },
    _delect (u) {
      this.$confirm('确定要删除？', '提示', {
        type: 'warning'
      }).then(async ({ result }) => {
        if (result) {
          let file = this.print.printData[u].name
          this.print.printData.splice(u, 1)
          await this._sum()
          await this._updateData()
          await deleteFile({files: file})
        }
      })
    },
    fileAdded (file, event) {
      let fileName = file.name
      fileName = fileName.split('.')
      fileName = fileName[fileName.length - 1]
      if (fileName === 'pdf' || fileName === 'doc' || fileName === 'docx') {
        this.setLoding()
      } else {
        this.$alert('文件类型不支持上传, 可自行转换为pdf在上传或者联系管理员直接打印咨询', {icon: 'errorIcon', transition: 'slide-left'})
        file.ignored = true
        return false
      }
    },
    _openPdf (name) {
      name = name.split('.')
      let pdf = name[0] + '.pdf'
      this.pdfSrc = `https://www.schooldayin.com/${pdf}`
      this.openDdf = true
    },
    fileError (rootFile, file, message, chunk) {
      this.$alert('上传错误', {icon: 'errorIcon', transition: 'slide-left'})
      this.removeLoding()
    },
    fileSuccess (rootFile, file, message, chunk) {
      message = JSON.parse(message)
      const {colorRadio, sizeRadio, singleRadio, bindRadio} = this.basicPrinting
      let prizes = []
      if (Number(colorRadio) === 0) {
        prizes = this.prize.blackAndWhite[sizeRadio][singleRadio]
      } else {
        prizes = this.prize.colour[sizeRadio][singleRadio]
      }
      if (!message.filename && !message.page) {
        this.$alert('转换错误, 可自行转换为pdf在上传或者联系管理员直接打印咨询', {icon: 'info', transition: 'slide-left'})
      } else {
        this.print.printData.push({
          colorRadio: colorRadio,
          sizeRadio: sizeRadio,
          singleRadio: singleRadio,
          bindRadio: bindRadio,
          name: message.filename,
          preview: true,
          pages: message.page,
          editionPage: 1,
          sheets: message.page,
          unitPrice: prizes,
          copies: 1,
          sumSheets: 0,
          discount: 0.00,
          total: 0.00
        })
      }
      this._sum()
      this.removeLoding()
    },
    _openPrintPage (i) {
      this.printCopiesPage = i
      this.printCopies = true
    },
    _closePrintPage () {
      this.printCopies = false
      if (!(this.copies) || !(/^[0-9]*$/.test(this.copies)) || (/^-[0-9]*$/.test(this.copies)) || this.copies === '0') {
        this.$alert('非法输入', '提示')
        return
      }
      this.print.printData[this.printCopiesPage].copies = parseFloat(this.copies)
      this.printCopiesPage = ''
      this._sum()
    },
    _account () {
      if (this.print.printData.length === 0) {
        this.updateSumAccount([0.00, 0.00])
        return
      }
      let {frequency} = this.userInfo
      let [truePrize, preferential] = [0, 0]
      this.print.printData.forEach((item) => {
        truePrize = (truePrize * 10 + item.total * 10) / 10
        preferential = (preferential * 10 + item.discount * 10) / 10
      })
      truePrize = truePrize.toFixed(2)
      preferential = preferential.toFixed(2)
      if (!frequency) {
        if (truePrize > 1.99) {
          truePrize = (parseFloat(truePrize) - parseFloat(1.99)).toFixed(2)
          preferential = (parseFloat(preferential) + parseFloat(1.99)).toFixed(2)
        } else {
          preferential = (parseFloat(preferential) + parseFloat(truePrize) - parseFloat(0.01)).toFixed(2)
          truePrize = 0.01
        }
      }
      this.updateSumAccount([truePrize, preferential])
    },
    _sum () {
      let page = 0
      this.print.printData.forEach((item, i) => {
        let flag = Math.floor((item.copies * item.pages) / item.editionPage)
        if (!flag) flag = 1
        if (Number(item.singleRadio) === 1) flag = Math.ceil(flag / 2)
        this.print.printData[i].sheets = flag
        page += flag
      })
      let {frequency, member} = this.userInfo
      if (page > 100) {
        this.print.printData.forEach((item, i) => {
          let account = (Number(this.print.printData[i].sheets) * Number(this.print.printData[i].unitPrice[1])).toFixed(2)
          let accountSun = (Number(this.print.printData[i].sheets) * Number(this.print.printData[i].unitPrice[0])).toFixed(2)
          this.print.printData[i].discount = (accountSun - account).toFixed(2)
          this.print.printData[i].total = account
          this.print.printData[i].sumSheets = page
        })
      } else {
        if (!member) {
          this.print.printData.forEach((item, i) => {
            let accountSun = (Number(this.print.printData[i].sheets) * Number(this.print.printData[i].unitPrice[0])).toFixed(2)
            this.print.printData[i].discount = '0.00'
            if (!frequency) {
              this.print.printData[i].discount = '0.00'
            }
            this.print.printData[i].total = accountSun
            this.print.printData[i].sumSheets = page
          })
        } else {
          this.print.printData.forEach((item, i) => {
            let accountSun = (Number(this.print.printData[i].sheets) * Number(this.print.printData[i].unitPrice[0])).toFixed(2)
            let discount = (parseFloat(accountSun) * 0.2).toFixed(2)
            this.print.printData[i].discount = discount
            this.print.printData[i].total = (parseFloat(accountSun) - parseFloat(discount)).toFixed(2)
            this.print.printData[i].sumSheets = page
          })
        }
      }
      this._account()
      this.getPrint(this.print)
    },
    _truePage (u, a, b, c) {
      let flag = Math.floor((c * a) / b)
      if (!flag) flag = 1
      this.print.printData[u].sheets = flag
      this._sum()
      return flag
    },
    _openPage (i) {
      this.nowPage = i
      this.normal = this.print.printData[i].editionPage
      this.openPage = true
    },
    /* _changePrint (i) {
      this.i = i
      this.info = JSON.parse(JSON.stringify(this.print[i].basicPrinting))
      this.openSimple = true
    },
    _sureBack (data) {
      this.print[this.i].basicPrinting = data
      const {colorRadio, sizeRadio, singleRadio} = data
      let prizes = []
      if (Number(colorRadio) === 0) {
        prizes = this.prize.blackAndWhite[sizeRadio][singleRadio]
      } else {
        prizes = this.prize.colour[sizeRadio][singleRadio]
      }
      if (!this.print[this.i].printData) {
        this.openSimple = false
        return
      }
      this.print[this.i].printData.forEach((item, i) => {
        item.unitPrice = prizes
      })
      this.openSimple = false
    }, */
    _surePageNumber (page) {
      this.print.printData[this.nowPage].editionPage = page
      this.openPage = false
      this._sum()
    }
  }
}
</script>

<style scoped>
.com-box {
  padding-bottom: 50px;
}
.prints-box {
  display: flex;
  width: 100%;
  margin-top: 50px;
  flex-direction: column;
  justify-content: flex-start;
  border: 1px solid gray;
}
.prints-box:nth-child(1) {
  margin-top: 0px;
}
.basic-print-info {
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid gray;
}
.basic-box {
  width: 60%;
  display: flex;
}
.basic-box div {
  width: 80px;
  height: 50px;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center
}
.basic-change {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.basic-change button {
  margin-right: 20px;
}
.basic-file-box {
  min-height: 320px;
}
.file-title {
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e6e6e6;
}
.file-title div{
  width: 11%;
  word-break: break-all;
  overflow: hidden;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid gray;
  border-right: 1px solid gray;
}
.file-title div:nth-child(2) {
  font-size: 16px;
}
.file-title div:last-child{
  width: 20%;
}
.file-con {
  min-height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
}
.opr {
  height: 50px;
  border-top: 1px solid gray;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
}
.opr div:nth-child(1) {
  margin-left: 20px;
  font-size: 20px;
  color: red;
}
.opr div:nth-child(2) {
  color: #17b7eb;
}
.opr div:nth-child(3) {
  margin-right: 20px;
}
.uploader-btn {
  height: 50px;
  width: 150px;
  color: white!important;
  border: 0px solid #17b7eb;
  background: #17b7eb;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  border-radius: 5px;
}
.uploader-drop {
  background: white;
  border: 0px solid #17b7eb;
}
.copies-box div:nth-child(1) {
  width: 50%;
  border: 0px solid gray;
  border-right: 1px solid gray;
}
.copies-box div:nth-child(2) {
  width: 50%;
  border: 0px solid gray;
}
.copies-box-but {
  display: flex;
  flex-direction: column;
}
.copies-box-but div{
  display: flex;
  justify-content: center!important;
  align-items: center!important;
  font-size: 24px;
  cursor: pointer;
}
.copies-box-but div:nth-child(1) {
  height: 50%;
  width: 100%;
  border: 0px solid gray;
  border-bottom: 1px solid gray;
}
.copies-box-but div:nth-child(2) {
  height: 50%;
  width: 100%;
  font-size: 20px;
  border: 0px solid gray;
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loading > .mu-loading-wrap {
  height: 100%!important;
  width: 100%!important
}
.uploader-boxs {
  display: flex;
  justify-content: center;
  align-items: center;
}
.uploader-box {
  width:300px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.uploader-btn {
  margin-left: 0px;
  height: 80px;
  width: 250px;
  font-size: 28px;
}
.loading {
  height: 100%;
  width: 100%;
  position: fixed;
  background: rgba(255, 255, 255, 0.5)
}
.tishi-box {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 18px;
  align-items: flex-start;
  color: #17b7eb;
  height: 200px;
}
</style>
