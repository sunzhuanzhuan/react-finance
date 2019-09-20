import Interface from '../constans/Interface'
import { createHttpAction } from 'redux-action-extend'

import api from '../../api'

export const {
	getPaymentSlipList,
	getPaymentSlipList_success
} = createHttpAction('getPaymentSlipList', Interface.getPaymentSlipList, {
	method: 'get'
});

export const {
	excelNameList,
	excelNameList_success
} = createHttpAction('excelNameList', Interface.excelNameList, {
	method: 'get',
	ignoreToast: true,
});

export const {
	getPaymentSlipOrderList,
	getPaymentSlipOrderList_success
} = createHttpAction('getPaymentSlipOrderList', Interface.getPaymentSlipOrderList, {
	method: 'get'
});
export const {
	getPaymentSlipDetail,
	getPaymentSlipDetail_success
} = createHttpAction('getPaymentSlipDetail', Interface.getPaymentSlipDetail, {
	method: 'get'
});
export const {
	detailForExcel,
	detailForExcel_success
} = createHttpAction('detailForExcel', Interface.detailForExcel, {
	method: 'get'
});
export const {
	addPaymentSlip,
	addPaymentSlip_success
} = createHttpAction('addPaymentSlip', Interface.addPaymentSlip, {
	method: 'get'
});
export const {
	paymentSlipAudit,
	paymentSlipAudit_success
} = createHttpAction('paymentSlipAudit', Interface.paymentSlipAudit, {
	method: 'get'
});
export const {
	downExcel,
	downExcel_success
} = createHttpAction('downExcel', Interface.downExcel, {
	method: 'get'
});
export const {
	paymentSlipPayed,
	paymentSlipPayed_success
} = createHttpAction('paymentSlipPayed', Interface.paymentSlipPayed, {
	method: 'get',
	ignoreToast: true,
});
export const {
	paymentSlipReturned,
	paymentSlipReturned_success
} = createHttpAction('paymentSlipReturned', Interface.paymentSlipReturned, {
	method: 'get',
	ignoreToast: true,
});
export const {
	paymentSlipPayedTax,
	paymentSlipPayedTax_success
} = createHttpAction('paymentSlipPayedTax', Interface.paymentSlipPayedTax, {
	method: 'get',
	ignoreToast: true,
});
export const getBillList = (obj) => dispath => {
	return api.get('/flash/bill_list', { params: obj }).then(response => {
		const { data } = response;
		dispath({ type: 'GET_BILL_LIST', payload: data, status_type: obj.status_type });
	})
}
export const clearBillList = () => dispath => {
	dispath({ type: 'CLEAR_BILL_LIST' })
}
export const paymentOrderDetail = (str) => dispath => {
	return api.get('/flash/bill_detail?' + str).then(response => {
		const { data } = response;
		dispath({ type: 'PAYMENT_ORDER_DETAIL', payload: data });
	})
}
//更换工作室
export const {
	getFlashStudioList,
	getFlashStudioList_success
} = createHttpAction('getFlashStudioList', Interface.getFlashStudioList, {
	method: 'get'
});

export const {
	postTransferStudio,
	postTransferStudio_success
} = createHttpAction('postTransferStudio', Interface.postTransferStudio, {
	method: 'post'
});
