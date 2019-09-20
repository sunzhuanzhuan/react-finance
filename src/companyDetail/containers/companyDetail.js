import React, { Component } from 'react';
import AccountDetail from '../components/companyDetail/accountDetail';
import AccountFlow from '../components/companyDetail/accountFlow';
import './golden.less';
import qs from 'qs';

class CompanyDetail extends Component {
	render() {
		const search = qs.parse(this.props.location.search.substring(1));
		return <div>
			<AccountDetail id={search.company_id} search={search} />
			<AccountFlow id={search.company_id} search={search} />
		</div>
	}
}

export default CompanyDetail
