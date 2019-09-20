import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col, Table, Select, DatePicker, Button, Form, Icon, message } from 'antd';
import { withRouter } from 'react-router-dom';
import * as accountFlowAction from '../../actions/companyDetail'
import { accountFlowFunc } from '../../constants'
import moment from 'moment';
import qs from 'qs';
const FormItem = Form.Item;
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option;

class AccountFlow extends Component {
	constructor() {
		super();
		this.state = {
			loading: false,
			page: 1
		}
	}
	componentDidMount() {
		const search = qs.parse(this.props.location.search.substring(1));
		let obj = {};
		let keys = search.keys || {};
		let labels = search.labels ? Object.keys(search.labels) : [];
		labels.length > 0 ? labels.forEach(item => {
			obj[item] = { key: search.keys[item], label: search.labels[item] }
		}) : null;
		for (let key in keys) {
			if (key === 'created_at_start' || key === 'created_at_end') {
				obj[key] = moment(keys[key], dateFormat);
			}
		}
		this.props.form.setFieldsValue({ ...keys, ...obj });
		this.queryData({ company_id: this.props.id, ...search.keys, page: 1, page_size: 20 });
	}
	queryData = (obj, func) => {
		this.setState({ loading: true });
		return this.props.actions.getBillings({ ...obj }).then(() => {
			if (func && Object.prototype.toString.call(func) === '[object Function]') {
				func();
			}
			this.setState({ loading: false })
		}).catch(({ errorMsg }) => {
			this.setState({ loading: false });
			message.error(errorMsg || '列表加载失败，请重试！');
		})
	}
	handleSearch = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let keys = {}, labels = {};
				for (let key in values) {
					if (Object.prototype.toString.call(values[key]) === '[object Object]') {
						if (values[key].key) {
							keys[key] = values[key].key;
							labels[key] = values[key].label;
						}
					} else {
						keys[key] = values[key]
					}
				}
				values['created_at_start'] ? keys['created_at_start'] = values['created_at_start'].format(dateFormat) : null;
				values['created_at_end'] ? keys['created_at_end'] = values['created_at_end'].format(dateFormat) : null;
				let params = {
					company_id: this.props.id,
					keys: { ...keys },
					labels: { ...labels }
				};
				Object.keys(params['keys']).forEach(item => { !params['keys'][item] && params['keys'][item] !== 0 ? delete params['keys'][item] : null });
				const hide = message.loading('查询中，请稍候...');
				this.queryData({ company_id: this.props.id, ...params.keys, page: 1, page_size: 20 }, () => {
					this.props.history.replace({
						pathname: '/finance/detail/company',
						search: `?${qs.stringify(params)}`,
					})
				}).then(() => {
					this.setState({ page: 1 });
					hide();
				}).catch(({ errorMsg }) => {
					message.error(errorMsg || '查询失败');
					hide();
				});
			}
		});
	}
	handleClear = () => {
		this.props.form.resetFields();
	}
	handleDetail = (record) => {
		this.props.actions.getBillDetail({
			type: record.billing_type,
			order_id: record.billing_order_id,
			product_line: record.product_line
		})
	}
	render() {
		const search = this.props.search;
		const { getFieldDecorator } = this.props.form;
		const { loading, page } = this.state;
		const { companyBillings: { total_amount, total, billings = [], account_type = [], billing_type = [] }, companyBillDetail } = this.props;
		const flowColumns = accountFlowFunc(this.handleDetail, companyBillDetail[0], account_type);
		const paginationObj = {
			onChange: (current) => {
				this.setState({ page: current });
				this.queryData({ company_id: search.company_id, ...search.keys, page: current, page_size: 20 });
			},
			total: parseInt(total),
			current: page,
			pageSize: 20,
		};
		return <div className='top-gap'>
			<fieldset className='fieldset_css'>
				<legend>账户流水</legend>
				<Row>
					<Col span={20}>总计：<span className='red-font'>{total_amount}元</span></Col>
				</Row>
				<Form className='adjust-stat'>
					<FormItem label='选择账户'>
						{getFieldDecorator('account_type', { initialValue: { key: '', label: '全部' } })(
							<Select
								labelInValue
								style={{ width: 150 }}
								placeholder='全部'
								showSearch
								allowClear
								filterOption={(input, option) => option.props.children.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0}
							>
								<Option value={''}>全部</Option>
								{account_type.map(item => (<Option key={item.id} value={item.id}>{item.display}</Option>))}
							</Select>
						)}
					</FormItem>
					<FormItem label='流水类型' className='left-gap'>
						{getFieldDecorator('billing_type', { initialValue: { key: '', label: '全部' } })(
							<Select
								labelInValue
								style={{ width: 150 }}
								placeholder='全部'
								showSearch
								allowClear
								filterOption={(input, option) => option.props.children.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0}
							>
								<Option value={''}>全部</Option>
								{billing_type.map(item => (<Option key={item.id} value={item.id}>{item.display}</Option>))}
							</Select>
						)}
					</FormItem>
					<FormItem label="选择时间" className='left-gap'>
						{getFieldDecorator('created_at_start')(
							<DatePicker format={dateFormat} placeholder='开始日期' />
						)}
						~
								{getFieldDecorator('created_at_end')(
							<DatePicker format={dateFormat} placeholder='结束日期' />
						)}
					</FormItem>
					<Button type="primary" className='left-gap' onClick={this.handleSearch}>查询</Button>
					<a className="left-gap" onClick={this.handleClear}><Icon type="retweet" />重置搜索框</a>
				</Form >
				<Row>
					<Table
						columns={flowColumns}
						dataSource={billings}
						rowKey='billing_id'
						loading={loading}
						pagination={billings.length > 0 ? paginationObj : false}
						bordered
					/>
				</Row>
			</fieldset>
		</div>
	}
}

const mapStateToProps = (state) => ({
	companyBillings: state.companyDetail.companyBillings,
	companyBillDetail: state.companyDetail.companyBillDetail,
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ ...accountFlowAction }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Form.create()(AccountFlow)));

