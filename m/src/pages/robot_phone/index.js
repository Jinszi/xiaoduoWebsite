import $ from 'jquery'
import '../../common/common.js'
import './index.less'
import '../../common/slider'
import { play, pause } from '../../../../src/utils/audioPlay'

$(() => {
  $('.m-collapse').on('click', '.collapse-head', (e) => {
    $(e.currentTarget).parent().toggleClass('active')
  })

  $('.advantage .audioPlayScene').on('click', '.play img', (e) => {
    const $scene = $(e.currentTarget).closest('.audioPlayScene')

    if (!$scene.hasClass('playing')) {
      // 暂停轮播
      $('.advantage .m-component-slider').data('slider').pause()
      $('.audioPlayScene').removeClass('playing')
      $scene.addClass('playing')
      play($scene.find('.play').data('url'))
    } else {
      $('.audioPlayScene').removeClass('playing')
      pause()
      // 重新开始轮播
      $('.advantage .m-component-slider').data('slider').play()
    }
  })


  $('.multiScene .audioPlayScene').on('click', (e) => {
    const $scene = $(e.currentTarget)
    if (!$scene.hasClass('playing')) {
      $('.audioPlayScene').removeClass('playing')
      // 可能需要重新开始轮播
      $('.advantage .m-component-slider').data('slider').play()
      $scene.addClass('playing')
      play($scene.find('.play').data('url'))
    } else {
      $('.audioPlayScene').removeClass('playing')
      pause()
    }
  })
})
