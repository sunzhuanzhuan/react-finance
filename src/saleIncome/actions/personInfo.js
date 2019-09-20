import Interface from '../constans/Interface'
import { createHttpAction } from 'redux-action-extend'

export const {
	getPersonInfo,
	getPersonInfo_success
} = createHttpAction('getPersonInfo', Interface.getPersonInfo, {
	method: 'get'
});

export const {
	checkPersonInfo,
	checkPersonInfo_success
} = createHttpAction('checkPersonInfo', Interface.checkPersonInfo, {
	method: 'get'
});

export const {
	getNewSalesName,
	getNewSalesName_success
} = createHttpAction('getNewSalesName', Interface.getNewSalesName, {
	method: 'get'
});

export const {
	getSuperior,
	getSuperior_success
} = createHttpAction('getSuperior', Interface.getSuperior, {
	method: 'get'
});

export const {
	postCreateSale,
	postCreateSale_success
} = createHttpAction('postCreateSale', Interface.postCreateSale, {
	method: 'post'
});

export const {
	postUpdateSale,
	postUpdateSale_success
} = createHttpAction('postUpdateSale', Interface.postUpdateSale, {
	method: 'post'
});

export const {
	postDeleteSale,
	postDeleteSale_success
} = createHttpAction('postDeleteSale', Interface.postDeleteSale, {
	method: 'post'
});
