import React from 'react'
import { Button, Tooltip } from 'antd';
import qs from 'qs';
const SUCCEED = 'succeed';
const DEFEATED = 'defeated';
const REVOCATION = 'revocation';
export const prePayFunc = (handleModal) => [
	{
		title: '打款单ID',
		dataIndex: 'payment_slip_code',
		key: 'payment_slip_code',
		align: 'center',
		width: 100
	},
	{
		title: '平台',
		dataIndex: 'platform_name',
		key: 'platform_name',
		align: 'center',
		width: 100
	},
	{
		title: '三方下单平台',
		dataIndex: 'cooperation_platform_name',
		key: 'cooperation_platform_name',
		align: 'center',
		width: 100
	},
	{
		title: '三方代理商',
		dataIndex: 'agent_name',
		key: 'agent_name',
		align: 'center',
		width: 140
	},
	{
		title: '订单ID',
		dataIndex: 'wby_order_id',
		key: 'wby_order_id',
		align: 'center',
		width: 100
	},
	{
		title: '打款金额',
		dataIndex: 'payment_amount',
		key: 'payment_amount',
		align: 'center',
		width: 100
	},
	{
		title: '打款状态',
		dataIndex: 'payment_status_desc',
		key: 'payment_status_desc',
		align: 'center',
		width: 100
	},
	{
		title: '付款公司',
		dataIndex: 'payment_company_name',
		key: 'payment_company_name',
		align: 'center',
		width: 100
	},
	{
		title: '打款单生成日期',
		dataIndex: 'created_at',
		key: 'created_at',
		align: 'center',
		width: 100
	},
	{
		title: '应回发票',
		dataIndex: 'return_invoice_amount',
		key: 'return_invoice_amount',
		align: 'center',
		width: 100
	},
	{
		title: '发票盈余',
		dataIndex: 'invoice_surplus',
		key: 'invoice_surplus',
		align: 'center',
		width: 100
	}, {
		title: '打款成功/失败时间',
		dataIndex: 'payment_time',
		key: 'payment_time',
		align: 'center',
		width: 120
	},
	{
		title: '主账号',
		dataIndex: 'main_user_name',
		key: 'main_user_name',
		align: 'center',
		width: 100
	},
	{
		title: '媒介经理',
		dataIndex: 'media_user_name',
		key: 'media_user_name',
		align: 'center',
		width: 100
	},
	{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
		align: 'center',
		fixed: 'right',
		width: 200,
		render: (text, record) => {
			return <div className='datePay-action-container'>
				{record.payment_status && record.payment_status == 1 && <Button type='primary' size='small' style={{ width: 80 }} onClick={() => {
					handleModal(record.payment_slip_id, SUCCEED, true);
				}}>打款成功</Button>}
				{record.payment_status && record.payment_status == 1 && <Button type='primary' size='small' style={{ width: 80 }} onClick={() => {
					handleModal(record.payment_slip_id, DEFEATED, true);
				}}>打款失败</Button>}
				{record.payment_status && record.payment_status == 2 && <Button type='primary' size='small' style={{ width: 80 }} href={`/finance/invoice/relatedInvoice?payment_slip_id=${record.payment_slip_id}&payment_status=pre`}>发票关联</Button>}
				{record.payment_status && record.payment_status == 2 && <Button type='primary' size='small' style={{ width: 80 }} onClick={() => {
					handleModal(record.payment_slip_id, REVOCATION, true);
				}}>打款撤销</Button>}
				<Button type='primary' size='small' style={{ width: 80 }} href={`/finance/zhangwu/detail?order_id=${record.wby_order_id}`} target="_blank">订单详情</Button>
				{record.payment_status && record.payment_status != 1 && <Button type='primary' size='small' style={{ width: 80 }} href={`/finance/trinityPay/modification?type=prePay&payment_slip_id=${record.payment_slip_id}`}>编辑</Button>}
				<Button type='primary' size='small' style={{ width: 80 }} href={`/finance/trinityPay/detail?type=prePay&payment_slip_id=${record.payment_slip_id}`} target="_blank">查看</Button>
			</div>
		}
	}
];
export const datePayFunc = (handleModal) => [
	{
		title: '打款单ID',
		dataIndex: 'payment_slip_code',
		key: 'payment_slip_code',
		align: 'center',
		width: 100,
	},
	{
		title: '汇总单ID',
		dataIndex: 'settle_id',
		key: 'settle_id',
		align: 'center',
		width: 100
	},
	{
		title: '平台',
		dataIndex: 'platform_name',
		key: 'platform_name',
		align: 'center',
		width: 100
	},
	{
		title: '三方下单平台',
		dataIndex: 'cooperation_platform_name',
		key: 'cooperation_platform_name',
		align: 'center',
		width: 100
	},
	{
		title: '三方代理商',
		dataIndex: 'agent_name',
		key: 'agent_name',
		align: 'center',
		width: 140

	},
	{
		title: '打款金额',
		dataIndex: 'payment_amount',
		key: 'payment_amount',
		align: 'center',
		width: 100

	},
	{
		title: '打款状态',
		dataIndex: 'payment_status_desc',
		key: 'payment_status_desc',
		align: 'center',
		width: 100
	},
	{
		title: '付款公司',
		dataIndex: 'payment_company_name',
		key: 'payment_company_name',
		align: 'center',
		width: 100
	},
	{
		title: '打款成功/失败时间',
		dataIndex: 'payment_time',
		key: 'payment_time',
		align: 'center',
		width: 120
	},
	{
		title: '打款单生成时间',
		dataIndex: 'created_at',
		key: 'created_at',
		align: 'center',
		width: 100
	},
	{
		title: '应回发票',
		dataIndex: 'return_invoice_amount',
		key: 'return_invoice_amount',
		align: 'center',
		width: 100
	},
	{
		title: '发票盈余',
		dataIndex: 'invoice_surplus',
		key: 'invoice_surplus',
		align: 'center',
		width: 100
	},
	{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
		align: 'center',
		fixed: 'right',
		width: 200,
		render: (text, record) => {
			return <div className='prePay-action-container'>
				{record.payment_status && record.payment_status == 1 && <Button type='primary' size='small' style={{ width: 80 }} onClick={() => {
					handleModal(record.payment_slip_id, SUCCEED, true);
				}}>打款成功</Button>}
				{record.payment_status && record.payment_status == 1 && <Button type='primary' size='small' style={{ width: 80 }} onClick={() => {
					handleModal(record.payment_slip_id, DEFEATED, true);
				}}>打款失败</Button>}
				{record.payment_status && record.payment_status == 2 && <Button type='primary' size='small' style={{ width: 80 }} href={`/finance/invoice/relatedInvoice?payment_slip_id=${record.payment_slip_id}&payment_status=dete`}>发票关联</Button>}
				{record.payment_status && record.payment_status == 2 && <Button type='primary' size='small' style={{ width: 80 }} onClick={() => {
					handleModal(record.payment_slip_id, REVOCATION, true);
				}}>打款撤销</Button>}
				<Button type='primary' size='small' style={{ width: 80 }} href={`/finance/trinityPay/dealorder?payment_slip_id=${record.payment_slip_id}&settle_type=2`} target="_blank">打款明细</Button>
				{record.payment_status && record.payment_status != 1 && <Button type='primary' size='small' style={{ width: 80 }} href={`/finance/trinityPay/modification?type=datePay&payment_slip_id=${record.payment_slip_id}`}>编辑</Button>}
				<Button type='primary' size='small' style={{ width: 80 }} href={`/finance/trinityPay/detail?type=datePay&payment_slip_id=${record.payment_slip_id}`} target="_blank">查看</Button>
			</div>
		}
	},
];
export const dealOrderCols = [
	{
		title: '订单ID',
		dataIndex: 'wby_order_id',
		key: 'wby_order_id',
		align: 'center',
		width: 100,
		render: (text, record) => {
			return <a href={`/finance/zhangwu/detail?order_id=${record.wby_order_id}`}>{text}</a>
		}
	},
	{
		title: '订单类型',
		dataIndex: 'product_line_type_desc',
		key: 'product_line_type_desc',
		align: 'center',
		width: 100
	},
	{
		title: '平台',
		dataIndex: 'platform_name',
		key: 'platform_name',
		align: 'center',
		width: 100

	},
	{
		title: '三方代理商',
		dataIndex: 'agent_name',
		key: 'agent_name',
		align: 'center',
		width: 100
	},
	{
		title: '三方下单平台',
		dataIndex: 'cooperation_platform_name',
		key: 'cooperation_platform_name',
		align: 'center',
		width: 100
	},
	{
		title: '三方平台下单时间',
		dataIndex: 'ttp_place_order_at',
		key: 'ttp_place_order_at',
		align: 'center',
		width: 100
	},
	{
		title: '三方原始成本价',
		dataIndex: 'public_cost_price',
		key: 'public_cost_price',
		align: 'center',
		width: 100
	},
	{
		title: '成本调整',
		dataIndex: 'public_cost_adjustment',
		key: 'public_cost_adjustment',
		align: 'center',
		width: 100
	},
	{
		title: '剩余成本价',
		dataIndex: 'actual_public_cost_price',
		key: 'actual_public_cost_price',
		align: 'center',
		width: 100
	},
	{
		title: '打款金额',
		dataIndex: 'payment_amount',
		key: 'payment_amount',
		align: 'center',
		width: 100
	},
	{
		title: '打款单ID',
		dataIndex: 'payment_slip_code',
		key: 'payment_slip_code',
		align: 'center',
		width: 100
	},
	{
		title: '打款状态',
		dataIndex: 'payment_status_desc',
		key: 'payment_status_desc',
		align: 'center',
		width: 100
	},
	{
		title: '付款公司',
		dataIndex: 'payment_company_name',
		key: 'payment_company_name',
		align: 'center',
		width: 100
	},
	{
		title: '三方平台订单ID',
		dataIndex: 'ttp_order_id',
		key: 'ttp_order_id',
		align: 'center',
		render: (text) => {
			return < Tooltip title={<div style={{ width: '200px' }}>{text}</div>}>
				<div style={{
					width: '100px', whiteSpace: 'nowrap', overflow: 'hidden',
					textOverflow: 'ellipsis'
				}}>{text}</div>
			</Tooltip >
		}

	},
];

export const prePayDetailColumns = [
	{
		title: '打款单ID：',
		dataIndex: 'payment_slip_code',
		key: 'payment_slip_id',
		align: 'center'
	}, {
		title: '打款单类型：',
		dataIndex: 'settle_type_desc',
		key: 'settle_type_desc',
		align: 'center',

	}, {
		title: '收款方类型：',
		dataIndex: 'payee_type_desc',
		key: 'payee_type_desc',
		align: 'center',

	}, {
		title: '三方平台订单ID：',
		dataIndex: 'ttp_order_id',
		key: 'ttp_order_id',
		align: 'center'
	},
	{
		title: '订单类型：',
		dataIndex: 'product_line_type_name',
		key: 'product_line_type_name',
		align: 'center',
	},
	{
		title: '平台：',
		dataIndex: 'platform_name',
		key: 'platform_name',
		align: 'center',
	},
	{
		title: '需求ID：',
		dataIndex: 'requirement_id',
		key: 'requirement_id',
		align: 'center',
	}, {
		title: '订单ID：',
		dataIndex: 'wby_order_id',
		key: 'wby_order_id',
		align: 'center',
	},
	{
		title: '三方下单平台：',
		dataIndex: 'cooperation_platform_name',
		key: 'cooperation_platform_name',
		align: 'center',
	},
	{
		title: '需求名称：',
		dataIndex: 'requirement_name',
		key: 'requirement_name',
		align: 'center',
	},
	{
		title: '三方代理商：',
		dataIndex: 'agent_name',
		key: 'agent_name',
		align: 'center',
	},
	{
		title: '公司简称：',
		dataIndex: 'requirement_company_name',
		key: 'requirement_company_name',
		align: 'center',
	},
	{
		title: '打款金额：',
		dataIndex: 'payment_amount',
		key: 'payment_amount',
		align: 'center',
	},
	{
		title: '所属销售：',
		dataIndex: 'requirement_sale_manager_name',
		key: 'requirement_sale_manager_name',
		align: 'center',
	},
	{
		title: '收款方式：',
		dataIndex: 'payment_type_desc',
		key: 'payment_type_desc',
		align: 'center',
	},
	{
		title: '付款公司：',
		dataIndex: 'payment_company_name',
		key: 'payment_company_name',
		align: 'center'
	},
	{
		title: '收款人名称：',
		dataIndex: 'payee_account_name',
		key: 'payee_account_name',
		align: 'center',
	},
	{
		title: '回票方式：',
		dataIndex: 'return_invoice_type_desc',
		key: 'return_invoice_type_desc',
		align: 'center'
	},
	{
		title: '收款人账号：',
		dataIndex: 'payee_account',
		key: 'payee_account',
		align: 'center'
	},
	{
		title: '应回发票：',
		dataIndex: 'return_invoice_amount',
		key: 'return_invoice_amount',
		align: 'center'
	},
	{
		title: '开户行：',
		dataIndex: 'bank',
		key: 'bank',
		align: 'center'
	},
	{
		title: '发票盈余：',
		dataIndex: 'invoice_surplus',
		key: 'invoice_surplus',
		align: 'center'
	},
	{
		title: '开户支行：',
		dataIndex: 'bank_agency',
		key: 'bank_agency',
		align: 'center'
	},
	{
		title: '发票开具方：',
		dataIndex: 'beneficiary_company',
		key: 'beneficiary_company',
		align: 'center'
	},
	{
		title: '打款单生成时间：',
		dataIndex: 'created_at',
		key: 'created_at',
		align: 'center'
	},
	{
		title: '主账号：',
		dataIndex: 'main_user_name',
		key: 'main_user_name',
		align: 'center'
	},
	{
		title: '打款状态：',
		dataIndex: 'payment_status_desc',
		key: 'payment_status_desc',
		align: 'center'
	},
	{
		title: '媒介经理：',
		dataIndex: 'media_user_name',
		key: 'media_user_name',
		align: 'center'
	},
	{
		title: '打款成功/失败时间：',
		dataIndex: 'payment_time',
		key: 'payment_time',
		align: 'center'
	},
	{
		title: '打款备注：',
		dataIndex: 'payment_remark',
		key: 'payment_remark',
		align: 'center'
	},
	{
		title: '打款截图：',
		dataIndex: 'payment_screenshot',
		key: 'payment_screenshot',
		align: 'center',
		render: (text) => {
			const urlArray = text ? Object.values(qs.parse(text)) : [];
			return <div>
				{urlArray && urlArray.map((item, index) => {
					return <div className='thum-img-box' key={index}>
						<a href={item.url} target='_blank'><img src={item.url} alt={item.name} /></a>
					</div>
				})}
			</div>
		}
	},
	{
		title: '打款撤销备注：',
		dataIndex: 'payment_revoke_reason',
		key: 'payment_revoke_reason',
		align: 'center'
	}
];
export const datePayDetailColumns = [
	{
		title: '打款单ID：',
		dataIndex: 'payment_slip_code',
		key: 'payment_slip_id',
		align: 'center'
	}, {
		title: '汇总单ID：',
		dataIndex: 'settle_id',
		key: 'settle_id',
		align: 'center',

	}, {
		title: '打款单类型：',
		dataIndex: 'settle_type_desc',
		key: 'settle_type_desc',
		align: 'center',

	}, {
		title: '收款方类型：',
		dataIndex: 'payee_type_desc',
		key: 'payee_type_desc',
		align: 'center',

	}, {
		title: '打款单生成时间：',
		dataIndex: 'created_at',
		key: 'created_at',
		align: 'center',
	},
	{
		title: '平台：',
		dataIndex: 'platform_name',
		key: 'platform_name',
		align: 'center',
	},
	{
		title: '三方下单平台：',
		dataIndex: 'cooperation_platform_name',
		key: 'cooperation_platform_name',
		align: 'center',
	},
	{
		title: '三方代理商：',
		dataIndex: 'agent_name',
		key: 'agent_name',
		align: 'center',
	},
	{
		title: '付款公司：',
		dataIndex: 'payment_company_name',
		key: 'payment_company_name',
		align: 'center',
	},
	{
		title: '打款金额：',
		dataIndex: 'payment_amount',
		key: 'payment_amount',
		align: 'center',
	},
	{
		title: '回票方式：',
		dataIndex: 'return_invoice_type_desc',
		key: 'return_invoice_type_desc',
		align: 'center',
	},
	{
		title: '收款方式：',
		dataIndex: 'payment_type_desc',
		key: 'payment_type_desc',
		align: 'center',
	},
	{
		title: '应回发票：',
		dataIndex: 'return_invoice_amount',
		key: 'return_invoice_amount',
		align: 'center',
	},
	{
		title: '收款人账号：',
		dataIndex: 'payee_account',
		key: 'payee_account',
		align: 'center',
	},
	{
		title: '发票盈余：',
		dataIndex: 'invoice_surplus',
		key: 'invoice_surplus',
		align: 'center',
	},
	{
		title: '收款人名称：',
		dataIndex: 'payee_account_name',
		key: 'payee_account_name',
		align: 'center'
	},
	{
		title: '发票开具方：',
		dataIndex: 'beneficiary_company',
		key: 'beneficiary_company',
		align: 'center'
	},
	{
		title: '开户行：',
		dataIndex: 'bank',
		key: 'bank',
		align: 'center'
	},
	{
		title: '打款状态：',
		dataIndex: 'payment_status_desc',
		key: 'payment_status_desc',
		align: 'center'
	},
	{
		title: '开户支行：',
		dataIndex: 'bank_agency',
		key: 'bank_agency',
		align: 'center'
	},
	{
		title: '打款成功/失败时间：',
		dataIndex: 'payment_time',
		key: 'payment_time',
		align: 'center'
	},
	{
		title: '打款成功截图：',
		dataIndex: 'payment_screenshot',
		key: 'payment_screenshot',
		align: 'center',
		render: (text) => {
			const urlArray = text ? Object.values(qs.parse(text)) : [];
			return <div>
				{urlArray && urlArray.map((item, index) => {
					return <div className='thum-img-box' key={index}>
						<a href={item.url} target='_blank'><img src={item.url} alt={item.name} /></a>
					</div>
				})}
			</div>
		}
	},
	{
		title: '打款备注：',
		dataIndex: 'payment_remark',
		key: 'payment_remark',
		align: 'center'
	},
	{
		title: '打款撤销备注：',
		dataIndex: 'payment_revoke_reason',
		key: 'payment_revoke_reason',
		align: 'center'
	}
];
export const modificationColumns = type => {
	switch (type) {
		case 'prePay':
			return ['payment_slip_code', 'settle_type_desc', 'payment_time', 'payee_type_desc', 'settle_type_desc', 'payee_type_desc', 'wby_order_id', 'product_line_type_name', 'ttp_order_id', 'platform_name', 'cooperation_platform_name', 'agent_name', 'requirement_id', 'requirement_name', 'requirement_company_name', 'requirement_sale_manager_name', 'payment_amount', 'payment_type_desc', 'payee_account_name', 'payee_account', 'bank_agency_province', 'bank_agency_city', 'bank', 'bank_agency', 'created_at', 'payment_status_desc', 'payment_time', 'payment_screenshot', 'payment_remark', 'payment_company_name', 'return_invoice_type_desc', 'return_invoice_amount', 'invoice_surplus', 'beneficiary_company', 'main_user_name', 'media_user_name', 'payment_revoke_reason']
		case 'datePay':
			return ['payment_slip_code', 'settle_id', 'settle_type_desc', 'payment_time', 'payee_type_desc', 'settle_type_desc', 'payee_type_desc', 'settle_id', 'platform_name', 'cooperation_platform_name', 'agent_name', 'payment_amount', 'payment_type_desc', 'payee_account_name', 'payee_account', 'bank_agency_province', 'bank_agency_city', 'bank', 'bank_agency', 'created_at', 'payment_status_desc', 'payment_time', 'payment_screenshot', 'payment_remark', 'payment_company_name', 'return_invoice_type_desc', 'return_invoice_amount', 'invoice_surplus', 'beneficiary_company', 'payment_revoke_reason']
		default:
			return [];
	}
}
