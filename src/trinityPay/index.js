import React, { Component } from 'react';
import { Route } from "react-router-dom";
import lazyLoadComponent from '../components/LazyLoadComponent'

// 懒加载路由级组件
const PrePay = lazyLoadComponent(() => import("./containers/prePay"))
const DatePay = lazyLoadComponent(() => import("./containers/datePay"))
const Detail = lazyLoadComponent(() => import("./containers/detail"))
const Modification = lazyLoadComponent(() => import("./containers/modification"))
const DealOrder = lazyLoadComponent(() => import("./containers/dealOrder"))

class TrinityPay extends Component {
	state = {}
	render() {
		return (
			<div>
				<Route exact path="/finance/trinityPay/prePay" component={PrePay} />
				<Route exact path="/finance/trinityPay/datePay" component={DatePay} />
				<Route exact path="/finance/trinityPay/detail" component={Detail} />
				<Route exact path="/finance/trinityPay/modification" component={Modification} />
				<Route exact path="/finance/trinityPay/dealorder" component={DealOrder} />
			</div>
		);
	}
}

export default TrinityPay;
