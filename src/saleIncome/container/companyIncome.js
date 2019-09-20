import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Modal, message } from 'antd'
import * as companyIncomeActions from '../actions/companyIncome'
import * as commonActions from '../actions/common'
import CompanyListQuery from '../components/companyIncome/listQuery'
import PageTable from '../components/pageTable'
import CompanyListModal from '../components/companyIncome/newModal'
import { companyIncomeFunc } from '../constans'
import './saleIncome.less'

class CompanyIncome extends React.Component {
	constructor() {
		super();
		this.state = {
			newModalVisible: false,
			curKey: '',
			keyMap: { 'new': '新增公司提成标识', 'mod': '编辑公司提成标识' },
			record: {},
			page_size: '',
			filterParams: {}
		}
	}
	componentDidMount() {
		const { getPreparation, getMetadata, getSalesName } = this.props.actions;
		getPreparation();
		getMetadata();
		getSalesName();
	}
	handleNewModal = (curKey, record) => {
		this.setState({ curKey, record, newModalVisible: true });
	}
	handlefilterParams = (filterParams) => {
		this.setState({ filterParams });
	}
	handleDelete = (company_id) => {
		const { page_size, filterParams } = this.state;
		const { preparationList: { list, page } } = this.props;
		Modal.confirm({
			content: '是否确认删除？',
			onOk: () => {
				this.props.actions.postDeletePreparation({ company_id }).then(() => {
					message.success('删除成功')
					if (list.length === 1) {
						this.props.actions.getPreparationList({ ...filterParams, page: page - 1, page_size });
						return
					}
					this.props.actions.getPreparationList({ ...filterParams, page, page_size });
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
		const { preparationList: { list, total, page }, preparation, saleMetadata: { quote_type = [] }, saleName } = this.props;
		const companyList = companyIncomeFunc(this.handleNewModal, this.handleDelete, quote_type);
		const key = Object.keys(record).length > 0 ? `${curKey}_${record.id}` : 'new';
		const saleNameList = Object.values(saleName);
		const preparationAry = Object.values(preparation);
		return <div className='sale-mission-list'>
			<fieldset className='fieldset_css'>
				<legend>查询</legend>
				<CompanyListQuery
					nameList={saleNameList}
					preparation={preparationAry}
					questAction={this.props.actions.getPreparationList}
					page_size={page_size}
					handlefilterParams={this.handlefilterParams}
					handleNew={this.handleNewModal}
				></CompanyListQuery>
			</fieldset>
			<div className='top-gap'>
				<PageTable
					columns={companyList}
					dataSource={list}
					rowKey='company_id'
					questAction={this.props.actions.getPreparationList}
					total={total}
					current={page}
					filterParams={filterParams}
					handlePageSize={this.handlePageSize}
				></PageTable>
			</div>
			<div>
				{newModalVisible ? <CompanyListModal
					visible={newModalVisible}
					title={keyMap[curKey]}
					curKey={key}
					record={record}
					quoteType={quote_type}
					page={page}
					page_size={page_size}
					filterParams={filterParams}
					onCancel={this.handleOnCancel}
				></CompanyListModal> : null}
			</div>
		</div>
	}
}
const mapStateToProps = (state) => {
	return {
		preparation: state.saleIncome.preparation,
		preparationList: state.saleIncome.preparationList,
		saleMetadata: state.saleIncome.saleMetadata,
		saleName: state.saleIncome.saleName
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...companyIncomeActions, ...commonActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(CompanyIncome)
