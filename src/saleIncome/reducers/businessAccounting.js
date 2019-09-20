import { handleActions } from 'redux-actions';
import {
	// getBusinessAccountingList_success,
	getBusinessToken_success
} from '../actions/businessAccounting';

export const accountingData = (state = {}, action) => {
	let newState = { ...state };
	switch (action.type) {
		case 'GET_BUSINESS_ACCOUNTING_LIST':
			return newState = { ...action.payload, [action.write_off_status]: action.payload.list };
		default:
			return newState;
	}
}

export const businessToken = handleActions({
	[getBusinessToken_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})
