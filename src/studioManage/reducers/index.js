import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions';
import {
	getStudioList_success,
	getStudioCheck_success,
	getStudioNameCheck_success,
	getStudioMetadata_success,
	postUpdateStudio_success,
	getFreezeList_success,
	getAllocationList_success,
	getAllocationListStat_success,
	getIdCardList_success,
} from '../actions';

export const studioData = handleActions({
	[getStudioList_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const studioCheck = handleActions({
	[getStudioCheck_success]: (state, action) => {
		let data = action.payload.data;
		return { ...data.rows[0] }
	}
}, {})

export const studioNameCheck = handleActions({
	[getStudioNameCheck_success]: (state, action) => {
		let data = action.payload.data;
		return [...data.rows]
	}
}, [])

export const studioMetadata = handleActions({
	[getStudioMetadata_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const newStudioData = handleActions({
	[postUpdateStudio_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const freezeList = handleActions({
	[getFreezeList_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const allocationData = handleActions({
	[getAllocationList_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const allocationStatData = handleActions({
	[getAllocationListStat_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const idCardList = handleActions({
	[getIdCardList_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})


export default combineReducers({
	studioData,
	studioCheck,
	studioNameCheck,
	studioMetadata,
	newStudioData,
	freezeList,
	allocationData,
	allocationStatData,
	idCardList,
})
