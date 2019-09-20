import React from 'react'
import { Input, Row, Form } from "antd";

const FormItem = Form.Item;

class Alipay extends React.Component {
	constructor() {
		super();
		this.state = {

		}
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { formItemLayout } = this.props;
		return <div>
			<Row>
				<FormItem label='支付宝名称' {...formItemLayout}>
					{getFieldDecorator('alipay_real_name', { rules: [{ required: true, message: '请输入正确的支付宝名称' }] })(
						<Input placeholder="请输入" />
					)}
				</FormItem>
			</Row>
			<Row>
				<FormItem label='支付宝账号' {...formItemLayout}>
					{getFieldDecorator('alipay_card_number', { rules: [{ required: true, message: '请输入正确的支付宝账号' }] })(
						<Input placeholder="请输入" />
					)}
				</FormItem>
			</Row>
		</div>
	}
}

export default Alipay;
