import Interface from '../constans/Interface'
import { createHttpAction } from 'redux-action-extend'

export const {
	bussinessExcel,
	bussinessExcel_success
} = createHttpAction('bussinessExcel', Interface.bussinessExcel, {
	method: 'get'
});

export const {
	execExcel,
	execExcel_success
} = createHttpAction('execExcel', Interface.execExcel, {
	method: 'get'
});

export const {
	giftExcel,
	giftExcel_success
} = createHttpAction('giftExcel', Interface.giftExcel, {
	method: 'get'
});

export const {
	qcExcel,
	qcExcel_success
} = createHttpAction('qcExcel', Interface.qcExcel, {
	method: 'get'
});

export const {
	reparationExcel,
	reparationExcel_success
} = createHttpAction('reparationExcel', Interface.reparationExcel, {
	method: 'get'
});

export const {
	manualQcExcel,
	manualQcExcel_success
} = createHttpAction('manualQcExcel', Interface.manualQcExcel, {
	method: 'get'
});

export const {
	payBackExcel,
	payBackExcel_success
} = createHttpAction('payBackExcel', Interface.payBackExcel, {
	method: 'get'
});

export const {
	longAgingExcel,
	longAgingExcel_success
} = createHttpAction('longAgingExcel', Interface.longAgingExcel, {
	method: 'get'
});

export const {
	lessAchievementsExcel,
	lessAchievementsExcel_success
} = createHttpAction('lessAchievementsExcel', Interface.lessAchievementsExcel, {
	method: 'get'
});
