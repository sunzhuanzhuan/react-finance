import { handleActions } from 'redux-actions';
import {
	getCompanyList_success,
	getCompanyID_success,
	clearCompanyList_success
} from '../actions/clientPayment';

//查
export const companyData = handleActions({
	[getCompanyList_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

//关联公司ID
export const companyID = handleActions({
	[getCompanyID_success]: (state, action) => {
		return [...action.payload.data]
	}
}, [])

