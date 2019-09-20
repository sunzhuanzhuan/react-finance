export const calcBytes = (str) => {
	let bytesCount = 0;
	for (var i = 0; i < str.length; i++) {
		var c = str.charAt(i);
		var reg = /^[^\u4e00-\u9fa5]$/;
		if (reg.test(c)) //匹配双字节
		{
			bytesCount += 1;
		}
		else {
			bytesCount += 2;
		}
	}
	return bytesCount;
}
