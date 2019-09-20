import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as trinityPayAction from "../actions/trinityInvoice";
import { Modal, message, Button, Form, Input, Select, DatePicker } from 'antd'
import { moneyToChinese } from "../util/index";
import numeral from 'numeral'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const format = 'YYYY-MM-DD';
class PreModal extends React.Component {
	constructor() {
		super();
		this.state = {
			isClick: false,
			bigMoney: '',
			bigMoneyTax: ''
		}
	}
	componentDidMount() {
		const { status, record } = this.props;
		if (status === 'modification') {
			this.pureValue = record.invoice_pure_amount;
			this.taxValue = record.invoice_tax_amount;
			this.voiceType = record.invoice_tax_amount;
			let timer = setTimeout(() => {
				this.props.form.setFieldsValue({
					invoice_source: parseInt(record.invoice_source),
					invoice_number: record.invoice_number,
					business_account_id: parseInt(record.business_account_id),
					invoice_title: parseInt(record.invoice_title),
					beneficiary_company: record.beneficiary_company,
					invoice_content: record.invoice_content,
					invoice_pure_amount: record.invoice_pure_amount,
					invoice_tax_amount: record.invoice_tax_amount,
					invoice_make_out_time: moment(record.invoice_make_out_time, format),
					remark: record.remark,
					invoice_tax_rate: record.invoice_tax_rate,
					invoice_type: record.invoice_type
				})
				clearTimeout(timer);
			}, 0);
		}
	}
	titleMapping = (status) => {
		const Mapping = {
			'new': { title: '新增发票', actionName: 'postTrinityInvoiceAdd' },
			'modification': { title: '编辑', actionName: 'postTrinityInvoiceEdit' },
		}
		return Mapping[status]
	}
	handlePureChange = e => {
		this.setState({ bigMoney: moneyToChinese(e.target.value) })
		this.pureValue = e.target.value;
		if (e.target.value && !isNaN(this.taxValue)) {

			this.props.form.setFieldsValue({
				invoice_type: numeral(this.taxValue / this.pureValue * 100).format('0.00')
			});
		}
		this.handleVoiceType()
	}
	handleTaxChange = e => {
		this.setState({ bigMoneyTax: moneyToChinese(e.target.value) })
		this.taxValue = e.target.value;
		this.voiceType = e.target.value;
		if (e.target.value && !isNaN(this.pureValue)) {
			this.props.form.setFieldsValue({
				invoice_tax: numeral(this.taxValue / this.pureValue * 100).format('0.00')
			});
		}
	}
	handleTax = () => {
		if (!this.taxValue) {
			this.props.form.setFieldsValue({
				invoice_tax_rate: (0 / this.pureValue * 100).toFixed(2)
			});
		} else {
			this.props.form.setFieldsValue({
				invoice_tax_rate: (this.taxValue / this.pureValue * 100).toFixed(2)
			});
		}
		if (this.voiceType > 0) {
			this.props.form.setFieldsValue({
				invoice_type: 1
			});
		} else {
			this.props.form.setFieldsValue({
				invoice_type: 2
			});
		}
	}
	handleVoiceType = () => {
		if (this.voiceType > 0) {
			this.props.form.setFieldsValue({
				invoice_type: 1
			});
		} else {
			this.props.form.setFieldsValue({
				invoice_type: 2
			});
		}
		if (!this.taxValue) {
			this.props.form.setFieldsValue({
				invoice_tax_rate: (0 / this.pureValue * 100).toFixed(2)
			});
		} else {
			this.props.form.setFieldsValue({
				invoice_tax_rate: (this.taxValue / this.pureValue * 100).toFixed(2)
			});
		}


	}
	handleModal = (content) => {
		const { onCancel, status, type } = this.props;
		this.setState({ isClick: true }, () => {
			Modal.confirm({
				title: '提示',
				content,
				onOk: () => {
					this.setState({ isClick: false });
					onCancel();
					this.handleSubmit(status, type);
				},
				onCancel: () => {
					this.setState({ isClick: false });
				},
			})
		})
	}
	handleSubmit = () => {
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const hide = message.loading('操作中，请稍候...');
				const { search, status, onCancel, record } = this.props;
				const actionName = this.titleMapping(status).actionName;
				values.invoice_id = status == 'new' ? null : record.invoice_id
				this.props.actions[actionName]({
					business_account_type: 3,
					...values,
					invoice_make_out_time: moment(values.invoice_make_out_time).format(format)
				}).then(() => {
					message.success('操作成功!');
					hide();
					onCancel();
					this.props.queryAction({ ...search.keys }).catch(({ errorMsg }) => {
						message.error(errorMsg || '列表刷新失败，请重试！');
					})
				}).catch(({ errorMsg }) => {
					message.error(errorMsg || '操作失败，请重试！');
				})
			}
		})
	}
	checkMoney = (rule, value, callback) => {
		const newValue = value ? value.replace(/' '/g, '') : '';
		const reg = /^[1-9]?\d+(\.\d\d?)?$/;
		if (newValue && isNaN(newValue)) {
			callback('请输入正确的金额');
			return;
		}
		if (value == 0) {
			callback('发票金额必须大于0 ');
			return;
		}
		if (value > 9999999999.99) {
			callback('发票金额最大支持9999999999.99 ');
			return;
		}
		if (!reg.test(value)) {
			callback('请输入最多保留两位的有效数字')
			return;
		}
		callback()
	}
	checkMoneyTax = (rule, value, callback) => {
		const newValue = value ? value.replace(/' '/g, '') : '';
		const reg = /^[1-9]?\d+(\.\d\d?)?$/;
		if (!value) {
			callback()
		}
		if (newValue && isNaN(newValue)) {
			callback('请输入正确的金额');
			return;
		}
		if (value < 0) {
			callback('发票金额必须大于0 ');
			return;
		}
		if (value > 9999999999.99) {
			callback('发票金额最大支持9999999999.99 ');
			return;
		}
		if (!reg.test(value)) {
			callback('请输入最多保留两位的有效数字')
			return;
		}

		callback()
	}
	handleCheckVoick = (rule, value, callback) => {
		const reg = /^[0-9a-zA-Z]*$/g;
		if (!value) {
			callback('该项为必填项！')
			return;
		}
		if (!reg.test(value)) {
			callback('只允许输入字母和数字');
			return;
		}
		if (value.length > 50) {
			callback('发票号最多不超过50个字符')
			return;
		}

		callback()
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { visible, onCancel, status, SearchItem, modType } = this.props;
		const { isClick, bigMoney, bigMoneyTax } = this.state;
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 18 }
		};
		const options = {
			rules: [{ required: true, message: '该项为必填项！' }],
		}
		const title = this.titleMapping(status).title;
		return <Modal
			wrapClassName='trinityInvoice-modal'
			key={status}
			width={500}
			title={title}
			visible={visible}
			maskClosable={false}
			onCancel={onCancel}
			footer={[
				<Button key="back" onClick={onCancel}>返回</Button>,
				<Button key="submit" type="primary" disabled={isClick} onClick={this.handleSubmit
				}>确认</Button>
			]}
		>
			<Form>
				<FormItem label='发票来源' {...formItemLayout}>
					{getFieldDecorator('invoice_source', { ...options })(
						<Select placeholder="请选择" style={{ width: 200 }} disabled={modType == 2}
						>
							{SearchItem && SearchItem.invoice_source.map((item) =>
								<Option key={item.value} value={item.value}>{item.name}</Option>)
							}
						</Select>
					)}
				</FormItem>
				<FormItem label='发票号' {...formItemLayout}>
					{getFieldDecorator('invoice_number', {
						rules: [
							{
								required: true,
								validator: this.handleCheckVoick,
								max: 50,
							},
						],
					})(
						<Input placeholder="请输入" style={{ width: 200 }} disabled={modType == 2} />
					)}
				</FormItem>
				<FormItem label='三方代理商' {...formItemLayout}>
					{getFieldDecorator('business_account_id', { ...options })(
						<Select placeholder="请选择" style={{ width: 200 }} disabled={modType == 2}
						>
							{SearchItem && SearchItem.agent.map((item) =>
								<Option key={item.value} value={item.value}>{item.name}</Option>)
							}
						</Select>
					)}
				</FormItem>
				<FormItem label='发票抬头' {...formItemLayout}>
					{getFieldDecorator('invoice_title', { ...options })(
						<Select placeholder="请选择" style={{ width: 200 }} disabled={modType == 2}
						>
							{SearchItem && SearchItem.invoice_title.map((item) =>
								<Option key={item.value} value={item.value}>{item.name}</Option>)
							}
						</Select>
					)}
				</FormItem>
				<FormItem label='发票开具方' {...formItemLayout}>
					{getFieldDecorator('beneficiary_company', {
						rules: [
							{
								required: true,

								message: '该项为必填项！'
							},
							{ max: 50, message: '最多不超过50个字符', }
						],
					})(
						<Input placeholder="请输入" style={{ width: 200 }} />
					)}
				</FormItem>
				<FormItem label='发票内容' {...formItemLayout}>
					{getFieldDecorator('invoice_content', {
						rules: [
							{
								required: true,
								message: '该项为必填项！'
							},
							{ max: 50, message: '最多不超过50个字符', }
						],
					})(
						<Input placeholder="请输入" style={{ width: 200 }} disabled={modType == 2} />
					)}
				</FormItem>
				<FormItem label='发票金额' {...formItemLayout}>
					{getFieldDecorator('invoice_pure_amount', {
						rules: [{ required: true, message: '该项为必填项！' },
						{ validator: this.checkMoney }]
					})(
						<Input placeholder="请输入" style={{ width: 200 }} suffix={'元'} onChange={this.handlePureChange} onBlur={this.handleTax} disabled={modType == 2} />
					)}
					<div style={{ color: 'red' }}>{bigMoney}</div>
				</FormItem>
				<FormItem label='发票税额' {...formItemLayout}>
					{getFieldDecorator('invoice_tax_amount', {
						rules: [{ required: false },
						{ validator: this.checkMoneyTax }]
					})(
						<Input placeholder="请输入" style={{ width: 200 }} suffix={'元'} onChange={this.handleTaxChange} onBlur={this.handleVoiceType} disabled={modType == 2} />
					)}
					<div style={{ color: 'red' }}>{bigMoneyTax}</div>
				</FormItem>
				<FormItem label='发票税率' {...formItemLayout}>
					{getFieldDecorator('invoice_tax_rate')(
						<Input placeholder="请输入" style={{ width: 200 }} suffix={'%'} disabled={true} />
					)}
				</FormItem>
				<FormItem label='发票类型' {...formItemLayout}>
					{getFieldDecorator('invoice_type', {
						initialValue: 2
					})(
						<Select placeholder="请选择" style={{ width: 200 }} disabled={true}
						>
							{SearchItem && SearchItem.invoice_type.map((item) =>
								<Option key={item.value} value={item.value}>{item.name}</Option>)
							}
						</Select>
					)}
				</FormItem>
				<FormItem label='开票日期' {...formItemLayout}>
					{getFieldDecorator('invoice_make_out_time', { ...options })(
						<DatePicker placeholder='请选择' format={format} style={{ width: 200 }} disabled={modType == 2} />
					)}
				</FormItem>
				<FormItem label='备注' {...formItemLayout}>
					{getFieldDecorator('remark')(
						<TextArea placeholder='' autosize={{ minRows: 4, maxRows: 6 }} maxLength={255} disabled={modType == 2} />
					)}
				</FormItem>
			</Form>
		</Modal>
	}
}

const mapStateToProps = (state) => {
	return {
		prePayData: state.trinityPay.prePayData,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...trinityPayAction }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PreModal))
