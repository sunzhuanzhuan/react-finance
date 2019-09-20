import React from "react";
import numeral from "numeral";
export const studioConfigFunc = (handleStopStudio, handleStartStudio, history) => [
	{
		title: '工作室ID',
		dataIndex: 'id',
		key: 'id',
		align: 'center',
		width: 80,
		// fixed: 'left'
	},
	{
		title: '状态',
		dataIndex: 'status_display',
		key: 'status_display',
		align: 'center',
		width: 120
	},
	{
		title: '名称',
		dataIndex: 'name',
		key: 'name',
		align: 'center',
		width: '244px',
		render: (text, { name }) => {
			if (name && name.length > 30) {
				return <div title={name}>
					{name.slice(0, 29) + '...'}
				</div>
			} else {
				return name
			}
		}
	},
	{
		title: '类型',
		dataIndex: 'type_display',
		key: 'type_display',
		align: 'center',
		width: 80
	},
	{
		title: '平台',
		dataIndex: 'supported_platforms_display',
		key: 'supported_platforms_display',
		align: 'center',
		width: 100
	},
	{
		title: '快易提',
		dataIndex: 'is_support_flash',
		key: 'is_support_flash',
		align: 'center',
		width: 100,
		render: (text) => {
			const value = text === 1 ? '支持' : '不支持';
			return value
		}
	},
	{
		title: '非身份证',
		dataIndex: 'is_support_not_id_card',
		key: 'is_support_not_id_card',
		align: 'center',
		width: 120,
		render: (text) => {
			return text == 1 ? '支持' : '不支持';
		}
	},
	{
		title: '有效期',
		dataIndex: 'validity',
		key: 'validity',
		align: 'center',
		width: 200,
		render: (text, record) => {
			return `${record.validity_start}~${record.validity_end}`
		}
	},
	{
		title: '支付方式',
		dataIndex: 'b',
		key: 'b',
		align: 'center',
		width: 140,
		render: (text, record) => {
			const isAlipay = record.is_support_alipay === 1;
			const isBank = record.payment_type_id !== 0;
			const value = isAlipay && isBank ? '支付宝&银行卡' : isAlipay ? '支付宝' : '银行卡';
			return value
		}
	},
	{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
		align: 'center',
		width: 160,
		// fixed: 'right',
		render: (Text, record) => {
			return <div>
				<a href='javascript:;' onClick={() => {
					history.push(`/finance/studiomanage/new?postType=2&id=${record.id}&name=${record.name}`);
				}}>编辑</a>
				<a className='little-left-gap' target='_blank' href={`/finance/studioManage/check?id=${record.id}`} >查看</a>
				{record.status === 1 ? <a href='javascript:;' className='little-left-gap' onClick={() => {
					handleStopStudio(record);
				}}>停用</a> : null
				}
				{record.status === 0 || record.status === 2 ? <a href='javascript:;' className='little-left-gap' onClick={() => {
					handleStartStudio(record);
				}}>启用</a> : null}
				{/* <a href='javascript:;' className='left-gap'>使用详情</a> */}
			</div>
		}
	}
]
export const detailConfig = [
	{
		title: '工作室ID',
		dataIndex: 'studio_id',
		key: 'studio_id',
		align: 'center',
	},
	{
		title: '工作室名称',
		dataIndex: 'name',
		key: 'name',
		align: 'center',
	},
	{
		title: '打款单ID',
		dataIndex: 'source_id',
		key: 'source_id',
		align: 'center',
		render: (text, record) => {
			return <a target='_blank' href={record.payment_link} >{text}</a>
		}
	},
	{
		title: '状态',
		dataIndex: 'source_status_display',
		key: 'source_status_display',
		align: 'center'
	},
	{
		title: '类型',
		dataIndex: 'source_type_display',
		key: 'source_type_display',
		align: 'center'
	},
	{
		title: '主账号名称',
		dataIndex: 'identity_name_list',
		key: 'identity_name_list',
		align: 'center',
		width: '244px',
		render: (text, { identity_name_list }) => {
			let nameList = identity_name_list.map((item, index) => {
				return index === identity_name_list.length - 1 ? item : item + ',';
			});
			if (nameList && nameList.length > 30) {
				return <div title={nameList}>
					{nameList.slice(0, 29) + '...'}
				</div>
			} else {
				return nameList
			}
		}
	},
	{
		title: '占用金额',
		dataIndex: 'occupy_amount',
		key: 'occupy_amount',
		align: 'center',
		render: (text) => {
			return numeral(text / 100).format('0,0.00')
		}
	},
	{
		title: '实付金额',
		dataIndex: 'payment_amount',
		key: 'payment_amount',
		align: 'center',
		render: (text) => {
			return numeral(text / 100).format('0,0.00')
		}

	},
	{
		title: '税金',
		dataIndex: 'tax_to_partner',
		key: 'tax_to_partner',
		align: 'center',
		render: (text) => {
			return numeral(text / 100).format('0,0.00')
		}

	},
	{
		title: '提现时间',
		dataIndex: 'created_at',
		key: 'created_at',
		align: 'center'
	}
];
export const orderConfig = [
	{
		title: '状态',
		dataIndex: 'id',
		key: 'id',
		align: 'center',
		width: 100,
		fixed: 'left'
	},
	{
		title: '工作室ID',
		dataIndex: 'status',
		key: 'status',
		align: 'center'
	},
	{
		title: '工作室名称',
		dataIndex: 'user_id_count',
		key: 'user_id_count',
		align: 'center',
	},
	{
		title: '主账号名称',
		dataIndex: 'order_count',
		key: 'order_count',
		align: 'center',

	},
	{
		title: '订单ID',
		dataIndex: 'payment_amount',
		key: 'payment_amount',
		align: 'center',

	},
	{
		title: '订单名称',
		dataIndex: 'tax_amount',
		key: 'tax_amount',
		align: 'center',

	},
	{
		title: '订单总金额',
		dataIndex: 'admin_name',
		key: 'admin_name',
		align: 'center',
	},
	{
		title: '订单收入',
		dataIndex: 'created_time',
		key: 'created_time',
		align: 'center',
	},
	{
		title: '税收',
		dataIndex: 'tax',
		key: 'tax',
		align: 'center',
	}
];
export const detailColumns = [
	{
		title: '作室名称：',
		dataIndex: 'name',
		key: 'name',
		align: 'center'
	},
	{
		title: '打款标识：',
		dataIndex: 'identity',
		key: 'identity',
		align: 'center',

	},
	{
		title: '类型：',
		dataIndex: 'type',
		key: 'type',
		align: 'center',
		render: text => {
			return text == 1 ? '自由' : text == 2 ? '三方' : '-'
		}
	},
	{
		title: '支持平台：',
		dataIndex: 'supported_platforms',
		key: 'supported_platforms',
		align: 'center',
		render: text => {
			return text == 1 ? '不限' : text == 2 ? '快手' : '-'
		}
	},
	{
		title: '快易提：',
		dataIndex: 'is_support_flash',
		key: 'is_support_flash',
		align: 'center',
		render: text => {
			return text == 1 ? '支持' : text == 2 ? '不支持' : '-'
		}
	},
	{
		title: '非身份证：',
		dataIndex: 'is_support_not_id_card',
		key: 'is_support_not_id_card',
		align: 'center',
		render: text => {
			return text == 1 ? '支持' : text == 2 ? '不支持' : '-'
		}
	},
	{
		title: '总限额：',
		dataIndex: 'total_limit',
		key: 'total_limit',
		align: 'center',
	},
	{
		title: '冻结额度：',
		dataIndex: 'requirement_name',
		key: 'requirement_name',
		align: 'center',
	},
	{
		title: '使用限额：',
		dataIndex: 'agent_name',
		key: 'agent_name',
		align: 'center',
	},
	{
		title: '剩余额度：',
		dataIndex: 'requirement_company_name',
		key: 'requirement_company_name',
		align: 'center',
	},
	{
		title: '单笔限额：',
		dataIndex: 'single_limit',
		key: 'single_limit',
		align: 'center',
	},
	{
		title: '博主单月累计限额：',
		dataIndex: 'monthly_limit',
		key: 'monthly_limit',
		align: 'center',
	},
	{
		title: '支付方式',
		dataIndex: 'payment_type',
		key: 'payment_type',
		align: 'center',
		colspan: 3,
		width: 140,
		render: (text, record) => {
			const isAlipay = record.is_support_alipay === 1;
			const isBank = record.payment_type_id !== 0;
			const value = isAlipay && isBank ? '支付宝&银行卡' : isAlipay ? '支付宝' : '银行卡';
			return value
		}
	},
	{
		title: '银行卡开户行：',
		dataIndex: 'bank_agency',
		key: 'bank_agency',
		align: 'center'
	},
	{
		title: '开户支行：',
		dataIndex: 'bank_agency',
		key: 'bank_agency',
		align: 'center',
	},
	{
		title: '开户行所在省：',
		dataIndex: 'bank_agency_province',
		key: 'bank_agency_province',
		align: 'center'
	},
	{
		title: '开户行所在市：',
		dataIndex: 'bank_agency_city',
		key: 'bank_agency_city',
		align: 'center'
	},
	{
		title: '持卡人：',
		dataIndex: 'real_name',
		key: 'real_name',
		align: 'center'
	},
	{
		title: '卡号：',
		dataIndex: 'card_number',
		key: 'card_number',
		align: 'center'
	},
	{
		title: '支付宝名称：',
		dataIndex: 'alipay_real_name',
		key: 'alipay_real_name',
		align: 'center'
	},
	{
		title: '支付宝账号：',
		dataIndex: 'alipay_card_number',
		key: 'alipay_card_number',
		align: 'center'
	},
	{
		title: '税率：',
		dataIndex: 'invoice_tax_rate',
		key: 'invoice_tax_rate',
		align: 'center'
	},
	{
		title: '发票抬头：',
		dataIndex: 'invoice_provider',
		key: 'invoice_provider',
		align: 'center'
	},
	{
		title: '操作人：',
		dataIndex: 'main_user_name',
		key: 'main_user_name',
		align: 'center'
	},
	{
		title: '有效期：',
		dataIndex: 'validity_time',
		key: 'validity_time',
		align: 'center',
		render: (text, record) => {
			return record.validity_start + '~' + record.validity_end
		}
	},
	{
		title: '备注：',
		dataIndex: 'remark',
		key: 'remark',
		align: 'center'
	},
	{
		title: '修订时间：',
		dataIndex: 'payment_time',
		key: 'payment_time',
		align: 'center'
	}
];
export const idCardExportColumns = [
	{
		title: '任务ID',
		dataIndex: 'job_code',
		key: 'job_code',
		align: 'center'
	},
	{
		title: '任务名称',
		dataIndex: 'job_name',
		key: 'job_name',
		align: 'center',

	},
	{
		title: '月份',
		dataIndex: 'month',
		key: 'month',
		align: 'center',
	},
	{
		title: '启动时间',
		dataIndex: 'created_at',
		key: 'created_at',
		align: 'center',
	},
	{
		title: '开始时间',
		dataIndex: 'start_at',
		key: 'start_at',
		align: 'center',
		render: text => {
			return text || '-'
		}
	},
	{
		title: '结束时间',
		dataIndex: 'completed_at',
		key: 'completed_at',
		align: 'center',
		render: text => {
			return text || '-'
		}
	},
	{
		title: '任务状态',
		dataIndex: 'status_display',
		key: 'status_display',
		align: 'center',
	},
	{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
		align: 'center',
		render: (text, record) => {
			return record.status == 3 && <a href={`/api/finance/jobRecord/download?job_result=${record.job_result}`}>下载</a>
		}
	}
];
export const bankList = {
	"7": {
		bankName: "招商银行",
		bankCode: "CMB",
		patterns: [{
			reg: /^(402658|410062|468203|512425|524011|622580|622588|622598|622609|95555|621286|621483|621485|621486|621299)\d{10}$/g,
			cardType: "DC"
		}, {
			reg: /^(690755)\d{9}$/g,
			cardType: "DC"
		}, {
			reg: /^(690755)\d{12}$/g,
			cardType: "DC"
		}, {
			reg: /^(356885|356886|356887|356888|356890|439188|439227|479228|479229|521302|356889|545620|545621|545947|545948|552534|552587|622575|622576|622577|622578|622579|545619|622581|622582|545623|628290|439225|518710|518718|628362|439226|628262|625802|625803)\d{10}$/g,
			cardType: "CC"
		}, {
			reg: /^(370285|370286|370287|370289)\d{9}$/g,
			cardType: "CC"
		}, {
			reg: /^(620520)\d{13}$/g,
			cardType: "PC"
		}]
	},
	"3": {
		bankName: "中国建设银行",
		bankCode: "CCB",
		patterns: [{
			reg: /^(621284|436742|589970|620060|621081|621467|621598|621621|621700|622280|622700|623211|623668)\d{13}$/g,
			cardType: "DC"
		}, {
			reg: /^(421349|434061|434062|524094|526410|552245|621080|621082|621466|621488|621499|622966|622988|622382|621487|621083|621084|620107)\d{10}$/g,
			cardType: "DC"
		}, {
			reg: /^(436742193|622280193)\d{10}$/g,
			cardType: "DC"
		}, {
			reg: /^(553242)\d{12}$/g,
			cardType: "CC"
		}, {
			reg: /^(625362|625363|628316|628317|356896|356899|356895|436718|436738|436745|436748|489592|531693|532450|532458|544887|552801|557080|558895|559051|622166|622168|622708|625964|625965|625966|628266|628366|622381|622675|622676|622677)\d{10}$/g,
			cardType: "CC"
		}, {
			reg: /^(5453242|5491031|5544033)\d{11}$/g,
			cardType: "CC"
		}, {
			reg: /^(622725|622728|436728|453242|491031|544033|622707|625955|625956)\d{10}$/g,
			cardType: "SCC"
		}, {
			reg: /^(53242|53243)\d{11}$/g,
			cardType: "SCC"
		}]
	}
};
export const isFlashConfig = [
	{ id: '', display: '全部' },
	{ id: 1, display: '支持' },
	{ id: 2, display: '不支持' },
]
export const postTypeMap = {
	'create': '1',
	'modified': '2'
}
