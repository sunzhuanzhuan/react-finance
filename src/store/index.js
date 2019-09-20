import { createStore, applyMiddleware, compose } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
// import { browserHistory } from 'react-router';
import { toast, showLoading, hideLoading, request } from '../util'
// import { request } from '../util'
import _history from '../util/history'
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import { sensors } from '../util/sensor/sensors'
// import { createAjaxMiddleware } from 'redux-action-extend'
import createAjaxMiddleware from './createAjaxMiddleware'

const initialState = {};
const ajaxMiddleware = createAjaxMiddleware({ toast, showLoading, hideLoading, request, sensors });
// for redux-tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const createStoreWithMiddleware = composeEnhancers(applyMiddleware(
	thunkMiddleware, ajaxMiddleware
))(createStore);

const store = createStoreWithMiddleware(rootReducer, initialState);
export const history = syncHistoryWithStore(_history, store);

window.store = store;
export default store;

