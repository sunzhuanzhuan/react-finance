import React from "react"
import { Modal } from 'antd'
import './index.less'

const FullScreenModal = ({ show ,title, children, className = '',onCancel }) => {
	const modalProps = {
		wrapClassName: 'full-screen-modal-container ' + className,
		width: '100%',
		footer: null
	}
	return show ? <Modal {...modalProps} visible={true} title={title} onCancel={onCancel}>
		{children}
	</Modal> :null
}

export default FullScreenModal
