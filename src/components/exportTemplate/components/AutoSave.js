import React from "react"
import { Icon } from 'antd'
import './AutoSave.less'

const types = {
	'saving': <span>
		<Icon style={{ fontSize: '16px' }} type="loading" theme="outlined" />
		<span style={{ verticalAlign: "top", marginLeft: '6px' }}>保存中...</span>
	</span>,
	'save_failed': <span style={{color:'red'}}>自动保存失败, 请手动保存</span>,
	'save_success': <span>已自动保存</span>,
	'default': ''
}


const AutoSave = ({ type = 'default' }) => {
	return <div className='auto-save-display'>{types[type]}</div>
}

export default AutoSave
