import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as clientPaymentActions from '../actions/clientPayment'
import ClientListQuery from '../components/clientPayment/listQuery'
import PageTable from '../components/pageTable'
import ClientListModal from '../components/clientPayment/newModal'

import { clientListFunc } from '../constans'
import './saleIncome.less'

class ClientPayment extends React.Component {
	constructor () {
		super();
		this.state = {
			newModalVisible: false,
			curKey: '',
			keyMap: { 'new': '新增企业账期', 'mod': '编辑企业账期' },
			record: {},
			page_size: '',
			clearFlag: false
		}
	}
	componentDidMount() {

	}
	handleNewModal = (curKey, record) => {
		this.setState({ curKey, record, newModalVisible: true });
	}
	handleOnCancel = () => {
		this.setState({ newModalVisible: false });
	}
	handleClearFlag = clearFlag => {
		this.setState({ clearFlag });
	}
	handlePageSize = (page_size) => {
		this.setState({ page_size });
	}
	render() {
		const { newModalVisible, record, curKey, keyMap, page_size, clearFlag } = this.state;
		const { companyData: { list, total, page }, companyID } = this.props;
		const clientList = clientListFunc(this.handleNewModal);
		const key = Object.keys(record).length > 0 ? `${curKey}_${record.id}` : 'new';
		return <div className='sale-mission-list'>
			<fieldset className='fieldset_css'>
				<legend>查询</legend>
				<ClientListQuery
					page_size={ page_size }
					companyID={ companyID }
					searchAction={ this.props.actions.getCompanyID }
					questAction={ this.props.actions.getCompanyList }
					handleNew={ this.handleNewModal }
					handleClearFlag={ this.handleClearFlag }
				></ClientListQuery>
			</fieldset>
			<div className='top-gap'>
				<PageTable
					columns={ clientList }
					dataSource={ clearFlag ? [] : list }
					questAction={ this.props.actions.getCompanyList }
					total={ total }
					current={ page }
					handlePageSize={ this.handlePageSize }
					clearFlag={ clearFlag }
				></PageTable>
			</div>
			<div>
				{ newModalVisible ? <ClientListModal
					visible={ newModalVisible }
					title={ keyMap[ curKey ] }
					curKey={ key }
					record={ record }
					page={ page }
					page_size={ page_size }
					companyID={ companyID }
					onCancel={ this.handleOnCancel }
				>{ this.props.actions }</ClientListModal> : null }
			</div>
		</div>
	}
}
const mapStateToProps = (state) => {
	return {
		companyData: state.saleIncome.companyData,
		companyID: state.saleIncome.companyID,
		companySearch: state.saleIncome.companySearch
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...clientPaymentActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(ClientPayment)
