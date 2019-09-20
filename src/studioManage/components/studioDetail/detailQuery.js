import React from 'react'
import { Button, Input, Row, Col, Form, Select, Icon, message, DatePicker } from "antd";

const FormItem = Form.Item;
const Option = Select.Option;

class StudioDetailQuery extends React.Component {
	constructor() {
		super();
		this.state = {
		}
	}
	handleSearch = (e) => {
		const { questAction, searchAction, page, pageSize, handlefilterParams, handleCurRowsChange } = this.props;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let created_at_start = values['created_at_start'] ? values['created_at_start'].format('YYYY-MM-DD') : null;
				let created_at_end = values['created_at_end'] ? values['created_at_end'].format('YYYY-MM-DD') : null;
				let params = {
					...values,
					created_at_start,
					created_at_end
				};
				delete params['created_at'];
				Object.keys(params).forEach(item => { !params[item] && params[item] !== 0 ? delete params[item] : null });
				const hide = message.loading('查询中，请稍候...');
				Promise.all([searchAction({ ...params, page, page_size: pageSize }), questAction({ ...params, page, page_size: pageSize })]).then(() => {
					handlefilterParams(params);
					handleCurRowsChange();
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
		const { getFieldDecorator } = this.props.form;
		const { sourceType, sourceStatus } = this.props;
		const formItemLayout = {
			labelCol: { span: 7 },
			wrapperCol: { span: 17 },
		};

		return <Form className='studioManage-search-form'>
			<Row type="flex" justify="start" gutter={16}>
				<Col className='warp-control'>
					<FormItem label='工作室ID' {...formItemLayout}>
						{getFieldDecorator('studio_id')(
							<Input placeholder="请输入" style={{ width: 160 }} />
						)}
					</FormItem>
				</Col>
				<Col className='warp-control'>
					<FormItem label='状态' {...formItemLayout}>
						{getFieldDecorator('source_status', { initialValue: '' })(
							<Select style={{ width: 160 }}>
								<Option value="">不限</Option>
								{sourceStatus.map((item, key) =>
									<Option key={key} value={item.id}>{item.display}</Option>)
								}
							</Select>
						)}
					</FormItem>
				</Col>
				<Col className='warp-control'>
					<FormItem label='类型' {...formItemLayout}>
						{getFieldDecorator('source_type', { initialValue: '' })(
							<Select style={{ width: 160 }}>
								<Option value="">不限</Option>
								{sourceType.map((item, key) =>
									<Option key={key} value={item.id}>{item.display}</Option>)
								}
							</Select>
						)}
					</FormItem>
				</Col>
				<Col className='left-gap'>
					<FormItem>
						<Button type="primary" htmlType="submit" onClick={this.handleSearch}>查询</Button>
						<a className="reset-filter left-gap" onClick={this.handleClear}><Icon type="retweet" />重置搜索框</a>
					</FormItem>
				</Col>
			</Row>
			<Row type="flex" justify="start" gutter={16}>
				<Col className='warp-control'>
					<FormItem label='工作室名称' {...formItemLayout}>
						{getFieldDecorator('name')(
							<Input placeholder="请输入" style={{ width: 160 }} />
						)}
					</FormItem>
				</Col>
				<Col className='warp-control'>
					<FormItem label='打款单ID' {...formItemLayout}>
						{getFieldDecorator('source_id', { initialValue: '' })(
							<Input placeholder="请输入" style={{ width: 160 }} />
						)}
					</FormItem>
				</Col>
				<Col className='warp-control detail-data-picker'>
					<FormItem label="提现时间"{...formItemLayout}>
						{getFieldDecorator('created_at_start')(
							<DatePicker format={'YYYY-MM-DD'} placeholder='开始日期' style={{ width: 110 }} />
						)}~
						{getFieldDecorator('created_at_end')(
							<DatePicker format={'YYYY-MM-DD'} placeholder='结束日期' style={{ width: 110 }} />
						)}
					</FormItem>
				</Col>
			</Row>
		</Form >
	}
}

export default Form.create()(StudioDetailQuery);
