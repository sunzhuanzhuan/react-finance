import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as missionInputActions from '../actions/missionInput'
import { Upload, Icon, message, Modal } from 'antd';
// import { stepsConfig } from '../constans'
import './saleIncome.less'
const Dragger = Upload.Dragger;

class MissionInput extends React.Component {
	constructor() {
		super();
		this.state = {
			current: 0,
			fileList: []
		}
	}
	render() {
		const props = {
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			accept: ".xlsx,.xls",
			showUploadList: true,
			multiple: true,
			fileList: this.state.fileList,
			customRequest: obj => {
				const hide = message.loading("loading...", 0);
				const { postMissionInput } = this.props.actions;
				let { fileList } = this.state;
				let content = new window.FormData();
				content.append('filepath', obj.file);
				postMissionInput(content).then((res) => {
					hide();
					let data = res.data;
					if (data.sale_exist) {
						Modal.confirm({
							title: '提示',
							content: '部分指标已存在，是否覆盖?',
							onOk: () => {
								content.append('commit', 1);
								const hidden = message.loading("loading...", 0);
								postMissionInput(content).then(() => {
									let ary = [...fileList,
									{
										uid: obj.file.uid,
										name: '已导入' + obj.file.name,
										status: 'done',
										url: '',
									}];
									this.setState({ fileList: ary });
									hidden();
									message.success('上传成功！');
								}).catch(({ errorMsg }) => {
									hidden();
									message.error(errorMsg || '上传失败！');
								})
							},
							onCancel() {
							},
						})
						return
					}
					let ary = [...fileList,
					{
						uid: obj.file.uid,
						name: '已导入' + obj.file.name,
						status: 'done',
						url: '',
					}];
					this.setState({ fileList: ary });
					message.success('上传成功！');
				}).catch(({ errorMsg }) => {
					hide();
					message.error(errorMsg || '上传失败！')
				});
			}
		};
		return <div className='sale-mission-input'>
			<div className='sale-upload-container top-gap'>
				<Dragger {...props}>
					<p className="ant-upload-drag-icon">
						<Icon type="upload" />
					</p>
					<p className="ant-upload-text">拖拽或点击选择上传模板</p>
				</Dragger>
			</div>
			<p className='sale-input-tip'>
				<span className='red-font'><Icon type="exclamation-circle-o" />提示：</span>如果您还没有批量销售任务导入模板，请点击
				<a href='/api/commission/config/assignment/view'>批量销售任务导入模板下载.xlsx</a>
			</p>
		</div>
	}
}
const mapStateToProps = () => {
	return {
	}
};
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...missionInputActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(MissionInput);
