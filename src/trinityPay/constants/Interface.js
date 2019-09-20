export default {
	//预付款
	getPrePayData: '/trinity/publicPaymentSlip/list',
	getPrePayExport: '/trinity/publicPaymentSlip/exportPublicPaymentSlip',
	getPrimaryAccount: '/trinity/publicPaymentSlip/getUserByName',
	//周期付款
	getDatePayData: '/trinity/publicPaymentSlip/list',
	getDatePayExport: '/trinity/publicPaymentSlip/exportPublicPaymentSlip',
	//公共操作方法
	getPaySearchItem: '/trinity/publicPaymentSlip/searchItem',
	getAgentListByCPId: '/trinity/publicPaymentSlip/getAgentListByCPId',
	getPayDetail: '/trinity/publicPaymentSlip/info',
	postPayEdit: '/trinity/publicPaymentSlip/edit',
	postPaySuccess: '/trinity/publicPaymentSlip/paySuccess',
	postPayFail: '/trinity/publicPaymentSlip/payFail',
	postPayRevoke: '/trinity/publicPaymentSlip/paymentRevoke',
	//三方订单明细
	getDealOrderData: '/trinity/publicOrderTrade/list',
	getDealOrderSearchItem: '/trinity/publicPaymentSlip/searchItem',
	getDealOrderExport: '/trinity/publicPaymentSlip/exportPublicPaymentSlip',
}
