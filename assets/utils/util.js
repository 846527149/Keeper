const _SEX_ARRAY = [{title: '男',value: '1'}, {title: '女',value: '2'}]
const _MARITAL_ARRAY=['未婚','已婚','离异','丧偶','其他']
const _OCC_ARRAY = ['国家公务员', '专业技术人员', '职员', '企业管理人员', '工人', '农民', '学生', '现役军人', '自由职业者', '个体经营者', '无业人员', '退(离)休人员', '职业司机', '厨师', '其他']

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') 
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
** 字符串转标准时间
**/
String.prototype.NormDate = function (obj) {
  return this.replace(/-/g, "-").replace('T', ' ').substring(0, 10)
}
module.exports = {
  formatTime: formatTime,
  getSexArray:_SEX_ARRAY,
  getMaritalArray: _MARITAL_ARRAY,
  getOccArray: _OCC_ARRAY,
}
