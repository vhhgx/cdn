let keys = ['id', 'miao', 'shi', 'emperorName', 'hao',  'ascend', 'relation', 'mausoleum']

function getData(keys, isDown, filename) {
  isDown = isDown || false
  let table = document.getElementsByTagName('table')[0]
  let tr = table.getElementsByTagName("tr")

  let arr = []
  
  for(let i = 0; i < tr.length; i++) {
    let td = tr[i].getElementsByTagName('td')
    let tda = Array.from(td)

    let emper = {}
    for (let j = 0; j < tda.length; j++) {
      if(keys[j] == 'ascend') {
        emper['ascendYear'] = tda[j].innerText.split('—')[0] || tda[j].innerText.split('-')[0]
        emper['abdicateYear'] = tda[j].innerText.split('—')[1] || tda[j].innerText.split('-')[1]
      } else {
        emper[keys[j]] = tda[j].innerText
      }
    }
    arr.push(emper)
  }

  console.log(arr)

  if(isDown) {
    let data = JSON.stringify(arr)

    let blob = new Blob([data], {type: 'text/json'})
    const a = document.createElement('a')
    a.href = window.URL.createObjectURL(blob)
    a.download = `${filename}.json`
    a.click()
  }
}
