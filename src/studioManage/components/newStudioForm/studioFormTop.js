import React from 'react'
import { Input, Row, Form, Select, Radio, Checkbox } from "antd";
import { withRouter } from "react-router-dom";
import Alipay from './alipay'
import BankCard from './bankcard'
import { calcBytes } from '../../utils'
import qs from 'qs'
import numeral from 'numeral'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

class StudioFormTop extends React.Component {
	constructor() {
		super();
		this.state = {
		}
	}
	checkChange = (value) => {
		this.props.form.setFieldsValue({ 'is_support_alipay': value });
	}
	checkName = (rule, value, callback) => {
		let num = calcBytes(value || '');
		if (num >= 0 && num <= 60) {
			callback();
			return;
		}
		callback('最多可输入30个汉字或60个字符!');
	}
	checkMoney = (rule, value, callback) => {
		let newValue = value ? value.replace(/' '/g, '') : '';
		const search = qs.parse(this.props.location.search.substring(1));
		if (newValue && isNaN(newValue)) {
			callback('请输入正确的金额');
			return;
		}
		if (parseFloat(newValue) > parseFloat(999999999.99)) {
			callback('最多可输入9位数');
			return;
		}
		if (search.postType === '1' || !search.postType) {
			if (parseFloat(newValue) < parseFloat(0.01)) {
				callback('输入金额最低为0.01元');
			}
		}
		if (search.postType === '2') {
			let minValue = this.props.minValue;
			if (newValue * 100 < minValue) {
				callback(`最少输入${numeral(minValue / 100).format('0.00')}元`);
			}
		}
		callback()
	}
	checkLimitMoney = (rule, value, callback) => {
		let newValue = value ? value.replace(/' '/g, '') : '';
		if (newValue && isNaN(newValue)) {
			callback('请输入正确的金额');
			return;
		}
		if (parseFloat(newValue) > parseFloat(999999999.99)) {
			callback('最多可输入9位数');
			return;
		}
		callback();
	}
	checkLimitMoneyMonth = (rule, value, callback) => {
		let newValue = value ? value.replace(/' '/g, '') : '';
		if (newValue && isNaN(newValue)) {
			callback('请输入正确的金额');
			return;
		}
		if (parseFloat(newValue) > parseFloat(999999999.99)) {
			callback('最多可输入9位数');
			return;
		}
		callback();
	}
	render() {
		const { getFieldDecorator, getFieldValue } = this.props.form;
		const { formItemLayout, platforms, bank } = this.props;
		const checkValue = getFieldValue('is_support_alipay');
		return <div>
			<Row>
				<FormItem label='工作室名称' {...formItemLayout}>
					{getFieldDecorator('name', {
						rules: [{
							required: true, message: '请输入工作室名称!'
						}, {
							validator: this.checkName,
						}]
					})(
						<Input placeholder="最多可输入30个汉字或60个字符" />
					)}
				</FormItem>
			</Row>
			<Row>
				<FormItem label='打款标识' {...formItemLayout}>
					{getFieldDecorator('identity', {
						rules: [
							{ required: true, message: '请输入打款标识!' },
							{ max: 60, message: '最多可输入60个字符的英文！' },
							{ pattern: /^[a-zA-Z]+$/, message: '请输入正确的打款标识!' }
						]
					})(
						<Input placeholder="最多可输入60个字符的英文，例如：AiXuan" />
					)}
				</FormItem>
			</Row>
			<Row>
				<FormItem label='类型' {...formItemLayout}>
					{getFieldDecorator('type', {
						initialValue: 1,
						rules: [{
							required: true, message: '请选择类型'
						}]
					})(
						<RadioGroup>
							<Radio value={1}>自有</Radio>
							<Radio value={2}>三方</Radio>
						</RadioGroup>
					)}
				</FormItem>
			</Row>
			<Row>
				<FormItem label='支持平台' {...formItemLayout}>
					{getFieldDecorator('supported_platforms', {
						initialValue: 1,
						rules: [{ required: true, message: '请选择平台' }]
					})(
						<Select>
							{platforms.map((item, key) =>
								<Option key={key} value={item.id}>{item.display}</Option>)
							}
						</Select>
					)}
				</FormItem>
			</Row>
			<Row>
				<FormItem label='快易提' {...formItemLayout}>
					{getFieldDecorator('is_support_flash', {
						rules: [{ required: true, message: '请选择是否支持快易提' }]
					})(
						<RadioGroup>
							<Radio value={1}>支持</Radio>
							<Radio value={2}>不支持</Radio>
						</RadioGroup>
					)}
				</FormItem>
			</Row>
			<Row>
				<FormItem label='非身份证' {...formItemLayout}>
					{getFieldDecorator('is_support_not_id_card', {
						rules: [{ required: true, message: '请选择是否支持非身份证' }]
					})(
						<RadioGroup>
							<Radio value={1}>支持</Radio>
							<Radio value={2}>不支持</Radio>
						</RadioGroup>
					)}
				</FormItem>
			</Row>
			<Row>
				<FormItem label='总限额' {...formItemLayout}>
					{getFieldDecorator('total_limit', {
						rules: [{
							required: true, message: '请输入总限额金额'
						}, {
							validator: this.checkMoney,
						}]
					})(
						<Input placeholder="请输入" />
					)}
				</FormItem>
			</Row>
			<Row>
				<FormItem label='单笔限额' {...formItemLayout}>
					{getFieldDecorator('single_limit', {
						rules: [{
							required: true, message: '请输入单笔限额'
						},
						{
							validator: this.checkLimitMoneyMonth,
						}]
					})(
						<Input placeholder="请输入" />
					)}
				</FormItem>
			</Row>
			<Row>
				<FormItem label='博主单月累计限额' {...formItemLayout}>
					{getFieldDecorator('monthly_limit', {
						rules: [{
							required: true, message: '请输入博主单月累计限额'
						}, {
							validator: this.checkLimitMoney,
						}]
					})(
						<Input placeholder="请输入" />
					)}
				</FormItem>
			</Row>
			<Row>
				<FormItem label='支付方式' {...formItemLayout}>
					{getFieldDecorator('is_support_alipay', {
						initialValue: [2],
						rules: [{ required: true, message: '请选择支付方式' }]
					})(
						<CheckboxGroup
							options={[
								{ label: '支付宝', value: 1 },
								{ label: '银行卡', value: 2, disabled: true }
							]}
							onChange={this.checkChange}
						/>
					)}
				</FormItem>
			</Row>
			{checkValue && checkValue.includes(1) && <Alipay form={this.props.form} formItemLayout={formItemLayout}></Alipay>}
			{checkValue && checkValue.includes(2) && <BankCard form={this.props.form} formItemLayout={formItemLayout} bank={bank}></BankCard>}
		</div>
	}
}
export default withRouter(StudioFormTop);
