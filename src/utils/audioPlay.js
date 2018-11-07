/**
 * Created by lilieming@xiaoduotech.com
 * Date 2018/7/12
 * Time 11:44
 */

let curAudio = null

export function pause () {
  if (!curAudio) return
  const result = curAudio.pause()
  if (result && result.catch) result.catch((e) => { console.warn(e) })
}
export function play (url) {
  if (!url) return
  if (curAudio) pause()
  curAudio = new Audio(url)
  const result = curAudio.play()
  if (result && result.catch) result.catch((e) => { console.warn(e) })
}
