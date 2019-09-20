export const type = (obj) => {
	return Object.prototype.toString.call(obj);
}

export const objectToArray = (obj) => {
	return Object.keys(obj).map((id) => {
		const _obj = type(obj[id]) == '[object Object]' ? obj[id] : { value: obj[id] };

		return {
			..._obj,
			id
		}
	})
}
