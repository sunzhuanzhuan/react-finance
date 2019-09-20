import React from 'react'
import { Modal, message } from "antd";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as exceedPaymentActions from '../actions/exceedPayment'
import * as commonActions from '../actions/common'
import ExceedListQuery from '../components/exceedPayment/listQuery'
import PageTable from '../components/pageTable'
import ExceedListModal from '../components/exceedPayment/newModal'

import { exceedListFunc } from '../constans'
import './saleIncome.less'

class ExceedPayment extends React.Component {
	constructor() {
		super();
		this.state = {
			newModalVisible: false,
			curKey: '',
			keyMap: { 'new': '新增超账期回款打折比例', 'mod': '编辑超账期回款打折比例' },
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
		return this.props.actions.getPaymentList({ ...obj, operation: 1 })
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
						this.props.actions.getPaymentList({ ...filterParams, page: page - 1, page_size, operation: 1 });
						return
					}
					this.props.actions.getPaymentList({ ...filterParams, page, page_size, operation: 1 });
				}).catch(({ errorMsg }) => {
					message.error(errorMsg || '删除失败')
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
		const exceedList = exceedListFunc(this.handleNewModal, this.handleDelete);
		const key = Object.keys(record).length > 0 ? `${curKey}_${record.id}` : 'new';
		return <div className='sale-mission-list'>
			<fieldset className='fieldset_css'>
				<legend>查询</legend>
				<ExceedListQuery
					postType={saleMetadata.position_level || []}
					page_size={page_size}
					questAction={this.questAction}
					handlefilterParams={this.handlefilterParams}
					handleNew={this.handleNewModal}
				></ExceedListQuery>
			</fieldset>
			<div className='top-gap'>
				<PageTable
					columns={exceedList}
					dataSource={list}
					questAction={this.questAction}
					total={total}
					current={page}
					filterParams={filterParams}
					handlePageSize={this.handlePageSize}
				></PageTable>
			</div>
			<div>
				{newModalVisible ? <ExceedListModal
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
				></ExceedListModal> : null}
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
export default connect(mapStateToProps, mapDispatchToProps)(ExceedPayment)
