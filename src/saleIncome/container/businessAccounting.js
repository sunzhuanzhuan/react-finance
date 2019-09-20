import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Modal, message, Tabs, Button, Table, Row } from 'antd'
import * as businessAccountingActions from '../actions/businessAccounting'
import * as commonActions from '../actions/common'
import BusinessAccountingQuery from '../components/businessAccounting/listQuery'
import AccountingTable from '../components/businessAccounting/accountingTable'
import BusinessAccountingModal from '../components/businessAccounting/newModal'

import { tabListConfig, readyCheckFunc, businessAccountingListFunc } from '../constans'
import './saleIncome.less'
import difference from 'lodash/difference';
import numeral from 'numeral';

const TabPane = Tabs.TabPane;

class BusinessIncome extends React.Component {
	constructor() {
		super();
		this.state = {
			modalVisible: false,
			checkVisible: false,
			page_size: '20',
			filterParams: {},
			loading: false,
			currentTab: 1,
			dataPage: {
				1: { page: 1, page_size: 20 },
				2: { page: 1, page_size: 20 },
				3: { page: 1, page_size: 20 }
			},
			curSelectRowKeys: [],
			curSelectRows: [],
			rowsMap: {},
			is_batch: 2,
			ids: {}
		}
	}
	componentDidMount() {
		const { getBusinessToken } = this.props.actions;
		getBusinessToken();
		this.setState({ loading: true });
		this.props.actions.getBusinessAccountingList({ page: 1, page_size: 20, write_off_status: 1 }).then(() => {
			this.setState({ loading: false });
		}).catch(({ errorMsg }) => {
			message.error(errorMsg || '列表加载失败，请重试！');
			this.setState({ loading: false });
		})
	}
	handleDelete = (id) => {
		const { rowsMap } = this.state;
		let obj = { ...rowsMap };
		delete obj[id];
		let ary = Object.values(obj);
		let curSelectRowKeys = ary.map(item => item.id);
		this.setState({ curSelectRowKeys, curSelectRows: ary, rowsMap: obj });
	}
	handleClear = () => {
		this.setState({ curSelectRowKeys: [], curSelectRows: [], rowsMap: {} });
	}
	tabsChange = (write_off_status) => {
		this.setState({ loading: true, currentTab: write_off_status, curSelectRowKeys: [], curSelectRows: [], rowsMap: {} });
		const { dataPage, filterParams } = this.state;
		const page = dataPage[write_off_status] ? dataPage[write_off_status].page : 1;
		const page_size = dataPage[write_off_status] ? dataPage[write_off_status].page_size : 20;
		this.props.actions.getBusinessAccountingList({ page, page_size, write_off_status, ...filterParams }).then(() => {
			this.setState({
				loading: false,
				dataPage: { ...dataPage, [write_off_status]: { page, page_size } }
			});
		}).catch(({ errorMsg }) => {
			message.error(errorMsg || '列表加载失败，请重试！');
			this.setState({ loading: false });
		})
	}
	handleSelected = (selectedRowKeys, selectedRows) => {
		const { rowsMap } = this.state;
		let curKeys = [], rows = {};
		selectedRows.forEach(item => {
			curKeys.push(item.id);
			rows[item.id] = item;
		});
		let otherKeys = difference(selectedRowKeys, curKeys);
		otherKeys.forEach(item => rows[item] = rowsMap[item]);
		let rowsAry = Object.values(rows);
		this.setState({ curSelectRowKeys: selectedRowKeys, rowsMap: rows, curSelectRows: rowsAry });
	}
	handleVerify = (is_batch, ids) => {
		this.setState({ modalVisible: true, is_batch, ids });
	}
	render() {
		const { modalVisible, checkVisible, filterParams, loading, currentTab, dataPage, curSelectRowKeys, curSelectRows, is_batch, ids, rowsMap } = this.state;
		const { accountingData: { total }, businessToken } = this.props;
		const list = this.props.accountingData[currentTab];
		const accountingList = businessAccountingListFunc(currentTab, this.handleVerify);
		const readyList = readyCheckFunc(this.handleDelete);
		const valueAry = Object.values(rowsMap).map(item => item.not_write_off_amount * 100);
		const price = valueAry.length > 1 ? numeral(valueAry.reduce((prev, cur) => prev + cur) / 100).format('0.00') : numeral(valueAry[0] / 100).format('0.00');
		return <div className='bussiness-accounting-list'>
			<fieldset className='fieldset_css'>
				<legend>查询</legend>
				<BusinessAccountingQuery
					page={dataPage[currentTab] ? dataPage[currentTab].page : 1}
					page_size={dataPage[currentTab] ? dataPage[currentTab].page_size : 20}
					currentTab={currentTab}
					handlefilterParams={(filterParams) => { this.setState({ filterParams }) }}
					handleDataPage={(currentTab, page, page_size) => { this.setState({ dataPage: { ...dataPage, [currentTab]: { page, page_size } } }) }}
					handleClear={this.handleClear}
				></BusinessAccountingQuery>
			</fieldset>
			<fieldset className='fieldset_css'>
				<legend>统计</legend>
				<div className='left-gap'>
					已选记录:<span className='red-font' style={{ marginLeft: '10px' }}>{curSelectRowKeys ? curSelectRowKeys.length : 0}</span>个
					<span style={{ marginLeft: '10px' }}>|</span>
					<span className='red-font' style={{ marginLeft: '10px' }}>{price || 0.00}</span>元
					<Button className='left-gap' type="primary" onClick={() => { this.setState({ checkVisible: true }) }}>查看已选</Button>
				</div>
			</fieldset>
			<div className='top-gap'>
				<Tabs type="card" onChange={this.tabsChange}>
					{tabListConfig.map(item => {
						return <TabPane tab={item.title} key={item.key}>
							<AccountingTable columns={accountingList} dataSource={list} loading={loading}
								currentTab={item.key}
								filterParams={filterParams}
								total={parseInt(total)}
								page={dataPage[currentTab] ? dataPage[currentTab].page : 1}
								page_size={dataPage[currentTab] ? dataPage[currentTab].page_size : 20}
								handlePageSize={(page_size) => { this.setState({ page_size }) }}
								handleLoading={() => { this.setState({ loading: true }) }}
								onCancelLoading={() => { this.setState({ loading: false }) }}
								handleDataPage={(currentTab, page, page_size) => { this.setState({ dataPage: { ...dataPage, [currentTab]: { page, page_size } } }) }}
								curSelectRowKeys={curSelectRowKeys}
								curSelectRows={curSelectRows}
								handleSelected={this.handleSelected}
							></AccountingTable>
						</TabPane>
					})}
				</Tabs>
			</div>
			{currentTab != 2 ? <div>
				<Row>
					<Button className='top-gap' type='primary' disabled={!(curSelectRowKeys && curSelectRowKeys.length)} onClick={() => {
						let obj = {};
						curSelectRows.forEach(item => obj[item.id] = { price: item.not_write_off_amount, attachment: item.attachment });
						if (curSelectRowKeys && curSelectRowKeys.length <= 1) {
							this.setState({ modalVisible: true });
							this.handleVerify(2, obj);
							return
						}
						this.setState({ modalVisible: true, is_batch: 1 });
						this.handleVerify(1, obj);
					}}>批量核销</Button>
				</Row>
			</div> : null}
			<div>
				{modalVisible ? <BusinessAccountingModal
					visible={modalVisible}
					currentTab={currentTab}
					businessToken={businessToken}
					is_batch={is_batch}
					ids={ids}
					handleIdsClear={() => { this.setState({ ids: {} }) }}
					page={dataPage[currentTab].page}
					page_size={dataPage[currentTab].page_size}
					filterParams={filterParams}
					dataSource={list}
					onCancel={() => { this.setState({ modalVisible: false }) }}
					handleLoading={() => { this.setState({ loading: true }) }}
					onCancelLoading={() => { this.setState({ loading: false }) }}
					handleClear={this.handleClear}
				></BusinessAccountingModal> : null}
			</div>
			<div>
				<CheckModal checkVisible={checkVisible} columns={readyList} dataSource={curSelectRows}
					handleClear={this.handleClear}
					onCancel={() => { this.setState({ checkVisible: false }) }}
				/>
			</div>
		</div>
	}
}
const mapStateToProps = (state) => {
	return {
		accountingData: state.saleIncome.accountingData,
		businessToken: state.saleIncome.businessToken
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...businessAccountingActions, ...commonActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(BusinessIncome)

function CheckModal(props) {
	return <Modal
		visible={props.checkVisible}
		width={800}
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
