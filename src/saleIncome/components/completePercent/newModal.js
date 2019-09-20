import React from 'react'
import { Modal, Row, Form, Select, message, Button } from "antd";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as completePercentActions from '../../actions/completePercent'
import { valueCheckMap } from '../../constans'
import ValueSection from './valueSection'
import numeral from "numeral";
const FormItem = Form.Item;
const Option = Select.Option;

class CompleteListModal extends React.Component {
	constructor() {
		super();
		this.state = {
			isClick: false
		}
	}
	componentDidMount() {
		const { setFieldsValue } = this.props.form;
		let { curKey, record } = this.props;
		if (curKey && curKey.includes('mod')) {
			const hide = message.loading('数据加载中，请稍候...');
			this.props.actions.getCompleteDetail({ id: record.id }).then(() => {
				let range_value = this.props.completeDetail.range_value;
				let ary = JSON.parse(range_value);
				ary = ary.map(item => {
					for (let key in item) {
						if (key === 'max_value' || key === 'min_value' || key === 'proportion' || key === 'weight') {
							item[key] = numeral(item[key] * 100).format('0.00');
						}
					}
					return item;
				})
				let keys = ary.map((item, index) => index + 1);
				keys.length = keys.length - 2;
				setFieldsValue({
					// 'order_type': record.order_type,
					// 'position_level': record.position_level,
					'keys': keys
				})
				keys.forEach((item, index) => {
					let name = `value_${item}`;
					setFieldsValue({
						[name]: ary[index + 2]
					})
				})
				hide();
			}).catch(({ errorMsg }) => {
				hide();
				message.error(errorMsg || '加载失败，请重试！');
			})
		}
	}
	handleOk = (e) => {
		const { postCreateComplete, getCompleteList, postUpdateComplete } = this.props.actions;
		const { curKey, page, page_size, filterParams, record } = this.props;
		const { validateFields, getFieldValue } = this.props.form;
		e.preventDefault();
		validateFields((err, values) => {
			if (!err) {
				this.setState({ isClick: true });
				const keys = [...values.keys];
				const range_value = keys.map(item => getFieldValue(`value_${item}`));
				let minAry = ['lte', '100'], count = 0, index = 1;
				let res = this.checkValue(range_value, minAry, count, index);
				if (res.count !== range_value.length) {
					message.error(`第${res.index}行区间填写出错！`);
					this.setState({ isClick: false });
					return;
				}
				let obj = {};
				range_value.forEach((item, index) => {
					if (index === range_value.length - 1 && !item.max_value) {
						obj[index] = { ...item, max_value: '999999' }
						return
					}
					obj[index] = item;
				});
				let params = { ...values, range_value: JSON.stringify(obj), id: record.id };
				keys.forEach(item => delete params[`value_${item}`]);
				delete params['field_value'];
				delete params['keys'];
				const hide = message.loading('操作中，请稍候...');
				if (curKey === 'new') {
					postCreateComplete(params).then(() => {
						this.props.onCancel();
						getCompleteList({ ...filterParams, page: 1, page_size });
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
				postUpdateComplete(params).then(() => {
					this.props.onCancel();
					getCompleteList({ ...filterParams, page, page_size });
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
	checkValue = (values, ary, count, index) => {
		let value = values.find(item => parseFloat(item.min_value) == parseFloat(ary[1]) && item.min_op == valueCheckMap[ary[0]]);
		if (value) {
			return this.checkValue(values, [value.max_op, value.max_value], ++count, ++index);
		} else {
			return { count, index };
		}
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { visible, onCancel, title, curKey, postType, orderType } = this.props;
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		const curDisabled = /^mod_/.test(curKey);
		return <Modal className='complete-modal modal-warp'
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
				{/* <Row type="flex" justify="start">
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
					<FormItem className='wrap-control' label='业务类型' {...formItemLayout}>
						{getFieldDecorator('order_type', {
							rules: [{
								required: true, message: '业务类型不能为空！'
							}]
						})(
							<Select placeholder="请选择" style={{ width: 200 }} disabled={curDisabled}>
								{orderType.map((item, key) =>
									<Option key={key} value={item.id}>{item.display}</Option>)
								}
							</Select>
						)}
					</FormItem>
				</Row> */}
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='阈值字段' {...formItemLayout}>
						{getFieldDecorator('field_value', {
							initialValue: '1',
							rules: [{
								required: true, message: '阈值字段不能为空！'
							}]
						})(
							<Select placeholder="请选择" style={{ width: 200 }}>
								<Option value={'1'}>完成率</Option>
							</Select>
						)}
					</FormItem>
				</Row>
				<ValueSection form={this.props.form}></ValueSection>
				{/* <Row type="flex" justify="start">
					<FormItem className='wrap-control' label='奖金基数' {...formItemLayout}>
						{getFieldDecorator('range_value', {
							rules: [{
								required: true, message: '奖金基数不能为空！'
							}]
						})(
							<Input placeholder='请输入' style={{ width: 200 }} />
						)}
					</FormItem>
				</Row> */}
			</Form>
		</Modal>
	}
}

const mapStateToProps = (state) => {
	return {
		completeDetail: state.saleIncome.completeDetail
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...completePercentActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CompleteListModal))
