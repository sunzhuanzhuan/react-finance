import { handleActions } from 'redux-actions';
import {
	getPreparation_success,
	getPreparationList_success,
	getSearchPreparation_success,
} from '../actions/companyIncome';

export const preparation = handleActions({
	[getPreparation_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const preparationList = handleActions({
	[getPreparationList_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const preparationSearch = handleActions({
	[getSearchPreparation_success]: (state, action) => {
		return [...action.payload.data]
	}
}, [])
