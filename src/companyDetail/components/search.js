import React, { Component } from "react";
import { Select, Spin } from "antd";
import debounce from 'lodash/debounce';

const Option = Select.Option

export default class SearchSelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			value: [],
			searchIng: false,
		}
		this.lastFetchId = 0;
		this.handleSearch = debounce(this.handleSearch, 400);
	}
	handleSearch = (value) => {
		if (!value) {
			return
		}
		let { action, keyWord, dataToList } = this.props
		this.lastFetchId += 1;
		const fetchId = this.lastFetchId;
		this.setState({ data: [], searchIng: true });
		action({ [keyWord]: value }).then(dataToList).then((list) => {
			if (fetchId !== this.lastFetchId) {
				return;
			}
			this.setState({ data: list, searchIng: false });
		});
	}
	handleChange = (value) => {
		this.setState({
			value,
			data: [],
			searchIng: false,
		});
	}

	render() {
		const { item: [id, text] } = this.props;
		const { searchIng, data, value } = this.state;
		return (
			<Select
				showSearch
				allowClear
				labelInValue
				filterOption={false}
				value={value}
				placeholder='请输入'
				notFoundContent={searchIng ? <Spin size="small" /> : null}
				onSearch={this.handleSearch}
				onChange={this.handleChange}
				style={{ width: '140px' }}
				{...this.props}
			>
				{data.map(d => <Option key={d[id]}>{d[text]}</Option>)}
			</Select>)
	}
}
