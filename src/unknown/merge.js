const Excel = require("exceljs");
const path = require('path');

const fin = require('./fin.json')

let Write = new Excel.Workbook();
let sheet = Write.addWorksheet('new')

let columns = []


// for( let k = 0; k < fin.length; k++) {
  columns.push({header: '时间', key: 'time', width: '10'})
  columns.push({header: '商品', key: 'goods', width: '30'})
  columns.push({header: '价格', key: 'price', width: '10'})
  columns.push({header: '是否白条', key: 'isDebit', width: '10'})
// }

sheet.columns = columns
sheet.addRows(fin)

// sheet.addRows(fir)

let doc = path.join(__dirname, './') + 'jds' + '.xlsx'
// console.log('res', res)
Write.xlsx.writeFile(doc)















// // // const one = require('./jd/1.json')

// // // console.log('one', one)

// // let all = []

// // for (let i = 1; i < 9; i++) {
// //   // const element = 8[i];
// //   const arr = require(`./jd/${i}.json`)
// //   all.push(arr)
  
// //   // console.log(i, arr)
// // }

// // // console.log('all', all.flat(), all.flat().length)

// // // all.flat().map(item => {
// // //   console.log(`${item},`)
// // // })


// // console.log(JSON.stringify(all.flat()))

// let arg = process.argv

// // console.log('argv', `${arg.splice(2)[0]}()`)

// let bb = arg.splice(2)

// function help() {
//   console.log('这里是帮助程序')
// }


// if (bb[0] === 'help') {
//   help()
// }

// // eval(`${arg.splice(2)[0]}()`)

// // eval(bb)
// // console.log('', )
// // eval('help()')