import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { withRouter } from 'react-router-dom';
import * as goldenActions from "../../actions/goldenApply";
import { Modal, Button, Form, Input, message, Radio, Tooltip, Icon } from "antd";
import { WBYUploadFile } from 'wbyui';
import qs from 'qs';
import numeral from 'numeral';
import PreTable from './preTable';
const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

class ApplyModal extends React.Component {
	constructor() {
		super();
		this.state = {
			isClick: false,
			loading: false,
			priceType: 1
		}
		this.attachment = '';
		this.priceTypeOption = [
			{ label: '利润率/服务费率调整', value: 1 },
			{ label: '按金额调整', value: 3 },
			{ label: '调整到订单底价', value: 4 },
		];
	}
	componentDidMount() {
		this.attachment = '';
	}
	handleFunction = (action, params) => {
		return func => {
			const hide = message.loading('操作中，请稍候...');
			action({ ...params }).then(res => {
				func(res);
				hide();
			}).catch(({ errorMsg }) => {
				hide();
				message.error(errorMsg || '操作失败！');
				this.setState({ isClick: false });
			})
		}
	}
	queryData = (obj, func) => {
		this.setState({ loading: true });
		return this.props.actions.getApplicationDetail({ ...obj }).then(() => {
			if (func && Object.prototype.toString.call(func) === '[object Function]') {
				func();
			}
			this.setState({ loading: false })
		}).catch(({ errorMsg }) => {
			this.setState({ loading: false });
			message.error(errorMsg || '列表加载失败，请重试！');
		})
	}
	handleConfirmModal = (params, title, finance, sale) => {
		const isOk = typeof title === 'string';
		if( isOk ) {
			if(finance) {
				Modal.confirm({
					title,
					onOk: () => {
						const hideSecond = message.loading('加载中,请稍候...');
						Object.assign(params, {commit: 1});

						this.props.actions.postPreviewMinSellPrice(params).then(() => {
							hideSecond();
							this.setState({isShowPreview: true});
						}).catch(({ errorMsg }) => {
							hideSecond();
							message.error(errorMsg || '获取预览结果失败，请重试！');
						})
					},
					onCancel: () => {
						this.setState({isShowPreview: false});
					},
				});
			}
			if(sale) {
				Modal.info({
					title,
					onOk: () => {},
				});
			}
		}else {
			this.setState({isShowPreview: true});
		}
	}
	handleApplicationPreview = e => {
		e.preventDefault();
		const { readjustId, companyId, companyDetailAuthorizations, curSelectRows = [] } = this.props;
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const hide = message.loading('加载中,请稍候...');
				const finance = companyDetailAuthorizations[0].permissions['readjust.finance.audit'];
				const sale = companyDetailAuthorizations[0].permissions['readjust.sale.audit'];
				const audit_type = finance ? 1 : sale ? 2 : undefined;
				this.queryData({ page: 1, page_size: 50, status: 1, readjust_application_id: readjustId, company_id: companyId }).then(() => {
					const { applicationDetail: { list = [] } } = this.props;
					const order_ids = list.map(item => item.order_id).toString();
					const params = {
						...values,
						order_ids,
						profit_rate: values['profit_rate'] && values['profit_rate'] != 0 ? numeral(values['profit_rate'] / 100).format('0.0000') : 0,
						service_rate: values['service_rate'] && values['service_rate'] != 0 ? numeral(values['service_rate'] / 100).format('0.0000') : 0,
						readjust_application_id: readjustId, 
						audit_type,
						commit: 2,
					};

					if(params.readjust_type == 3) {
						const { price = [] } = curSelectRows[0];
						const priceIds = price.map(item => item.price_id);
						const set_min_sell_price = priceIds.map(item => {
							const obj = {
								price_id: item,
								input_min_sell_price: params[item]
							};
							delete params[item];
							return obj;
						});
						Object.assign(params, {set_min_sell_price});
					}
					
					this.props.actions.postPreviewMinSellPrice(params).then(result => {
						const { data } = result;
						hide();
						this.handleConfirmModal(params, data, finance, sale );
					}).catch(({ errorMsg }) => {
						hide();
						message.error(errorMsg || '获取预览结果失败，请重试！');
					})
				})
			}
		})
	}
	handlePreview = e => {
		const search = qs.parse(this.props.location.search.substring(1));
		const { curSelectRowKeys, companyDetailAuthorizations = [], curSelectRows = [] } = this.props;
		const finance = companyDetailAuthorizations[0].permissions['readjust.finance.audit'];
		const sale = companyDetailAuthorizations[0].permissions['readjust.sale.audit'];
		const audit_type = finance ? 1 : sale ? 2 : undefined;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const hide = message.loading('加载中,请稍候...');
				const order_ids = curSelectRowKeys.toString();
				const params = {
					...values,
					order_ids,
					profit_rate: values['profit_rate'] && values['profit_rate'] != 0 ? numeral(values['profit_rate'] / 100).format('0.0000') : 0,
					service_rate: values['service_rate'] && values['service_rate'] != 0 ? numeral(values['service_rate'] / 100).format('0.0000') : 0,
					readjust_application_id: search.readjust_application_id,
					audit_type,
					commit: 2,
				};
				if(params.readjust_type == 3) {
					const { price = [] } = curSelectRows[0];
					const priceIds = price.map(item => item.price_id);
					const set_min_sell_price = priceIds.map(item => {
						const obj = {
							price_id: item,
							input_min_sell_price: params[item]
						};
						delete params[item];
						return obj;
					});
					Object.assign(params, {set_min_sell_price});
				}
				this.props.actions.postPreviewMinSellPrice(params).then(result => {
					const { data } = result;
					this.handleConfirmModal(params, data, finance, sale );
				}).catch(({ errorMsg }) => {
					hide();
					message.error(errorMsg || '获取预览结果失败，请重试！');
				})
			}
		})
	}
	handleSubmit = (e) => {
		const attachment = this.attachment;
		const search = qs.parse(this.props.location.search.substring(1));
		const { type, onCancel, curSelectRowKeys, curSelectRows, companyDetailAuthorizations = [] } = this.props;
		const { postApplyReadjust, postPassByOrderIds, postPassByReadjust } = this.props.actions;
		const finance = companyDetailAuthorizations[0].permissions['readjust.finance.audit'];
		const sale = companyDetailAuthorizations[0].permissions['readjust.sale.audit'];
		const audit_type = finance ? 1 : sale ? 2 : undefined;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				if (type === 'add') {
					this.setState({ isClick: true });
					const params = {
						...values,
						attachment,
						order_ids: curSelectRowKeys.toString(),
						company_id: curSelectRows[0].company_id,
					};
					delete params['upload'];
					Object.keys(params).forEach(item => { !params[item] && params[item] !== 0 ? delete params[item] : null });
					this.handleFunction(postApplyReadjust, params)((res) => {
						Modal.success({
							title: '',
							content: `申请成功，申请编号${res.data}`,
							onOk: () => {
								onCancel();
								this.props.history.push('/finance/golden/adjustApply');
							}
						});
					})
				} else if (type === 'detail') {
					this.setState({ isClick: true });
					const params = {
						...values,
						order_ids: curSelectRowKeys.toString(),
						profit_rate: values['profit_rate'] && values['profit_rate'] != 0 ? numeral(values['profit_rate'] / 100).format('0.0000') : 0,
						service_rate: values['service_rate'] && values['service_rate'] != 0 ? numeral(values['service_rate'] / 100).format('0.0000') : 0,
						readjust_application_id: search.readjust_application_id,
						audit_type,
						commit: 2,
					};
					if(params.readjust_type == 3) {
						const { price = [] } = curSelectRows[0];
						const priceIds = price.map(item => item.price_id);
						const set_min_sell_price = priceIds.map(item => {
							const obj = {
								price_id: item,
								input_min_sell_price: params[item]
							};
							delete params[item];
							return obj;
						});
						Object.assign(params, {set_min_sell_price});
					}
					Object.keys(params).forEach(item => { !params[item] && params[item] !== 0 ? delete params[item] : null });
					this.handleFunction(postPassByOrderIds, params)(result => {
						const { data } = result;
						const qurey = { page: 1, ...search.keys };
						this.handleSubmitConfirm(postPassByOrderIds, params, qurey, data, finance, sale);
					})
				} else if (type === 'pass') {
					this.setState({ isClick: true });
					const params = {
						...values,
						min_sell_price: parseInt(values['min_sell_price']) ? parseInt(values['min_sell_price']) : 0,
						profit_rate: values['profit_rate'] && values['profit_rate'] != 0 ? values['profit_rate'] / 100 : 0,
						service_rate: values['service_rate'] && values['service_rate'] != 0 ? values['service_rate'] / 100 : 0,
						readjust_application_id: this.props.readjustId,
						audit_type,
						commit: 2,
					};
					if(params.readjust_type == 3) {
						const { price = [] } = curSelectRows[0];
						const priceIds = price.map(item => item.price_id);
						const set_min_sell_price = priceIds.map(item => {
							const obj = {
								price_id: item,
								input_min_sell_price: params[item]
							};
							delete params[item];
							return obj;
						});
						Object.assign(params, {set_min_sell_price});
					}
					Object.keys(params).forEach(item => { !params[item] && params[item] !== 0 ? delete params[item] : null });

					this.handleFunction(postPassByReadjust, params)(result => {
						const { data } = result;
						const qurey = { page: 1, page_size: this.props.page_size, ...search.keys };
						this.handleSubmitConfirm(postPassByReadjust, params, qurey, data, finance, sale);
					});
				}
			}
		});
	}
	handleSubmitConfirm = (action, params, query, data = {}, finance, sale) => {
		const { queryAction, onCancel, handleClear, type } = this.props;
		const { msg } = data;
		if(msg) {
			if(finance) {
				return Modal.confirm({
					title: msg,
					onOk: () => {
						Object.assign(params, {commit: 1});
						action(params).then(() => {
							queryAction(query, () => {
								message.success('操作成功！');
								this.setState({ isClick: false });
								onCancel();
								if(type === 'detail')
								{
									handleClear();
								}
							});
						}).catch(result => {
							this.setState({ isClick: false });
							const {errorMsg} = result;
							message.error(errorMsg || '操作失败！');
						})
					},
					onCancel: () => {
						this.setState({ isClick: false });
					},
				});
			}
			if(sale) {
				return Modal.info({
					title: msg,
					onOk: () => { this.setState({ isClick: false }) },
				});
			}
		}else {
			this.setState({ isClick: false });
			queryAction(query, () => {
				message.success('操作成功！');
				this.setState({ isClick: false });
				onCancel();
				if(type === 'detail')
				{
					handleClear();
				}
			});
			onCancel();
		}
	}
	handleFileChange = (fileList) => {
		this.attachment = (fileList.map(item => item.url)).toString();
	}
	checkProfitCount = (rule, value, callback) => {
		const reg = /^((-30|0)(\.0{1,2})?|[0-9]?\d(\.\d\d?)?|-([0-2]?\d)(\.\d\d?)?)$/;
		if (value) {
			if (reg.test(value.toString())) {
				callback();
				return;
			}
			callback('请填写-30.00到99.99的值！');
		} else {
			callback(' ')
		}
	}
	checkCount = (_, value, callback) => {
		const reg = /^((100|-30|0)(\.0{1,2})?|[0-9]?\d(\.\d\d?)?|-([0-2]?\d)(\.\d\d?)?)$/;
		if (value) {
			if (reg.test(value.toString())) {
				callback();
				return;
			}
			callback('请填写-30.00到100.00的值！');
		} else {
			callback(' ')
		}
	}

	checkCountNum = (value, callback, quoted_price) => {
		// const reg = /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/;
		const reg = /^[1-9]\d*$/;

		const valueMax = value - quoted_price <= 0;
		if (value) {
			if (reg.test(value.toString()) && valueMax) {
				callback();
			}else if(reg.test(value.toString()) && !valueMax) {
				callback('最低售卖价不能大于应约价！');
			}else {
				callback('请输入大于0的正整数！');
			}
		} else {
			callback(' ')
		}
	}

	handleChangePriceType = ({target:{value}}) => {
		this.setState({ priceType: value, isShowPreview: false })
	}
	getPriceTypeOption = (curSelectRows = [], type, total) => {
		return this.priceTypeOption
			.filter(item => curSelectRows.length > 1 || (type === 'pass' && parseInt(total) > 1) ? item.value !== 3 : item)
			.map(item => <Radio key={item.value} value={item.value}>{item.label}</Radio>)
	}
	handleInputChange = () => {
		this.setState({isShowPreview: false});
	}
	getAmountAdjustItem = (getFieldDecorator, otherLayout, curSelectRows = []) => {
		if(curSelectRows.length != 1)
			return null;

		const { price = []} = curSelectRows[0];
		if(!price.length)
			return null;
		return price.map(item => {
			const { price_label, price_id, quoted_price } = item;

			return (
				<FormItem key={price_id} label='最低售卖价' {...otherLayout}>
					{getFieldDecorator(price_id, {
						rules: [
							{ required: true, message: `请输入最低售卖价!` },
							{ validator: (_, value, callback) => this.checkCountNum(value, callback, quoted_price) }
						]
					})(
						<Input style={{ width: 200 }} disabled={curSelectRows.length > 1} onChange={this.handleInputChange} />
					)}
					<span style={{marginLeft: 20}}>应约价：{quoted_price}</span>
					<div style={{lineHeight: '16px', margin: '4px 0', color: 'rgba(0, 0, 0, 0.45)'}}>( {price_label} )</div>
				</FormItem>
			)
		})
	}
	getPriceValueItem = (getFieldDecorator, otherLayout, quoteType, curSelectRows = []) => {
		const { priceType } = this.state;
		if( priceType === 4 ) 
			return null;
		return priceType === 1 ? [
			<FormItem key='profit_rate' label='订单利润率' {...otherLayout}>
				{getFieldDecorator('profit_rate', quoteType != 2 ? {
					rules: [
						{ required: true, message: '请输入订单利润率!' },
						{ validator: this.checkProfitCount }
					]
				} : {})(
					<Input addonAfter={'%'} style={{ width: 200 }} disabled={quoteType == 2} onChange={this.handleInputChange} />
				)}
			</FormItem>,
			<FormItem key='service_rate' label='服务费率' {...otherLayout}>
				{getFieldDecorator('service_rate', quoteType != 1 ? {
					rules: [
						{ required: true, message: '请输入服务费率!' },
						{ validator: this.checkCount }
					]
				} : {})(
					<Input addonAfter={'%'} style={{ width: 200 }} disabled={quoteType == 1} onChange={this.handleInputChange} />
				)}
			</FormItem>
		] : 
		this.getAmountAdjustItem(getFieldDecorator, otherLayout, curSelectRows);

			// <FormItem label='本次审核最低售卖价' {...otherLayout}>
			// 	{getFieldDecorator('min_sell_price', {
			// 		rules: [
			// 			{ required: true, message: '请输入本次审核最低售卖价!' },
			// 			{ validator: this.checkCountNum }
			// 		]
			// 	})(
			// 		<Input style={{ width: 200 }} disabled={curSelectRows.length > 1} />
			// 	)}
			// </FormItem>

	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { isClick, priceType, isShowPreview } = this.state;
		const { visible, onCancel, type, goldenToken, quoteType, flag, isApplication, curSelectRows = [], columns = [], readjustId, applicationDetail: { total } } = this.props;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		const otherLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 18 },
		};
		const adjustTitle = <Tooltip placement='right' trigger='click' title={<div>
				订单调价仅用于调低的情况，最低售卖价最大等于应约价，如果计算的最低售卖价大于应约价，则最低售卖价默认等于应约价
			</div>}>
			<div style={{width: 120}}>订单调价处理<Icon style={{marginLeft: 5}} type="question-circle" /></div>
		</Tooltip>;
		return <Modal
			className='adjust-dialog'
			visible={visible}
			width={1000}
			title={type === 'add' ? '批量订单调价申请' : adjustTitle}
			onCancel={onCancel}
			maskClosable={false}
			wrapClassName='adjust-dialog-list'
			footer={flag ? [
				<Button key="submit" type="primary" disabled={isClick} onClick={this.handleSubmit}>确定</Button>,
				<Button key="back" onClick={onCancel}>取消</Button>
			] : [
					<Button key="submit" type="primary" disabled={isClick} onClick={this.handleSubmit}>确定</Button>,
					<Button key="back" onClick={onCancel}>取消</Button>
				]}
		>
			{type === 'add' ? <Form>
				<FormItem label='调价原因' {...formItemLayout}>
					{getFieldDecorator('reason', {
						rules: [
							{ required: true, message: '请输入调价原因!' },
						],
					})(
						<TextArea style={{ width: 400 }} autosize={{ minRows: 4, maxRows: 6 }} maxLength={50} />
					)}
				</FormItem>
				<FormItem label="附件" {...formItemLayout} >
					{getFieldDecorator('upload')(
						<WBYUploadFile
							ref={x => this.uploadFile = x}
							tok={{
								token: goldenToken.upload_token,
								upload_url: goldenToken.upload_url
							}}
							onChange={this.handleFileChange}
							listType='text'
							uploadText={'上传'}
							multiple={true}
							size={10}
							len={5}
							accept={".png,.jpg,.jpeg"} />
					)}
				</FormItem>
				<div className='tip-message'>
					<p className='red-font'>请上传调价相关的审批邮件等信息</p>
					<p className='red-font'>最多可上传5个附件，单附件不能超过10M，格式：png、jpg、jpeg</p>
				</div>
			</Form> :
				<Form>
					<FormItem label='调价类型' {...otherLayout}>
						{getFieldDecorator('readjust_type', {
							initialValue: priceType,
							rules: [
								{ required: true, message: '请选择调价类型!' }
							]
						})(
							<RadioGroup onChange={this.handleChangePriceType}>
							{
								this.getPriceTypeOption(curSelectRows, type, total)
							}
							</RadioGroup>
						)}
					</FormItem>
					{
						this.getPriceValueItem(getFieldDecorator, otherLayout, quoteType, curSelectRows)
					}
					<FormItem label='备注' {...otherLayout}>
						{getFieldDecorator('remark')(
							<TextArea placeholder='非必输' style={{ width: 400 }} autosize={{ minRows: 4, maxRows: 6 }} maxLength={50} />
						)}
						<Button key='preview' style={{marginLeft: 20}} type="primary" disabled={isClick} onClick={isApplication ? this.handleApplicationPreview : this.handlePreview}>预览结果</Button>
					</FormItem>
					<FormItem className='previewItem moreThanOneTable'>
						{
							isShowPreview ? <PreTable 
							readjustType={priceType}
							readjustId={readjustId}
							isApplication={isApplication}
							curSelectRows={curSelectRows}
							columns={columns}
						></PreTable> : null
						}
					</FormItem>
				</Form>}
		</Modal>
	}
}

const mapStateToProps = (state) => {
	return {
		companyDetailAuthorizations: state.companyDetail.companyDetailAuthorizations,
		goldenToken: state.companyDetail.goldenToken,
		applicationDetail: state.companyDetail.applicationDetail,
		applicationPreview: state.companyDetail.applicationPreview,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...goldenActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Form.create()(ApplyModal)))
