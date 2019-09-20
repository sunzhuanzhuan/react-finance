export default {
	/* personInfo */
	getPersonInfo: '/commission/config/sale/list',
	checkPersonInfo: '/commission/config/sale/list',
	getMetadata: '/commission/config/metadata',
	getSalesName: '/commission/config/sale/getIdsAndName',
	getNewSalesName: '/commission/config/sale/getNewSale',
	getSuperior: '/commission/config/sale/getSuperior',
	postCreateSale: '/commission/config/sale/create',
	postUpdateSale: '/commission/config/sale/update',
	postDeleteSale: '/commission/config/sale/delete',
	/* exceedPayment */
	getPaymentList: '/commission/config/payment_date_rate/get',
	postCreatePayment: '/commission/config/payment_date_rate/create',
	postUpdatePayment: '/commission/config/payment_date_rate/update',
	getDeletePayment: '/commission/config/payment_date_rate/delete',
	/* clientPayment */
	getCompanyList: '/commission/config/company_payment_date/get',
	getSearchCompany: '/commission/config/company_payment_date/get',
	getCompanyID: '/commission/config/company/get_id_and_name',
	postCreateCompany: '/commission/config/company_payment_date/create',
	postUpdateCompany: '/commission/config/company_payment_date/update',
	/* businessIncome */
	getIncomeList: '/commission/config/commission_rate/get',
	postCreateIncome: '/commission/config/commission_rate/create',
	postUpdateIncome: '/commission/config/commission_rate/update',
	getDeleteIncome: '/commission/config/commission_rate/delete',
	/* companyIncome */
	getPreparation: '/commission/config/company/getPreparation',
	getPreparationList: '/commission/config/company/list',
	getSearchPreparation: '/commission/config/company/search',
	postCreatePreparation: '/commission/config/company/create',
	postUpdatePreparation: '/commission/config/company/update',
	postDeletePreparation: '/commission/config/company/delete',
	/* missionList */
	getMissionList: '/commission/config/assignment/list',
	getMissionSale: '/commission/config/assignment/getSale',
	postCreateMission: '/commission/config/assignment/create',
	postUpdateMission: '/commission/config/assignment/update',
	postDeleteMission: '/commission/config/assignment/delete',
	/* completePercent */
	getCompleteList: '/commission/config/completion/list',
	postCreateComplete: '/commission/config/completion/create',
	postUpdateComplete: '/commission/config/completion/update',
	postDeleteComplete: '/commission/config/completion/delete',
	getCompleteDetail: '/commission/config/completion/detail',
	/* missionInput */
	postMissionInput: '/commission/config/assignment/import',
	/* missionOutput */
	bussinessExcel: '/commission/excel/business',
	execExcel: '/commission/excel/exec',
	giftExcel: '/commission/excel/gift',
	qcExcel: '/commission/excel/qc',
	reparationExcel: '/commission/excel/reparation',
	manualQcExcel: '/commission/excel/manualQc',
	payBackExcel: '/commission/excel/payBack',
	longAgingExcel: '/commission/excel/longAging',
	lessAchievementsExcel: '/commission/excel/lessAchievements',
	/* businessAccounting */
	// getBusinessAccountingList: '/commission/calculation_result/sale_commission/list',
	getBusinessToken: '/commission/calculation_result/sale_commission/get_upload_token',
	postWriteOff: '/commission/calculation_result//sale_commission/write_off',
}
