import React from 'react'
import { Row, Col, Form, Select, Button, message, Input, Icon } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

class ExtractQuery extends React.Component {
	constructor() {
		super();
		this.state = {

		}
	}
	handleSearch = (e) => {
		const { questAction, handlefilterParams } = this.props;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			let params = { ...values };
			Object.keys(params).forEach(item => { !params[item] && params[item] !== 0 ? delete params[item] : null });
			if (!err) {
				const hide = message.loading('查询中，请稍候...');
				questAction({ ...params, page: 1 }).then(() => {
					handlefilterParams(params);
					hide();
				}).catch(() => {
					message.error('查询失败');
					hide();
				});
			}
		});
	}
	handleClear = () => {
		this.props.form.resetFields();
	}
	render() {
		let { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
		};
		const strConfig = {
			rules: [{ type: 'string', required: false }]
		}
		return <div>
			<Form className='extractManage-search-form'>
				<Row>
					<Col span={6}>
						<FormItem label='主账号名：' {...formItemLayout}>
							{getFieldDecorator('identity_name', strConfig)(
								<Input placeholder="请输入" />
							)}
						</FormItem>
					</Col>
					<Col span={6}>
						<FormItem label='状态：' {...formItemLayout}>
							{getFieldDecorator('status', { initialValue: '' })(
								<Select style={{ width: 120 }}>
									<Option value="">不限</Option>
									<Option value="1">待审核</Option>
									<Option value="2">待打款</Option>
									<Option value="3">已打款</Option>
									<Option value="4">审核失败</Option>
								</Select>
							)}
						</FormItem>
					</Col>
					<Col span={4}>
						<Button type="primary" htmlType="submit" onClick={this.handleSearch}>查询</Button>
						<a className="reset-filter left-gap" onClick={this.handleClear}><Icon type="retweet" />重置搜索框</a>
					</Col>
				</Row>
			</Form>
		</div>
	}
}

export default Form.create()(ExtractQuery);
