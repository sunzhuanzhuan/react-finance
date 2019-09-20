import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Modal, message } from 'antd'
import * as missionListActions from '../actions/missionList'
import * as commonActions from '../actions/common'
import MissionListQuery from '../components/missionList/listQuery'
import PageTable from '../components/pageTable'
import MissionListModal from '../components/missionList/newModal'
import { missionListFunc } from '../constans'
import './saleIncome.less'

class MissionList extends React.Component {
	constructor() {
		super();
		this.state = {
			newModalVisible: false,
			curKey: '',
			keyMap: { 'new': '新增任务指标', 'check': '查看任务指标', 'mod': '修改任务指标' },
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
		const { missionData: { list, page } } = this.props;
		Modal.confirm({
			content: '是否确认删除？',
			onOk: () => {
				this.props.actions.postDeleteMission({ id }).then(() => {
					message.success('删除成功');
					if (list.length === 1) {
						this.props.actions.getMissionList({ ...filterParams, page: page - 1, page_size });
						return
					}
					this.props.actions.getMissionList({ ...filterParams, page, page_size });
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
		const { missionData: { list, total, page }, saleMetadata: { region = [] }, saleName } = this.props;
		const saleNameList = Object.values(saleName);
		const missionList = missionListFunc(this.handleNewModal, this.handleDelete, saleNameList, region);
		const key = Object.keys(record).length > 0 ? `${curKey}_${record.id}` : 'new';
		return <div className='sale-mission-list'>
			<fieldset className='fieldset_css'>
				<legend>查询</legend>
				<MissionListQuery
					region={region}
					nameList={saleNameList}
					page_size={page_size}
					questAction={this.props.actions.getMissionList}
					handlefilterParams={this.handlefilterParams}
					handleNew={this.handleNewModal}
				></MissionListQuery>
			</fieldset>
			<div className='top-gap'>
				<PageTable
					columns={missionList}
					dataSource={list}
					rowKey='id'
					questAction={this.props.actions.getMissionList}
					total={total}
					current={page}
					filterParams={filterParams}
					handlePageSize={this.handlePageSize}
				></PageTable>
			</div>
			<div>
				{newModalVisible ? <MissionListModal
					region={region}
					visible={newModalVisible}
					title={keyMap[curKey]}
					curKey={key}
					record={record}
					page={page}
					page_size={page_size}
					filterParams={filterParams}
					onCancel={this.handleOnCancel}
				></MissionListModal> : null}
			</div>
		</div>
	}
}
const mapStateToProps = (state) => {
	return {
		missionData: state.saleIncome.missionData,
		saleName: state.saleIncome.saleName,
		saleMetadata: state.saleIncome.saleMetadata,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...missionListActions, ...commonActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(MissionList)
