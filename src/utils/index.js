
export function getBrowser () {
  let UserAgent = window.navigator.userAgent.toLowerCase()

  let browsers = {
    se360: /360se/.test(UserAgent), // 360浏览器
    Baidu: /bidubrowser/.test(UserAgent), // 百度浏览器
    Sougou: /metasr/.test(UserAgent), // 搜狗浏览器
    LieBao: /lbbrowser/.test(UserAgent), // 猎豹浏览器
    WeiXin: /micromessenger/.test(UserAgent), // 微信内置浏览器
    QQ: /qqbrowser/.test(UserAgent), // QQ浏览器
    Uc: /ucweb/.test(UserAgent), // UC浏览器
    Safari: /safari/.test(UserAgent) && !/chrome/.test(UserAgent), // safire浏览器
    Chrome: /chrome/.test(UserAgent), // Chrome浏览器
    Firefox: /firefox/.test(UserAgent), // 火狐浏览器
    Opera: /opera/.test(UserAgent), // Opera浏览器
    IE6: /msie 6.0/.test(UserAgent), // IE6
    IE7: /msie 7.0/.test(UserAgent), // IE7
    IE8: /msie 8.0/.test(UserAgent), // IE8
    IE9: /msie 9.0/.test(UserAgent), // IE9
    IE10: /msie 10.0/.test(UserAgent), // IE10
    IE11: /msie 11.0/.test(UserAgent), // IE11
    IE: /trident/.test(UserAgent), // ie 系列浏览器
  }
  for (let p in browsers) {
    if (browsers[p]) {
      return p
    }
  }
  return '未知浏览器'
}
export function getOs () {
  let UserAgent = window.navigator.userAgent.toLowerCase()
  let OS = {
    Ipad: /ipad/.test(UserAgent),
    Iphone: /iphone os/.test(UserAgent),
    Android: /android/.test(UserAgent),
    WindowsCe: /windows ce/.test(UserAgent),
    WindowsMobile: /windows mobile/.test(UserAgent),
    Win2K: /windows nt 5.0/.test(UserAgent),
    XP: /windows nt 5.1/.test(UserAgent),
    Vista: /windows nt 6.0/.test(UserAgent),
    Win7: /windows nt 6.1/.test(UserAgent),
    Win8: /windows nt 6.2/.test(UserAgent),
    Win81: /windows nt 6.3/.test(UserAgent),
    Windows: /windows/.test(UserAgent),
  }
  for (let p in OS) {
    if (OS[p]) {
      return p
    }
  }
  return '未知平台'
}
export function isMobile () {
  return window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
}
export function removeObjEmptyField (obj) {
  for (let key in obj) {
    let value = obj[key]
    if (value === '' || value === undefined || value === null) {
      delete obj[key]
    }
  }
  return obj
}
// 遍历所有后代元素，包括文本
export function traverseDomAllDecendants (dom, cb, filter) {
  if (!filter(dom)) return
  cb(dom)
  let childNodes = dom.childNodes
  childNodes = Array.prototype.slice.call(childNodes)
  if (!childNodes.length) return
  for (let child of childNodes) {
    traverseDomAllDecendants(child, cb, filter)
  }
}
export function replaceTextNode (textNode, elem) {
  let parent = textNode.parentNode
  let next = textNode.nextSibling
  parent.removeChild(textNode)
  if (next && next.nodeType === 1) {
    parent.insertBefore(next, elem)
  } else {
    parent.appendChild(elem)
  }
}
export function getUrlQuerys (url) {
  url = url !== undefined ? url : window.location.href
  if (url.indexOf('?') !== -1) {
    url = url.split('?')[1]
  }
  let arrs = url.split('&')
  let result = {}
  for (let i = 0; i < arrs.length; i++) {
    let items = arrs[i].split('=')
    result[items[0]] = decodeURIComponent((items[1]))
  }
  return result
}
export function paramToUrlSearch (param) {
  let result = []
  for (let key in param) {
    let value = param[key]
    if (value === null || value === undefined) continue
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    result.push(`${key}=${encodeURIComponent(value)}`)
  }
  return result.join('&')
}
export function getUrlQuery (url, name) {
  return getUrlQuerys(url)[name]
}
export function addCssText (cssText) {
  let style = document.createElement('style')  // 创建一个style元素
  let head = document.head || document.getElementsByTagName('head')[0] // 获取head元素
  style.type = 'text/css' // 这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
  if (style.styleSheet) { // IE
    let func = function () {
      try { // 防止IE中stylesheet数量超过限制而发生错误
        style.styleSheet.cssText = cssText
      } catch (e) {

      }
    }
    // 如果当前styleSheet还不能用，则放到异步中则行
    if (style.styleSheet.disabled) {
      setTimeout(func, 10)
    } else {
      func()
    }
  } else { // w3c
    // w3c浏览器中只要创建文本节点插入到style元素中就行了
    let textNode = document.createTextNode(cssText)
    style.appendChild(textNode)
  }
  head.appendChild(style) // 把创建的style元素插入到head中
}
export function array2map (arr = [], key = 'id') {
  let res = {}
  arr.forEach((item) => {
    res[item[key]] = item
  })
  return res
}

export const throttle = function (func, wait, options) {
  let context,
      args,
      result
  let timeout = null
  let previous = 0
  if (!options) options = {}
  let later = function () {
    previous = options.leading === false ? 0 : Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }
  return function () {
    let now = Date.now()
    if (!previous && options.leading === false) previous = now
    // 计算剩余时间
    let remaining = wait - (now - previous)
    context = this
    args = arguments
    // 当到达wait指定的时间间隔，则调用func函数
    // 精彩之处：按理来说remaining <= 0已经足够证明已经到达wait的时间间隔，但这里还考虑到假如客户端修改了系统时间则马上执行func函数。
    if (remaining <= 0 || remaining > wait) {
      // 由于setTimeout存在最小时间精度问题，因此会存在到达wait的时间间隔，但之前设置的setTimeout操作还没被执行，因此为保险起见，这里先清理setTimeout操作
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      // options.trailing=true时，延时执行func函数
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}

export const defaultSetting = {
  themeColor: '#00c3cc', // 主题色
  entryButtonSetting: {
    mode: 'preset', // preset 预设按钮 custom 自定义按钮
    presetMode: 1, // 1,2,3 预设按钮三种样式
    presetAvatar: 'https://cvd-10054209.file.myqcloud.com/face/face_f4c9b61b9f17ccdd.png', // 客服头像图片地址
    customImage: 'https://cvd-10054209.file.myqcloud.com/face/face_f4c9b61b9f17ccdd.png', // 自定义按钮图片地址
  },
  windowMode: 1, // 1为标准窗口680*520 px、 2为小型窗口340*480
  topBarTip: '', // 顶栏辅助文字，为空时展示渠道名
  sendBtnTxt: '', // 发送按钮文本，为空时 发送
  inputPlaceholder: '', // 输入框placeholder, 为空时 请输入...
  rightBarMode: 1, // 右边栏展示模式 1为显示企业信息， 2为iframe显示自定义页面
  rightBarIframeUrl: 'http://www.baidu.com', // 右边栏自定义页面地址
  rightBarIframeWidth: 400, // 右边栏自定义页面显示宽度
  position: {
    right: 60, // 入口按钮和聊天窗口右边距
    entryButtonBottom: 100, // 入口按钮下边距
    windowBottom: 0, // 聊天窗口下边距
  },
  lenovo: false,  // 联想
}
/* 判断是否是天虎云商的环境 */
export function isTypo () {
  return window.__CVD_IS_TYPO || window.location.host.indexOf('cvd-typo.') === 0
}
// 检查适配格式是否能播放
export function checkIfVideoTypeCanPlay (type) {
  if (type.indexOf('.') === 0) type = type.slice(1)
  let result = false
  let elem = document.createElement('video')
  if (type === 'ogg') {
    result = elem.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, '')
  } else if (type === 'mp4') {
    result = elem.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, '')
  } else if (type === 'webm') {
    elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, '') || elem.canPlayType('video/webm; codecs="vp9"').replace(/^no$/, '')
  }

  return !!result
}

export function exitFullscreen () {
  let exitArr = ['exitFullscreen', 'webkitExitFullscreen', 'mozCancelFullScreen', 'msExitFullscreen']
  for (let name of exitArr) {
    if (document[name]) {
      document[name]()
      break
    }
  }
}
export function hasClass (elements, cName) {
  if (!elements || !cName) return false
  return !!elements.className.match(new RegExp(`(\\s|^)${cName}(\\s|$)`))
}
export function addClass (elements, cName) {
  if (!elements || !cName) return false
  if (!hasClass(elements, cName)) {
    elements.className += ` ${cName}`
  }
}
export function removeClass (elements, cName) {
  if (!elements || !cName) return false
  if (hasClass(elements, cName)) {
    elements.className = elements.className.replace(new RegExp(`(\\s|^)${cName}(\\s|$)`), ' ')
  }
}
