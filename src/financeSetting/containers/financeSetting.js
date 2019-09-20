import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as settingAction from "../actions";
import { message, Button } from 'antd'
import Item from '../components/Item'
import NewItem from '../components/newItem'
import './financeSetting.less'
import qs from 'qs'

class Setting extends React.Component {
	constructor() {
		super();
		this.state = {
			visible: false
		}
	}
	componentDidMount() {
		const search = qs.parse(this.props.location.search.substring(1));
		this.queryData({ ...search.keys });
		this.props.actions.getTrinityCompanyList();
	}
	queryData = (obj, func) => {
		this.setState({ loading: true });
		return this.props.actions.postTrinityProfitRateAll({ ...obj }).then(() => {
			if (func && Object.prototype.toString.call(func) === '[object Function]') {
				func();
			}
			this.setState({ loading: false });
		}).catch(({ errorMsg }) => {
			this.setState({ loading: false });
			message.error(errorMsg || '平台配置获取失败，请重试！');
		})
	}
	handleAdd = () => {
		this.setState({ visible: true });
	}
	handleCancel = () => {
		this.setState({ visible: false });
	}
	handleSubmit = (type, params, func) => {
		const actionName = type === 'add' ? 'postTrinityProfitRateAdd' : type === 'modify' ? 'postTrinityProfitRateModify' : '';
		return this.props.actions[actionName]({ ...params }).then(() => {
			if (func) {
				func();
			} else {
				this.handleCancel();
			}
			this.queryData();
			message.success('操作成功！');
		}).catch(({ errorMsg }) => {
			message.error(errorMsg || '操作失败，请重试！');
		})
	}
	render() {
		const { trinityProfitRateAll = [], trinityCompanyList = [] } = this.props;
		const platformId = trinityProfitRateAll.map(item => item.platformId);
		const companyList = trinityCompanyList.filter(item => !platformId.includes(item.id));
		const { visible } = this.state;

		return <div className='setting-container'>
			<div>
				<Button type='primary' onClick={this.handleAdd}>新增平台</Button>
				<span className='left-gap' style={{ color: '#999999' }}>说明：此处设置的是微播易三方订单，当报价模式为利润率时，计算账号报价阳价时的利润率</span>
			</div>
			{visible && <NewItem onCancel={this.handleCancel} onSubmit={this.handleSubmit} companyList={companyList} />}
			{trinityProfitRateAll.map(item => (<Item key={item.platformId} data={item} onSubmit={this.handleSubmit} />))}
		</div>
	}
}

const mapStateToProps = (state) => {
	return {
		trinityProfitRateAll: state.trinityProfitRate.trinityProfitRateAll,
		trinityCompanyList: state.trinityProfitRate.trinityCompanyList,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...settingAction }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Setting)
