import { handleActions } from 'redux-actions';
import {
	getCompanyDetailAuthorizations_success,
	getGoldenMetadata_success,
	getPlatform_success,
	getPlatformIcon_success,
	getProject_success,
	getGoldenToken_success,
	getApplicationList_success,
	getApplyOrderList_success,
	postApplyReadjust_success,
	getApplicationDetail_success,
	postPreviewMinSellPrice_success,
	getGoldenUserList_success,
} from '../actions/goldenApply';

export const companyDetailAuthorizations = handleActions({
	[getCompanyDetailAuthorizations_success]: (state, action) => {
		return [...action.payload.data]
	}
}, [])

export const goldenMetadata = handleActions({
	[getGoldenMetadata_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const platformList = handleActions({
	[getPlatform_success]: (state, action) => {
		return [...action.payload.data]
	}
}, [])

export const platformIconList = handleActions({
	[getPlatformIcon_success]: (state, action) => {
		return [...action.payload.data]
	}
}, [])

export const projectList = handleActions({
	[getProject_success]: (state, action) => {
		return [...action.payload.data]
	}
}, [])

export const goldenToken = handleActions({
	[getGoldenToken_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const applicationList = handleActions({
	[getApplicationList_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const applyOrderList = handleActions({
	[getApplyOrderList_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const applyReadjust = handleActions({
	[postApplyReadjust_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const applicationDetail = handleActions({
	[getApplicationDetail_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const applicationPreview = handleActions({
	[postPreviewMinSellPrice_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const goldenUserList = handleActions({
	[getGoldenUserList_success]: (state, action) => {
		return [...action.payload.data]
	}
}, [])

