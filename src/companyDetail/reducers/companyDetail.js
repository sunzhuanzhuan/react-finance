import { handleActions } from 'redux-actions';
import {
	getCompanyData_success,
	getCompanyMetadata_success,
	getCompanyDetail_success,
	getBillings_success,
	getBillDetail_success,
	getReadjustPriceAccount_success,
	getReadjustPriceAccountBill_success,
	getGiftAccount_success,
	getGoldenAccount_success,
	getGoldenFlow_success,
	getFreezeDetail_success
} from '../actions/companyDetail';

export const companyData = handleActions({
	[getCompanyData_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const companyMetadata = handleActions({
	[getCompanyMetadata_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const companyDetail = handleActions({
	[getCompanyDetail_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const companyBillings = handleActions({
	[getBillings_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const companyBillDetail = handleActions({
	[getBillDetail_success]: (state, action) => {
		return [...action.payload.data]
	}
}, [])

export const readjustPriceAccount = handleActions({
	[getReadjustPriceAccount_success]: (state, action) => {
		return [...action.payload.data]
	}
}, [])

export const readjustPriceAccountBill = handleActions({
	[getReadjustPriceAccountBill_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const giftAccount = handleActions({
	[getGiftAccount_success]: (state, action) => {
		return [...action.payload.data]
	}
}, [])

export const goldenAccount = handleActions({
	[getGoldenAccount_success]: (state, action) => {
		return [...action.payload.data]
	}
}, [])

export const goldenFlow = handleActions({
	[getGoldenFlow_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const freezeDetail = handleActions({
	[getFreezeDetail_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})
