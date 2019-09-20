import React from 'react'
import { connect } from 'react-redux';
import * as actions from "../actions/applyDetail";
//antd
import { Table, Tabs, Modal } from "antd";//Button
//less
import './invoiceApplyDetail.less'
//数据配置
import { handleCompany, handleKeyColumns, typeMap, handleTypeMap } from '../constants/invoiceListConfig'
//verticalTable
import { WBYDetailTable } from "wbyui";
import qs from "qs";
import { calcSum } from "../../util";
import '../components/VerticalTable.less'
import { payback_status_map, invoice_type, invoice_content_type, beneficiary_company, status_display_map } from '../constants'

const TabPane = Tabs.TabPane;

class InvoiceApplyDetail extends React.Component {
	constructor() {
		super();
		this.state = {
			previewVisible: false,
			tipVisible: false,
			imgSrc: '',
			loading: true,
			newRandomKey: '',
			pageSize: 50,
			key: 'reservation'
		}
	}
	async componentWillMount() {
		//let queryObj = this.props.location.query;
		//修改了获取值的方式
		let queryObj = qs.parse(this.props.location.search.substring(1))
		let id = queryObj.id;
		let { getApplyDetail, getAssociatedOrders, getiInvoiceRelation } = this.props;
		let { pageSize } = this.state;
		getiInvoiceRelation(id);
		await getApplyDetail(id);
		let { detailInfo: { type } } = this.props;
		if (type && type === 2) {
			getAssociatedOrders(id, '1', 1, pageSize).then(() => {
				this.setState({
					loading: false
				});
			});
		} else {
			getAssociatedOrders(id, '3', 1, pageSize).then(() => {
				this.setState({
					loading: false
				});
			});
		}
	}
	handleCancel = () => {
		let newKey = this.handleRandomKey();
		this.setState({
			previewVisible: false,
			newRandomKey: newKey
		})
	}
	handleTipCancel = () => {
		this.setState({
			tipVisible: false
		})
	}
	handleRandomKey = () => {
		return Math.random() * 100 + 1000;
	}
	handleTabsChange = async (key) => {
		//let queryObj = this.props.location.query;
		//修改了获取值的方式
		let queryObj = qs.parse(this.props.location.search.substring(1))
		let id = queryObj.id;
		let { getAssociatedOrders, orderInfo } = this.props;
		let { pageSize } = this.state;
		this.setState({ key });
		if (!orderInfo[key]) {
			this.setState({
				loading: true,
			});
			getAssociatedOrders(id, typeMap[key], 1, pageSize).then(() => {
				this.setState({
					loading: false,
				});
			});
		}
	}
	render() {
		let { previewVisible, imgSrc, loading, pageSize, key } = this.state;//tipVisible
		let { detailInfo, detailInfo: { type, payback_status }, invoiceRelation, orderInfo, getAssociatedOrders } = this.props;
		//修改了获取值的方式
		let { id } = qs.parse(this.props.location.search.substring(1));
		let companyData = handleCompany(detailInfo);
		let orderInfoList = orderInfo ? handleKeyColumns(orderInfo) : {};
		let typeTable = type ? type === 2 ? handleTypeMap('2') : handleTypeMap('1') : [];
		const companyColumns = [
			{
				title: '公司ID',
				dataIndex: 'company_id',
				key: 'company_id',
				align: 'center'
			}, {
				title: '公司简称',
				dataIndex: 'company_name',
				key: 'company_name',
				align: 'center'
			}, {
				title: '开票金额（元）',
				dataIndex: 'amount',
				key: 'amount',
				align: 'center'
			}, {
				title: '开票依据',
				dataIndex: 'type_display',
				key: 'type_display',
				align: 'center'
			},
			{
				title: '开票维度',
				dataIndex: 'order_associate_type_display',
				key: 'order_associate_type_display',
				align: 'center'
			},
			{
				title: '合同编号',
				dataIndex: 'contract_num',
				key: 'contract_num',
				align: 'center',
				render: (text, { contract_num }) => {
					return contract_num ? contract_num : "";
				}
			},
			{
				title: '合同扫描件',
				dataIndex: 'contract_scanning_copy',
				key: 'contract_scanning_copy',
				align: 'center',
				render: (text, { contract_scanning_copy }) => {
					return <div>
						{contract_scanning_copy ? contract_scanning_copy.map((item, index) => {
							return <span className='file-link' key={index} onClick={() => {
								window.open(item.url)
							}}>
								{item.name}
							</span>
						}) : null}
					</div >
				}
			},
			{
				title: '邮件审批截图',
				dataIndex: 'email_approval_screenshots',
				key: 'email_approval_screenshots',
				align: 'center',
				render: (text, { email_approval_screenshots }) => {
					return <div>
						{email_approval_screenshots ? email_approval_screenshots.map((item, index) => {
							return <div className='thum-img-box' onClick={() => {
								this.setState({
									previewVisible: true,
									imgSrc: item.url
								})
							}} key={index}>
								<img src={item.url} />
							</div>
						}) : null}
					</div >
				}
			}, {
				title: '销售经理',
				dataIndex: 'company_owner_admin_name',
				key: 'company_owner_admin_name',
				align: 'center'
			}
		];
		const columns = [
			{
				title: '发票申请单ID：',
				dataIndex: 'id',
				key: 'id',
				align: 'center',
				render: (text, { id }) => {
					return payback_status === payback_status_map['WAIT_FOR_PAY'] ?
						<div>{id}<b className="highLight" >待回款</b></div> :
						payback_status === payback_status_map['ALREADY_FOR_PAY'] ?
							<div>{id}<b className="highLight" >已回款</b></div> :
							payback_status === payback_status_map['ALREADY_PART_PAY'] ?
								<div>{id}<b className="highLight" >部分回款</b></div> :
								<div>{id}</div>
				}
			}, {
				title: '创建时间/创建人：',
				dataIndex: 'created_at',
				key: 'created_at',
				align: 'center',
				render: (text, { created_at, creator_name }) => {
					return created_at + ' ' + creator_name
				}
			}, {
				title: '发票抬头：',
				dataIndex: 'invoice_title',
				key: 'invoice_title',
				align: 'center'
			}, {
				title: '发票类型：',
				dataIndex: 'invoice_type',
				key: 'invoice_type',
				align: 'center',
				render: text => {
					return text === invoice_type['NORMAL_INVOICE'] ? '普票' :
						text === invoice_type['SPECAIAL_INVOICE'] ? '专票' : ''
				}
			},
			{
				title: '发票内容：',
				dataIndex: 'invoice_content_type',
				key: 'invoice_content_type',
				align: 'center',
				render: text => {
					return text === invoice_content_type['TECHNICAL_SERVICE'] ? '技术服务费' :
						text === invoice_content_type['INFORMATION_SERVICE'] ? '信息服务费' :
							text === invoice_content_type['ADVERTISING_SERVICE'] ? '广告服务费' :
								text === invoice_content_type['ADVERTISING_EXPENSE'] ? '广告费' : ''
				}
			},
			{
				title: '金额(元)：',
				dataIndex: 'amount',
				key: 'amount',
				align: 'center',
				render: (text, { amount, real_amount, payback_amount }) => {
					return <ul>
						<li>已开票金额:{real_amount}</li>
						<li>申请单金额:{amount}</li>
						<li>已回款金额:{payback_amount}</li>
						<li>待回款金额:{calcSum([amount, -payback_amount])}</li>
					</ul>
				}
			},
			{
				title: '开票公司：',
				dataIndex: 'beneficiary_company',
				key: 'beneficiary_company',
				align: 'center',
				render: text => {
					return text === beneficiary_company['WEIYIHUIHUANG'] ? '微易辉煌' : text === beneficiary_company['XUNDAWANGMAI'] ? '讯达网脉' : text === beneficiary_company['WEIBOYI'] ? '微播易' : text === beneficiary_company['BUGUNIAO'] ? '布谷鸟' : ''
				}
			},
			{
				title: '资质证明：',
				dataIndex: 'special_invoice_proof',
				key: 'special_invoice_proof',
				align: 'center',
				render: (text) => {
					return <div>
						{text ? text.map((it, i) => {
							return it.name.indexOf('.pdf') < 0 ? <div className='thum-img-box' key={i} onClick={() => {
								this.setState({
									previewVisible: true,
									imgSrc: it.url
								})
							}}>
								<img src={it.url} />
							</div> : <div className='thum-img-box' key={i} style={{ textAlign: 'center' }} >
									<a target='_blank' href={it.url} >PDF</a>
								</div>

						}) : null}
					</div>
				}
			},
			{
				title: '开票信息：',
				dataIndex: 'tax_num',
				key: 'tax_num',
				align: 'center',
				render: (text, { tax_num, invoice_title_address, bank_agency, bank_account_number, phone, invoice_comment }) => {
					return <ul>
						<li><span className='invoice-message'>纳税人识别号：</span>{tax_num}</li>
						<li><span className='invoice-message'>开票地址:</span>{invoice_title_address}</li>
						<li><span className='invoice-message'>开户银行：</span>{bank_agency}</li>
						<li><span className='invoice-message'>银行账号：</span>{bank_account_number}</li>
						<li><span className='invoice-message'>座机：</span>{phone}</li>
						<li><span className='invoice-message'>发票备注：</span>{invoice_comment}</li>
					</ul>
				}
			},
			{
				title: '收件人信息：',
				dataIndex: 'company_owner_admin_name',
				key: 'company_owner_admin_name',
				align: 'center',
				render: (text, { addressee, addressee_address, addressee_phone, postcode }) => {
					return <ul>
						<li><span className='invoice-message'>收件人姓名：</span>{addressee}</li>
						<li><span className='invoice-message'>收件人地址：</span>{addressee_address}</li>
						<li><span className='invoice-message'>收件人电话：</span>{addressee_phone}</li>
						<li><span className='invoice-message'>邮编：</span>{postcode}</li>
					</ul>
				}
			},
			{
				title: '申请单状态：',
				dataIndex: 'status_display',
				key: 'status_display',
				align: 'center',
				render: (text, { status_display, express_company_display, waybill_number }) => {
					return status_display === status_display_map['YIKAI'] ?
						<div className='status-display'>
							<p>{status_display}</p>
							<p> 发票号及对应金额：</p>
							{invoiceRelation ? invoiceRelation.map((item, index) => {
								return <p key={index}>
									<span className='left-gap'>{item.invoice_number}</span>
									<span className='left-gap'>{item.invoice_amount}</span>
								</p>
							}) : null}
						</div>
						: status_display === status_display_map['YIJI'] ?
							<div className='status-display'>
								<p>{status_display}
									<span>（快递公司：{express_company_display}</span>
									<span className='left-gap'>快递编号：{waybill_number}）</span>
								</p>
								<p> 发票号及对应金额：</p>
								{invoiceRelation ? invoiceRelation.map((item, index) => {
									return <p key={index}>
										<span>{item.invoice_number}</span>
										<span className='left-gap'>{item.invoice_amount}</span>
									</p>
								}) : null}
							</div>
							: status_display
				}
			},
			{
				title: '关系证明：',
				dataIndex: 'invoice_company_relation_proof',
				key: 'invoice_company_relation_proof',
				align: 'center',
				render: (text) => {
					return <div>
						{text ? text.map((it, i) => {
							return it.name.indexOf('.pdf') < 0 ? <div className='thum-img-box' key={i} onClick={() => {
								this.setState({
									previewVisible: true,
									imgSrc: it.url
								})
							}}>
								<img src={it.url} />
							</div> : <div className='thum-img-box' key={i} style={{ textAlign: 'center' }} >
									<a target='_blank' href={it.url} >PDF</a>
								</div>

						}) : null}
					</div>
				}
			},
			{
				title: '客户编码信息修改证明：',
				dataIndex: 'invoice_title_code_proof',
				key: 'invoice_title_code_proof',
				align: 'center',
				render: (text) => {
					return <div>
						{text ? text.map((it, i) => {
							return it.name.indexOf('.pdf') < 0 ? <div className='thum-img-box' key={i} onClick={() => {
								this.setState({
									previewVisible: true,
									imgSrc: it.url
								})
							}}>
								<img src={it.url} />
							</div> : <div className='thum-img-box' key={i} style={{ textAlign: 'center' }} >
									<a target='_blank' href={it.url} >PDF</a>
								</div>

						}) : null}
					</div>
				}
			},
			{
				title: '备注：',
				dataIndex: 'comment',
				key: 'comment',
				align: 'center'
			},
			{
				title: '运营驳回原因：',
				dataIndex: '1',
				key: '1',
				align: 'center'
			},
			{
				title: '财务拒开原因：',
				dataIndex: 'reject_by_accountant_reason',
				key: 'reject_by_accountant_reason',
				align: 'center'
			},
		] || [];
		let paginationObj = orderInfo[key] ? {
			onChange: (current) => {
				this.setState({
					loading: true
				});
				getAssociatedOrders(id, typeMap[key], current, pageSize).then(() => {
					this.setState({
						loading: false
					});
				}).catch(() => {
					this.setState({
						loading: false
					});
				})
			},
			total: orderInfo[key].total,
			pageSize: orderInfo[key].page_size || pageSize,
			current: orderInfo[key].page || 1
		} : {}
		return <div className='invoice-apply-detail clearfix'>
			<fieldset>
				<legend>发票申请单详情</legend>
				<div className='detail-content'>
					<div className='detail-list clearfix'>
						<WBYDetailTable className='vertical-table' columns={columns} dataSource={detailInfo} columnCount={4}></WBYDetailTable>
					</div>
					<div className='detail-company clearfix'>
						<h4>该申请单中包含如下公司简称：</h4>
						<Table columns={companyColumns} dataSource={companyData} pagination={false} />
					</div>
					{detailInfo.type == 1 || detailInfo.type == 5 ? < div className='detail-order clearfix'>
						<h4>本申请单包含的订单/活动如下：</h4>
						<Tabs defaultActiveKey="reservation" type='card' onChange={this.handleTabsChange}>
							{typeTable.map((item) => {
								return <TabPane tab={item.title} key={item.key}>
									<Table columns={item.columns} dataSource={orderInfoList[item.key]} loading={loading} pagination={paginationObj} />
								</TabPane>
							})
							}
						</Tabs>
					</div> : null}
					<Modal key={this.state.newRandomKey} visible={previewVisible} footer={null} onCancel={this.handleCancel} width={800} wrapClassName='pic-modal'>
						<img src={imgSrc} className='invoice-modal-pic' />
					</Modal>
					{/* <Modal title='提示' visible={tipVisible} footer={[
							<Button key="submit" type="primary" onClick={this.handleCancel}>确定</Button>,
							<Button key="back" onClick={this.handleOk}>
								取消
							</Button>,
						]} onCancel={this.handleTipCancel}>
					</Modal> */}
				</div>
			</fieldset>
		</div >
	}
}


export default connect(
	state => ({
		detailInfo: state.invoice.getApplyDetail.detailInfo,
		orderInfo: state.invoice.getApplyDetail.orderInfo,
		invoiceRelation: state.invoice.getApplyDetail.invoiceRelation
	}),
	actions
)(InvoiceApplyDetail)
