import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as remitOrderActions from "../action/remitOrder";
import { Link } from 'react-router-dom'
import { WBYTableFooter } from "wbyui";
import "../containers/remitOrder.less";
import { Button, Table } from "antd";
import qs from 'qs';

class ReceiptsTable extends React.Component {
	constructor() {
		super();
		this.state = {
			curSelectRowKeys: [],
			curSelectRows: []
		}
	}
	onCheckAllChange = e => {
		let { check_receipts } = this.props.remitOrder;
		let { current_tab } = this.props;
		let rowKeys = e.target.checked ? check_receipts[current_tab].data.map(item => item.identifier) : [];
		let rows = e.target.checked ? check_receipts[current_tab].data : [];
		this.setState({ curSelectRowKeys: rowKeys, curSelectRows: rows });
	}
	render() {
		let { columns, dataSource, loading, questParams, current_tab } = this.props;
		let { curSelectRowKeys, curSelectRows } = this.state;
		let { check_receipts } = this.props.remitOrder;
		let paginationObj = {
			onChange: (current) => {
				this.props.actions.getBillList({ page: current, status: questParams.status, id: questParams.id, status_type: current_tab })
			},
			total: check_receipts[current_tab] ? check_receipts[current_tab].total : 10,
			current: check_receipts[current_tab] ? check_receipts[current_tab].current_page : 1,
			pageSize: check_receipts[current_tab] ? check_receipts[current_tab].per_page : 20,
			showQuickJumper: true,
		};
		let rowSelectionObj = {
			selectedRowKeys: this.state.curSelectRowKeys,
			onChange: (selectedRowKeys, selectedRows) => {
				this.setState({ curSelectRowKeys: selectedRowKeys, curSelectRows: selectedRows })
			},
		}
		return <Table rowKey={record => record.identifier} columns={columns} dataSource={dataSource}
			loading={loading}
			pagination={false}
			rowSelection={rowSelectionObj}
			footer={() => {
				return <WBYTableFooter
					plainOptions={dataSource}
					selectedRowKeys={curSelectRowKeys}
					onChange={this.onCheckAllChange}
					title={'全选'}
					pagination={paginationObj}
				>
					<Link style={{ marginLeft: '20px' }} target='_blank' replace to={{
						pathname: '/finance/remitOrder/paymentOrder',
						search: '?' + qs.stringify({ id: questParams.id, bill_params: curSelectRows }),
					}}>
						<Button type='default' disabled={curSelectRowKeys.length === 0}>预览</Button>
					</Link>
				</WBYTableFooter >
			}}
		>
		</Table>
	}
}
const mapStateToProps = (state) => {
	return {
		remitOrder: state.withdraw.remitOrder
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...remitOrderActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(ReceiptsTable)
