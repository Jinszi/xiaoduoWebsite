import $ from 'jquery'

// 右边悬浮栏
// 点击回到顶部
$('.toTop').on('click', () => {
  document.body.scrollTop = 0
  document.documentElement.scrollTop = 0
  window.pageYOffset = 0
})
// 点击在线咨询
$('.onlineService').on('click', () => {
  if (window.CVD_SDK) {
    window.CVD_SDK.openWindow()
  }
})
// 输入电话号码点击立即试用
function showRecordPhoneSuccess (phone) {
  $('.m-modal-phone-set-success').toggleClass('hide', false)
  $('.phoneInput').val('')
  // 弹窗中跳转到注册页面的链接中添加phone字段
  let a = $('.linkToRegisterWithPhone')[0]
  a.href = a.href.replace(/phone=[^&]+/, `phone=${phone}`)
}
$('.phone-set-success-modal-close-icon').on('click', () => {
  $('.m-modal-phone-set-success').toggleClass('hide', true)
})
function checkPhone ($input) {
  let value = $input.val()
  let phoneReg = /(^((\d{11})|(\d{7,8})|(\d{4}|\d{3})-(\d{7,8}))$)/
  if (value.trim() === '') return
  if (!phoneReg.test(value)) return window.alert('电话号码格式输入有误')
  let url = '//cvd.xiaoduoai.com/v1/bi/write_phone'
  if (window.location.host.indexOf('808') !== -1) url = 'http://cvd.xiaoduoai.com/v1/bi/write_phone'
  $.get({
    url,
    data: { phone: value },
  }).then((res) => {
    // 不管返回结果，只要后端接收到，就认为后端记录成功
    showRecordPhoneSuccess(value)
  }).catch((e) => {
    console.log(e)
    window.alert('请求出错，请稍后再试')
  })
}
// 点击按钮
$('.tryUseBtn').on('click', function () {
  let btn = this
  let $input = $(btn.parentNode).find('input')
  checkPhone($input)
})
// 回车
$('.phoneInput').keyup(function (e) {
  let key = e.which
  if (key === 13) {
    checkPhone($(this))
  }
})