import React, { Component, PureComponent } from "react"
import { Checkbox, Popover } from 'antd'
import CollapseSwitch from "@/components/exportTemplate/base/CollapseSwitch";
import './FieldsCheckboxGroup.less'


export default class FieldsCheckboxGroup extends Component {
	state = {
		showFields: true
	}

	handleClick = () => {
		this.setState({
			showFields: !this.state.showFields
		})
	}


	componentWillMount() { }

	render() {
		const { showFields } = this.state
		const { title, fields = [], sources } = this.props
		return <div className='fields-checkbox-group-container'>
			<header className='group-head-title'>
				<h4>{title}</h4>
				<CollapseSwitch status={showFields} onClick={this.handleClick} />
			</header>
			<div className={'group-content-list' + (showFields ? ' show' : '')}>
				{
					fields.map(key => {
						const { column_id: id, name, introduction, removeable_status } = sources[key]
						return <Checkbox key={id} value={id} disabled={removeable_status == 2}>
							<Label name={name} content={introduction} />
						</Checkbox>
					})
				}
			</div>
		</div>
	}
}

class Label extends PureComponent {
	render() {
		const { name, content } = this.props
		return content ?
			<Popover placement="topLeft" content={<div style={{ maxWidth: '260px' }}>{content}</div>}>
				{name}
			</Popover> : <span>{name}</span>
	}
}
