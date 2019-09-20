import React from "react";
import qs from 'qs';
export const zhangListFunc = (handleNewModal) => {
	return [
		{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			align: 'center',
			fixed: 'left',
			width: 100,
			render: (text, record) => {
				return <span>
					<a href='javascript:;' onClick={() => {
						handleNewModal(record)
					}}>详情</a>
				</span>
			}
		},
		{
			title: '订单ID',
			dataIndex: 'order_id',
			key: 'order_id',
			align: 'center',
			width: 100,
		},
		{
			title: '公司简称',
			dataIndex: 'company_name',
			key: 'company_name',
			align: 'center',
			width: 100,
		},
		{
			title: '所属销售',
			dataIndex: 'sale_manager_name',
			key: 'sale_manager_name',
			align: 'center',
			width: 100,
		},
		{
			title: '主账号',
			dataIndex: 'identity_name',
			key: 'identity_name',
			align: 'center',
			width: 100,
		},
		{
			title: '账号名称',
			dataIndex: 'weibo_name',
			key: 'weibo_name',
			align: 'center',
			width: 100,
		},
		{
			title: '合作方类型',
			dataIndex: 'partner_type',
			key: 'partner_type',
			align: 'center',
			width: 100,
		},
		{
			title: '媒介经理',
			dataIndex: 'media_manager_name',
			key: 'media_manager_name',
			align: 'center',
			width: 100,
		},
		{
			title: '平台',
			dataIndex: 'platform_name',
			key: 'platform_name',
			width: 100,
			align: 'center',
		},
		{
			title: '订单执行状态',
			dataIndex: 'execution_status',
			key: 'execution_status',
			align: 'center',
			width: 100,
		},
		{
			title: '三方标识',
			dataIndex: 'trinity_type',
			key: 'trinity_type',
			align: 'center',
			width: 100,
		},
		{
			title: '账号报价',
			dataIndex: 'total_account_quote_price',
			key: 'total_account_quote_price',
			align: 'center',
			width: 100,
			render: (text) => {
				return parseFloat(text).toFixed(2)
			}
		},
		{
			title: '订单成本价',
			dataIndex: 'total_cost_price',
			key: 'total_cost_price',
			align: 'center',
			width: 100,
			render: (text) => {
				return parseFloat(text).toFixed(2)
			}
		},
		{
			title: '对外报价',
			dataIndex: 'total_quote_price',
			key: 'total_quote_price',
			align: 'center',
			width: 100,
			render: (text) => {
				return parseFloat(text).toFixed(2)
			}
		},
		{
			title: '执行价',
			dataIndex: 'total_deal_price',
			key: 'total_deal_price',
			align: 'center',
			width: 100,
			render: (text) => {
				return parseFloat(text).toFixed(2)
			}
		}



	];
}
