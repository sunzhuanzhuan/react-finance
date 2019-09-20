import { combineReducers } from 'redux'
import { companyData, companyMetadata, companyDetail, companyBillings, companyBillDetail, readjustPriceAccount, readjustPriceAccountBill, giftAccount, goldenAccount, goldenFlow, freezeDetail } from './companyDetail'
import { companyDetailAuthorizations, goldenMetadata, applicationList, applyOrderList, platformList, projectList, applyReadjust, goldenToken, applicationDetail, applicationPreview, goldenUserList, platformIconList } from './goldenApply'
import applyListReducer from '../actions/getApplyList';

export default combineReducers({
	/* companyDetail */
	companyData,
	companyMetadata,
	companyDetail,
	companyBillings,
	companyBillDetail,
	readjustPriceAccount,
	readjustPriceAccountBill,
	giftAccount,
	goldenAccount,
	goldenFlow,
	freezeDetail,
	/* goldenApply */
	companyDetailAuthorizations,
	goldenMetadata,
	projectList,
	platformList,
	goldenToken,
	applicationList,
	applyOrderList,
	applyReadjust,
	applicationDetail,
	applicationPreview,
	goldenUserList,
	applyListReducer,
	platformIconList
})



