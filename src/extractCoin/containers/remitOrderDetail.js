import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as remitOrderActions from "../action/remitOrder";
import { Link } from "react-router-dom";
import { addKeys, remitDetailFunc, remitDetailOrderConfig, outputRemitConfig } from "../constans/manageConfig";
import "./remitOrder.less";
import { Form, Row, Col, Table, Input, Button, Modal, message } from "antd";
import ReceiptsModal from '../components/receiptsModal'
import RemitModal from '../components/remitModal'
import qs from 'qs'

const FormItem = Form.Item;
const { TextArea } = Input;

class RemitOrderDetail extends React.Component {
	constructor() {
		super();
		this.state = {
			recordLoading: false,
			orderLoading: false,
			detailOutputVisible: false,
			detailOutputLoading: false,
			remitOrderDetailPageSize: 10,
			receiptsVisible: false,
			questParams: {}
		}
	}
	componentDidMount() {
		this.setState({ recordLoading: true, orderLoading: true });
		const search = qs.parse(this.props.location.search.substring(1));
		let { getPaymentSlipDetail, detailForExcel } = this.props.actions;
		getPaymentSlipDetail({ id: search.id, limit_num: 10 }).then(() => {
			this.setState({ orderLoading: false })
		});
		detailForExcel({ id: search.id }).then(() => {
			this.setState({ recordLoading: false })
		});
	}
	handleTipOk = () => {
		const hide = message.loading('处理中，请稍候...');
		let { paymentSlipPayed, paymentSlipReturned, paymentSlipPayedTax, getPaymentSlipDetail, detailForExcel } = this.props.actions;
		let { remitOrderDetailPageSize } = this.state;
		const search = qs.parse(this.props.location.search.substring(1));
		let { remitOrderDetail: { status } } = this.props;
		let { getFieldValue, resetFields } = this.props.form;
		let comment = getFieldValue('comment');
		let values = { id: search.id, comment, status }
		if (status === 0) {
			paymentSlipPayed(values).then(() => {
				Promise.all([getPaymentSlipDetail({ id: search.id, limit_num: remitOrderDetailPageSize }), detailForExcel({ id: search.id })]).then(() => {
					message.success('操作成功');
					hide();
					resetFields('comment', '');
				}).catch(() => {
					message.error('操作失败，请重试')
				})
			}).catch(() => {
				hide();
				message.error('操作失败');
			});
		} else if (status === 1) {
			paymentSlipReturned(values).then(() => {
				Promise.all([getPaymentSlipDetail({ id: search.id, limit_num: remitOrderDetailPageSize }), detailForExcel({ id: search.id })]).then(() => {
					message.success('操作成功');
					hide();
					resetFields('comment', '');
				}).catch(() => {
					hide();
					message.error('操作失败');
				});
			}).catch(() => {
				hide();
				message.error('操作失败');
			});
		} else if (status === 2) {
			paymentSlipPayedTax(values).then(() => {
				Promise.all([getPaymentSlipDetail({ id: search.id, limit_num: remitOrderDetailPageSize }), detailForExcel({ id: search.id })]).then(() => {
					message.success('操作成功');
					hide();
					resetFields('comment', '');
				}).catch(() => {
					hide();
					message.error('操作失败');
				});
			}).catch(() => {
				hide();
				message.error('操作失败');
			});
		} else {
			message.error('未知错误，请联系相关人员')
		}
	}
	handleTipVisible = () => {
		let { remitOrderDetail: { status } } = this.props;
		Modal.confirm({
			title: status === 0 ? '请确认是否已打款' : status === 1 ? '请确认是否已还款' : '请确认是否已结税',
			okText: status === 0 ? '已打款' : status === 1 ? '已还款' : '已结税',
			onOk: this.handleTipOk
		})
	}
	handleDetailOutput = () => {
		const search = qs.parse(this.props.location.search.substring(1));
		const hide = message.loading('页面加载中，请稍候...');
		this.setState({ detailOutputLoading: true });
		this.props.actions.excelNameList(search).then(() => {
			this.setState({ detailOutputLoading: false, detailOutputVisible: true });
			hide();
		}).catch(({ errorMsg }) => {
			hide();
			message.error(errorMsg || '请求出错，请重试')
		});
	}
	handleReceiptsVisible = (record) => {
		this.setState({ receiptsVisible: true, questParams: record });
	}
	closeReceiptsModal = () => {
		this.props.actions.clearBillList();
		this.setState({ receiptsVisible: false });
	}
	render() {
		const search = qs.parse(this.props.location.search.substring(1));
		let { getFieldDecorator } = this.props.form;
		let { recordLoading, orderLoading, detailOutputVisible, detailOutputLoading, remitOrderDetailPageSize, questParams, receiptsVisible } = this.state;
		let { remitOrderDetail, remitOrderDetail: { status, list = {}, partner_type, payment_slip_status_name }, detail_for_excel, excel_name_list: { title, excel } } = this.props;

		list.data ? addKeys(list.data) : null;
		detail_for_excel ? addKeys(detail_for_excel) : null;
		const commentLayout = {
			labelCol: { span: 1 },
			wrapperCol: { span: 23 },
		};
		const remitDetailRecordConfig = remitDetailFunc(payment_slip_status_name, search, this.handleDetailOutput, this.handleReceiptsVisible);
		let detailPaginationObj = {
			onChange: (current) => {
				this.setState({ orderLoading: true });
				this.props.actions.getPaymentSlipDetail({ id: search.id, page: current, limit_num: remitOrderDetailPageSize }).then(() => {
					this.setState({ orderLoading: false });
				});
			},
			onShowSizeChange: (current, pageSize) => {
				this.setState({ orderLoading: true, remitOrderDetailPageSize: pageSize });
				this.props.actions.getPaymentSlipDetail({ id: search.id, page: current, limit_num: pageSize }).then(() => {
					this.setState({ orderLoading: false });
				});
			},
			total: list.total || 10,
			current: list.current_page || 1,
			pageSize: remitOrderDetailPageSize,
			showQuickJumper: true,
			showSizeChanger: true,
			pageSizeOptions: ['10', '20', '50', '100', '200']
		};
		return <div className='remitOrder'>
			<div className='remitOrder-list'>
				<Row>
					<Col span={4}>
						打款状态: {payment_slip_status_name ? payment_slip_status_name[remitOrderDetail.status] : null}
					</Col>
				</Row>
				<Row className='topGap'>
					<Col span={4}>
						包含主账号: {remitOrderDetail.user_id_count}
					</Col>
					<Col span={4}>
						包含订单: {remitOrderDetail.order_count}
					</Col>
					<Col span={4}>
						可提金额: {remitOrderDetail.payment_amount}
					</Col>
					<Col span={4}>
						税金金额: {remitOrderDetail.tax_amount}
					</Col>
				</Row>
				<Row className='topGap'><Col span={4}>操作记录：</Col></Row>
			</div>
			<Table className='topGap'
				columns={remitDetailRecordConfig}
				dataSource={detail_for_excel}
				loading={recordLoading}
				pagination={false} bordered />
			<div className='remitOrder-list'>
				<Row className='topGap'><Col span={4}>包含订单：</Col></Row>
			</div>
			<Table className='topGap' columns={remitDetailOrderConfig} dataSource={list.data} loading={orderLoading} pagination={detailPaginationObj} bordered />
			<Form className='topGap'>
				{status !== 3 ? <Row>
					<Col span={24}>
						<FormItem label='备注：' {...commentLayout}>
							{getFieldDecorator('comment')(
								<TextArea placeholder="请输入" rows={4} maxLength={200} />
							)}
						</FormItem>
					</Col>
				</Row> : null}
				<Row className='topGap'>
					<Col style={{ textAlign: 'right' }}>
						<Link to='/finance/remitOrder'>
							<Button style={{ marginRight: '20px' }} size='large'>返回</Button>
						</Link>
						{status === 3 ? null : <Button type="primary" size='large' onClick={this.handleTipVisible}>{status === 0 ? '已打款' : status === 1 ? '已还款' : '已结税'}</Button>}
					</Col>
				</Row>
			</Form>
			<RemitModal visible={detailOutputVisible}
				columns={outputRemitConfig}
				loading={detailOutputLoading}
				onCancel={() => {
					this.setState({ detailOutputVisible: false })
				}}
				titleData={title}
				excelData={excel}
				partner_type={partner_type}
			></RemitModal>
			{receiptsVisible ? <ReceiptsModal visible={receiptsVisible} onCancel={this.closeReceiptsModal} questParams={{ ...questParams, partner_type }} /> : null}
		</div >
	}
}
const mapStateToProps = (state) => {
	return {
		remitOrderDetail: state.withdraw.remitOrderDetail,
		excel_name_list: state.withdraw.excel_name_list,
		detail_for_excel: state.withdraw.detail_for_excel,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...remitOrderActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(RemitOrderDetail))
