import { handleActions } from 'redux-actions';
import {
	getCompleteList_success,
	getCompleteDetail_success
} from '../actions/completePercent';
import { markMergerCols } from '../constans'

export const completeData = handleActions({
	[getCompleteList_success]: (state, action) => {
		let { data } = action.payload;
		if (Object.prototype.toString.call(data.list) === '[object Array]') {
			return { ...action.payload.data, list: [] }
		}
		let list = Object.values(data.list).map((item, index) => {
			item.identifying = index + 1;
			item.actionFlag = `${item.position_name}_${item.business_name}`;
			return item
		});
		list = markMergerCols(list, 'actionFlag');
		return { ...action.payload.data, list }
	}
}, {})

export const completeDetail = handleActions({
	[getCompleteDetail_success]: (state, action) => {
		return { ...action.payload.data[0] }
	}
}, {})
