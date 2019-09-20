import React from 'react'
import { Modal, Row, Form, Input, AutoComplete, message, Button } from "antd";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as clientPaymentActions from '../../actions/clientPayment'
import debounce from 'lodash/debounce';
const FormItem = Form.Item;
const Option = AutoComplete.Option;

class ClientListModal extends React.Component {
	constructor() {
		super();
		this.state = {
			isClick: false,
		}
		this.handleNameChange = debounce(this.handleFetch, 800);
	}
	componentDidMount() {
		let { curKey, record } = this.props;
		if (curKey && curKey.includes('mod')) {
			this.props.form.setFieldsValue({
				'name': record.name,
				'company_id': record.company_id,
				'payment_days': record.payment_days
			})
		}
	}
	handleFetch = (value) => {
		this.props.actions.getCompanyID({ name: value }).catch(({ errorMsg }) => {
			message.error(errorMsg || '查询失败');
		});
	}
	handleNameSelect = (value) => {
		const { setFieldsValue } = this.props.form;
		setFieldsValue({ 'company_id': value });
	}
	checkNum = (rule, value, callback) => {
		const reg = /^[1-9]\d?$/;
		if (value) {
			if (value > 0 && reg.test(value.toString())) {
				callback();
				return;
			}
			callback('账期为大于0，小于99的正整数！');
		} else {
			callback('账期不能为空！')
		}
	}
	handleOk = (e) => {
		const { postCreateCompany, getCompanyList, postUpdateCompany } = this.props.actions;
		const { curKey, page, page_size } = this.props;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ isClick: true });
				const hide = message.loading('操作中，请稍候...');
				delete values['name'];
				if (curKey === 'new') {
					postCreateCompany(values).then(() => {
						this.props.onCancel();
						getCompanyList({ page: 1, page_size });
						hide();
						message.success('操作成功！');
						this.setState({ isClick: false });
					}).catch(({ errorMsg }) => {
						hide();
						message.error(errorMsg || '操作失败！');
						this.setState({ isClick: false });
					})
					return
				}
				postUpdateCompany(values).then(() => {
					this.props.onCancel();
					getCompanyList({ page, page_size });
					hide();
					message.success('操作成功！');
					this.setState({ isClick: false });
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
		const { visible, title, onCancel, curKey, companyID } = this.props;
		const options = companyID.map((item, key) =>
			<Option key={key} value={item.company_id.toString()}>{item.name}</Option>);
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		const curDisabled = /^mod_/.test(curKey);
		return <Modal className='sale-new-modal'
			title={title}
			key={curKey}
			visible={visible}
			width={480}
			onCancel={onCancel}
			footer={[
				<Button key="back" onClick={onCancel}>返回</Button>,
				<Button key="submit" type="primary" onClick={this.handleOk} disabled={this.state.isClick}>确认</Button>
			]}
			maskClosable={false}
		>
			<Form className='new-modal-wrap'>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='公司简称' {...formItemLayout}>
						{getFieldDecorator('name', {
							rules: [{
								required: true, message: '公司简称不能为空！'
							}]
						})(
							<AutoComplete
								disabled={curDisabled}
								dataSource={options}
								onSelect={this.handleNameSelect}
								onChange={this.handleNameChange}
							>
								<Input placeholder='请输入' style={{ width: 200 }} />
							</AutoComplete>
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='公司ID' {...formItemLayout}>
						{getFieldDecorator('company_id', {
							rules: [{
								required: true, message: '公司ID不能为空！'
							}]
						})(
							<Input style={{ width: 200 }} disabled />
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='账期' {...formItemLayout}>
						{getFieldDecorator('payment_days', {
							rules: [{
								required: true, message: ' '
							}, { validator: this.checkNum }]
						})(
							<Input placeholder='请输入大于0的正整数' style={{ width: 200 }} />
						)}
					</FormItem>
				</Row>
			</Form>
		</Modal>
	}
}

const mapStateToProps = () => {
	return {

	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...clientPaymentActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ClientListModal))
