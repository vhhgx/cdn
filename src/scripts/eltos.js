let utils = {
	// 返回数组中每个元素出现的次数
	countItem: (array) => {
		return array.reduce((pre, next) => {
			pre[next] ? pre[next]++ : (pre[next] = 1)
			return pre
		}, {})
	},

	// 返回数组出现次数最多的元素
	frequentChar: (str) => {
		let counter = {}
		str.split('').map(item => {		
			counter[item] ? counter[item]++ : counter[item] = 1
		})
		
		let descending = Object.entries(counter).sort((a, b) => { return b[1] - a[1]})
		// 返回数组第一个元素的第一个子元素
		return descending[0][0]
	}

	// 返回元素是否在数组内
	includes: (array, item) => {
		let ins = Array.prototype.includes
		return ins.call(array, item)
	},

	// 将对象转换为url参数
	spliceParam: (obj) => {
		const key = Object.keys(obj)
		const val = Object.values(obj)
		let str = ''

		for(let i = 0; i < key.length; i++) {
			str += key[i]+'='+val[i]+'&'
		}
		return '?' + str.slice(0, -1)
	},

	// 解析url参数
	getUrlParams: (url) => {
		let reg = /([^?&=]+)=([^?&=]+)/g
		let obj = { }
		url.replace(reg, function(){
			obj[arguments[1]] = arguments[2]
		})
		return obj
	},

	// 将对象添加至formdata
	addToFormData: (obj) => {
		let formdata = new FormData()
		for( let i = 0; i < Object.values(obj).length; i++) {
			formdata.append(Object.keys(obj)[i], Object.values(obj)[i])
		}
		return formdata
	},

	// 数组扁平化
	snc (children) {
		for (let i = 0; i < children.length; i++) {
			if (Array.isArray(children[i])) {
				return Array.prototype.concat.apply([], children)
			}
		}
		return children
	}
}

exports = utils
