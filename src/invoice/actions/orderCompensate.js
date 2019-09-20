import Interface from '../constants/Interface'
import { createHttpAction } from 'redux-action-extend'

export const {
	getCompensateAuthorizations,
	getCompensateAuthorizations_success
} = createHttpAction('getCompensateAuthorizations', Interface.getCompensateAuthorizations, {
	method: 'get'
});

export const {
	getReparationSaleList,
	getReparationSaleList_success
} = createHttpAction('getReparationSaleList', Interface.getReparationSaleList, {
	method: 'get'
});

export const {
	getReparationStatus,
	getReparationStatus_success
} = createHttpAction('getReparationStatus', Interface.getReparationStatus, {
	method: 'get'
});

export const {
	getReparationInfo,
	getReparationInfo_success
} = createHttpAction('getReparationInfo', Interface.getReparationInfo, {
	method: 'get',
	ignoreToast: true
});

export const {
	postReparationComplete,
	postReparationComplete_success
} = createHttpAction('postReparationComplete', Interface.postReparationComplete, {
	method: 'post'
});

export const {
	postReparationRefuse,
	postReparationRefuse_success
} = createHttpAction('postReparationRefuse', Interface.postReparationRefuse, {
	method: 'post'
});

