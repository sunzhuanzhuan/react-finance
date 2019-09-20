import React, { Component } from "react"
import { Icon, Input, Divider, Form } from 'antd'
import { DragSource, DropTarget } from "react-dnd";
import { findDOMNode } from "react-dom";

const DRAG_TYPE = 'ITEM'
const styleMainColor = { color: '#1890ff' }
const styleAutoActions = { marginLeft: 'auto', minWidth: '76px' }
const FormItem = Form.Item
// 拖拽源事件对象
const cardSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index
		}
	},
	canDrag(props, monitor) {
		return !props.data.edit
	}
}
// 拖拽目标事件对象
const cardTarget = {
	hover(props, monitor, component) {
		if (!component) {
			return null
		}
		const dragIndex = monitor.getItem().index
		const hoverIndex = props.index
		if (dragIndex === hoverIndex) {
			return
		}
		const hoverBoundingRect = (findDOMNode(component)).getBoundingClientRect()
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
		const clientOffset = monitor.getClientOffset()
		const hoverClientY = (clientOffset).y - hoverBoundingRect.top
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return
		}
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return
		}
		props.drag(dragIndex, hoverIndex)
		monitor.getItem().index = hoverIndex
	}
}

@DropTarget(DRAG_TYPE, cardTarget, (connect) => ({
	connectDropTarget: connect.dropTarget()
}))
@DragSource(
	DRAG_TYPE,
	cardSource,
	(connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	})
)
export default class DragItems extends Component {
	isEdit = () => {
		const { changeColumnsAlias, groupId } = this.props
		const { column_id: id, edit } = this.props.data
		!edit && changeColumnsAlias({ groupId, id, val: true, key: 'edit' })
	}
	validate = (val) => {
		this.setState({
			errorProps: new RegExp('^.{0,10}$').test(val) ? {} : {
				validateStatus: "error", help: "最长不能超过10个字"
			}
		})
		return new RegExp('^.{0,10}$').test(val)
	}
	handleChangeValue = e => {
		const { name } = this.props.data
		let val = e.target.value.trim()
		this.setState({
			errorProps: (val === name || new RegExp('^.{0,10}$').test(val)) ? {} : {
				validateStatus: "error", help: "最长不能超过10个字"
			},
			tempValue: e.target.value
		})
	}
	saveFieldsValue = () => {
		const { tempValue } = this.state
		const { changeColumnsAlias, groupId } = this.props
		const { name, column_id: id } = this.props.data

		if (tempValue != name) {
			if (!this.validate(tempValue)) {
				return
			}
			// 调用修改别名action 判断是否跟原名相同
			changeColumnsAlias({ groupId, id, val: tempValue })
		}
		changeColumnsAlias({ groupId, id, val: false, key: 'edit' })
		this.setState({
			// edit: false,
			tempValue: tempValue || name
		})
	}
	cancelFieldsValue = () => {
		const { changeColumnsAlias, groupId } = this.props
		const { alias, name, column_id: id, edit } = this.props.data
		changeColumnsAlias({ groupId, id, val: false, key: 'edit' })
		this.setState({
			// edit: false,
			errorProps: {},
			tempValue: alias || name
		})
	}

	constructor(props) {
		super(props)
		const { alias, name } = props.data
		this.state = {
			// edit: false,
			errorProps: {},
			tempValue: alias || name
		}
	}

	render() {
		const {
			isDragging,
			connectDragSource,
			connectDropTarget,
			data,
			drag,
			index,
			length,
			del
		} = this.props
		const { alias, name, removeable_status, edit } = data
		const { tempValue, errorProps } = this.state
		const opacity = isDragging ? 0 : 1
		const content = edit ? <div className='item-content edit-item'>
			<FormItem {...errorProps}>
				<Input
					style={{ width: 120 }}
					value={tempValue}
					onChange={this.handleChangeValue}
					placeholder='字段名'
				// onBlur={this.cancelFieldsValue}
				/>
			</FormItem>
			<div className='actions' style={{ marginLeft: 6 }}>
				<a onClick={this.saveFieldsValue}>保存</a>
				<Divider type="vertical" />
				<a onClick={this.cancelFieldsValue}>取消</a>
			</div>
		</div> : <div className='item-content view-item'>
				{alias ? alias + '[' + name + ']' : name}
				<Icon className='actions' style={styleMainColor} onClick={this.isEdit} type="edit" theme="outlined" />
				<div className='actions' style={styleAutoActions}>
					<a onClick={() => drag(index, 0)}>置顶</a>
					<Divider type="vertical" />
					<a onClick={() => drag(index, length - 1)}>置底</a>
				</div>
			</div>
		return connectDragSource && connectDropTarget &&
			connectDragSource(connectDropTarget(
				<div className='selected-fields-item' style={{ opacity }} onDoubleClick={this.isEdit}>
					<Icon type="pause" theme="outlined" />
					{content}
					{removeable_status == 2 ? <Icon type="lock" theme="filled" /> :
						<Icon type="close" theme="outlined" onClick={() => del(index)} />}
				</div>
			))
	}
}
