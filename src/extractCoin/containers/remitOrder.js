import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as remitOrderActions from "../action/remitOrder";
import { outputRemitConfig, remitOrderFunc } from "../constans/manageConfig";
import "./remitOrder.less";
import { Button, Row, Form, Table, Modal, message, Checkbox } from "antd";
import RemitQuery from '../components/remitOrder/listQuery'
import NewRemitModal from "../components/newRemitModal";
import ReceiptsModal from '../components/receiptsModal'
import RemitModal from '../components/remitModal'
import StudioModal from '../components/remitOrder/studioModal'
import qs from 'qs'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

class RemitOrderManage extends React.Component {
	constructor() {
		super();
		this.state = {
			newVisible: false,
			outputVisible: false,
			receiptsVisible: false,
			remitOrderLoading: false,
			remitOrderPageSize: 20,
			filterParams: {},
			questParams: {},
			outputLoading: false,
			curPage: 1,
			selectedRowKeys: [],
			rowsMap: {},
			studioVisible: false,
		}
	}
	componentDidMount() {
		this.requestList();
	}
	handlefilterParams = (filterParams) => {
		this.setState({ filterParams });
	}
	requestList = () => {
		this.setState({ remitOrderLoading: true });
		const search = qs.parse(this.props.location.search.substring(1));
		if (search.id) {
			this.props.actions.getPaymentSlipList({ page: 1, limit_num: 20, id: search.id }).then(() => {
				this.setState({ remitOrderLoading: false });
			});
		} else {
			this.props.actions.getPaymentSlipList({ page: 1, limit_num: 20 }).then(() => {
				this.setState({ remitOrderLoading: false });
			});
		}

	}
	handleSearch = () => {
		this.setState({ remitOrderLoading: true })
		let { validateFields } = this.props.form;
		let { remitOrderPageSize } = this.state;
		let values = {};
		validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}
			values = {
				...fieldsValue,
				limit_num: remitOrderPageSize,
				'start_time': fieldsValue['created_time'] && fieldsValue['created_time'].length > 0 ? fieldsValue['created_time'][0].format('YYYY-MM-DD') : null,
				'end_time': fieldsValue['created_time'] && fieldsValue['created_time'].length > 1 ? fieldsValue['created_time'][1].format('YYYY-MM-DD') : null
			};
			delete values['created_time'];
			Object.keys(values).forEach(item => {
				if (!values[item]) {
					delete values[item];
				}
			});
		});
		this.setState({ filterParams: values });
		this.props.actions.getPaymentSlipList(values).then(() => {
			this.setState({ remitOrderLoading: false })
		});
	}
	newRemitOrder = () => {
		this.setState({ newVisible: true });
	}
	handleReceiptsVisible = (record) => {
		this.setState({ receiptsVisible: true, questParams: record });
	}
	closeNewModal = () => {
		this.setState({ newVisible: false });
	}
	closeReceiptsModal = () => {
		this.props.actions.clearBillList();
		this.setState({ receiptsVisible: false });
	}
	handleTipOk = (status, id) => {
		let { paymentSlipPayed, paymentSlipReturned, paymentSlipPayedTax, getPaymentSlipList } = this.props.actions;
		let { remitOrderPageSize, filterParams, curPage } = this.state;
		const hide = message.loading('操作中，请稍候...', 1);
		if (status === 0) {
			paymentSlipPayed({ id }).then(() => {
				getPaymentSlipList({ page: curPage, limit_num: remitOrderPageSize, ...filterParams }).then(() => {
					message.success('操作成功');
					hide();
				});
			}).catch(() => {
				hide();
				message.error('操作失败');
			});
		} else if (status === 1) {
			paymentSlipReturned({ id }).then(() => {
				getPaymentSlipList({ page: curPage, limit_num: remitOrderPageSize, ...filterParams }).then(() => {
					message.success('操作成功');
					hide();
				});
			}).catch(() => {
				hide();
				message.error('操作失败');
			});
		} else if (status === 2) {
			paymentSlipPayedTax({ id }).then(() => {
				getPaymentSlipList({ page: curPage, limit_num: remitOrderPageSize, ...filterParams }).then(() => {
					message.success('操作成功');
					hide();
				});
			}).catch(() => {
				hide();
				message.error('操作失败');
			});
		} else {
			message.error('未知错误，请重试', 1)
		}
	}
	handleTipVisible = (status, id) => {
		Modal.confirm({
			title: status === 0 ? '请确认是否已打款' : status === 1 ? '请确认是否已还款' : '请确认是否已结税',
			okText: status === 0 ? '已打款' : status === 1 ? '已还款' : '已结税',
			onOk: () => { this.handleTipOk(status, id) }
		})
	}
	handleOutputDetail = (id, record) => {
		const hide = message.loading('页面加载中，请稍候...', 1);
		this.setState({ outputLoading: true, questParams: record });
		this.props.actions.excelNameList({ id }).then(() => {
			this.setState({ outputVisible: true, outputLoading: false }, () => {
				hide();
			});
		}).catch(({ errorMsg }) => {
			hide();
			message.error(errorMsg || '加载失败，请刷新页面')
		})
	}
	handleChangeStudio = () => {
		if (this.state.selectedRowKeys.length > 0) {
			this.setState({ studioVisible: true });
		} else {
			message.error('请先勾选要更换的工作室')
		}

	}
	handleCloseStudio = () => {
		this.setState({ studioVisible: false });
	}

	onSelectChange = (selectedRowKeys, selectedRows) => {
		const rowsMap = selectedRowKeys.reduce((data, item) => {
			const row = selectedRows.find(it => it.id.toString() === item);
			return row ? { ...data, [item]: row } : { ...data, [item]: this.state.rowsMap[item] }
		}, {});
		this.setState({ selectedRowKeys, rowsMap })
	}
	handleCheckAll = e => {
		const { remitOrderData: { data = [] } } = this.props;
		const { rowsMap } = this.state;
		let obj;
		if (e.target.checked) {
			obj = data.reduce((data, item) => {
				return { ...data, [item.id]: item }
			}, rowsMap);
		} else {
			obj = { ...rowsMap };
			data.forEach(item => delete obj[item.id.toString()]);
		}
		this.onSelectChange(Object.keys(obj), Object.values(obj));
	}
	handleRestSelectKey = () => {
		this.setState({ selectedRowKeys: [], rowsMap: {} })
	}
	render() {
		let { newVisible, remitOrderLoading, outputVisible, remitOrderPageSize, filterParams, outputLoading, receiptsVisible, questParams, selectedRowKeys, rowsMap, studioVisible } = this.state;
		console.log('%crowsMap: ', 'color: MidnightBlue; background: Aquamarine; font-size: 20px;', rowsMap);
		let { remitOrderData: { data = [], total = 20, current_page = 1, payment_slip_status_name }, excel_name_list: { title, excel } } = this.props;
		const checked = data.every(item => selectedRowKeys.includes(item.id.toString()));
		let remitOrderConfig = remitOrderFunc(payment_slip_status_name, this.handleOutputDetail, this.handleReceiptsVisible, this.handleTipVisible);
		let paginationObj = {
			onChange: (current) => {
				this.setState({ remitOrderLoading: true, curPage: current });
				this.props.actions.getPaymentSlipList({ page: current, ...filterParams, limit_num: remitOrderPageSize }).then(() => {
					this.setState({ remitOrderLoading: false });
				});
			},
			onShowSizeChange: (current, pageSize) => {
				this.setState({ remitOrderLoading: true, remitOrderPageSize: pageSize, curPage: current });
				this.props.actions.getPaymentSlipList({ page: current, limit_num: pageSize, ...filterParams }).then(() => {
					this.setState({ remitOrderLoading: false });
				});
			},
			total: total,
			current: current_page,
			pageSize: remitOrderPageSize,
			showQuickJumper: true,
			showSizeChanger: true,
			pageSizeOptions: ['20', '50', '100', '200']
		};
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};
		return <div className='remitOrder'>
			<RemitQuery
				limit_num={remitOrderPageSize}
				questAction={this.props.actions.getPaymentSlipList}
				handlefilterParams={this.handlefilterParams}
			></RemitQuery>
			<Row className='topGap'>
				<Button type='primary' onClick={this.newRemitOrder}>新建打款单</Button>
				<Button className='left-gap' type='primary' onClick={this.handleChangeStudio}>更换工作室</Button>
			</Row>
			<Table className='topGap'
				rowKey={record => { return record.id.toString() }}
				columns={remitOrderConfig}
				dataSource={data}
				pagination={paginationObj}
				loading={remitOrderLoading}
				bordered
				rowSelection={rowSelection}
				footer={() => {
					return <Checkbox onChange={this.handleCheckAll} disabled={data.length == 0} checked={data.length > 0 && checked}>全选</Checkbox>
				}}
			></Table>
			{newVisible ? <NewRemitModal visible={newVisible} onCancel={this.closeNewModal}
				requestList={this.requestList} /> : null}
			<RemitModal visible={outputVisible}
				columns={outputRemitConfig}
				loading={outputLoading}
				onCancel={() => { this.setState({ outputVisible: false }) }}
				titleData={title}
				excelData={excel}
				partner_type={questParams.partner_type}
			></RemitModal>
			{receiptsVisible ? <ReceiptsModal visible={receiptsVisible} onCancel={this.closeReceiptsModal} questParams={questParams} /> : null}
			{studioVisible && <StudioModal visible={studioVisible}
				handleRestSelectKey={this.handleRestSelectKey}
				requestList={this.requestList}
				handleCloseStudio={this.handleCloseStudio}
				selectedRowKeys={selectedRowKeys}
				onCancel={() => { this.setState({ studioVisible: false }) }}
				rowsMap={rowsMap}
			/>}
		</div>
	}
}
const mapStateToProps = (state) => {
	return {
		remitOrderData: state.withdraw.remitOrderData,
		excel_name_list: state.withdraw.excel_name_list,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...remitOrderActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(RemitOrderManage))
