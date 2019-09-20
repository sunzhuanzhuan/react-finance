export function getSysType() {
	let os = window.navigator.platform.match(/(Win|Mac|Linux)/);//系统
	let x = os && os[1];
	return x;
}
export function getSysBit() {
	var x = window.navigator.userAgent.match(/x86_64|Win64|WOW64/) || window.navigator.cpuClass === 'x64' ? 'x64' : 'x86';
	return x;
}
export default { getSysType, getSysBit }
