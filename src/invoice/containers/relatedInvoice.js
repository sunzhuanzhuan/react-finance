import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as trinityInvoiceAction from "../actions/trinityInvoice";
import getPagination from '../../components/pagination'
import Statistics from '../components/Statistics'
import { Table, message, Button, Icon } from 'antd'
import { relatedInvoiceFunc } from '../constants/relatedInvoice'
import './trinityInvoice.less'
import qs from 'qs'
import numeral from 'numeral'

class RelatedInvoice extends React.Component {
	constructor() {
		super();
		this.state = {
			loading: false,
		}
	}
	componentDidMount() {
		this.queryData();
	}
	queryData = (obj, func) => {
		const search = qs.parse(this.props.location.search.substring(1));
		this.setState({ loading: true });
		return this.props.actions.getRelatedInvoiceData({
			record_id: search.payment_slip_id,
			...obj
		}).then(() => {
			if (func && Object.prototype.toString.call(func) === '[object Function]') {
				func();
			}
			this.setState({ loading: false })
		}).catch(({ errorMsg }) => {
			this.setState({ loading: false });
			message.error(errorMsg || '列表加载失败，请重试！');
		})
	}
	handleDel = id => {
		this.props.actions.postDeleteInvoiceRelate({ id }).then(() => {
			message.success('删除成功', 2);
			this.queryData();
		})
	}
	handleBack = () => {
		const search = qs.parse(this.props.location.search.substring(1));
		if (search.payment_status == 'pre') {
			this.props.history.push({
				pathname: '/finance/trinityPay/prePay'
			})
		} else {
			this.props.history.push({
				pathname: '/finance/trinityPay/datePay'
			})
		}
	}
	render() {
		const search = qs.parse(this.props.location.search.substring(1));
		const { loading } = this.state;
		const { relatedInvoiceData: { list = [], page, page_size = 20, total, statistic } } = this.props;
		const relatedInvoiceCols = relatedInvoiceFunc(this.handleDel);
		const paginationObj = getPagination(this, search, { total, page, page_size });
		return <div className='relatedInvoice-container'>
			<legend className='container-title'>
				<span onClick={this.handleBack}>
					<Icon type="left-circle-o" style={{ cursor: 'pointer', marginRight: '20px' }} />
					<span className="title" style={{ cursor: 'pointer' }}>关联发票</span>
				</span>


			</legend>
			<Statistics title={'统计项'} render={Stat(search, statistic)} />
			<div className='top-gap'>
				<Table
					rowKey='id'
					loading={loading}
					columns={relatedInvoiceCols}
					dataSource={list}
					bordered
					pagination={total > page_size ? paginationObj : false}
				/>
			</div>
		</div>
	}
}

const mapStateToProps = (state) => {
	return {
		relatedInvoiceData: state.invoice.relatedInvoiceData,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...trinityInvoiceAction }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(RelatedInvoice)
function Stat(search, statistic) {
	return <div style={{ padding: '0 10px' }}>
		<span className='left-gap'>应回发票金额：<span className='red-font little-left-gap'>{statistic && numeral(statistic.return_invoice_amount).format('0,0.00')}</span>元</span>
		<span className='left-gap'>已关联发票金额：<span className='red-font little-left-gap'>{statistic && numeral(statistic.relation_amount).format('0,0.00')}</span>元</span>
		<span className='left-gap'>还需发票金额：<span className='red-font little-left-gap'>{statistic && numeral(statistic.invoice_surplus).format('0,0.00')}</span>元</span>
		<Button className='left-gap' type='primary' href={`/finance/invoice/relatedChooseInvoice?payment_slip_id=${search.payment_slip_id}&payment_status=${search.payment_status}`}>选择发票</Button>
	</div>
}
