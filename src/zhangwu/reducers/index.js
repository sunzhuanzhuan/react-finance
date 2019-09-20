
import { combineReducers } from 'redux'
import {accountDetail,accountList,searchDetail} from './account';

export default combineReducers({
	accountDetail,
	accountList,
	searchDetail
})

