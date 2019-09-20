import { handleActions } from 'redux-actions';
import {
	getPaymentList_success,
} from '../actions/exceedPayment';

//查
export const paymentData = handleActions({
	[getPaymentList_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})
