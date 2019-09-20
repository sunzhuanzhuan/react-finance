import { handleActions } from 'redux-actions';
import {
	getReparationInfo_success,
	getReparationSaleList_success,
	getReparationStatus_success
} from '../actions/orderCompensate';

export const reparationInfo = handleActions({
	[getReparationInfo_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const orderSaleList = handleActions({
	[getReparationSaleList_success]: (state, action) => {
		return [...action.payload.data]
	}
}, [])

export const status = handleActions({
	[getReparationStatus_success]: (state, action) => {
		return [...action.payload.data]
	}
}, [])
