import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Table, Select, DatePicker, Button, Form, message, Icon, Input, Modal } from 'antd';
import * as orderCompensateAction from '../actions/orderCompensate';
import { orderColumnsFunc } from '../constants'
import './orderCompensate.less'
import qs from 'qs';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD'

class OrderCompensate extends Component {
	constructor() {
		super();
		this.state = {
			loading: false,
			flag: false,
			visible: false,
			record: ''
		}
	}
	componentDidMount() {
		const search = qs.parse(this.props.location.search.substring(1));
		const { getCompensateAuthorizations, getReparationSaleList, getReparationStatus } = this.props.actions;
		let obj = {};
		let keys = search.keys || {};
		let labels = search.labels ? Object.keys(search.labels) : [];
		labels.length > 0 ? labels.forEach(item => {
			obj[item] = { key: search.keys[item], label: search.labels[item] }
		}) : null;
		getCompensateAuthorizations().then(res => {
			let flag = res.data[0].permissions['reparation.completeReparation'];
			this.setState({ flag });
		})
		getReparationSaleList();
		getReparationStatus();
		this.queryData({ page: 1, page_size: 20, ...search.keys });
		for (let key in keys) {
			if (key === 'time_start' || key === 'time_end') {
				keys[key] = moment(keys[key], dateFormat);
			}
		}
		this.props.form.setFieldsValue({ ...keys, ...obj });
	}
	queryData = (obj, func) => {
		this.setState({ loading: true });
		return this.props.actions.getReparationInfo({ ...obj }).then(() => {
			if (func && Object.prototype.toString.call(func) === '[object Function]') {
				func();
			}
			this.setState({ loading: false })
		}).catch(({ errorMsg }) => {
			this.setState({ loading: false });
			message.error(errorMsg || '列表加载失败，请重试！');
		})
	}
	handlePass = record => {
		this.setState({ record, visible: true });
	}
	handleRefuse = order_id => {
		const search = qs.parse(this.props.location.search.substring(1));
		this.props.actions.postReparationRefuse({ order_id }).then(() => {
			this.queryData({ ...search.keys });
		})
	}
	handleOk = obj => {
		const search = qs.parse(this.props.location.search.substring(1));
		const remark = document.querySelector('#reparation-remark');
		const params = { ...obj, remarks: remark.value }
		this.props.actions.postReparationComplete({ ...params }).then(() => {
			const hide = message.loading('操作中，请稍后...');
			this.queryData({ ...search.keys }).then(() => {
				this.setState({ visible: false });
				hide();
			}).catch(() => {
				hide();
			})
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
				values['time_start'] ? keys['time_start'] = values['time_start'].format(dateFormat) : null;
				values['time_end'] ? keys['time_end'] = values['time_end'].format(dateFormat) : null;
				let params = {
					keys: { ...keys },
					labels: { ...labels }
				};
				Object.keys(params['keys']).forEach(item => { !params['keys'][item] && params['keys'][item] !== 0 ? delete params['keys'][item] : null });
				const hide = message.loading('查询中，请稍候...');
				this.queryData({ page: 1, page_size: 20, ...keys }, () => {
					this.props.history.replace({
						pathname: '/finance/invoice/reparation',
						search: `?${qs.stringify(params)}`,
					});
				}).then(() => {
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
	render() {
		const search = qs.parse(this.props.location.search.substring(1));
		const { getFieldDecorator } = this.props.form;
		const { loading, flag, visible, record } = this.state;
		const { reparationInfo: { count, page, list = [] }, orderSaleList, status } = this.props;
		const columns = orderColumnsFunc(flag, this.handlePass, this.handleRefuse);
		const paginationObj = {
			onChange: (current) => {
				this.setState({ page: current });
				this.queryData({ page: current, page_size: 20, ...search.keys });
			},
			total: parseInt(count),
			current: parseInt(page),
			pageSize: 20
		};
		return <div>
			<fieldset className='fieldset_css'>
				<legend>订单赔偿处理</legend>
				<Form className='reparation-search'>
					<Row type="flex" justify="start" gutter={16}>
						<Col>
							<FormItem>
								{getFieldDecorator('product_line')(
									<Select
										labelInValue
										style={{ width: 120 }}
										placeholder='请选择时间'
									>
										<Option value=''>全部</Option>
										<Option value="created_at">申请时间</Option>
										<Option value="updated_at">最后操作时间</Option>
									</Select>
								)}
							</FormItem>
						</Col>
						<Col className='data-picker'>
							<FormItem >
								{getFieldDecorator('time_start')(
									<DatePicker format={dateFormat} placeholder='开始日期' />
								)}
								~
						{getFieldDecorator('time_end')(
									<DatePicker format={dateFormat} placeholder='结束日期' />
								)}
							</FormItem>
						</Col>
						<Col>
							<FormItem label='赔偿ID'>
								{getFieldDecorator('reparation_id')(
									<Input placeholder='请输入' />
								)}
							</FormItem>
						</Col>
						<Col>
							<FormItem label='订单ID'>
								{getFieldDecorator('order_id')(
									<Input placeholder='请输入' />
								)}
							</FormItem>
						</Col>
					</Row>
					<Row type="flex" justify="start" gutter={16}>
						<Col>
							<FormItem label='所属销售'>
								{getFieldDecorator('sale_id', { initialValue: { key: '', label: '全部' } })(
									<Select style={{ width: 120 }} labelInValue>
										<Option value=''>全部</Option>
										{orderSaleList.map(item => (<Option key={item.user_id} value={item.user_id}>{item.real_name}</Option>))}
									</Select>
								)}
							</FormItem>
						</Col>
						<Col>
							<FormItem label='赔偿状态'>
								{getFieldDecorator('status', { initialValue: { key: '', label: '全部' } })(
									<Select style={{ width: 120 }} labelInValue>
										<Option value=''>全部</Option>
										{status.map(item => (<Option key={item.id} value={item.id}>{item.display}</Option>))}
									</Select>
								)}
							</FormItem>
						</Col>
						<Col style={{ marginLeft: '20px', marginTop: '2px' }}>
							<Button type="primary" className='left-gap' onClick={this.handleSearch}>查询</Button>
							<a className="left-gap" onClick={this.handleClear}><Icon type="retweet" />重置搜索框</a>
						</Col>
					</Row>
				</Form >
				<Table
					columns={columns}
					dataSource={list}
					rowKey='reparation_id'
					loading={loading}
					pagination={list.length > 0 ? paginationObj : false}
					bordered
					scroll={{ x: 1660 }}
				/>
				{visible ? <CheckModal visible={visible} onOk={this.handleOk} record={record}
					onCancel={() => { this.setState({ visible: false }) }} /> : null}
			</fieldset>
		</div>
	}
}

const mapStateToProps = (state) => ({
	reparationInfo: state.invoice.reparationInfo,
	orderSaleList: state.invoice.orderSaleList,
	status: state.invoice.status,
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ ...orderCompensateAction }, dispatch)
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(OrderCompensate));

function CheckModal({ visible, onOk, onCancel, record }) {
	return <Modal
		title="确认通过订单赔偿申请"
		visible={visible}
		onOk={() => { onOk({ company_id: record.company_id, order_id: record.order_id }) }}
		onCancel={onCancel}
	>
		<div>
			<p>需求名称：{record.requirement_name}</p>
			<p>赔偿金额：{record.reparation_amount}</p>
			<p>赔偿原因：{record.reparation_reason}</p>
			<p>备注（财务）：</p>
			<TextArea id='reparation-remark' style={{ height: '100px' }} maxLength={500} />
			<p style={{ color: 'red', fontSize: '12px' }}>请填写备注信息，不超过500字</p>
		</div>
	</Modal>
}
