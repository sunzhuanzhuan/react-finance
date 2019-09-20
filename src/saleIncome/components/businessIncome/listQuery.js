import React from 'react'
import { Row, Col, Form, Select, Button, message, Icon } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

class BusinessListQuery extends React.Component {
	constructor() {
		super();
		this.state = {

		}
	}
	handleSearch = (e) => {
		const { questAction, page_size, handlefilterParams } = this.props;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const hide = message.loading('查询中，请稍候...');
				questAction({ ...values, page: 1, page_size }).then(() => {
					handlefilterParams(values);
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
		let { handleNew, nameList, quoteType, postType } = this.props;
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		return <div>
			<Form>
				<Row type="flex" justify="start" gutter={16}>
					<Col span={4}>
						<FormItem label="姓名" {...formItemLayout} >
							{getFieldDecorator('sale_id', { initialValue: '' })(
								<Select showSearch
									filterOption={(input, option) => (
										option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
									)}
								>
									<Option value="">全部</Option>
									{nameList.map((item, key) =>
										<Option key={key} value={item.user_id}>{item.real_name}</Option>)
									}
								</Select>
							)}
						</FormItem>
					</Col>
					{/* <Col span={4}>
						<FormItem label="业务类型" {...formItemLayout} >
							{getFieldDecorator('order_type', { initialValue: '' })(
								<Select
									filterOption={(input, option) => (
										option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
									)}
								>
									<Option value="">全部</Option>
									{orderType.map((item, key) =>
										<Option key={key} value={item.id}>{item.display}</Option>)
									}
								</Select>
							)}
						</FormItem>
					</Col> */}
					<Col span={4}>
						<FormItem label="收费模式" {...formItemLayout} >
							{getFieldDecorator('quote_type', { initialValue: '' })(
								<Select
									filterOption={(input, option) => (
										option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
									)}
								>
									<Option value="">全部</Option>
									{quoteType.map((item, key) =>
										<Option key={key} value={item.id}>{item.display}</Option>)
									}
								</Select>
							)}
						</FormItem>
					</Col>
					<Col span={4}>
						<FormItem label='岗位类型' {...formItemLayout}>
							{getFieldDecorator('position_level', { initialValue: '' })(
								<Select
									filterOption={(input, option) => (
										option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
									)}
								>
									<Option value="">全部</Option>
									{postType.map((item, key) =>
										<Option key={key} value={item.id}>{item.display}</Option>)
									}
								</Select>
							)}
						</FormItem>
					</Col>
					<Col style={{ marginLeft: '50px', marginTop: '2px' }}>
						<Button type="primary" onClick={this.handleSearch}>查询</Button>
						<Button className='left-gap' type="primary" onClick={() => {
							handleNew('new', {})
						}}>新增</Button>
						<a className="left-gap" onClick={this.handleClear}><Icon type="retweet" />重置搜索框</a>
					</Col>
				</Row>
			</Form>
		</div>
	}
}

export default Form.create()(BusinessListQuery);
