<template>
  <div class="ubn wd-100 ub-ver">
    <el-checkbox-group v-model="checkList" class="mar-l10" >
      <el-checkbox :label="action.id" :key="action.id" v-for="action of list" >{{action.name}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { axiosPost } from '@/assets/api/http'
import code from '@/assets/api/code'
export default {
  props: {
    info: {
      type: Object,
      default: () => ({})
    },
    actions: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const state = reactive({
      list: []
    })
    const info = computed(() => props.info)
    const menuActions = computed(() => info.value.actions)
    const userActions = computed(() => props.actions)

    const getMenuActions = () => {
      if (menuActions.value.length === 0) {
        return
      }
      return axiosPost('actionFind', { appId: info.value.appId, actionId: menuActions.value }).then(res => {
        if (res?.code === code.SUCCESS) {
          state.list = res.data.actions
        }
      })
    }
    const checkList = computed({
      get () {
        return userActions.value
      },
      set (val) {}
    })
    getMenuActions()
    return {
      checkList,
      ...toRefs(state)
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
