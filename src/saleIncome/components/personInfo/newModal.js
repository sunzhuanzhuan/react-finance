import React from 'react'
import { Modal, Row, Form, Select, Input, message, Button } from "antd";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as personInfoActions from '../../actions/personInfo'
const FormItem = Form.Item;
const OptGroup = Select.OptGroup;
const Option = Select.Option;

class PersonListModal extends React.Component {
	constructor() {
		super();
		this.state = {
			isClick: false
		}
	}
	componentDidMount() {
		const { setFieldsValue } = this.props.form;
		let { curKey, record, region } = this.props;
		let _region = region.find(item => item.display === record.region);
		if (curKey && curKey.includes('mod')) {
			this.props.actions.checkPersonInfo({ sale_id: record.sale_id }).then(() => {
				const { checkSaleData: { list } } = this.props;
				let ary = [];
				list.forEach(item => {
					item.parent_id ? ary.push(item.parent_id) : null
				});
				const positionValue = list[0].position_level;
				const regionValue = _region ? _region.id : null;
				this.handleSelectFocus(positionValue, regionValue).then(() => {
					setFieldsValue({
						'name': record.sale_name,
						'sale_id': record.sale_id,
						'position_level': record.position_level,
						'region': _region ? _region.id : null,
						'parent_id': ary
					})
				})
			})
		}
	}
	handleNameSelect = (value) => {
		const { setFieldsValue } = this.props.form;
		setFieldsValue({ 'sale_id': value });
	}
	handleSelectFocus = (sale_id) => {
		const { getSuperior } = this.props.actions;
		return getSuperior({ sale_id });
	}
	handleClearParent = () => {
		this.props.form.setFieldsValue({ 'parent_id': [] });
	}
	handleOk = (e) => {
		const { postCreateSale, getPersonInfo, postUpdateSale, getNewSalesName } = this.props.actions;
		const { curKey, page, page_size, record, filterParams } = this.props;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ isClick: true });
				let params = { ...values, parent_id: values.parent_id.length > 0 ? values.parent_id.toString() : 0 };
				delete params['name'];
				const hide = message.loading('操作中，请稍候...');
				if (curKey === 'new') {
					postCreateSale(params).then(() => {
						this.props.onCancel();
						getPersonInfo({ ...filterParams, page: 1, page_size });
						getNewSalesName();
						hide();
						message.success('操作成功！');
						this.setState({ isClick: false });
					}).catch(() => {
						hide();
						message.error('操作失败！');
						this.setState({ isClick: false });
					})
					return
				}
				postUpdateSale({ ...params, id: record.id }).then(() => {
					this.props.onCancel();
					getPersonInfo({ ...filterParams, page, page_size });
					getNewSalesName();
					hide();
					message.success('操作成功！');
					this.setState({ isClick: false });
				}).catch(() => {
					hide();
					message.error('操作失败！');
					this.setState({ isClick: false });
				})
			}
		});
	}
	render() {
		const { getFieldDecorator, getFieldValue } = this.props.form;
		const { visible, onCancel, title, curKey, nameList, region, postType, saleSuperior } = this.props;
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		const positionValue = getFieldValue('position_level') || '';
		// const regionValue = positionValue && positionValue === 4 ? 0 : getFieldValue('region') || '';
		const saleIdValue = getFieldValue('sale_id') || '';
		// let parentValue = getFieldValue('parent_id') || '';
		// console.log(parentValue);
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
							rules: [{
								required: true, message: '姓名不能为空！'
							}]
						}
						)(
							<Select placeholder="请选择"
								style={{ width: 200 }}
								showSearch
								allowClear
								filterOption={(input, option) => option.props.children.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0}
								onSelect={this.handleNameSelect}
							>
								<OptGroup label={<span>姓名<span style={{ float: 'right' }}>ID</span></span>}>
									{nameList.map(item =>
										<Option key={item.user_id} value={item.user_id}>
											<span>{item.real_name}<span style={{ float: 'right' }}>{item.user_id}</span></span>
										</Option>)
									}
								</OptGroup>
							</Select>
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='用户ID' {...formItemLayout}>
						{getFieldDecorator('sale_id', {
							rules: [{
								required: true, message: '用户ID不能为空！'
							}]
						})(
							<Input style={{ width: 200 }} disabled />
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
							<Select placeholder='请选择' style={{ width: 200 }}
								onSelect={this.handleClearParent}
							>
								{postType.map((item, key) =>
									<Option key={key} value={item.id}>{item.display}</Option>)
								}
							</Select>
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='所属区域' {...formItemLayout}>
						{getFieldDecorator('region', {
							rules: [{
								required: true, message: '所属区域不能为空！'
							}]
						})(
							<Select placeholder='请选择' style={{ width: 200 }}
								onSelect={this.handleClearParent}
							>
								{region.map((item, key) =>
									<Option key={key} value={item.id}>{item.display}</Option>)
								}
							</Select>
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control personal-parent' label='上级' {...formItemLayout}>
						{getFieldDecorator('parent_id', positionValue && positionValue === 4 ? {} : {
							rules: [{
								required: true, message: '上级不能为空！'
							}]
						})(
							<Select
								className='personal-multiple-select'
								placeholder={positionValue && positionValue === 4 ? '' : '请选择'}
								mode="multiple" style={{ width: 200 }}
								showSearch
								filterOption={(input, option) => (
									option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
								)}
								onFocus={() => {
									this.handleSelectFocus(saleIdValue)
								}}
								disabled={!!(positionValue && positionValue === 4)}
							>
								{saleSuperior.map((item, key) =>
									<Option key={key} value={item.user_id}>{item.real_name}</Option>)
								}
							</Select>
						)}
					</FormItem>
				</Row>
			</Form>
		</Modal>
	}
}

const mapStateToProps = (state) => {
	return {
		saleSuperior: state.saleIncome.saleSuperior,
		checkSaleData: state.saleIncome.checkSaleData
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...personInfoActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PersonListModal))
