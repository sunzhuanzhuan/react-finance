import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Modal, Form, Input, message, Button } from "antd";
import * as businessAccountingActions from '../../actions/businessAccounting'
import * as commonActions from '../../actions/common'
import { WBYUploadFile } from 'wbyui';
import numeral from 'numeral'
import qs from 'qs'
const FormItem = Form.Item;
const { TextArea } = Input;
class BusinessAccountingModal extends React.Component {
	constructor() {
		super();
		this.state = {
			isClick: false,
			newRandomKey: 1,
			price: 0
		}
		this.attachment = ''
	}
	componentDidMount() {
		const { currentTab, ids, is_batch } = this.props;
		const valueAry = Object.values(ids).map(item => item.price * 100);
		const attachmentAry = Object.values(ids).map(item => item.attachment);
		const value = valueAry.length > 1 ? numeral(valueAry.reduce((prev, cur) => prev + cur) / 100).format('0.00') : valueAry[0] / 100;
		this.setState({ price: value });
		if (is_batch == 2) {
			if (currentTab == 3) {
				const ary = Object.values(qs.parse(attachmentAry[0])).map(item => ({
					filepath: item.filepath,
					url: item.url,
					name: item.name
				}));
				this.props.form.setFieldsValue({ 'upload': ary, 'amount': value });
				this.attachment = qs.stringify(ary);
			} else if (currentTab == 1) {
				this.props.form.setFieldsValue({ 'amount': value });
			}
		}
	}
	getNewRandomKey = () => {
		return Math.random() * 100;
	}
	checkCount = (rule, value, callback) => {
		const total = this.state.price;
		if (value || value === 0) {
			if (parseFloat(total) === 0) {
				if (/^\d+(\.\d\d?)?$/.test(value)) {
					if (total * 100 >= value * 100) {
						callback();
						return;
					}
					callback('本次核销金额大于提成金额！');
				} else {
					callback('请输入最多保留两位小数的有效数字！');
				}
			} else {
				if (/^\d\d*(\.\d\d?)?$/.test(value) && parseFloat(value) > 0) {
					if (total * 100 >= value * 100) {
						callback();
						return;
					}
					callback('本次核销金额大于提成金额！');
				} else {
					callback('请输入大于0且最多保留两位小数的有效数字！');
				}
			}
		} else {
			callback(' ')
		}
	}
	handleFileChange = (fileList) => {
		this.attachment = qs.stringify(fileList.map(item => {
			let obj = {};
			obj['filepath'] = item['filepath'];
			obj['name'] = item['name'];
			obj['url'] = item['url'];
			return obj
		}));
	}
	handleOk = (e) => {
		const attachment = this.attachment;
		const { getBusinessAccountingList, postWriteOff } = this.props.actions;
		const { filterParams, onCancel, currentTab, dataSource, page, page_size, is_batch, ids, handleIdsClear, handleLoading, onCancelLoading, handleClear } = this.props;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				if (this.uploadFile.state.loading) {
					Modal.error({
						title: '注意',
						content: '你有正在上传的文件，请稍候...',
					});
					return
				}
				this.setState({ isClick: true });
				let params = { ...values, attachment };
				delete params['upload'];
				Object.keys(params).forEach(item => { !params[item] && params[item] !== 0 ? delete params[item] : null });
				const hide = message.loading('操作中，请稍候...');
				postWriteOff({ is_batch, ids: Object.keys(ids), ...params }).then(() => {
					let pageValue;
					if (is_batch === 1) {
						let num = Math.floor((Object.keys(ids).length - dataSource.length) / page_size) || 1;
						pageValue = parseInt(page - num) || 1;
					} else if (is_batch === 2) {
						pageValue = dataSource.length === 1 ? page - 1 : page;
					}
					handleLoading();
					getBusinessAccountingList({ page: pageValue, page_size, write_off_status: currentTab, ...filterParams }).then(() => {
						onCancelLoading();
						message.success('操作成功！');
						this.setState({ isClick: false }, () => {
							hide();
						});
						handleIdsClear();
						handleClear();
						onCancel();
					}).catch(({ errorMsg }) => {
						message.error(errorMsg || '列表加载失败！');
					})
				}).catch(({ errorMsg }) => {
					hide();
					message.error(errorMsg || '操作失败！');
					this.setState({ isClick: false });
				})
			}
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { newRandomKey, isClick, price } = this.state;
		const { visible, onCancel, businessToken, is_batch, ids } = this.props;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 }
		};
		return <Modal className='bussiness-accounting-list'
			title='提成核销'
			key={newRandomKey}
			visible={visible}
			width={640}
			onCancel={() => {
				onCancel();
				this.setState({ newRandomKey: this.getNewRandomKey() });
			}}
			footer={[
				<Button key="back" onClick={() => {
					onCancel();
					this.setState({ newRandomKey: this.getNewRandomKey() });
				}}>返回</Button>,
				<Button key="submit" type="primary" onClick={this.handleOk} disabled={isClick}>确认提交</Button>
			]}
			maskClosable={false}
		>
			<Form>
				<AccountingStat is_batch={is_batch} ids={ids} price={price} />
				{is_batch === 2 ? <FormItem label='本次核销金额' {...formItemLayout}>
					{getFieldDecorator('amount', {
						rules: [
							{ required: true, message: '请输入核销金额!' },
							{ validator: this.checkCount }
						]
					})(
						<Input style={{ width: 160 }} />
					)}
				</FormItem> : null}
				<FormItem label="附件" {...formItemLayout} >
					{getFieldDecorator('upload')(
						<WBYUploadFile
							ref={(x) => this.uploadFile = x}
							tok={{
								token: businessToken.upload_token,
								upload_url: businessToken.upload_url
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
					<p className='red-font'>请上传打款回单文件</p>
					<p className='red-font'>最多可上传5个附件，单附件不能超过10M，格式：png、jpg、jpeg</p>
				</div>
				<FormItem label='备注' {...formItemLayout}>
					{getFieldDecorator('comment')(
						<TextArea placeholder='非必输' autosize={{ minRows: 4, maxRows: 6 }} maxLength={50} />
					)}
				</FormItem>
			</Form>
		</Modal>
	}
}
const mapStateToProps = (state) => {
	return {
		accountingData: state.saleIncome.accountingData,
		businessToken: state.saleIncome.businessToken
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...businessAccountingActions, ...commonActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(BusinessAccountingModal))
const AccountingStat = ({ is_batch, ids, price }) => {
	return <div>
		{is_batch === 2 ? <div className='accounting-stat' style={{ marginLeft: '37px' }}>提成金额：<span className='red-font'>{price}</span>元</div> : null}
		{is_batch === 1 ? <div className='accounting-stat'>本次核销<span className='red-font' style={{ marginLeft: '10px' }}>{Object.keys(ids).length}</span>笔，核销总金额<span className='red-font' style={{ marginLeft: '10px' }}>{price}</span>元</div> : null}
	</div>
}
