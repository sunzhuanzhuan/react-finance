import { handleActions } from 'redux-actions';
import {
	getIncomeList_success,
} from '../actions/businessIncome';

//查
export const incomeData = handleActions({
	[getIncomeList_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})
