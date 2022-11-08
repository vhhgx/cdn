const router = require('./src/router/index')
const md5 = require('md5-node')
const axios = require('axios')

// let routes = router


// let q=
let from = 'en'
let to = 'zh'
let appid='20220810001301217'
let salt='vhhgseltos'
let keys = 'o8aiGTU87LBaVzIKCDmv'

let url = 'http://api.fanyi.baidu.com/api/trans/vip/translate'

let paths = router.map(item => {
  let path = item.path.replace('/', '')
  // return item.path
  if(path.includes('ec')) {
    path.replace('ec', '')
  }

  console.log('path', path)

  let sign = md5(`${appid}${path}${salt}${keys}`)

  let reqUrl = `${url}?q=${path}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`

  // axios.get(reqUrl).then(res => {
  //   console.log('res', res['trans_result'])
  // })
})

// for(let i = 1; i < router.length - 1; i++) {

// }

