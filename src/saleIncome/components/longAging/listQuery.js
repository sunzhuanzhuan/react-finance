import React from 'react'
import { Row, Col, Form, Button, Input, Select, message, Icon } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

class AgingListQuery extends React.Component {
	constructor() {
		super();
		this.state = {

		}
	}
	handleSearch = (e) => {
		const { questAction, page_size } = this.props;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const hide = message.loading('查询中，请稍候...');
				questAction({ ...values, page: 1, page_size }).then(() => {
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
		let { handleNew, postType } = this.props;
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		return <div>
			<Form>
				<Row type="flex" justify="start" gutter={16}>
					<Col span={4}>
						<FormItem className='wrap-control' label='超账期数' {...formItemLayout}>
							{getFieldDecorator('num')(
								<Input placeholder='请输入' />
							)}
						</FormItem>
					</Col>
					<Col span={4}>
						<FormItem className='wrap-control' label='岗位类型' {...formItemLayout}>
							{getFieldDecorator('position_level', { initialValue: '' })(
								<Select>
									<Option value=''>全部</Option>
									{postType.map((item, key) =>
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

export default Form.create()(AgingListQuery);
