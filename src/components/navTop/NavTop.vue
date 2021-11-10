<template>
  <div class="ubn wd-100 top ub-ac ub-pj ht-100">
    <div class="ubn">RBAC 管理</div>
    <div class="ubn">
      <span class="fz-12 mar-r20">{{nickname}}</span>
      <div class="ubn fz-12 canclc mar-r20" @click="freshClc">刷新权限</div>
      <div class="ubn fz-12 canclc" @click="logoutClc">退出登录</div>
    </div>
  </div>
</template>

<script>
import { axiosPost, axiosGet } from '@api/http'
import code from '@/assets/api/code'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { reactive, toRefs } from 'vue'

export default {
  setup () {
    const $store = useStore()
    const $router = useRouter()
    const state = reactive({
      nickname: $store.state.nickname
    })
    const logoutClc = () => {
      axiosPost('logout').then((res) => {
        if (res?.code === code.SUCCESS) {
          $store.commit('setToken', '')
          $router.push({ name: 'login' })
        }
      })
    }
    const freshClc = () => {
      return axiosGet('getAuth').then(res => {
        if (res?.code === code.SUCCESS) {
          $store.commit('setAuth', res.data.dirs)
        }
      })
    }
    return {
      ...toRefs(state),
      logoutClc,
      freshClc
    }
  }
}
</script>

<style lang="scss" scoped>
.top {
  // height: 50px;
  background-color: #3b5a99;
  padding: 0 20px;
  color: #fff;
}
</style>
