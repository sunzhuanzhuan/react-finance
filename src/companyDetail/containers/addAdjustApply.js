import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as goldenActions from "../actions/goldenApply";
import { Button, Row, Modal, message, Table, Icon, Alert } from "antd";
import ListQuery from '../components/addAdjustApply/listQuery';
import ApplyTable from '../components/addAdjustApply/applyTable';
import ApplyModal from '../components/addAdjustApply/applyModal';
import { addAdjustApplyConfig, readyCheckFunc } from "../constants";
import "./golden.less";
import qs from 'qs';
import difference from 'lodash/difference';
import { getAddApplyList, clearAddApplyList } from '../actions/getApplyList';

const { info } = Modal;

class AddAdjustApply extends React.Component {
	constructor() {
		super();
		this.state = {
			tipVisible: false,
			checkVisible: false,
			isClick: false,
			loading: false,
			curSelectRowKeys: [],
			curSelectRows: [],
			rowsMap: {},
		}
	}
	componentDidMount() {
		const search = qs.parse(this.props.location.search.substring(1));
		this.props.actions.getGoldenToken();
		this.props.actions.getGoldenMetadata();
		this.props.actions.getPlatformIcon();
		this.props.actions.getCompanyDetailAuthorizations();
		this.props.actions.clearAddApplyList();
		delete search['requirement_label'];
		const { keys:{company_id} } = search;
		// const queryObj = { page: 1, ...search.keys, page_size: 200 };
		if(company_id) {
			const companyId = company_id.key;
			// delete search.keys.company_id;
			// Object.assign(queryObj, {company_id: companyId});
			this.setState({companyId});
		}
		// this.queryData(queryObj);
	}
	queryData = (obj, func) => {
		this.setState({ loading: true });
		return this.props.actions.getAddApplyList({ ...obj }).then(() => {
			if (func && Object.prototype.toString.call(func) === '[object Function]') {
				func();
			}
			this.setState({ loading: false })
		}).catch(({ errorMsg }) => {
			this.setState({ loading: false });
			message.error(errorMsg || '列表加载失败，请重试！');
		})
	}
	handleSelected = (selectedRowKeys, selectedRows) => {
		const { rowsMap } = this.state;
		let curKeys = [], rows = {};
		selectedRows.forEach(item => {
			curKeys.push(item.order_id);
			rows[item.order_id] = item;
		});
		let otherKeys = difference(selectedRowKeys, curKeys);
		otherKeys.forEach(item => rows[item] = rowsMap[item]);
		let rowsAry = Object.values(rows);
		this.setState({ curSelectRowKeys: selectedRowKeys, rowsMap: rows, curSelectRows: rowsAry });
	}
	handleDelete = (order_id) => {
		const { rowsMap } = this.state;
		let obj = { ...rowsMap };
		delete obj[order_id];
		let ary = Object.values(obj);
		let curSelectRowKeys = ary.map(item => item.order_id);
		this.setState({ curSelectRowKeys, curSelectRows: ary, rowsMap: obj });
	}
	handleClear = () => {
		this.setState({ curSelectRowKeys: [], curSelectRows: [], rowsMap: {} });
	}
	handleBack = () => {
		const { history } = this.props;
		history.go(-1);
	}
	render() {
		const { loading, tipVisible, checkVisible, curSelectRowKeys, curSelectRows, companyId, isShowList } = this.state;
		const { addApplyListReducer = {}, goldenToken, goldenMetadata: { quote_type = [] }, platformIcon = [] } = this.props;
		const {list = [], page, page_size, total = 0, all_total = 0} = addApplyListReducer['addApplyList'] || {};
		const readyList = readyCheckFunc(this.handleDelete);
		const totalMsg = `查询结果共${all_total}个，${total}个符合调价要求，${all_total - total}不符合：A端创建/订单已申请调价且尚未审批/非客户待确认状态订单无法申请调价。`;

		return <div className='add-adjust-apply'>
			<h2 className='add_adjust_header' onClick={this.handleBack}>
				<Icon type="arrow-left" />
				<span className='left-gap'>订单调价</span>
			</h2>
			<ListQuery
				type={'add'}
				companyId={companyId}
				questAction={this.props.actions.getAddApplyList}
				location={this.props.location}
				history={this.props.history}
				curSelectRowKeys={curSelectRowKeys}
				handleClear={this.handleClear}
			></ListQuery>
			{ all_total - total > 0 ? <Alert className='add-list-total-info' message={totalMsg} type="warning" showIcon /> : null }
			<div className='left-gap selected-refactor'>
				已选订单:<span className='red-font' style={{ marginLeft: '10px' }}>{curSelectRowKeys.length}</span>个
				<Button className='left-gap' type='primary' onClick={() => {
					this.setState({ checkVisible: true });
				}}>查看已选</Button>
				{/* { list.length ? <span className='total-info'>{`总共${all_total}条;不符合条件${all_total - total}条`}</span> : null} */}
			</div>
			<ApplyTable
				type={'add'}
				rowKey={'order_id'}
				columns={addAdjustApplyConfig(quote_type, platformIcon)}
				dataSource={list}
				loading={loading}
				queryAction={this.queryData}
				page={parseInt(page)}
				addPageSize={parseInt(page_size)}
				total={parseInt(total)}
				curSelectRowKeys={curSelectRowKeys}
				curSelectRows={curSelectRows}
				handleSelected={this.handleSelected}
				location={this.props.location}
				scroll={{ x: 1900 }}
			/>
			<Row className='top-gap' style={{ textAlign: 'center' }}>
				<Button className='adjust-apply-btn' type='default' onClick={() => {
					this.props.history.push('/finance/golden/adjustApply')
				}}>上一步</Button>
				<Button className='adjust-apply-btn left-gap' type='primary' disabled={!curSelectRowKeys.length}
					onClick={
						() => {
							if( curSelectRowKeys.length > 300 ) {
								info({title: '申请订单数不能超过300个'})
							}else {
								this.setState({ tipVisible: true }) 
							}
							}
					}>提交审核</Button>
			</Row>
			{tipVisible ? <ApplyModal
				type={'add'}
				visible={tipVisible}
				queryAction={this.queryData}
				curSelectRowKeys={curSelectRowKeys}
				curSelectRows={curSelectRows}
				onCancel={() => { this.setState({ tipVisible: false }) }}
				handleClear={this.handleClear}
				goldenToken={goldenToken}
				location={this.props.location}
			>
			</ApplyModal> : null}
			<CheckModal checkVisible={checkVisible} columns={readyList} dataSource={curSelectRows}
				handleClear={this.handleClear}
				onCancel={() => { this.setState({ checkVisible: false }) }}
			/>
		</div>
	}
}

const mapStateToProps = (state) => {
	return {
		goldenToken: state.companyDetail.goldenToken,
		goldenMetadata: state.companyDetail.goldenMetadata,
		platformIcon: state.companyDetail.platformIconList,
		addApplyListReducer: state.companyDetail.applyListReducer,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...goldenActions, getAddApplyList, clearAddApplyList }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(AddAdjustApply)
function CheckModal(props) {
	return <Modal
		visible={props.checkVisible}
		width={1000}
		title='查看已选'
		footer=""
		onCancel={props.onCancel}
		wrapClassName='accounting-dialog-list'
	>
		<Button
			type="primary"
			onClick={props.handleClear}
		>
			清空已选
				</Button>
		<Table
			className='top-gap'
			rowKey='id'
			columns={props.columns}
			dataSource={props.dataSource}
			size="small"
			pagination={false}
			scroll={{ y: 760 }}
		>
		</Table>
	</Modal>
}
