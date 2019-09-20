import qs from 'qs'

export const parseUrlQuery = (url = window.location.href) => {
	let query = url.split("?")[1];
	return qs.parse(query || '')
}
