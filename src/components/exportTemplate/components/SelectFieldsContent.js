import React, { Component } from "react"
import { Checkbox, Skeleton } from 'antd'
import FieldsCheckboxGroup from "@/components/exportTemplate/components/FieldsCheckboxGroup";
import ChangeSearchInput from "../base/ChangeSearchInput";
import debounce from 'lodash/debounce';

const CheckboxGroup = Checkbox.Group;

// 搜索筛选逻辑
function searchFilter(keys = [], sources = {}, keyWord) {
	// 没有输入关键词或元数据为空直接返回原数据
	if (!keyWord || !keys.length) return { result: keys }
	let obj = { result: [], resultNumber: '0' }
	obj.result = keys.map(({ name, columns }) => {
		let newColumns = columns.filter(id => sources[id].name.search(new RegExp(keyWord, 'i')) >= 0)
		obj.resultNumber = (parseInt(obj.resultNumber) + newColumns.length) + ''
		return {
			name,
			columns: newColumns
		}
	})
	return obj
}
export default class SelectFieldsContent extends Component {

	changeKeyWord = keyWord => {
		this.setState({ keyWord })
	}

	constructor(props) {
		super(props)
		this.search = debounce(this.changeKeyWord, 200);
		this.state = {
			keyWord: ''
		}
	}

	componentWillMount() {}

	render() {
		const { data, groupId, actions } = this.props
		const { templateAllColumns } = data
		const { selectColumns } = actions
		const { selected, ids, sources } = templateAllColumns[groupId] || {}
		// 搜索筛选
		let { result, resultNumber } = searchFilter(ids, sources, this.state.keyWord)
		return selected ? <div className='all-fields-select-area-container'>
			<div className='head-search-fields'>
				<ChangeSearchInput onChange={this.search} />
				{resultNumber && <p className='search-desc'>已找到符合条件的字段<b>{resultNumber}</b>个</p>}
			</div>
			<div className='content-fields-list'>
				<CheckboxGroup onChange={(selectedKeys) => {
					selectColumns({ groupId, value: selectedKeys })
					this.setState({ selected: selectedKeys })
				}} value={selected}>
					{
						result.map(({ name, columns }) => {
							return <FieldsCheckboxGroup key={name} title={name} fields={columns} sources={sources} />
						})
					}
				</CheckboxGroup>
			</div>
		</div> : <Skeleton active />
	}
}
