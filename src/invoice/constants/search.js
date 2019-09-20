export const relatedInvoiceSearchFunc = ({ agent, invoice_title }) => [
	{
		ctype: 'input',
		attr: {
			placeholder: '请输入',
			style: { width: 160 },
			allowClear: true
		},
		field: {
			label: '发票号',
			value: 'invoice_number',
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
			label: '三方代理商',
			value: 'business_account_id',
		},
		selectOptionsChildren: agent
	},
	{
		ctype: 'input',
		attr: {
			placeholder: '请输入',
			style: { width: 160 },
			allowClear: true
		},
		field: {
			label: '发票开具方',
			value: 'beneficiary_company',
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
			label: '发票抬头',
			value: 'invoice_title',
		},
		selectOptionsChildren: invoice_title
	}
];
export const trinityInvoiceSearchFunc = ({ invoice_title, invoice_type, invoice_source, agent }) => [
	{
		ctype: 'input',
		attr: {
			placeholder: '请输入',
			style: { width: 160 },
			allowClear: true
		},
		field: {
			label: '发票号',
			value: 'invoice_number',
		}
	},
	{
		ctype: 'select',
		attr: {
			placeholder: '不限',
			style: { width: 210 },
			labelInValue: true,
			allowClear: true
		},
		field: {
			label: '发票抬头',
			value: 'invoice_title',
		},
		selectOptionsChildren: invoice_title
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
			label: '发票类型',
			value: 'invoice_type',
		},
		selectOptionsChildren: invoice_type
	},
	{
		ctype: 'input',
		attr: {
			placeholder: '请输入',
			style: { width: 160 },
			allowClear: true
		},
		field: {
			label: '发票内容',
			value: 'invoice_content',
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
			label: '发票开具方',
			value: 'beneficiary_company',
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
			label: '开票日期',
			value: ['invoice_make_out_time_start', 'invoice_make_out_time_end'],
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
			label: '发票录入日期',
			value: ['created_at_start', 'created_at_end'],
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
			label: '发票来源',
			value: 'invoice_source',
		},
		selectOptionsChildren: invoice_source
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
			label: '三方代理商',
			value: 'business_account_id',
		},
		selectOptionsChildren: agent
	},
];
