import Interface from '../constans/Interface'
import { createHttpAction } from 'redux-action-extend'

//查
export const {
	getCompanyList,
	getCompanyList_success
} = createHttpAction('getCompanyList', Interface.getCompanyList, {
	method: 'get'
});
//关联公司ID
export const {
	getCompanyID,
	getCompanyID_success
} = createHttpAction('getCompanyID', Interface.getCompanyID, {
	method: 'get',
	ignoreToast: true
});

//增
export const {
	postCreateCompany,
	postCreateCompany_success
} = createHttpAction('postCreateCompany', Interface.postCreateCompany, {
	method: 'post',
	ignoreToast: true
});
//改
export const {
	postUpdateCompany,
	postUpdateCompany_success
} = createHttpAction('postUpdateCompany', Interface.postUpdateCompany, {
	method: 'post',
	ignoreToast: true
});
