import Interface from '../constans/Interface'
import { createHttpAction } from 'redux-action-extend'
import api from '../../api'

export const getBusinessAccountingList = (obj) => dispath => {
	return api.get('/commission/calculation_result/sale_commission/list', { params: obj }).then(response => {
		const { data } = response;
		dispath({ type: 'GET_BUSINESS_ACCOUNTING_LIST', payload: data, write_off_status: obj.write_off_status });
	})
}

export const {
	getBusinessToken,
	getBusinessToken_success
} = createHttpAction('getBusinessToken', Interface.getBusinessToken, {
	method: 'get',
	ignoreToast: true
});
export const {
	postWriteOff,
	postWriteOff_success
} = createHttpAction('postWriteOff', Interface.postWriteOff, {
	method: 'post',
	ignoreToast: true
});
