import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux';
import commonReducers from './common'
import authReducers from '../auth/reducers'
// import adminUserList from '../adminUser/reducers'
import companyDetail from '../companyDetail/reducers'
import invoice from '../invoice/reducers'
import loginReducer from '../login/reducer/index'
import withdraw from '../extractCoin/reducers'
import siderMenuReducer from '../siderMenu/reducers'
import authorizationsReducers from './authorizations'
import saleIncome from '../saleIncome/reducers'
import studioManage from '../studioManage/reducers'
import zhangWu from '../zhangwu/reducers'
import trinityPay from '../trinityPay/reducers'
import trinityProfitRate from '../financeSetting/reducers'
export default combineReducers({
	commonReducers,
	routing: routerReducer,
	auth: authReducers,
	// ...adminUserList,
	companyDetail,
	invoice,
	loginReducer,
	withdraw,
	siderMenuReducer,
	authorizationsReducers,
	saleIncome,
	studioManage,
	zhangWu,
	trinityPay,
	trinityProfitRate
});
