<template>
  <el-dialog :title="title" v-model="showDb" center>
    <slot name="body"></slot>
    <template #footer>
      <span >
        <el-button @click="showDb = false">取 消</el-button>
        <slot name="bottom"></slot>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { computed } from 'vue'
export default {
  name: 'd-box',
  props: {
    title: {
      default: '',
      type: String
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup (props, content) {
    const showDb = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        content.emit('update:modelValue', value)
      }
    })
    return {
      showDb
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
