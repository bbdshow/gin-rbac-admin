// const base = '/api/rbac/'
const base = process.env.NODE_ENV === 'production' ? '/rbac/' : '/api/rbac/'
const v1 = `${base}v1/`
const account = `${v1}account/`
const action = `${v1}action/`
const menu = `${v1}menu/`
const app = `${v1}app/`
const role = `${v1}role/`

export default {
  login: `${base}login`,
  logout: `${base}loginOut`,

  getAuth: `${account}menu/auth`,
  accountCreate: `${account}create`,
  accountDel: `${account}delete`,
  accountList: `${account}list`,
  accountPwd: `${account}pwd/reset`,
  accountUpdate: `${account}update`,
  accountRoleUpdate: `${account}role/update`,

  actionFind: `${action}find`,
  actionList: `${action}list`,
  actionCreate: `${action}create`,
  actionUpdate: `${action}update`,
  actionDel: `${action}delete`,
  actionImport: `${action}import`,

  appCreate: `${app}create`,
  appList: `${app}list`,
  appDel: `${app}delete`,
  appSelect: `${app}select`,
  appUpdate: `${app}update`,

  menuTree: `${menu}tree`,
  menuCreate: `${menu}create`,
  menuUpdate: `${menu}update`,
  menuActions: `${menu}actions`,
  menuDel: `${menu}delete`,
  menuActionUpdate: `${menu}action/update`,

  roleAction: `${role}action`,
  roleList: `${role}list`,
  roleDel: `${role}delete`,
  roleCreate: `${role}create`,
  roleUpdate: `${role}update`,
  roleActionUpdate: `${role}action/upsert`
}
