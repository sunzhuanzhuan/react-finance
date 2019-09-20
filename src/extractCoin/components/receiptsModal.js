import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as remitOrderActions from "../action/remitOrder";
import { receiptsConfig } from "../constans/manageConfig";
import { tabListConfig, billingPartner } from "../constans/constant"
import { Link } from 'react-router-dom'
import { Button, Modal, Tabs, message } from "antd";
import ReceiptsTable from '../components/receiptsTable'
import qs from 'qs';

const TabPane = Tabs.TabPane;

class ReceiptsModal extends React.Component {
	constructor() {
		super();
		this.state = {
			newRandomKey: 1,
			current_tab: 1,
			receiptsLoading: false,
			curSelectRowKeys: []
		}
	}
	getNewRandomKey = () => {
		return Math.random() * 100 + 1000;
	}
	componentDidMount() {
		let { questParams } = this.props;
		let tabKey;//tab显示第几个
		this.setState({ receiptsLoading: true });
		if (questParams.partner_type === billingPartner['WORK_WITH_COMPANY']) {
			tabKey = 2;
		} else {
			tabKey = 1;
		}
		this.setState({ current_tab: tabKey });
		this.props.actions.getBillList({ page: 1, status: questParams.status, id: questParams.id, status_type: tabKey }).then(() => {
			if (!this.unmounted) {
				this.setState({ receiptsLoading: false });
			}
		}).catch(() => {
			message.error('加载失败，请重试')
		});
	}
	componentWillUnmount() {
		this.unmounted = true;
	}
	tabsChange = async (key) => {
		let { questParams } = this.props;
		let { check_receipts } = this.props.remitOrder;
		await this.setState({ current_tab: key });
		let { current_tab } = this.state;
		if (!check_receipts[current_tab]) {
			this.setState({ receiptsLoading: true })
			this.props.actions.getBillList({ page: 1, status: questParams.status, id: questParams.id, status_type: key }).then(() => {
				this.setState({ receiptsLoading: false });
			}).catch(() => {
				message.error('加载失败，请重试')
			})
		}
	}
	render() {
		let { visible, onCancel, questParams } = this.props;
		let { check_receipts } = this.props.remitOrder;
		let { current_tab, receiptsLoading } = this.state;
		let dataSource = check_receipts[current_tab] ? check_receipts[current_tab].data : [];
		let tabList = tabListConfig(questParams.partner_type);
		return <Modal key={this.state.newRandomKey} visible={visible} title={'单据导出'} width={800}
			onCancel={() => {
				onCancel();
				this.setState({ newRandomKey: this.getNewRandomKey(), curSelectRowKeys: [] })
			}}
			footer={[
				<Button key="receiptsBack" style={{ marginRight: '20px' }} onClick={() => {
					onCancel();
					this.setState({ newRandomKey: this.getNewRandomKey() })
				}}>关闭</Button>,
				<Link key='previewLink' target='_blank' replace to={{
					pathname: '/finance/remitOrder/paymentOrder',
					search: '?' + qs.stringify({ id: questParams.id, status: questParams.status, status_type: current_tab, type: 'all' }),
				}}>
					<Button key="preview" type='primary' disabled={!(dataSource && dataSource.length > 0)}>全部预览</Button>
				</Link>
			]}>
			{questParams && questParams.status === 0 ?
				<Tabs type="card" onChange={this.tabsChange}>
					{tabList.map(item => {
						return <TabPane tab={item.title} key={item.key}>
							<ReceiptsTable columns={receiptsConfig} dataSource={dataSource}
								loading={receiptsLoading}
								questParams={questParams}
								current_tab={current_tab}
							></ReceiptsTable>
						</TabPane>
					})}
				</Tabs> :
				<ReceiptsTable columns={receiptsConfig}
					dataSource={dataSource}
					loading={receiptsLoading}
					questParams={questParams}
					current_tab={current_tab}
				>
				</ReceiptsTable>
			}
		</Modal>
	}
}
const mapStateToProps = (state) => {
	return {
		remitOrder: state.withdraw.remitOrder
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...remitOrderActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(ReceiptsModal)
