import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Table, Select, DatePicker, Button, Form, message, Icon } from 'antd';
import * as companyDetailAction from '../actions/companyDetail';
import { freezeDetailFunc } from '../constants'
import './golden.less';
import qs from 'qs';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;
const dateFormat = 'YYYY-MM-DD';

class FreezeDetail extends Component {
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
		this.queryData({ company_id: search.company_id, page: 1, page_size: 20, ...search.keys });
	}
	queryData = (obj, func) => {
		this.setState({ loading: true });
		return this.props.actions.getFreezeDetail({ ...obj }).then(() => {
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
				values['created_at_start'] ? keys['created_at_start'] = values['created_at_start'].format(dateFormat) : null;
				values['created_at_end'] ? keys['created_at_end'] = values['created_at_end'].format(dateFormat) : null;
				let params = {
					company_id: search.company_id,
					keys: { ...keys },
					labels: { ...labels }
				};
				Object.keys(params['keys']).forEach(item => { !params['keys'][item] && params['keys'][item] !== 0 ? delete params['keys'][item] : null });
				const hide = message.loading('查询中，请稍候...');
				this.queryData({ company_id: search.company_id, ...params.keys, page: 1, page_size: 20 }, () => {
					this.props.history.replace({
						pathname: '/finance/freeze/detail',
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
		const { loading, page } = this.state;
		const { freezeDetail: { total, total_amount, billings = [], product_line = [] } } = this.props;
		const freezeDetailTitle = freezeDetailFunc(product_line);
		const paginationObj = {
			onChange: (current) => {
				this.setState({ page: current });
				this.queryData({ company_id: search.company_id, ...search.keys, page: current, page_size: 20 });
			},
			total: parseInt(total),
			current: page,
			pageSize: 20
		};
		return <div>
			<fieldset className='fieldset_css'>
				<legend>账户冻结详情</legend>
				<Row>
					<Col span={20}>总计：{total_amount}元</Col>
				</Row>
				<Form className='adjust-stat'>
					<FormItem label='业务类型'>
						{getFieldDecorator('product_line', { initialValue: { key: '', label: '全部' } })(
							<Select
								labelInValue
								style={{ width: 150 }}
								placeholder='全部'
								showSearch
								allowClear
								filterOption={(input, option) => option.props.children.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0}
							>
								<Option value={''}>全部</Option>
								{product_line.map(item => (<Option key={item.id} value={item.id}>{item.display}</Option>))}
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
				<Table
					columns={freezeDetailTitle}
					dataSource={billings}
					rowKey={record => record.order_id}
					loading={loading}
					pagination={billings.length > 0 ? paginationObj : false}
					bordered
				/>
			</fieldset>
		</div>
	}
}

const mapStateToProps = (state) => ({
	freezeDetail: state.companyDetail.freezeDetail
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ ...companyDetailAction }, dispatch)
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(FreezeDetail));
