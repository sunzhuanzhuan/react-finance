import React from 'react'
import { Spin } from 'antd'
export const prePaySearchFunc = ({ media_manager = [], payment_company = [], payment_status = [], platform = [], payment_type = [], cooperation_platform = [] }, platform_name = [], handleFetchPlatform, handleFetchAccount) => [
	{
		ctype: 'select',
		attr: {
			placeholder: '不限',
			style: { width: 160 },
			labelInValue: true,
			allowClear: true,
			showSearch: true,
			filterOption: (input, option) => (
				option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
			)
		},
		field: {
			label: '平台',
			value: 'platform_id',
		},
		selectOptionsChildren: platform
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
			label: '三方下单平台',
			value: 'cooperation_platform_id',
		},
		selectOptionsChildren: cooperation_platform
	},
	{
		ctype: 'select',
		attr: {
			placeholder: '不限',
			style: { width: 160 },
			labelInValue: true,
			allowClear: true,
			onFocus: handleFetchPlatform,
			notFoundContent: (<div style={{ paddingLeft: '10px' }} > <Spin size="small" /> </div>)
		},
		field: {
			label: '三方代理商',
			value: 'agent_id',
		},
		selectOptionsChildren: platform_name
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
			label: '打款状态',
			value: 'payment_status',
		},
		selectOptionsChildren: payment_status
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
			label: '付款公司',
			value: 'payment_company_code',
		},
		selectOptionsChildren: payment_company
	},
	{
		ctype: 'input',
		attr: {
			placeholder: '请输入',
			style: { width: 160 },
			allowClear: true
		},
		field: {
			label: '订单ID',
			value: 'wby_order_id',
		}
	},
	{
		ctype: 'rangePicker',
		attr: {
			placeholder: ['开始时间', '结束时间'],
			format: 'YYYY-MM-DD',
			style: { width: 104 }
		},
		field: {
			label: '打款单生成日期',
			value: ['public_payment_slip_created_at_started', 'public_payment_slip_created_at_ended'],
		}
	},
	{
		ctype: 'rangePicker',
		attr: {
			placeholder: ['开始时间', '结束时间'],
			format: 'YYYY-MM-DD',
			style: { width: 104 }
		},
		field: {
			label: '打款日期',
			value: ['payment_time_started', 'payment_time_ended'],
		}
	},
	{
		ctype: 'rangePicker',
		attr: {
			placeholder: ['开始时间', '结束时间'],
			format: 'YYYY-MM-DD',
			style: { width: 104 }
		},
		field: {
			label: '打款撤销日期',
			value: ['payment_revoke_time_started', 'payment_revoke_time_ended'],
		}
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
			label: '收款方式',
			value: 'payment_type',
		},
		selectOptionsChildren: payment_type
	},
	{
		ctype: 'searchSelect',
		attr: {
			action: handleFetchAccount,
			keyWord: 'name',
			dataToList: res => { return res.data },
			item: ['value', 'name'],
			style: { width: 160 }
		},
		field: {
			label: '主账号',
			value: 'main_user_id',
		}
	},
	{
		ctype: 'select',
		attr: {
			placeholder: '不限',
			style: { width: 160 },
			labelInValue: true,
			allowClear: true,
			showSearch: true,
			filterOption: (input, option) => (
				option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
			)
		},
		field: {
			label: '媒介经理',
			value: 'media_user_id',
		},
		selectOptionsChildren: media_manager
	}
];
export const datePaySearchFunc = ({ platform = [], cooperation_platform = [], payment_status = [], payment_company = [], payment_type = [] }, platform_name = [], handleFetchPlatform) => [
	{
		ctype: 'select',
		attr: {
			placeholder: '不限',
			style: { width: 160 },
			labelInValue: true,
			allowClear: true,
			showSearch: true,
			filterOption: (input, option) => (
				option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
			)
		},
		field: {
			label: '平台',
			value: 'platform_id',
		},
		selectOptionsChildren: platform
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
			label: '三方下单平台',
			value: 'cooperation_platform_id',
		},
		selectOptionsChildren: cooperation_platform
	},
	{
		ctype: 'select',
		attr: {
			placeholder: '不限',
			style: { width: 160 },
			labelInValue: true,
			allowClear: true,
			onFocus: handleFetchPlatform,
			notFoundContent: (<div style={{ paddingLeft: '10px' }} > <Spin size="small" /> </div>)
		},
		field: {
			label: '三方代理商',
			value: 'agent_id',
		},
		selectOptionsChildren: platform_name
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
			label: '打款状态',
			value: 'payment_status',
		},
		selectOptionsChildren: payment_status
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
			label: '付款公司',
			value: 'payment_company_code',
		},
		selectOptionsChildren: payment_company
	},
	{
		ctype: 'rangePicker',
		attr: {
			placeholder: ['开始时间', '结束时间'],
			format: 'YYYY-MM-DD',
			style: { width: 104 }
		},
		field: {
			label: '申请日期',
			value: ['public_payment_slip_created_at_started', 'public_payment_slip_created_at_ended'],
		}
	},
	{
		ctype: 'rangePicker',
		attr: {
			placeholder: ['开始时间', '结束时间'],
			format: 'YYYY-MM-DD',
			style: { width: 104 }
		},
		field: {
			label: '打款日期',
			value: ['payment_time_started', 'payment_time_ended'],
		}
	},
	{
		ctype: 'rangePicker',
		attr: {
			placeholder: ['开始时间', '结束时间'],
			format: 'YYYY-MM-DD',
			style: { width: 104 }
		},
		field: {
			label: '打款撤销日期',
			value: ['payment_revoke_time_started', 'payment_revoke_time_ended'],
		}
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
			label: '收款方式',
			value: 'payment_type',
		},
		selectOptionsChildren: payment_type
	},
	{
		ctype: 'input',
		attr: {
			placeholder: '请输入',
			style: { width: 160 },
			allowClear: true
		},
		field: {
			label: '汇总单ID',
			value: 'settle_id',
		},
	}
];
export const dealOrderSearchFunc = ({ platform = [], cooperation_platform = [], payment_status = [], payment_company = [] }, platform_name, handleFetchPlatform) => [
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
			value: 'platform_id',
		},
		selectOptionsChildren: platform
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
			label: '三方下单平台',
			value: 'cooperation_platform_id',
		},
		selectOptionsChildren: cooperation_platform
	},
	{
		ctype: 'select',
		attr: {
			placeholder: '不限',
			style: { width: 160 },
			labelInValue: true,
			allowClear: true,
			onFocus: handleFetchPlatform,
			notFoundContent: (<div style={{ paddingLeft: '10px' }} > <Spin size="small" /> </div>)
		},
		field: {
			label: '三方代理商',
			value: 'agent_id',
		},
		selectOptionsChildren: platform_name
	},
	{
		ctype: 'input',
		attr: {
			placeholder: '请输入',
			style: { width: 160 },
			allowClear: true
		},
		field: {
			label: '订单ID',
			value: 'wby_order_id',
		},
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
			value: 'payment_slip_code',
		},
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
			label: '打款状态',
			value: 'payment_status',
		},
		selectOptionsChildren: payment_status
	},
	{
		ctype: 'rangePicker',
		attr: {
			placeholder: ['开始时间', '结束时间'],
			format: 'YYYY-MM-DD',
			style: { width: 104 }
		},
		field: {
			label: '三方平台下单时间',
			value: ['ttp_place_order_at_started', 'ttp_place_order_at_ended'],
		}
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
			label: '付款公司',
			value: 'payment_company_code',
		},
		selectOptionsChildren: payment_company
	}
];
