/**
 * Created by lilieming@xiaoduotech.com
 * Date 2018/3/6
 * Time 10:25
 */
import $ from 'jquery'
import store from 'store'
import './topBar.less'
import * as utils from '../../utils/index.js'

$(() => {
  const $container = $('.m-topBar')
  $container.find('.language .popOverMenu a').on('click', (e) => {
    let $a = $(e.target)
    let language = $a.data('language')
    store.set('userChoosedLanguage', language)
  })

  $container.find('.navList .productItem').on('mouseenter', () => {
    $container.addClass('onHoverProduct')
  })
  $container.find('.navList .productItem').on('mouseleave', () => {
    $container.removeClass('onHoverProduct')
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
    window.location.href = './' + page
  }
})
