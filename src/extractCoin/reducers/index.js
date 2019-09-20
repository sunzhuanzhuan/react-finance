import { combineReducers } from 'redux'
import { handleActions } from 'redux-actions';
import { timestampToTime } from '../constans/utils'
import {
	getApplyList_success,
	getFlashAuthorizations_success,
	getWithdrawApplyDetail_success,
	calculateCost_success
} from '../action/extractManage';
import {
	getPaymentSlipList_success,
	excelNameList_success,
	getPaymentSlipOrderList_success,
	getPaymentSlipDetail_success,
	detailForExcel_success,
	getFlashStudioList_success
} from '../action/remitOrder';
/* extractManage */
export const applyData = handleActions({
	[getApplyList_success]: (state, action) => {
		let data = action.payload.data;
		let list = data.list.map(item => {
			item['create_time'] = (timestampToTime(item['created_time']))
			return item;
		})
		return { ...data, list }
	}
}, {})
export const author = handleActions({
	[getFlashAuthorizations_success]: (state, action) => {
		return [...action.payload.data]
	}
}, [])
export const applyDetail = handleActions({
	[getWithdrawApplyDetail_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})
export const calculateCost = handleActions({
	[calculateCost_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})
/* remitOrder */
export const remitOrderData = handleActions({
	[getPaymentSlipList_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})
export const excel_name_list = handleActions({
	[excelNameList_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})
export const newRemitOrderData = handleActions({
	[getPaymentSlipOrderList_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})
export const remitOrder = (state = {
	check_receipts: {},
	payment_order_detail: []
}, action) => {
	state = JSON.parse(JSON.stringify(state));
	switch (action.type) {
		case 'GET_BILL_LIST':
			state.check_receipts[action.status_type] = action.payload;
			break;
		case 'CLEAR_BILL_LIST':
			state.check_receipts = {};
			break;
		case 'PAYMENT_ORDER_DETAIL':
			state.payment_order_detail = action.payload;
			break;
		default:
			break;
	}
	return state;
}

export const remitOrderDetail = handleActions({
	[getPaymentSlipDetail_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

export const detail_for_excel = handleActions({
	[detailForExcel_success]: (state, action) => {
		return [...action.payload.data]
	}
}, [])

export const flashStudioList = handleActions({
	[getFlashStudioList_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})


export default combineReducers({
	applyData,
	author,
	applyDetail,
	calculateCost,
	remitOrderData,
	excel_name_list,
	newRemitOrderData,
	remitOrder,
	remitOrderDetail,
	detail_for_excel,
	flashStudioList,
})
// export const remitOrder=

// const flashApply = (state = {
// 	setContractsList: [],
// 	contractsListData: {},
// 	getContractsOrderList: [],
// 	contractsOrderData: {},
// 	contractsOrderMsg: {},
// 	getOrderList: [],
// 	getOrderData: {},
// 	getApplyList: [],
// 	order_status: {},
// 	getApplyDetail: {},
// 	author: {},
// 	calculateCost: {},
// 	getApplyData: {}
// }, action) => {
// 	state = JSON.parse(JSON.stringify(state));
// 	switch (action.type) {
// 		case Types.GET_CONTRACTS_LIST:
// 			state.setContractsList = action.payload.contracts.data;
// 			state.contractsListData = action.payload;
// 			break;
// 		case Types.GET_AUTHORIZATIONS:
// 			state.author = action.payload;
// 			break;
// 		// case Types.SET_CONTRACTS_LIST:
// 		// 	state.setContractsList = action.payload;
// 		// 	break;
// 		case Types.GET_ORDER_LIST:
// 			state.getOrderList = action.payload.orderlist;
// 			state.getOrderData = action.payload;
// 			break;
// 		case Types.GET_CONTRACTS_ORDER_LIST:
// 			state.getContractsOrderList = action.payload.contractOrder.data;
// 			state.contractsOrderData = action.payload.contractOrder;
// 			state.contractsOrderMsg = action.payload.contract;
// 			break;
// 		case Types.SET_CONTRACTS_ORDER_LIST:
// 			state.getContractsOrderList = action.payload;
// 			break;
// 		case Types.GET_SELECTED_ROWS:
// 			state.getContractsOrderList = [...state.getContractsOrderList, ...action.payload];
// 			break;
// 		case Types.GET_APPLY_LIST:
// 			state.getApplyList = action.payload.list;
// 			state.getApplyData = action.payload
// 			state.order_status = action.status;
// 			break;
// 		case Types.GET_WITHDRAW_APPLY_DETAIL:
// 			state.getApplyDetail = action.payload;
// 			break;
// 		case Types.GET_CALCULATE_COST:
// 			state.calculateCost = action.payload;
// 			break;
// 		default:
// 			break;
// 	}
// 	return state;

// };
// const remitOrder = (state = {
// 	remitOrderList: [],
// 	remitOrderInfo: {},
// 	order_status: [],
// 	remitOrderDetail: {},
// 	detail_for_excel: [],
// 	newRemitOrderList: [],
// 	newRemitOrderInfo: {},
// 	user_name: {},
// 	payment_slip_status_name: [],
// 	excel_name_list: {},
// 	check_receipts: {},
// 	payment_order_detail: []
// }, action) => {
// 	state = JSON.parse(JSON.stringify(state));
// 	switch (action.type) {
// 		case Types.GET_PAYMENT_SLIP_LIST:
// 			state.remitOrderList = action.payload.data
// 			state.order_status = action.payload.payment_slip_status_name
// 			state.remitOrderInfo = action.payload
// 			break;
// 		case Types.GET_PAYMENT_SLIP_ORDER_LIST:
// 			state.newRemitOrderList = action.payload.data
// 			state.newRemitOrderInfo = action.payload
// 			state.user_name = action.payload.user_name
// 			state.new_payment_slip_status_name = action.payload.payment_slip_status_name
// 			break;
// 		case Types.GET_PAYMENT_SLIP_DETAIL:
// 			state.remitOrderDetail = action.payload
// 			state.payment_slip_status_name = action.payload.payment_slip_status_name
// 			break;
// 		case Types.GET_DETAIL_FOR_EXCEL:
// 			state.detail_for_excel = action.payload;
// 			break;
// 		case Types.EXCEL_NAME_LIST:
// 			state.excel_name_list = action.payload
// 			break;
// 		case Types.GET_BILL_LIST:
// 			state.check_receipts[action.status_type] = action.payload;
// 			break;
// 		case Types.CLEAR_BILL_LIST:
// 			state.check_receipts = {};
// 			break;
		// case Types.PAYMENT_ORDER_DETAIL:
		// 	state.payment_order_detail = action.payload;
		// 	break;
// 		default:
// 			break;
// 	}
// 	return state;
// }

