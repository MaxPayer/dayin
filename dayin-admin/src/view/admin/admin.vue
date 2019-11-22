<style>
	@import url(./admin.less);
</style>

<template>
  <div>
      <Table :columns="columns" :data="adminListData" border ></Table>
      <Modal
        v-model="isdelectadmin"
        title="是否确定删除"
        @on-ok="_delectUser">
        <p>删除之后管理员将不存在</p>
      </Modal>
      <Modal
        v-model="ischangeadmin"
        title="更改用户"
        @on-ok="_changeUser">
        <div>
          <from class="d-from">
            <Input v-model="userInfo.userName" placeholder="用户名" style="width: 300px"></Input>
            <Input v-model="userInfo.email" placeholder="邮箱" style="width: 300px"></Input>
          </from>
          <div class="d-select">
            <Select v-model="userInfo.sex" style="width:200px">
              <Option v-for="item in sexList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="userInfo.grade" style="width:200px">
              <Option v-for="item in gradeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
        </div>
      </Modal>
  </div>
</template>
<script>
import {adminList, delectAdmin, changeUser} from '@/api/user.js'
import {validaAdminInfo, validation} from './utils.js'
export default {
  data () {
    return {
      isdelectadmin: false,
      ischangeadmin: false,
      $i: null,
      userInfo: {
        _id: '',
        id: '',
        userName: '',
        password: '',
        sex: '',
        email: '',
        grade: ''
      },
      sexList: [{value: '男', label: '男'}, {value: '女', label: '女'}],
      gradeList: [{value: 4, label: 4}, {value: 5, label: 5}, {value: 6, label: 6}, {value: 7, label: 7}, {value: 8, label: 8}],
      params: {},
      columns: [
        {title: '用户名', key: 'userName'},
        {title: '性别', key: 'sex'}, 
        {title: '邮箱', key: 'email'},
        {title: '等级', key: 'grade'},
        {title: '操作', key: 'action', width: 300, align: 'center',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {type: 'primary', size: 'small'},
              style: {marginRight: '5px'},
              on: {click: () => {this._showChange(params)}}
             }, '更改'),
            h('Button', {
              props: {type: 'error', size: 'small'},
              style: {marginRight: '5px'},
              on: {click: () => {this._showDelect(params, params.index)}}
            }, '删除')])
        }
        }
      ],
      adminListData: [
        { _id: 'sfsefes', id: 'sfe', userName: 'John Brown', sex: '男', email: '1805170243@qq.com', grade: 8}
      ]
    }
  },
  async created () {
    await this._getUserListInfo()
  },
  methods: {
    _getUserListInfo () {
      this.$Spin.show()
      adminList().then((result) => {
        if (!result) return
        result = result.data
        this.$Spin.hide()
        this.adminListData = result
      }).catch(() => { this.$Spin.hide() })
    },
    _delectUser () {
      const _id = this.params._id
      delectAdmin(_id).then((result) => {
        if (!result) return
        this.$Message.success('删除成功')
        this.adminListData.splice(this.$i, 1)
      }).catch(() => {
        this.$Message.error('删除错误')
      })
    },
    _showDelect (params, index) {
      this.params = params.row
      this.$i = index
      this.isdelectadmin = true
    },
    _showChange (params) {
      const {_id, id, userName, email, sex, grade} = params.row
      this.userInfo = {_id, id, userName, sex, email, grade}
      this.params = params.row
      this.ischangeadmin = true
    },
    async _changeUser () {
      if (await validaAdminInfo(this, this.params, this.userInfo)) return
      if (!validation(this, this.userInfo)) return
      changeUser(this.userInfo)
    }
  }
}
</script>
