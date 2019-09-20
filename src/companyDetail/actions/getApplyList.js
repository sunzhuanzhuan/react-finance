import Interface from '../constants/Interface'
import api from '../../api/index';
import qs from 'qs';
const GET_APPLY_LIST = 'GET_APPLY_LIST';
const GET_APPLY_DETAIL_LIST = 'GET_APPLY_DETAIL_LIST';
const GET_ADD_APPLY_LIST = 'GET_ADD_APPLY_LIST';
export function getApplyList(params = {}) {
	const { status = 'allOptions' } = params;

	return dispatch => {
		return api.get(`${Interface.getApplicationList}?${qs.stringify(params)}`)
		.then(result => {
			dispatch({
				type: GET_APPLY_LIST,
				listData: result.data,
				status
			})
		})
		.catch( () => {
			dispatch({
				type: GET_APPLY_LIST,
				listData: {},
				status
			})
		});
	}
}

export function getApplyDetailList(params = {}) {
	const { status = 'allOptions' } = params;

	return dispatch => {
		return api.get(`${Interface.getApplicationDetail}?${qs.stringify(params)}`)
		.then(result => {
			dispatch({
				type: GET_APPLY_DETAIL_LIST,
				detailListData: result.data,
				status
			})
		})
		.catch( () => {
			dispatch({
				type: GET_APPLY_DETAIL_LIST,
				detailListData: {},
				status
			})
		});
	}
}

export function getAddApplyList(params) {
	return dispatch => {
		return api.get(`${Interface.getApplyOrderList}?${qs.stringify(params)}`)
		.then(result => {
			dispatch({
				type: GET_ADD_APPLY_LIST,
				addApplyList: result.data,
			})
		})
		.catch( () => {
			dispatch({
				type: GET_ADD_APPLY_LIST,
				addApplyList: {},
			})
		});
	}
}

export function clearAddApplyList() {
	return dispatch => {
		dispatch({
			type: GET_ADD_APPLY_LIST,
			addApplyList: {},
		})
	}
}

export default function applyListReducer(state = {}, action) {
    const { listData, status, detailListData, addApplyList } = action;
    switch (action.type) {
        case GET_APPLY_LIST:
			return { ...state, [`applyListStatus${status}`]: listData, updateKey: +new Date() + Math.random()};
		case GET_APPLY_DETAIL_LIST:
			return { ...state, [`applyDetailListStatus${status}`]: detailListData, updateKey: +new Date() + Math.random()};
		case GET_ADD_APPLY_LIST: 
			return { ...state, addApplyList }
        default:
            return state;
    }
}

