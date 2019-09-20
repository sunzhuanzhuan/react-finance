import Interface from '../constans/Interface'
import { createHttpAction } from 'redux-action-extend'

//查
export const {
	getPaymentList,
	getPaymentList_success
} = createHttpAction('getPaymentList', Interface.getPaymentList, {
	method: 'get'
});
//增
export const {
	postCreatePayment,
	postCreatePayment_success
} = createHttpAction('postCreatePayment', Interface.postCreatePayment, {
	method: 'post',
	ignoreToast: true
});
//改
export const {
	postUpdatePayment,
	postUpdatePayment_success
} = createHttpAction('postUpdatePayment', Interface.postUpdatePayment, {
	method: 'post',
	ignoreToast: true
});
//删
export const {
	getDeletePayment,
	getDeletePayment_success
} = createHttpAction('getDeletePayment', Interface.getDeletePayment, {
	method: 'get',
	ignoreToast: true
});
