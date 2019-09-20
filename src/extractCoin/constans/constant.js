export const tabListConfig = (partner_type) => {
	switch (partner_type) {
		case 1:
			return [
				{ title: '主账号收款单据', key: 2 }
			];
		default:
			return [
				{ title: '富能打款单据', key: 1 },
				{ title: '主账号收款单据', key: 2 }
			];
	}
}
export const billingActions = {
	'0': '已打款',
	'1': '已还款',
	'2': '已结税'
}
export const billingStatus = {
	'AWAIT_REMIT': 0,//待打款
	'AWAIT_REPAYMENT': 1,//待还款
	'AWAIT_OVER_TAX': 2,//待结税
	'AWAIT_CLOSE_account': 3,//已结算
}
export const billingPartner = {
	'WORK_WITH_COMPANY': 1,
	'WORK_WITH_STUDIO': 4
}
