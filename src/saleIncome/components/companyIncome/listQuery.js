import React from 'react'
import { Row, Col, Form, Select, Button, message, Icon } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

class CompanyIncomeQuery extends React.Component {
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
		let { handleNew, preparation, nameList } = this.props;
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		return <div>
			<Form>
				<Row type="flex" justify="start" gutter={16}>
					<Col>
						<FormItem label='公司简称' {...formItemLayout}>
							{getFieldDecorator('company_id', { initialValue: '' })(
								<Select
									style={{ width: 200 }}
								>
									<Option value="">全部</Option>
									{preparation.map((item, key) =>
										<Option key={key} value={item.company_id}>{item.name}</Option>)
									}
								</Select>
							)}
						</FormItem>
					</Col>
					<Col className='left-gap'>
						<FormItem label='销售经理' {...formItemLayout}>
							{getFieldDecorator('sale_id', { initialValue: '' })(
								<Select
									style={{ width: 160 }}
								>
									<Option value="">全部</Option>
									{nameList.map((item, key) =>
										<Option key={key} value={item.user_id}>{item.real_name}</Option>)
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

export default Form.create()(CompanyIncomeQuery);
