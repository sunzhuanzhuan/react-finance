import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as goldenActions from "../actions/goldenApply";
import { Modal, Form, message, Table, Input, Button, Tabs } from "antd";
import AdjustQuery from '../components/adjustQuery';
import ApplyModal from '../components/addAdjustApply/applyModal'
import { adjustApplyFunc, adjustApplyListFunc, adjustApplyDetailFunc } from "../constants";
import "./golden.less";
import qs from 'qs';
import SearchSelect from '../components/SearchSelect';
import { getApplyList } from '../actions/getApplyList';
const { TextArea } = Input;
const { TabPane } = Tabs;
const FormItem = Form.Item;

class AdjustApply extends React.Component {
	constructor() {
		super();
		this.state = {
			page_size: 20,
			tipVisible: false,
			loading: false,
			flag: false,
			btnFlag: false,
			costFlag: false,
			quoteType: '',
			readjust_application_id: '',
			activeKey: 'allOptions'
		};
	}
	componentDidMount() {
		const search = qs.parse(this.props.location.search.substring(1));
		const currentTab = search.keys ? search.keys.status : 'allOptions';
		const { getCompanyDetailAuthorizations, getGoldenMetadata, getGoldenUserList, getPlatformIcon } = this.props.actions;
		this.setState({ activeKey: currentTab ? currentTab.toString() : 'allOptions' });
		getCompanyDetailAuthorizations().then(() => {
			const { companyDetailAuthorizations } = this.props
			const flag = companyDetailAuthorizations[0].permissions['readjust.finance.operation'];
			const btnFlag = companyDetailAuthorizations[0].permissions['readjust.sale.operation'];
			const finance = companyDetailAuthorizations[0].permissions['readjust.finance.audit'];
			const sale = companyDetailAuthorizations[0].permissions['readjust.sale.audit'];
			const costFlag = companyDetailAuthorizations[0].permissions['readjust.finance.filter'];
			const audit_type = finance ? 1 : sale ? 2 : undefined;
			this.setState({ flag, btnFlag, audit_type, costFlag });
		})
		getGoldenMetadata().then(() => {

			this.queryAllStatusData({ page: 1, page_size: this.state.page_size, ...search.keys });
		});
		getGoldenUserList();
		getPlatformIcon();
	}
	getListQueryFunc = (obj, application_status = [], applyListReducer = {}, getApplyList, isSearch) => {
		if(application_status.length)
			return application_status.map(item => {
				const { id } = item;
				const status = id !== 'allOptions' ? id : undefined; 
				const tabInfo = applyListReducer[`applyListStatus${id}`] || {};
				const { page = 1, page_size = 20 } = tabInfo;
				return getApplyList(Object.assign(obj, {status, page: isSearch ? 1 : page, page_size}));
			})
		return null;
	}
	queryAllStatusData = (obj, func, isSearch) => {
		const { actions: {getApplyList}, goldenMetadata: { application_status = []}, applyListReducer } = this.props;
		const dealStatusArr = Array.isArray(application_status) && application_status.length  ? [{id: 'allOptions', display: '全部'}, ...application_status] : [];
		this.setState({ loading: true });
		Promise.all(this.getListQueryFunc(obj, dealStatusArr, applyListReducer, getApplyList, isSearch)).then(() => {
			if(typeof func === 'function')
				func();
			this.setState({ loading: false })
		}).catch(({ errorMsg }) => {
			this.setState({ loading: false });
			message.error(errorMsg || '列表加载失败，请重试！');
		})
	}
	queryData = (obj, func) => {
		const { status = 'allOptions' } = obj;
		this.setState({ loading: true, activeKey: status.toString() });
		return this.props.actions.getApplyList({ ...obj }).then(() => {
			if (func && Object.prototype.toString.call(func) === '[object Function]') {
				func();
			}
			this.setState({ loading: false })
		}).catch(({ errorMsg }) => {
			this.setState({ loading: false });
			message.error(errorMsg || '列表加载失败，请重试！');
		})
	}
	handleJump = (id, company_id) => {
		this.props.history.push({
			pathname: '/finance/golden/adjustApplyDetail',
			search: `?${qs.stringify({ readjust_application_id: id, company_id, keys: { readjust_application_id: id, company_id, page_size: 50 } })}`,
		});
	}
	handleExport = (readjust_application_id) => {
		this.props.actions.getExport({ readjust_application_id })
	}
	handleAction = (type, readjust_application_id, quote_type, company_id) => {
		if (type === 'pass') {
			const params = {
				page: 1,
				readjust_application_id,
				company_id,
				page_size: 50,
				status: 1
			}
			this.props.actions.getApplicationDetail(params);
			this.setState({ tipVisible: true, quoteType: quote_type, readjust_application_id, company_id });
		} else if (type === 'reject') {
			this.showReject(readjust_application_id);
		}
	}
	showReject = (readjust_application_id) => {
		this.setState({ rejectVisible: true, readjust_application_id });
	}
	handleReject = (readjust_application_id) => {
		const { audit_type } = this.state;
		const search = qs.parse(this.props.location.search.substring(1));
		const { postRejectByReadjustId } = this.props.actions;
		const remark = document.querySelector('#reject-remark').value;
		const params = { readjust_application_id, remark, audit_type };
		const hide = message.loading('操作中，请稍候...');
		postRejectByReadjustId({ ...params }).then(() => {
			this.setState({ rejectVisible: false });
			this.queryAllStatusData({ ...search });
			hide();
			message.success('操作成功！');
		}).catch(({ errorMsg }) => {
			hide();
			message.error(errorMsg || '操作失败！');
		})
	}
	isShowAddModal = () => {
		this.setState({addVisible: !this.state.addVisible})
	}
	handleOpenAddPage = () => {
		const {form,history} = this.props;
		form.validateFields((err, values) => {
			if (err) return;
			const { company_id } = values;
			const src = `/finance/golden/addAdjustApply?${qs.stringify({ keys: { page_size: 20, company_id } })}`;
			history.push(src);
			// const $a = document.createElement('a');
			// 	$a.setAttribute("href", src);
			// 	$a.setAttribute("target", "_blank");
			// const evObj = document.createEvent('MouseEvents');
			// 	evObj.initMouseEvent("click", true, true);
			// 	$a.dispatchEvent(evObj);
		})
	}
	handleChangeTab = activeKey => {
		const search = qs.parse(this.props.location.search.substring(1));
		this.setState({activeKey});
		this.props.history.replace({
			pathname: this.props.location.pathname,
			search: `?${qs.stringify({ ...search, keys: { ...search.keys, status: activeKey } })}`,
		});
	}
	handleSearchList = (obj, func) => {
		this.queryAllStatusData(obj, func, true);
	}
	render() {
		const { loading, tipVisible, page_size, flag, btnFlag, costFlag, quoteType, readjust_application_id, rejectVisible, company_id, addVisible, activeKey, audit_type } = this.state;
		const { form, goldenMetadata, goldenMetadata: { application_status = [], rel_order_status = [], quote_type = [], readjust_type = [] }, goldenUserList, applicationDetail: { list: detailList = [] }, applyListReducer = {}, platformIcon = [] } = this.props;
		const { getFieldDecorator } = form;
		const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 }, };
		const search = qs.parse(this.props.location.search.substring(1));
		const adjustApplyList = flag ? adjustApplyListFunc(audit_type, application_status, quote_type, this.handleJump, this.handleAction) : adjustApplyFunc(application_status, quote_type, this.handleJump);
		const preArr = ['prev_id', 'statusPre', 'company_name', 'project_name', 'requirement_id_name', 'account_id_name', 'main_account_info', 'quoted_price', 'discount_rate', 'order_bottom_price', 'commissioned_price', 'pre_min_sell_price', 'preview_quote_type'];
		const dealPreArr = costFlag ? preArr : preArr.filter(item => item !== 'quoted_price');
		const adjustApplyPreview = adjustApplyDetailFunc(rel_order_status, quote_type, readjust_type, platformIcon)(dealPreArr);
		const dealStatusArr = Array.isArray(application_status) && application_status.length  ? [{id: 'allOptions', display: '全部'}, ...application_status] : [];
		const getTabPaneComp = () => {
			return dealStatusArr.map(item => {
				const { id, display } = item;
				const tabInfo = applyListReducer[`applyListStatus${id}`] || {};
				const { list = [], page, total, page_size: tableSize } = tabInfo;
				const status = id !== 'allOptions' ? id : undefined; 
				const paginationObj = {
					onChange: (current) => {
						this.queryData({ ...search.keys, page: current, page_size: tableSize, status });
						this.props.history.replace({
							pathname: this.props.location.pathname,
							search: `?${qs.stringify({ ...search, keys: { ...search.keys, page: current, status } })}`,
						});
					},
					onShowSizeChange: (_, pageSize) => {
						const curPage = Math.ceil(total / pageSize);
						this.setState({ page_size: pageSize });
						this.queryData({ ...search.keys, page: curPage, page_size: pageSize, status });
						this.props.history.replace({
							pathname: this.props.location.pathname,
							search: `?${qs.stringify({ ...search, keys: { ...search.keys, page: curPage, status } })}`, //, page_size: pageSize
						});
					},
					total: parseInt(total),
					current: parseInt(page),
					pageSize: parseInt(tableSize),
					showQuickJumper: true,
					showSizeChanger: true,
					pageSizeOptions: ['20', '50', '100', '200']
				};
				const tab = <div>
					<span key='name'>{display}</span>
					<span key='count'>{total}</span>
				</div>;
				return (
					<TabPane tab={tab} key={id}>
						<Table
							className='table_style'
							rowKey='id'
							columns={adjustApplyList}
							dataSource={list}
							loading={loading}
							bordered
							pagination={list.length ? paginationObj : false}
						></Table>
					</TabPane>
				)
			})
		};

		return <div className='adjust-apply'>
				<legend>订单调价</legend>
				<AdjustQuery history={this.props.history}
					questAction={this.handleSearchList}
					pageSize={page_size}
					location={this.props.location}
					userList={goldenUserList}
					action={this.props.actions.getGoldenCompanyId}
				>
					{goldenMetadata}
				</AdjustQuery>
				<div className='addOperateWrapper'>
				{flag ? <Button type='primary' icon='download' className='right-gap' href='/finance/golden/adjustApplyInput'
					>导入</Button> : null}
					{btnFlag ? <Button className='right-gap' type="primary" onClick={this.isShowAddModal}
						// href={`/finance/golden/addAdjustApply?${qs.stringify({ keys: { page_size: 50 } })}`}
						// target='_blank'
					>添加申请</Button> : null}
				</div>
				<Tabs className='adjust_tabs' activeKey={activeKey} onChange={this.handleChangeTab}>
					{
						getTabPaneComp()
					}
				</Tabs>
			{tipVisible ? <ApplyModal
				type={'pass'}
				flag={flag}
				isApplication={true}
				visible={tipVisible}
				queryAction={this.queryAllStatusData}
				onCancel={() => { this.setState({ tipVisible: false }) }}
				location={this.props.location}
				page_size={page_size}
				quoteType={quoteType}
				readjustId={readjust_application_id}
				companyId={company_id}
				columns={adjustApplyPreview}
				curSelectRows={detailList}
			>
			</ApplyModal> : null}
			{rejectVisible ? <Modal title='订单调价处理' visible={rejectVisible}
				onOk={() => { this.handleReject(readjust_application_id) }}
				onCancel={() => { this.setState({ rejectVisible: false }) }}
				maskClosable={false}
			>
				备注：<TextArea id='reject-remark' placeholder='非必输' style={{ width: 400, verticalAlign: 'top' }} autosize={{ minRows: 4, maxRows: 6 }} maxLength={50} />
			</Modal> : null}
			<Modal 
				title='选择公司' 
				width={440}
				visible={addVisible}
				destroyOnClose
				onOk={this.handleOpenAddPage}
				onCancel={this.isShowAddModal}
			>
				<Form>
					<FormItem label='公司简称' {...formItemLayout}>
						{getFieldDecorator('company_id', {
							rules: [
								{ required: true, message: '请先输入公司简称!' },
							]
						})(
							<SearchSelect
								selfWidth
								placeholder='请选择公司'
								getPopupContainer={() => document.querySelector('.adjust-stat')}
								action={this.props.actions.getGoldenCompanyId}
								keyWord='company_name'
								dataToList={res => { return res.data }}
								item={['company_id', 'name']}
							/>
						)}
					</FormItem>
				</Form>
			</Modal>
		</div>
	}
}

const mapStateToProps = (state) => {
	return {
		companyDetailAuthorizations: state.companyDetail.companyDetailAuthorizations,
		goldenMetadata: state.companyDetail.goldenMetadata,
		goldenUserList: state.companyDetail.goldenUserList,
		applicationList: state.companyDetail.applicationList,
		applicationDetail: state.companyDetail.applicationDetail,
		applyListReducer: state.companyDetail.applyListReducer,
		platformIcon: state.companyDetail.platformIconList,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...goldenActions, getApplyList }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AdjustApply))
