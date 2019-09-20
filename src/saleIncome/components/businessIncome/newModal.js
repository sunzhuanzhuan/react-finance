import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as businessIncomeActions from '../../actions/businessIncome'
import { Modal, Row, Form, Select, Input, message, Button } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

class BusinessListModal extends React.Component {
	constructor() {
		super();
		this.state = {
			isClick: false,
		}
	}
	componentDidMount() {
		let { curKey, record, nameList, postType, quoteType } = this.props;
		let _name = nameList.find(item => item.user_id === record.sale_id)
		let _position_level = postType.find(item => item.display === record.position_level);
		let _quote_type = quoteType.find(item => item.display === record.quote_type)
		if (curKey && curKey.includes('mod')) {
			this.props.form.setFieldsValue({
				'name': _name ? _name.real_name : null,
				'sale_id': record.sale_id,
				'position_level': _position_level ? _position_level.id : null,
				'quote_type': _quote_type ? _quote_type.id : null,
				'original_rate': parseFloat(record.original_rate).toFixed(2),
				'distribute_rate': parseFloat(record.distribute_rate).toFixed(2),
				'no_video_rate': parseFloat(record.no_video_rate).toFixed(2)
			})
		}
	}
	handleNameSelect = (value) => {
		const { setFieldsValue } = this.props.form;
		setFieldsValue({ 'sale_id': value });
	}
	checkCount = (rule, value, callback) => {
		const reg = /^(100(\.0{1,2})?|0(\.0{1,2})?|[0-9]?\d(\.\d\d?)?)$/;
		if (value) {
			if (reg.test(value.toString())) {
				callback();
				return;
			}
			callback('请填写小于100的有效数字！');
		} else {
			callback(' ')
		}
	}
	handleOk = (e) => {
		const { postCreateIncome, getIncomeList, postUpdateIncome } = this.props.actions;
		const { curKey, page, page_size, record, filterParams } = this.props;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ isClick: true });
				let params = {
					...values,
					original_rate: parseFloat(values.original_rate),
					distribute_rate: parseFloat(values.distribute_rate),
					no_video_rate: parseFloat(values.no_video_rate),
				};
				delete params['name'];
				const hide = message.loading('操作中，请稍候...');
				if (curKey === 'new') {
					postCreateIncome(params).then(() => {
						this.props.onCancel();
						getIncomeList({ ...filterParams, page: 1, page_size });
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
				postUpdateIncome({ ...params, id: record.id }).then(() => {
					this.props.onCancel();
					getIncomeList({ ...filterParams, page, page_size });
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
		const { visible, title, onCancel, curKey, nameList, quoteType, postType } = this.props;
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
					<FormItem className='wrap-control' label='姓名' {...formItemLayout}>
						{getFieldDecorator('name', {
							initialValue: '',
							rules: [{
								required: true, message: '姓名不能为空!'
							}]
						})(
							<Select placeholder="请选择" showSearch
								filterOption={(input, option) => (
									option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
								)}
								onSelect={this.handleNameSelect}
								disabled={curDisabled}
							>
								{nameList.map((item, key) =>
									<Option key={key} value={item.user_id}>{item.real_name}</Option>)
								}
							</Select>
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='用户ID' {...formItemLayout}>
						{getFieldDecorator('sale_id', {
							rules: [{
								required: true, message: '用户ID不能为空'
							}]
						})(
							<Input disabled />
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='岗位类型' {...formItemLayout}>
						{getFieldDecorator('position_level', {
							rules: [{
								required: true, message: '岗位类型不能为空！'
							}]
						})(
							<Select placeholder='请选择'>
								{postType.map((item, key) =>
									<Option key={key} value={item.id}>{item.display}</Option>)
								}
							</Select>
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='收费模式' {...formItemLayout}>
						{getFieldDecorator('quote_type', {
							rules: [{
								required: true, message: '收费模式不能为空！'
							}]
						})(
							<Select placeholder='请选择'>
								{quoteType.map((item, key) =>
									<Option key={key} value={item.id}>{item.display}</Option>)
								}
							</Select>
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='视频原创' {...formItemLayout}>
						{getFieldDecorator('original_rate', {
							rules: [{
								required: true, message: '视频原创不能为空！'
							}, { validator: this.checkCount }]
						})(
							<Input placeholder='请输入' addonAfter={'%'} />
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='视频分发' {...formItemLayout}>
						{getFieldDecorator('distribute_rate', {
							rules: [{
								required: true, message: '视频分发不能为空！'
							}, { validator: this.checkCount }]
						})(
							<Input placeholder='请输入' addonAfter={'%'} />
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='非视频' {...formItemLayout}>
						{getFieldDecorator('no_video_rate', {
							rules: [{
								required: true, message: '非视频不能为空！'
							}, { validator: this.checkCount }]
						})(
							<Input placeholder='请输入' addonAfter={'%'} />
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
	actions: bindActionCreators({ ...businessIncomeActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(BusinessListModal))
