let all = document.getElementsByTagName('tbody')
let arr = []

function getDoms (dom, className) {
  return dom.getElementsByClassName(className)[0].innerText
}

function getBills() {
  for (let j = 0; j < all.length; j++) {
    let item = all[j]
    if (item.id.includes('tb')) {
      let payment = getDoms(item, 'amount').slice(1).split('\n\n')
      let isDebit = payment[1].split('/')[1] ? true : false

      arr.push({
        time: getDoms(item, 'dealtime'),
        goods: getDoms(item, 'p-name'),
        price: payment[0],
        isDebit: isDebit
      })
    }
  }
}

getBills()

let page = location.search.slice(1).split('&')[2].split('=')[1]
let data = JSON.stringify(arr)

let blob = new Blob([data], {type: 'text/json'})
const a = document.createElement('a')
a.href = window.URL.createObjectURL(blob)
a.download = `${page}.json`
a.click()

console.log(arr)