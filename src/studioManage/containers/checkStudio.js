import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as studioActions from "../actions";
import { message, Button, Skeleton } from 'antd'
import { WBYDetailTable } from "wbyui"
import { detailColumns } from '../constants'
import './studioManage.less'
import qs from 'qs'

class CheckStudio extends React.Component {
	constructor() {
		super();
		this.state = {
			loading: false
		}
	}
	componentDidMount() {
		const search = qs.parse(this.props.location.search.substring(1));
		this.queryData({ id: search.id, page: 1, page_size: 20 });
	}
	queryData = (obj, func) => {
		this.setState({ loading: true });
		return this.props.actions.getStudioCheck({ ...obj }).then(() => {
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
		const { loading } = this.state;
		const { studioCheck } = this.props;
		return <div className='check-studio-container'>
			<Skeleton loading={loading} active >
				<DetailTable data={studioCheck} />
			</Skeleton>
			<div style={{ textAlign: 'center', paddingTop: '20px' }}>
				<Button type='primary' size='large' onClick={() => {
					window.close()
				}}>关闭</Button>
			</div>
		</div>

	}
}

const mapStateToProps = (state) => {
	return {
		studioCheck: state.studioManage.studioCheck,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...studioActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(CheckStudio)


function DetailTable({ data }) {
	return <table className='detail-table'>
		<tbody>
			<tr>
				<td>工作室名称：</td>
				<td>{data.name}</td>
				<td>打款标识：</td>
				<td>{data.identity}</td>
			</tr>
			<tr>
				<td>类型：</td>
				<td>{data.type_display}</td>
				<td>支持平台：</td>
				<td>{data.supported_platforms_display}</td>
			</tr>
			<tr>
				<td>快易提：</td>
				<td>{data.is_support_flash == 1 ? '支持' : '不支持'}</td>
				<td>非身份证：</td>
				<td>{data.is_support_not_id_card == 1 ? '支持' : '不支持'}</td>
			</tr>
			<tr>
				<td>总限额：</td>
				<td>{data.total_limit / 100}</td>
				<td>冻结额度：</td>
				<td>{data.total_freeze / 100}</td>
			</tr>
			<tr>
				<td>使用额度：</td>
				<td>{data.total_limit / 100}</td>
				<td>剩余额度：</td>
				<td>{data.remaining_amount / 100}</td>
			</tr>
			<tr>
				<td>单笔限额：</td>
				<td>{data.single_limit / 100}</td>
				<td>博主单月累计限额：</td>
				<td>{data.monthly_limit / 100}</td>
			</tr>
			<tr>
				<td>支付方式：</td>
				<td colSpan={3}>{data.is_support_alipay == 1 ? '支付宝&银行卡' : '银行卡'}</td>
			</tr>
			<tr>
				<td>银行卡开户行：</td>
				<td>{data.bank_agency}</td>
				<td>开户支行：</td>
				<td>{data.bank_agency}</td>
			</tr>
			<tr>
				<td>开户行所在省：</td>
				<td>{data.bank_agency_province}</td>
				<td>开户行所在市：</td>
				<td>{data.bank_agency_city}</td>
			</tr>
			<tr>
				<td>持卡人：</td>
				<td>{data.real_name}</td>
				<td>卡号：</td>
				<td>{data.card_number}</td>
			</tr>
			<tr>
				<td>支付宝名称：</td>
				<td>{data.alipay_real_name}</td>
				<td>支付宝账号：</td>
				<td>{data.alipay_card_number}</td>
			</tr>
			<tr>
				<td>税率：</td>
				<td>{data.invoice_tax_rate}</td>
				<td>发票抬头：</td>
				<td>{data.invoice_provider}</td>
			</tr>
			<tr>
				<td>操作人：</td>
				<td>{data.operator_real_name}</td>
				<td>有效期：</td>
				<td>{data.validity_start + '~' + data.validity_end}</td>
			</tr>
			<tr>
				<td>备注：</td>
				<td>{data.remark}</td>
				<td>修订时间：</td>
				<td>{data.modified_at}</td>
			</tr>
		</tbody>
	</table>
}
