import Interface from '../constans/Interface'
import { createHttpAction } from 'redux-action-extend'

export const {
	getCompleteList,
	getCompleteList_success
} = createHttpAction('getCompleteList', Interface.getCompleteList, {
	method: 'get'
});

export const {
	postCreateComplete,
	postCreateComplete_success
} = createHttpAction('postCreateComplete', Interface.postCreateComplete, {
	method: 'post',
	ignoreToast: true
});

export const {
	postUpdateComplete,
	postUpdateComplete_success
} = createHttpAction('postUpdateComplete', Interface.postUpdateComplete, {
	method: 'post',
	ignoreToast: true
});

export const {
	postDeleteComplete,
	postDeleteComplete_success
} = createHttpAction('postDeleteComplete', Interface.postDeleteComplete, {
	method: 'post',
	ignoreToast: true
});

export const {
	getCompleteDetail,
	getCompleteDetail_success
} = createHttpAction('getCompleteDetail', Interface.getCompleteDetail, {
	method: 'get',
	ignoreToast: true
});

