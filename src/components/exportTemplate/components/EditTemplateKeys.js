import React, { Component } from "react"
import { Tabs, Icon, notification, Modal, Skeleton } from 'antd'
import './EditTemplateKeys.less'
import AutoSave from "@/components/exportTemplate/components/AutoSave";
import SelectFieldsContent from "@/components/exportTemplate/components/SelectFieldsContent";
import EditSelectedFieldsContent
	from "@/components/exportTemplate/components/EditSelectedFieldsContent";
import { tabsList } from '../constants/config'

const TabPane = Tabs.TabPane;

const defaultActiveKey = '1'
export default class EditTemplateKeys extends Component {
	state = {
		show: false,
		activeKey: defaultActiveKey,
		autoSaveStatus: 'default'
	}

	handleChangeTabActive = activeKey => {
		const { data, templateId } = this.props
		const { templateAllColumns } = data
		const { getTemplateAllColumns } = this.props.actions
		this.setState({ activeKey }, () => {
			!templateAllColumns[activeKey] && getTemplateAllColumns({
				group_type: activeKey,
				template_id: templateId
			})
		})
	}

	reset = () => {
		const { resetColumnsToDefault } = this.props.actions
		Modal.confirm({
			content: '重置之后，所有修改的内容都会被清空，是否确认重置?',
			okText: '确认',
			cancelText: '取消',
			className: "edit-template-keys-model",
			onOk: close => {
				close()
				resetColumnsToDefault()
			}
		});
	}

	createInterval = (action) => {
		this.timer = setTimeout(() => {
			clearTimeout(this.timer)
			action().then(() => {
				this.createInterval(action)
			})
		}, 60 * 1000)
	}
	autoSave = () => {
		const { save } = this.props
		// 自动保存
		this.createInterval(() => {
			this.setState({ autoSaveStatus: 'saving' })
			return save().then(() => {
				this.setState({ autoSaveStatus: 'save_success' })
			}).catch(() => {
				this.setState({ autoSaveStatus: 'save_failed' })
				return Promise.reject()
			})
		})
	}

	componentWillMount() {
		const { data, templateId } = this.props
		const { templateAllColumns } = data
		const { getTemplateAllColumns, getTemplateInfo } = this.props.actions
		// 获取模板基本信息
		getTemplateInfo({ template_id: templateId }).then(() => {
			// 开启自动保存
			this.autoSave()
		}).catch(({ errMsg }) => {
			notification.error({ message: errMsg || '请求出错了!' })
		})
		!templateAllColumns[defaultActiveKey] && getTemplateAllColumns({
			group_type: defaultActiveKey,
			template_id: templateId
		})
	}

	componentWillUnmount() {
		clearTimeout(this.timer)
	}

	render() {
		const { data, actions } = this.props
		const { templateInfos } = data
		const { for_special_company_status, name, company_name } = templateInfos
		const { activeKey, autoSaveStatus } = this.state
		return name ? <div className='edit-template-keys-wrapper'>
			<AutoSave type={autoSaveStatus} />
			<div className='template-keys-container-left'>
				<Tabs defaultActiveKey={defaultActiveKey} activeKey={activeKey} animated={false} onChange={this.handleChangeTabActive}>
					{
						tabsList.map(({ group_id, name }) =>
							<TabPane tab={name} key={group_id}>
								<SelectFieldsContent groupId={group_id} data={data} actions={actions} />
							</TabPane>)
					}
				</Tabs>
			</div>
			<div className='template-keys-container-right'>
				<header className='selected-head'>
					<div className='selected-head-title'>已选字段<a onClick={this.reset}>重置</a></div>
					<div className='selected-head-template-info'>
						<p>指定公司: <span title={company_name || '无'}>{for_special_company_status == 1 ? company_name : '无'}</span>
						</p>
						<p>模板名称: <span title={name}>{name}</span></p>
					</div>
				</header>
				<Tabs defaultActiveKey={defaultActiveKey} type="card" activeKey={activeKey} animated={false} onChange={this.handleChangeTabActive}>
					{
						tabsList.map(({ group_id, name }) =>
							<TabPane tab={name} key={group_id}>
								<EditSelectedFieldsContent groupId={group_id} data={data} actions={actions} />
							</TabPane>)
					}
				</Tabs>
				<footer className='selected-footer'>
					<Icon type="info-circle" theme="outlined" /> 长按拖动排序，双击修改名称
				</footer>
			</div>
		</div> : <Skeleton active />
	}
}
