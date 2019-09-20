import React from 'react'
import { Row, Col, Form, Select, Button, DatePicker, message, Icon } from "antd";
const { MonthPicker } = DatePicker;
const FormItem = Form.Item;
const OptGroup = Select.OptGroup;
const Option = Select.Option;
const monthFormat = 'YYYYMM';

class MissionListQuery extends React.Component {
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
				let params = values.month ? { ...values, month: values.month.format('YYYYMM') } : { ...values };
				const hide = message.loading('查询中，请稍候...');
				questAction({ ...params, page: 1, page_size }).then(() => {
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
		let { handleNew, region, nameList } = this.props;
		nameList = Object.values(nameList);
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		return <div className='mission-list-query'>
			<Form>
				<Row type="flex" justify="start" gutter={16}>
					<Col span={5}>
						<FormItem label='月份' {...formItemLayout}>
							{getFieldDecorator('month')(
								<MonthPicker placeholder="请选择月份" format={monthFormat} style={{ width: 140 }} />
							)}
						</FormItem>
					</Col>
					<Col span={5}>
						<FormItem label="销售名称" {...formItemLayout} >
							{getFieldDecorator('sale_id')(
								<Select placeholder="请选择"
									width={140}
									showSearch
									allowClear
									filterOption={(input, option) => option.props.children.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									<OptGroup label={<span>姓名<span style={{ float: 'right' }}>ID</span></span>}>
										{nameList.map(item =>
											<Option key={item.user_id} value={item.user_id}>
												<span>{item.real_name}<span style={{ float: 'right' }}>{item.user_id}</span></span>
											</Option>)
										}
									</OptGroup>
								</Select>
							)}
						</FormItem>
					</Col>
					<Col span={5}>
						<FormItem label='区域' {...formItemLayout}>
							{getFieldDecorator('region', { initialValue: '' })(
								<Select>
									<Option value="">全部</Option>
									{region.map((item, key) =>
										<Option key={key} value={item.id}>{item.display}</Option>)
									}
								</Select>
							)}
						</FormItem>
					</Col>
					<Col style={{ marginLeft: '50px', marginTop: '2px' }}>
						<Button type="primary" className='left-gap' onClick={this.handleSearch}>查询</Button>
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

export default Form.create()(MissionListQuery);
