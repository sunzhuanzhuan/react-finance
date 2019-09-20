import React from 'react'
import { Icon, Button, Input, Row, Col, Form, Select, DatePicker, message } from "antd";

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;


class StudioManageQuery extends React.Component {
	constructor() {
		super();
		this.state = {
		}
	}
	handleSearch = (e) => {
		const { questAction, page, pageSize, handlefilterParams } = this.props;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let validity_start = values['validity_start'] ? values['validity_start'].format('YYYY-MM-DD') : null;
				let validity_end = values['validity_end'] ? values['validity_end'].format('YYYY-MM-DD') : null;
				let params = {
					...values,
					validity_start,
					validity_end
				};
				Object.keys(params).forEach(item => { !params[item] && params[item] !== 0 ? delete params[item] : null });
				const hide = message.loading('查询中，请稍候...');
				questAction({ ...params, page, page_size: pageSize }).then(() => {
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
		const { getFieldDecorator } = this.props.form;
		const { studioStatus, studioType, platforms, isFlash } = this.props;
		const formItemLayout = {
			labelCol: { span: 7 },
			wrapperCol: { span: 17 },
		};
		const otherLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 19 },
		}
		return <Form className='studioManage-search-form'>
			<Row type="flex" justify="start" gutter={16}>
				<Col className='warp-control'>
					<FormItem label='工作室ID' {...formItemLayout}>
						{getFieldDecorator('id', { initialValue: '' })(
							<Input placeholder="请输入" style={{ width: 160 }} />
						)}
					</FormItem>
				</Col>
				<Col className='warp-control left-gap'>
					<FormItem label='状态' {...otherLayout}>
						{getFieldDecorator('status', { initialValue: '' })(
							<Select style={{ width: 160 }}>
								<Option value="">不限</Option>
								{studioStatus.map((item, key) =>
									<Option key={key} value={item.id}>{item.display}</Option>)
								}
							</Select>
						)}
					</FormItem>
				</Col>
				<Col className='warp-control left-gap'>
					<FormItem label='类型' {...otherLayout}>
						{getFieldDecorator('type', { initialValue: '' })(
							<Select style={{ width: 160 }}>
								<Option value="">不限</Option>
								{studioType.map((item, key) =>
									<Option key={key} value={item.id}>{item.display}</Option>)
								}
							</Select>
						)}
					</FormItem>
				</Col>
				<Col className='left-gap'>
					<FormItem>
						<Button type="primary" htmlType="submit" onClick={this.handleSearch}>查询</Button>
					</FormItem>
				</Col>
			</Row>
			<Row type="flex" justify="start" gutter={16}>
				<Col className='warp-control'>
					<FormItem label='工作室名称' {...formItemLayout}>
						{getFieldDecorator('name', { initialValue: '' })(
							<Input placeholder="请输入" style={{ width: 160 }} />
						)}
					</FormItem>
				</Col>
				<Col className='warp-control left-gap'>
					<FormItem label='快易提' {...otherLayout}>
						{getFieldDecorator('is_support_flash', { initialValue: '' })(
							<Select style={{ width: 160 }}>
								<Option value="">不限</Option>
								{isFlash.map((item, key) =>
									<Option key={key} value={item.id}>{item.display}</Option>)
								}
							</Select>
						)}
					</FormItem>
				</Col>
				<Col className='warp-control left-gap'>
					<FormItem label='平台' {...otherLayout}>
						{getFieldDecorator('supported_platforms', { initialValue: '' })(
							<Select style={{ width: 160 }}>
								<Option value="">不限</Option>
								{platforms.map((item, key) =>
									<Option key={key} value={item.id}>{item.display}</Option>)
								}
							</Select>
						)}
					</FormItem>
				</Col>
				<Col className='left-gap'>
					<FormItem>
						<a className="reset-filter" onClick={this.handleClear}><Icon type="retweet" />重置搜索框</a>
					</FormItem>
				</Col>
			</Row>
			<Row type="flex" justify="start" gutter={16}>
				<Col className='warp-control data-picker'>
					<FormItem label="有效期" {...formItemLayout}>
						{getFieldDecorator('validity_start')(
							<DatePicker format={'YYYY-MM-DD'} placeholder='开始日期' style={{ width: 160 }} />
						)}
						~
						{getFieldDecorator('validity_end')(
							<DatePicker format={'YYYY-MM-DD'} placeholder='结束日期' style={{ width: 160 }} />
						)}
					</FormItem>
				</Col>
			</Row>
		</Form>
	}
}

export default Form.create()(StudioManageQuery);
