import React from 'react'
import { Row, Col, Form, Select, Button, message, Input } from "antd";
import qs from 'qs';
import { orderStatus } from '../constants/config'


const FormItem = Form.Item;
const Option = Select.Option;

class ListQuery extends React.Component {
	constructor() {
		super();
		this.state = {

		}
	}
	handleSearch = (e) => {
		const { questAction, accountList: { page_size }, handlefilterParams } = this.props;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {


				const hide = message.loading('查询中，请稍候...');

				questAction({ ...values, page: 1, page_size }).then(() => {
					handlefilterParams({ ...values });

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
		let { searchDetail } = this.props;
		// console.log(searchDetail)
		// nameList = Object.values(nameList);
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 18 },
		};
		return <div className='mission-list-query'>
			<Form>
				<Row>
					<Col span={5}>
						<FormItem label='订单ID' {...formItemLayout}>
							{getFieldDecorator('order_id')(
								<Input style={{ width: 140 }} allowClear />
							)}
						</FormItem>
					</Col>
					<Col span={7}>
						<FormItem label="订单执行状态" {...formItemLayout} >
							{getFieldDecorator('execution_status')(
								<Select placeholder="请选择" style={{ width: 140 }} allowClear>
									{searchDetail.execution_status ? searchDetail.execution_status.map(item =>
										<Option key={item.value} value={item.value}>
											{item.name}
										</Option>)
										: null}
								</Select>
							)}
						</FormItem>
					</Col>
					<Col span={5}>
						<FormItem label='公司简称' {...formItemLayout}>
							{getFieldDecorator('company_name', { initialValue: '' })(
								<Input style={{ width: 140 }} allowClear />
							)}
						</FormItem>
					</Col>
					<Col span={6}>
						<FormItem label='平台' {...formItemLayout}>
							{getFieldDecorator('weibo_type', { initialValue: '' })(
								<Select style={{ width: 140 }} allowClear>{
									searchDetail.platform ? searchDetail.platform.map((item) => {
										return <Option value={item.value} key={item.value}> {item.name}</Option>
									})
										: null}</Select>
							)}
						</FormItem>
					</Col>

				</Row>
				<Row>
					<Col span={5}>
						<FormItem label='媒介经理' {...formItemLayout}>
							{getFieldDecorator('owner_admin_id', { initialValue: '' })(
								<Select style={{ width: 140 }} allowClear>{
									searchDetail.resource_media ? searchDetail.resource_media.map((item) => {
										return <Option value={item.value} key={item.value}> {item.name}</Option>
									})
										: null}</Select>
							)}
						</FormItem>
					</Col>
					<Col span={7}>
						<FormItem label="三方标识" {...formItemLayout} >
							{getFieldDecorator('trinity_type')(
								<Select allowClear placeholder="请选择" style={{ width: 140 }}>
									{searchDetail.trinity_type ? searchDetail.trinity_type.map(item =>
										<Option key={item.value} value={item.value}>
											{item.name}
										</Option>)
										: null}
								</Select>
							)}
						</FormItem>
					</Col>
					<Col span={5}>
						<FormItem label='所属销售' {...formItemLayout}>
							{getFieldDecorator('sale_manager_id', { initialValue: '' })(
								<Select allowClear placeholder="请选择" style={{ width: 140 }}>
									{searchDetail.sale ? searchDetail.sale.map(item =>
										<Option key={item.value} value={item.value}>
											{item.name}
										</Option>)
										: null}
								</Select>
							)}
						</FormItem>
					</Col>
					<Col span={6}>
						<FormItem label='账号名称' {...formItemLayout}>
							{getFieldDecorator('weibo_name', { initialValue: '' })(
								<Input style={{ width: 140 }} allowClear />
							)}
						</FormItem>
					</Col>

				</Row>
				<Row style={{ marginBottom: '20px' }}>
					<Col span={20}></Col>


					<Col span={4}>
						<Button type="primary" className='left-gap' onClick={this.handleSearch}>查询</Button>
						<Button style={{ marginLeft: '20px' }} className='left-gap' type="primary" onClick={() => {
							this.props.form.resetFields()
						}}>重置</Button>
					</Col>
				</Row>
			</Form>
		</div>
	}
}

export default Form.create()(ListQuery);
