import React from 'react'
import { InputNumber, Button, Form } from 'antd'
const FormItem = Form.Item;
function checkPrice(record, rule, value, callback) {
	if (value || parseFloat(value) == 0) {
		const reg = /^[1-9]?\d+(\.\d\d?)?$/;
		if (parseFloat(value) > parseFloat(record.rest_amount)) {
			callback('使用金额不能大于发票余额');
		}
		if (!reg.test(value)) {
			callback('请输入最多保留两位的有效数字')
		}
		if (parseFloat(value) == 0) {
			callback('使用金额不能为0')
		}
	}
}
export const relatedInvoiceFunc = (handleDel) => [
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
		title: '发票金额',
		dataIndex: 'invoice_amount',
		key: 'invoice_amount',
		align: 'center',
		width: 100

	},
	{
		title: '本次使用金额',
		dataIndex: 'use_amount',
		key: 'use_amount',
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
		title: '操作',
		dataIndex: 'action',
		key: 'action',
		align: 'center',
		width: 100,
		render: (text, record) => {
			return <Button type='primary' onClick={() => {
				handleDel(record.id)
			}}>删除</Button>
		}
	}
];
export const availableInvoiceFunc = (getFieldDecorator, handleSelected, rowsMap, selectedRowKeys) => [
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
		title: '发票抬头',
		dataIndex: 'invoice_title_desc',
		key: 'invoice_title_desc',
		align: 'center',
		width: 100
	},
	{
		title: '发票金额',
		dataIndex: 'invoice_amount',
		key: 'invoice_amount',
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
		title: '使用金额',
		dataIndex: 'price',
		key: 'price',
		align: 'center',
		width: 100,
		render: (text, record) => {
			return <FormItem>
				{getFieldDecorator(`${record.invoice_id}.price`, {
					rules: [{
						validator: (...args) => { checkPrice(record, ...args) }
					}]
				})(
					<InputNumber min={0.01} formatter={value => `${value}`.replace(/[^\d||.]/g, '')} onBlur={(e) => {
						const value = e.target.value;
						if (!value) {
							const obj = { ...rowsMap };
							delete obj[record.invoice_id.toString()];
							handleSelected(Object.keys(obj), Object.values(obj));
							return
						}
						if (value && rowsMap[record.invoice_id.toString()]) {
							const obj = { ...record, price: value };
							const newRowsMap = { ...rowsMap, [record.invoice_id.toString()]: obj };
							handleSelected(Object.keys(newRowsMap), Object.values(newRowsMap));
						}
					}} />
				)
				}
			</FormItem>
			// return <div>
			// <InputNumber id={`${record.invoice_number}`} formatter={value => `${value}`.replace(/[^\d||.]/g, '')} disabled={selectedRowKeys.includes(record.invoice_number)} onChange={(value) => {
			// 	handleChange(value, record);
			// }} />
			// 	<p className={`red-font ${record.invoice_number}`} style={{ display: 'none', margin: 0 }}>使用金额应小于发票余额!</p>
			// </div>
		}
	}
];
