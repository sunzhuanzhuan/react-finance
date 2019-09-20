import Interface from '../constants/Interface'
import { createHttpAction } from 'redux-action-extend'
import { createAction } from 'redux-actions';

// 创建/修改模板信息
export const {
	saveTemplate
} = createHttpAction('saveTemplate', Interface.saveTemplate, {
	method: 'post'
});

// 获取模板信息
export const {
	getTemplateInfo,
	getTemplateInfo_success
} = createHttpAction('getTemplateInfo', Interface.getTemplateInfo, {
	method: 'get'
});

// 获取公司选择项
/*export const {
	getCompanyList
} = createHttpAction('getCompanyList', Interface.getCompanyList, {
	method: 'get'
});*/

// 获取报价单模板全部可选字段
export const {
	getTemplateAllColumns,
	getTemplateAllColumns_success
} = createHttpAction('getTemplateAllColumns', Interface.getTemplateAllColumns, {
	method: 'get'
});

// 修改选中字段
export const selectColumns = createAction('selectColumns')
// 修改别名
export const changeColumnsAlias = createAction('changeColumnsAlias')

// 重置
export const resetColumnsToDefault = createAction('resetColumnsToDefault')

// 清空数据
export const clearColumns = createAction('clearColumns')
export const clearInfos = createAction('clearInfos')

// 保存模板字段
export const {
	saveTemplateStyle
} = createHttpAction('saveTemplateStyle', Interface.saveTemplateStyle, {
	method: 'post'
});

export const resetNeed_verify = createAction('resetNeed_verify')
