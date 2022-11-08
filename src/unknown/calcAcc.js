const Excel = require("exceljs")
const path = require('path')

let account = path.join(__dirname, 'acc.xlsx')

// console.log('acc', account)

// 获取id

// console.log('accccc', acc._worksheets.length)
// console.log('bccccc', acc._worksheets[5].id)

// for(let i = 0; i < acc._worksheets.length; i++) {
//   if (acc._worksheets[i]) {
//     console.log('每个表', acc._worksheets[i].id)
//   }
// }


async function test() {


  // 读取原表
  const Read = new Excel.Workbook()

  let acc = await Read.xlsx.readFile(account)


  let ws = acc.getWorksheet(5)

  let colCount = ws.getRow(19).values.splice(2, 29)


  let bbb = []


  for (let w = 2; w < 29; w++) {

    let key = ws.getColumn(w).values.splice(8)
    let keu = ws.getColumn(w+1).values.splice(8)
    let val = ws.getColumn(w+2).values.splice(8)

    let arr = []

    // 当前行
    let curCol = []

    for (let i = 0; i < key.length+1; i+=11) {

      // 取每一小段的第二行和最后一行
      let k = key.slice(i+1, i+9)
      let u = keu.slice(i+1, i+9)
      let v = val.slice(i+1, i+9)

      if (k[0]) {
        let obj = {}

        obj.date = typeof k[0] == 'object' ? k[0].result : k[0]
        
        // 先取早中晚餐
        let foods = [
          {key: k[1], val: k[2]},
          {key: u[1], val: u[2]},
          {key: v[1], val: v[2]}
        ]
        
        // 其他开支
        let expenses = []
        let cb = {}
        for (let j = 3; j < k.length; j++) {
          if (k[j]) {
            expenses.push({ key: k[j], val: v[j] })
          }
        }

        obj.bills = foods.concat(expenses)
        
        arr.push({k, u, v})
        curCol.push(obj)
      }
    }
  
    bbb.push(curCol)

  }

  // console.log('bbb', bbb, '\n', JSON.stringify(bbb))

  let fin = []

  // 上面的bills会concat 3遍expenses  所以需要去掉不需要的数据
  for(let q = 0; q < bbb.length; q+=4) {
    fin = fin.concat(bbb[q])
  }

  let passed = fin.filter(item => {
    return item.bills.length > 3
  }).sort((a, b) => { return a.date - b.date } )

  console.log(JSON.stringify(passed))

}

test()

