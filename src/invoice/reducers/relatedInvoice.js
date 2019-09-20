import { handleActions } from 'redux-actions';
import {
	getRelatedInvoiceData_success,
	getAvailableInvoiceData_success,
	getTrinityInvoiceSearchItem_success,
} from '../actions/trinityInvoice';

export const relatedInvoiceData = handleActions({
	[getRelatedInvoiceData_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const availableInvoiceData = handleActions({
	[getAvailableInvoiceData_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const relatedInvoiceSearchItem = handleActions({
	[getTrinityInvoiceSearchItem_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export default {
	relatedInvoiceData,
	availableInvoiceData,
	relatedInvoiceSearchItem,
}
