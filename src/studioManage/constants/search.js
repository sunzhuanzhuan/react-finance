import React from 'react'
import { isFlashConfig } from './index'
export const studioListSearchFunc = ({ studio_status, studio_type, studio_supported_platforms }) => [
	{
		ctype: 'input',
		attr: {
			placeholder: '请输入',
			style: { width: 160 },
			allowClear: true
		},
		field: {
			label: '工作室ID',
			value: 'id',
		}
	},
	{
		ctype: 'select',
		attr: {
			placeholder: "不限",
			style: { width: 160 },
			labelInValue: true,
			allowClear: true,
		},
		field: {
			label: '状态',
			value: 'status',
		},
		selectOptionsChildren: studio_status,
		selectItem: { key: 'display', value: 'id' }
	},
	{
		ctype: 'select',
		attr: {
			placeholder: '不限',
			style: { width: 160 },
			labelInValue: true,
			allowClear: true
		},
		field: {
			label: '类型',
			value: 'type',
		},
		selectOptionsChildren: studio_type,
		selectItem: { key: 'display', value: 'id' }
	},
	{
		ctype: 'input',
		attr: {
			placeholder: '请输入',
			style: { width: 160 },
			allowClear: true
		},
		field: {
			label: '工作室名称',
			value: 'name',
		}
	},
	{
		ctype: 'select',
		attr: {
			placeholder: "不限",
			style: { width: 160 },
			labelInValue: true,
			allowClear: true,
		},
		field: {
			label: '快易提',
			value: 'is_support_flash',
		},
		selectOptionsChildren: isFlashConfig,
		selectItem: { key: 'display', value: 'id' }
	},
	{
		ctype: 'select',
		attr: {
			placeholder: '不限',
			style: { width: 160 },
			labelInValue: true,
			allowClear: true
		},
		field: {
			label: '平台',
			value: 'supported_platforms',
		},
		selectOptionsChildren: studio_supported_platforms,
		selectItem: { key: 'display', value: 'id' }
	},
	{
		ctype: 'rangePicker',
		attr: {
			placeholder: ['开始时间', '结束时间'],
			format: 'YYYY-MM-DD',
			style: { width: 120 }
		},
		field: {
			label: '有效期',
			value: ['validity_start', 'validity_end'],
		}
	}
];
export const studioDetailSearchFunc = ({ source_status, source_type }) => [
	{
		ctype: 'input',
		attr: {
			placeholder: '请输入',
			style: { width: 160 },
			allowClear: true
		},
		field: {
			label: '工作室ID',
			value: 'studio_id',
		}
	},
	{
		ctype: 'select',
		attr: {
			placeholder: "不限",
			style: { width: 160 },
			labelInValue: true,
			allowClear: true,
		},
		field: {
			label: '状态',
			value: 'source_status',
		},
		selectOptionsChildren: source_status,
		selectItem: { key: 'display', value: 'id' }
	},
	{
		ctype: 'select',
		attr: {
			placeholder: '不限',
			style: { width: 160 },
			labelInValue: true,
			allowClear: true
		},
		field: {
			label: '类型',
			value: 'source_type',
		},
		selectOptionsChildren: source_type,
		selectItem: { key: 'display', value: 'id' }
	},
	{
		ctype: 'input',
		attr: {
			placeholder: '请输入',
			style: { width: 160 },
			allowClear: true
		},
		field: {
			label: '工作室名称',
			value: 'name',
		}
	},
	{
		ctype: 'input',
		attr: {
			placeholder: '请输入',
			style: { width: 160 },
			allowClear: true
		},
		field: {
			label: '打款单ID',
			value: 'source_id',
		}
	},
	{
		ctype: 'rangePicker',
		attr: {
			placeholder: ['开始时间', '结束时间'],
			format: 'YYYY-MM-DD',
			style: { width: 120 }
		},
		field: {
			label: '提现时间',
			value: ['created_at_start', 'created_at_end'],
		}
	},
	{
		ctype: 'input',
		attr: {
			placeholder: '请输入',
			style: { width: 160 },
			allowClear: true
		},
		field: {
			label: '主账号',
			value: 'identity_name',
		}
	},
	{
		ctype: 'rangeInput',
		attr: {
			placeholder: ['输入金额', '输入金额'],
			style: { width: 120 },
			allowClear: true
		},
		field: {
			label: '占用金额',
			value: ['occupy_amount_min', 'occupy_amount_max'],
		}
	},
];
