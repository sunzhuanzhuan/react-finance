import Interface from '../constans/Interface'
import { createHttpAction } from 'redux-action-extend'

export const {
	postMissionInput,
	postMissionInput_success
} = createHttpAction('postMissionInput', Interface.postMissionInput, {
	method: 'post',
	ignoreToast: true
});

