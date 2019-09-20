import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as trinityPayAction from "../actions";
import { Modal, Button, Form, Input, message } from 'antd'
import { OssUpload } from 'wbyui'
import api from '../../api'
import qs from 'qs'

const FormItem = Form.Item;
const { TextArea } = Input;

class PreModal extends React.Component {
	constructor() {
		super();
		this.state = {
			isClick: false,
			token: undefined,
		}
	}
	componentDidMount() {
		const { status } = this.props;
		if (status == 'succeed') {
			api.get('/toolbox-gateway/file/v1/getToken').then((res) => {
				this.setState({ token: res.data })
			})
		}
	}
	titleMap = (status) => {
		const maps = {
			'succeed': { title: '打款成功备注及截图', content: '确定打款成功吗？', actionName: 'postPaySuccess' },
			'defeated': { title: '打款失败原因', content: '确定打款失败吗？', actionName: 'postPayFail' },
			'revocation': { title: '打款撤销原因', content: '确定打款撤销吗？', actionName: 'postPayRevoke' },
		};
		return maps[status]
	}
	handleModal = (content) => {
		this.props.form.validateFields((err) => {
			if (!err) {
				const { onCancel, status, type } = this.props;
				this.setState({ isClick: true }, () => {
					Modal.confirm({
						title: '提示',
						content,
						onOk: () => {
							this.setState({ isClick: false });
							onCancel();
							this.handleSubmit(status, type);
						},
						onCancel: () => {
							this.setState({ isClick: false });
						},
					})
				})
			}
		})
	}
	handleSubmit = (status, type) => {
		const { search, id, page } = this.props;
		const actionName = this.titleMap(status, type).actionName;
		let list = []
		if (type == 'datePay') {
			list = this.props.datePayData.list;
		} else {
			list = this.props.prePayData.list;
		}

		this.props.form.validateFields((err, values) => {
			if (!err) {
				const current = (search.keys && search.keys.payment_status && list.length === 1) ? (page - 1 || page) : page;
				const urlArray = values.payment_screenshot && values.payment_screenshot.map(item => ({
					uid: item.uid,
					status: item.status,
					name: item.name,
					url: item.url
				}));
				let params = { payment_slip_id: id }
				status == 'revocation' ? params.payment_revoke_reason = values.remark : params.payment_remark = values.remark;
				status == 'succeed' ? params.payment_screenshot = qs.stringify(urlArray) : null;
				this.props.actions[actionName](params).then(() => {
					message.success('操作成功!');
					this.props.queryAction({ page: current, ...search.keys });
				}).catch(({ errorMsg }) => {
					message.error(errorMsg || '操作失败，请重试！');
				})
			}
		})
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { visible, onCancel, status, type, key } = this.props;
		const { isClick, token } = this.state;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 }
		};
		const article = this.titleMap(status, type);
		return <Modal
			wrapClassName='prePay-modal'
			key={key}
			width={status == 'succeed' ? 780 : 640}
			title={article.title}
			visible={visible}
			maskClosable={false}
			onCancel={onCancel}
			footer={
				[
					<Button key="back" onClick={onCancel}>返回</Button>,
					<Button key="submit" type="primary" disabled={isClick} onClick={() => {
						this.handleModal(article.content)
					}}>确认</Button>
				]}
		>
			<Form>
				<FormItem label='备注' {...formItemLayout}>
					{getFieldDecorator('remark', { rules: [{ required: (status == 'succeed') ? false : true, message: '请填写原因!' }] })(
						<TextArea autosize={{ minRows: 4, maxRows: 6 }} maxLength={50} />
					)}
				</FormItem>
				{token && <FormItem label='截图' {...formItemLayout}>
					{getFieldDecorator('payment_screenshot', {
						rules: [{ required: true, message: '请上传图片' }],
						valuePropName: 'fileList',
						getValueFromEvent: e => e.fileList
					})(
						<OssUpload
							len={5}
							listType="picture-card"
							authToken={token}
							rule={{
								bizzCode: 'TRINITY_PROOF_PAYMENT_IMG_UPLOAD',
								suffix: "bmp,jpg,jpeg,gif,png",
								max: 5
							}}
							multiple={true}
						>
						</OssUpload>
					)}
				</FormItem>}
			</Form>
		</Modal>
	}
}

const mapStateToProps = (state) => {
	return {
		prePayData: state.trinityPay.prePayData,
		datePayData: state.trinityPay.datePayData,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...trinityPayAction }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PreModal))
