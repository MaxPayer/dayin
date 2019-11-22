<style>
	@import url(./admin.less);
</style>

<template>
	<div class="add-user-box">
		<div class="form">
			<div class="f-title">schoolDayin-Admin</div>

			<div class="f-con">
				<div>
				<p>账号 :</p>
				<div><Input v-model="userInfo.userName" placeholder="Wyoungon-admin-user-Name" style="width: 300px" /></div>
				</div>
				<div>
				<p>密码 :</p>
				<div><Input v-model="userInfo.password" placeholder="Wyoungon-admin-user-Password" style="width: 300px" /></div>
				</div>
				<div>
				<p>邮箱 :</p>
				<div><Input v-model="userInfo.email" placeholder="Wyoungon-admin-user-Email" style="width: 300px" /></div>
				</div>
				<div>
			 <p>性别 :</p>
				<div>
					<RadioGroup v-model="userInfo.sex">
					<Radio label="男" size="large">
						<Icon type="man"></Icon>
						<span>男</span>
					</Radio>
					<Radio label="女" size="large">
						<Icon type="woman"></Icon>
						<span>女</span>
					</Radio>
					</RadioGroup>
				</div>
			  </div>
			  <div>
				<p>等级 :</p>
				<div>
					<RadioGroup v-model="userInfo.grade">
						<Radio label="5" size="large">
							<Icon type="social-yahoo"></Icon>
							<span>5</span>
						</Radio>
							<Radio label="6" size="large">
							<Icon type="social-yahoo"></Icon>
							<span>6</span>
						</Radio>
							<Radio label="7" size="large">
							<Icon type="social-yahoo"></Icon>
							<span>7</span>
						</Radio>
							<Radio label="8" size="large">
							<Icon type="social-yahoo"></Icon>
							<span>8</span>
						</Radio>
					</RadioGroup>
				</div>
			</div>
		</div>

		<div class="but-box">
			<div class="but">
				<Button type="primary" icon="android-delete" @click="_reset">Reset</Button>
				<Button type="primary" shape="circle" icon="arrow-up-a" @click="_submit">Submit</Button>
			</div>
		</div>
		</div>
	</div>
</template>

<script>
import {validation} from './utils.js'
import {register} from '@/api/user.js'
export default {
  data () {
    return {
        userInfo: {
            userName: '',
            password: '',
            email: '',
            sex: '',
            grade: ''
        }
    }
  },
	methods: {
		_reset() {
			this.userInfo = {
				userName: '',
				password: '',
				email: '',
				sex: '',
				grade: ''
			}
		},
		_submit () {
			if(!validation(this, this.userInfo)) return
			register(this.userInfo).then((result) => {
				if (!result) return
				this._reset()
				this.$Message.success('注册成功')
			})
		}
	}
}
</script>
