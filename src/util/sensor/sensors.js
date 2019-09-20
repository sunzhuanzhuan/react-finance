import wby from "sa-sdk-javascript"
const $ = window.$
import _ from 'lodash';
window._ = _;

let isWbyInited = false;
export const sensors = (userId, serviceUrl, appId) => {
	wby.init({
		server_url: serviceUrl,
		heatmap_url: "https://static.sensorsdata.cn/sdk/1.10.1/heatmap.min.js",
		heatmap: {
			clickmap: "default", //是否开启点击图，默认 default 表示开启，可以设置 'not_collect' 表示关闭
			scroll_notice_map: "default", //是否开启触达注意力图，默认 default 表示开启，可以设置 'not_collect' 表示关闭
			isTrackLink: false, //如果是单页面 a 标签不涉及页面跳转或者 a 标签的点击是下载功能，建议不要打开。默认 false 。
			loadTimeout: 3000, //设置多少毫秒后开始渲染点击图,因为刚打开页面时候页面有些元素还没加载，
			is_single_page: true,
			collect_input: function (element_target) {
				if (element_target.getAttribute("sensors-disable") === "true") {
					return false
				} else {
					return true
				}
			},
			scroll_delay_time: 4000
		},
		show_log: false
	})
	wby.login(userId)
	wby.quick("autoTrack");
	isWbyInited = true
}
const _obj = (data = {}) => {
	const newObj = Object.keys(data).reduce((obj, key) => {
		obj[key] = _.isPlainObject(data[key]) ? JSON.stringify(data[key]) : data[key];
		// obj[key] = data[key];
		return obj
	}, {})
	return newObj;
}

sensors.track = (event_name, data, callback) => {
	if (!callback) {
		callback = () => { };
	}

	const events = event_name.split("/");
	event_name = events.map(item => item.toUpperCaseFirst()).join("");

	// event_name = event_name == 'ExportAccountSearch' ? event_name + 'Events' : event_name
	// console.log("event_name", event_name)
	if (isWbyInited) {
		try {
			wby.track(event_name, _obj(data), callback)
		} catch (e) {
			wby.track("CountEventsError", e, callback)
		}

	}
};
window.wbySensors = wby;
