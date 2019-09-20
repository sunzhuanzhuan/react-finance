import React from 'react'
import { Modal, Row, Form, Select, Input, AutoComplete, message, Button } from "antd";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as companyIncomeActions from '../../actions/companyIncome'
import debounce from 'lodash/debounce';
const FormItem = Form.Item;
const Option = AutoComplete.Option;

class CompanyIncomeModal extends React.Component {
	constructor() {
		super();
		this.state = {
			isClick: false
		}
		this.handleSearch = debounce(this.handleFetch, 800);
	}
	handleFetch = (value) => {
		this.props.actions.getSearchPreparation({ name: value });
	}
	handleNameSelect = (value) => {
		const { setFieldsValue } = this.props.form;
		const { preparationSearch, quoteType } = this.props;
		let _item = preparationSearch.find(item => item.company_id == value);
		let _quote_type = quoteType.find(item => item.id === _item.quote_type);
		setFieldsValue({
			'company_id': value,
			'quote_type': _quote_type ? _quote_type.display : null,
			'sale_id': _item ? _item.real_name : null
		});
	}
	handleOk = (e) => {
		const { postCreatePreparation, getPreparationList } = this.props.actions;
		const { curKey, page_size, filterParams } = this.props;
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ isClick: true });
				let params = { company_id: values.company_id };
				const hide = message.loading('操作中，请稍候...');
				if (curKey === 'new') {
					postCreatePreparation(params).then(() => {
						this.props.onCancel();
						getPreparationList({ ...filterParams, page: 1, page_size });
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
			}
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { visible, onCancel, title, curKey, preparationSearch } = this.props;
		const options = preparationSearch.map((item, key) =>
			<Option key={key} value={item.company_id.toString()}>{item.name}</Option>)
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
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
								required: true, message: '姓名不能为空！'
							}]
						}
						)(
							<AutoComplete
								dataSource={options}
								onSelect={this.handleNameSelect}
								onChange={this.handleSearch}
							>
								<Input placeholder='请输入' />
							</AutoComplete>
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='公司ID' {...formItemLayout}>
						{getFieldDecorator('company_id', {
							rules: [{
								required: true, message: '请输入'
							}]
						})(
							<Input disabled />
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='报价类型' {...formItemLayout}>
						{getFieldDecorator('quote_type', {
							rules: [{
								required: true, message: '岗位类型不能为空！'
							}]
						})(
							<Input disabled />
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='销售经理' {...formItemLayout}>
						{getFieldDecorator('sale_id', {
							rules: [{
								required: true, message: '所属区域不能为空！'
							}]
						})(
							<Input disabled />
						)}
					</FormItem>
				</Row>
				<Row type="flex" justify="start">
					<FormItem className='wrap-control' label='计提标识' {...formItemLayout}>
						{getFieldDecorator('status', {
							initialValue: 1,
							rules: [{
								required: true, message: '上级不能为空！'
							}]
						})(
							<Select placeholder='请选择' disabled
							>
								<Option value={1}>计提</Option>
							</Select>
						)}
					</FormItem>
				</Row>
			</Form>
		</Modal >
	}
}

const mapStateToProps = (state) => {
	return {
		preparationSearch: state.saleIncome.preparationSearch
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...companyIncomeActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CompanyIncomeModal))
