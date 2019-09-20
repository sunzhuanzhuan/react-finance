import { handleActions } from 'redux-actions';
import {
	getPersonInfo_success,
	checkPersonInfo_success,
	getNewSalesName_success,
	getSuperior_success,
} from '../actions/personInfo';
import { markMergerCols } from '../constans'

//获取销售提成人员信息列表
export const saleData = handleActions({
	[getPersonInfo_success]: (state, action) => {
		let data = action.payload.data;
		let ary = [...data.list];
		ary = ary.length > 0 ? ary.map(item => {
			let obj = { ...item };
			obj.identity = `${obj.sale_id}_${obj.parent_id}`;
			return obj
		}) : [];
		ary.length > 0 ? ary = markMergerCols(ary, 'sale_id') : null;
		return { ...data, list: ary }
	}
}, {})
//存储单个销售信息
export const checkSaleData = handleActions({
	[checkPersonInfo_success]: (state, action) => {
		return { ...action.payload.data }
	}
}, {})

//获取新建销售姓名
export const newSaleName = handleActions({
	[getNewSalesName_success]: (state, action) => {
		return [...action.payload.data]
	}
}, [])
//销售上级
export const saleSuperior = handleActions({
	[getSuperior_success]: (state, action) => {
		return [...action.payload.data]
	}
}, [])

function poll(list, flag) {
	let key = list[0][flag], cur = 0;
	list.forEach((item, index) => {
		if (index == list.length - 1) {
			if (item[flag] !== key) {
				list[cur].action = index - cur;
				item.action = 1;
			} else {
				item.action = 0;
				list[cur].action = index - cur + 1;
			}
			return
		}
		if (item[flag] !== key) {
			list[cur].action = index - cur;
			cur = index;
			key = item[flag];
		} else {
			item.action = 0;
		}
	})
}
