import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as remitOrderActions from "../action/remitOrder";
import "./paymentOrder.less";
import PaymentTable from '../components/paymentTable'
import { billingPartner, billingStatus } from '../constans/constant'
import { message } from "antd";
import qs from 'qs';


/** 纯函数组件
 * data.partner_type == 4 && search.status == 0 && search.status_type == 1
 * data.partner_type == 4 && search.status == 2
 * 以上两种情况下显示'工作室'及对应字段
 * 其余显示'主账号'及对应字段
 * @param {*} { data, search } data:obj  search:url
 * @returns
 */
const Pageps = ({ data, search }) => {
	const defaultStr = (data) => {
		{ /* 
			isA合作方式是工作室 状态为待打款 待打款状态为待还款
			isB合作方式是工作室 状态为待结税
		*/}
		const isA = data.partner_type == billingPartner.WORK_WITH_STUDIO && search.status == billingStatus.AWAIT_REMIT && search.status_type == 1;
		const isB = data.partner_type == billingPartner.WORK_WITH_STUDIO && search.status == billingStatus.AWAIT_OVER_TAX;

		let defaultStr = '主账号:' + data.user_name;
		if (isA || isB) {
			defaultStr = '工作室:' + data.real_name;
		}
		return defaultStr;
	}
	return <div className="pageps">
		序号:{data.serial_number}；
        {defaultStr(data)}；
		流水号:{data.payment_slip_id}；
        合作方类型:{data.partner_type_name}；
		快易提ID:{data.withdraw_ids}
	</div>
}

class PaymentOrder extends React.Component {
	constructor() {
		super();
		this.state = {
		}
	}
	componentDidMount() {
		const hide = message.loading('请求数据中，请稍候...');
		const search = this.props.location.search.substring(1);
		this.props.actions.paymentOrderDetail(search).then(() => {
			hide();
		}).catch(({ errorMsg }) => {
			hide();
			message.error(errorMsg || '请求出错，请重试！');
		});
	}
	render() {
		let { payment_order_detail } = this.props.remitOrder;
		const search = qs.parse(this.props.location.search.substring(1));
		return <div className='payment-order-container'>
			{payment_order_detail ? payment_order_detail.map((item, index) => {
				return <div className='page' key={index}>
					<PaymentTable dataSource={item}></PaymentTable>
					<Pageps data={item} search={search}></Pageps>
				</div>
			}) : null}
		</div>
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
export default connect(mapStateToProps, mapDispatchToProps)(PaymentOrder)
