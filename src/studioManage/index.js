import React, { Component } from 'react';
import { Route } from "react-router-dom";
import lazyLoadComponent from '../components/LazyLoadComponent'

// 懒加载路由级组件
const StudioList = lazyLoadComponent(() => import("./containers/studioManage"))
const NewStudio = lazyLoadComponent(() => import("./containers/newStudio"))
const StudioDetail = lazyLoadComponent(() => import("./containers/studioDetail"))
const CheckStudio = lazyLoadComponent(() => import("./containers/checkStudio"))
const IdCardExport = lazyLoadComponent(() => import("./containers/idCardExport"))

class StudioManage extends Component {
	state = {}
	render() {
		return (
			<div>
				<Route exact path="/finance/studioManage/list" component={StudioList} />
				<Route exact path="/finance/studioManage/new" component={NewStudio} />
				<Route exact path="/finance/studioManage/detail" component={StudioDetail} />
				<Route exact path="/finance/studioManage/check" component={CheckStudio} />
				<Route exact path="/finance/studioManage/idCardExport" component={IdCardExport} />
			</div>
		);
	}
}

export default StudioManage;
