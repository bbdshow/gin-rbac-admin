<template>
  <el-container class="home">
    <el-header>
      <nav-top></nav-top>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <menu-bar></menu-bar>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import NavTop from '@/components/navTop/NavTop.vue'
import MenuBar from '@cps/menu/MenuBar.vue'
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
    NavTop,
    MenuBar
  }
}
</script>
<style lang="scss" scoped>
.home{
  min-height: 100%;
  & :deep(.el-header){
    padding: 0;
  }
}
</style>
