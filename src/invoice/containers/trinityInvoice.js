import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as trinityInvoiceAction from "../actions/trinityInvoice";
import SearForm from '../../components/SearchForm'
import getPagination from '../../components/pagination'
import Statistics from '../components/Statistics'
import TrinityInvoiceModal from '../components/trinityInvoiceModal'
import { WBYDetailTable } from "wbyui"
import { Table, message, Button, Modal } from 'antd'
import { trinityInvoiceSearchFunc } from '../constants/search'
import { trinityInvoiceFunc, checkModalCols } from '../constants/trinityInvoice'
import './trinityInvoice.less'
import qs from 'qs'
import numeral from 'numeral'

class TrinityInvoice extends React.Component {
	constructor() {
		super();
		this.state = {
			loading: false,
			pullReady: false,
			checkVisible: false,
			modalVisible: false,
			status: undefined,
			record: undefined,
			modType: undefined
		}
	}
	componentDidMount() {
		const search = qs.parse(this.props.location.search.substring(1));
		this.props.actions.getTrinityInvoiceSearchItem().then(() => {
			this.setState({ pullReady: true });
		}).catch(({ errorMsg }) => {
			message.error(errorMsg || '下拉项加载失败，请重试！');
		})
		this.queryData({ ...search.keys });
	}
	queryData = (obj, func) => {
		this.setState({ loading: true });
		return this.props.actions.getTrinityInvoiceData({ business_account_type: 3, ...obj }).then(() => {
			if (func && Object.prototype.toString.call(func) === '[object Function]') {
				func();
			}
			this.setState({ loading: false })
		}).catch(({ errorMsg }) => {
			this.setState({ loading: false });
			message.error(errorMsg || '列表加载失败，请重试！');
		})
	}
	handleModal = (status, modalVisible, record, modType) => {
		this.setState({ status, modalVisible, record, modType })
	}
	handleCheckModal = (checkVisible, record) => {
		this.setState({ checkVisible, record })
	}
	handleDelete = invoice_id => {
		const search = qs.parse(this.props.location.search.substring(1));
		Modal.confirm({
			title: '',
			content: `确认删除？`,
			onOk: () => {
				const hide = message.loading('操作中，请稍候...');
				this.props.actions.postTrinityInvoiceDel({ invoice_id }).then(() => {
					hide();
					message.success('操作成功', 2);
					this.queryData({ ...search.keys });
				}).catch(({ errorMsg }) => {
					message.error(errorMsg || '操作成功，请重试！', 2);
				})
			}
		})
	}
	handleExport = () => {
		const data = this.form.getFieldsValue();
		const obj = {};
		for (let [key, value] of Object.entries(data)) {
			if (typeof value === 'string') obj[key] = value.trim();
			if (typeof value === 'object') {
				if (value.key) obj[key] = value.key;
				else obj[key] = value.format('YYYY-MM-DD');
			}
		}
		window.open(`/api/trinity/publicInvoice/export?${qs.stringify({
			...obj
		})}`);
	}
	render() {
		const search = qs.parse(this.props.location.search.substring(1));
		const { loading, pullReady, modalVisible, checkVisible, status, modType, record } = this.state;
		const { trinityInvoiceData: { list = [], page, page_size = 20, total, statistic }, trinityInvoiceSearchItem } = this.props;
		const trinityInvoiceSearch = trinityInvoiceSearchFunc(trinityInvoiceSearchItem);
		const trinityInvoiceCols = trinityInvoiceFunc(this.handleModal, this.handleCheckModal, this.handleDelete);
		const paginationObj = getPagination(this, search, { total, page, page_size });
		return <div className='trinityInvoice-container'>
			<Statistics title={'三方平台发票管理'} render={Stat(total, statistic)} />
			<fieldset className='fieldset_css'>
				<legend>查询</legend>
				{pullReady && <SearForm data={trinityInvoiceSearch} getAction={this.queryData} responseLayout={{ xs: 24, sm: 24, md: 10, lg: 8, xxl: 6 }} beforeFooter={<Button type='primary' style={{ marginRight: 20 }} onClick={() => { this.handleModal('new', true, undefined, undefined) }}>新增发票</Button>} extraFooter={<Button type='primary' style={{ marginLeft: 20 }} onClick={this.handleExport}>导出</Button>} wrappedComponentRef={form => this.form = form} />}
			</fieldset>
			<div className='top-gap'>
				<Table
					rowKey='invoice_id'
					loading={loading}
					columns={trinityInvoiceCols}
					dataSource={list}
					bordered
					pagination={total > page_size ? paginationObj : false}
				/>
			</div>
			{modalVisible ? <TrinityInvoiceModal
				key={status}
				visible={modalVisible}
				page={page}
				status={status}
				modType={modType}
				record={record}
				queryAction={this.queryData}
				search={search}
				onCancel={() => {
					this.handleModal(undefined, false, undefined, undefined)
				}}
				SearchItem={trinityInvoiceSearchItem}
			/> : null}
			{checkVisible ? <CheckModal visible={checkVisible} record={record} onCancel={() => {
				this.handleCheckModal(false, undefined)
			}} /> : null}
		</div>
	}
}

const mapStateToProps = (state) => {
	return {
		trinityInvoiceData: state.invoice.trinityInvoiceData,
		trinityInvoiceSearchItem: state.invoice.trinityInvoiceSearchItem,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...trinityInvoiceAction }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(TrinityInvoice)

function Stat(total, statistic) {
	return <div style={{ padding: '0 10px' }}>
		<span>当前筛选条件下发票数：<span className='red-font little-left-gap'>{total}</span>条</span>
		<span className='left-gap'>发票总金额：<span className='red-font little-left-gap'>{statistic && numeral(statistic.total_invoice_amount).format('0,0.00')}</span>元</span>
		<span className='left-gap'>发票金额：<span className='red-font little-left-gap'>{statistic && numeral(statistic.total_invoice_pure_amount).format('0,0.00')}</span>元</span>
		<span className='left-gap'>发票税额：<span className='red-font little-left-gap'>{statistic && numeral(statistic.total_invoice_tax_amount).format('0,0.00')}</span>元</span>
	</div>
}
function CheckModal({ visible, onCancel, record }) {
	return <Modal
		wrapClassName='prePay-modal'
		key='check'
		width={800}
		title='发票信息'
		visible={visible}
		maskClosable={false}
		onCancel={onCancel}
		footer={[
			<Button key="back" onClick={onCancel}>返回</Button>
		]}
	>
		<WBYDetailTable isFilterZero={false} className='vertical-table' columns={checkModalCols} dataSource={record} columnCount={4} ></WBYDetailTable>
	</Modal>
}

