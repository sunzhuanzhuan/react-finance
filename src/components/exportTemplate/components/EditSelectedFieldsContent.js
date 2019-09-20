import React, { Component } from "react"
import { Skeleton } from 'antd'
import ChangeSearchInput from "../base/ChangeSearchInput";
import debounce from 'lodash/debounce';
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import DragItems from "@/components/exportTemplate/components/DragItems";

// 已选搜索筛选逻辑
function searchFilter(keys = [], sources = {}, keyWord) {
	// 没有输入关键词或元数据为空直接返回原数据
	if (!keyWord || !keys.length) return { result: keys }
	let obj = { result: [], resultNumber: '0' }
	obj.result = keys.filter(id => (sources[id].name.search(new RegExp(keyWord, 'i')) >= 0 || (sources[id].alias && sources[id].alias.search(new RegExp(keyWord, 'i')) >= 0)))
	obj.resultNumber = (parseInt(obj.resultNumber) + obj.result.length) + ''
	return obj
}

@DragDropContext(HTML5Backend)
export default class EditSelectedFieldsContent extends Component {
	changeKeyWord = keyWord => {
		this.setState({ keyWord })
	}
	handleDrag = (dragIndex, hoverIndex) => {
		const { data, groupId, actions } = this.props
		const { templateAllColumns } = data
		const { selectColumns } = actions
		const { selected } = templateAllColumns[groupId] || {}
		// const current = selected[dragIndex]
		let selectedKeys = [...selected]
		selectedKeys.splice(hoverIndex, 0, ...selectedKeys.splice(dragIndex, 1))
		selectColumns({ groupId, value: selectedKeys })
	}

	handleDelete = (deleteIndex) => {
		const { data, groupId, actions } = this.props
		const { templateAllColumns } = data
		const { selectColumns } = actions
		const { selected } = templateAllColumns[groupId] || {}
		let selectedKeys = [...selected]
		selectedKeys.splice(deleteIndex, 1)
		selectColumns({ groupId, value: selectedKeys })
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
		const { selectColumns,changeColumnsAlias } = actions
		const { selected, ids, sources } = templateAllColumns[groupId] || {}
		// 搜索筛选
		let { result } = searchFilter(selected, sources, this.state.keyWord)
		return selected ? <div className='fields-selected-area-container'>
			<div className='head-search-fields'>
				<ChangeSearchInput onChange={this.search} />
			</div>
			<div className='content-fields-list'>
				<div>
					{result.map((id, n) =>
						sources[id] ? <DragItems
							key={id}
							index={n}
							data={sources[id]}
							id={id}
							drag={this.handleDrag}
							length={result.length}
							del={this.handleDelete}
							groupId={groupId}
							changeColumnsAlias={changeColumnsAlias}
						/> : null)}
				</div>
			</div>
		</div> : <Skeleton active />
	}
}
