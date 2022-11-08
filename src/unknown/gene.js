/*
 * @Author: your name
 * @Date: 2021-04-19 09:22:21
 * @LastEditTime: 2021-09-08 15:13:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /api/utils/GeneFile.js
 */
const Excel = require("exceljs");
const path = require('path');
const { Parse } = require('./Parse');

// 读取原表
const Read = new Excel.Workbook();
let columns = [ {header: '规格', key: 'size', width: '7.5'}, {header: '数量', key: 'num', width: '5.2'} ]
let originalSize = []; let originalNum = []; let result = [];
let ROWS = 44

let Write = new Excel.Workbook();
let sheet = Write.addWorksheet('new')

function generator (initial, modified) {

  // 文件路径，传值
  // let originalFile = path.join(__dirname, '../public/uploads/', initial + '.xlsx')
  let originalFile = path.join(__dirname, './', '1' + '.xlsx')

  Read.xlsx.readFile(originalFile).then(() => {
    let original = Read.getWorksheet(1)

    let k = 0;
    for (let i = 1; i < original.columnCount + 1; i++) {
      if( i % 2 == 1 ) k = i
      // 读取i列.获得其值.去除第一个
      let sheetData = original.getColumn(i).values.splice(1)
      let length = original.getColumn(k).values.splice(1).length
      for(let j = 0; j < length; j++) {
        sheetData[j] = sheetData[j] == undefined ? 0 : sheetData[j]
      }
      i % 2 == 1 ? originalSize.push(sheetData) : originalNum.push(sheetData)
    }

    let len = originalSize.join().split(',').length
    
    for (let i = 0; i < len; i++) {
      result.push({ 
        size: Parse(originalSize.join().split(',')[i]),
        num: Number(originalNum.join().split(',')[i])
      })
    }

    for ( let i = 0; i < 10; i++) {
      for ( let k = 0; k < result.length; k++) {
        if ( result[k].num == 0 ) { result.splice(k, 1) }
      }
    }

    // 还有一个将数据存至数据库的操作
    return [result, modified]

  }).then((res)=>{
    // console.log(res)
    let arr = res[0]
    let fir = arr.slice(0, ROWS)
    let LENGTH = Math.ceil(arr.length / ROWS)

    // 数据换行
    for(let i = 0; i < ROWS; i++) {
      for(let k = 1; k < LENGTH + 1; k++) {
        let key = k * ROWS + i
        let Size = 'size'+String(k)
        let Num = 'num'+String(k)
        
        if(arr[key] !== undefined) {
          fir[i][Size] = arr[key].size
          fir[i][Num] = arr[key].num
        }
      }
    }
    
    // 获得表头
    for( let k = 1; k < LENGTH; k++) {
      columns.push({header: '规格', key: String(`size${k}`), width: '7.5'})
      columns.push({header: '数量', key: String(`num${k}`), width: '5.2'})
    }
    
    sheet.columns = columns
    sheet.addRows(fir)

    let doc = path.join(__dirname, './') + res[1] + '.xlsx'
    console.log('res', res)
    // Write.xlsx.writeFile(doc)
  })
}


generator()
// module.exports = { generator }
