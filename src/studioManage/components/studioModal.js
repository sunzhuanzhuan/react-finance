import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as studioActions from "../actions";
import { Select, Modal, Button, Form } from "antd";
import numeral from 'numeral';
const FormItem = Form.Item;
const Option = Select.Option;

class StudioModal extends React.Component {
	constructor() {
		super();
		this.state = {

		}
	}
	handleOk = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.props.handleSubmit(values);
			}
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { visible, type, onCancel, freezeList, studioCheck, studioNameCheck, sourceType, isClick, curSelectRows } = this.props;
		let rowsValue = type === 'change' ? curSelectRows.reduce((prev, cur) => parseFloat(prev.occupy_amount) + parseFloat(cur.occupy_amount)) : 0;
		rowsValue = Object.prototype.toString.call(rowsValue) === '[object Object]' ? parseFloat(rowsValue.occupy_amount) : rowsValue;
		let typeObj = {};
		sourceType.forEach(item => {
			typeObj[item.id] = item.display;
		});
		let studioNameList = type === 'change' ? studioNameCheck : studioNameCheck.filter(item => item.id !== studioCheck.id);
		return <Modal
			wrapClassName='studio-modal'
			title={null}
			visible={visible}
			maskClosable={false}
			onCancel={onCancel}
			footer={[
				<Button key="back" onClick={onCancel}>返回</Button>,
				<Button key="submit" type="primary" onClick={this.handleOk} disabled={isClick}>确认</Button>
			]}

		>
			<ModalHeader type={type} />
			<div className='studio-list-container'>
				{type && type === 'stop' ? <div>
					<span>当前工作室：{studioCheck.name}</span>
					<span className='left-gap'>剩余比例：{studioCheck.remaining_amount_ratio > 0 ? numeral(studioCheck.remaining_amount_ratio).format('0.00%') : numeral(0).format('0.00%')}</span>
					<span className='left-gap'>剩余额度：{numeral(studioCheck.remaining_amount / 100).format('0,0.00')}</span>
				</div> : null}
				<div className='studio-list'>
					{type && type === 'stop' ? freezeList.map(item => {
						return <div key={item.source_id}>
							<span>打款类型：{typeObj[item.source_type]}</span>
							<span style={{ display: 'inline-block', width: '110px' }} className='left-gap'>打款单ID：{item.source_id}</span>
							<span className='left-gap'>已冻结订单金额：{numeral(item.freeze_amount / 100).format('0,0.00')}</span>
						</div>
					}) : type && type === 'change' ? curSelectRows.map(item => {
						return <div key={item.source_id}>
							<span>打款类型：{item.source_type_display}</span>
							<span style={{ display: 'inline-block', width: '110px' }} className='left-gap'>打款单ID：{item.source_id}</span>
							<span className='left-gap'>已冻结订单金额：{numeral(item.occupy_amount / 100).format('0,0.00')}</span>
						</div>
					}) : null}
					{type && ((type === 'stop' && freezeList.length > 20) || (type === 'change' && curSelectRows.length > 20)) ? <div style={{ textAlign: 'center' }}>最多只显示20条哟~</div> : null}
				</div>
				<div>
					转移订单总金额：{type && type === 'stop' ? numeral(studioCheck.total_freeze / 100).format('0,0.00') : type && type === 'change' ? numeral(rowsValue / 100).format('0,0.00') : null}
				</div>
			</div>
			<div style={{ marginTop: '10px' }}>
				<p>转移工作室名称：</p>
				<Form>
					<FormItem>
						{getFieldDecorator('to_studio_id', {
							rules: [{
								required: true, message: '目标工作室为空！'
							}]
						})(
							<Select className='studio-select'
								showSearch
								filterOption={(input, option) => {
									let value = option.props.value;
									let obj = studioNameList.find(item => item.id === value);
									return obj.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
								}}
							>
								{studioNameList.map(item => {
									return <Option key={item.id} value={item.id}>
										<p>{item.name}</p>
										<p>
											<span>剩余比例：{item.remaining_amount_ratio > 0 ? numeral(item.remaining_amount_ratio).format('0.00%') : numeral(0).format('0.00%')}</span>
											<span className='left-gap'>剩余额度：{numeral(item.remaining_amount / 100).format('0,0.00')}</span>
										</p>
									</Option>
								})}
							</Select>
						)}
					</FormItem>
				</Form>
			</div>
		</Modal>
	}
}
const mapStateToProps = () => {
	return {
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...studioActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StudioModal))

const ModalHeader = ({ type }) => {
	return <div className='modal-header'>
		<h3>{type === 'change' ? '请选择更换的工作室名称' : type === 'stop' ? '确认是否停用该工作室' : null}</h3>
		<p>注：<span className='red-font'>{type === 'change' ? '更换工作室以提现单为维度处理' : type === 'stop' ? '停用工作室需转移对应未提现的提现单' : null}</span></p>
	</div>
}
