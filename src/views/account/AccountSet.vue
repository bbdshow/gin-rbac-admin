<template>
  <div class="ubn ub-ver wd-100">
    <el-form inline>
      <el-form-item label="用户名">
        <el-input v-model="sForm.username"></el-input>
      </el-form-item>
      <!-- <el-form-item label="APP">
        <app-list v-model="sForm.appId"></app-list>
      </el-form-item> -->
      <el-form-item label="昵称">
        <el-input v-model="sForm.nickname"></el-input>
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
      <el-table :data="tableData" stripe >
        <el-table-column label="创建 / 更新时间" width="320px">
          <template v-slot="{ row }">{{
            fTime(row.createdAt) + " / " + fTime(row.updatedAt)
          }}</template>
        </el-table-column>
        <!-- <el-table-column prop="appId" label="AppId"></el-table-column> -->
        <!-- <el-table-column prop="appName" label="App名称"></el-table-column> -->
        <el-table-column prop="status" label="状态" width="80px">
          <template v-slot="{row}">{{row.status === 1 ?'正常':'受限'}}</template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="150px"></el-table-column>
        <el-table-column prop="username" label="用户名" width="150px"></el-table-column>
        <el-table-column prop="pwdWrong" label="密码错误" width="100px"></el-table-column>
         <el-table-column prop="loginLock" label="登录限制" width="100px">
          <template v-slot="{row}">{{row.loginLock === 0 ?'正常':'受限'}}</template>
        </el-table-column>
        <el-table-column prop="memo" label="备注" width="100px"></el-table-column>
        <el-table-column prop="roles" label="当前角色">
          <template v-slot="{row}">{{row.roles.map(item=>{ return `[${item.appName}] ` + item.name}).join(',')}}</template>
        </el-table-column>

        <el-table-column label="操作" width="230px">
          <template v-slot="{row}">
            <el-button type="text" @click="modifyClc(row)">修改</el-button>
            <el-button type="text" @click="setRoleClc(row)">绑定角色</el-button>
            <el-button type="text" @click="pwdClc(row)">重置密码</el-button>
            <el-button type="text" @click="delClc(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="ubn wd-100 ub-pc">
      <page-ui ></page-ui>
    </div>
    <d-box v-model="showD" :title="addNew?'新增':'修改'">
      <template #body>
        <el-form :model="dialogData" :rules="rules" ref="form" label-position="top">
          <el-form-item label="用户名" prop="username" v-if="addNew">
            <el-input v-model="dialogData.username" ></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname" >
            <el-input v-model="dialogData.nickname" ></el-input>
          </el-form-item>
          <!-- <el-form-item label="appId" prop="appId">
            <app-list v-model="dialogData.appId"></app-list>
          </el-form-item> -->
          <el-form-item label="状态" prop="status" v-if="!addNew">
            <el-select v-model="dialogData.status" >
              <el-option label="正常" :value="1"></el-option>
              <el-option label="限制" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="密码" prop="password" v-if="addNew">
            <md5-input v-model="dialogData.password" ></md5-input>
          </el-form-item>
          <el-form-item label="备注" prop="memo">
             <el-input v-model="dialogData.memo" ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #bottom>
        <el-button type="primary" @click="confirmClc">确定</el-button>
      </template>
    </d-box>
    <!-- 绑定角色 -->
    <d-box v-model="showRole" title="绑定角色">
      <template #body>
        <el-form :model="dialogData" :rules="rules" ref="formRole" label-position="top">
          <el-form-item label="选择角色" prop="roles" >
            <account-bind-role v-model="dialogData.roles" :appId="dialogData.appId"></account-bind-role>
          </el-form-item>
        </el-form>
      </template>
      <template #bottom>
        <el-button type="primary" @click="bindRoleClc">确定</el-button>
      </template>
    </d-box>
    <!-- 修改密码 -->
    <d-box v-model="showPwd" title="修改密码">
      <template #body>
        <el-form :model="dialogData" :rules="rules" ref="formPwd" label-position="top">
          <el-form-item label="密码" prop="password" >
            <md5-input v-model="dialogData.password"></md5-input>
          </el-form-item>
        </el-form>
      </template>
      <template #bottom>
        <el-button type="primary" @click="pwdConfirmClc">确定</el-button>
      </template>
    </d-box>
  </div>
</template>

<script>
import genPage from '@cps/pageMix/pageMix'
import fTime from '@/assets/utils/fTime'
import { reactive, toRefs } from '@vue/reactivity'
import genRules from '@/assets/utils/generateRules'
// import AppList from '@views/menuSet/AppList.vue'
import Md5Input from '@cps/md5Input/Md5Input.vue'
import AccountBindRole from './AccountBindRole.vue'
export default {
  // components: { AppList, Md5Input, AccountBindRole },
  components: { Md5Input, AccountBindRole },
  setup () {
    const { dSearch, setForm, sForm, tableData, genForm, confirmAction } = genPage()
    const { form, checkPost } = genForm()
    const { form: formRole, checkPost: roleCheckPost } = genForm()
    const { form: formPwd, checkPost: pwdCheckPost } = genForm()
    setForm({ appId: undefined, nickname: '', username: '', status: undefined })
    dSearch('accountList')

    const state = reactive({
      dialogData: {},
      showD: false,
      showRole: false,
      showPwd: false,
      addNew: false,
      rules: genRules(['username', 'nickname', 'appId', 'password'])
    })

    const addClc = () => {
      state.dialogData = { username: '', nickname: '', appId: undefined, password: '' }
      state.addNew = true
      state.showD = true
    }
    const modifyClc = ({ id, memo, nickname, status }) => {
      state.dialogData = { id, memo, nickname, status }
      state.addNew = false
      state.showD = true
    }
    const confirmClc = () => {
      const portName = state.addNew ? 'accountCreate' : 'accountUpdate'
      checkPost(portName, state.dialogData).then(() => {
        state.showD = false
      })
    }

    const setRoleClc = ({ id, roles, appId }) => {
      const data = roles.map(item => item.id)
      state.dialogData = {
        roles: data,
        id,
        appId
      }
      state.showRole = true
    }
    const bindRoleClc = () => {
      roleCheckPost('accountRoleUpdate', state.dialogData).then(res => {
        if (res) {
          state.showRole = false
        }
      })
    }
    const pwdConfirmClc = () => {
      pwdCheckPost('accountPwd', state.dialogData).then(res => {
        if (res) {
          state.showPwd = false
        }
      })
    }
    const pwdClc = ({ id }) => {
      state.dialogData = { id, password: '' }
      state.showPwd = true
    }
    const delClc = ({ id }) => {
      confirmAction('accountDel', { id })
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
      formRole,
      setRoleClc,
      bindRoleClc,
      formPwd,
      pwdClc,
      pwdConfirmClc,
      delClc
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
