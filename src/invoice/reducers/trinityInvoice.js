import { handleActions } from 'redux-actions';
import {
	getTrinityInvoiceData_success,
	getTrinityInvoiceSearchItem_success,
} from '../actions/trinityInvoice';

export const trinityInvoiceData = handleActions({
	[getTrinityInvoiceData_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const trinityInvoiceSearchItem = handleActions({
	[getTrinityInvoiceSearchItem_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export default {
	trinityInvoiceData,
	trinityInvoiceSearchItem,
}
