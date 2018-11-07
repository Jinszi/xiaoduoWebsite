/**
 * Created by lilieming@xiaoduotech.com
 * Date 2018/7/11
 * Time 16:54
 */
import toastr from 'toastr'
import 'toastr/toastr.less'

window.toastr = toastr
const defaultOptions = {
  timeOut: 5000, // 5秒后隐藏
  positionClass: 'toast-top-right',
}
export function showMessage (str = '', type = 'error', options = defaultOptions) {
  toastr.options = options
  toastr[type](str)
}
export function error (str, options) {
  showMessage(str, 'error', options)
}
export function success (str, options) {
  showMessage(str, 'success', options)
}
export function warning (str, options) {
  showMessage(str, 'warning', options)
}
export function info (str, options) {
  showMessage(str, 'info', options)
}
