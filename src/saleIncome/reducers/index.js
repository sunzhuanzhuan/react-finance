import { combineReducers } from 'redux'
import {
	saleMetadata,
	saleName
} from './common'
import {
	saleData,
	checkSaleData,
	newSaleName,
	saleSuperior,
} from './personInfo'
import {
	paymentData,
} from './exceedPayment'
import {
	companyData,
	companyID
} from './clientPayment'
import {
	incomeData
} from './businessIncome'
import {
	preparation,
	preparationList,
	preparationSearch
} from './companyIncome'
import {
	missionData,
	missionSale
} from './missionList'
import {
	completeData,
	completeDetail
} from './completePercent'
import {
	accountingData,
	businessToken
} from './businessAccounting'
export default combineReducers({
	/* personInfo */
	saleData,
	checkSaleData,
	saleMetadata,
	saleName,
	newSaleName,
	saleSuperior,
	/*exceedPayment */
	paymentData,
	/* clientPayment */
	companyData,
	companyID,
	/* businessIncome */
	incomeData,
	/* companyIncome */
	preparation,
	preparationList,
	preparationSearch,
	/* missionList */
	missionData,
	missionSale,
	/* completePercent */
	completeData,
	completeDetail,
	/* businessAccounting */
	accountingData,
	businessToken
})
