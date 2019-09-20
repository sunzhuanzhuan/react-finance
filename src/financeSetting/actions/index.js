import Interface from '../constants/Interface'
import { createHttpAction } from 'redux-action-extend'

export const {
	postTrinityProfitRateAll,
	postTrinityProfitRateAll_success
} = createHttpAction('postTrinityProfitRateAll', Interface.postTrinityProfitRateAll, {
	method: 'post',
	ignoreToast: true
});

export const {
	getTrinityCompanyList,
	getTrinityCompanyList_success
} = createHttpAction('getTrinityCompanyList', Interface.getTrinityCompanyList, {
	method: 'get',
	ignoreToast: true
});

export const {
	postTrinityProfitRateAdd,
	postTrinityProfitRateAdd_success
} = createHttpAction('postTrinityProfitRateAdd', Interface.postTrinityProfitRateAdd, {
	method: 'post',
	ignoreToast: true
});

export const {
	postTrinityProfitRateModify,
	postTrinityProfitRateModify_success
} = createHttpAction('postTrinityProfitRateModify', Interface.postTrinityProfitRateModify, {
	method: 'post',
	ignoreToast: true
});
