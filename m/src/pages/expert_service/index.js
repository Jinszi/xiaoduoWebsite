import $ from 'jquery'
import '../../common/common.js'

import '../../common/touchslider'
import './index.less'

$(() => {
  let t4 = new TouchSlider('slider', {
    duration: 800,
    interval: 3000,
    direction: 0,
    autoplay: true,
    align: 'left',
    mousewheel: false,
    mouse: true,
    fullsize: false,
  })
  let active = 0,
    as = document.getElementById('controller').getElementsByTagName('span')
  for (var i = 0; i < as.length; i++) {
    (function () {
      let j = i
      as[i].onclick = function () {
        t4.slide(j)
        return false
      }
    }())
  }
  t4.on('before', (m, n) => {
    as[m].className = ''
    as[n].className = 'active'
  })
})
$(() => {
  let t5 = new TouchSlider('customer-content', {
    duration: 800,
    interval: 3000,
    direction: 0,
    autoplay: true,
    align: 'left',
    mousewheel: false,
    mouse: true,
    fullsize: true,
  })
  let active = 0,
    as = document
      .getElementById('customer-controller')
      .getElementsByTagName('span')
  for (var i = 0; i < as.length; i++) {
    (function () {
      let j = i
      as[i].onclick = function () {
        t5.slide(j)
        return false
      }
    }())
  }
  t5.on('before', (m, n) => {
    as[m].className = ''
    as[n].className = 'active'
  })
})
