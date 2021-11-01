<template>
  <el-select v-model="setVal">
    <el-option :label="app.name" :value="app.appId" :key="app.appId" v-for="app of list"></el-option>
  </el-select>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import { axiosGet } from '@api/http'
import code from '@/assets/api/code'
export default {
  props: {
    modelValue: {
      type: String,
      default: undefined
    }
  },
  setup (props, content) {
    const state = reactive({
      list: []
    })
    const getApps = () => {
      return axiosGet('appSelect', { page: 1, size: 1000 }).then(res => {
        if (res?.code === code.SUCCESS) {
          state.list = res.data.list || []
        }
      })
    }
    getApps()
    const setVal = computed({
      get () {
        return props.modelValue
      },
      set (val) {
        console.log('appId', val)
        content.emit('update:modelValue', val)
      }
    })
    return {
      ...toRefs(state),
      setVal
    }
  }
}
</script>
