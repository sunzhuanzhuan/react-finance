import React from "react";
import { timestampToTime } from "../constans/utils";
import { billingActions } from '../constans/constant'
import { Link } from 'react-router-dom'
import qs from 'qs';
const objFilter = (obj) => {
	let newObj = { ...obj };
	Object.keys(newObj).forEach(item => {
		if (!newObj[item]) {
			delete newObj[item];
		}
	});
	return newObj;
}
export const contractConfig = [
	{
		title: '编号',
		dataIndex: 'id',
		key: 'id',
		align: 'center',
	},
	{
		title: '合同号',
		dataIndex: 'contract_no',
		key: 'contract_no',
		align: 'center',
	},
	{
		title: '包含订单',
		dataIndex: '',
		key: '',
		align: 'center',
	},
	{
		title: '包含订单总额',
		dataIndex: '',
		key: '',
		align: 'center',
	},
	{
		title: '备注',
		dataIndex: '',
		key: '',
		align: 'center',
		width: '244px',
		render: (text, { comment }) => {
			if (comment && comment.length > 30) {
				return <div title={comment}>
					{comment.slice(0, 29) + '...'}
				</div>
			} else {
				return comment
			}
		}
	},
	{
		title: '操作人',
		dataIndex: '',
		key: '',
		align: 'center',
	},
	{
		title: '创建时间',
		dataIndex: 'created_time',
		key: 'created_time',
		align: 'center',
	},
	{
		title: '操作',
		dataIndex: '',
		align: 'center',
		render: () => {
			return <span>
				<a href='/finance/contractManage/addContract'>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;
				<a href='#'>删除</a>
			</span>
		}
	}

];
export const addContractConfig = [
	{
		title: '编号',
		dataIndex: '',
		key: '',
		align: 'center',
		render: ''
	},
	{
		title: '主账号名称',
		dataIndex: '',
		key: '',
		align: 'center',
		render: ''
	},
	{
		title: '订单ID',
		dataIndex: '',
		key: '',
		align: 'center',
		render: ''
	},
	{
		title: '订单名称',
		dataIndex: '',
		key: '',
		align: 'center',
		render: ''
	},
	{
		title: '订单总额',
		dataIndex: '',
		key: '',
		align: 'center',
		render: ''
	},
	{
		title: '订单创建时间',
		dataIndex: '',
		key: '',
		align: 'center',
		render: ''
	}
]
export const addOrderConfig = [
	{
		title: '主账号名称',
		dataIndex: 'identity_name',
		key: 'identity_name',
		align: 'center',
	},
	{
		title: '订单ID',
		dataIndex: 'order_id',
		key: 'order_id',
		align: 'center',
	},
	{
		title: '订单名称',
		dataIndex: 'requirement_name',
		key: 'requirement_name',
		align: 'center',
	},
	{
		title: '订单总额',
		dataIndex: 'price',
		key: 'price',
		align: 'center',
	},
	{
		title: '订单创建时间',
		dataIndex: 'create_time',
		key: 'create_time',
		align: 'center',
	}
]
export const applyDetailConfigMap = {
	'id': {
		title: '编号',
		dataIndex: 'id',
		key: 'id',
		align: 'center',
	},
	'order_id': {
		title: '订单号',
		dataIndex: 'order_id',
		key: 'order_id',
		align: 'center',
	},
	'order_type_name': {
		title: '订单类型',
		dataIndex: 'order_type_name',
		key: 'order_type_name',
		align: 'center',
	},
	'payment_silp_status_name': {
		title: '订单状态',
		dataIndex: 'payment_silp_status_name',
		key: 'payment_silp_status_name',
		align: 'center',
	},
	'order_end_time': {
		title: '执行完成时间',
		dataIndex: 'order_end_time',
		key: 'order_end_time',
		align: 'center',
		render: (text, { order_end_time }) => {
			return timestampToTime(order_end_time);
		}
	},
	'service_cycle': {
		title: '服务时间（天）',
		dataIndex: 'service_cycle',
		key: 'service_cycle',
		align: 'center',
	},
	'expect_service_cycle': {
		title: '预计服务时间（天）',
		dataIndex: 'expect_service_cycle',
		key: 'expect_service_cycle',
		align: 'center',
	},
	'order_amount': {
		title: '订单金额',
		dataIndex: 'order_amount',
		key: 'order_amount',
		align: 'center',
	},
	'qc_write_off': {
		title: '质检金额',
		dataIndex: 'qc_write_off',
		key: 'qc_write_off',
		align: 'center',
	},
	'service_amount': {
		title: '利息',
		dataIndex: 'service_amount',
		key: 'service_amount',
		align: 'center',
	},
	'expect_service_amount': {
		title: '预计利息',
		dataIndex: 'expect_service_amount',
		key: 'expect_service_amount',
		align: 'center',
	},
	'service_fee': {
		title: '手续费',
		dataIndex: 'service_fee',
		key: 'service_fee',
		align: 'center',
	},
	'other_fee': {
		title: '其他扣款',
		dataIndex: 'other_fee',
		key: 'other_fee',
		align: 'center',
	},
	'discount_amount': {
		title: '优惠金额',
		dataIndex: 'discount_amount',
		key: 'discount_amount',
		align: 'center',
	},
	'payment_amount': {
		title: '可提金额',
		dataIndex: 'payment_amount',
		key: 'payment_amount',
		align: 'center',
	},
	'expect_payment_amount': {
		title: '预计可提金额',
		dataIndex: 'expect_payment_amount',
		key: 'expect_payment_amount',
		align: 'center',
	}
}
export const extractDetailFunc = (order_status) => {
	return [
		{
			title: '提现单号',
			dataIndex: 'id',
			key: 'id',
			width: 100,
			align: 'center',
			fixed: 'left',
			render: (text, { id }) => {
				return <a target='_blank' href={`/finance/extractManage/applyDetail?id=${id}`}>{text}</a>
			}
		},
		{
			title: '状态',
			dataIndex: 'status',
			key: 'status',
			width: 100,
			align: 'center',
			fixed: 'left',
			render: (text, { status }) => {
				return order_status[status];
			}
		},
		{
			title: '主账号名',
			dataIndex: 'identity_name',
			key: 'identity_name',
			width: 150,
			align: 'center',
		},
		{
			title: '订单总额',
			dataIndex: 'order_total_amount',
			key: 'order_total_amount',
			width: 150,
			align: 'center',
		},
		{
			title: '质检总额',
			dataIndex: 'qc_write_off',
			key: 'qc_write_off',
			width: 100,
			align: 'center',
		},
		{
			title: '利息总额',
			dataIndex: 'service_amount',
			key: 'service_amount',
			width: 100,
			align: 'center',
		},
		{
			title: '手续费总额',
			dataIndex: 'service_fee',
			key: 'service_fee',
			width: 100,
			align: 'center',
		},
		{
			title: '其他扣款总额',
			dataIndex: 'other_fee',
			key: 'other_fee',
			width: 100,
			align: 'center',
		},
		{
			title: '优惠总额',
			dataIndex: 'discount_amount',
			key: 'discount_amount',
			width: 100,
			align: 'center',
		},
		{
			title: '提现总额',
			dataIndex: 'payment_amount',
			key: 'payment_amount',
			width: 150,
			align: 'center',
			render: (text) => {
				return <span style={{ color: text > 100000 ? 'red' : '#666' }}>{text}</span>
			}
		},
		{
			title: '包含订单',
			dataIndex: 'order_num',
			key: 'order_num',
			width: 80,
			align: 'center',
		},
		{
			title: '备注',
			dataIndex: 'comment',
			key: 'comment',
			align: 'center',
			width: '244px',
			render: (text, { comment }) => {
				if (comment && comment.length > 30) {
					return <div title={comment}>
						{comment.slice(0, 29) + '...'}
					</div>
				} else {
					return comment
				}
			}
		},
		{
			title: '申请时间',
			dataIndex: 'create_time',
			key: 'create_time',
			width: 200,
			align: 'center',
		}
	]
}

export const extractNoDetailFunc = (order_status) => {
	return [
		{
			title: '提现单号',
			dataIndex: 'id',
			key: 'id',
			width: 100,
			align: 'center',
			fixed: 'left',
		},
		{
			title: '状态',
			dataIndex: 'status',
			key: 'status',
			width: 100,
			align: 'center',
			fixed: 'left',
			render: (text, { status }) => {
				return order_status[status];
			}
		},
		{
			title: '主账号名',
			dataIndex: 'identity_name',
			key: 'identity_name',
			width: 150,
			align: 'center',
		},
		{
			title: '订单总额',
			dataIndex: 'order_total_amount',
			key: 'order_total_amount',
			width: 150,
			align: 'center',
		},
		{
			title: '质检总额',
			dataIndex: 'qc_write_off',
			key: 'qc_write_off',
			width: 100,
			align: 'center',
		},
		{
			title: '利息总额',
			dataIndex: 'service_amount',
			key: 'service_amount',
			width: 100,
			align: 'center',
		},
		{
			title: '手续费总额',
			dataIndex: 'service_fee',
			key: 'service_fee',
			width: 100,
			align: 'center',
		},
		{
			title: '其他扣款总额',
			dataIndex: 'other_fee',
			key: 'other_fee',
			width: 100,
			align: 'center',
		},
		{
			title: '优惠总额',
			dataIndex: 'discount_amount',
			key: 'discount_amount',
			width: 100,
			align: 'center',
		},
		{
			title: '提现总额',
			dataIndex: 'payment_amount',
			key: 'payment_amount',
			width: 150,
			align: 'center',
		},
		{
			title: '包含订单',
			dataIndex: 'order_num',
			key: 'order_num',
			width: 80,
			align: 'center',
		},
		{
			title: '备注',
			dataIndex: 'comment',
			key: 'comment',
			align: 'center',
			width: '244px',
			render: (text, { comment }) => {
				if (comment && comment.length > 30) {
					return <div title={comment}>
						{comment.slice(0, 29) + '...'}
					</div>
				} else {
					return comment
				}
			}
		},
		{
			title: '申请时间',
			dataIndex: 'create_time',
			key: 'create_time',
			width: 200,
			align: 'center',
		}
	]
}
export const remitOrderFunc = (order_status, handleOutputDetail, handleReceiptsVisible, handleTipVisible) => {
	return [
		{
			title: '打款单ID',
			dataIndex: 'id',
			key: 'id',
			align: 'center',
		},
		{
			title: '打款状态',
			dataIndex: 'status',
			key: 'status',
			align: 'center',
			render: (text) => {
				return order_status ? order_status[text] : null
			}
		},
		{
			title: '包含主账号',
			dataIndex: 'user_id_count',
			key: 'user_id_count',
			align: 'center',
		},
		{
			title: '包含订单',
			dataIndex: 'order_count',
			key: 'order_count',
			align: 'center',

		},
		{
			title: '可提金额',
			dataIndex: 'payment_amount',
			key: 'payment_amount',
			align: 'center',

		},
		{
			title: '税金金额',
			dataIndex: 'tax_amount',
			key: 'tax_amount',
			align: 'center',
		}, {
			title: '工作室占用金额',
			dataIndex: 'occupy_amount',
			key: 'occupy_amount',
			align: 'center',
		},

		{
			title: '工作室',
			dataIndex: 'studio_name',
			key: 'studio_name',
			align: 'center',
		},
		{
			title: '创建人',
			dataIndex: 'admin_name',
			key: 'admin_name',
			align: 'center',
		},
		{
			title: '创建时间',
			dataIndex: 'created_time',
			key: 'created_time',
			align: 'center',
		},
		{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			align: 'center',
			render: (text, record) => {
				let { id, status } = record;
				let obj = { id, status };
				return <span>
					{/**
					 * status 0  待打款状态出现弹窗
					 * status 1  待还款 文案为导出还款单
					 * status 2	 待结税 文案为导出结税单
					 * status 3  已结算 无导出单据选项
					*/}
					{status === 0 ? <a href='javascript:;' className='rightGap' onClick={() => {
						handleOutputDetail(id, record)
					}}>导出打款单</a> : status === 3 ? null : <a href={`/api/flash/down_excel?${qs.stringify(obj)}`} target='_blank' className='rightGap'>{status === 1 ? '导出还款单' : '导出结税单'}</a>}
					<Link to={{
						pathname: '/finance/remitOrder/detail',
						search: `?id=${id}`,
					}} className='rightGap'>查看详情</Link>
					{/*不同状态对应不同文案及接口，接口处理在handleTipVisible（）中 */}
					{status === 3 ? null : <a href='javascript:;' className='rightGap' onClick={() => {
						handleTipVisible(status, id)
					}}>{billingActions[status]}</a>}
					{status === 3 ? null : <a href='javascript:;' onClick={() => {
						handleReceiptsVisible(record)
					}}>查看单据</a>}
				</span>
			}
		}
	];
}
export const remitDetailFunc = (payment_slip_status_name, search, handleDetailOutput, handleReceiptsVisible) => {
	return [
		{
			title: '打款状态',
			dataIndex: 'status',
			key: 'status',
			align: 'center',
			render: (text) => {
				return payment_slip_status_name ? payment_slip_status_name[text] : null;
			}
		},
		{
			title: 'excel文件',
			dataIndex: 'excel_data',
			key: 'excel_data',
			align: 'center',
			render: (text, { status, excel }) => {
				return excel && status === 0 ? <a href='javascript:;' onClick={handleDetailOutput}>查看打款单</a> : excel ? excel.map((item, index, ary) => {
					{ /* 将部分参数通过接口传给后台，objFilter过滤字段值不存在的字段 */ }
					let { id, status, status_type, studio_id, payment_type_id, excel_name } = item;
					let obj = objFilter({ id, status, status_type, studio_id, payment_type_id, excel_name });
					return <a href={`/api/flash/down_excel?${qs.stringify(obj)}`} target='_blank' className={index === ary.length - 1 ? '' : 'rightGap'} key={item.id}>{item.excel_name}</a>
				}) : null
			}
		},
		{
			title: '单据',
			dataIndex: 'action',
			key: 'action',
			align: 'center',
			render: (text, record) => {
				let obj = { ...record, id: search.id };
				return record.status === 3 ? null : <a href='javascript:;' onClick={() => {
					handleReceiptsVisible(obj)
				}}>查看单据</a>
			}
		},
		{
			title: '备注',
			dataIndex: 'comment',
			key: 'comment',
			align: 'center',
			width: '244px',
			render: (text, { comment }) => {
				if (comment && comment.length > 30) {
					return <div title={comment}>
						{comment.slice(0, 29) + '...'}
					</div>
				} else {
					return comment
				}
			}
		},
		{
			title: '操作人',
			dataIndex: 'admin_name',
			key: 'admin_name',
			align: 'center',
		},
		{
			title: '操作时间',
			dataIndex: 'created_time',
			key: 'created_time',
			align: 'center',
		}
	];
}
export const newRemitFunc = (user_name) => {
	return [
		{
			title: '提现单号',
			dataIndex: 'withdraw_id',
			key: 'withdraw_id',
			align: 'center',
		},
		{
			title: '打款单ID',
			dataIndex: 'payment_slip_id',
			key: 'payment_slip_id',
			align: 'center',
			render: (text, { payment_slip_id }) => {
				return payment_slip_id === 0 ? null : payment_slip_id
			}
		},
		{
			title: '主账号名称',
			dataIndex: 'user_id',
			key: 'user_id',
			align: 'center',
			render: (text) => {
				return user_name ? user_name[text] : null
			}
		},
		{
			title: '合作方式',
			dataIndex: 'partner_type_name',
			key: 'partner_type_name',
			align: 'center',
		},
		{
			title: '订单ID',
			dataIndex: 'order_id',
			key: 'order_id',
			align: 'center',
		},
		{
			title: '订单类型',
			dataIndex: 'order_type_name',
			key: 'order_type_name',
			align: 'center',
		},
		{
			title: '可提金额',
			dataIndex: 'payment_amount',
			key: 'payment_amount',
			align: 'center',
		},
		{
			title: '税金金额',
			dataIndex: 'tax_amount',
			key: 'tax_amount',
			align: 'center',
		},
		{
			title: '截止账单日',
			dataIndex: 'service_end_time',
			key: 'service_end_time',
			align: 'center',
		}
	]
}
export const outputRemitConfig = [
	{
		title: '打款单名称',
		dataIndex: 'excel_name',
		key: 'excel_name',
		align: 'center',
	},
	{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
		width: 100,
		align: 'center',
		render: (text, { id, status, status_type, studio_id, payment_type_id, excel_name, partner_type }) => {
			let obj = {
				id,
				status: status.toString(),
				status_type,
				studio_id,
				payment_type_id,
				excel_name,
				partner_type
			};
			let newObj = objFilter(obj);
			return <a href={`/api/flash/down_excel?${qs.stringify(newObj)}`} target='_blank'>导出</a>
		}
	}
];
export const receiptsConfig = [
	{
		title: '打款方',
		dataIndex: 'payer',
		key: 'payer',
		align: 'center',
	},
	{
		title: '收款方',
		dataIndex: 'payee',
		key: 'payee',
		align: 'center',
	},
	{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
		align: 'center',
		render: (text, { id, status, status_type, studio_id, user_id }) => {
			let obj = {
				id,
				status: status.toString(),
				status_type,
				studio_id,
				user_id
			};
			let params = {
				id,
				bill_params: [{ ...objFilter(obj) }]
			};
			return <a href={`/finance/remitOrder/paymentOrder?${qs.stringify(params)}`} target='_blank'>预览</a>
		}
	}
]
export const remitDetailOrderConfig = [
	{
		title: '提现单号',
		dataIndex: 'withdraw_id',
		key: 'withdraw_id',
		align: 'center',
	},
	{
		title: '主账号名称',
		dataIndex: 'real_name',
		key: 'real_name',
		align: 'center',
	},
	{
		title: '合作方式',
		dataIndex: 'partner_type_name',
		key: 'partner_type_name',
		align: 'center',
	},
	{
		title: '订单ID',
		dataIndex: 'order_id',
		key: 'order_id',
		align: 'center',
	},
	{
		title: '订单类型',
		dataIndex: 'order_type_name',
		key: 'order_type_name',
		align: 'center',
	},
	{
		title: '订单名称',
		dataIndex: 'order_name',
		key: 'order_name',
		align: 'center',
	},
	{
		title: '可提金额',
		dataIndex: 'payment_amount',
		key: 'payment_amount',
		align: 'center',
	},
	{
		title: '税金金额',
		dataIndex: 'tax_amount',
		key: 'tax_amount',
		align: 'center',
	},
	{
		title: '截止账期日',
		dataIndex: 'end_payment_end',
		key: 'end_payment_end',
		align: 'center',
	}
];
export const addKeys = (ary) => {
	ary.forEach((item, index) => {
		item['key'] = index;
	})
};
export const filterItem = (ary, valueObj) => {
	let arr = [];
	ary.forEach(item => {
		Object.keys(valueObj).forEach(key => {
			if (valueObj[key]) {
				if (key === 'created_time') {
					let str = item[key].split(" ")[0].replace(/-/g, "");
					(str >= valueObj[key][0] && str <= valueObj[key][1]) ? arr.push(item) : null;
				} else {
					item[key].includes(valueObj[key].toString()) ? arr.push(item) : null;
				}
			}
		})
	})
	return arr;
}
export const columnsList = (configMap, configKeys) => {
	return configKeys.map(item => configMap[item])
}

