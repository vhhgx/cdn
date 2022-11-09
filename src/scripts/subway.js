// 北京地铁 每月花费
function subwayAmount(price, days) {
  let normalCount = Math.ceil(100 / price)
  let twentyCount = Math.ceil(50 / (price * 0.8))
  let remainingCount = days * 2 - normalCount - twentyCount
  let halfAmount = remainingCount * price * 0.5

  let amount = ( normalCount + twentyCount * 0.8 + remainingCount * 0.5 ) * price
  return amount.toFixed(2)
}