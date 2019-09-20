import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as businessAccountingActions from '../../actions/businessAccounting'
import * as commonActions from '../../actions/common'
import { Row, Col, Form, Select, Button, DatePicker, message, Icon } from "antd";
const { MonthPicker } = DatePicker;
const FormItem = Form.Item;
const OptGroup = Select.OptGroup;
const Option = Select.Option;
const monthFormat = 'YYYYMM';

class BusinessAccountingQuery extends React.Component {
	constructor() {
		super();
		this.state = {

		}
	}
	componentDidMount() {
		const { getSalesName } = this.props.actions;
		getSalesName();
	}
	handleSearch = (e) => {
		const { page, page_size, handlefilterParams, currentTab, handleClear, handleDataPage } = this.props;
		const { getBusinessAccountingList } = this.props.actions;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let params = values.month ? { ...values, month: values.month.format('YYYYMM') } : { ...values };
				const curPage = Object.values(values).every(item => !item) ? page : 1;
				const hide = message.loading('查询中，请稍候...');
				handleClear();
				getBusinessAccountingList({ page: curPage, page_size, write_off_status: currentTab, ...params }).then(() => {
					handleDataPage(currentTab, curPage, page_size);
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
		let { saleName } = this.props;
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		const saleNameList = Object.values(saleName);
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
						<FormItem label="用户名" {...formItemLayout} >
							{getFieldDecorator('sale_id')(
								<Select placeholder="请选择"
									style={{ width: 200 }}
									showSearch
									allowClear
									filterOption={(input, option) => option.props.children.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									<OptGroup label={<span>姓名<span style={{ float: 'right' }}>ID</span></span>}>
										{saleNameList.map(item =>
											<Option key={item.user_id} value={item.user_id}>
												<span>{item.real_name}<span style={{ float: 'right' }}>{item.user_id}</span></span>
											</Option>)
										}
									</OptGroup>
								</Select>
							)}
						</FormItem>
					</Col>
					<Col style={{ marginLeft: '50px', marginTop: '2px' }}>
						<Button type="primary" className='left-gap' onClick={this.handleSearch}>查询</Button>
						<a className="left-gap" onClick={this.handleClear}><Icon type="retweet" />重置搜索框</a>
					</Col>
				</Row>
			</Form>
		</div>
	}
}
const mapStateToProps = (state) => {
	return {
		saleName: state.saleIncome.saleName,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...businessAccountingActions, ...commonActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(BusinessAccountingQuery))
