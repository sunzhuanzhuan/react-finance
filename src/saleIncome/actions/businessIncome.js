import Interface from '../constans/Interface'
import { createHttpAction } from 'redux-action-extend'

//查
export const {
	getIncomeList,
	getIncomeList_success
} = createHttpAction('getIncomeList', Interface.getIncomeList, {
	method: 'get'
});

//增
export const {
	postCreateIncome,
	postCreateIncome_success
} = createHttpAction('postCreateIncome', Interface.postCreateIncome, {
	method: 'post',
	ignoreToast: true
});
//改
export const {
	postUpdateIncome,
	postUpdateIncome_success
} = createHttpAction('postUpdateIncome', Interface.postUpdateIncome, {
	method: 'post',
	ignoreToast: true
});
//删
export const {
	getDeleteIncome,
	getDeleteIncome_success
} = createHttpAction('getDeleteIncome', Interface.getDeleteIncome, {
	method: 'get',
	ignoreToast: true
});
