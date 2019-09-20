import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as studioActions from "../actions";
import { Form, message } from "antd";
import StudioFormTop from '../components/newStudioForm/studioFormTop'
import StudioFormBot from '../components/newStudioForm/studioFormBot'
import "./studioManage.less";
import { postTypeMap } from '../constants'
import numeral from "numeral";
import qs from "qs";

import moment from 'moment';

class NewStudio extends React.Component {
	constructor() {
		super();
		this.state = {
			minValue: 0
		}
	}
	componentDidMount() {
		const { getStudioMetadata, getStudioList } = this.props.actions;
		const { setFieldsValue } = this.props.form;
		const search = qs.parse(this.props.location.search.substring(1));
		getStudioMetadata();
		if (search.postType && search.postType === postTypeMap['modified']) {/* 修改 */
			const hide = message.loading('数据加载中，请稍候...');
			getStudioList({ id: search.id, name: search.name, page: 1, page_size: 20 }).then(({ data }) => {
				let res = data.rows[0];
				this.setState({ minValue: res.total_freeze + res.total_occupy }, () => {
					setFieldsValue({
						name: res.name,
						identity: res.identity,
						type: res.type,
						supported_platforms: res.supported_platforms,
						is_support_flash: res.is_support_flash,
						is_support_not_id_card: res.is_support_not_id_card,
						total_limit: numeral(res.total_limit / 100).format('0.00'),
						single_limit: numeral(res.single_limit / 100).format('0.00'),
						monthly_limit: numeral(res.monthly_limit / 100).format('0.00'),
						is_support_alipay: res.is_support_alipay === 1 ? [1, 2] : [2],
						invoice_provider: res.invoice_provider,
						validity_start: moment(res.validity_start, 'YYYY-MM-DD'),
						validity_end: moment(res.validity_end, 'YYYY-MM-DD'),
						remark: res.remark
					});
					if (res.is_support_alipay === 1) {
						window.setTimeout(() => {
							setFieldsValue({
								alipay_real_name: res.is_support_alipay === 1 ? res.alipay_real_name : '',
								alipay_card_number: res.is_support_alipay === 1 ? res.alipay_card_number : ''
							})
						}, 0);
					}
					if (res.payment_type_id !== 0) {
						window.setTimeout(() => {
							setFieldsValue({
								payment_type_id: res.payment_type_id,
								bank_agency_province: res.bank_agency_province,
								bank_agency_city: res.bank_agency_city,
								// bank_agency_subbranch: res.bank_agency_subbranch,
								bank_agency: res.bank_agency,
								real_name: res.real_name,
								card_number: res.card_number
							})
						}, 0);
					}
					// if (res.invoice_tax_rate === '0.06' || res.invoice_tax_rate === '0.03') {
					// 	setFieldsValue({
					// 		invoice_tax_rate: res.invoice_tax_rate
					// 	})
					// 	hide();
					// 	return
					// } else {
					// 	setFieldsValue({
					// 		invoice_tax_rate: '0.00'
					// 	})
					// }
					// window.setTimeout(() => {
					// 	setFieldsValue({
					// 		tax_value: numeral(res.invoice_tax_rate * 100).format('0.00')
					// 	})
					// }, 0);
					hide();
				});
			}).catch(({ errorMsg }) => {
				hide();
				message.error(errorMsg || '加载失败，请重试');
			})
		}
	}
	handleOk = (e) => {
		const { postCreateStudio, postUpdateStudio } = this.props.actions;
		const search = qs.parse(this.props.location.search.substring(1));
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				if (values['name'] !== values['invoice_provider']) {
					message.error('【工作室名称】与【发票抬头】不一致！');
					return
				}
				let validity_start = values['validity_start'] ? values['validity_start'].format('YYYY-MM-DD') : null;
				let validity_end = values['validity_end'] ? values['validity_end'].format('YYYY-MM-DD') : null;
				let is_support_alipay = values['is_support_alipay'].includes(1) ? 1 : 2;
				let invoice_tax_rate = values['invoice_tax_rate'] === '0.00' ? numeral(values['tax_value'] / 100).format('0.0000') : values['invoice_tax_rate'];
				// let bank_agency = this.props.studioMetadata.bank.find(item => item.id == values['payment_type_id']).display;
				let params = {
					...values,
					// bank_agency,
					validity_start,
					validity_end,
					is_support_alipay,
					invoice_tax_rate
				};
				delete params['tax_value'];
				if (!values['is_support_alipay'].includes(2)) {
					params['payment_type_id'] = 0;
					params['bank_agency_province'] = '';
					params['bank_agency_city'] = '';
					// params['bank_agency_subbranch'] = '';
					params['real_name'] = '';
					params['card_number'] = '';
				}
				const hide = message.loading('处理中，请稍候...');
				if (search.postType && search.postType === postTypeMap['modified']) {
					postUpdateStudio({ ...params, id: search.id }).then(() => {
						hide();
						this.props.history.push("/finance/studioManage/list");
					}).catch(({ errorMsg }) => {
						hide();
						message.error(errorMsg || '请求失败，请重试')
					})
					return
				}
				postCreateStudio({ ...params }).then(() => {
					hide();
					this.props.history.push("/finance/studioManage/list");
				}).catch(({ errorMsg }) => {
					hide();
					message.error(errorMsg || '请求失败，请重试')
				})
			}
		});
	}
	render() {
		const { studioMetadata: { studio_supported_platforms = [], bank = [] } } = this.props;
		const formItemLayout = {
			labelCol: { span: 6 },
			wrapperCol: { span: 16 },
		};
		const taxLayout = {
			labelCol: { span: 20 },
			wrapperCol: { span: 4 },
		};
		return <div className='new-studio-manage'>
			<Form className='new-studio-form'>
				<StudioFormTop
					form={this.props.form}
					formItemLayout={formItemLayout}
					platforms={studio_supported_platforms}
					bank={bank}
					minValue={this.state.minValue}
				></StudioFormTop>
				<StudioFormBot
					history={this.props.history}
					form={this.props.form}
					formItemLayout={formItemLayout}
					taxLayout={taxLayout}
					handleOk={this.handleOk}
				></StudioFormBot>
			</Form>
		</div>
	}
}

const mapStateToProps = (state) => {
	return {
		studioMetadata: state.studioManage.studioMetadata,
		newStudioData: state.studioManage.newStudioData
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...studioActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(NewStudio))
