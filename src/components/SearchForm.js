import React from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Row, Col, Input, Button, Select, DatePicker, Cascader, Radio, InputNumber, message } from 'antd';
import SearchSelect from './SearchSelect'
//深比较
// import isEqual from 'lodash/isEqual';
//引入
import qs from 'qs'
import './SearchForm.less'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
//antd
const { MonthPicker } = DatePicker;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class SearchForm extends React.PureComponent {
	state = {
		timeKeys: {}
	};
	static getSelectOptions = (array, { label, value }, defaultObj) => {
		if (!Object.prototype.toString.call(array) === '[object Array]') {
			return []
		}
		defaultObj = defaultObj || { label: '全部', value: '' };
		const list = [defaultObj, ...array.map(item => ({ label: item[label], value: item[value] }))];
		return list
	}
	componentDidMount() {
		const { data = null } = this.props;
		const search = qs.parse(this.props.location.search.substring(1));
		const { setFieldsValue } = this.props.form;
		const obj = {};
		const keys = search.keys || {};
		const labels = search.labels ? Object.keys(search.labels) : [];

		const timeKeys = data ? data.reduce((data, current) => {
			return { ...data, ...this.keyMapToTime(current) }
		}, {}) : {};

		labels.length > 0 ? labels.forEach(item => {
			obj[item] = { key: search.keys[item], label: search.labels[item] }
		}) : null;
		for (const key in timeKeys) {
			keys[key] ? obj[key] = moment(keys[key], timeKeys[key]) : null;
		}
		setFieldsValue({ ...keys, ...obj });
		this.setState({ timeKeys })
	}
	removeNotNeedValue = obj => {
		// 判断必须为obj
		if (!(Object.prototype.toString.call(obj) === '[object Object]')) {
			return {};
		}
		let tempObj = {};
		for (let [key, value] of Object.entries(obj)) {
			if (typeof value === 'string') {
				value = value.trim();
			}
			// let tmpValue = value;
			// if (Object.prototype.toString.call(value)==='[object Object]')
			// if (Array.isArray(value) && value.length <= 0) {
			// 	continue;
			// }
			// if (tmpValue && !(Object.prototype.toString.call(tmpValue) === '[object Function]')) {
			// 	if (typeof value === 'string') {
			// 		value = value.trim();
			// 	}
			// }
			tempObj[key] = value;
		}
		return tempObj;
	};
	//合并响应式props
	combindResponseLayout = (responsive = {}) => {
		// 从父组件接受的布局姿势
		const { responseLayout } = this.props;
		// responsive 是子组件自身的响应式布局
		// 响应式
		return {
			xs: 24,
			sm: 24,
			md: 12,
			lg: 8,
			xxl: 6,
			...responseLayout,
			...responsive,
		};
	};
	//获取时间项对应的key
	keyMapToTime = data => {
		const { ctype, field, attr } = data;
		switch (ctype) {
			case 'rangePicker':
				return { [field.value[0]]: attr.format, [field.value[1]]: attr.format }
			case 'datePicker' || 'monthPicker':
				return { [field.value]: attr.format }
			default:
				return {}
		}
	}
	//生成FormItem
	getFields = data => {
		const children = [];
		if (data) {
			for (let i = 0; i < data.length; i++) {
				// 若是控件的名字丢.亦或filed的字段名或之值丢失则不渲染该组件
				// 若是为select或cascader没有子组件数据也跳过
				const {
					ctype,
					field: { value, label },
					selectOptionsChildren,
				} = data[i];
				if (
					!ctype ||
					!value ||
					!label ||
					// ((ctype === 'select' || ctype === 'cascader') &&
					(ctype === 'cascader' &&
						selectOptionsChildren &&
						selectOptionsChildren.length < 1)
				)
					continue;

				// 渲染组件
				let formItem = this.renderItem({
					...data[i],
					itemIndex: i,
				});

				// 缓存组件数据
				children.push(formItem);
			}
			return children;
		} else {
			return [];
		}
	};
	//渲染组件
	renderItem = data => {
		const { getFieldDecorator } = this.props.form;
		let { ctype, field, attr, itemIndex, responsive } = data;
		const ResponseLayout = this.combindResponseLayout(responsive);
		switch (ctype) {
			case 'input':
				return (<Col
					{...ResponseLayout}
					key={itemIndex}
				>
					<FormItem label={field.label}>
						{getFieldDecorator(field.value, field.params ? field.params : {})(
							<Input {...attr} />
						)}
					</FormItem>
				</Col>);
			case 'inputNum':
				return (<Col
					{...ResponseLayout}
					key={itemIndex}
				>
					<FormItem label={field.label}>
						{getFieldDecorator(field.value, field.params ? field.params : {})(
							<InputNumber {...attr} style={{ width: '100%' }} />
						)}
					</FormItem>
				</Col>);
			case 'rangeInput':
				attr.placeholder = Array.isArray(attr.placeholder)
					? attr.placeholder
					: ['请输入', '请输入'];
				return (<Col
					{...ResponseLayout}
					key={itemIndex}
				>
					<FormItem label={field.label}>
						{getFieldDecorator(field.value[0], field.params ? field.params : {})(
							<Input {...attr} placeholder={attr.placeholder[0]} />
						)}
						~
						{getFieldDecorator(field.value[1], field.params ? field.params : {})(
							<Input {...attr} placeholder={attr.placeholder[1]} />
						)}
					</FormItem>
				</Col>);
			case 'select':
				return (<Col
					{...ResponseLayout}
					key={itemIndex}
				>
					<FormItem label={field.label}>
						{getFieldDecorator(field.value, field.params ? field.params : {})(
							<Select getPopupContainer={() => document.querySelector('.ant-advanced-search-form')}
								{...attr}>
								{data.selectOptionsChildren &&
									data.selectOptionsChildren.length > 0 &&
									data.selectOptionsChildren.map((optionItem, index) => (
										<Option value={data.selectItem ? optionItem[data.selectItem.value] : optionItem.value} key={index}>
											{data.selectItem ? optionItem[data.selectItem.key] : optionItem.name}
										</Option>
									))}
							</Select>
						)}
					</FormItem>
				</Col>);
			case 'cascader':
				return (<Col
					{...ResponseLayout}
					key={itemIndex}
				>
					<FormItem label={field.label}>
						{getFieldDecorator(field.value, field.params ? field.params : {})(
							<Cascader {...attr} options={data.selectOptionsChildren} />
						)}
					</FormItem>
				</Col>);
			case 'monthPicker':
				return (<Col
					{...ResponseLayout}
					key={itemIndex}
				>
					<FormItem label={field.label}>
						{getFieldDecorator(field.value, field.params ? field.params : {})(
							<MonthPicker {...attr} />
						)}
					</FormItem>
				</Col>);
			case 'datePicker':
				return (<Col
					{...ResponseLayout}
					key={itemIndex}
				>
					<FormItem label={field.label}>
						{getFieldDecorator(field.value, field.params ? field.params : {})(
							<DatePicker {...attr} />
						)}
					</FormItem>
				</Col>);
			case 'rangePicker':
				attr.placeholder = Array.isArray(attr.placeholder)
					? attr.placeholder
					: ['开始时间', '结束时间'];
				return (<Col
					{...ResponseLayout}
					key={itemIndex}
				>
					<FormItem label={field.label}>
						{getFieldDecorator(field.value[0], field.params ? field.params : {})(
							<DatePicker {...attr} placeholder={attr.placeholder[0]} />
						)}
						~
						{getFieldDecorator(field.value[1], field.params ? field.params : {})(
							<DatePicker {...attr} placeholder={attr.placeholder[1]} />
						)}
					</FormItem>
				</Col>);
			case 'radio':
				return (<Col
					{...ResponseLayout}
					key={itemIndex}
				>
					<FormItem label={field.label}>
						{getFieldDecorator(field.value, field.params ? field.params : {})(
							<RadioGroup {...attr}>
								{data.selectOptionsChildren &&
									data.selectOptionsChildren.length > 0 &&
									data.selectOptionsChildren.map((optionItem, index) => (
										<Option value={data.selectItem ? data.selectItem.value : optionItem.value} key={index}>
											{data.selectItem ? data.selectItem.key : optionItem.name}
										</Option>
									))}
							</RadioGroup>
						)}
					</FormItem>
				</Col>);
			case 'searchSelect':
				return (<Col
					{...ResponseLayout}
					key={itemIndex}
				>
					{<FormItem label={field.label}>
						{getFieldDecorator(field.value, field.params ? field.params : {})(
							<SearchSelect getPopupContainer={() => document.querySelector('.ant-advanced-search-form')}
								{...attr}
							/>
						)}
					</FormItem>}
				</Col>)
			default:
				return null
		}
	}
	handleSearch = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			// 表单表单不报错,且props有传递的情况下,才返回表单数据
			if (!err && this.props.getAction) {
				// 字符串类型全部去除两边的空格
				let form_data = this.removeNotNeedValue(values);
				const search = qs.parse(this.props.location.search.substring(1));
				const keys = {}, labels = {}, { timeKeys } = this.state;
				for (let key in form_data) {
					if (Object.prototype.toString.call(form_data[key]) === '[object Object]') {
						if (form_data[key].key || form_data[key].key == 0) {
							keys[key] = form_data[key].key;
							labels[key] = form_data[key].label;
						}
						if (Object.keys(timeKeys).length && timeKeys[key]) {
							keys[key] = form_data[key].format(timeKeys[key]);
						}
					} else {
						keys[key] = form_data[key]
					}
				}
				const params = {
					keys: { ...keys },
					labels: { ...labels }
				};
				Object.keys(params['keys']).forEach(item => { !params['keys'][item] && params['keys'][item] !== 0 ? delete params['keys'][item] : null });
				const hide = message.loading('查询中，请稍候...');
				this.props.getAction({ ...params.keys }).then(() => {
					this.props.history.replace({
						pathname: this.props.location.pathname,
						search: `?${qs.stringify({ ...search, ...params })}`,
					})
					hide();
				}).catch(({ errorMsg }) => {
					message.error(errorMsg || '查询失败');
					hide();
				});

				// this.props.getAction(values);
			}
		});
	};
	handleReset = () => {
		this.props.form.resetFields();
		// 若是有回调函数,则返回空对象
		if (this.props.resetAction) {
			this.props.resetAction(null);
		}
	};
	render() {
		const { data = null, children, beforeFooter, extraFooter, handleSearch } = this.props;
		const layout = this.combindResponseLayout();

		return <Form className="ant-advanced-search-form" onSubmit={handleSearch || this.handleSearch}>
			<Row gutter={24} type="flex" justify="start">
				{this.getFields(data)}
			</Row>
			{children ? <Row gutter={24} type="flex" justify="start">
				{children}
			</Row> : null}
			{data ? <Row gutter={24} type="flex" justify="center">
				<Col {...layout}>
					{beforeFooter ? beforeFooter : null}
					<Button type="primary" htmlType="submit">
						查询
                </Button>
					<Button style={{ marginLeft: 20 }} onClick={this.handleReset}>
						重置
                </Button>
					{extraFooter ? extraFooter : null}
				</Col>
			</Row> : null}
		</Form>
	}
}
export default withRouter(Form.create({
	onValuesChange: (props, changedValues, allValues) => {
		const { data, autoSearch } = props;
		// 传入的空间必须存在, 否则不可能触发自动提交表单的props
		if (data && Array.isArray(data) && data.length > 0 && autoSearch) {
			let autoSearchField = [];
			data.forEach(item => {
				const {
					ctype,
					field: { value: fieldName },
				} = item;
				if (ctype !== 'input' && ctype !== 'inputNum') {
					autoSearchField.push(fieldName);
				}
			});
			let keys = Object.keys(changedValues);
			if (autoSearchField.indexOf(keys[0]) !== -1) {
				if (changedValues[keys[0]]) {
					props.getAction(changedValues);
				} else {
					props.resetAction();
				}
			}
		}
	},
})(SearchForm))


// queryData = (obj, func) => {
// 	this.setState({ loading: true });
// 	return this.props.actions.getApplicationList({ ...obj }).then(() => {
// 		if (func && Object.prototype.toString.call(func) === '[object Function]') {
// 			func();
// 		}
// 		this.setState({ loading: false })
// 	}).catch(({ errorMsg }) => {
// 		this.setState({ loading: false });
// 		message.error(errorMsg || '列表加载失败，请重试！');
// 	})
// }
