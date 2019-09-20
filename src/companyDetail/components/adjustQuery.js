import React from 'react'
import { Icon, Button, Input, Row, Form, Select, DatePicker } from "antd";
import qs from 'qs';
import moment from 'moment';
import 'moment/locale/zh-cn';
import SearchSelect from './SearchSelect';
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;
const dataFormat = 'YYYY-MM-DD'

class AdjustQuery extends React.Component {
	constructor() {
		super();
		this.state = {
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
			if (key === 'start_time' || key === 'end_time') {
				obj[key] = moment(keys[key], dataFormat);
			}
		}
		this.props.form.setFieldsValue({ ...keys, ...obj });
	}
	handleSearch = (e) => {
		const { questAction, pageSize } = this.props;
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
				values['start_time'] ? keys['start_time'] = values['start_time'].format(dataFormat) : null;
				values['end_time'] ? keys['end_time'] = values['end_time'].format(dataFormat) : null;
				let params = {
					keys: { ...keys },
					labels: { ...labels }
				};
				Object.keys(params['keys']).forEach(item => { !params['keys'][item] && params['keys'][item] !== 0 ? delete params['keys'][item] : null });
				questAction({ ...params.keys, page: 1, page_size: pageSize }, () => {
					this.props.history.replace({
						pathname: '/finance/golden/adjustApply',
						search: `?${qs.stringify(params)}`,
					})
				});
			}
		});
	}
	handleClear = () => {
		this.props.form.resetFields();
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { userList } = this.props;
		const { application_status = [], quote_type = [] } = this.props.children;
		return <Form className='adjust-stat adjust_content'>
			<Row type="flex" justify="start" gutter={16}>
				<FormItem label='申请编号' className='left-gap'>
					{getFieldDecorator('readjust_application_id', { initialValue: '' })(
						<Input placeholder="请输入" className='common_search_width' />
					)}
				</FormItem>
				<FormItem label='申请人' className='left-gap'>
					{getFieldDecorator('apply_admin_id', { initialValue: { key: '', label: '不限' } })(
						<Select 
							className='common_search_width'
							placeholder="不限"
							allowClear
							showSearch
							labelInValue
							filterOption={(input, option) => (
								option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
							)}
						>
							<Option value="">不限</Option>
							{userList.map((item) =>
								<Option key={item.user_id} value={item.user_id}>{item.real_name}</Option>)
							}
						</Select>
					)}
				</FormItem>
				<FormItem label="申请时间" className='left-gap'>
					{getFieldDecorator('start_time')(
						<DatePicker className='common_time_width' format={dataFormat} placeholder='开始时间' />
					)}
					<span className='time_line'>—</span>
					{getFieldDecorator('end_time')(
					<DatePicker className='common_time_width' format={dataFormat} placeholder='结束时间' />
					)}
				</FormItem>
			</Row>
			<Row type="flex" justify="start" gutter={16}>
				<FormItem label='订单ID' className='left-gap'>
					{getFieldDecorator('order_id')(
						<Input placeholder="请输入" className='common_search_width' />
					)}
				</FormItem>
				<FormItem label='公司简称' className='left-gap'>
					{getFieldDecorator('company_id')(
						<SearchSelect
							widthSign
							placeholder='公司简称'
							getPopupContainer={() => document.querySelector('.adjust-stat')}
							action={this.props.action}
							keyWord='company_name'
							dataToList={res => { return res.data }}
							item={['company_id', 'name']}
						/>
					)}
				</FormItem>
				<FormItem label='报价类型' className='left-gap'>
					{getFieldDecorator('quote_type', { initialValue: '' })(
						<Select placeholder="不限"
						allowClear className='common_search_width'>
							<Option value="">不限</Option>
							{
								quote_type.map(item => 
									<Option key={item.id} value={item.id}>{item.display}</Option>
								)
							}
						</Select>
					)}
				</FormItem>
				<FormItem className='left-gap adjust_apply_query'>
					<Button type="primary" onClick={this.handleSearch}>查询</Button>
					<Button onClick={this.handleClear}>重置</Button>
				</FormItem>
			</Row>
		</Form >
	}
}

export default Form.create()(AdjustQuery);
