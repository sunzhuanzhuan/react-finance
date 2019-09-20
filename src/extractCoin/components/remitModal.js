import React from 'react'
import { Table, Modal, Button } from "antd";
import { addKeys } from "../constans/manageConfig";
import { billingPartner } from '../constans/constant'

class RemitModal extends React.Component {
	render() {
		const { visible, columns, loading, onCancel, titleData, excelData, partner_type } = this.props;
		return <Modal className='remitOrder-output-modal' width={800} visible={visible} closable={false} title={'请选择打款单导出'} footer={[
			<Button key="back" onClick={onCancel}>关闭</Button>
		]}>
			{titleData && excelData ? Object.keys(titleData).map((item, index) => {
				addKeys(excelData[0][item]);
				if (partner_type === billingPartner['WORK_WITH_COMPANY']) {
					return index === 1 ? <div key={item}>
						<div className='output-title'>{titleData[item]}</div>
						<Table className='topGap' columns={columns} dataSource={excelData[0][item]} loading={loading} pagination={false} bordered></Table>
					</div> : null
				} else {
					return <div key={item}>
						<div className={index === 0 ? 'output-title' : 'topGap output-title'}>{titleData[item]}</div>
						<Table className='topGap' columns={columns} dataSource={excelData[0][item]} loading={loading} pagination={false} bordered></Table>
					</div>
				}

			}) : null}
		</Modal>
	}
}
export default RemitModal;
