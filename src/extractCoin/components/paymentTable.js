import React from 'react'

class PaymentTable extends React.Component {
	render() {
		let { dataSource } = this.props;
		return <table className="paymentOrder t_main" cellSpacing="0px" style={{ borderCollapse: 'collapse' }} cellPadding="3">
			<caption>自营付款单</caption>
			<thead></thead>
			<tfoot></tfoot>
			<tbody>
				<tr><th width="25%">付款公司</th><td colSpan="2">{dataSource.payer}</td></tr>
				<tr>
					<th>日期</th>
					<td colSpan="2">{dataSource.date_time}</td>
				</tr>
				<tr><th>申请人</th><td colSpan="2">{dataSource.admin_name}</td></tr>
				<tr><th>申请金额</th><td colSpan="2">{dataSource.amount}</td></tr>
				<tr>
					<th rowSpan="4">收款方信息</th>
					<th width="25%">真实姓名：</th><td>{dataSource.real_name}</td></tr>
				<tr><th>开户行：</th><td>{dataSource.bank_agency}</td></tr>
				<tr><th>支付方式：</th><td>{dataSource.payment_type}</td></tr>
				<tr><th>卡号：</th><td>{dataSource.card_number}</td></tr>
				<tr><th height="20%">用途</th><td colSpan="2">{dataSource.uses}</td></tr>
				<tr><th>批准人</th><td colSpan="2">{dataSource.approver_one}</td></tr>
				<tr><th>批准人</th><td colSpan="2">{dataSource.approver_two}</td></tr>
				<tr><th>复核人</th><td colSpan="2"></td></tr>
				<tr><th>复核人</th><td colSpan="2"></td></tr>
				<tr><th>付款人</th><td colSpan="2"></td></tr>
			</tbody>
		</table>
	}
}

export default PaymentTable
