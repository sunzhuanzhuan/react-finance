import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Modal, message } from 'antd'
import * as personInfoActions from '../actions/personInfo'
import * as commonActions from '../actions/common'
import PersonListQuery from '../components/personInfo/listQuery'
import PageTable from '../components/pageTable'
import PersonListModal from '../components/personInfo/newModal'
import { personInfoFunc } from '../constans'
import './saleIncome.less'

class PersonInfo extends React.Component {
	constructor() {
		super();
		this.state = {
			newModalVisible: false,
			curKey: '',
			keyMap: { 'new': '新增提成人员信息', 'mod': '编辑提成人员信息' },
			record: {},
			page_size: '',
			filterParams: {}
		}
	}
	componentDidMount() {
		const { getMetadata, getSalesName, getNewSalesName } = this.props.actions;
		getMetadata();
		getSalesName();
		getNewSalesName();
	}
	handleNewModal = (curKey, record) => {
		this.setState({ curKey, record, newModalVisible: true });
	}
	handlefilterParams = (filterParams) => {
		this.setState({ filterParams });
	}
	handleDelete = (sale_id) => {
		const { page_size, filterParams } = this.state;
		const { saleData: { list, page } } = this.props;
		const { getPersonInfo, getNewSalesName } = this.props.actions;
		Modal.confirm({
			content: '是否确认删除？',
			onOk: () => {
				this.props.actions.postDeleteSale({ sale_id }).then(() => {
					message.success('删除成功');
					if (list.length === 1) {
						getPersonInfo({ ...filterParams, page: page - 1, page_size });
						getNewSalesName();
						return
					}
					getPersonInfo({ ...filterParams, page, page_size });
					getNewSalesName();
				}).catch(() => {
					message.error('删除失败');
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
		const { saleData: { list, total, page }, saleMetadata: { position_level = [], region = [] }, saleName, newSaleName } = this.props;
		const personList = personInfoFunc(this.handleNewModal, this.handleDelete, position_level);
		const key = Object.keys(record).length > 0 ? `${curKey}_${record.id}` : 'new';
		const saleNameList = Object.values(saleName);
		return <div className='person-info-list'>
			<fieldset className='fieldset_css'>
				<legend>查询</legend>
				<PersonListQuery
					region={region}
					nameList={saleNameList}
					postType={position_level}
					page_size={page_size}
					questAction={this.props.actions.getPersonInfo}
					handlefilterParams={this.handlefilterParams}
					handleNew={this.handleNewModal}
				></PersonListQuery>
			</fieldset>
			<div className='top-gap'>
				<PageTable
					columns={personList}
					dataSource={list}
					rowKey='identity'
					questAction={this.props.actions.getPersonInfo}
					total={total}
					current={page}
					filterParams={filterParams}
					handlePageSize={this.handlePageSize}
				></PageTable>
			</div>
			<div>
				{newModalVisible ? <PersonListModal
					visible={newModalVisible}
					title={keyMap[curKey]}
					curKey={key}
					record={record}
					region={region}
					nameList={newSaleName}
					postType={position_level}
					page={page}
					page_size={page_size}
					filterParams={filterParams}
					onCancel={this.handleOnCancel}
				></PersonListModal> : null}
			</div>
		</div>
	}
}
const mapStateToProps = (state) => {
	return {
		saleData: state.saleIncome.saleData,
		saleMetadata: state.saleIncome.saleMetadata,
		saleName: state.saleIncome.saleName,
		newSaleName: state.saleIncome.newSaleName,
		saleSuperior: state.saleIncome.superior
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...personInfoActions, ...commonActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(PersonInfo)
