import React from 'react'
import { Modal, Row, Form, Select, Input, message, Button } from "antd";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as exceedPaymentActions from '../../actions/exceedPayment'
const FormItem = Form.Item;
const Option = Select.Option;

class ExceedListModal extends React.Component {
	constructor() {
		super();
		this.state = {
			isClick: false
		}
	}
	componentDidMount() {
		let { curKey, record, postType, operation } = this.props;
		let _position_level = postType.find(item => item.display === record.position_level);
		let _operation = operation.find(item => item.display === record.operation);
		if (curKey && curKey.includes('mod')) {
			this.props.form.setFieldsValue({
				'position_level': _position_level ? _position_level.id : null,
				'num': parseFloat(record.num),
				'operation': _operation ? _operation.id : null,
				'rate': parseFloat(record.rate)
			})
		}
	}
	checkNum = (rule, value, callback) => {
		const reg = /^[1-9]\d{0,3}$/;
		if (value) {
			if (value > 0 && reg.test(value.toString())) {
				callback();
				return;
			}
			callback('账期为大于0,小于10000的正整数！');
		} else {
			callback('账期不能为空！')
		}
	}
	checkCount = (rule, value, callback) => {
		const reg = /^(100(\.0{1,2})?|0(\.0{1,2})?|[0-9]?\d(\.\d\d?)?)$/;
		if (value) {
			if (reg.test(value.toString())) {
				callback();
				return;
			}
			callback('请填写最多保留两位的有效数字！');
		} else {
			callback('扣款比例不能为空！')
		}
	}
	handleOk = (e) => {
		const { postCreatePayment, getPaymentList, postUpdatePayment } = this.props.actions;
		const { curKey, page, page_size, record, filterParams } = this.props;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ isClick: true });
				const hide = message.loading('操作中，请稍候...');
				if (curKey === 'new') {
					postCreatePayment(values).then(() => {
						this.props.onCancel();
						getPaymentList({ ...filterParams, page: 1, page_size, operation: 2 });
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
				postUpdatePayment({ ...values, id: record.id }).then(() => {
					this.props.onCancel();
					getPaymentList({ ...filterParams, page, page_size, operation: 2 });
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
		const { visible, title, onCancel, curKey, postType, operation } = this.props;
		const formItemLayout = {
			labelCol: { span: 10 },
			wrapperCol: { span: 14 },
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
					<FormItem className='wrap-control' label='岗位类型' {...formItemLayout}>
						{getFieldDecorator('position_level', {
							rules: [{
								required: true, message: '岗位类型不能为空！'
							}]
						})(
							<Select placeholder="请选择" style={{ width: 200 }} disabled={curDisabled}>
								{postType.map((item, key) =>
									<Option key={key} value={item.id}>{item.display}</Option>)
								}
							</Select>
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='超账期数' {...formItemLayout}>
						{getFieldDecorator('num', {
							rules: [{
								required: true, message: ' '
							}, { validator: this.checkNum }]
						})(
							<Input placeholder='请输入' style={{ width: 200 }} />
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='超账期操作' {...formItemLayout}>
						{getFieldDecorator('operation', {
							initialValue: 2,
							rules: [{
								required: true, message: '超账期操作不能为空！'
							}]
						})(
							<Select placeholder="请选择" style={{ width: 200 }} disabled>
								{operation.map((item, key) =>
									<Option key={key} value={item.id}>{item.display}</Option>)
								}
							</Select>
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='扣款比例' {...formItemLayout}>
						{getFieldDecorator('rate', {
							validateTrigger: 'onBlur',
							rules: [{
								required: true, message: ' '
							}, { validator: this.checkCount }]
						})(
							<Input placeholder='请输入' addonAfter={'%'} style={{ width: 200 }} />
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
	actions: bindActionCreators({ ...exceedPaymentActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ExceedListModal))
