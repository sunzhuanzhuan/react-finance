import React from "react"
import { Icon } from 'antd'
import './index.less'

const index = ({status = false, onClick}) => {

	return <div className='collapse-switch' onClick={onClick}>
		{
			status ? <span><Icon type="minus" theme="outlined" /> 收起</span> : <span><Icon type="plus" theme="outlined" /> 展开</span>
		}
	</div>
}

export default index
