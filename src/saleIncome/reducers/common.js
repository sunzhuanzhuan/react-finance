import { handleActions } from 'redux-actions';
import {
	getMetadata_success,
	getSalesName_success,
} from '../actions/common'

//获取metadata
export const saleMetadata = handleActions({
	[getMetadata_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

//获取销售姓名
export const saleName = handleActions({
	[getSalesName_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})
