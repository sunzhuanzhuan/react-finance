import React from "react";
import { Layout, Menu, Icon, message } from "antd";
import { Link, withRouter } from "react-router-dom";
import { events } from '@/util'
import "./SiderMenu.less";

const SubMenu = Menu.SubMenu;
const { Sider } = Layout;

function createMenu(data) {
	return data.map(item => {
		let { subs: child, name, url } = item
		let reg = /^\//i;
		let title = reg.test(url) ? <span>{name}</span> : <span>
			<Icon type={url} />
			<span>{name}</span>
		</span>
		return child ? <SubMenu key={name} title={title}>{createMenu(child)}
		</SubMenu> : <Menu.Item key={url}>
				<Link to={url}>{name}</Link>
			</Menu.Item>
	})
}

class SiderDemo extends React.Component {
	state = {
		collapsed: true,
		defaultSelectedKeys: ["/login"],
		selectedKeys: []
	};
	onCollapse = collapsed => {
		this.setState({ collapsed });
		setTimeout(() => {
			events.emit('message', collapsed);
		}, 200)
	}

	componentWillMount() {
		let pathname = window.location.pathname;
		if (pathname) {
			this.setState({
				defaultSelectedKeys: [pathname],
				selectedKeys: [pathname]
			})
		}
	}

	componentWillReceiveProps(nextProps) {
		//修改了获取值的方式，routing不存在了
		if (nextProps.location.pathname !== this.props.location.pathname) {
			this.setState({
				selectedKeys: [nextProps.location.pathname]
			})
		}
		//临时补丁
		if (/\/accountList\/list\/\d/.test(nextProps.location.pathname)) {
			this.setState({
				selectedKeys: ["/accountList/list/1"]
			})
		}
		if (/\/accountList\/quotationManage\/detail/.test(nextProps.location.pathname)) {
			this.setState({
				selectedKeys: ["/accountList/quotationManage"]
			})
		}
	}

	render() {
		const { assignments, history } = this.props;
		if (assignments.length !== 0) {
			if (assignments[0].name === "noPermissions") {
				message.error("该用户没有任何权限", () => {
					history.replace("/login")
				})
			} else {
				this.permissions = assignments.filter(item => item.subs);
				if (assignments.filter(item => item.subs).length === 0) {
					this.subs = []
					message.error("该用户没有可用权限", () => {
						history.replace("/login")
					})
				}
			}
		}
		return (
			<Sider
				collapsedWidth="40px"
				width={this.state.collapsed ? "40px" : "200px"}
				collapsible
				collapsed={this.state.collapsed}
				onCollapse={this.onCollapse}
				className='fixed-slider'
			>
				<div className="logo" />
				<Menu
					style={{ width: this.state.collapsed ? 40 : 200 }}
					mode="inline"
					theme="dark"
					defaultSelectedKeys={this.state.defaultSelectedKeys}
					selectedKeys={this.state.selectedKeys}
				>
					{
						this.permissions ? createMenu(this.permissions) : ""
					}
				</Menu>
			</Sider>
		);
	}
}

export default withRouter(SiderDemo);
