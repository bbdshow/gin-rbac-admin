<template>
  <div class="ubn ub-ver wd-100">
    <el-form inline>
      <el-form-item label="名称">
        <el-input v-model="sForm.name"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="sForm.status">
          <el-option label="正常" :value="1"></el-option>
          <el-option label="限制" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <s-btn>搜索</s-btn>
        <r-btn>重置</r-btn>
        <el-button type="success" @click="addClc">创建</el-button>
      </el-form-item>
    </el-form>
    <div class="ubn ub-ver wd-100">
      <el-table :data="tableData" stripe>
        <el-table-column label="创建 / 更新时间" width="320px">
          <template v-slot="{ row }">{{
            fTime(row.createdAt) + " / " + fTime(row.updatedAt)
          }}</template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="50px"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="appId" label="AppId"></el-table-column>
        <el-table-column prop="accessKey" label="AccessKey"></el-table-column>
        <el-table-column prop="secretKey" label="SecretKey"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template v-slot="{ row }">{{
            row.status === 1 ? "正常" : "受限"
          }}</template>
        </el-table-column>
        <el-table-column prop="memo" label="备注"></el-table-column>

        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="text" @click="modifyClc(row)">修改</el-button>
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
          <el-form-item label="重置SecretKey" v-if="!addNew">
            <el-select v-model="dialogData.isSecretKey" v-if="!addNew">
              <el-option label="不重置" :value="0"></el-option>
              <el-option label="重置" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status"  v-if="!addNew">
            <el-select v-model="dialogData.status" v-if="!addNew">
              <el-option label="正常" :value="1"></el-option>
              <el-option label="限制" :value="2"></el-option>
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
  </div>
</template>

<script>
import genPage from '@cps/pageMix/pageMix'
import fTime from '@/assets/utils/fTime'
import { reactive, toRefs } from '@vue/reactivity'
import genRules from '@/assets/utils/generateRules'
export default {
  setup () {
    const { dSearch, setForm, sForm, tableData, genForm, confirmAction } = genPage()
    const { form, checkPost } = genForm()
    setForm({ name: '', status: undefined })
    dSearch('appList')

    const state = reactive({
      dialogData: {},
      showD: false,
      addNew: false,
      rules: genRules(['name', 'status'])
    })

    const addClc = () => {
      state.dialogData = { name: '', meme: '' }
      state.addNew = true
      state.showD = true
    }
    const modifyClc = ({ id, memo, name, status }) => {
      state.dialogData = { id, memo, name, isSecretKey: 0, status }
      state.addNew = false
      state.showD = true
    }
    const confirmClc = () => {
      const portName = state.addNew ? 'appCreate' : 'appUpdate'
      checkPost(portName, state.dialogData).then(() => {
        state.showD = false
      })
    }
    const delClc = ({ id }) => {
      confirmAction('appDel', { id })
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
      delClc
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
