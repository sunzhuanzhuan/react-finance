import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as trinityPayAction from "../actions";
import { message, Form, Row, Input, Button } from 'antd'
import { modificationColumns } from '../constants'
import { OssUpload } from 'wbyui'
import './trinityPay.less'
import api from '../../api'
import qs from 'qs'
const FormItem = Form.Item;

class Modification extends React.Component {
	constructor() {
		super();
		this.state = {
			type: undefined,
			token: undefined,
		}
	}
	componentWillMount() {
		const search = qs.parse(this.props.location.search.substring(1));
		const { setFieldsValue } = this.props.form;
		const ary = modificationColumns(search.type);

		this.setState({ type: search.type });
		this.queryData({ payment_slip_id: search.payment_slip_id }).then(() => {
			const { payDetail } = this.props;
			let obj = {};
			ary.forEach(item => {
				if (item === 'payment_screenshot') {
					obj[item] = payDetail['payment_screenshot'] ? Object.values(qs.parse(payDetail[item])) : [];
				} else obj[item] = payDetail[item];
			});
			setTimeout(() => {
				setFieldsValue({ ...obj });
			}, 0);
		});
		api.get('/toolbox-gateway/file/v1/getToken').then((res) => {
			this.setState({ token: res.data })
		});
	}
	queryData = (obj, func) => {
		const hide = message.loading('数据加载中，请稍候...');
		return this.props.actions.getPayDetail({ ...obj }).then(() => {
			if (func && Object.prototype.toString.call(func) === '[object Function]') {
				func();
			}
			hide();
		}).catch(({ errorMsg }) => {
			hide();
			message.error(errorMsg || '详情加载失败，请重试！');
		})
	}
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const { payDetail: { payment_status } } = this.props;
				const search = qs.parse(this.props.location.search.substring(1));
				const obj = {
					payment_slip_id: search['payment_slip_id']
				}
				switch (payment_status) {
					case 2:
						const urlArray = values.payment_screenshot.map(item => ({
							uid: item.uid,
							status: item.status,
							name: item.name,
							url: item.url
						}));
						obj['payment_remark'] = values['payment_remark'] != '' ? values['payment_remark'] : undefined;
						obj['payment_screenshot'] = qs.stringify(urlArray);
						break;
					case 3:
						obj['payment_remark'] = values['payment_remark'] != '' ? values['payment_remark'] : undefined;
						break;
					case 4:
						obj['payment_revoke_reason'] = values['payment_revoke_reason'];
						break;
					default:
						break;
				}
				const hide = message.loading('请稍候...');
				this.props.actions.postPayEdit({ payment_status, ...obj }).then(() => {
					message.success('修改成功！');
					hide();
					setTimeout(() => {
						this.props.history.goBack();
					}, 2000);
				}).catch(({ errorMsg }) => {
					message.error(errorMsg || '修改失败！');
					hide();
				})
			}
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { type, token } = this.state;
		const { payDetail: { payment_status, payment_status_desc } } = this.props;
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 16 }
		};
		return <div className='modification-container'>
			<fieldset className='fieldset_css'>
				<legend>{type == 'prePay' ? '三方预付打款单修改' : type == 'datePay' ? '三方周期打款单修改' : null}</legend>
				<Form onSubmit={this.handleSubmit}>
					<Row>
						<FormItem label='打款单ID' {...formItemLayout}>
							{getFieldDecorator('payment_slip_code')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>
					<Row>
						<FormItem label='打款单类型' {...formItemLayout}>
							{getFieldDecorator('settle_type_desc')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>
					<Row>
						<FormItem label='收款方类型' {...formItemLayout}>
							{getFieldDecorator('payee_type_desc')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>
					{type == 'prePay' && <Row>
						<FormItem label='订单ID' {...formItemLayout}>
							{getFieldDecorator('wby_order_id')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>}
					{type == 'prePay' && <Row>
						<FormItem label='订单类型' {...formItemLayout}>
							{getFieldDecorator('product_line_type_name')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>}
					{type == 'prePay' && <Row>
						<FormItem label='三方平台订单ID' {...formItemLayout}>
							{getFieldDecorator('ttp_order_id')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>}
					{type == 'datePay' && <Row>
						<FormItem label='汇总单ID' {...formItemLayout}>
							{getFieldDecorator('settle_id')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>}
					<Row>
						<FormItem label='平台' {...formItemLayout}>
							{getFieldDecorator('platform_name')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>
					<Row>
						<FormItem label='三方下单平台' {...formItemLayout}>
							{getFieldDecorator('cooperation_platform_name')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>
					<Row>
						<FormItem label='三方代理商' {...formItemLayout}>
							{getFieldDecorator('agent_name')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>
					{type == 'prePay' && <Row>
						<FormItem label='需求ID' {...formItemLayout}>
							{getFieldDecorator('requirement_id')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>}
					{type == 'prePay' && <Row>
						<FormItem label='需求名称' {...formItemLayout}>
							{getFieldDecorator('requirement_name')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>}
					{type == 'prePay' && <Row>
						<FormItem label='公司简称' {...formItemLayout}>
							{getFieldDecorator('requirement_company_name')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>}
					{type == 'prePay' && <Row>
						<FormItem label='所属销售' {...formItemLayout}>
							{getFieldDecorator('requirement_sale_manager_name')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>}
					<Row>
						<FormItem label='打款金额' {...formItemLayout}>
							{getFieldDecorator('payment_amount')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>
					<Row>
						<FormItem label='收款方式' {...formItemLayout}>
							{getFieldDecorator('payment_type_desc')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>
					<Row>
						<FormItem label='收款人名称' {...formItemLayout}>
							{getFieldDecorator('payee_account_name')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>
					<Row>
						<FormItem label='收款人账号' {...formItemLayout}>
							{getFieldDecorator('payee_account')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>
					<Row>
						<FormItem label='开户行所在省' {...formItemLayout}>
							{getFieldDecorator('bank_agency_province')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>
					<Row>
						<FormItem label='开户行所在市' {...formItemLayout}>
							{getFieldDecorator('bank_agency_city')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>
					<Row>
						<FormItem label='开户行' {...formItemLayout}>
							{getFieldDecorator('bank')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>
					<Row>
						<FormItem label='开户支行' {...formItemLayout}>
							{getFieldDecorator('bank_agency')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row><Row>
						<FormItem label='打款单生成时间' {...formItemLayout}>
							{getFieldDecorator('created_at')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>
					<Row>
						<FormItem label='打款状态' {...formItemLayout}>
							{getFieldDecorator('payment_status_desc')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>
					<Row>
						<FormItem label='打款成功/失败时间' {...formItemLayout}>
							{getFieldDecorator('payment_time')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>
					{payment_status_desc != '打款失败' ? token && < Row>
						<FormItem label='打款成功截图' {...formItemLayout}>
							{getFieldDecorator('payment_screenshot', {
								rules: [{ required: payment_status == 2, message: '打款成功截图为必填项!' }],
								valuePropName: 'fileList',
								getValueFromEvent: e => e.fileList
							})(
								<OssUpload
									len={5}
									listType="picture-card"
									authToken={token}
									rule={{
										bizzCode: 'TRINITY_PROOF_PAYMENT_IMG_UPLOAD',
										suffix: "bmp,jpg,jpeg,gif,png",
										max: 5
									}}
									multiple={true}
									disabled={payment_status != 2}
									showUploadList={{ showPreviewIcon: true, showRemoveIcon: payment_status == 2 ? true : false }}
								>
								</OssUpload>
							)}
						</FormItem>
					</Row> : null}
					<Row>
						<FormItem label='打款备注' {...formItemLayout}>
							{getFieldDecorator('payment_remark', {
								rules: [{ required: payment_status == 3, message: '打款失败备注为必填项!' }, { max: 50, message: '不超过50个字符!' }]
							})(
								<Input disabled={!(payment_status == 3 || payment_status == 2)} />
							)}
						</FormItem>
					</Row>
					<Row>
						<FormItem label='付款公司' {...formItemLayout}>
							{getFieldDecorator('payment_company_name')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>
					<Row>
						<FormItem label='回票方式' {...formItemLayout}>
							{getFieldDecorator('return_invoice_type_desc')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>
					<Row>
						<FormItem label='应回发票' {...formItemLayout}>
							{getFieldDecorator('return_invoice_amount')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row><Row>
						<FormItem label='发票盈余' {...formItemLayout}>
							{getFieldDecorator('invoice_surplus')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>
					<Row>
						<FormItem label='发票开具方' {...formItemLayout}>
							{getFieldDecorator('beneficiary_company')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>
					{type == 'prePay' && <Row>
						<FormItem label='主账号' {...formItemLayout}>
							{getFieldDecorator('main_user_name')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>}
					{type == 'prePay' && <Row>
						<FormItem label='媒介经理' {...formItemLayout}>
							{getFieldDecorator('media_user_name')(
								<Input disabled={true} />
							)}
						</FormItem>
					</Row>}
					<Row>
						<FormItem label='打款撤销备注' {...formItemLayout}>
							{getFieldDecorator('payment_revoke_reason', {
								rules: [{ required: payment_status == 4, message: '打款撤销备注为必填项!' }, { max: 50, message: '不超过50个字符!' }]
							})(
								<Input disabled={payment_status != 4} />
							)}
						</FormItem>
					</Row>
					<Row style={{ textAlign: 'center', paddingTop: '20px' }}>
						<Button htmlType="submit" type='primary'>确定</Button>
						<Button className='left-gap' type='default' onClick={() => {
							this.props.history.goBack();
						}}>取消</Button>
					</Row>
				</Form>
			</fieldset>
		</div>
	}
}

const mapStateToProps = (state) => {
	return {
		payDetail: state.trinityPay.payDetail,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...trinityPayAction }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Modification))
