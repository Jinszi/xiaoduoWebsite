/**
 * Created by lilieming@xiaoduotech.com
 * Date 2018/7/10
 * Time 19:59
 */
import $ from 'jquery'
import './touchslider'
import './slider.less'

/* <div class="m-component-slider">
  <ul class="slider-list">
    <li></li>
    <li></li>
    <li> </li>
  </ul>
</div> */
// 滑动slider包装
export default function initSlider (dom, config = {}) {
  const $container = $(dom)
  const $list = $container.find('.slider-list')
  const $controller = $container.find('.slider-controller')
  let slider
  if ($list && $list.length) {
    slider = new TouchSlider($list[0], {
      duration: 800,
      interval: 3000,
      direction: 0,
      autoplay: true,
      align: 'left',
      mousewheel: false,
      mouse: true,
      fullsize: $container.data('fullsize') || false,
      ...config,
    })
    $container.data('slider', slider)
    if ($controller && $controller.length) {
      let active = 0
      const controllerList = $controller.children('li')
      if (controllerList.length) {
        controllerList.each((index, item) => {
          $(item).on('click', () => {
            slider.slide(index)
            return false
          })
        })
        slider.on('before', (m, n) => {
          $(controllerList[m]).removeClass('active')
          $(controllerList[n]).addClass('active')
          $container.removeClass(`on-index-${m}`).addClass(`on-index-${n}`)
        })
      }
    }
  }
}

// 默认初始化所有的m-component-slider, 并且自动添加controller
$(() => {
  $('.m-component-slider').each((index, dom) => {
    const $container = $(dom)
    const $list = $container.find('.slider-list')
    let $controller = $container.find('.slider-controller')
    if (!$controller.length) {
      $controller = $('<ul class="slider-controller"></ul>')
      let $li = $('<li></li>')
      for (let i = 0; i < $list.children().length; i++) {
        $controller.append($li.clone())
      }
      $controller.children().eq(0).addClass('active')
      $container.append($controller)
    }
    initSlider($container[0])
  })
})
