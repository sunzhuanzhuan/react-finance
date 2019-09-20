import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Layout, Button, Icon } from 'antd';
import SiderMenu from '../components/SiderMenu'
import { getUserLoginInfo, getUserConfigKey } from '../login/actions'
import { resetSiderAuth, getAuthorizations } from '../actions'
// import { sensors } from '../util/sensor/sensors.js'
const { Header, Content } = Layout;
const Cookies = require('js-cookie');
window.Cookies = Cookies;

class App extends Component {
	state = {
		collapsed: true,
		isLoaded: false,
		heightLayout: document.documentElement.clientHeight + 'px'
	};
	onCollapse = (collapsed) => {
		this.setState({ collapsed });
	}
	logout = () => {
		Cookies.remove('token');
		this.props.history.push('/login');
		this.props.actions.resetSiderAuth()
	}
	async componentWillMount() {

		window.myHistory = this.props.history
		//重新获取页面尺寸，以防继承前一浏览页面的滚动条
		window.onresize = null
		await this.props.actions.getAuthorizations();
		let Info = await this.props.actions.getUserLoginInfo();
		let userInfoId = Info.data.user_info.user_id
		//神策的代码不应该阻塞，去掉await, 使用then的成功回调。
		// this.props.actions.getUserConfigKey({ keys: 'shence_base_url_for_b' }).then((res) => {
		// 	let userResult = res.data.shence_base_url_for_b
		// 	sensors(userInfoId, userResult.value, 101)
		// });

		this.setState({
			isLoaded: true
		})
		window.addEventListener('resize', this.setHeight);
	}
	setHeight = () => {
		this.setState({
			heightLayout: document.documentElement.clientHeight + 'px'
		})
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.setHeight);
	}
	render() {
		const height = this.state.heightLayout
		let layStyle = {
			height: height,
			minWidth: 1200
		}
		let headerStyle = {
			height: '55px',
			backgroundColor: '#000c17',
			color: '#fff',
			fontSize: '18px',
			padding: '0 10px',
			lineHeight: '55px',
			position: 'relative'
		}
		let contentStyle = {
			backgroundColor: '#fff',
			margin: '0 20px',
			padding: '20px',
			position: 'relative'
		}
		let btnStyle = {
			position: 'absolute',
			right: '10px',
			top: '10px'
		}

		const { loginReducer: { userLoginInfo }, siderMenuAuth = [] } = this.props;
		return userLoginInfo['X-Access-Token'] ? <Layout style={layStyle}>
			<Header style={headerStyle}>
				<span>NB</span>
				<div className="user-name">
					您好,
					<Icon type="user" />
					{userLoginInfo.user_info.real_name}
				</div>
				<Button type="primary" className="old-platform"
					href="http://toufang.weiboyi.com:8080/"
					icon="logout"
				>老平台</Button>
				<Button type="primary" onClick={this.logout.bind(this)} style={btnStyle}>退出</Button>
			</Header>
			<Layout>
				<SiderMenu assignments={siderMenuAuth} routing={this.props.routing}></SiderMenu>
				<Content style={contentStyle} id='app-content-children-id'>
					{this.state.isLoaded && this.props.children}
				</Content>
			</Layout>
		</Layout> : null
	}
}

App.propTypes = {
	children: PropTypes.element
}

const mapStateToProps = (state) => ({
	loginReducer: state.loginReducer,
	siderMenuAuth: state.authorizationsReducers.siderMenuAuth,
	routing: state.routing.locationBeforeTransitions
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({
		getUserLoginInfo, resetSiderAuth, getAuthorizations, getUserConfigKey
	}, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
