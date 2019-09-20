import React from 'react'
import { Input, Row, Col, Form, Select, Button, DatePicker } from "antd";

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

class StudioFormBot extends React.Component {
	constructor() {
		super();
		this.state = {
			today: ''
		}
	}
	componentDidMount() {
		let today = this.getDate();
		this.setState({ today })
	}
	checkCount = (rule, value, callback) => {
		const reg = /^(([1-9]\d?(\.\d\d?)?)|(0\.(0[1-9]|[1-9]{1,2})))$/;
		if (value) {
			if (reg.test(value.toString())) {
				callback();
				return;
			}
			callback('请填写大于0小于等于100最多保留两位小数的有效数字！');
		} else {
			callback(' ')
		}
	}
	getDate = () => {
		let date = new Date();
		let years = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		month = month < 10 ? "0" + month : month;
		day = day < 10 ? "0" + day : day;
		let today = years + "-" + month + "-" + day;
		return today;
	}
	disabledDate = (current) => {
		var timestamp = new Date(this.state.today).getTime();
		timestamp = timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
		return current && current.valueOf() < timestamp;
	}
	render() {
		const { getFieldDecorator, getFieldValue } = this.props.form;
		const { formItemLayout, taxLayout, handleOk } = this.props;
		const selectValue = getFieldValue('invoice_tax_rate');
		return <div>
			<Row>
				<FormItem label='发票抬头' {...formItemLayout}>
					{getFieldDecorator('invoice_provider', { rules: [{ required: true, message: '请填写发票抬头' }] })(
						<Input placeholder="请输入" />
					)}
				</FormItem>
			</Row>
			<Row type='flex' justify='start' gutter={16}>
				<Col span={6}>
					<FormItem label='税率' {...taxLayout}>
						{getFieldDecorator('invoice_tax_rate', { initialValue: '0.06', rules: [{ required: true, message: '请填写自定义税率' }] })(
							<Select style={{ width: 120 }} disabled>
								<Option value="0.06">6%</Option>
								<Option value="0.03">3%</Option>
								<Option value="0.00">其它</Option>
							</Select>
						)}
					</FormItem>
				</Col>
				{selectValue && selectValue == '0.00' ? <Col style={{ marginLeft: '20px' }}>
					<FormItem label=''>
						{getFieldDecorator('tax_value', {
							rules: [{ required: true, message: '请填写税率' }, {
								validator: this.checkCount,
							}]
						})(
							<Input addonAfter={'%'} style={{ width: 120 }} />
						)}
					</FormItem>
				</Col> : null}
			</Row>
			<Row style={{ marginTop: '10px' }}>
				<FormItem label="有效期" {...formItemLayout} >
					{getFieldDecorator('validity_start', { rules: [{ required: true, message: '请选择有效期开始日期' }] })(
						<DatePicker format={'YYYY-MM-DD'} placeholder='开始日期' disabledDate={this.disabledDate} />
					)}~
					{getFieldDecorator('validity_end', { rules: [{ required: true, message: '请选择有效期截止日期' }] })(
						<DatePicker format={'YYYY-MM-DD'} placeholder='结束日期' disabledDate={this.disabledDate} />
					)}
				</FormItem>
			</Row>
			<Row>
				<FormItem label="备注" {...formItemLayout} >
					{getFieldDecorator('remark')(
						<TextArea placeholder="请输入描述" autosize={{ minRows: 3, maxRows: 5 }} maxLength="200" ></TextArea>
					)}
				</FormItem>
			</Row>
			<Row className='top-gap' type='flex' justify='center'>
				<Button type='default' onClick={() => {
					this.props.history.push('/finance/studiomanage/list');
				}}>取消</Button>
				<Button className='left-gap' type='primary' onClick={handleOk}>提交</Button>
			</Row>
		</div>
	}
}
export default StudioFormBot;
