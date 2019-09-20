import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
// import { Router, Route, IndexRedirect } from 'react-router';
import store, { history } from './store';
import "babel-polyfill";
//登录login
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import './index.less'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import moment from 'moment';
import 'moment/locale/zh-cn';
import numeral from 'numeral';
import 'numeral/locales/chs';
//顶级根目录页面
import App from './containers/App'
import Detail from './companyDetail/index'
import Invoice from './invoice/index'
import ExtractCoin from './extractCoin/index'
import SaleIncomeRoute from './saleIncome/index'
import StudioManage from './studioManage'
import TrinityPay from './trinityPay'
import FinanceSetting from './financeSetting'
import ZhangWu from './zhangwu'



numeral.locale('chs')
moment.locale('zh-cn');

const redirectToOtherProjects = ({ location: { pathname = '/error', search = '' } }) => {
	if (!(/^\//.test(pathname))) {
		pathname = '/' + pathname
	}
	if (process.env.NODE_ENV != 'development') {
		window.location.replace(pathname + search)
	}
	return null;
};

const routes = () => (
	<App history={history}>
		<Switch>
			<Route path='/finance/detail' component={Detail} />
			<Route path='/finance/freeze' component={Detail} />
			<Route path='/finance/golden' component={Detail} />
			<Route path='/finance/invoice' component={Invoice} />
			<Route path='/finance/contractManage' component={ExtractCoin} />
			<Route path='/finance/extractManage' component={ExtractCoin} />
			<Route path='/finance/remitOrder' component={ExtractCoin} />
			<Route path='/finance/saleIncome' component={SaleIncomeRoute} />
			<Route path='/finance/studioManage' component={StudioManage} />
			<Route path='/finance/trinityPay' component={TrinityPay} />
			<Route path='/finance/financeSetting' component={FinanceSetting} />
			<Route path='/finance/zhangwu' component={ZhangWu} />

			<Redirect to="/error" />
		</Switch>
	</App>
);

render(
	<LocaleProvider locale={zhCN}>
		<Provider store={store}>
			<BrowserRouter>
				<Switch>
					<Route path='/finance/remitOrder/paymentOrder' component={ExtractCoin} />
					<Route path="/finance" render={routes} />
					<Route render={redirectToOtherProjects} />
				</Switch>
			</BrowserRouter>
		</Provider></LocaleProvider >,
	document.getElementById('root')
)
