import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as trinityInvoiceAction from "../actions/trinityInvoice";
import getPagination from '../../components/pagination'
import SearForm from '../../components/SearchForm'
import { Table, Modal, message, Button, Form, Icon } from 'antd'
import { relatedInvoiceSearchFunc } from '../constants/search'
import { availableInvoiceFunc } from '../constants/relatedInvoice'
import './trinityInvoice.less'
import qs from 'qs'
import numeral from 'numeral'


class RelatedChooseInvoice extends React.Component {
	constructor() {
		super();
		this.state = {
			isClick: false,
			pullReady: false,
			loading: false,
			selectedRowKeys: [],
			rowsMap: {}
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
		const search = qs.parse(this.props.location.search.substring(1));
		this.setState({ loading: true });
		return this.props.actions.getAvailableInvoiceData({
			record_id: search.payment_slip_id,
			...obj
		}).then(() => {
			if (func && Object.prototype.toString.call(func) === '[object Function]') {
				func();
			}
			this.setState({ loading: false, selectedRowKeys: [], rowsMap: {} })
		}).catch(({ errorMsg }) => {
			this.setState({ loading: false });
			message.error(errorMsg || '列表加载失败，请重试！');
		})
	}
	handleSelected = (selectedRowKeys, selectedRows) => {
		let rowsMap = selectedRows.reduce((data, current) => {
			return { ...data, [current.invoice_id.toString()]: current }
		}, {});
		this.setState({ selectedRowKeys, rowsMap })
	}
	handleSubmit = () => {
		const search = qs.parse(this.props.location.search.substring(1));
		const { rowsMap } = this.state;
		const relations = Object.values(rowsMap).map(item => ({ invoice_id: item.invoice_id, use_amount: item.price }));
		if (!relations.length) {
			Modal.error({
				content: '请先勾选发票！'
			});
			return
		}
		this.props.actions.postAddRelation({
			relations,
			record_id: search.payment_slip_id
		}).then(() => {
			Modal.success({
				content: '发票关联成功！',
				onOk: close => {
					close();
					this.props.history.push(`/finance/invoice/relatedInvoice?payment_slip_id=${search.payment_slip_id}`);
				}
			})
		}).catch(({ errorMsg }) => {
			Modal.error({
				content: errorMsg || '操作失败，请重试！'
			});
		})
	}
	handleBack = () => {
		const search = qs.parse(this.props.location.search.substring(1));
		this.props.history.push({
			pathname: '/finance/invoice/relatedInvoice',
			search: '?' + qs.stringify(search)
		})
	}
	render() {
		const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
		const search = qs.parse(this.props.location.search.substring(1));
		const { isClick, loading, pullReady, selectedRowKeys, rowsMap } = this.state;
		const { availableInvoiceData: { list = [], page, page_size = 20, total }, relatedInvoiceSearchItem } = this.props;
		const relatedInvoiceSearch = relatedInvoiceSearchFunc(relatedInvoiceSearchItem);
		const availableInvoiceCols = availableInvoiceFunc(getFieldDecorator, this.handleSelected, rowsMap, selectedRowKeys);
		const totalPrice = Object.values(rowsMap).reduce((data, current) => data + parseFloat(current.price), 0);
		const paginationObj = getPagination(this, search, { total, page, page_size });
		const rowSelectionObj = {
			selectedRowKeys: selectedRowKeys,
			onChange: (selectedRowKeys, selectedRows) => {
				const oldValue = this.state.selectedRowKeys.filter(item => !selectedRowKeys.includes(item)).toString();

				if (oldValue) {
					setFieldsValue({ [`${oldValue}.price`]: '' });
				}

				if (selectedRowKeys.length == 0) {
					this.props.form.resetFields()
					this.handleSelected(selectedRowKeys, []);
				} else {
					const ary = selectedRows.map(item => {
						const price = getFieldValue(`${item.invoice_id}.price`);
						if (!price) {
							setFieldsValue({ [`${item.invoice_id}.price`]: item.rest_amount })
						}
						return { ...item, price: getFieldValue(`${item.invoice_id}.price`) }
					});
					this.handleSelected(selectedRowKeys, ary);
				}

			},
			getCheckboxProps: record => ({
				disabled: record.rest_amount == '0.00',
			}),
		}
		return <div className='relatedChoose-container'>
			<legend className='container-title'>
				<span onClick={this.handleBack}>
					<Icon type="left-circle-o" style={{ cursor: 'pointer', marginRight: '20px' }} />
					<span className="title" style={{ cursor: 'pointer' }}>选择发票</span>
				</span>
			</legend>
			{pullReady && <SearForm data={relatedInvoiceSearch} getAction={this.queryData} responseLayout={{ xs: 24, sm: 12, md: 8, lg: 6, xxl: 6 }} />}
			<div className='top-gap'>
				<Form>
					<Table
						rowKey={record => record.invoice_id.toString()}
						loading={loading}
						columns={availableInvoiceCols}
						dataSource={list}
						bordered
						pagination={total > page_size ? paginationObj : false}
						rowSelection={rowSelectionObj}
						footer={() => {
							return <span className='left-gap'>已选发票金额：<span className='red-font'>{numeral(totalPrice).format('0,0.00') || '-'}</span></span>
						}}
					/>
				</Form>
			</div>
			<div className='top-gap' style={{ textAlign: 'center' }}>
				<Button type='primary' onClick={this.handleSubmit}>确定</Button>
				<Button type='primary' className='left-gap' href={`/finance/invoice/relatedInvoice?payment_slip_id=${search.payment_slip_id}`}>取消</Button>
			</div>
		</div >
	}
}

const mapStateToProps = (state) => {
	return {
		availableInvoiceData: state.invoice.availableInvoiceData,
		relatedInvoiceSearchItem: state.invoice.relatedInvoiceSearchItem,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...trinityInvoiceAction }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(RelatedChooseInvoice))

