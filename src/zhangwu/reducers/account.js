
import { GET_ACCOUNT_DETAIL ,SEARCH_ITEM,DETAIL_RESET} from '../constants/ActionType'
import { 
	getAccountList_success
   } from '../actions'
  import { handleActions } from 'redux-actions';

//获取账务详情
export const accountDetail = (state = {}, action) => {
    switch (action.type) {
		case GET_ACCOUNT_DETAIL:
			return action.payload;
		case DETAIL_RESET:
			return action.payload;
        default:
            return state;
    }
}

// 获取账务搜索下拉
export const searchDetail = (state = {}, action) => {
    switch (action.type) {
		case SEARCH_ITEM:
            return action.payload;
        default:
            return state;
    }
}

//获取账号名称模糊搜索
export const accountList = handleActions({
	[getAccountList_success]: (state, action) => (action.payload.data)
}, "")
