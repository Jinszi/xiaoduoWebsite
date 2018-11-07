import $ from 'jquery'
import '../index/common.js'
import '../index/index.less'
import '../expert_service/index.less'
import '../index/index.js'
import './index.less'
import '../../utils/canvasBg'

$(document).ready(() => {
  // 干不动了
  // particleground($('.robot-phone-ability').eq(0)[0])
  $('.robot-phone-ability').particleground({
    dotColor: '#eee',
    lineColor: '#eee',
  })

  let audioSrc = ['', '', require('../../../assets/audio/robot_phone_finance.wav'), '', '', '', '']
  let audio

  $('.robot-voice-play').click(function () {
    const index = $('.robot-voice-play').index(this)
    if (audioSrc[index] == '') {
      return
    }
    if ($(this).hasClass('playing')) {
      audio.pause()
      $(this).removeClass('playing')
      $(this)
        .siblings('.robot-voice-playing')
        .hide()
    } else {
      if ($('.robot-voice-play.playing').length > 0) {
        audio.pause()
        $('.robot-voice-play.playing')
          .siblings('.robot-voice-playing')
          .hide()
        $('.robot-voice-play.playing').removeClass('playing')
      }
      audio = new Audio(audioSrc[index])
      audio.play()
      $(this).addClass('playing')
      $(this)
        .siblings('.robot-voice-playing')
        .show()
    }
  })
})
