import React from 'react'
import { Button, Input, Row, Col, Form, Select } from "antd";

const FormItem = Form.Item;
const Option = Select.Option;

class StudioDetailQuery extends React.Component {
	constructor() {
		super();
		this.state = {
		}
	}
	handleSearch = () => {
		console.log(1);
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 14 },
		};
		return <Form className='studioManage-search-form'>
			<Row>
				<Col span={4}>
					<FormItem label='状态' {...formItemLayout}>
						{getFieldDecorator('status', { initialValue: '' })(
							<Select>
								<Option value="">不限</Option>
								<Option value="1">已冻结</Option>
								<Option value="2">已使用</Option>
							</Select>
						)}
					</FormItem>
				</Col>
				<Col span={6}>
					<FormItem label='订单ID' {...formItemLayout}>
						{getFieldDecorator('name')(
							<Input placeholder="请输入" />
						)}
					</FormItem>
				</Col>
				<Col span={4}>
					<FormItem>
						<Button type="primary" htmlType="submit" onClick={this.handleSearch}>查询</Button>
					</FormItem>
				</Col>
			</Row>
		</Form>
	}
}
// const mapDispatchToProps = dispatch => ({
// 	actions: bindActionCreators({ ...action }, dispatch)
// });
export default Form.create()(StudioDetailQuery);
// export default connect(state => ({ ...state }), mapDispatchToProps)(ApplyDetail)
