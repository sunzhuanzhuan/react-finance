import React from 'react'
import { Popconfirm, Popover, Button } from 'antd'
export const payback_status_map = {
	'WAIT_FOR_PAY': 0,
	'ALREADY_PART_PAY': 1,
	'ALREADY_FOR_PAY': 2
}
export const invoice_type = {
	'NORMAL_INVOICE': 1,
	'SPECAIAL_INVOICE': 2
}
export const invoice_content_type = {
	'TECHNICAL_SERVICE': 1,
	'INFORMATION_SERVICE': 2,
	'ADVERTISING_SERVICE': 3,
	'ADVERTISING_EXPENSE': 4
}
export const beneficiary_company = {
	'WEIYIHUIHUANG': 1,
	'XUNDAWANGMAI': 2,
	'WEIBOYI': 4,
	'BUGUNIAO': 5
}
export const status_display_map = {
	'YIKAI': '已开',
	'YIJI': '已寄'
}
export const orderColumnsFunc = (flag, handlePass, handleRefuse) => {
	return [
		{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			align: 'center',
			width: 100,
			fixed: 'left',
			render: (text, record) => {
				return (<div>
					{flag ? (record.display == "赔偿拒绝" || record.display == "赔偿通过") ? null : <div>
						<Button type="primary" onClick={() => { handlePass(record) }}>通过</Button>
						<Popconfirm title="确定要拒绝?" okText="确定" cancelText="取消" onConfirm={() => { handleRefuse(record.order_id) }}>
							<Button type="primary" style={{ marginTop: '20px' }}>拒绝</Button>
						</Popconfirm>
					</div> : ""}
				</div>)
			}
		}, {
			title: '订单ID',
			dataIndex: 'order_id',
			key: 'order_id',
			width: 130,
			fixed: 'left',
			align: 'center',
			render: (text, record) => {
				return (<div >
					订单ID:<a target='_blank' href={record.order_link}>{record.order_id}</a><br />
					{record.evidence ? record.evidence.map((item, index) => {
						return (
							<p key={index}>PO：<a target='_blank' href={record.evidence_link + item.execution_evidence_id}>{item.execution_evidence_code} </a></p>
						)
					}) : null}
				</div >)
			}
		}, {
			title: '需求名称',
			dataIndex: 'requirement_name',
			key: 'requirement_name',
			align: 'center',
		}, {
			title: '赔偿ID',
			dataIndex: 'reparation_id',
			key: 'reparation_id',
			align: 'center',
		}, {
			title: '赔偿金额',
			dataIndex: 'reparation_amount',
			key: 'reparation_amount',
			align: 'center',
		}, {
			title: '结算金额',
			dataIndex: 'deal_price',
			key: 'deal_price',
			align: 'center',
		}, {
			title: '赔偿原因',
			dataIndex: 'reparation_reason',
			key: 'execution_price',
			align: 'center',
			render: (text, record) => {
				const content = (
					<div style={{ width: '200px' }}>
						<p style={{ width: '200px' }}>赔偿原因:{record.reparation_reason}</p>
						<p style={{ width: '200px' }}>备注:{flag && record.remarks ? record.remarks : "-"}</p>
					</div>
				);
				return (<div>
					<Popover content={content} title="详情">
						<a href='javascript:;'>查看详情</a>
					</Popover>

				</div>);
			}
		}, {
			title: '所属销售',
			dataIndex: 'owner_user_name',
			key: 'owner_user_name',
			align: 'center',
		}, {
			title: '申请人',
			dataIndex: 'operator_name',
			key: 'operator_name',
			align: 'center',
		}, {
			title: '赔偿状态',
			dataIndex: 'display',
			key: 'display',
			align: 'center',
		}, {
			title: '时间',
			dataIndex: 'time',
			key: 'time',
			align: 'center',
			render: (text, record) => {
				return (
					<div>
						<p>申请时间：{record.created_at}</p>
						<p>通过/拒绝时间：{record.display == '赔偿申请中' ? '-' : record.updated_at}</p>
					</div>
				)
			}
		}, {
			title: '公司简称',
			dataIndex: 'company_name',
			key: 'company_name',
			align: 'center',
		}, {
			title: 'A端登录名',
			dataIndex: 'username',
			key: 'username',
			align: 'center',
		}
	]
}
