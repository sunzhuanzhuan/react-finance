import Interface from '../constants/Interface'
import { createHttpAction } from 'redux-action-extend'
import { createAction } from 'redux-actions';

//获取公司下拉列表
export const {
	getCompanyList2,
	getCompanyList_success
} = createHttpAction('getCompanyList2', Interface.common.getCompanyList)

//所有平台下拉列表
export const {
	getAllPlatform,
	getAllPlatform_success
} = createHttpAction('getAllPlatform', Interface.common.getAllPlatform)


export const {
	getAuthorizations,
	getAuthorizations_success
} = createHttpAction('getAuthorizations', Interface.auth.getAuthorizations, {
	method: 'get',
	isHttp: true,
	ignoreToast: true,
	ignoreLoading: true
});

export const resetSiderAuth = createAction('RESET_SIDERMENU_AUTH', () => {
	return [];
})


export const getCompanyList = getCompanyList2
