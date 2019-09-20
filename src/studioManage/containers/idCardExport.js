import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as studioActions from "../actions";
import { Form, DatePicker, Button, Table, message, Steps } from 'antd'
import { idCardExportColumns } from '../constants'
import getPagination from '../../components/pagination'
import './studioManage.less'
import qs from 'qs'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY-MM';
const Step = Steps.Step;
class IdCardExport extends React.Component {
	constructor() {
		super();
		this.state = {
			loading: false
		}
	}
	componentDidMount() {
		const search = qs.parse(this.props.location.search.substring(1));
		const toMonth = this.getMonth();
		this.props.form.setFieldsValue({ 'month': moment(toMonth, monthFormat) });
		this.queryData({ page: 1, page_size: 20, ...search.keys });
	}
	getMonth = () => {
		let date = new Date();
		let years = date.getFullYear();
		let month = date.getMonth() + 1;
		month = month < 10 ? "0" + month : month;
		let toMonth = years.toString() + '-' + month.toString();
		return toMonth;
	}
	queryData = (obj, func) => {
		this.setState({ loading: true });
		return this.props.actions.getIdCardList({ ...obj }).then(() => {
			if (func && Object.prototype.toString.call(func) === '[object Function]') {
				func();
			}
			this.setState({ loading: false })
		}).catch(({ errorMsg }) => {
			this.setState({ loading: false });
			message.error(errorMsg || '列表加载失败，请重试！');
		})
	}
	handleExport = () => {
		const search = qs.parse(this.props.location.search.substring(1));
		const month = this.props.form.getFieldValue('month');
		if (!month) {
			message.error('请先选择月份');
			return
		}
		this.props.actions.postIdCardListExport({ month: month.format(monthFormat) }).then(() => {
			message.success('操作成功！', 2);
			this.queryData({ page: 1, page_size: 20, ...search.keys });
		})
	}
	render() {
		const search = qs.parse(this.props.location.search.substring(1));
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		const { idCardList: { total, rows = [], page, page_size } } = this.props;
		const { loading } = this.state;
		const paginationObj = getPagination(this, search, { total, page, page_size });
		return <div className='id-card-container'>
			<div className='step-container'>
				<Steps current={null}>
					<Step title="获取身份证" />
					<Step title="打包" />
					<Step title="下载" />
				</Steps>,
			</div>
			<fieldset className='fieldset_css'>
				<div style={{ textAlign: 'center' }}>
					<Form style={{ display: 'inline-block', width: '260px', verticalAlign: 'middle' }}>
						<FormItem label='月份' {...formItemLayout}>
							{getFieldDecorator('month')(
								<MonthPicker placeholder="请选择月份" format={monthFormat} style={{ width: 140 }} />
							)}
						</FormItem>
					</Form>
					<Button type='primary' onClick={this.handleExport}>启动</Button>
				</div>
			</fieldset>
			<Table className='top-gap'
				rowKey='id'
				loading={loading}
				columns={idCardExportColumns}
				dataSource={rows}
				bordered
				pagination={paginationObj}
			/>
		</div>
	}
}

const mapStateToProps = (state) => {
	return {
		idCardList: state.studioManage.idCardList,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...studioActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(IdCardExport))
