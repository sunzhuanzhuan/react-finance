import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Modal, message } from 'antd'
import * as businessIncomeActions from '../actions/businessIncome'
import * as commonActions from '../actions/common'
import BusinessListQuery from '../components/businessIncome/listQuery'
import PageTable from '../components/pageTable'
import BusinessListModal from '../components/businessIncome/newModal'

import { businessListFunc } from '../constans'
import './saleIncome.less'

class BusinessIncome extends React.Component {
	constructor() {
		super();
		this.state = {
			newModalVisible: false,
			curKey: '',
			keyMap: { 'new': '新增业务类型提成比例', 'mod': '编辑业务类型提成比例' },
			record: {},
			page_size: '',
			filterParams: {}
		}
	}
	componentDidMount() {
		const { getMetadata, getSalesName } = this.props.actions;
		getMetadata();
		getSalesName();
	}
	handleNewModal = (curKey, record) => {
		this.setState({ curKey, record, newModalVisible: true });
	}
	handlefilterParams = (filterParams) => {
		this.setState({ filterParams });
	}
	handleDelete = (id) => {
		const { page_size, filterParams } = this.state;
		const { incomeData: { list, page } } = this.props;
		Modal.confirm({
			content: '是否确认删除？',
			onOk: () => {
				this.props.actions.getDeleteIncome({ id }).then(() => {
					message.success('删除成功')
					if (list.length === 1) {
						this.props.actions.getIncomeList({ ...filterParams, page: page - 1, page_size });
						return
					}
					this.props.actions.getIncomeList({ ...filterParams, page, page_size });
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
		const { incomeData: { list, total, page }, saleMetadata, saleName } = this.props;
		const saleNameList = Object.values(saleName);
		const incomeList = businessListFunc(this.handleNewModal, this.handleDelete, saleNameList);
		const key = Object.keys(record).length > 0 ? `${curKey}_${record.id}` : 'new';
		return <div className='sale-mission-list'>
			<fieldset className='fieldset_css'>
				<legend>查询</legend>
				<BusinessListQuery
					nameList={saleNameList}
					quoteType={saleMetadata.quote_type || []}
					postType={saleMetadata.position_level || []}
					page_size={page_size}
					questAction={this.props.actions.getIncomeList}
					handleNew={this.handleNewModal}
					handlefilterParams={this.handlefilterParams}
				></BusinessListQuery>
			</fieldset>
			<div className='top-gap'>
				<PageTable
					columns={incomeList}
					dataSource={list}
					questAction={this.props.actions.getIncomeList}
					total={total}
					current={page}
					filterParams={filterParams}
					handlePageSize={this.handlePageSize}
				></PageTable>
			</div>
			<div>
				{newModalVisible ? <BusinessListModal
					visible={newModalVisible}
					title={keyMap[curKey]}
					curKey={key}
					record={record}
					nameList={saleNameList}
					quoteType={saleMetadata.quote_type || []}
					postType={saleMetadata.position_level || []}
					operation={saleMetadata.operation || []}
					page={page}
					page_size={page_size}
					filterParams={filterParams}
					onCancel={this.handleOnCancel}
				></BusinessListModal> : null}
			</div>
		</div>
	}
}
const mapStateToProps = (state) => {
	return {
		saleMetadata: state.saleIncome.saleMetadata,
		incomeData: state.saleIncome.incomeData,
		saleName: state.saleIncome.saleName,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...businessIncomeActions, ...commonActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(BusinessIncome)
