import $ from 'jquery'
import _ from 'underscore'
import '../../utils/jquery.XDomainRequest.js'
import '../../utils/jquery.waypoints.js'
import '../../utils/jquery.counterup.js'
import '../../common/common.js'
import './index.less'


$(() => {
  // 首屏箭头，点击切换到第二屏
  $('.scrollScreenBtn ').on('click', () => {
    let scrollTop = document.documentElement.getBoundingClientRect().height - $('.m-topBar').height()
    console.log('click', 'scrollTop')
    $(document.documentElement).animate({ scrollTop }, 300)
    $(document.body).animate({ scrollTop }, 300)
  })

  const $sectionOne = $('.section-one')
  let shouldCheckScroll = true
  function onScroll () {
    if (!shouldCheckScroll) return
    const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop || 0
    if (scrollTop > 50) {
      // 滚动时，隐藏首屏箭头
      $('.scrollScreenBtn ').addClass('hide')
    } else {
      $('.scrollScreenBtn ').removeClass('hide')
    }

    // 首屏滚动背景和内容视差动画
    // 内容渐隐
    /* const firstScreenHeight = window.innerHeight
    const bgRatio = 0.5
    const contentRatio = 1.2
    const scrollProgress = scrollTop / firstScreenHeight
    const $bgContainer = $sectionOne.find('.bgContainer')
    const $content = $sectionOne.find('.content')
    $bgContainer.animate({
      top: bgRatio * scrollTop,
    }, 10)
    $content.animate({
      top: contentRatio * scrollTop,
      opacity: 1 - scrollProgress * contentRatio * 0.8,
    }, 10)*/
  }
   let blurBackScrollTop = 0
  // 输入时，禁止时差动画
  // 输入完成后，定位回滚动位置
  // 针对ios safari
  if (window.navigator.userAgent.indexOf('Android ') === -1 ) {
    $('input').on('focus', () => {
      // alert(window.navigator.userAgent)
      // shouldCheckScroll = false
      blurBackScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop || 0
    }).on('blur', () => {
      // shouldCheckScroll = true
      document.body.scrollTop = document.documentElement.scrollTop = blurBackScrollTop
    })
  }
  onScroll()
  $(document).on('scroll', _.throttle(onScroll, 10))

  let $sectionTwo = $('.section-two')
  $sectionTwo.find('.expandBtn').on('click', (e) => {
    e.stopPropagation()
    let $btn = $(e.currentTarget)
    let shouldExpand = !$btn.hasClass('expandActive')
    $btn.toggleClass('expandActive', shouldExpand)
    $sectionTwo.find('.logosContainer').toggleClass('expandActive', shouldExpand)
    if ($btn[0].scrollIntoViewIfNeeded) {
      $btn[0].scrollIntoViewIfNeeded()
    }
  })
  $('.image-btn-radio-1').find('.btns .btn').on('click', (e) => {
    e.stopPropagation()
    let $btn = $(e.currentTarget)
    if ($btn.hasClass('active')) return
    if ($btn.hasClass('btn2')) {
      $btn.addClass('active')
      $('.image-btn-radio-1 .btns .btn1').removeClass('active')
      $('.image-btn-radio-1 .images .image2').css({ transition: 'all ease 1s', transform: 'translateX(0)' })
      $('.image-btn-radio-1 .images .image1').css({ transition: 'all ease 1s', transform: 'translateX(-100%)' })
    } else {
      $btn.addClass('active')
      $('.image-btn-radio-1 .btns .btn2').removeClass('active')
      $('.image-btn-radio-1 .images .image1').css({ transition: 'all ease 1s', transform: 'translateX(0)' })
      $('.image-btn-radio-1 .images .image2').css({ transition: 'all ease 1s', transform: 'translateX(100%)' })
    }
  })

  let $collapsedModule = $('.collapsedModule')
  $collapsedModule.find('.collapseHead').on('click', (e) => {
    e.stopPropagation()
    $collapsedModule.find('>li.active').removeClass('active')
    let $head = $(e.currentTarget)
    let $li = $head.closest('li')
    $li.addClass('active')
    // 滚动
    setTimeout(() => {
      let scrollTop = $li.offset().top - ($('.m-topBar').height() || 0)
      $(document.documentElement).animate({ scrollTop }, 300)
      $(document.body).animate({ scrollTop }, 300)
    }, 20)
    let $toDetail = $li.find('.collapseContent .toDetail a')
    // if ($toDetail[0] && $toDetail[0].scrollIntoViewIfNeeded) $toDetail[0].scrollIntoViewIfNeeded()
  })
  $collapsedModule.find('.collapseMinusBtn').on('click', (e) => {
    e.stopPropagation()
    let $btn = $(e.currentTarget)
    let $li = $btn.closest('li')
    $li.removeClass('active')
  })


  // counterUp 效果
  let setCounterUp = false
  const getCount = function () {
    $.ajax({
      url: '//kdb.xiaoduoai.com/stat-api/log-count.php',
      crossDomain: true,
      type: 'GET',
      contentType: 'application/json',
      dataType: 'json',
      success (data) {
        let totalCount = (data && data.count) || 200000000
        let count = totalCount.toString()
        while (/(\d+)(\d{3})/.test(count)) {
          count = count.replace(/(\d+)(\d{3})/, '$1' + ',' + '$2')
        }
        $('.messageTotalCount').text(count)

        if (!setCounterUp) {
          setCounterUp = true
          $('.countNum').counterUp({
            delay: 10,
            time: 1000,
            context: window,
          })
        }
      },
    })
  }
  $(() => {
    getCount()
    const INTERVAL = 1.5 * 1000
    setInterval(getCount, INTERVAL)
  })
})



