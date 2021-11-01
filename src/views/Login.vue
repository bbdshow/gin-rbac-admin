<template>
  <div class="ub wd-100 ht-100 ub-ac ub-pc">
    <div class="ub login-box ub-ver">
      <div class="ub fz-20 bold title wd-100 ub-pc">RBAC管理后台</div>
      <el-form
        :model="dialogData"
        label-position="left"
        label-width="55px"
        :rules="rules"
        ref="form"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="dialogData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <md5-input v-model="dialogData.password"></md5-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="login">登录</el-button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import generateRules from '@utils/generateRules'
import validate from '@utils/validate'
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import code from '@/assets/api/code'
import Md5Input from '@cps/md5Input/Md5Input.vue'
import { axiosGet } from '@/assets/api/http'
export default {
  name: 'Login',
  components: { Md5Input },
  setup () {
    const store = useStore()
    const router = useRouter()
    const { form, checkPost } = validate()
    // const dialogData = reactive({ userName: '', password: '' })
    const dialogData = reactive({
      username: '',
      password: '',
      appId: '000000'
    })
    const rules = generateRules(['username', 'password'])
    const login = async () => {
      // console.log('login')
      checkPost('login', dialogData).then((res) => {
        // console.log('login1')
        if (res?.code === code.SUCCESS) {
          // console.log('login2')
          store.commit('setToken', res.data.token)
          getAuth().then(auth => {
            store.commit('setAuth', auth)
            router.replace({ name: 'home' })
          })
        }
      })
    }
    const getAuth = () => {
      return axiosGet('getAuth').then(res => {
        if (res?.code === code.SUCCESS) {
          return res.data.dirs
        }
      })
    }
    return {
      dialogData,
      rules,
      login,
      form
    }
  }
}
</script>
<style lang="scss" scoped>
.login-box {
  width: 350px;
  background-color: #fff;
  border-radius: 5px;
  padding: 30px 20px;
  box-shadow: 0 0 25px #909399;
}
.title {
  margin-bottom: 22px;
}
</style>
