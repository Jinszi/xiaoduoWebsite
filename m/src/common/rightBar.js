/**
 * Created by lilieming@xiaoduotech.com
 * Date 2018/3/6
 * Time 10:26
 */

import $ from 'jquery'
import store from 'store'
import * as message from '../../../src/common/message'

import './rightBar.less'

window.$ = $

function onTouchMove (e) {
  e.preventDefault()
}
function disableScroll () {
  $('.m-tryUseModal').on('touchmove', onTouchMove)
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  console.log(scrollTop)
  $('.m-tryUseModal')[0].style.top = `${scrollTop}px`
}
function enableScroll () {
  $('.m-tryUseModal').off('touchmove', onTouchMove)
}
$(() => {
  // 点击在线咨询
  $('.m-rightBar .onlineChat').on('click', (e) => {
    e.stopPropagation()
    if (window.CVD_SDK) {
      window.CVD_SDK.openWindow()
    }
  })

  // 滚动时，修改预约试用的样式
  function checkScroll () {
    let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop || 0
    if (scrollTop > 50) {
      $('.m-rightBar .tryUse').addClass('onScroll')
      $('.m-rightBar .toTopBtn').removeClass('hide')
    } else {
      $('.m-rightBar .tryUse').removeClass('onScroll')
      $('.m-rightBar .toTopBtn').addClass('hide')
    }
  }
  $(window).on('scroll', (e) => {
    checkScroll()
  })
  checkScroll()

  // 给回到顶部按钮添加点击事件
  $('.m-rightBar .toTopBtn').on('click', (e) => {
    e.stopPropagation()
    const scrollTop = 0
    $(document.documentElement).animate({ scrollTop }, 300, checkScroll)
    $(document.body).animate({ scrollTop }, 300, checkScroll)
  })

  // 点击预约试用
  let $contentBox = $('.m-tryUseModal .contentBox')
  let $contentBoxResult = $('.m-tryUseModal .contentBox1')
  $('.openTryUsePhoneInputModal').on('click', (e) => {
    e.stopPropagation()
    $('.m-tryUseModal').removeClass('hide')
    $contentBox.removeClass('hide')
    $contentBoxResult.addClass('hide')
    disableScroll()
  })

  $contentBox.find('.cancel').on('click', () => {
    $('.m-tryUseModal').addClass('hide')
    enableScroll()
  })
  $contentBox.find('.ok').on('click', () => {
    checkPhone($('.phoneInput_33'))
  })
  $contentBoxResult.find('.cancel').on('click', () => {
    $('.m-tryUseModal').addClass('hide')
    enableScroll()
  })
  $contentBoxResult.find('.freeUseToRegisterLink').on('click', () => {
    window.location.href = `https://cvd.xiaoduoai.com/passport/register?phone=${$('.freeUseToRegisterLink').data('phone')}&language=${store.get('userChoosedLanguage') || 'zh_cn'}`
  })
  // 输入电话号码点击立即试用
  function showRecordPhoneSuccess (phone) {
    $('.m-tryUseModal').removeClass('hide')
    $contentBox.addClass('hide')
    $contentBoxResult.removeClass('hide').find('.freeUseToRegisterLink').data('phone', phone)
    disableScroll()
  }
  $('.phone-set-success-modal-close-icon').on('click', () => {
    $('.m-modal-phone-set-success').toggleClass('hide', true)
  })
  // 验证电话号码，发送请求
  function checkPhone ($input) {
    let value = $input.val()
    if (value.trim() === '') return
    // 英文版不做电话号码校验
    if (window.location.pathname.indexOf('/index_en_us.html') === -1) {
      let phoneReg = /(^((\d{11})|(\d{7,8})|(\d{4}|\d{3})-(\d{7,8}))$)/
      if (!phoneReg.test(value)) return message.error('电话号码格式输入有误', { positionClass: 'toast-bottom-full-width' })
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
      message.error('请求出错，请稍后再试', { positionClass: 'toast-bottom-full-width' })
    })
  }
  // 页面上可以有其它入口，输入电话号码后，检查电话号码，发送请求，显示结果
  window.checkPhone = checkPhone

  $('.m-tryUse').on('click', '.tryUseBtn', (e) => {
    let $input = $(e.currentTarget).closest('.m-tryUse').find('input')
    checkPhone($input)
  })
})
