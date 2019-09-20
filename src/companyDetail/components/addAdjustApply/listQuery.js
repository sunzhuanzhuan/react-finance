import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as goldenActions from "../../actions/goldenApply";
import { Input, Row, Col, Form, Select, Button, Icon, message, Spin, Modal } from "antd";
import SearchSelect from '../SearchSelect';
import qs from 'qs';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { shallowEqual } from '@/util';
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;


class ListQuery extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			projectLoading: false,
			weiboLoading: false,
			company_id: ''
		}
	}
	componentDidMount() {
		const search = qs.parse(this.props.location.search.substring(1));
		const { type } = this.props;
		let obj = {};
		let keys = search.keys || {};
		let labels = search.labels ? Object.keys(search.labels) : [];
		labels.length > 0 ? labels.forEach(item => {
			obj[item] = { key: search.keys[item], label: search.labels[item] }
		}) : null;
		if (type === 'add') {
			this.props.form.setFieldsValue({ ...keys, ...obj });
		} else if (type === 'detail') {
			delete search['readjust_application_id'];
			this.props.form.setFieldsValue({ ...keys, ...obj });
		}
		this.props.form.validateFields();
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const { companyId = '' } = nextProps;
		const { company_id = '' } = prevState;
		if(!shallowEqual(companyId, company_id)) {
			return {
				company_id: companyId,
			}
		}
		return null;
	}

	handleFetch = (obj) => {
		let company_id = '';
		if (this.props.type === 'add') {
			const item = this.props.form.getFieldValue('company_id');
			if (!item) {
				message.error('请先填写公司简称');
				return
			}
			company_id = item.key;
		} else if (this.props.type === 'detail') {
			const search = qs.parse(this.props.location.search.substring(1));
			company_id = search.company_id;
		}
		return this.props.actions.getRequirement({ ...obj, company_id })
	}
	fetchData = (name) => {
		let company_id = '';
		if (this.props.type === 'add') {
			const item = this.props.form.getFieldValue('company_id');
			if (!item) {
				message.error('请先填写公司简称');
				return
			}
			company_id = item.key;
		} else if (this.props.type === 'detail') {
			const search = qs.parse(this.props.location.search.substring(1));
			company_id = search.company_id;
		}
		const { getProject, getPlatform } = this.props.actions;
		if (name === 'project_id') {
			this.setState({ projectLoading: true });
			getProject({ company_id }).then(() => {
				this.setState({ projectLoading: false });
			})
		}
		if (name === 'weibo_type' && !this.props.platformList.length) {
			this.setState({ weiboLoading: true });
			getPlatform().then(() => {
				this.setState({ weiboLoading: false });
			})
		}
	}
	handleFunction = type => {
		const search = qs.parse(this.props.location.search.substring(1));
		const paramsMap = {
			'add': {
				params: { page: 1 }, func: (params) => {
					this.props.history.replace({
						pathname: '/finance/golden/addAdjustApply',
						search: `?${qs.stringify(params)}`,
					})
				}
			},
			'detail': {
				params: { page: 1, readjust_application_id: search.readjust_application_id, company_id: search.company_id }, func: (params) => {
					this.props.history.replace({
						pathname: '/finance/golden/adjustApplyDetail',
						search: `?${qs.stringify({ readjust_application_id: search.readjust_application_id, company_id: search.company_id, ...params })}`,
					})
				}
			}
		};
		return (action, params) => {
			const obj = { ...paramsMap[type].params, ...params.keys };
			const hide = message.loading('查询中，请稍候...');
			action({ ...obj }).then(() => {
				paramsMap[type].func(params)
				hide();
			}).catch(({ errorMsg }) => {
				message.error(errorMsg || '查询失败');
				hide();
			});
		}
	}
	handleSearch = (e) => {
		const { type, curSelectRowKeys, handleClear } = this.props;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				if (type === 'add') {
					const item = this.props.form.getFieldValue('company_id');
					const company_id = item.key;
					if (this.state.company_id && this.state.company_id !== company_id && curSelectRowKeys.length > 0) {
						Modal.confirm({
							title: '提示',
							content: '你的已选订单中存在未提交的订单，切换公司将清空，是否继续？',
							onOk: () => {
								this.handleOnOk(values);
								handleClear();
								this.setState({ company_id });
							},
							onCancel: () => {
							},
						});
						return
					} else {
						this.handleOnOk(values);
						this.setState({ company_id });
						return
					}
				} else {
					this.handleOnOk(values);
				}
			}
		});
	}
	handleOnOk = values => {
		const search = qs.parse(this.props.location.search.substring(1));
		const { type, questAction } = this.props;
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
		let params = {};
		if (type === 'add') {
			const {page_size = 20} = keys;
			params = {
				keys: { ...keys, page_size },
				labels: { ...labels }
			}
		} else if (type === 'detail') {
			params = {
				keys: {
					...keys,
					readjust_application_id: search.readjust_application_id || '',
					company_id: search.company_id || ''
				},
				labels: { ...labels }
			}
		}
		Object.keys(params['keys']).forEach(item => { !params['keys'][item] && params['keys'][item] !== 0 ? delete params['keys'][item] : null });
		this.handleFunction(type)(questAction, params);
	}
	handleClear = () => {
		const { form, type } = this.props;

		this.props.form.resetFields();
		if(type === 'add')
			form.validateFields(['company_id'])

	}
	render() {
		const { form, type = 'add', projectList, platformList, rel_order_status } = this.props;
		const { getFieldDecorator } = form;
		const { projectLoading, weiboLoading } = this.state;
		const orderClass = type === 'add' ? 'add-sec-line-margin order-id-item' : 'sec-line-margin order-id-item';
		const resetClass = type === 'add' ? 'add-reset-btn' : 'reset-btn';
		return <div>
			<Form className='adjust-stat adjust-refactor'>
				<Row type="flex" justify="start">
					{/* <FormItem label='每页显示' className='left-gap'>
						{getFieldDecorator('page_size', { initialValue: 50 })(
							<Select style={{ width: 60 }}>
								<Option value={20}>20</Option>
								<Option value={50}>50</Option>
								<Option value={100}>100</Option>
								<Option value={200}>200</Option>
							</Select>
						)}
					</FormItem> */}
					{type === 'add' ?
						<FormItem label='公司简称'>
							{getFieldDecorator('company_id', {
								rules: [
									{ required: true, message: '请先输入公司简称!' },
								]
							})(
								<SearchSelect
									widthSign
									placeholder='请选择'
									getPopupContainer={() => document.querySelector('.adjust-stat')}
									action={this.props.actions.getGoldenCompanyId}
									keyWord='company_name'
									dataToList={res => { return res.data }}
									item={['company_id', 'name']}
								/>
							)}
						</FormItem> : null}
					<FormItem label='所属项目' className='left-gap'>
						{getFieldDecorator('project_id')(
							<Select
								id='project_id'
								className='query-multiple-select'
								style={{ width: 160 }}
								placeholder="请选择"
								allowClear
								showSearch
								labelInValue
								getPopupContainer={() => document.getElementById('project_id')}
								filterOption={(input, option) => (
									option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
								)}
								onFocus={() => { this.fetchData('project_id') }}
								notFoundContent={projectLoading ? <Spin size="small" /> : null}
							>
								{
									projectList.map(({ id, name }) => (<Option key={id} value={id}>{name}</Option>))
								}
							</Select>
						)}
					</FormItem>
					<FormItem label='需求名称' className='left-gap'>
						{getFieldDecorator('requirement_id')(
							<SearchSelect
								widthSign
								placeholder='请输入'
								getPopupContainer={() => document.querySelector('.adjust-stat')}
								action={this.handleFetch}
								keyWord='requirement_name'
								dataToList={res => { return res.data }}
								item={['id', 'name']}
							/>
						)}
					</FormItem>
					<FormItem label='平台' className='left-gap'>
						{getFieldDecorator('weibo_type')(
							<Select
								id='weibo_type'
								style={{ width: 160 }}
								placeholder="平台"
								allowClear
								showSearch
								labelInValue
								getPopupContainer={() => document.getElementById('weibo_type')}
								filterOption={(input, option) => (
									option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
								)}
								onFocus={() => { this.fetchData('weibo_type') }}
								notFoundContent={weiboLoading ? <Spin size="small" /> : null}
							>
								{
									platformList.map(({ pid, platform_name }) => (<Option key={pid} value={pid}>{platform_name}</Option>))
								}
							</Select>
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="space-between">
					<div>
						<FormItem label='订单ID' className={orderClass}>
							{getFieldDecorator('order_ids')(
								<Input placeholder='请输入ID号，多个以空格隔开' style={{ width: 380 }} />
							)}
						</FormItem>
						{type === 'detail' ? <FormItem label='含策划' className='left-gap plan-manage-item'>
							{getFieldDecorator('is_plan_manage')(
								<Select
									style={{ width: 160 }}
									placeholder="是否含策划"
									allowClear
									showSearch
									labelInValue
								>
									<Option value="1">是</Option>
									<Option value="2">否</Option>
								</Select>
							)}
						</FormItem> : null}	
					</div>
					<FormItem>
						<Button type='primary' onClick={this.handleSearch}>查询</Button>
						<Button className={resetClass} onClick={this.handleClear}>重置</Button>
					</FormItem>
				</Row>
			</Form>
		</div>
	}
}

const mapStateToProps = (state) => {
	return {
		projectList: state.companyDetail.projectList,
		platformList: state.companyDetail.platformList
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...goldenActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ListQuery))
