<template>
  <el-checkbox-group v-model="checkList">
    <el-checkbox v-for="role of list" :label="role.id" :key="role.id">{{`[${role.appName}] ${role.name}`}}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
import { computed, reactive, toRefs, watch } from 'vue'
import { axiosGet } from '@/assets/api/http'
import code from '@/assets/api/code'
export default {
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    appId: {
      type: String,
      default: ''
    }
  },
  setup (props, content) {
    const state = reactive({
      list: []
    })
    const checkList = computed({
      get () {
        return props.modelValue
      },
      set (val) {
        content.emit('update:modelValue', val)
      }
    })
    const appId = computed(() => props.appId)
    const getRoleList = () => {
      return axiosGet('roleList', { page: 1, size: 1000, appId: appId.value }).then(res => {
        if (res?.code === code.SUCCESS) {
          state.list = res.data.list
        }
      })
    }
    getRoleList()
    watch(appId, getRoleList)
    return {
      checkList,
      ...toRefs(state)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
