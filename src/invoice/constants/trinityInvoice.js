import React from 'react'
import { Button } from 'antd'
export const trinityInvoiceFunc = (handleModal, handleCheckModal, handleDelete) => [
	{
		title: '发票号',
		dataIndex: 'invoice_number',
		key: 'invoice_number',
		align: 'center',
		width: 100
	},
	{
		title: '发票开具方',
		dataIndex: 'beneficiary_company',
		key: 'beneficiary_company',
		align: 'center',
		width: 100
	},
	{
		title: '三方代理商',
		dataIndex: 'business_account_name',
		key: 'business_account_name',
		align: 'center',
		width: 100
	},
	{
		title: '发票总金额',
		dataIndex: 'invoice_amount',
		key: 'invoice_amount',
		align: 'center',
		width: 100
	},
	{
		title: '发票内容',
		dataIndex: 'invoice_content',
		key: 'invoice_content',
		align: 'center',
		width: 100
	},
	{
		title: '发票类型',
		dataIndex: 'invoice_type_desc',
		key: 'invoice_type_desc',
		align: 'center',
		width: 100
	},
	{
		title: '发票抬头',
		dataIndex: 'invoice_title_desc',
		key: 'invoice_title_desc',
		align: 'center',
		width: 100
	},
	{
		title: '发票状态',
		dataIndex: 'invoice_status_desc',
		key: 'invoice_status_desc',
		align: 'center',
		width: 100
	},
	{
		title: '发票余额',
		dataIndex: 'rest_amount',
		key: 'rest_amount',
		align: 'center',
		width: 100
	},
	{
		title: '开票日期',
		dataIndex: 'invoice_make_out_time',
		key: 'invoice_make_out_time',
		align: 'center',
		width: 100
	},
	{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
		align: 'center',
		width: 100,
		render: (text, record) => {
			return <div>
				{(record.invoice_status == 1 || record.invoice_status == 2) && <div>
					<Button type='primary' size='small' style={{ width: 80 }} onClick={() => {
						handleModal('modification', true, record, record.invoice_status)
					}}>编辑</Button>
				</div>}
				<div className='little-top-gap'>
					<Button type='primary' size='small' style={{ width: 80 }} onClick={() => {
						handleCheckModal(true, record)
					}}>查看</Button>
				</div>
				{record.invoice_status == 1 && <div className='little-top-gap'>
					<Button type='primary' size='small' style={{ width: 80 }} onClick={() => {
						handleDelete(record.invoice_id)
					}}>删除</Button>
				</div>}
			</div>
		}
	}
];

export const checkModalCols = [
	{
		title: '发票来源',
		dataIndex: 'invoice_source_desc',
		key: 'invoice_source_desc',
		align: 'center',
		render: text => {
			return text || '-'
		}
	},
	{
		title: '发票号',
		dataIndex: 'invoice_number',
		key: 'invoice_number',
		align: 'center',
		render: text => {
			return text || '-'
		}
	},
	{
		title: '三方代理商',
		dataIndex: 'business_account_name',
		key: 'business_account_name',
		align: 'center',
		render: text => {
			return text || '-'
		}
	},
	{
		title: '发票抬头',
		dataIndex: 'invoice_title_desc',
		key: 'invoice_title_desc',
		align: 'center',
		render: text => {
			return text || '-'
		}
	},
	{
		title: '发票开具方',
		dataIndex: 'beneficiary_company',
		key: 'beneficiary_company',
		align: 'center',
		render: text => {
			return text || '-'
		}
	},
	{
		title: '发票内容',
		dataIndex: 'invoice_content',
		key: 'invoice_content',
		align: 'center',
		render: text => {
			return text || '-'
		}
	},
	{
		title: '发票类型',
		dataIndex: 'invoice_type_desc',
		key: 'invoice_type_desc',
		align: 'center',
		render: text => {
			return text || '-'
		}
	},
	{
		title: '发票税率',
		dataIndex: 'invoice_tax_rate',
		key: 'invoice_tax_rate',
		align: 'center',
		render: text => {
			return text || '-'
		}
	},
	{
		title: '发票总金额',
		dataIndex: 'invoice_amount',
		key: 'invoice_amount',
		align: 'center',
		render: text => {
			return text || '-'
		}
	},
	{
		title: '发票金额',
		dataIndex: 'invoice_pure_amount',
		key: 'invoice_pure_amount',
		align: 'center',
		render: text => {
			return text || '-'
		}
	},
	{
		title: '发票税额',
		dataIndex: 'invoice_tax_amount',
		key: 'invoice_tax_amount',
		align: 'center',
		render: text => {
			return text || '-'
		}
	},
	{
		title: '发票状态',
		dataIndex: 'invoice_status_desc',
		key: 'invoice_status_desc',
		align: 'center',
		render: text => {
			return text || '-'
		}
	},
	{
		title: '发票余额',
		dataIndex: 'rest_amount',
		key: 'rest_amount',
		align: 'center',
		render: text => {
			return text || '-'
		}
	},
	{
		title: '开票日期',
		dataIndex: 'invoice_make_out_time',
		key: 'invoice_make_out_time',
		align: 'center',
		render: text => {
			return text || '-'
		}
	},
	{
		title: '录入日期',
		dataIndex: 'created_at',
		key: 'created_at',
		align: 'center',
		render: (text, record) => {
			console.log(record)
			return text || '-'
		}
	},
	{
		title: '备注',
		dataIndex: 'remark',
		key: 'remark',
		align: 'center',
		render: text => {
			return text || '-'
		}
	},
]
