import numeral from 'numeral'
let numeralExpand = numeral
numeralExpand.register('format', 'tenThousand', {
	regexps: {
		format: /[wy]/,
		unformat: /[wy]/
	},
	// (个|十|百|千|万|十万|百万|千万|亿)
	format: function (value, format, roundingFunction) {

		if (value < 0) {
			return 0
		}
		let output, reg = /^(\d+)([kmbt]?)/;

		let isW = numeralExpand._.includes(format, 'w')
		let isY = numeralExpand._.includes(format, 'y')
		format = format.replace(/\s?[wy]/, '');

		// output = numeralExpand._.numberToFormat(value, format, roundingFunction);


		// let [, val, unit] = reg.exec(output)
		// if (isW) {
		// 	switch (unit) {
		// 		case 'k':
		// 			if (Math.abs(val / 10) >= 1) {
		// 				val = val / 10
		// 				unit = '万'
		// 			} else {
		// 				val = value
		// 				unit = ''
		// 			}
		// 			break;
		// 		case 'm':
		// 			val = numeralExpand._.numberToFormat(val * 100, '0,0', roundingFunction)
		// 			unit = '万'
		// 			break;
		// 		case 'b':
		// 			val = numeralExpand._.numberToFormat(val * 100000, '0,0', roundingFunction)
		// 			unit = '万'
		// 			break;
		// 	}
		// } else if (isY) {
		// 	switch (unit) {
		// 		case 'k':
		// 			val = val / 10
		// 			unit = '万'
		// 			break;
		// 		case 'm':
		// 			val = val / 10
		// 			unit = '亿'
		// 			break;
		// 		case 'b':
		// 			val = val / 10
		// 			unit = '兆'
		// 			break;
		// 	}
		// }
		let unit = ""
		let valueTransform = value || 0

		if (value > 10000) {
			unit = "万"
			valueTransform = value / 10000
		}
		if (value > 10000 * 10000) {
			unit = "亿"
			valueTransform = value / (10000 * 10000)
		}
		valueTransform = valueTransform.toFixed((valueTransform < 10 && unit == "万") ? 1 : 0).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
		if ((valueTransform.split(".")[1]) == 0) {
			valueTransform = valueTransform.split(".")[0]
		}
		return valueTransform + unit
	},
	unformat: function (string) {
		return numeralExpand._.stringToNumber(string);
	}
});
numeralExpand.nullFormat('-');
export default numeralExpand
