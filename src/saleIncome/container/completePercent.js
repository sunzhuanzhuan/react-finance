import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Modal, message } from 'antd'
import * as completePercentActions from '../actions/completePercent'
import * as commonActions from '../actions/common'
import CompleteListQuery from '../components/completePercent/listQuery'
import PageTable from '../components/pageTable'
import CompleteListModal from '../components/completePercent/newModal'
import { completePercentFunc } from '../constans'
import './saleIncome.less'

class CompletePercent extends React.Component {
	constructor() {
		super();
		this.state = {
			newModalVisible: false,
			curKey: '',
			keyMap: { 'new': '新增完成率提成比例', 'mod': '修改完成率提成比例' },
			record: {},
			page_size: '',
			filterParams: {},
			actionFlag: '',
		}
	}
	componentDidMount() {
		const { getMetadata } = this.props.actions;
		getMetadata();
	}
	handleNewModal = (curKey, record) => {
		this.setState({ curKey, record, newModalVisible: true });
	}
	handlefilterParams = (filterParams) => {
		this.setState({ filterParams });
	}
	handleDelete = (id) => {
		const { page_size, filterParams } = this.state;
		const { completeData: { list, page } } = this.props;
		Modal.confirm({
			content: '是否确认删除？',
			onOk: () => {
				const hide = message.loading('操作中，请稍候...');
				this.props.actions.postDeleteComplete({ id }).then(() => {
					hide();
					message.success('删除成功');
					if (list.length === 1) {
						this.props.actions.getCompleteList({ ...filterParams, page: page - 1, page_size });
						return
					}
					this.props.actions.getCompleteList({ ...filterParams, page, page_size });
				}).catch(({ errorMsg }) => {
					hide();
					message.error(errorMsg || '删除失败');
				});
			},
			onCancel() { },
		})
	}
	handleActionFlag = (str) => {
		this.setState({ actionFlag: str });
	}
	handleOnCancel = () => {
		this.setState({ newModalVisible: false })
	}
	handlePageSize = (page_size) => {
		this.setState({ page_size });
	}
	render() {
		const { newModalVisible, record, curKey, keyMap, page_size, filterParams, actionFlag } = this.state;
		const { completeData: { list, total, page }, saleMetadata: { position_level = [], order_type = [] } } = this.props;
		const completeList = completePercentFunc(this.handleNewModal, this.handleDelete, actionFlag, this.handleActionFlag);
		const key = Object.keys(record).length > 0 ? `${curKey}_${record.id}` : 'new';
		// const saleNameList = Object.values(saleName);
		return <div className='sale-mission-list'>
			{/* <fieldset className='fieldset_css'>
				<legend>查询</legend> */}
			<CompleteListQuery
				postType={position_level}
				orderType={order_type}
				page_size={page_size}
				questAction={this.props.actions.getCompleteList}
				handlefilterParams={this.handlefilterParams}
				handleNew={this.handleNewModal}
			></CompleteListQuery>
			{/* </fieldset> */}
			<div className='top-gap'>
				<PageTable
					columns={completeList}
					dataSource={list}
					rowKey='identifying'
					questAction={this.props.actions.getCompleteList}
					total={total}
					current={page}
					filterParams={filterParams}
					handlePageSize={this.handlePageSize}
				></PageTable>
			</div>
			<div>
				{newModalVisible ? <CompleteListModal
					visible={newModalVisible}
					title={keyMap[curKey]}
					curKey={key}
					record={record}
					orderType={order_type}
					postType={position_level}
					page={page}
					page_size={page_size}
					filterParams={filterParams}
					onCancel={this.handleOnCancel}
				></CompleteListModal> : null}
			</div>
		</div>
	}
}
const mapStateToProps = (state) => {
	return {
		completeData: state.saleIncome.completeData,
		saleMetadata: state.saleIncome.saleMetadata,

	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...completePercentActions, ...commonActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(CompletePercent)
