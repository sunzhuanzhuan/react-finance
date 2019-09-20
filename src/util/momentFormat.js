import moment from 'moment'

export const mo2str = (mo = moment(), scheme = 'YYYY-MM-DD HH:mm:ss') => {
	return moment(mo).format(scheme)
}
export const str2mo = (str = '1970-1-1 08:00:00') => {
	return moment(str)
}
