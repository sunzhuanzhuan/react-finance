import Interface from '../constans/Interface'
import { createHttpAction } from 'redux-action-extend'

export const {
	getApplyList,
	getApplyList_success
} = createHttpAction('getApplyList', Interface.getApplyList, {
	method: 'get'
});

export const {
	getFlashAuthorizations,
	getFlashAuthorizations_success
} = createHttpAction('getFlashAuthorizations', Interface.getFlashAuthorizations, {
	method: 'get'
});

export const {
	getWithdrawApplyDetail,
	getWithdrawApplyDetail_success
} = createHttpAction('getWithdrawApplyDetail', Interface.getWithdrawApplyDetail, {
	method: 'get',
	ignoreToast: true
});

export const {
	calculateCost,
	calculateCost_success
} = createHttpAction('calculateCost', Interface.calculateCost, {
	method: 'get',
	ignoreToast: true
});

export const {
	setFail,
	setFail_success
} = createHttpAction('setFail', Interface.setFail, {
	method: 'get',
	ignoreToast: true
});

export const {
	setSuccess,
	setSuccess_success
} = createHttpAction('setSuccess', Interface.setSuccess, {
	method: 'get',
	ignoreToast: true
});

export const {
	setPay,
	setPay_success
} = createHttpAction('setPay', Interface.setPay, {
	method: 'get',
	ignoreToast: true
});
