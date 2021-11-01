<template>
  <div class="ubn ub-ver wd-100">
    <el-form inline>
      <el-form-item label="名称">
        <el-input v-model="sForm.name"></el-input>
      </el-form-item>
      <el-form-item label="APP">
        <app-list v-model="sForm.appId"></app-list>
      </el-form-item>
      <el-form-item>
        <s-btn>搜索</s-btn>
        <r-btn>重置</r-btn>
        <el-button type="success" @click="addClc">创建</el-button>
      </el-form-item>
    </el-form>
    <div class="ubn ub-ver wd-100">
      <el-table :data="tableData" stripe>
        <el-table-column prop="updatedAt" label="更新时间" width="160px">
          <template v-slot="{ row }">{{ fTime(row.updatedAt) }}</template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="50px"></el-table-column>
        <el-table-column
          prop="appId"
          label="AppId"
          width="100px"
        ></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template v-slot="{ row }">{{
            row.status === 1 ? "正常" : "受限"
          }}</template>
        </el-table-column>
        <el-table-column prop="isRoot" label="ROOT">
          <template v-slot="{ row }">{{
            row.status === 1 ? "是" : "否"
          }}</template>
        </el-table-column>
        <el-table-column prop="memo" label="备注"></el-table-column>

        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="text" @click="modifyClc(row)">修改</el-button>
            <el-button type="text" @click="bindClc(row)">绑定功能</el-button>
            <el-button type="text" @click="delClc(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="ubn wd-100 ub-pc">
      <page-ui></page-ui>
    </div>
    <d-box v-model="showD" :title="addNew ? '新增' : '修改'">
      <template #body>
        <el-form
          :model="dialogData"
          :rules="rules"
          ref="form"
          label-position="top"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="dialogData.name"></el-input>
          </el-form-item>
          <el-form-item label="AppId" prop="appId" v-if="addNew">
            <app-list v-model="dialogData.appId"></app-list>
          </el-form-item>
          <el-form-item label="状态" prop="status" v-if="!addNew">
            <el-select v-model="dialogData.status" >
              <el-option label="正常" :value="1"></el-option>
              <el-option label="限制" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否Root" prop="isRoot">
            <el-select v-model="dialogData.isRoot">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="memo">
            <el-input v-model="dialogData.memo"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #bottom>
        <el-button type="primary" @click="confirmClc">确定</el-button>
      </template>
    </d-box>
    <!-- 绑定action -->
    <d-box v-model="showTree" title="绑定功能">
      <template #body>
        <el-form
          :model="dialogData"
          :rules="rules"
          ref="treeForm"
          label-position="top"
        >
          <el-form-item label="选择功能" prop="menuActions">
            <role-tree
              v-model="dialogData.menuActions"
              :appId="dialogData.appId"
            ></role-tree>
          </el-form-item>
        </el-form>
      </template>
      <template #bottom>
        <el-button type="primary" @click="confirmTreeClc">确定</el-button>
      </template>
    </d-box>
  </div>
</template>

<script>
import genPage from '@cps/pageMix/pageMix'
import fTime from '@/assets/utils/fTime'
import { reactive, toRefs } from '@vue/reactivity'
import genRules from '@/assets/utils/generateRules'
import AppList from '@views/menuSet/AppList.vue'
import RoleTree from './RoleTree.vue'
import { axiosGet } from '@/assets/api/http'
import code from '@/assets/api/code'
export default {
  components: { AppList, RoleTree },
  setup () {
    const { dSearch, setForm, sForm, tableData, genForm, confirmAction } = genPage()
    const { form, checkPost } = genForm()
    const { form: treeForm, checkPost: checkPostTree } = genForm()
    setForm({ name: '', appId: undefined })
    dSearch('roleList')

    const state = reactive({
      dialogData: {},
      showD: false,
      showTree: false,
      addNew: false,
      rules: genRules(['appId', 'name', 'menuActions'])
    })

    const addClc = () => {
      state.dialogData = {
        name: '',
        memo: '',
        appId: undefined,
        isRoot: undefined
      }
      state.addNew = true
      state.showD = true
    }
    const modifyClc = ({ id, memo, name, isRoot, status }) => {
      state.dialogData = { id, memo, name, isRoot, status }
      state.addNew = false
      state.showD = true
    }
    const confirmClc = () => {
      const portName = state.addNew ? 'roleCreate' : 'roleUpdate'
      checkPost(portName, state.dialogData).then(() => {
        state.showD = false
      })
    }

    const bindClc = ({ id, appId }) => {
      return axiosGet('roleAction', { roleId: id, appId }).then((res) => {
        if (res?.code === code.SUCCESS) {
          const menuActions = res.data.menuActions || []
          state.dialogData = {
            roleId: id,
            menuActions,
            appId
          }
          state.showTree = true
        }
      })
    }
    const confirmTreeClc = () => {
      checkPostTree('roleActionUpdate', state.dialogData).then(() => {
        state.showTree = false
      })
    }
    const delClc = ({ id }) => {
      confirmAction('roleDel', { id })
    }
    return {
      ...toRefs(state),
      sForm,
      tableData,
      fTime,
      addClc,
      modifyClc,
      confirmClc,
      dSearch,
      form,
      bindClc,
      confirmTreeClc,
      treeForm,
      delClc
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
