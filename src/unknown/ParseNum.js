/**
 * @param 整数型
 * @retrun 字符串
 * 
 * 先 `toString(10)` 转字符串，然后以 `.` 为分界切割成数组 arr
 * 
 * 若参数类似于 6.25999999999999
 * arr[1]前两位转整数型，+1 后转为字符串
 * 创建新数组 newArr 接收修改后的数字，拼接后输出
 * 
 * 若参数类似于6.54000000000001
 * 取arr[1]前两位
 * 创建新数组 newArr 接收修改后的数字，拼接后输出
 */

let Parse = function Parse (num) {
	let cutByPoint = num.split(".")

	let before = cutByPoint[0]
	let after = cutByPoint[1]

	if (before !== "") {
		if ( after == null ) {
			return (before+".00").toString()
		} else if ( after.length == 1) { 
			return ( before + "." + cutByPoint[1]+"0").toString()
		} else if ( after.length == 2 ) {
			return num
		} else if ( after.length > 3 ) {
			let front = after.slice(0, 2)
			let behind = after.slice(2, -1)

			let nine = /9999999/
			let zero = /0000000/

			if (nine.test(behind)) {
				if (front == "99") {
					return (Number(before)+1).toString(10) + ".00"
				} else if (front.split("")[0] == 0 && front.split("")[1] < 9) {
					return before + ".0" + (Number(front)+1).toString(10)
				} else {
					return before + "." + (Number(front)+1).toString(10)
				}
			} else if (zero.test(behind)) {
				return before + "." + front
			}
		}
	}
}

module.exports = { Parse }
