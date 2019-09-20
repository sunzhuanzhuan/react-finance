import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Table, message } from "antd";
import * as businessAccountingActions from '../../actions/businessAccounting';
import { WBYTableFooter } from "wbyui";
import difference from 'lodash/difference';

class AccountingTable extends React.Component {
	constructor() {
		super();
		this.state = {
			pageSizeOptions: ['20', '50', '100', '200']
		}
	}
	onCheckAllChange = e => {
		const { curSelectRowKeys, dataSource, handleSelected } = this.props;
		let ary = dataSource.map(item => item.id);
		let rowKeys = difference(curSelectRowKeys, ary);
		let rows, curRowKeys;
		if (e.target.checked) {
			curRowKeys = rowKeys.concat(ary);
			rows = dataSource;
		} else {
			curRowKeys = rowKeys;
			rows = [];
		}
		handleSelected(curRowKeys, rows);
	}
	render() {
		const { pageSizeOptions } = this.state;
		const {
			columns,
			dataSource = [],
			page = 1,
			page_size = 20,
			total = 20,
			filterParams,
			currentTab,
			loading,
			handlePageSize,
			handleLoading,
			onCancelLoading,
			handleDataPage,
			curSelectRowKeys,
			curSelectRows,
			handleSelected
		} = this.props;
		let ary = dataSource.map(item => item.id);
		let flag = ary.every(item => curSelectRowKeys && curSelectRowKeys.includes(item));
		let curAry = curSelectRows.map(item => item.id);
		let newAry = ary.filter(item => curAry.includes(item));
		let paginationObj = {
			onChange: (current) => {
				handleLoading();
				handleDataPage(currentTab, current, page_size);
				this.props.actions.getBusinessAccountingList({ page: current, page_size, write_off_status: currentTab, ...filterParams }).then(() => {
					onCancelLoading();
				}).catch(({ errorMsg }) => {
					message.error(errorMsg || '列表加载失败，请重试！');
					onCancelLoading();
				});
			},
			onShowSizeChange: (current, pageSize) => {
				handleLoading();
				handlePageSize(pageSize);
				let curPage;
				if (total / pageSize < current) {
					curPage = Math.ceil(total / pageSize);
				} else {
					curPage = current;
				}
				handleDataPage(currentTab, curPage, pageSize);
				this.props.actions.getBusinessAccountingList({ page: curPage, page_size: pageSize, write_off_status: currentTab, ...filterParams }).then(() => {
					onCancelLoading();
				}).catch(({ errorMsg }) => {
					message.error(errorMsg || '列表加载失败，请重试！');
					onCancelLoading();
				});
			},
			total,
			current: page,
			pageSize: page_size,
			showQuickJumper: true,
			showSizeChanger: true,
			pageSizeOptions
		};
		let rowSelectionObj = {
			selectedRowKeys: curSelectRowKeys,
			onChange: (selectedRowKeys, selectedRows) => {
				handleSelected(selectedRowKeys, selectedRows);
			},
		}
		return <Table
			rowKey='id'
			columns={columns}
			dataSource={dataSource}
			loading={loading}
			bordered
			pagination={currentTab == 2 ? paginationObj : false}
			rowSelection={currentTab != 2 ? rowSelectionObj : null}
			footer={currentTab != 2 ? () => {
				return <WBYTableFooter
					plainOptions={dataSource}
					selectedRowKeys={flag ? ary : newAry}
					onChange={this.onCheckAllChange}
					title={'全选'}
					pagination={dataSource.length ? paginationObj : false}
				/>
			} : null}
		>
		</Table>
	}
}

const mapStateToProps = () => {
	return {
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...businessAccountingActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(AccountingTable)
