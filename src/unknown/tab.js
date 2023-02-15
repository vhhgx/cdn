
let arr = []
let set = new Set()

let obj = {};

let excluds = ['localhost', 'pcitc', 'jira', 'vuejs.org', 'macwk', 'eleme', 'tencent', '238', 'egreatwall', 'ccec']

// 分割并去重
let res = all.split('\n').map(item => {
  set.add(item)
})

let resed = [...set]

// for (let j = 0; j < resed.length; j++) {
//   const element = resed[j];

//   excluds.map(item => {
//     let reg = new RegExp(item)
//     let matc = element.match(reg)

//     if (matc) {
//       let curIdx = resed.findIndex( regs => regs === matc.input)
//       resed.splice(curIdx, 1)
//     }

      
//   })
  
// }

resed.map(item => {
  let matchs = item.match(/https:\/\/.*?\//gi)

  if (matchs) {
    if (obj[matchs]) {
      obj[matchs].push(item)
    } else {
      obj[matchs] = []
    }
  }
})

let newsa = ''

Object.values(obj).flat().map(item => {
  newsa += `${item}\n`
})

console.log(newsa)