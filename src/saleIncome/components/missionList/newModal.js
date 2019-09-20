import React from 'react'
import { Modal, Row, Form, Select, Input, Button, message, DatePicker } from "antd";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as missionListActions from '../../actions/missionList';
import moment from 'moment';
import { calcSum } from '../../../util'
const { MonthPicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

class MissionListModal extends React.Component {
	constructor() {
		super();
		this.state = {
			isClick: false
		}
	}
	componentDidMount() {
		const { setFieldsValue } = this.props.form;
		let { curKey, record } = this.props;
		let toMonth = this.getMonth();
		if (curKey && curKey !== 'new') {
			this.props.actions.getMissionSale({ region: record.region }).then(() => {
				setFieldsValue({
					'name': record.sale_id,
					'sale_id': record.sale_id,
					'month': moment(record.month, 'YYYYMM'),
					'region': record.region,
					'original_target': record.original_target,
					'distribute_target': record.distribute_target,
					'not_video_target': record.not_video_target
				})
			})
			return
		}
		setFieldsValue({
			'month': moment(toMonth, 'YYYYMM')
		})
	}
	getMonth = () => {
		let date = new Date();
		let years = date.getFullYear();
		let month = date.getMonth() + 1;
		month = month < 10 ? "0" + month : month;
		let toMonth = years.toString() + month.toString();
		return toMonth;
	}
	handleNameSelect = (value) => {
		const { setFieldsValue } = this.props.form;
		setFieldsValue({ 'sale_id': value });
	}
	handleRegion = (value) => {
		const { resetFields } = this.props.form;
		this.props.actions.getMissionSale({ region: value });
		resetFields(['name', 'sale_id']);
	}
	checkCount = (rule, value, callback) => {
		const reg = /^\d+(\.\d\d?)?$/;
		if (value) {
			if (reg.test(value.toString())) {
				callback();
				return;
			}
			callback('请填写最多保留两位的有效数字！');
		} else {
			callback(' ')
		}
	}
	handleOk = (e) => {
		const { postCreateMission, getMissionList, postUpdateMission, getMissionSale } = this.props.actions;
		const { curKey, page, page_size, record, filterParams } = this.props;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ isClick: true });
				let params = values.month ? { ...values, month: values.month.format('YYYYMM') } : { ...values };
				delete params['name'];
				const hide = message.loading('操作中，请稍候...');
				if (curKey === 'new') {
					postCreateMission(params).then(() => {
						this.props.onCancel();
						getMissionList({ ...filterParams, page: 1, page_size });
						getMissionSale({ region: '' });
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
				postUpdateMission({ ...params, id: record.id }).then(() => {
					this.props.onCancel();
					getMissionList({ ...filterParams, page, page_size });
					getMissionSale({ region: '' });
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
		const { getFieldDecorator, getFieldValue } = this.props.form;
		const { visible, onCancel, title, curKey, missionSale, region } = this.props;
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		const originalValue = getFieldValue('original_target');
		const distributeValue = getFieldValue('distribute_target');
		const notVideoValue = getFieldValue('not_video_target');
		const videoValue = originalValue && distributeValue ? calcSum([originalValue, distributeValue]) : null;
		const allValue = originalValue && distributeValue && notVideoValue ? calcSum([originalValue, distributeValue, notVideoValue]) : null;
		const curDisabled = /^check_/.test(curKey);
		return <Modal className={curDisabled ? 'sale-new-modal check-flag' : 'sale-new-modal'}
			title={title}
			key={curKey}
			visible={visible}
			width={480}
			maskClosable={false}
			onCancel={onCancel}
			footer={curDisabled ? [
				<Button key='back' type='primary' onClick={onCancel}>返回</Button>,
			] : [
					<Button key='back' onClick={onCancel}>返回</Button>,
					<Button key='submit' type='primary' onClick={this.handleOk} disabled={this.state.isClick}>确认</Button>
				]}
		>
			<Form className='new-modal-wrap'>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='区域' {...formItemLayout}>
						{getFieldDecorator('region', {
							rules: [{
								required: true, message: '请输入'
							}]
						}
						)(
							<Select placeholder="请选择"
								disabled={curDisabled || /^mod_/.test(curKey)}
								onSelect={this.handleRegion}
							>
								{region.map((item, key) =>
									<Option key={key} value={item.id}>{item.display}</Option>)
								}
							</Select>
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='月份' {...formItemLayout}>
						{getFieldDecorator('month', {
							rules: [{
								required: true, message: '请输入'
							}]
						})(
							<MonthPicker placeholder="请选择月份"
								format={'YYYYMM'}
								style={{ width: 196 }}
								disabled={curDisabled || /^mod_/.test(curKey)}
							/>
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='销售名称' {...formItemLayout}>
						{getFieldDecorator('name', {
							rules: [{
								required: true, message: '销售人员不能为空！'
							}]
						})(
							<Select placeholder="请选择"
								disabled={curDisabled || /^mod_/.test(curKey)}
								onSelect={this.handleNameSelect}
							>
								{missionSale.map((item, key) =>
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
								required: true, message: '请输入'
							}]
						})(
							<Input disabled />
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='视频原创' {...formItemLayout}>
						{getFieldDecorator('original_target', {
							rules: [{
								required: true, message: '视频原创任务指标不能为空！'
							}, { validator: this.checkCount }]
						})(
							<Input placeholder="请输入" disabled={curDisabled} />
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='视频分发' {...formItemLayout}>
						{getFieldDecorator('distribute_target', {
							rules: [{
								required: true, message: '视频分发任务指标不能为空！'
							}, { validator: this.checkCount }]
						})(
							<Input placeholder="请输入" disabled={curDisabled} />
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='视频总计' {...formItemLayout}>
						<Input type='text' disabled value={videoValue ? videoValue.toFixed(2) : null} />
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='非视频' {...formItemLayout}>
						{getFieldDecorator('not_video_target', {
							rules: [{
								required: true, message: '非视频任务指标不能为空！'
							}, { validator: this.checkCount }]
						})(
							<Input placeholder="请输入" disabled={curDisabled} />
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='任务合计' {...formItemLayout}>
						<Input type='text' disabled value={allValue ? allValue.toFixed(2) : null} />
					</FormItem>
				</Row>
			</Form>
		</Modal>
	}
}

const mapStateToProps = (state) => {
	return {
		missionSale: state.saleIncome.missionSale
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...missionListActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(MissionListModal))
