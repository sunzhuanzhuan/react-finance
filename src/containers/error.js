import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'antd';
import "./error.less";
class Error extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<div className='error-big'>
				<div className="error-img">
					<img src="http://img.weiboyi.com/vol1/1/102/124/q/i/523731p4029411r99p5o506o4op229o2/error.png" width="235" alt="" />
				</div>
				<p className="error-404 error-404-first">遇到了一点问题，</p>
				<p className="error-404">请返回首页</p>
				<p className='error-goIndexs'>
					<Link to={'/loginSuccess'}>返回首页</Link>
				</p>
			</div>
		);
	}
}

export default Error;
