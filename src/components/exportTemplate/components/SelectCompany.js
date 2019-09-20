import React, { Component } from "react";
import {
	Select, Spin
} from "antd";
import debounce from 'lodash/debounce';


const Option = Select.Option

// 模糊搜索公司
export default class SelectCompany extends Component {
	state = {
		data: [],
		value: null,
		searchIng: false
	}
	search = (value) => {
		if (this.setState.searchIng) return false
		let { action } = this.props
		this.lastFetchId += 1;
		const fetchId = this.lastFetchId;
		this.setState({ searchIng: true });
		action({ name: value })
			.then(({ data: list }) => {
				if (fetchId !== this.lastFetchId) {
					return;
				}
				!this.isUnmount && this.setState({ data: list, searchIng: false });
			});
	}
	handleChange = (value) => {
		this.search('')
		this.setState({
			value
		}, () => {
			this.props.onChange && this.props.onChange(value)
		});
	}
	focusEvent = () => {
		if (!this.state.searchIng && !this.state.data.length) {
			this.search('')
		}
	}
	onCancel = () => {
		this.search('')
	}

	constructor(props) {
		super(props);
		this.lastFetchId = 0;
		this.search = debounce(this.search, 800);
	}

	componentWillMount() {
		this.search('')
	}

	componentWillUnmount() {
		this.isUnmount = true
	}

	render() {
		const { desc = '请输入并从下拉框中选择' } = this.props;
		const { searchIng, data, value } = this.state;
		return (
			<Select
				showSearch
				allowClear
				labelInValue
				filterOption={false}
				value={value}
				placeholder={desc}
				notFoundContent={searchIng ? <Spin size="small" /> : '没有找到公司信息'}
				onSearch={this.search}
				onBlur={this.focusEvent}
				onFocus={this.onCancel}
				{...this.props}
				onChange={this.handleChange}
			>
				{data.map(({ company_id, name }) => <Option key={company_id}>{name}</Option>)}
			</Select>)
	}
}
