import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions';
import {
	postTrinityProfitRateAll_success,
	getTrinityCompanyList_success,
} from '../actions';

export const trinityProfitRateAll = handleActions({
	[postTrinityProfitRateAll_success]: (state, action) => {
		return [...action.payload.data]
	}
}, [])
export const trinityCompanyList = handleActions({
	[getTrinityCompanyList_success]: (state, action) => {
		return [...action.payload.data]
	}
}, [])

export default combineReducers({
	trinityProfitRateAll,
	trinityCompanyList
})
