import React, { Component } from 'react';
import { Route } from "react-router-dom";
import lazyLoadComponent from '../components/LazyLoadComponent'

// 懒加载路由级组件
const List = lazyLoadComponent(() => import("./containers/list"))
const Detail = lazyLoadComponent(() => import("./containers/detail"))

class ZhangWu extends Component {
	state = {}
	render() {
		return (
			<div>
				<Route exact path="/finance/zhangwu/list" component={List} />
				<Route exact path="/finance/zhangwu/detail" component={Detail} />
			</div>
		);
	}
}

export default ZhangWu;
