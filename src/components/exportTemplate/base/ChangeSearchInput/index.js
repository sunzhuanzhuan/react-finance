import React, { Component } from "react"
import { Input, Icon } from 'antd'

export default class index extends Component {
	state = { value: '' }
	handleChange = e => {
		let val = e.target.value.trim()
		this.setValue(val)
	}
	setValue = (val = '') => {
		this.setState({ value: val }, () => {
			this.props.onChange && this.props.onChange(val)
		})
	}
	render() {
		const { value } = this.state
		const props = {
			suffix: value ? <Icon type="close-circle" theme="outlined" onClick={() => this.setValue('')}/> :
				<Icon type="search" theme="outlined" />,
			value
		}
		return <Input className='search-input' placeholder="搜索可选字段" {...props} onChange={this.handleChange}/>
	}
}
