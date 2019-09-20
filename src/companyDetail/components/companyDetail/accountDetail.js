import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Table } from 'antd';
import { withRouter } from 'react-router-dom';
import * as companyDetailAction from '../../actions/companyDetail';
import { creditTitle, cashTitle, giftTitle, compensationTitle, coffersListFunc, companyAdjustFunc } from '../../constants'
import numeral from 'numeral';
import qs from 'qs';

class AccountDetail extends Component {
	constructor() {
		super();
		this.state = {

		}
	}
	componentDidMount() {
		const company_id = this.props.id;
		const { getCompanyDetail, getGoldenAccount, getReadjustPriceAccount, getGiftAccount } = this.props.actions;
		getCompanyDetail({ company_id }).then(() => {
			getGiftAccount({ company_id });
		});
		getGoldenAccount({ company_id });
		getReadjustPriceAccount({ company_id });
	}
	render() {
		const { id, companyDetail, companyDetail: { general = {}, credit = {}, cash = {} }, goldenAccount, readjustPriceAccount, giftAccount } = this.props;
		const giftList = giftAccount.filter(item => item.account_type === 2);
		const compensationList = giftAccount.filter(item => item.account_type === 6);
		const creditList = [{ ...credit, id: 1 }];
		const cashList = [{ ...cash, id: 1 }];
		const coffersListTitle = coffersListFunc(id);
		const ajustListTitle = companyAdjustFunc(id);
		return <div className='account-detail' >
			<Row type="flex" justify="start" gutter={16} >
				<Col><h3>公司简称：{companyDetail.name}</h3></Col>
				<Col><h3>销售：{companyDetail.sale_real_name}</h3></Col>
			</Row>
			<fieldset className='fieldset_css'>
				<legend>账户详情</legend>
				<Row type="flex" justify="start" gutter={16}>
					<Col>账户余额：<span className='red-font'>{general.total_amount ? numeral(general.total_amount).format('0.00') : '0.00'}元</span> </Col><Col>|</Col>
					<Col>账户可用余额：<span className='red-font'>{general.available_amount ? numeral(general.available_amount).format('0.00') : '0.00'}元</span> </Col><Col>|</Col>
					<Col>账户冻结金额： <span className='red-font'>{general.freeze_amount ? numeral(general.freeze_amount).format('0.00') : '0.00'}元</span></Col>
					<Col><a href='javascript:;' onClick={() => {
						this.props.history.push({
							pathname: '/finance/freeze/detail',
							search: `?${qs.stringify({ company_id: id })}`,
						});
					}
					}>查看详情</a></Col>
				</Row>
				<div className='company-detail-title'><span>信用账户</span></div>
				<Table columns={creditTitle} dataSource={creditList} pagination={false} rowKey='id' bordered />
				<div className='company-detail-title'><span>现金账户</span></div>
				<Table columns={cashTitle} dataSource={cashList} pagination={false} rowKey='id' bordered />
				<div className='company-detail-title'><span>赠送账户</span></div>
				<Table columns={giftTitle} dataSource={giftList} pagination={false} rowKey='id' bordered />
				<div className='company-detail-title'><span>赔偿账户</span></div>
				<Table columns={compensationTitle} dataSource={compensationList} pagination={false} rowKey='id' bordered />
				<div className='company-detail-title'><span>小金库</span></div>
				<Table columns={coffersListTitle} dataSource={goldenAccount} pagination={false} rowKey='id' bordered />
				<div className='company-detail-title'><span>定向调价</span></div>
				<Table columns={ajustListTitle} dataSource={readjustPriceAccount} pagination={false} rowKey='id' bordered />
			</fieldset>
		</div>
	}
}

const mapStateToProps = (state) => {
	return {
		companyDetail: state.companyDetail.companyDetail,
		goldenAccount: state.companyDetail.goldenAccount,
		readjustPriceAccount: state.companyDetail.readjustPriceAccount,
		giftAccount: state.companyDetail.giftAccount
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...companyDetailAction }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountDetail))
