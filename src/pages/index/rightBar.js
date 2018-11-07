/**
 * Created by lilieming@xiaoduotech.com
 * Date 2018/3/6
 * Time 10:26
 */

import $ from 'jquery'
import _ from 'underscore'
import store from 'store'
import './rightBar.less'
import * as message from '../../common/message'

window.$ = $

$(() => {
  // 点击在线咨询
  $('.m-rightBar .onlineChat').on('click', () => {
    if (window.CVD_SDK) {
      window.CVD_SDK.openWindow()
    }
  })


  // 滚动时，修改预约试用的样式
  function checkScroll () {

    const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop || 0
    // console.log('scroll', scrollTop)
    if (scrollTop > 50) {
      $('.m-rightBar .m-right-tryUse').addClass('onScroll')
      $('.m-rightBar .toTopBtn').removeClass('hide')
    } else {
      $('.m-rightBar .m-right-tryUse').removeClass('onScroll')
      $('.m-rightBar .toTopBtn').addClass('hide')
    }
  }
  $(window).on('scroll', _.throttle(checkScroll, 50))
  checkScroll()

  // 给回到顶部按钮添加点击事件
  $('.m-rightBar .toTopBtn').on('click', () => {
    const scrollTop = 0
    $(document.documentElement).animate({ scrollTop }, 300, checkScroll)
    $(document.body).animate({ scrollTop }, 300, checkScroll)
  })


// 电话预约试用

  $(() => {

    // 输入电话号码后，点击立即免费试用
    $('.tryUsePhoneInputModal .try-use-btn').click(() => {
      checkPhone($('.tryUsePhoneInputModal .try-use-input'))
    })
    // 电话号码输入框enter
    $('.phoneInputForTryUse').on('keypress', (e) => {
      if (e.which === 13) {
        checkPhone($(e.target))
      }
    })
    // 点击关闭试用输入电话号码弹窗
    $('.tryUsePhoneInputModal').find('.close').on('click', () => {
      $('.tryUseModalMask').toggleClass('hide', true)
      $('.tryUsePhoneInputModal').toggleClass('hide', true)
    })
    // 点击右边栏免费试用
    $('.openTryUsePhoneInputModal').click(() => {
      $('.tryUseModalMask').toggleClass('hide', false)
      $('.tryUsePhoneInputModal').toggleClass('hide', false)
    })
    // 点击关闭成功提示
    $('.tryUseSuccessModal').find('.close').on('click', () => {
      $('.tryUseModalMask').toggleClass('hide', true)
      $('.tryUseSuccessModal').toggleClass('hide', true)
    })
  })


  // 点击继续完善资料按钮，跳转注册
  $('.tryUseSuccessModal .modal-btn').click(() => {
    window.location.href = `https://cvd.xiaoduoai.com/passport/register?phone=${$('.tryUseSuccessModal .modal-btn').data('phone')}&language=${store.get('userChoosedLanguage') || 'zh_cn'}`
  })
})
// 预约试用成功
function showRecordPhoneSuccess (phone) {
  $('.tryUseModalMask').toggleClass('hide', false)
  $('.tryUseSuccessModal').toggleClass('hide', false).find('.modal-btn').data('phone', phone)
  $('.tryUsePhoneInputModal').toggleClass('hide', true)
}

// 预约试用相关
// 验证电话号码，发送请求
let phoneEmptyErrorTimeoutId
export function checkPhone ($input) {
  let value = $input.val()
  if (value.trim() === ''){
    let $tryUseContainer = $input.eq(0).closest('.tryUse')
    clearTimeout(phoneEmptyErrorTimeoutId)
    $('.tryUse').removeClass('emptyError')
    $('.inputEmptyTip').addClass('hide')
    if ($tryUseContainer && $tryUseContainer.length) {
      $tryUseContainer.addClass('emptyError')
      phoneEmptyErrorTimeoutId = setTimeout(() => {
        $tryUseContainer.removeClass('emptyError')
      }, 2000)
    } else {
      let $emptyElem = $input.eq(0).parent().find('.inputEmptyTip')
      $emptyElem.removeClass('hide')
      phoneEmptyErrorTimeoutId = setTimeout(() => {
        $emptyElem.addClass('hide')
      }, 2000)
    }
    return
  }
  // 英文版不做电话号码校验
  if (window.location.pathname.indexOf('/index_en_us.html') === -1) {
    let phoneReg = /(^((\d{11})|(\d{7,8})|(\d{4}|\d{3})-(\d{7,8}))$)/
    if (!phoneReg.test(value)) return message.error('电话号码格式输入有误', { positionClass: 'toast-top-center' })
  }
  let url = '//cvd.xiaoduoai.com/v1/bi/write_phone'
  if (window.location.host.indexOf('808') !== -1) url = 'http://cvd.xiaoduoai.com/v1/bi/write_phone/error'
  $.get({
    url,
    data: { phone: value },
  }).then((res) => {
    // 不管返回结果，只要后端接收到，就认为后端记录成功
    showRecordPhoneSuccess(value)
    $input.val('')
  }).catch((e) => {
    console.log(e)
    message.error('请求出错，请稍后再试', { positionClass: 'toast-top-center' })
  })
}
