import React, { Component } from 'react'

import { Route } from 'react-router-dom'
import lazyLoadComponent from '../components/LazyLoadComponent'

// 懒加载路由级组件
const ContainerForm = lazyLoadComponent(() => import('./containers/ContainerForm'))
const Upload = lazyLoadComponent(() => import('./containers/Upload'))
const ApplyList = lazyLoadComponent(() => import('./containers/ApplyList'))
const CompleteApplyList = lazyLoadComponent(() => import('./containers/CompleteApplyList'))
const InvoiceApplyDetail = lazyLoadComponent(() => import('./containers/invoiceApplyDetail'))
//const modified = lazyLoadComponent(() => import('./containers/modifiedApply'))
const Reparation = lazyLoadComponent(() => import('./containers/orderCompensate'))
const AssociateInvoice = lazyLoadComponent(() => import('./containers/associateInvoice/AssociateInvoice'))
//import modifiedUpload = lazyLoadComponent(() => import('./containers/uploadModified'))
//import newInvoice = lazyLoadComponent(() => import('./containers/newInvoice'))
const RelatedInvoice = lazyLoadComponent(() => import('./containers/relatedInvoice'))
const RelatedChooseInvoice = lazyLoadComponent(() => import('./containers/relatedChooseInvoice'))
const TrinityInvoice = lazyLoadComponent(() => import('./containers/trinityInvoice'))
class Invoice extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<div>
				<Route path="/finance/invoice/applyList" component={ApplyList}></Route>
				<Route path="/finance/invoice/apply" component={ContainerForm}></Route>
				<Route path="/finance/invoice/upload" component={Upload}></Route>
				<Route path="/finance/invoice/completeApply" component={CompleteApplyList}></Route>
				<Route path='/finance/invoice/applyDetail' component={InvoiceApplyDetail}></Route>
				<Route path="/finance/invoice/reparation" component={Reparation}></Route>
				{/* <Route path="/invoice/editApply" component={modified}></Route>
    <Route path="/invoice/editUpload" component={modifiedUpload}></Route> */}
				<Route path="/finance/invoice/associateInvoice" component={AssociateInvoice}></Route>
				{/* <Route path="/invoice/tan" component={newInvoice}></Route> */}
				<Route path="/finance/invoice/relatedInvoice" component={RelatedInvoice}></Route>
				<Route path="/finance/invoice/relatedChooseInvoice" component={RelatedChooseInvoice}></Route>
				<Route path="/finance/invoice/trinityInvoice" component={TrinityInvoice}></Route>
			</div>
		);
	}
}

export default Invoice;
