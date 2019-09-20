import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as remitOrderActions from "../../action/remitOrder";
import { Select, Modal, Button, Form, message } from "antd";
import './studioModal.less'
import numeral from 'numeral';

const FormItem = Form.Item;
const Option = Select.Option;

class StudioModal extends React.Component {
	constructor() {
		super();
		this.state = {

		}
	}
	componentDidMount() {
		this.props.actions.getFlashStudioList({ status: 1, page: 1, page_size: 100 });
	}
	handleOk = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const { selectedRowKeys } = this.props;
				const payment = selectedRowKeys.map(item => ({ source_id: item }));
				this.props.actions.postTransferStudio({ ...values, payment }).then((res) => {
					if (res.code == 1000 || res.code == 200) {
						message.success('工作室转移成功', 3)
						this.props.handleCloseStudio()
						this.props.requestList()
						this.props.handleRestSelectKey()
					} else {
						this.props.handleCloseStudio()
						this.props.requestList()

					}
				});

			}
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { visible, onCancel, rowsMap, selectedRowKeys, flashStudioList: { rows = [] } } = this.props;
		const total = Object.values(rowsMap).reduce((data, item) => {
			return data + parseFloat(item.occupy_amount);
		}, 0)
		return <Modal
			wrapClassName='studio-modal'
			title={null}
			visible={visible}
			maskClosable={false}
			onCancel={onCancel}
			footer={[
				<Button key="back" onClick={onCancel}>返回</Button>,
				<Button key="submit" type="primary" onClick={this.handleOk}>确认</Button>
			]}
		>
			<div className='modal-header'>
				<h3>请选择更换的工作室名称</h3>
				<p>注：<span className='red-font'>更换工作室以提现单为维度处理</span></p>
			</div>
			<div className='studio-list-container'>
				<div className='studio-list'>
					{Object.values(rowsMap).map((item, index) => (<div key={index}>
						<span>打款类型：快易提</span>
						<span style={{ display: 'inline-block', width: '110px' }} className='left-gap'>打款单ID：{item.id}</span>
						<span className='left-gap'>已冻结订单金额：{numeral(item.occupy_amount).format('0,0.00')}</span>
					</div>))}
					{selectedRowKeys.length > 20 && <div style={{ textAlign: 'center' }}>最多只显示20条哟~</div>}
				</div>
				<div>
					转移订单总金额：{numeral(total).format('0,0.00')}
				</div>
			</div>
			<div style={{ marginTop: '10px' }}>
				<p>转移工作室名称：</p>
				<Form>
					<FormItem>
						{getFieldDecorator('expect_studio_id', {
							rules: [{
								required: true, message: '请选择转移的目标工作室！'
							}]
						})(
							<Select className='studio-select'
								showSearch
								filterOption={(input, option) => {
									let value = option.props.value;
									let obj = rows.find(item => item.id === value);
									return obj.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
								}}
							>
								{rows.map(item => {
									return <Option key={item.id} value={item.id}>
										<p>{item.name}</p>
										<p>
											<span>剩余比例：{item.remaining_amount_ratio > 0 ? numeral(item.remaining_amount_ratio).format('0.00%') : numeral(0).format('0.00%')}</span>
											<span className='left-gap'>剩余额度：{numeral(item.remaining_amount / 100).format('0,0.00')}</span>
										</p>
									</Option>
								})}
							</Select>
						)}
					</FormItem>
				</Form>
			</div>
		</Modal>
	}
}

const mapStateToProps = (state) => {
	return {
		flashStudioList: state.withdraw.flashStudioList,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...remitOrderActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StudioModal))
