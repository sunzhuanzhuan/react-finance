import { handleActions } from 'redux-actions';
import {
	getMissionList_success,
	getMissionSale_success
} from '../actions/missionList';

export const missionData = handleActions({
	[getMissionList_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const missionSale = handleActions({
	[getMissionSale_success]: (state, action) => {
		return [...action.payload.data]
	}
}, [])

