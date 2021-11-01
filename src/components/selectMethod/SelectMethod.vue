<template>
  <el-select v-model="setVal">
    <el-option v-for="type of list" :label="type" :value="type" :key="type"></el-option>
  </el-select>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
export default {
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  setup (props, content) {
    const state = reactive({
      list: ['GET', 'POST', 'PUT', 'DELETE']
    })
    const setVal = computed({
      get () {
        return props.modelValue
      },
      set (val) {
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

<style lang="scss" scoped>

</style>
