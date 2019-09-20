import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions';
import {
	getPrePayData_success,
	getPayDetail_success,
	getPaySearchItem_success,
	getDatePayData_success,
	getDealOrderData_success,
} from '../actions';

//预付款
export const prePayData = handleActions({
	[getPrePayData_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const payDetail = handleActions({
	[getPayDetail_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const paySearchItem = handleActions({
	[getPaySearchItem_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

//周期付款
export const datePayData = handleActions({
	[getDatePayData_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

//三方订单明细
export const dealOrderData = handleActions({
	[getDealOrderData_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})


export default combineReducers({
	//公共
	paySearchItem,
	payDetail,
	//预付款
	prePayData,
	//周期付款
	datePayData,
	//三方订单明细
	dealOrderData,
})
