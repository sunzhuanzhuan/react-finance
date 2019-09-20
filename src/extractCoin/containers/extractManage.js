import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as extractActions from "../action/extractManage";
import ExtractQuery from '../components/extractManage/listQuery';
import { Table, message } from "antd";
import "./extractManage.less";
import { extractDetailFunc, extractNoDetailFunc } from '../constans/manageConfig'
import Scolltable from "../../components/Scolltable";

class ExtractManage extends React.Component {
	constructor() {
		super();
		this.state = {
			loading: false,
			hasDetail: false,
			filterParams: {}
		}
	}
	componentWillMount() {
		const { getApplyList, getFlashAuthorizations } = this.props.actions;
		this.setState({ loading: true });
		Promise.all([getApplyList({ page: 1 }), getFlashAuthorizations()]).then(() => {
			let selectObj = this.props.author.find(item => item.rule === "bool");
			let hasDetail = false;
			if (selectObj) {
				hasDetail = selectObj.permissions['flash.apply-detail.button'];
			} else {
				message.error('权限加载出错，刷新试试');
			}
			this.setState({ loading: false, hasDetail });
		}).catch(({ errorMsg }) => {
			this.setState({ loading: false });
			message.error(errorMsg || '列表加载出错，请重试')
		})
	}
	handlefilterParams = (filterParams) => {
		this.setState({ filterParams });
	}
	render() {
		const { applyData: { list, order_status, total, per_page, current_page } } = this.props;
		const { filterParams, loading } = this.state;
		const extractManageConfig = extractDetailFunc(order_status);
		const extractManageNoDetailConfig = extractNoDetailFunc(order_status);
		const columns = this.state.hasDetail ? extractManageConfig : extractManageNoDetailConfig;
		const paginationObj = {
			onChange: (current) => {
				this.setState({ loading: true });
				this.props.actions.getApplyList({ page: current, ...filterParams }).then(() => {
					this.setState({ loading: false });
				});
			},
			total,
			pageSize: per_page,
			current: current_page,
			showQuickJumper: true
		}
		return <div className='extractManage'>
			<ExtractQuery
				questAction={this.props.actions.getApplyList}
				handlefilterParams={this.handlefilterParams}
			></ExtractQuery>
			<Scolltable scrollClassName='.ant-table-body' widthScroll={1680}>
				<Table className='topGap'
					rowKey='id'
					scroll={{ x: 1680 }}
					columns={columns}
					dataSource={list}
					pagination={paginationObj}
					loading={loading}
					bordered />
			</Scolltable>
		</div>
	}
}

const mapStateToProps = (state) => {
	return {
		applyData: state.withdraw.applyData,
		author: state.withdraw.author
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...extractActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(ExtractManage)
