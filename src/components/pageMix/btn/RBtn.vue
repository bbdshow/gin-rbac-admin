<template>
  <el-button type="primary" @click="pSearch">
    <slot></slot>
  </el-button>
</template>

<script>
import { inject } from 'vue'
export default {
  props: {
    symbol: {
      type: String,
      default: 'page_ui'
    }
  },
  setup (props) {
    const { pSearch } = inject(Symbol.for(props.symbol))
    return {
      pSearch
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
