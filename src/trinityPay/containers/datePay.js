import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as trinityPayAction from "../actions";
import SearForm from '../../components/SearchForm'
import Statistics from '../components/Statistics'
import DateModal from '../components/modal'
import getPagination from '../../components/pagination'
import { Table, message, Button } from 'antd'
import { datePaySearchFunc } from '../constants/search'
import { datePayFunc } from '../constants'
import Scolltable from '../../components/Scolltable'
import qs from 'qs'
import './trinityPay.less'
class DatePay extends React.Component {
	constructor() {
		super();
		this.state = {
			loading: false,
			pullReady: false,
			modalVisible: false,
			status: undefined,
			id: undefined,
			cooperation_platform_id: undefined,
			agent: []

		}
	}
	componentDidMount() {
		const search = qs.parse(this.props.location.search.substring(1));
		this.props.actions.getPaySearchItem().then(() => {
			this.setState({ pullReady: true });
		}).catch(({ errorMsg }) => {
			message.error(errorMsg || '下拉项加载失败，请重试！');
		})
		this.queryData({ page: 1, page_size: 20, ...search.keys });
	}
	handleFetchPlatform = () => {
		const value = this.form.getFieldValue('cooperation_platform_id');
		if (!value) {
			message.error('请先选择三方下单平台');
			return
		}
		const value1 = this.form.getFieldValue('cooperation_platform_id').key;
		if (value1 != this.state.cooperation_platform_id) {
			this.props.actions.getAgentListByCPId({ cooperation_platform_id: value1 }).then(res => {
				this.setState({ cooperation_platform_id: value1, agent: res.data })
			})
		}
	}
	queryData = (obj, func) => {
		this.setState({ loading: true });
		return this.props.actions.getDatePayData({ ...obj, settle_type: 2 }).then(() => {
			if (func && Object.prototype.toString.call(func) === '[object Function]') {
				func();
			}
			this.setState({ loading: false })
		}).catch(({ errorMsg }) => {
			this.setState({ loading: false });
			message.error(errorMsg || '列表加载失败，请重试！');
		})
	}
	handleModal = (id, status, boolean) => {
		this.setState({ id, status, modalVisible: boolean });
	}
	handleExport = () => {
		message.loading('导出中,请稍候...', 3);
		const data = this.form.getFieldsValue();
		const obj = {};
		for (let [key, value] of Object.entries(data)) {
			if (typeof value === 'string') obj[key] = value.trim();
			if (typeof value === 'object') {
				if (value.key) obj[key] = value.key;
				else obj[key] = value.format('YYYY-MM-DD');
			}
		}
		window.open(`/api/trinity/publicPaymentSlip/exportPublicPaymentSlip?${qs.stringify({
			settle_type: 2,
			...obj
		})}`);
	}
	render() {
		const search = qs.parse(this.props.location.search.substring(1));
		const { loading, pullReady, modalVisible, id, status, agent } = this.state;
		const { datePayData: { list = [], page, page_size = 20, total, statistic }, paySearchItem } = this.props;
		const datePaySearch = datePaySearchFunc(paySearchItem, agent, this.handleFetchPlatform);
		const datePayCols = datePayFunc(this.handleModal);
		const paginationObj = getPagination(this, search, { total, page, page_size });
		return <div className='datePay-container'>
			<Statistics title={'三方平台周期打款单'} render={Stat(total, statistic)} />
			<fieldset className='fieldset_css'>
				<legend>查询</legend>
				{pullReady && <SearForm data={datePaySearch} getAction={this.queryData} responseLayout={{ xs: 24, sm: 24, md: 10, lg: 8, xxl: 6 }} extraFooter={<Button type='primary' style={{ marginLeft: 20 }} onClick={this.handleExport}>导出</Button>} wrappedComponentRef={form => this.form = form} />}
			</fieldset>
			<div className='top-gap'>
				<Scolltable scrollClassName='.ant-table-body' widthScroll={1700}>
					<Table
						rowKey='payment_slip_id'
						loading={loading}
						columns={datePayCols}
						dataSource={list}
						bordered
						scroll={{ x: 1500 }}
						pagination={paginationObj}
					/>
				</Scolltable>
			</div>
			{modalVisible ? <DateModal
				key={status}
				visible={modalVisible}
				id={id}
				page={page}
				status={status}
				type={'datePay'}
				queryAction={this.queryData}
				search={search}
				onCancel={() => {
					this.handleModal(undefined, false)
				}}
			/> : null}
		</div>
	}
}

const mapStateToProps = (state) => {
	return {
		datePayData: state.trinityPay.datePayData,
		paySearchItem: state.trinityPay.paySearchItem,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...trinityPayAction }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(DatePay)
function Stat(total, statistic) {
	return <div style={{ padding: '0 10px' }}>
		<span>当前筛选条件下共<span className='red-font little-left-gap'>{total}</span>条</span>
		<span className='left-gap'>待打款金额：<span className='red-font little-left-gap'>{statistic && statistic.unpaid_amount_total}</span>元</span>
		<span className='left-gap'>已打款金额：<span className='red-font little-left-gap'>{statistic && statistic.paid_amount_total}</span>元</span>
		<span className='left-gap'>应回发票金额：<span className='red-font little-left-gap'>{statistic && statistic.return_invoice_amount_total}</span>元</span>
		<span className='left-gap'>发票盈余：<span className='red-font little-left-gap'>{statistic && statistic.invoice_surplus_total}</span>元</span>
	</div>
}
