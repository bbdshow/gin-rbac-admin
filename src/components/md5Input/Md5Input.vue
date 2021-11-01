<template>
  <el-input type="password" v-model="setVal" :clearable="clearable" @blur="doMd5" ></el-input>
</template>

<script>
import md5 from 'blueimp-md5'
import { computed } from 'vue'
export default {
  name: 'tem',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue'],
  setup (props, content) {
    const setVal = computed({
      get () {
        return props.modelValue
      },
      set (val) {
        content.emit('update:modelValue', val)
      }
    })
    const doMd5 = () => {
      const value = props.modelValue
      const val = value === '' ? '' : md5(value)
      content.emit('update:modelValue', val)
    }
    return {
      setVal,
      doMd5
    }
  }
}
</script>

<style>
</style>
