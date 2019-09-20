import { combineReducers } from 'redux'
import { handleAction, handleActions, combineActions } from 'redux-actions';
import update from 'immutability-helper'


import {
	getTemplateAllColumns_success,
	selectColumns,
	changeColumnsAlias,
	resetColumnsToDefault,
	clearColumns,
	getTemplateInfo_success
} from '../actions'

// 处理组内数据
function handleColumns(data) {
	// data = JSON.parse(JSON.stringify(data))
	let ids, sources = {}, defaultSelected = []
	ids = data.map(({ name, columns }) => ({
		name,
		"columns": columns.map(item => {
			// 生成map数据
			sources[item.column_id] = item
			// 处理选中的项
			if (/*item['is_selected'] == 1 || */item['removeable_status'] == 2) defaultSelected.push(item.column_id)
			return item.column_id
		})
	}))
	return { ids, sources, defaultSelected }
}

// 处理组选择为默认模板
function resetColumns(data) {
	let newData = { ...data }
	for (let key in newData) {
		if (!newData.hasOwnProperty(key)) continue
		const { default_ids } = newData[key]
		newData[key] = update(newData[key], {
			"sources": {
				$apply: sources => {
					return Object.entries(sources).reduce((obj, [key, item]) => {
						obj[key] = {...item, alias: undefined}
						return obj
					},{})
				}
			},
			"choosed_ids": { $set: default_ids },
			"selected": { $set: default_ids }
		})

	}
	return newData
}
// 处理分组列表为码表
function handleColumnsWrapToMap(data) {
	return data.reduce((obj, group) => {
		obj[group['group_type']] = {
			...group,
			...handleColumns([...group['all_columns']]),
			selected: group['choosed_ids']
		}
		return obj
	}, {})
}

export const templateAllColumns = handleActions({
	[getTemplateAllColumns_success]: (state, action) => {
		let data = action.payload.data
		// handleColumns({...data})
		data = handleColumnsWrapToMap(data)
		return {
			...state,
			...data
		}
	},
	[changeColumnsAlias]: (state, action) => {
		let { groupId, id, val, key = 'alias' } = action.payload
		return update(state, {
			[groupId]: {
				"sources": {
					[id]: { [key]: { $set: val } }
				}
			}
		})
	},
	[resetColumnsToDefault]: (state) => {
		return resetColumns(state)
	},
	[selectColumns]: (state, action) => {
		let { groupId, value } = action.payload
		return update(state, {
			[groupId]: {
				"choosed_ids": { $set: [...value] },
				"selected": { $set: [...value] }
			}
		})
	},
	[clearColumns]: () => {
		return {}
	}
}, {})

export const templateInfos = handleActions({
	[getTemplateInfo_success]: (state, action) => {
		return {
			...state,
			...action.payload.data
		}
	},
	[clearColumns]: () => {
		return {}
	}
}, {})
/*
export const loginConfig = handleActions({
	[combineActions(getLoginConfig_success, login_success, verifysms_success)]: (state, action) => {
		return {
			...state,
			...action.payload.data
		}
	},
	[resetNeed_verify]: (state) => ({
		...state,
		need_verify: false
	})
}, {})*/

// export const qrViewInfo = handleAction(qrViewInfo_success, (state, action) => {
// 	return {
// 		...state, ...action.payload.data
// 	}
// }, {})


export default combineReducers({
	templateAllColumns,
	templateInfos
})
