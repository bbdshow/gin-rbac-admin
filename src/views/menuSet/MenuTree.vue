<template>
  <el-tree :data="menu" default-expand-all label="name" node-key="id" @node-click="nodeClc" >
    <template #default="{ data }">
      <span class="wd-100">
        <span>[{{data.sequence}}]  {{ data.name }}</span>
        <!-- <span class="mar-l10">
          <el-button type="text" @click="actionClc(data, 'modify')"> 修改 </el-button>
          <el-button type="text" @click="actionClc(data, 'add')" v-if="data.typ === 2"> 新增子页面 </el-button>
          <el-button type="text" @click="actionClc(data, 'action')" v-else> 配置Action </el-button>
          <el-button type="text" @click="actionClc(data, 'delete')"> 删除 </el-button>
        </span> -->
      </span>
    </template>
  </el-tree>
</template>

<script>
export default {
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },
  setup (props, content) {
    const actionClc = (data, actionType) => {
      console.log(data)
      const { id, memo, name, parentId, path, sequence, typ, appId } = data
      content.emit('menuAction', { actionType, id, memo, name, parentId, path, sequence, typ, appId })
    }
    const nodeClc = (data) => {
      // const info = JSON.parse(JSON.stringify(data))
      const menuId = data.id
      console.log('nodeClc', menuId)
      content.emit('nodeClc', menuId)
    }
    const checkType = (data) => {
      return data.typ === 1 || data.typ === 2
    }
    return {
      actionClc,
      nodeClc,
      checkType
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
