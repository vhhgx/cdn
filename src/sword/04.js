let matrix = [
  [1, 4, 7, 11, 15],
  [2, 5, 8, 12, 19],
  [3, 6, 9, 16, 22],
  [10, 13, 14, 26, 24],
  [18, 21, 23, 17, 30],
]

let target = 17

/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
 var findNumberIn2DArray = function(matrix, target) {
  let maxCol = matrix[0].length - 1
  let maxRow = matrix.length - 1

  let [row, col] = [maxRow, 0]

  while(row >= 0 && col <= maxCol) {
    console.log('当前坐标', matrix[row][col])
    if (target > matrix[row][col]) {
      console.log('当前col', String(col))
      col++
      console.log('自增后col', String(col))
    } else if (target < matrix[row][col]) {
      console.log('当前row', String(row))
      row--
      console.log('自减后row', String(row))
    } else {
      console.log('找到了')
      return true
    }
  }
  console.log('没找到')
  return false
}

findNumberIn2DArray(matrix, target)
