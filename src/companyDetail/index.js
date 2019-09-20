import React, { Component } from 'react'

import { Route } from 'react-router-dom'
import lazyLoadComponent from '../components/LazyLoadComponent'

// 懒加载路由级组件
const CompanyDetail = lazyLoadComponent(() => import('./containers/companyDetail'))
const FreezeDetail = lazyLoadComponent(() => import('./containers/freezeDetail'))
const GoldenDetail = lazyLoadComponent(() => import('./containers/goldenDetail'))
const AdjustDetail = lazyLoadComponent(() => import('./containers/adjustDetail'))
const AdjustApply = lazyLoadComponent(() => import('./containers/adjustApply'))
const AddAdjustApply = lazyLoadComponent(() => import('./containers/addAdjustApply'))
const AdjustApplyDetail = lazyLoadComponent(() => import('./containers/adjustApplyDetail'))
const AdjustApplyInput = lazyLoadComponent(() => import('./containers/adjustApplyInput'))
// import SourceType from './containers/SourceType'
// import Sources from './containers/Sources'
// import NavType from './containers/NavType'
// import Nav from './containers/Nav'
// import NavGroup from './containers/NavGroup'
// import Roles from './containers/Roles'
// import Authority from './containers/Authority'
// import RoleRelation from './containers/RoleRelation'

class Company extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<div>
				<Route path='/finance/detail/company' component={CompanyDetail} />
				<Route path='/finance/freeze/detail' component={FreezeDetail} />
				<Route path='/finance/golden/detail' component={GoldenDetail} />
				<Route path='/finance/golden/adjustDetail' component={AdjustDetail} />
				<Route path='/finance/golden/adjustApply' component={AdjustApply} />
				<Route path='/finance/golden/addAdjustApply' component={AddAdjustApply} />
				<Route path='/finance/golden/adjustApplyDetail' component={AdjustApplyDetail} />
				<Route path='/finance/golden/adjustApplyInput' component={AdjustApplyInput} />
			</div>
		);
	}
}

export default Company;
