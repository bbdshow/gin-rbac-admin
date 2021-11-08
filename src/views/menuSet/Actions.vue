<template>
  <div class="ubn wd-100 ub-ver">
    <el-input v-model="filterStr" placeholder="关键字" clearable></el-input>
    <el-checkbox-group v-model="checkList" class="mar-0">
      <el-checkbox v-for="action of filterList" :key="action.id" :label="action.id" :disabled="action.status==2">{{action.name}} [{{action.method}}]</el-checkbox>
      <br/>
    </el-checkbox-group>

  </div>
</template>

<script>
import { axiosGet } from '@api/http'
import { computed, reactive, toRefs, watch } from 'vue'
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
      list: [],
      filterStr: ''
    })
    const appId = computed(() => props.appId)
    // 初始化
    const initActions = () => {
      // console.log('appId', props.appId)
      if (!appId.value) {
        return
      }
      return axiosGet('actionList', { appId: props.appId, size: 1000 }).then(res => {
        if (res?.code === code.SUCCESS) {
          state.list = res.data.list
        }
      })
    }
    initActions()

    // 计算选中
    const actionMap = computed(() => {
      const map = {}
      props.modelValue.forEach(action => {
        const id = action.id
        map[id] = true
      })
      return map
    })

    const checkList = computed({
      get () {
        return props.modelValue || []
      },
      set (list) {
        content.emit('update:modelValue', list)
      }
    })

    const filterList = computed(() => {
      if (!state.filterStr) {
        return state.list
      }
      return state.list.filter(action => action.name.indexOf(state.filterStr) !== -1)
    })
    watch(appId, initActions)
    return {
      ...toRefs(state),
      actionMap,
      // checkChange
      checkList,
      filterList
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
