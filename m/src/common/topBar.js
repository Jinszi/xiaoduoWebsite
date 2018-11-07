/**
 * Created by lilieming@xiaoduotech.com
 * Date 2018/3/7
 * Time 15:05
 */

import $ from 'jquery'
import store from 'store'
import * as utils from '../../../src/utils/index.js'

import './topBar.less'


$(() => {
  const $container = $('.m-topBar')
  $container.find('.language .popOverMenu a').on('click', (e) => {
    let $a = $(e.target)
    let language = $a.data('language')
    store.set('userChoosedLanguage', language)
  })

  const languagePageMap = {
    zh_cn: 'index.html',
    zh_tw: 'index_zh_tw.html',
    en_us: 'index_en_us.html',
  }
  // url中的参数language可控制语言
  let urlQuerys = utils.getUrlQuerys(window.location.href)
  if (urlQuerys && urlQuerys.language) {
    let lang = urlQuerys.language.toLowerCase()
    if (languagePageMap[lang]) store.set('userChoosedLanguage', lang)
  }
  // 记住上一次的语言环境
  const language = store.get('userChoosedLanguage') || 'zh_cn'

  let page = languagePageMap[language]
  let curPage = window.location.pathname.split('/').slice(-1)[0] || 'index.html'
  // 当前只对首页应用跳转规则
  if (/index[a-z_]*.html/.test(curPage) && curPage !== page) {
    // console.log(page, curPage)
    window.location.href = `./${page}`
  }

  // 点击显示语言选择
  $container.find('.language').on('click', (e) => {
    $container.find('.language .popOverMenu').toggleClass('hide')
    e.stopPropagation()
  })
  $(window).on('click', () => {
    $container.find('.language .popOverMenu').addClass('hide')
  })
})

$(() => {
  // 滚动时，修改样式
  function checkScroll () {
    let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop || 0
    if (window.innerHeight < 300 || scrollTop > 50) {
      $('.m-topBar').addClass('onScroll').removeClass('onTop')
    } else {
      $('.m-topBar').removeClass('onScroll').addClass('onTop')
    }
  }
  $(window).on('resize', () => {
    checkScroll()
  })
  $(window).on('scroll', (e) => {
    checkScroll()
  })
  checkScroll()

  // menu菜单展开收缩事件绑定
  function closePopMenu () {
    console.log('close')
    $('.m-topBar .menu .popMenuMask').toggleClass('active', false)
    $(window).off('click', closePopMenu)
  }
  $('.m-topBar .menu .menuIcon').on('click', (e) => {
    console.log('show')
    e.stopPropagation()
    $('.m-topBar .menu .popMenuMask').toggleClass('active', true)
  })
  $('.m-topBar .menu .popMenuMask').on('click', (e) => {
    if (e.target === e.currentTarget) closePopMenu()
  })
  $('.m-topBar .menu .popMenu .head .close').on('click', closePopMenu)
  $('.m-topBar .menu').on('click', (e) => {
    e.stopPropagation()
  })

  // menu产品展开
  $('.head-product .product').click(function() {
    $('.head-product').hasClass('active') ? $('.head-product').removeClass('active') : $('.head-product').addClass('active')
  })
})

// 设置是否显示产品文案或者语言切换
$(() => {
  const indexPages = ['/m/', '/', '/m/index.html', '/m/index_en_us.html', '/m/index_zh_tw.html', '/index.html', '/index_en_us.html', '/index_zh_tw.html']
  if (indexPages.indexOf(window.location.pathname) >= 0) {
    $('.show-product').remove()
  } else {
    $('.m-topBar .language').remove()
  }
})
