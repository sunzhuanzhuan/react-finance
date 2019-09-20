import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as remitOrderActions from "../action/remitOrder";
import { newRemitFunc } from "../constans/manageConfig";
import "../containers/remitOrder.less";
import { Button, Input, Row, Col, Form, Select, Table, Modal, message } from "antd";

const FormItem = Form.Item;
const Option = Select.Option;

class NewRemitModal extends React.Component {
	constructor() {
		super();
		this.state = {
			newRemitLoading: false,
			filterParams: { slip_type: 4 },
			newRemitOrderPageSize: 10,
			newOrderSelectedRowKeys: [],
			submitDisable: true,
			slip_type: 4,
			curSelectRowKeys: [],
			clearFlag: false
		}
	}
	componentDidMount() {
		this.setState({ newRemitLoading: true });
		this.props.actions.getPaymentSlipOrderList({ slip_type: 4, limit_num: 10 }).then(() => {
			if (!this.unmounted) {
				this.setState({ newRemitLoading: false });
			}
		});
	}
	componentWillUnmount() {
		this.unmounted = true;
	}
	handleSearch = () => {
		this.setState({ newRemitLoading: true });
		let { slip_type } = this.state;
		let { validateFields, getFieldValue } = this.props.form;
		let values = {};
		let slipType = getFieldValue('slip_type');
		validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}
			values = { ...fieldsValue };
			Object.keys(values).forEach(item => {
				if (!values[item]) {
					delete values[item];
				}
			});
			this.setState({ filterParams: values });
			if (slipType != slip_type) {
				this.setState({ slip_type: slipType, clearFlag: true, curSelectRowKeys: [], submitDisable: true });
			}
			this.props.actions.getPaymentSlipOrderList(values).then(() => {
				this.setState({ newRemitLoading: false });
			});
		});
	}
	handleSubmit = () => {
		const hide = message.loading('处理中，请稍后...');
		let { newOrderSelectedRowKeys, filterParams } = this.state;
		this.setState({ submitDisable: true })
		this.props.actions.addPaymentSlip({ ids: newOrderSelectedRowKeys }).then(response => {
			if (response.code === 200) {
				hide();
				this.setState({ submitDisable: false })
				message.success(response.msg || response.message || '提交成功', 1)
				this.props.actions.getPaymentSlipOrderList(filterParams).then(() => {
					this.props.requestList();
					this.props.onCancel();
				});
			} else {
				hide();
				this.setState({ submitDisable: false })
				message.warning(response.msg || response.message || '提交失败', 1)
			}
		})
	}
	render() {
		let { getFieldDecorator } = this.props.form;
		let { visible, onCancel } = this.props;
		let { newRemitOrderData: { data, total = 10, current_page = 1, user_name } } = this.props;
		let { newRemitLoading, filterParams, newRemitOrderPageSize, submitDisable, clearFlag } = this.state;
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		const newRemitConfig = newRemitFunc(user_name);
		let rowSelectionObj = {
			selectedRowKeys: this.state.curSelectRowKeys,
			onChange: (selectedRowKeys) => {
				if (clearFlag) {
					selectedRowKeys = selectedRowKeys.filter(item => {
						return !this.state.curSelectRowKeys.includes(item)
					});
					this.setState({ clearFlag: false });
				}
				this.setState({ newOrderSelectedRowKeys: selectedRowKeys, curSelectRowKeys: selectedRowKeys }, () => {
					this.state.curSelectRowKeys.length > 0 ? this.setState({ submitDisable: false }) : this.setState({ submitDisable: true });
				});
			},
			getCheckboxProps: record => ({
				disabled: !!record.payment_slip_id
			}),
		};
		let newPaginationObj = {
			onChange: (current) => {
				this.setState({ newRemitLoading: true });
				this.props.actions.getPaymentSlipOrderList({ page: current, ...filterParams, limit_num: newRemitOrderPageSize }).then(() => {
					if (!this.unmounted) {
						this.setState({ newRemitLoading: false });
					}
				});
			},
			onShowSizeChange: (current, pageSize) => {
				this.setState({ newRemitLoading: true, newRemitOrderPageSize: pageSize });
				this.props.actions.getPaymentSlipOrderList({ page: current, limit_num: pageSize, ...filterParams }).then(() => {
					this.setState({ newRemitLoading: false });
				});
			},
			total: total,
			current: current_page,
			pageSize: newRemitOrderPageSize,
			showQuickJumper: true,
			showSizeChanger: true,
			pageSizeOptions: ['10', '20', '50', '100']
		}
		return <div>
			<Modal className='remitOrder' width={1200} visible={visible} closable={false} footer={[
				<Button key="back" onClick={onCancel}>取消</Button>,
				<Button key="submit" type="primary" onClick={this.handleSubmit} disabled={submitDisable}>提交</Button>
			]}>
				<Form className='remitOrder-search-form'>
					<Row type="flex" justify="start" gutter={24} style={{ padding: '10px 0' }}>
						<Col span={5}>
							<FormItem className='special-one' label='主账号名：' {...formItemLayout}>
								{getFieldDecorator('user_name')(
									<Input placeholder="请输入" />
								)}
							</FormItem>
						</Col>
						<Col span={5}>
							<FormItem className='special-one' label='提现单号：' {...formItemLayout}>
								{getFieldDecorator('withdraw_id')(
									<Input placeholder="请输入" />
								)}
							</FormItem>
						</Col>
						<Col span={5}>
							<FormItem className='special-one' label='合作方式：' {...formItemLayout}>
								{getFieldDecorator('slip_type', { initialValue: '4', rules: [{ required: true, message: '请选择合作方式' }] })(
									<Select key='slip_type' placeholder="请选择">
										<Option value="1">公司</Option>
										<Option value="4">工作室</Option>
									</Select>
								)}
							</FormItem>
						</Col>
						<Col span={5}>
							<FormItem className='special-one' label='打款单：' {...formItemLayout}>
								{getFieldDecorator('is_payed', { initialValue: '' })(
									<Select key='is_payed'>
										<Option value="">不限</Option>
										<Option value="1">未关联</Option>
										<Option value="2">已关联</Option>
									</Select>
								)}
							</FormItem>
						</Col>
						<Col span={4}>
							<Button style={{ float: 'right' }} type="primary" onClick={this.handleSearch}>查询</Button>
						</Col>
					</Row>
				</Form>
				<Table className='topGap'
					rowKey='id'
					columns={newRemitConfig}
					dataSource={data}
					pagination={newPaginationObj}
					rowSelection={rowSelectionObj}
					loading={newRemitLoading}
					bordered
				>
				</Table>
			</Modal>
		</div >
	}
}
const mapStateToProps = (state) => {
	return {
		newRemitOrderData: state.withdraw.newRemitOrderData,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...remitOrderActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(NewRemitModal))
