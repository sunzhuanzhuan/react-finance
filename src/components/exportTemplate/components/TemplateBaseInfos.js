import React, { Component } from "react"
import { Form, Input, Radio, Select, Skeleton } from 'antd'
import './TemplateBaseInfos.less'
import SelectCompany from "@/components/exportTemplate/components/SelectCompany";

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 7 }
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 17 }
	}
};
const editAreaStyle = {
	maxWidth: '400px'
}

@Form.create()
export default class TemplateBaseInfos extends Component {

	render() {
		const { getFieldDecorator, getFieldValue, getFieldError } = this.props.form;
		const { getCompanyList } = this.props.actions;
		const { templateInfos } = this.props.data;
		const { type } = this.props
		const { for_special_company_status, company_id, company_name, name, introduction } = templateInfos
		return (type === 'create' || (type === 'edit' && name)) ? <div className='edit-info-wrapper'>
			<Form>
				<FormItem label='是否指定公司专用模板' {...formItemLayout} extra={"指定公司专用之后，所有有权限看到该公司的销售、AE都能看到并且使用本模板"}>
					{getFieldDecorator('for_special_company_status', {
						initialValue: for_special_company_status || 2,
						rules: [{ required: true, message: '请选择' }]
					})(
						<RadioGroup>
							<Radio value={1} style={{ marginRight: '30px' }}>是</Radio>
							<Radio value={2}>否</Radio>
						</RadioGroup>
					)}
				</FormItem>
				{getFieldValue('for_special_company_status') === 1 ?
					<FormItem label='指定公司' {...formItemLayout} {...(getFieldError('company_id') ? {} : { help: "请选择具体的公司名称" })}>
						{getFieldDecorator('company_id', {
							initialValue: company_id ? { key: company_id, label: company_name } : undefined,
							rules: [{ required: true, message: '请选择公司' }]
						})(<SelectCompany style={{ width: '100%' }} action={getCompanyList} />)}
					</FormItem> : null}
				<FormItem label='模板名称' {...formItemLayout} {...(getFieldError('name') ? {} : { help: "请填写报价单的模板名称，不超过30个字" })}>
					{getFieldDecorator('name', {
						initialValue: name,
						rules: [{ required: true, message: '请填写模板名称' }, {
							max: 30,
							message: '报价单名称长度不能超过30个字'
						}]
					})(<Input placeholder='请输入' />)}
				</FormItem>
				<FormItem label='模板简介' {...formItemLayout} {...(getFieldError('introduction') ? {} : { help: "请填写报价单的模板简介，不超过100个字" })}>
					{getFieldDecorator('introduction', {
						initialValue: introduction,
						rules: [{
							max: 100,
							message: '模板简介长度不能超过100个字'
						}]
					})(<TextArea placeholder='请输入' autosize={{ minRows: 4, maxRows: 4 }} />)}
				</FormItem>
			</Form>
		</div> : <Skeleton active />
	}
}
