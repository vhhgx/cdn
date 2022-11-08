const Excel = require("exceljs");
const path = require('path');
// const { Parse } = require('./Parse');

let originalFile = path.join(__dirname, './', '111111' + '.xlsx')

const Read = new Excel.Workbook();

// let originalFile = path.join(__dirname, './', '1' + '.xlsx')

Read.xlsx.readFile(originalFile).then(() => {
  let original = Read.getWorksheet(1)

  let k = 0;

  // console.log(original.getColumn('A').values)
  for (let i = 1; i < original.columnCount + 1; i++) {
    let sheetData = original.getColumn(i).values.splice(1)
    
    console.log(sheetData)
    // if( i % 2 == 1 ) k = i
    // // 读取i列.获得其值.去除第一个
    // let sheetData = original.getColumn(i).values.splice(1)
    // let length = original.getColumn(k).values.splice(1).length
    // for(let j = 0; j < length; j++) {
    //   sheetData[j] = sheetData[j] == undefined ? 0 : sheetData[j]
    // }
    // i % 2 == 1 ? originalSize.push(sheetData) : originalNum.push(sheetData)
  }

  // let len = originalSize.join().split(',').length
  
  // for (let i = 0; i < len; i++) {
  //   result.push({ 
  //     size: Parse(originalSize.join().split(',')[i]),
  //     num: Number(originalNum.join().split(',')[i])
  //   })
  // }

  // for ( let i = 0; i < 10; i++) {
  //   for ( let k = 0; k < result.length; k++) {
  //     if ( result[k].num == 0 ) { result.splice(k, 1) }
  //   }
  // }
})


