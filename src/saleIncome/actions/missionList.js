import Interface from '../constans/Interface'
import { createHttpAction } from 'redux-action-extend'

export const {
	getMissionList,
	getMissionList_success
} = createHttpAction('getMissionList', Interface.getMissionList, {
	method: 'get'
});

export const {
	getMissionSale,
	getMissionSale_success
} = createHttpAction('getMissionSale', Interface.getMissionSale, {
	method: 'get'
});

export const {
	postCreateMission,
	postCreateMission_success
} = createHttpAction('postCreateMission', Interface.postCreateMission, {
	method: 'post',
	ignoreToast: true
});

export const {
	postUpdateMission,
	postUpdateMission_success
} = createHttpAction('postUpdateMission', Interface.postUpdateMission, {
	method: 'post',
	ignoreToast: true
});

export const {
	postDeleteMission,
	postDeleteMission_success
} = createHttpAction('postDeleteMission', Interface.postDeleteMission, {
	method: 'post',
	ignoreToast: true
});
