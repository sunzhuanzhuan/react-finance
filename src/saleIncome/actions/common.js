import Interface from '../constans/Interface'
import { createHttpAction } from 'redux-action-extend'

export const {
	getMetadata,
	getMetadata_success
} = createHttpAction('getMetadata', Interface.getMetadata, {
	method: 'get'
});

export const {
	getSalesName,
	getSalesName_success
} = createHttpAction('getSalesName', Interface.getSalesName, {
	method: 'get'
});
