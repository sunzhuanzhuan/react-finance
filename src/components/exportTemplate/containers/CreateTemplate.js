import React, { Component } from "react"
import { Button, Steps, Form, message, notification } from 'antd'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import FullScreenModal from "@/base/FullScreenModal";
import TemplateBaseInfos from "@/components/exportTemplate/components/TemplateBaseInfos";
import EditTemplateKeys from "@/components/exportTemplate/components/EditTemplateKeys";
import * as actions from '../actions'
import * as publicActions from '@/actions'

const FormItem = Form.Item;
const Step = Steps.Step;

const steps = [{
	title: '编辑模板信息',
	content: TemplateBaseInfos
}, {
	title: '自定义模板字段',
	content: EditTemplateKeys
}];

const modalTypes = {
	'create': '创建模板',
	'edit': '编辑模板'
}

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ ...actions, ...publicActions }, dispatch)
});

@connect(state => state.exportTemplateReducer, mapDispatchToProps)
export default class CreateTemplate extends Component {
	closeModal = () => {
		const { actions: { clearColumns } } = this.props
		if (this.state.current === 1) {
			this.saveTemplateStyleCore()
			notification.info({ message: '模板已为您自动保存至模板列表' })
		}
		clearColumns()
		this.props.close()
	}
	next = () => {
		this.setState({ current: 1, modalType: 'edit' })
	}
	prev = () => {
		const current = this.state.current - 1;
		this.setState({ current });
	}
	// 提交第一部分内容(创建/编辑)
	submit = e => {
		e.preventDefault();
		const { actions: { saveTemplate, getTemplateInfo }, type, templateId, onCreate } = this.props
		this.firstForm.props.form && this.firstForm.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({ createLoading: true })
				// 创建/修改逻辑
				let data = { ...values, ...(type === 'edit' ? { template_id: templateId } : {}) }
				data.company_id = data['for_special_company_status'] === 1 ? data.company_id['key'] : undefined
				data.introduction = data.introduction || ''
				saveTemplate(data).then(({ msg, data }) => {
					message.success(msg)
					this.setState({ createLoading: false, templateId: data.template_id })
					this.next()
					if (type === 'create') {
						onCreate && onCreate({ ...values, templateId: data.template_id })
					}
				}).catch((err) => {
					console.log(err);
					message.error(err.errorMsg);
					this.setState({ createLoading: false })
				})
			}
		});
	}

	// 保存自定义模板字段核心逻辑
	saveTemplateStyleCore = () => {
		const { actions, templateAllColumns, templateInfos } = this.props
		const { id: template_id } = templateInfos
		const { saveTemplateStyle } = actions
		let data = Object.values(templateAllColumns).map(({ group_type, selected, sources }) => ({
			group_type,
			"columns": selected.map(id => {
				let column = sources[id]
				let obj = {}
				obj.column_id = id
				column && column["alias"] && (obj["alias"] = column["alias"])
				return obj
			})
		}))
		return saveTemplateStyle({ template_id, style: data })
	}
	// 底部按钮保存逻辑
	handleSave = () => {
		const { actions: { clearColumns } } = this.props
		this.setState({ saving: true })
		this.saveTemplateStyleCore().then(({ msg }) => {
			this.setState({ saving: false })
			message.success(msg, 1.6, () => {
				this.props.close()
				clearColumns()
			})
		}).catch(({ errMsg }) => {
			this.setState({ saving: false })
			message.error(errMsg)
		})
	}

	constructor(props) {
		super(props)
		this.state = {
			saving: false,
			createLoading: false,
			current: 0,
			modalType: props.type || 'create'
		}
	}

	componentWillMount() {
		const { actions: { getTemplateInfo, clearColumns }, type, templateId } = this.props
		// 先清空数据
		clearColumns()
		if (type === 'edit') {
			// 获取模板基本信息
			getTemplateInfo({ template_id: templateId })
		}
	}

	componentDidMount() {
		let clientHeight = document.body.clientHeight
		let nodeBody = document.querySelector('.full-screen-modal-body')
		nodeBody && (nodeBody.style.height = (clientHeight - 150) + 'px')
	}


	render() {
		const {
			show, actions,
			templateInfos,
			templateAllColumns,
			type
		} = this.props
		const {
			saving, current, createLoading: loading, modalType
		} = this.state
		const params = {
			data: { templateAllColumns, templateInfos },
			actions,
			type,
			templateId: this.state.templateId || this.props.templateId
		}
		const Content = steps[current].content
		return <FullScreenModal title={modalTypes[modalType]} show={show} className='template-container' onCancel={this.closeModal}>
			<div className='full-screen-modal-body'>
				<div className='head-steps'>
					<Steps current={current}>
						{steps.map(item =>
							<Step key={item.title} title={item.title} />)}
					</Steps>
				</div>
				<div className='main-content'>
					<Content wrappedComponentRef={form => this.firstForm = form} {...params} save={this.saveTemplateStyleCore} />
				</div>
			</div>
			<div className='full-screen-modal-footer'>
				{
					current < steps.length - 1 &&
					<Button type='primary' className='footer-item' loading={loading} onClick={this.submit}>下一步</Button>
				}
				{
					current > 0 && <Button className='footer-item' onClick={this.prev}>上一步</Button>
				}
				{
					current === steps.length - 1 && <div className='footer-item'>
						<Button className='footer-item' onClick={this.closeModal}>取消</Button>
						<Button type='primary' loading={saving} className='footer-item' onClick={this.handleSave}>保存</Button>
					</div>
				}
			</div>
		</FullScreenModal>
	}
}
