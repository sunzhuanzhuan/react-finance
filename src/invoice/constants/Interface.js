export default {
	getCompensateAuthorizations: '/rbac/getAuthorizations',
	getReparationSaleList: '/finance/reparation/saleList',
	getReparationStatus: '/finance/reparation/status',
	getReparationInfo: '/finance/reparation/info',
	postReparationComplete: '/finance/reparation/complete',
	postReparationRefuse: '/finance/reparation/refuse',
	//关联发票
	getRelatedInvoiceData: '/trinity/publicInvoiceRelation/associatedList',
	getAvailableInvoiceData: '/trinity/publicInvoiceRelation/availableList',
	postDeleteInvoiceRelate: '/trinity/publicInvoiceRelation/delRelation',
	postAddRelation: '/trinity/publicInvoiceRelation/addRelation',
	//三方平台发票管理
	getTrinityInvoiceData: '/trinity/publicInvoice/list',
	postTrinityInvoiceAdd: '/trinity/publicInvoice/add',
	postTrinityInvoiceEdit: '/trinity/publicInvoice/edit',
	postTrinityInvoiceDel: '/trinity/publicInvoice/del',
	postTrinityInvoiceExport: '/trinity/publicInvoice/export',
	//公共
	getTrinityInvoiceSearchItem: '/trinity/publicInvoice/searchItem'
}
