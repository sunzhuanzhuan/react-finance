import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as missionOutputActions from '../actions/missionOutput'
import { Button, message, DatePicker, Form } from 'antd';
import './saleIncome.less';
import moment from 'moment';
import { exportMap } from '../constans'

const { MonthPicker } = DatePicker;
const FormItem = Form.Item;
const monthFormat = 'YYYY-MM';

class MissionOutput extends React.Component {
	componentDidMount() {
		const toMonth = this.getMonth();
		this.props.form.setFieldsValue({ 'time': moment(toMonth, monthFormat) });
	}
	getMonth = () => {
		let date = new Date();
		let years = date.getFullYear();
		let month = date.getMonth() + 1;
		month = month < 10 ? "0" + month : month;
		let toMonth = years.toString() + '-' + month.toString();
		return toMonth;
	}
	handleExport = (action, time) => {
		const hide = message.loading('导出中，请稍候...', 1);
		this.props.actions[action]({ time }).then(() => {
			message.success('导出成功，请查收邮件');
			hide();
		});
	}
	render() {
		const { getFieldDecorator, getFieldValue } = this.props.form;
		const time = getFieldValue('time') ? getFieldValue('time').format(monthFormat) : '';
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		return <div className='sale-mission-output'>
			<Form>
				<FormItem label='月份' {...formItemLayout}>
					{getFieldDecorator('time')(
						<MonthPicker placeholder="请选择月份" format={monthFormat} style={{ width: 140 }} />
					)}
				</FormItem>
			</Form>
			{exportMap.map(item => {
				return <div key={item.action} className='top-gap'>
					<div className='output-label'>{item.label}:</div>
					<Button type="primary" className='left-gap' onClick={() => {
						this.handleExport(item.action, time);
					}}>导出</Button>
				</div>
			})}
		</div>
	}
}

const mapStateToProps = () => {
	return {
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...missionOutputActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(MissionOutput))
