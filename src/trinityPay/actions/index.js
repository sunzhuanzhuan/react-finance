import Interface from '../constants/Interface'
import { createHttpAction } from 'redux-action-extend'
//预付款
export const {
	getPrePayData,
	getPrePayData_success
} = createHttpAction('getPrePayData', Interface.getPrePayData, {
	method: 'get',
	ignoreToast: true
});

export const {
	getPaySearchItem,
	getPaySearchItem_success
} = createHttpAction('getPaySearchItem', Interface.getPaySearchItem, {
	method: 'get',
	ignoreToast: true
});

export const {
	getPayDetail,
	getPayDetail_success
} = createHttpAction('getPayDetail', Interface.getPayDetail, {
	method: 'get',
	ignoreToast: true
});

export const {
	getPrePayExport,
	getPrePayExport_success
} = createHttpAction('getPrePayExport', Interface.getPrePayExport, {
	method: 'get',
	ignoreToast: true
});

export const {
	postPayEdit,
	postPayEdit_success
} = createHttpAction('postPayEdit', Interface.postPayEdit, {
	method: 'post',
	ignoreToast: true
});

export const {
	postPaySuccess,
	postPaySuccess_success
} = createHttpAction('postPaySuccess', Interface.postPaySuccess, {
	method: 'post',
	ignoreToast: true
});

export const {
	postPayFail,
	postPayFail_success
} = createHttpAction('postPayFail', Interface.postPayFail, {
	method: 'post',
	ignoreToast: true
});

export const {
	postPayRevoke,
	postPayRevoke_success
} = createHttpAction('postPayRevoke', Interface.postPayRevoke, {
	method: 'post',
	ignoreToast: true
});

export const {
	getPrimaryAccount,
	getPrimaryAccount_success
} = createHttpAction('getPrimaryAccount', Interface.getPrimaryAccount, {
	method: 'get',
	ignoreToast: true
});

export const {
	getAgentListByCPId,
	getAgentListByCPId_success
} = createHttpAction('getAgentListByCPId', Interface.getAgentListByCPId, {
	method: 'get',
	ignoreToast: true
});
//周期付款
export const {
	getDatePayData,
	getDatePayData_success
} = createHttpAction('getDatePayData', Interface.getDatePayData, {
	method: 'get',
	ignoreToast: true
});

export const {
	getDatePayExport,
	getDatePayExport_success
} = createHttpAction('getDatePayExport', Interface.getDatePayExport, {
	method: 'get',
	ignoreToast: true
});

//三方订单明细
export const {
	getDealOrderData,
	getDealOrderData_success
} = createHttpAction('getDealOrderData', Interface.getDealOrderData, {
	method: 'get',
	ignoreToast: true
});


export const {
	getDealOrderExport,
	getDealOrderExport_success
} = createHttpAction('getDealOrderExport', Interface.getDealOrderExport, {
	method: 'get',
	ignoreToast: true
});


