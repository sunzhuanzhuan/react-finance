import Interface from '../constans/Interface'
import { createHttpAction } from 'redux-action-extend'

export const {
	getPreparation,
	getPreparation_success
} = createHttpAction('getPreparation', Interface.getPreparation, {
	method: 'get'
});

export const {
	getPreparationList,
	getPreparationList_success
} = createHttpAction('getPreparationList', Interface.getPreparationList, {
	method: 'get'
});

export const {
	getSearchPreparation,
	getSearchPreparation_success
} = createHttpAction('getSearchPreparation', Interface.getSearchPreparation, {
	method: 'get'
});

export const {
	postCreatePreparation,
	postCreatePreparation_success
} = createHttpAction('postCreatePreparation', Interface.postCreatePreparation, {
	method: 'post',
	ignoreToast: true
});

// export const {
// 	postUpdatePreparation,
// 	postUpdatePreparation_success
// } = createHttpAction('postUpdatePreparation', Interface.postUpdatePreparation, {
// 	method: 'post'
// });

export const {
	postDeletePreparation,
	postDeletePreparation_success
} = createHttpAction('postDeletePreparation', Interface.postDeletePreparation, {
	method: 'post',
	ignoreToast: true
});
