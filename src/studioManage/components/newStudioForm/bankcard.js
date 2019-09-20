import React from 'react'
import { Input, Row, Form, Select } from "antd";

const FormItem = Form.Item;
const Option = Select.Option;

class BankCard extends React.Component {
	constructor() {
		super();
		this.state = {

		}
		// this.handleCheckCard = debounce(this.checkCard, 800);
	}
	checkCard = (rule, value, callback) => {
		const reg = /^[0-9]\d{0,30}$/;
		if (!reg.test(value) || !value) {
			callback('请输入正确的银行卡信息');
			return
		}
		callback();
		// let bankValue = this.props.form.getFieldValue('payment_type_id');
		// let isConform = bankValue ? bankList[bankValue].patterns.some(item => item.reg.test(value)) : false;
		// isConform || !value ? callback() : callback('请输入正确的银行卡信息');
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { formItemLayout, bank } = this.props;
		return <div>
			<Row>
				<FormItem label='银行卡开户行' {...formItemLayout}>
					{getFieldDecorator('payment_type_id', {
						initialValue: '',
						rules: [{ required: true, message: '请选择银行卡开户行' }]
					})(
						<Select>
							<Option value=''>请选择</Option>
							{bank.map((item, key) =>
								<Option key={key} value={item.id}>{item.display}</Option>)
							}
						</Select>
					)}
				</FormItem>
			</Row>
			<Row>
				<FormItem label='开户行所在省' {...formItemLayout}>
					{getFieldDecorator('bank_agency_province', { rules: [{ required: true, message: '请填写开户行所在省' }] })(
						<Input placeholder="请输入" />
					)}
				</FormItem>
			</Row>
			<Row>
				<FormItem label='开户行所在市' {...formItemLayout}>
					{getFieldDecorator('bank_agency_city', { rules: [{ required: true, message: '请填写开户行所在市' }] })(
						<Input placeholder="请输入" />
					)}
				</FormItem>
			</Row>
			<Row>
				<FormItem label='开户支行' {...formItemLayout}>
					{getFieldDecorator('bank_agency', { rules: [{ required: true, message: '请填写开户支行' }] })(
						<Input placeholder="请输入" />
					)}
				</FormItem>
			</Row>
			<Row>
				<FormItem label='持卡人' {...formItemLayout}>
					{getFieldDecorator('real_name', {
						rules: [{ required: true, message: '请输入正确的持卡人信息' }]
					})(
						<Input placeholder="请输入" />
					)}
				</FormItem>
			</Row>
			<Row>
				<FormItem label='卡号' {...formItemLayout}>
					{getFieldDecorator('card_number', {
						rules: [{ required: true, message: ' ' },
						{ validator: this.checkCard, }]
					})(
						<Input placeholder="请输入" />
					)}
				</FormItem>
			</Row>
		</div>
	}
}
export default BankCard;
