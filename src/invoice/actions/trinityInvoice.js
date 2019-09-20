import Interface from '../constants/Interface'
import { createHttpAction } from 'redux-action-extend'

//公共
export const {
	getTrinityInvoiceSearchItem,
	getTrinityInvoiceSearchItem_success
} = createHttpAction('getTrinityInvoiceSearchItem', Interface.getTrinityInvoiceSearchItem, {
	method: 'get',
	ignoreToast: true
});

//发票管理
export const {
	getTrinityInvoiceData,
	getTrinityInvoiceData_success
} = createHttpAction('getTrinityInvoiceData', Interface.getTrinityInvoiceData, {
	method: 'get',
	ignoreToast: true
});

export const {
	postTrinityInvoiceAdd,
	postTrinityInvoiceAdd_success
} = createHttpAction('postTrinityInvoiceAdd', Interface.postTrinityInvoiceAdd, {
	method: 'post'
});

export const {
	postTrinityInvoiceEdit,
	postTrinityInvoiceEdit_success
} = createHttpAction('postTrinityInvoiceEdit', Interface.postTrinityInvoiceEdit, {
	method: 'post'
});

export const {
	postTrinityInvoiceDel,
	postTrinityInvoiceDel_success
} = createHttpAction('postTrinityInvoiceDel', Interface.postTrinityInvoiceDel, {
	method: 'post'
});

export const {
	postTrinityInvoiceExport,
	postTrinityInvoiceExport_success
} = createHttpAction('postTrinityInvoiceExport', Interface.postTrinityInvoiceExport, {
	method: 'get'
});


//关联发票
export const {
	getRelatedInvoiceData,
	getRelatedInvoiceData_success
} = createHttpAction('getRelatedInvoiceData', Interface.getRelatedInvoiceData, {
	method: 'get',
	ignoreToast: true
});

export const {
	postDeleteInvoiceRelate,
	postDeleteInvoiceRelate_success
} = createHttpAction('postDeleteInvoiceRelate', Interface.postDeleteInvoiceRelate, {
	method: 'post',
	ignoreToast: true
});

export const {
	getAvailableInvoiceData,
	getAvailableInvoiceData_success
} = createHttpAction('getAvailableInvoiceData', Interface.getAvailableInvoiceData, {
	method: 'get',
	ignoreToast: true
});

export const {
	postAddRelation,
	postAddRelation_success
} = createHttpAction('postAddRelation', Interface.postAddRelation, {
	method: 'post',
	ignoreToast: true
});

