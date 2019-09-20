import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { message } from 'antd'
import qs from 'qs'

import * as zhangActions from '../actions/index';
import Query from'../components/query'
import { zhangListFunc } from '../constants/column';

import './list.less'
import ZhangWuTable from '../components/table'


class List extends Component {
	constructor(props) {
		super(props)
		
	}
	state={
		loading:false,
		page_size: 20,
		filterParams: {}
	}
	componentWillMount=()=>{
		// const search = qs.parse(this.props.location.search.substring(1));
		this.queryData({ page: 1, page_size: this.state.page_size });
		this.props.actions.getSearchDetail()
	}

	handleNewModal=({order_id})=>{
		// console.log(order_id)
		this.props.history.push({
			pathname: '/finance/zhangwu/detail',
			search: `?${qs.stringify({ order_id: order_id})}`,
		});
	}
	queryData = (obj, func) => {
		this.setState({ loading: true });
		return this.props.actions.getAccountList({ ...obj }).then(() => {
			if (func && Object.prototype.toString.call(func) === '[object Function]') {
				func();
			}
			this.setState({ loading: false })
		}).catch(({ errorMsg }) => {
			this.setState({ loading: false });
			message.error(errorMsg || '列表加载失败，请重试！');
		})
	}
	handlefilterParams = (filterParams) => {
		this.setState({ filterParams });
	}
	render(){
		
		const columns = zhangListFunc(this.handleNewModal);
		const { searchDetail,accountList: { list = [], page, total,page_size }}=this.props;
		let {filterParams}=this.state;
		// console.log(searchDetail)
		let paginationObj = {
			onChange: (current) => {
				// let obj = { ...search.key, page: current, page_size  ,...filterParams}
				console.log(filterParams)
				this.queryData({ page: current, page_size, ...filterParams });
			},
			total: parseInt(total),
			current: parseInt(page),
			pageSize: parseInt(page_size),
			showQuickJumper: true,
			
		};
		return<div>
		<fieldset className='fieldset_css'>
			<legend>订单账务详情</legend>
			<Query
			history={this.props.history}
			handlefilterParams={this.handlefilterParams}
			questAction={this.queryData}
			accountList={this.props.accountList}
			page_size={page_size}
			searchDetail={searchDetail}
			/>
			<div className='top-gap'>
				<ZhangWuTable
					loading={this.state.loading}
					columns={columns}
					list={list}
					paginationObj={paginationObj}
					accountList={this.props.accountList}
					filterParams={this.state.filterParams}
				></ZhangWuTable>
			</div>
		</fieldset>
		
	</div>
	}
}

const mapStateToProps = (state) => {
	return {
		accountList: state.zhangWu.accountList,
		searchDetail:state.zhangWu.searchDetail
		
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...zhangActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(List)
