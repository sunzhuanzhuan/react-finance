import React from "react";
import qs from 'qs';
export const missionListFunc = (handleNewModal, handleDelete, saleName = [], region = []) => {
	return [
		{
			title: '区域',
			dataIndex: 'region',
			key: 'region',
			align: 'center',
			render: (text, record) => {
				let _region = region.find(item => item.id === record.region);
				return _region ? _region.display : null;
			}
		},
		{
			title: '销售名称',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			render: (text, record) => {
				let name = saleName.find(item => item.user_id === record.sale_id);
				return name ? name.real_name : null;
			}
		},
		{
			title: '用户ID',
			dataIndex: 'sale_id',
			key: 'sale_id',
			align: 'center',
		},
		{
			title: '月份',
			dataIndex: 'month',
			key: 'month',
			align: 'center',
		},
		{
			title: '视频原创',
			dataIndex: 'original_target',
			key: 'original_target',
			align: 'center',
		},
		{
			title: '视频分发',
			dataIndex: 'distribute_target',
			key: 'distribute_target',
			align: 'center',
		},
		{
			title: '视频总计',
			dataIndex: 'video_target',
			key: 'video_target',
			align: 'center',
			render: (text) => {
				return parseFloat(text).toFixed(2)
			}
		},
		{
			title: '非视频',
			dataIndex: 'not_video_target',
			key: 'not_video_target',
			align: 'center',
		},
		{
			title: '总任务',
			dataIndex: 'all_target',
			key: 'all_target',
			align: 'center',
			render: (text) => {
				return parseFloat(text).toFixed(2)
			}
		},
		{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			align: 'center',
			render: (text, record) => {
				return <span>
					<a href='javascript:;' onClick={() => {
						handleNewModal('check', record)
					}}>查看</a>
					<a href='javascript:;' className='left-gap' onClick={() => {
						handleNewModal('mod', record)
					}}>修改</a>
					<a href='javascript:;' className='left-gap' onClick={() => {
						handleDelete(record.id)
					}}>删除</a>
				</span>
			}
		}

	];
}
export const businessListFunc = (handleNewModal, handleDelete, saleName = []) => {
	return [
		{
			title: '姓名',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			render: (text, record) => {
				let name = saleName.find(item => item.user_id == record.sale_id);
				return name ? name.real_name : null
			}
		},
		{
			title: '用户ID',
			dataIndex: 'sale_id',
			key: 'sale_id',
			align: 'center',
		},
		{
			title: '岗位类型',
			dataIndex: 'position_level',
			key: 'position_level',
			align: 'center',
		},
		{
			title: '收费模式',
			dataIndex: 'quote_type',
			key: 'quote_type	',
			align: 'center',
		},
		{
			title: '视频原创',
			dataIndex: 'original_rate',
			key: 'original_rate',
			align: 'center',
			render: (text) => {
				return text + '%'
			}
		},
		{
			title: '视频分发',
			dataIndex: 'distribute_rate',
			key: 'distribute_rate',
			align: 'center',
			render: (text) => {
				return text + '%'
			}
		},
		{
			title: '非视频',
			dataIndex: 'no_video_rate',
			key: 'no_video_rate',
			align: 'center',
			render: (text) => {
				return text + '%'
			}
		},
		{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			align: 'center',
			render: (text, record) => {
				return <span>
					<a href='javascript:;' onClick={() => {
						handleNewModal('mod', record)
					}}>修改</a>
					<a href='javascript:;' className='left-gap' onClick={() => {
						handleDelete(record.id)
					}}>删除</a>
				</span>
			}
		}
	]
}
export const personInfoFunc = (handleNewModal, handleDelete, postType = []) => {
	return [
		{
			title: '用户ID',
			dataIndex: 'sale_id',
			key: 'sale_id',
			align: 'center',
		},
		{
			title: '姓名',
			dataIndex: 'sale_name',
			key: 'sale_name',
			align: 'center',
		},
		{
			title: '岗位类型',
			dataIndex: 'position_level',
			key: 'position_level',
			align: 'center',
			render: (text) => {
				let position_level = postType.find(item => item.id === text);
				return position_level ? position_level.display : null
			}
		},
		{
			title: '区域',
			dataIndex: 'region',
			key: 'region',
			align: 'center',
		},
		{
			title: '直接上级',
			dataIndex: 'sale_parent_name',
			key: 'sale_parent_name',
			align: 'center',
		},
		{
			title: '上级ID',
			dataIndex: 'parent_id',
			key: 'parent_id',
			align: 'center',
		},
		{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			align: 'center',
			render: (text, record) => {
				let obj = {
					children: text ? <span>
						<a href='javascript:;' onClick={() => {
							handleNewModal('mod', record)
						}}>修改</a>
						<a href='javascript:;' className='left-gap' onClick={() => {
							handleDelete(record.sale_id)
						}}>删除</a>
					</span> : null,
					props: {
						rowSpan: text
					}
				};
				return obj
			}
		}
	]
}
export const completePercentFunc = (handleNewModal, handleDelete) => {
	return [
		// {
		// 	title: '岗位类型',
		// 	dataIndex: 'position_name',
		// 	key: 'position_name',
		// 	align: 'center',
		// },
		// {
		// 	title: '业务类型',
		// 	dataIndex: 'business_name',
		// 	key: 'business_name',
		// 	align: 'center',
		// },
		{
			title: '完成率',
			dataIndex: 'complete_percent',
			key: 'complete_percent',
			align: 'center',
			render: (text, { min_op, min_value, max_op, max_value }) => {
				return min_value + opMap[min_op] + '完成率' + opMap[max_op] + max_value
			}
		},
		{
			title: '提成比例',
			dataIndex: 'proportion',
			key: 'proportion',
			align: 'center',
		},
		{
			title: '超额权重',
			dataIndex: 'weight',
			key: 'weight',
			align: 'center',
		},
		// {
		// 	title: '奖金基数',
		// 	dataIndex: '',
		// 	key: '',
		// 	align: 'center',
		// },
		{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			align: 'center',
			render: (text, record) => {
				let obj = {
					children: text ? <span>
						<a href='javascript:;' onClick={() => {
							handleNewModal('mod', record)
						}}>修改</a>
						<a href='javascript:;' className='left-gap' onClick={() => {
							handleDelete(record.id)
						}}>删除</a>
					</span> : null,
					props: {
						rowSpan: text
					}
				};
				return obj
			}
		}
	]
}
export const exceedListFunc = (handleNewModal, handleDelete) => {
	return [
		// {
		// 	title: '岗位类型',
		// 	dataIndex: 'position_level',
		// 	key: 'position_level',
		// 	align: 'center',
		// },
		{
			title: '超账期数',
			dataIndex: 'num',
			key: 'num',
			align: 'center',
		},
		{
			title: '超期操作',
			dataIndex: 'operation',
			key: 'operation',
			align: 'center',
		},
		{
			title: '打折比例',
			dataIndex: 'rate',
			key: 'rate',
			align: 'center',
			render: (text) => {
				text = text + '%';
				return text;
			}
		},
		{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			align: 'center',
			render: (text, record) => {
				return <span>
					<a href='javascript:;' onClick={() => {
						handleNewModal('mod', record)
					}}>修改</a>
					<a href='javascript:;' className='left-gap' onClick={() => {
						handleDelete(record.id)
					}}>删除</a>
				</span>
			}
		}
	]
}
export const longListFunc = (handleNewModal, handleDelete) => {
	return [
		{
			title: '岗位类型',
			dataIndex: 'position_level',
			key: 'position_level',
			align: 'center',
		},
		{
			title: '超账期数',
			dataIndex: 'num',
			key: 'num',
			align: 'center',
		},
		{
			title: '超期操作',
			dataIndex: 'operation',
			key: 'operation',
			align: 'center',
		},
		{
			title: '扣款比例',
			dataIndex: 'rate',
			key: 'rate',
			align: 'center',
			render: (text) => {
				text = text + '%';
				return text;
			}
		},
		{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			align: 'center',
			render: (text, record) => {
				return <span>
					<a href='javascript:;' onClick={() => {
						handleNewModal('mod', record)
					}}>修改</a>
					<a href='javascript:;' className='left-gap' onClick={() => {
						handleDelete(record.id)
					}}>删除</a>
				</span>
			}
		}
	]
}
export const clientListFunc = (handleNewModal) => {
	return [
		{
			title: '公司简称',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
		},
		{
			title: '公司ID',
			dataIndex: 'company_id',
			key: 'company_id',
			align: 'center',
		},
		{
			title: '账期',
			dataIndex: 'payment_days',
			key: 'payment_days',
			align: 'center',
			render: (text) => {
				text = text + '月';
				return text;
			}
		},
		{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			align: 'center',
			render: (text, record) => {
				return <a href='javascript:;' onClick={() => {
					handleNewModal('mod', record)
				}}>修改</a>
			}
		}
	]
};
export const companyIncomeFunc = (handleNewModal, handleDelete, quoteType = []) => {
	return [
		{
			title: '公司ID',
			dataIndex: 'company_id',
			key: 'company_id',
			align: 'center',
		},
		{
			title: '公司简称',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
		},
		{
			title: '销售经理',
			dataIndex: 'real_name',
			key: 'real_name',
			align: 'center',
		},
		{
			title: '报价类型',
			dataIndex: 'quote_type',
			key: 'quote_type',
			align: 'center',
			render: (text) => {
				let quote_type = quoteType.find(item => item.id === text);
				return quote_type ? quote_type.display : null
			}
		},
		{
			title: '提成标识',
			dataIndex: 'status',
			key: 'status',
			align: 'center',
			render: (text) => {
				let flag = commissionFlag[text];
				return flag
			}
		},
		{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			align: 'center',
			render: (text, record) => {
				return <a href='javascript:;' className='left-gap' onClick={() => {
					handleDelete(record.company_id)
				}}>删除</a>
			}
		}
	]
}
const businessAccountingList = {
	1: [
		{
			title: '用户ID',
			dataIndex: 'sale_id',
			key: 'sale_id',
			align: 'center',
		},
		{
			title: '姓名',
			dataIndex: 'sale_name',
			key: 'sale_name',
			align: 'center',
		},
		{
			title: '月份',
			dataIndex: 'month',
			key: 'month',
			align: 'center',
		},
		{
			title: '应发提成金额',
			dataIndex: 'real_should_send_amount',
			key: 'real_should_send_amount',
			align: 'center',
		},
		{
			title: '已核销金额',
			dataIndex: 'sent_amount',
			key: 'sent_amount',
			align: 'center',
		},
		{
			title: '未核销金额',
			dataIndex: 'not_write_off_amount',
			key: 'not_write_off_amount',
			align: 'center',
		}
	],
	2: [
		{
			title: '用户ID',
			dataIndex: 'sale_id',
			key: 'sale_id',
			align: 'center',
		},
		{
			title: '姓名',
			dataIndex: 'sale_name',
			key: 'sale_name',
			align: 'center',
		},
		{
			title: '月份',
			dataIndex: 'month',
			key: 'month',
			align: 'center',
		},
		{
			title: '应发提成金额',
			dataIndex: 'real_should_send_amount',
			key: 'real_should_send_amount',
			align: 'center',
		},
		{
			title: '已核销金额',
			dataIndex: 'sent_amount',
			key: 'sent_amount',
			align: 'center',
		},
		{
			title: '未核销金额',
			dataIndex: 'not_write_off_amount',
			key: 'not_write_off_amount',
			align: 'center',
		},
		{
			title: '凭证信息',
			dataIndex: 'attachment',
			key: 'attachment',
			align: 'center',
			width: 360,
			render: (text, { attachment }) => {
				let attachmentAry = Object.values(qs.parse(attachment)).map(item => item.url);
				return <div>
					{attachmentAry.map((item, index) => {
						if (item) {
							return <div className='thum-img-box' key={index}>
								<a href={item} target='_blank'><img src={item} /></a>
							</div>
						}
					})}
				</div>
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
		}
	],
	3: [
		{
			title: '用户ID',
			dataIndex: 'sale_id',
			key: 'sale_id',
			align: 'center',
		},
		{
			title: '姓名',
			dataIndex: 'sale_name',
			key: 'sale_name',
			align: 'center',
		},
		{
			title: '月份',
			dataIndex: 'month',
			key: 'month',
			align: 'center',
		},
		{
			title: '应发提成金额',
			dataIndex: 'real_should_send_amount',
			key: 'real_should_send_amount',
			align: 'center',
		},
		{
			title: '已核销金额',
			dataIndex: 'sent_amount',
			key: 'sent_amount',
			align: 'center',
		},
		{
			title: '未核销金额',
			dataIndex: 'not_write_off_amount',
			key: 'not_write_off_amount',
			align: 'center',
		},
		{
			title: '凭证信息',
			dataIndex: 'attachment',
			key: 'attachment',
			align: 'center',
			width: 360,
			render: (text, { attachment }) => {
				let attachmentAry = Object.values(qs.parse(attachment)).map(item => item.url);
				return <div>
					{attachmentAry.map((item, index) => {
						return <div className='thum-img-box' key={index}>
							<a href={item} target='_blank'><img src={item} /></a>
						</div>
					})}
				</div >
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
		}
	]
}
export const businessAccountingListFunc = (tab, handleFunc) => {
	const list = tab != 2 ? [...businessAccountingList[tab],
	{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
		align: 'center',
		render: (text, record) => {
			return <a href='javascript:;' onClick={() => { handleFunc(2, { [record.id]: { price: record.not_write_off_amount, attachment: record.attachment } }) }}>核销</a>
		}
	}] : businessAccountingList[tab];
	return list;
}
export const readyCheckFunc = (handleDelete) => {
	return [
		{
			title: '销售ID',
			dataIndex: 'sale_id',
			key: 'sale_id',
			align: 'center',
			width: 120
		},
		{
			title: '姓名',
			dataIndex: 'sale_name',
			key: 'sale_name',
			align: 'center',
			width: 250
		},
		{
			title: '月份',
			dataIndex: 'month',
			key: 'month',
			align: 'center',
			width: 120
		},
		{
			title: '待核销金额',
			dataIndex: 'not_write_off_amount',
			key: 'not_write_off_amount',
			align: 'center',
			width: 160
		},
		{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			align: 'left',
			render: (text, record) => {
				return <a href='javascript:;' onClick={() => { handleDelete(record.id) }}>删除</a>
			}
		}
	]
}
export const stepsConfig = [
	{
		title: "文件上传",
		description: "Upload the files."
	},
	{
		title: "核对信息",
		description: "Checking Information."
	},
	{
		title: "完成",
		description: "Finished."
	}
];
const commissionFlag = {
	'1': '计提',
	'2': '不计提'
}
export const postTypeConfig = {
	'sale': 1,
	'director': 2,
	'manager': 3,
	'overallCharge': 4
}
const opMap = {
	'gt': '<',
	'gte': '<=',
	'lt': '<',
	'lte': '<=',
}
export const valueCheckMap = {
	'lt': 'gte',
	'lte': 'gt'
}
export const tabListConfig = [
	{ title: '未核销', key: 1 },
	{ title: '已核销', key: 2 },
	{ title: '部分核销', key: 3 }
]

export const exportMap = [
	{ label: '加价订单对应的客户维护费拓展项目', action: 'bussinessExcel' },
	{ label: '业绩信息表', action: 'execExcel' },
	{ label: '赠送金额统计表', action: 'giftExcel' },
	{ label: '质检扣款统计表', action: 'qcExcel' },
	{ label: '赔偿统计表', action: 'reparationExcel' },
	{ label: '手工质检统计表', action: 'manualQcExcel' },
	{ label: '回款信息表', action: 'payBackExcel' },
	{ label: '长账龄扣款表', action: 'longAgingExcel' },
	{ label: '上月待扣GMV', action: 'lessAchievementsExcel' }
];

//用action参数 ->  标记需要合并的列数
export const markMergerCols = function (list, flag) {
	let key = list[0][flag], curIndex = 0;//记录当前key值和索引值
	list.forEach((item, index) => {
		if (item[flag] !== key) {
			if (index == list.length - 1) item.action = 1; //最后一项特殊处理
			list[curIndex].action = index - curIndex; //action用来标识合并的行数
			curIndex = index;
			key = item[flag];
		} else {
			item.action = 0;
			if (index == list.length - 1) list[curIndex].action = index - curIndex + 1;//最后一项特殊处理
		}
	})
	return list
}
