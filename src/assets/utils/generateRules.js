export default (list = []) => {
  const rules = {}
  for (const name of list) {
    const rule = [{ required: true, message: '请输入...', trigger: 'blur' }]
    rules[name] = rule
  }
  return rules
}
