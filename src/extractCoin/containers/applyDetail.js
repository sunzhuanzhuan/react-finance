import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as extractActions from "../action/extractManage";
import { Link } from "react-router-dom";
import { applyDetailConfigMap, columnsList } from "../constans/manageConfig";
import "./extractManage.less";
import { Table, Button, Input, Row, Col, Form, Modal, message, DatePicker } from "antd";
import { timestampToTime } from "../constans/utils";
import { calcSum } from "../../util";
import qs from "qs";

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');


const FormItem = Form.Item;
const { TextArea } = Input;
// const RangePicker = DatePicker.RangePicker;


class ApplyDetail extends React.Component {
	constructor() {
		super();
		this.state = {
			rejectVisible: false,
			readyVisible: false,
			loading: false,
			total_withdraw_money: 0,
			submitDisable: false
		}
	}
	componentDidMount() {
		const search = qs.parse(this.props.location.search.substring(1));
		let id = search.id;
		let today = this.getDate();
		const { getWithdrawApplyDetail, calculateCost } = this.props.actions;
		this.setState({ loading: true });
		const hide = message.loading('数据加载中，请稍候...');
		getWithdrawApplyDetail({ id }).then(() => {
			let { applyDetail: { order_list, comment, status } } = this.props;
			this.props.form.setFieldsValue({ 'comment': comment });
			let trade_ids = order_list.map(item => item.trade_id);
			let values = { 'start_day': today, trade_ids };
			if (status !== 3) {
				this.setState({ submitDisable: true });
				calculateCost({ ...values }).then(() => {
					let { calculateCost: { total_withdraw_money = 0.00 } } = this.props;
					hide();
					this.setState({
						loading: false,
						submitDisable: false,
						today,
						total_withdraw_money: total_withdraw_money
					})
				}).catch(({ errorMsg }) => {
					hide();
					message.error(errorMsg || '计价失败，请重试');
				})
				return
			}
			hide();
			this.setState({ loading: false });
		}).catch(({ errorMsg }) => {
			hide();
			this.setState({ loading: false });
			message.error(errorMsg || '列表加载出错，请重试');
		})

	}
	getDate = () => {
		let date = new Date();
		let years = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		month = month < 10 ? "0" + month : month;
		day = day < 10 ? "0" + day : day;
		let today = years + "-" + month + "-" + day;
		return today;
	}
	handleReadyVisible = () => {
		this.setState({ readyVisible: true });
	}
	handleReadyCancel = () => {
		this.setState({ readyVisible: false });
	}
	handleRejectVisible = () => {
		this.setState({ rejectVisible: true });
	}
	handleRejectCancel = () => {
		let { setFieldsValue } = this.props.form;
		this.setState({ rejectVisible: false });
		setFieldsValue({ 'dialog-comment': '' });
	}
	handleReject = async (e) => {
		const { setFail, getWithdrawApplyDetail } = this.props.actions;
		const hide = message.loading('等待中...');
		const search = qs.parse(this.props.location.search.substring(1))
		let id = search.id;
		e.preventDefault();
		let comment = this.props.form.getFieldValue('dialog-comment');
		let values = { id, comment };
		Object.keys(values).forEach(item => { !values[item] && values[item] !== 0 ? delete values[item] : null });
		setFail({ ...values }).then(() => {
			hide();
			this.handleRejectCancel();
			getWithdrawApplyDetail({ id }).catch(({ errorMsg }) => {
				message.error(errorMsg || '列表加载失败，请重试')
			});
		}).catch(({ errorMsg }) => {
			hide();
			message.error(errorMsg || '操作失败，请重试');
		})
	}
	handleSubmit = async (e) => {
		const { setPay, getWithdrawApplyDetail } = this.props.actions;
		const search = qs.parse(this.props.location.search.substring(1))
		let id = search.id;
		e.preventDefault();
		this.props.form.validateFields((err, fieldsValue) => {
			if (!err) {
				const hide = message.loading('等待中...');
				let values = { id, ...fieldsValue };
				Object.keys(values).forEach(item => { !values[item] && values[item] !== 0 ? delete values[item] : null });
				setPay({ ...values }).then(() => {
					hide();
					getWithdrawApplyDetail({ id }).catch(({ errorMsg }) => {
						message.error(errorMsg || '列表加载失败，请重试')
					});
				}).catch(({ errorMsg }) => {
					hide();
					message.error(errorMsg || '操作失败，请重试');
				})
			}
		});
	}
	handlePass = (e) => {
		const { setSuccess, getWithdrawApplyDetail } = this.props.actions;
		const search = qs.parse(this.props.location.search.substring(1))
		let id = search.id;
		e.preventDefault();
		this.props.form.validateFields((err, fieldsValue) => {
			if (!err) {
				const hide = message.loading('等待中...');
				let values = { id, ...fieldsValue };
				Object.keys(values).forEach(item => { !values[item] && values[item] !== 0 ? delete values[item] : null });
				setSuccess({ ...values }).then(() => {
					hide();
					this.handleSuccessCancel();
					getWithdrawApplyDetail({ id }).catch(({ errorMsg }) => {
						message.error(errorMsg || '列表加载失败，请重试')
					});
				}).catch(({ errorMsg }) => {
					hide();
					message.error(errorMsg || '操作失败，请重试');
				})
			}
		});
	}
	handleRemit = (e) => {
		const { setSuccess, getWithdrawApplyDetail } = this.props.actions;
		const search = qs.parse(this.props.location.search.substring(1));
		let { total_withdraw_money } = this.state;
		let id = search.id;
		e.preventDefault();
		this.props.form.validateFields((err, fieldsValue) => {
			if (!err) {
				let values = { id, ...fieldsValue };
				values = {
					...values,
					'pay_time': fieldsValue['actual_time'] ? fieldsValue['actual_time'].format('YYYY-MM-DD') : this.state.today
				};
				delete values['actual_time'];
				Object.keys(values).forEach(item => { !values[item] && values[item] !== 0 ? delete values[item] : null });
				if (total_withdraw_money < 0) {
					message.warn('请核对正确的金额数目');
				} else {
					const hide = message.loading('等待中...');
					this.setState({ submitDisable: true });
					setSuccess(values, hide).then(() => {
						hide();
						this.handleReadyCancel();
						message.success('提交成功');
						this.setState({ submitDisable: false });
						getWithdrawApplyDetail({ id });
					}).catch(({ errorMsg }) => {
						hide();
						message.error(errorMsg || '操作失败，请重试');
					});
				}
			}
		});
	}
	handleDateTimeChange = async (data, dataString) => {
		const hide = message.loading('等待中...');
		let { applyDetail: { order_list, order_total_amount, qc_write_off } } = this.props;
		let { getFieldValue } = this.props.form;
		let trade_ids = order_list.map(item => item.trade_id);
		let values = dataString ? { trade_ids, 'start_day': dataString } : { trade_ids, 'start_day': this.state.today };
		this.props.actions.calculateCost({ ...values }).then(() => {
			let { calculateCost: { total_fee, total_service_fee } } = this.props;
			let other_fee = getFieldValue('other_fee') || 0;
			let discount_amount = getFieldValue('discount_amount') || 0;
			let array = [order_total_amount, -qc_write_off, -total_fee, -total_service_fee, -other_fee, +discount_amount];
			this.calcWithdrawTotal(array);
			hide();
		}).catch(({ errorMsg }) => {
			hide();
			message.error(errorMsg || '操作失败，请重试');
		})
	}
	disabledDate = (current) => {
		let { applyDetail: { order_list } } = this.props;
		let timeAry = [];
		order_list.forEach(item => {
			let value = item.order_end_time.toString().length === 10 ? item.order_end_time * 1000 : item.order_end_time;
			timeAry.push(value);
		});
		let maxTime = Math.max(...timeAry);

		return current && current.valueOf() < maxTime;
	}
	handleOtherChange = (e) => {
		const { value } = e.target || 0;
		let { getFieldValue } = this.props.form;
		let { applyDetail: { order_total_amount, qc_write_off } } = this.props;
		let { calculateCost: { total_fee, total_service_fee } } = this.props;
		let discount_amount = getFieldValue('discount_amount') || 0;
		let array = [order_total_amount, -qc_write_off, -total_fee, -total_service_fee, -value, +discount_amount];
		this.calcWithdrawTotal(array);

	}
	handleDiscountChange = (e) => {
		const { value } = e.target || 0;
		let { getFieldValue } = this.props.form;
		let { applyDetail: { order_total_amount, qc_write_off } } = this.props;
		let { calculateCost: { total_fee, total_service_fee } } = this.props;
		let other_fee = getFieldValue('other_fee') || 0;
		let array = [order_total_amount, -qc_write_off, -total_fee, -total_service_fee, -other_fee, +value];
		this.calcWithdrawTotal(array);
	}
	calcWithdrawTotal = (ary) => {
		let value = calcSum(ary);
		this.setState({ total_withdraw_money: value });
	}
	render() {
		const { getFieldDecorator, getFieldValue } = this.props.form;
		let { applyDetail, applyDetail: { order_list = [], status, comment }, calculateCost: { total_fee = 0, total_service_fee = 0 } } = this.props;
		let { rejectVisible, today, total_withdraw_money, loading } = this.state;
		let configKeys = status === 2 || status === 3 ?
			[
				'id', 'order_id',
				'order_type_name',
				'payment_silp_status_name',
				'order_end_time',
				'service_cycle',
				'order_amount',
				'qc_write_off',
				'service_amount',
				'service_fee',
				'other_fee',
				'discount_amount',
				'payment_amount'
			] :
			[
				'id', 'order_id',
				'order_type_name',
				'order_end_time',
				'expect_service_cycle',
				'order_amount',
				'qc_write_off',
				'expect_service_amount',
				'service_fee',
				'other_fee',
				'discount_amount',
				'expect_payment_amount'
			];
		let withdrawDetailConfig = columnsList(applyDetailConfigMap, configKeys);
		const commentLayout = {
			labelCol: { span: 1 },
			wrapperCol: { span: 23 },
		};
		const dialogCommentLayout = {
			labelCol: { span: 3 },
			wrapperCol: { span: 21 },
		};
		const formItemLayout = {
			labelCol: { span: 5 },
			wrapperCol: { span: 19 },
		};
		return <div className='extractManage'>
			<ExtractList applyDetail={applyDetail}></ExtractList>
			<Table className='topGap'
				rowKey='id'
				columns={withdrawDetailConfig}
				dataSource={order_list}
				pagination={false}
				loading={loading}
				bordered></Table>
			<Form className='topGap'>
				<Row>
					<Col span={24}>
						<FormItem label='备注：' {...commentLayout}>
							{getFieldDecorator('comment', {
								rules: [{ required: false }],
								initialValue: comment
							})(
								<TextArea placeholder="可输入合同备注" rows={4} maxLength={200} />
							)}
						</FormItem>
					</Col>
				</Row>
				{status === 4 ? <Row>
					<Col className='topGap' span={20} style={{ paddingLeft: '20px' }}>
						审核驳回：{applyDetail.comment}
					</Col>
				</Row> : null}
				{status === 1 ? <Row className='topGap'>
					<Col style={{ textAlign: 'right' }}>
						<Link to='/finance/extractManage'>
							<Button style={{ marginRight: '20px' }} size='large'>取消</Button>
						</Link>
						<Button style={{ marginRight: '20px' }} size='large' onClick={() => {
							this.handleRejectVisible();
						}}>驳回</Button>
						<Button type='primary' size='large' onClick={() => {
							// this.handleSuccessVisible();
							this.handleReadyVisible();
						}}>通过</Button>
					</Col>
				</Row> : status === 2 ? <Row className='topGap'>
					<Col style={{ textAlign: 'right' }}>
						<Link to='/finance/extractManage'>
							<Button style={{ marginRight: '20px' }} size='large'>返回</Button>
						</Link>
					</Col>
				</Row> : <Row className='topGap'>
							<Col style={{ textAlign: 'right' }}>
								<Link to='/finance/extractManage'>
									<Button size='large'>返回</Button>
								</Link>
							</Col>
						</Row>}
			</Form>
			{
				status === 1 ? <Modal visible={rejectVisible} onCancel={this.handleRejectCancel} width={1000}
					style={{ top: 200 }}
					footer={[
						<Button key="back" onClick={this.handleRejectCancel}>取消</Button>,
						<Button key="submit" type="primary" disabled={!getFieldValue('dialog-comment')} onClick={this.handleReject}>提交</Button>
					]}
				>
					<Form className='topGap'>
						<Row>
							<Col span={22}>
								<FormItem label='驳回原因：' {...dialogCommentLayout}>
									{getFieldDecorator('dialog-comment', {
										rules: [{ required: false }],
										initialValue: comment
									})(
										<TextArea placeholder="请填写驳回内容" rows={6} maxLength={200} />
									)}
								</FormItem>
							</Col>
						</Row>
					</Form>
				</Modal> : null
			}

			{
				status === 1 ? <Modal title='请核对相关信息' visible={this.state.readyVisible} onCancel={this.handleReadyCancel}
					style={{ top: 200 }}
					footer={[
						<Button key="back" onClick={this.handleReadyCancel}>取消</Button>,
						<Button key="submit" type="primary" disabled={this.state.submitDisable} onClick={this.handleRemit}>确认</Button>
					]}>
					<div className='extract-modal-container'>
						<Form>
							<Row>
								<Col>
									<FormItem {...formItemLayout} label="实际打款时间：" className='special-one'>
										{getFieldDecorator('actual_time')(
											<DatePicker format='YYYY-MM-DD' onChange={this.handleDateTimeChange} placeholder={today} disabledDate={this.disabledDate} />
										)}
									</FormItem>
								</Col>
							</Row>
							<Row style={{ marginTop: '10px' }}>
								<Col className='modal-icon-item'>订单总额：{applyDetail.order_total_amount || 0.00} 元</Col>
							</Row>
							<Row style={{ marginTop: '10px' }}>
								<Col className='modal-icon-item'> - 质检总额：{applyDetail.qc_write_off || 0.00} 元</Col>
							</Row>
							<Row style={{ marginTop: '10px' }}>
								<Col className='modal-icon-item'> - 利息总额：{total_fee || 0.00} 元</Col>
							</Row>
							<Row style={{ marginTop: '10px' }}>
								<Col className='modal-icon-item'> - 手续费总额：{total_service_fee || 0.00} 元</Col>
							</Row>
							<Row style={{ marginTop: '10px' }}>
								<Col>
									<FormItem {...formItemLayout} label=" - 其他扣款总额:" className='special-one'>
										{getFieldDecorator('other_fee', {
											rules: [{ pattern: /^\d+(\.)?(\d+)?$/, message: '请输入正确的金额' }]
										})(
											<Input className='extractManage-input' placeholder={0.00} onChange={this.handleOtherChange} />
										)} 元
							</FormItem>
								</Col>
							</Row>
							<Row style={{ marginTop: '10px' }}>
								<Col>
									<FormItem {...formItemLayout} label=" + 优惠总额：" className='special-one'>
										{getFieldDecorator('discount_amount', {
											rules: [{ pattern: /^\d+(\.)?(\d+)?$/, message: '请输入正确的金额' }]
										})(
											<Input className='extractManage-input' placeholder={0.00} onChange={this.handleDiscountChange} />
										)} 元
							</FormItem>
								</Col>
							</Row>
							<Row style={{ marginTop: '10px' }}>
								<Col className='modal-icon-item extractManage-red-color'> = 提现总额：{total_withdraw_money || 0.00} 元</Col>
							</Row>
						</Form>
					</div>
				</Modal> : null
			}
		</div >
	}
}

const mapStateToProps = (state) => {
	return {
		applyDetail: state.withdraw.applyDetail,
		calculateCost: state.withdraw.calculateCost,

	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...extractActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ApplyDetail))

function ExtractList({ applyDetail }) {
	return <div className='extractManageList'>
		<Row>
			<Col span={4}>
				提现单号:{applyDetail.id}
			</Col>
			<Col span={4}>
				审核状态:{applyDetail.status_msg}
			</Col>
		</Row>
		<Row className='topGap'>
			<Col span={4}>
				主账号:{applyDetail.user_name}
			</Col>
			<Col span={4}>
				主账号类型:{applyDetail.partner_type_name}
			</Col>
		</Row>
		<Row className='topGap'>
			<Col span={4}>
				订单总额:{applyDetail.order_total_amount}
			</Col>
			<Col span={4}>
				质检总额:{applyDetail.qc_write_off}
			</Col>
			<Col span={4}>
				{applyDetail.status === 3 || applyDetail.status === 2 ? '利息总额:' : '预计利息总额:'}{applyDetail.service_amount}
			</Col>
			<Col span={4}>
				{applyDetail.status === 3 || applyDetail.status === 2 ? '手续费:' : '预计手续费:'}{applyDetail.service_fee}
			</Col>
		</Row>
		<Row className='topGap'>
			<Col span={4}>
				其他扣款总额:{applyDetail.other_fee}
			</Col>
			<Col span={4}>
				优惠总额:{applyDetail.discount_amount}
			</Col>
			<Col span={4} style={{ color: 'red' }}>
				{applyDetail.status === 3 || applyDetail.status === 2 ? '提现总额:' : '预计提现总额:'}{applyDetail.payment_amount}
			</Col>
		</Row>
		<Row className='topGap'>
			<Col>
				{applyDetail.cost_description}
			</Col>
		</Row>
		{applyDetail.status === 4 ? <Row className='topGap'>
			<Col span={4}>
				申请时间:{timestampToTime(applyDetail.created_time)}
			</Col>
			<Col span={4}>
				驳回时间:{timestampToTime(applyDetail.update_time)}
			</Col>
			<Col span={4}>
				操作人:{applyDetail.admin_user_name}
			</Col>
		</Row> : applyDetail.status === 3 || applyDetail.status === 2 ? <Row className='topGap'>
			<Col span={4}>
				申请时间:{timestampToTime(applyDetail.created_time)}
			</Col>
			{applyDetail.status === 1 ? null : <Col span={4}>
				打款时间:{applyDetail.pay_time}
			</Col>}
			<Col span={4}>
				操作人:{applyDetail.admin_user_name}
			</Col>
		</Row> : <Row className='topGap'>
					<Col span={4}>
						申请时间:{timestampToTime(applyDetail.created_time)}
					</Col>
				</Row>}
	</div>
}
