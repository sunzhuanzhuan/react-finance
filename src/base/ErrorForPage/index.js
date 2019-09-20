import React from "react"
import { Alert } from 'antd'

const ErrorForPage = ({ errorMessage }) => {

	return <Alert
		message="错误!"
		description={errorMessage || '未知错误'}
		type="error"
		showIcon
	/>
}

export default ErrorForPage
