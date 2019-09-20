import React from 'react'
import { Modal, message } from "antd";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as exceedPaymentActions from '../actions/exceedPayment'
import * as commonActions from '../actions/common'
import AgingListQuery from '../components/longAging/listQuery'
import PageTable from '../components/pageTable'
import AgingListModal from '../components/longAging/newModal'

import { longListFunc } from '../constans'
import './saleIncome.less'

class LongAging extends React.Component {
	constructor() {
		super();
		this.state = {
			newModalVisible: false,
			curKey: '',
			keyMap: { 'new': '新增长账龄扣款比例', 'mod': '编辑长账龄扣款比例' },
			record: {},
			page_size: '',
			filterParams: {}
		}
	}
	componentDidMount() {
		const { getMetadata } = this.props.actions;
		getMetadata();
	}
	questAction = (obj) => {
		return this.props.actions.getPaymentList({ ...obj, operation: 2 })
	}
	handleNewModal = (curKey, record) => {
		this.setState({ curKey, record, newModalVisible: true });
	}
	handlefilterParams = (filterParams) => {
		this.setState({ filterParams });
	}
	handleDelete = (id) => {
		const { page_size, filterParams } = this.state;
		const { paymentData: { list, page } } = this.props;
		Modal.confirm({
			content: '是否确认删除？',
			onOk: () => {
				this.props.actions.getDeletePayment({ id }).then(() => {
					message.success('删除成功');
					if (list.length === 1) {
						this.props.actions.getPaymentList({ ...filterParams, page: page - 1, page_size, operation: 2 });
						return
					}
					this.props.actions.getPaymentList({ ...filterParams, page, page_size, operation: 2 });
				}).catch(({ errorMsg }) => {
					message.error(errorMsg || '删除失败');
				});
			},
			onCancel() { },
		})
	}
	handleOnCancel = () => {
		this.setState({ newModalVisible: false })
	}
	handlePageSize = (page_size) => {
		this.setState({ page_size });
	}
	render() {
		const { newModalVisible, record, curKey, keyMap, page_size, filterParams } = this.state;
		const { paymentData: { list, total, page }, saleMetadata } = this.props;
		const longList = longListFunc(this.handleNewModal, this.handleDelete);
		const key = Object.keys(record).length > 0 ? `${curKey}_${record.id}` : 'new';
		return <div className='sale-mission-list'>
			<fieldset className='fieldset_css'>
				<legend>查询</legend>
				<AgingListQuery
					postType={saleMetadata.position_level || []}
					page_size={page_size}
					questAction={this.questAction}
					handlefilterParams={this.handlefilterParams}
					handleNew={this.handleNewModal}
				></AgingListQuery>
			</fieldset>
			<div className='top-gap'>
				<PageTable
					columns={longList}
					dataSource={list}
					questAction={this.questAction}
					total={total}
					current={page}
					filterParams={filterParams}
					handlePageSize={this.handlePageSize}
				></PageTable>
			</div>
			<div>
				{newModalVisible ? <AgingListModal
					visible={newModalVisible}
					title={keyMap[curKey]}
					curKey={key}
					record={record}
					postType={saleMetadata.position_level || []}
					operation={saleMetadata.operation || []}
					page={page}
					page_size={page_size}
					filterParams={filterParams}
					onCancel={this.handleOnCancel}
				></AgingListModal> : null}
			</div>
		</div>
	}
}
const mapStateToProps = (state) => {
	return {
		saleMetadata: state.saleIncome.saleMetadata,
		paymentData: state.saleIncome.paymentData,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...exceedPaymentActions, ...commonActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(LongAging)
