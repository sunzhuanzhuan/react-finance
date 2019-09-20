import { createAction } from 'redux-actions'
/**
 * actionType
 * endpoint  lwp方法名称
 * ignoreToast 不显示失败时通用提示
 * ignoreLoading 不显示请求时候通用loading  toast
 */
const actionTypeCache = {};
const CALL_API = 'CALL_API';
export default (
	actionType,
	endpoint,
	{ ignoreToast, ignoreLoading, isHttp, method, dataType, isTrack, trackResult } = {}
) => {
	if (actionTypeCache[actionType]) {
		throw new Error(`创建http action type 重复：${actionType}`)
	}
	actionTypeCache[actionType] = actionType;

	const types = [
		createAction(`${actionType}_request`),
		createAction(`${actionType}_success`),
		createAction(`${actionType}_failure`)
	]

	const payloadCreator = (data = []) => {
		return {
			[CALL_API]: {
				types,
				endpoint,
				data,
				ignoreToast,
				ignoreLoading,
				isHttp,
				method,
				dataType,
				isTrack,
				trackResult
			},
		}
	};
	const httpActions = {
		[actionType]: createAction(actionType, payloadCreator),
		[types[0]]: types[0],
		[types[1]]: types[1],
		[types[2]]: types[2],
	};

	return httpActions;
};
