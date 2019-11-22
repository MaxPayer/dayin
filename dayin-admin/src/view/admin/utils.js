const validation = function (that, data) {
  if (!Object.values(data).every((n) => n !== '')) return false
  const {userName, email} = data
  const re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
  if (userName.length < 2) {
    that.$Message.error('账号和密码不得少于2个字符')
    return false
  } else if (!re.test(email)) {
    that.$Message.error('邮箱错误')
    return false
  }
  return true
}

const validaAdminInfo = async function (than, preData, newData) {
  const end = await Object.values(newData).every((item, index) => Object.values(preData)[index] === item)
  if (end) {
    than.$Message.warning('管理者信息没有改变')
    return end
  }
  return end
}

export {
  validation,
  validaAdminInfo
}
