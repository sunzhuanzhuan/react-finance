
import api from "../../api/index";
import { GET_ACCOUNT_DETAIL, SEARCH_ITEM, DETAIL_RESET } from "../constants/ActionType";
// import Interface from '../constants/Interface';
import { createHttpAction } from 'redux-action-extend';
//获取账务详情
export const getAccountDetail = (id) => dispatch => {
	return api.get('/finance/order/orderAccount/getOrderDetail?order_id=' + id).then(response => {
		const { data } = response;
		dispatch({
			type: GET_ACCOUNT_DETAIL,
			payload: data
		});

	})
}
//获取账务详情
export const getSearchDetail = () => dispatch => {
	return api.get('/finance/order/orderAccount/searchItem').then(response => {
		const { data } = response;
		dispatch({
			type: SEARCH_ITEM,
			payload: data
		});

	})
}
//清空账务详情
export const getResetDetail = () => dispatch => {

	dispatch({
		type: DETAIL_RESET,
		payload: {}
	});
}
export const {
	getAccountList,
	getAccountList_success
} = createHttpAction('getAccountList', '/finance/order/orderAccount/getOrderList', {
	method: 'get',
});
