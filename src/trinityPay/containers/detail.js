import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as trinityPayAction from "../actions";
import { message, Button, Skeleton } from 'antd'
import { WBYDetailTable } from "wbyui"
import { prePayDetailColumns, datePayDetailColumns } from '../constants'
import './trinityPay.less'
import qs from 'qs'


class Detail extends React.Component {
	constructor() {
		super();
		this.state = {
			type: undefined,
			loading: false
		}
	}
	componentDidMount() {
		const search = qs.parse(this.props.location.search.substring(1));
		this.setState({ type: search.type });
		this.queryData({ payment_slip_id: search.payment_slip_id });
	}
	queryData = (obj, func) => {
		this.setState({ loading: true });
		return this.props.actions.getPayDetail({ ...obj }).then(() => {
			if (func && Object.prototype.toString.call(func) === '[object Function]') {
				func();
			}
			this.setState({ loading: false });
		}).catch(({ errorMsg }) => {
			this.setState({ loading: false });
			message.error(errorMsg || '详情加载失败，请重试！');
		})
	}
	render() {
		const { type, loading } = this.state;
		const { payDetail } = this.props;
		const detailColumns = type == 'prePay' ? prePayDetailColumns : type == 'datePay' ? datePayDetailColumns : [];
		return <div className='detail-container'>
			<fieldset className='fieldset_css'>
				<legend>打款单信息</legend>
				<Skeleton loading={loading} active >
					<WBYDetailTable className='vertical-table' isFilterZero={false} columns={detailColumns} dataSource={payDetail} columnCount={4} ></WBYDetailTable>
				</Skeleton>
				<div style={{ textAlign: 'center', paddingTop: '20px' }}>
					<Button type='primary' size='large' onClick={() => {
						window.close();
					}}>关闭</Button>
				</div>
			</fieldset>
		</div>
	}
}

const mapStateToProps = (state) => {
	return {
		payDetail: state.trinityPay.payDetail,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...trinityPayAction }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Detail)
