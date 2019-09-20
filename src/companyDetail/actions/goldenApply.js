import Interface from '../constants/Interface'
import { createHttpAction } from 'redux-action-extend'

export const {
	getCompanyDetailAuthorizations,
	getCompanyDetailAuthorizations_success
} = createHttpAction('getCompanyDetailAuthorizations', Interface.getCompanyDetailAuthorizations, {
	method: 'get'
});

export const {
	getGoldenMetadata,
	getGoldenMetadata_success
} = createHttpAction('getGoldenMetadata', Interface.getGoldenMetadata, {
	method: 'get'
});

export const {
	getProject,
	getProject_success
} = createHttpAction('getProject', Interface.getProject, {
	method: 'get'
});

export const {
	getPlatform,
	getPlatform_success
} = createHttpAction('getPlatform', Interface.getPlatform, {
	method: 'get'
});

export const {
	getPlatformIcon,
	getPlatformIcon_success
} = createHttpAction('getPlatformIcon', Interface.getPlatformListIcon, {
	method: 'get'
});

export const {
	getRequirement,
	getRequirement_success
} = createHttpAction('getRequirement', Interface.getRequirement, {
	method: 'get'
});

export const {
	getGoldenToken,
	getGoldenToken_success
} = createHttpAction('getGoldenToken', Interface.getGoldenToken, {
	method: 'get'
});

export const {
	getApplicationList,
	getApplicationList_success
} = createHttpAction('getApplicationList', Interface.getApplicationList, {
	method: 'get',
	ignoreToast: true
});

export const {
	getApplyOrderList,
	getApplyOrderList_success
} = createHttpAction('getApplyOrderList', Interface.getApplyOrderList, {
	method: 'get',
	ignoreToast: true
});

export const {
	postApplyReadjust,
	postApplyReadjust_success
} = createHttpAction('postApplyReadjust', Interface.postApplyReadjust, {
	method: 'post',
	ignoreToast: true
});

export const {
	getApplicationDetail,
	getApplicationDetail_success
} = createHttpAction('getApplicationDetail', Interface.getApplicationDetail, {
	method: 'get',
	ignoreToast: true
});

export const {
	postPreviewMinSellPrice,
	postPreviewMinSellPrice_success
} = createHttpAction('postPreviewMinSellPrice', Interface.postPreviewMinSellPrice, {
	method: 'post',
	ignoreToast: true
});

export const {
	postPassByReadjust,
	postPassByReadjust_success
} = createHttpAction('postPassByReadjust', Interface.postPassByReadjust, {
	method: 'post',
	ignoreToast: true
});

export const {
	postPassByOrderIds,
	postPassByOrderIds_success
} = createHttpAction('postPassByOrderIds', Interface.postPassByOrderIds, {
	method: 'post',
	ignoreToast: true
});

export const {
	postRejectByReadjustId,
	postRejectByReadjustId_success
} = createHttpAction('postRejectByReadjustId', Interface.postRejectByReadjustId, {
	method: 'post',
	ignoreToast: true
});

export const {
	postRejectByOrderIds,
	postRejectByOrderIds_success
} = createHttpAction('postRejectByOrderIds', Interface.postRejectByOrderIds, {
	method: 'post',
	ignoreToast: true
});

export const {
	getExport,
	getExport_success
} = createHttpAction('getExport', Interface.getExport, {
	method: 'get'
});

export const {
	getGoldenUserList,
	getGoldenUserList_success
} = createHttpAction('getGoldenUserList', Interface.getGoldenUserList, {
	method: 'get'
});

export const {
	getGoldenCompanyId,
	getGoldenCompanyId_success
} = createHttpAction('getGoldenCompanyId', Interface.getGoldenCompanyId, {
	method: 'get'
});

export const {
	postImportApplication,
	postImportApplication_success
} = createHttpAction('postImportApplication', Interface.postImportApplication, {
	method: 'post',
	ignoreToast: true
});
