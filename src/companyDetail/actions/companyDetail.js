import Interface from '../constants/Interface'
import { createHttpAction } from 'redux-action-extend'

export const {
	getCompanyData,
	getCompanyData_success
} = createHttpAction('getCompanyData', Interface.getCompanyData, {
	method: 'get'
});

export const {
	getCompanyMetadata,
	getCompanyMetadata_success
} = createHttpAction('getCompanyMetadata', Interface.getCompanyMetadata, {
	method: 'get'
});

export const {
	getCompanyDetail,
	getCompanyDetail_success
} = createHttpAction('getCompanyDetail', Interface.getCompanyDetail, {
	method: 'get'
});

export const {
	getBillings,
	getBillings_success
} = createHttpAction('getBillings', Interface.getBillings, {
	method: 'get',
	ignoreToast: true
});

export const {
	getBillDetail,
	getBillDetail_success
} = createHttpAction('getBillDetail', Interface.getBillDetail, {
	method: 'get'
});

export const {
	getReadjustPriceAccount,
	getReadjustPriceAccount_success
} = createHttpAction('getReadjustPriceAccount', Interface.getReadjustPriceAccount, {
	method: 'get'
});

export const {
	getReadjustPriceAccountBill,
	getReadjustPriceAccountBill_success
} = createHttpAction('getReadjustPriceAccountBill', Interface.getReadjustPriceAccountBill, {
	method: 'get',
	ignoreToast: true
});

export const {
	getGiftAccount,
	getGiftAccount_success
} = createHttpAction('getGiftAccount', Interface.getGiftAccount, {
	method: 'get'
});

export const {
	getGoldenAccount,
	getGoldenAccount_success
} = createHttpAction('getGoldenAccount', Interface.getGoldenAccount, {
	method: 'get'
});

export const {
	getGoldenFlow,
	getGoldenFlow_success
} = createHttpAction('getGoldenFlow', Interface.getGoldenFlow, {
	method: 'get'
});

export const {
	getFreezeDetail,
	getFreezeDetail_success
} = createHttpAction('getFreezeDetail', Interface.getFreezeDetail, {
	method: 'get'
});
