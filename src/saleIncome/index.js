import React from 'react';
import { Route } from "react-router-dom";
import lazyLoadComponent from '../components/LazyLoadComponent'

const MissionList = lazyLoadComponent(() => import("./container/missionList"))
const MissionInput = lazyLoadComponent(() => import("./container/missionInput"))
const MissionOutput = lazyLoadComponent(() => import("./container/missionOutput"))
const BusinessList = lazyLoadComponent(() => import("./container/businessIncome"))
const ExceedList = lazyLoadComponent(() => import("./container/exceedPayment"))
const LongAging = lazyLoadComponent(() => import("./container/longAging"))
const CompletePercent = lazyLoadComponent(() => import("./container/completePercent"))
const ClientPayment = lazyLoadComponent(() => import("./container/clientPayment"))
const PersonInfo = lazyLoadComponent(() => import("./container/personInfo"))
const CompanyIncome = lazyLoadComponent(() => import("./container/companyIncome"))
const BusinessAccounting = lazyLoadComponent(() => import("./container/businessAccounting"))

class SaleIncomeRoute extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<div>
				<Route path='/finance/saleIncome/missionList' component={MissionList} />
				<Route path='/finance/saleIncome/missionInput' component={MissionInput} />
				<Route path='/finance/saleIncome/missionOutput' component={MissionOutput} />
				<Route path='/finance/saleIncome/businessIncome' component={BusinessList} />
				<Route path='/finance/saleIncome/exceedPayment' component={ExceedList} />
				<Route path='/finance/saleIncome/longAging' component={LongAging} />
				<Route path='/finance/saleIncome/completePercent' component={CompletePercent} />
				<Route path='/finance/saleIncome/clientPayment' component={ClientPayment} />
				<Route path='/finance/saleIncome/personInfo' component={PersonInfo} />
				<Route path='/finance/saleIncome/companyIncome' component={CompanyIncome} />
				<Route path='/finance/saleIncome/businessAccounting' component={BusinessAccounting} />
			</div>
		);
	}
}
export default SaleIncomeRoute;
