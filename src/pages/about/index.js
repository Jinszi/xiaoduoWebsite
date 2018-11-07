import $ from 'jquery'

import '../../common/common.js'
import './index.less'

// 对于顶栏开始全透明， 滚动开始后设置透明度
const $topBar = $('.m-topBar')
function onScroll () {
  const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop || 0
  $topBar.toggleClass('top', scrollTop <= 10)
}
onScroll()
$(document).on('scroll', onScroll)
