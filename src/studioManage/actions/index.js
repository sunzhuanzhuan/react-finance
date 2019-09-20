import Interface from '../constants/Interface'
import { createHttpAction } from 'redux-action-extend'

export const {
	getStudioList,
	getStudioList_success
} = createHttpAction('getStudioList', Interface.getStudioList, {
	method: 'get',
	ignoreToast: true
});

export const {
	getStudioCheck,
	getStudioCheck_success
} = createHttpAction('getStudioCheck', Interface.getStudioCheck, {
	method: 'get',
	ignoreToast: true
});

export const {
	getStudioNameCheck,
	getStudioNameCheck_success
} = createHttpAction('getStudioNameCheck', Interface.getStudioNameCheck, {
	method: 'get',
	ignoreToast: true
});

export const {
	getStudioMetadata,
	getStudioMetadata_success
} = createHttpAction('getStudioMetadata', Interface.getStudioMetadata, {
	method: 'get'
});

export const {
	postCreateStudio,
	postCreateStudio_success
} = createHttpAction('postCreateStudio', Interface.postCreateStudio, {
	method: 'post',
	ignoreToast: true
});

export const {
	postUpdateStudio,
	postUpdateStudio_success
} = createHttpAction('postUpdateStudio', Interface.postUpdateStudio, {
	method: 'post',
	ignoreToast: true
});
//查询工作室冻结中的打款单
export const {
	getFreezeList,
	getFreezeList_success
} = createHttpAction('getFreezeList', Interface.getFreezeList, {
	method: 'get',
	ignoreToast: true
});

export const {
	postStopStudio,
	postStopStudio_success
} = createHttpAction('postStopStudio', Interface.postStopStudio, {
	method: 'post',
	ignoreToast: true
});

export const {
	postStartStudio,
	postStartStudio_success
} = createHttpAction('postStartStudio', Interface.postStartStudio, {
	method: 'post',
	ignoreToast: true
});

export const {
	postTransferPayment,
	postTransferPayment_success
} = createHttpAction('postTransferPayment', Interface.postTransferPayment, {
	method: 'post',
	ignoreToast: true
});

export const {
	getAllocationList,
	getAllocationList_success
} = createHttpAction('getAllocationList', Interface.getAllocationList, {
	method: 'get'
});

export const {
	getAllocationListStat,
	getAllocationListStat_success
} = createHttpAction('getAllocationListStat', Interface.getAllocationListStat, {
	method: 'get'
});

export const {
	getIdCardList,
	getIdCardList_success
} = createHttpAction('getIdCardList', Interface.getIdCardList, {
	method: 'get'
});

export const {
	postIdCardListExport,
	postIdCardListExport_success
} = createHttpAction('postIdCardListExport', Interface.postIdCardListExport, {
	method: 'post'
});

export const {
	getStudioDetailExport,
	getStudioDetailExport_success
} = createHttpAction('getStudioDetailExport', Interface.getStudioDetailExport, {
	method: 'get'
});
