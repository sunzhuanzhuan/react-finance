import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col, Table, Select, DatePicker, Button, Form, Icon, message } from 'antd';
import * as companyDetailAction from '../actions/companyDetail'
import { goldenFlowConfig } from '../constants'
import './golden.less'
import qs from 'qs';
import numeral from 'numeral';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';

class GoldenDetail extends Component {
	constructor() {
		super();
		this.state = {
			loading: false,
			pageSize: 20
		}
	}
	componentDidMount() {
		const search = qs.parse(this.props.location.search.substring(1));
		const { getCompanyData, getCompanyMetadata } = this.props.actions;
		let obj = {};
		let keys = search.keys || {};
		let labels = search.labels ? Object.keys(search.labels) : [];
		labels.length > 0 ? labels.forEach(item => {
			obj[item] = { key: search.keys[item], label: search.labels[item] }
		}) : null;
		for (let key in keys) {
			if (key === 'start_time' || key === 'end_time') {
				obj[key] = moment(keys[key], dateFormat);
			}
		}
		this.props.form.setFieldsValue({ ...keys, ...obj });
		getCompanyMetadata();
		getCompanyData({ company_id: search.company_id });
		this.queryData({ company_id: search.company_id, page: 1, page_size: 20, ...search.keys });
	}
	queryData = (obj, func) => {
		this.setState({ loading: true });
		return this.props.actions.getGoldenFlow({ ...obj }).then(() => {
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
				const search = qs.parse(this.props.location.search.substring(1));
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
				values['start_time'] ? keys['start_time'] = values['start_time'].format(dateFormat) : null;
				values['end_time'] ? keys['end_time'] = values['end_time'].format(dateFormat) : null;
				let params = {
					company_id: search.company_id,
					keys: { ...keys },
					labels: { ...labels }
				};
				Object.keys(params['keys']).forEach(item => { !params['keys'][item] && params['keys'][item] !== 0 ? delete params['keys'][item] : null });
				const hide = message.loading('查询中，请稍候...');
				this.queryData({ company_id: search.company_id, ...params.keys, page: 1, page_size: this.state.pageSize }, () => {
					this.props.history.replace({
						pathname: '/finance/golden/detail',
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
		const { loading, pageSize } = this.state;
		const { companyData, goldenFlow: { page, page_size, total, list = [], total_amount, revoke_amount }, companyMetadata: { is_revoke = [], warehouse_bill_type = [] } } = this.props;
		const paginationObj = {
			onChange: (current) => {
				this.queryData({ company_id: search.company_id, ...search.keys, page: current, page_size: pageSize });
			},
			onShowSizeChange: (current, pageSize) => {
				this.setState({ pageSize })
				this.queryData({ company_id: search.company_id, ...search.keys, page: current, page_size: pageSize });
			},
			total: parseInt(total),
			current: parseInt(page),
			pageSize: parseInt(page_size),
			showQuickJumper: true,
			showSizeChanger: true,
			pageSizeOptions: ['20', '50', '100', '200']
		};
		return (
			<div>
				<Row type="flex" justify="start" gutter={16} >
					<Col><h4>公司简称：{companyData.name}</h4></Col>
					<Col><h4>销售：{companyData.owner_admin_real_name}</h4></Col>
				</Row>
				<fieldset className='fieldset_css'>
					<legend>小金库流水</legend>
					<Row type="flex" justify="start" gutter={16} className='account-detail' style={{ marginBottom: '10px' }}>
						<Col>总计： {numeral(total_amount).format('0.00') || '0.00'}元</Col>
						<Col>可撤销金额： {numeral(revoke_amount).format('0.00') || '0.00'}元</Col>
					</Row>
					<Form className='adjust-stat'>
						<FormItem label='是否可撤销'>
							{getFieldDecorator('is_revoke', { initialValue: { key: '', label: '全部' } })(
								<Select
									labelInValue
									style={{ width: 150 }}
									placeholder='全部'
									showSearch
									allowClear
									filterOption={(input, option) => option.props.children.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									<Option value={''}>全部</Option>
									{is_revoke.map(item => (<Option key={item.id} value={item.id}>{item.display}</Option>))}
								</Select>
							)}
						</FormItem>
						<FormItem label='类型' className='left-gap'>
							{getFieldDecorator('type', { initialValue: { key: '', label: '全部' } })(
								<Select
									labelInValue
									style={{ width: 150 }}
									placeholder='全部'
									showSearch
									allowClear
									filterOption={(input, option) => option.props.children.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0}
								>
									<Option value={''}>全部</Option>
									{warehouse_bill_type.map(item => (<Option key={item.id} value={item.id}>{item.display}</Option>))}
								</Select>
							)}
						</FormItem>
						<FormItem label="选择时间" className='left-gap'>
							{getFieldDecorator('start_time')(
								<DatePicker format={dateFormat} placeholder='开始日期' />
							)}
							~
									{getFieldDecorator('end_time')(
								<DatePicker format={dateFormat} placeholder='结束日期' />
							)}
						</FormItem>
						<Button type="primary" className='left-gap' onClick={this.handleSearch}>查询</Button>
						<a className="left-gap" onClick={this.handleClear}><Icon type="retweet" />重置搜索框</a>
					</Form >
					<Table
						columns={goldenFlowConfig}
						dataSource={list}
						rowKey='bill_id'
						loading={loading}
						pagination={list.length > 0 ? paginationObj : false}
						bordered
					/>
				</fieldset>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	companyData: state.companyDetail.companyData,
	goldenFlow: state.companyDetail.goldenFlow,
	companyMetadata: state.companyDetail.companyMetadata,
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ ...companyDetailAction }, dispatch)
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(GoldenDetail));
