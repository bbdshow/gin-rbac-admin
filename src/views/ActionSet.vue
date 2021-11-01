<template>
  <div class="ubn ub-ver wd-100">
    <el-form inline>
      <el-form-item label="名称">
        <el-input v-model="sForm.name"></el-input>
      </el-form-item>
      <el-form-item label="ID">
        <el-input v-model="sForm.id"></el-input>
      </el-form-item>
      <el-form-item label="Method">
        <select-mothod v-model="sForm.method"></select-mothod>
      </el-form-item>
      <el-form-item label="Path">
        <el-input v-model="sForm.path"></el-input>
      </el-form-item>
      <el-form-item label="APP">
        <app-list v-model="sForm.appId"></app-list>
      </el-form-item>
      <el-form-item>
        <s-btn>搜索</s-btn>
        <r-btn>重置</r-btn>
        <el-button type="success" @click="addClc">创建</el-button>
        <el-button type="success" @click="importClc">导入Swagger配置</el-button>
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
        <el-table-column
          prop="name"
          label="名称"
          width="450px"
        ></el-table-column>
        <el-table-column prop="path" label="Path"></el-table-column>
        <el-table-column
          prop="method"
          label="Method"
          width="100px"
        ></el-table-column>
        <el-table-column prop="status" label="状态" width="100px">
          <template v-slot="{ row }">{{
            row.status === 1 ? "正常" : "受限"
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
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
          <el-form-item label="APP" prop="appId">
            <app-list v-model="dialogData.appId"></app-list>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="dialogData.name"></el-input>
          </el-form-item>
          <el-form-item label="Method" prop="method">
            <select-mothod v-model="dialogData.method"></select-mothod>
          </el-form-item>
          <el-form-item label="Path" prop="path">
            <el-input v-model="dialogData.path"></el-input>
          </el-form-item>
              <el-form-item label="状态" prop="status" v-if="!addNew">
            <el-select v-model="dialogData.status" >
              <el-option label="正常" :value="1"></el-option>
              <el-option label="限制" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template #bottom>
        <el-button type="primary" @click="confirmClc">确定</el-button>
      </template>
    </d-box>
    <!-- 导入 -->
    <d-box v-model="showIm" title="导入">
      <template #body>
        <el-form
          :model="dialogData"
          :rules="rules"
          ref="form2"
          label-position="top"
        >
          <el-form-item label="APP" prop="appId">
            <app-list v-model="dialogData.appId"></app-list>
          </el-form-item>
          <el-form-item label="有效前缀" prop="prefix">
            <el-input
              v-model="dialogData.prefix"
              placeholder="如果不填，则Swagger所有API都将添加"
            ></el-input>
          </el-form-item>
          <el-form-item label="SwaggerJSON内容" prop="swaggerTxt">
            <el-input
              type="textarea"
              v-model="dialogData.swaggerTxt"
              placeholder="swagger.json"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #bottom>
        <el-button type="primary" @click="confirmIm">确定</el-button>
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
import SelectMothod from '@cps/selectMethod/SelectMethod.vue'
export default {
  components: { AppList, SelectMothod },
  setup () {
    const { dSearch, setForm, sForm, tableData, genForm, confirmAction } = genPage()
    const { form, checkPost } = genForm()
    const { form: form2, checkPost: checkPost2 } = genForm()
    setForm({
      name: '',
      id: undefined,
      appId: undefined,
      method: '',
      path: ''
    })
    dSearch('actionList')

    const state = reactive({
      dialogData: {},
      showD: false,
      showIm: false,
      addNew: false,
      rules: genRules(['method', 'name', 'path', 'appId', 'swaggerTxt'])
    })

    const addClc = () => {
      state.dialogData = { appId: undefined, method: '', name: '', path: '' }
      state.addNew = true
      state.showD = true
    }
    const modifyClc = ({ appId, method, name, path, status }) => {
      state.dialogData = { appId, method, name, path, status }
      state.addNew = false
      state.showD = true
    }
    const confirmClc = () => {
      // const portName = state.addNew ? 'appCreate' : 'appUpdate'
      checkPost('actionUpsert', state.dialogData).then(() => {
        state.showD = false
      })
    }

    const importClc = () => {
      state.dialogData = { appId: undefined, prefix: '', swaggerTxt: '' }
      state.showIm = true
    }
    const confirmIm = () => {
      checkPost2('actionImport', state.dialogData).then((res) => {
        if (res) {
          state.showIm = false
        }
      })
    }
    const delClc = ({ id }) => {
      confirmAction('actionDel', { id })
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
      form2,
      importClc,
      confirmIm,
      delClc
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
