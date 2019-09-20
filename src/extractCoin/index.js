import React, { Component } from 'react';
import { Route } from "react-router-dom";
import lazyLoadComponent from '../components/LazyLoadComponent'

// 懒加载路由级组件
const contractManage = lazyLoadComponent(() => import("./containers/contractManage"))
const addContract = lazyLoadComponent(() => import("./containers/addContract"))
const addOrder = lazyLoadComponent(() => import("./containers/addOrder"))
const extractManage = lazyLoadComponent(() => import("./containers/extractManage"))
const applyDetail = lazyLoadComponent(() => import("./containers/applyDetail"))
const remitOrder = lazyLoadComponent(() => import("./containers/remitOrder"))
const remitOrderDetail = lazyLoadComponent(() => import("./containers/remitOrderDetail"))
const paymentOrder = lazyLoadComponent(() => import("./containers/paymentOrder"))

class ExtractConin extends Component {
	state = {}
	render() {
		return (
			<div>
				<Route exact path="/finance/contractManage" component={contractManage} />
				<Route path="/finance/contractManage/addContract" component={addContract} />
				<Route path="/finance/contractManage/addOrder" component={addOrder} />
				<Route exact path="/finance/extractManage" component={extractManage} />
				<Route path="/finance/extractManage/applyDetail" component={applyDetail} />
				<Route exact path="/finance/remitOrder" component={remitOrder} />
				<Route path="/finance/remitOrder/detail" component={remitOrderDetail} />
				<Route path="/finance/remitOrder/paymentOrder" component={paymentOrder} />
			</div>
		);
	}
}

export default ExtractConin;
