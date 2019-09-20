import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { withRouter } from 'react-router-dom';
import * as goldenActions from "../../actions/goldenApply";
import { Table, message, Alert } from "antd";
import Scolltable from '@/components/Scolltable';

class PreTable extends React.Component {
	constructor() {
		super();
		this.state = {
			data: []
		}
	}
	componentDidMount() {
		const { curSelectRows, applicationPreview, isApplication, applicationDetail: { list = [] }, readjustType } = this.props;
		let array = isApplication ? list : curSelectRows;
		let isShowWarning;
		let isExistWarning;
		let previewRateVal;

		const ary = array.map(item => {
			isShowWarning = false;
			const minSellPrice = applicationPreview[item['order_id']] || [];
			minSellPrice.forEach(minItem => {
				const { price_id, min_sell_price, profit_rate, service_rate } = minItem;
				previewRateVal = item['quote_type'] == 1 ? profit_rate : service_rate;
				const bottomItem = item['price'].find(bottomItem => bottomItem.price_id == price_id) || {};
				if((min_sell_price - bottomItem.base_price) < 0) {
					isShowWarning = true;
					isExistWarning = true;
				}
			})

			let obj = {
				['order_id']: item['order_id'],
				['status']: item['status'],
				['company_name']: item['company_name'],
				['project_name']: item['project_name'],
				['requirement_id']: item['requirement_id'],
				['requirement_name']: item['requirement_name'],
				['platform_name']: item['platform_name'],
				['platform_id']: item['platform_id'],
				['account_id']: item['account_id'],
				['brand_name']: item['brand_name'],
				['identity_name']: item['identity_name'],
				['weibo_name']: item['weibo_name'],
				['plan_manager_id']: item['plan_manager_id'],
				['pre_min_sell_price']: minSellPrice,
				['price']: item['price'],
				['quote_type']: item['quote_type'],
				['warningClass']: isShowWarning ? 'warning_wrapper' : '',
				['previewReadjustType']: readjustType,
				['previewRateVal']: previewRateVal,
				['default_cycle']: item['default_cycle'],
				['order_default_cycle']: item['order_default_cycle'],
				['partner_type_name']: item['partner_type_name']
			};
			return obj
		});
		this.setState({ data: ary, isExistWarning })
	}
	queryData = (obj, func) => {
		this.setState({ loading: true });
		return this.props.actions.getApplicationDetail({ ...obj }).then(() => {
			if (func && Object.prototype.toString.call(func) === '[object Function]') {
				func();
			}
			this.setState({ loading: false })
		}).catch(({ errorMsg }) => {
			this.setState({ loading: false });
			message.error(errorMsg || '列表加载失败，请重试！');
		})
	}
	render() {
		const { data, isExistWarning } = this.state;
		const { columns, isApplication, readjustId, companyId, applicationDetail: { page, total } } = this.props;
		let applicationPaginationObj = {
			onChange: (current) => {
				this.queryData({ page: current, page_size: 50, status: 1, readjust_application_id: readjustId, company_id: companyId });
			},
			total: parseInt(total),
			current: parseInt(page),
			pageSize: 50,
			showQuickJumper: true,
		};
		let paginationObj = {
			total: parseInt(data.length),
			showQuickJumper: true,
		};
		return (
			<div>
				{isExistWarning ? <Alert closable style={{marginBottom: '20px'}} message="请注意标红的订单：订单最低售卖价小于订单底价，建议修改调价类型/利润率/服务费率。" type="warning" showIcon /> : null}
				<Scolltable isMoreThanOne scrollClassName='.preTable .ant-table-body' widthScroll={3670}>
					<Table 
						rowKey='order_id' 
						className='preTable'
						columns={columns} 
						dataSource={data} 
						bordered 
						pagination={isApplication ? applicationPaginationObj : paginationObj} 
						scroll={{ x: 3300 }}
					/>
				</Scolltable>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		applicationDetail: state.companyDetail.applicationDetail,
		applicationPreview: state.companyDetail.applicationPreview,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...goldenActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PreTable))
