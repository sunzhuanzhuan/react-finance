import React from 'react'
import { Row, Col, Form, Button, Input, message, AutoComplete } from "antd";
import debounce from 'lodash/debounce';

const FormItem = Form.Item;
const Option = AutoComplete.Option;

class ClientListQuery extends React.Component {
	constructor() {
		super();
		this.state = {
			company_id: 0,
			flag: true,
			clearFlag: false,
			clearAuto: false
		}
		this.handleNameChange = debounce(this.handleFetch, 400);
	}
	handleSearch = () => {
		let { questAction, page_size, handleClearFlag } = this.props;
		const { company_id, flag } = this.state;
		if (flag === false && company_id === 0) {
			handleClearFlag(true);
			return
		}
		const hide = message.loading('查询中，请稍候...');
		questAction({ company_id, page: 1, page_size }).then(() => {
			handleClearFlag(false);
			hide();
		}).catch(() => {
			message.error('查询失败');
			hide();
		});
	}
	handleFetch = (value) => {
		let { searchAction } = this.props;
		this.setState({ flag: false, company_id: 0 });
		if (!value) {
			this.setState({ company_id: '', clearAuto: true });
			return
		}
		const hide = message.loading('查询关联公司简称...');
		searchAction({ name: value }).then(() => {
			const { companyID } = this.props;
			companyID.length >= 1 ? this.setState({ company_id: companyID[0].company_id, flag: true, clearAuto: false }) : null;
			hide();
		}).catch(({ errorMsg }) => {
			hide();
			message.error(errorMsg || '查询关联公司失败');
		});
	}
	handleNameSelect = (name) => {
		const { companyID } = this.props;
		let obj = companyID.find(item => item.name == name);
		this.setState({ company_id: obj.company_id, flag: true });
	}
	render() {
		let { getFieldDecorator } = this.props.form;
		let { handleNew, companyID } = this.props;
		const options = companyID.map((item, key) =>
			<Option key={key} value={item.name}>{item.name}</Option>);
		const formItemLayout = {
			labelCol: { span: 8 },
			wrapperCol: { span: 16 },
		};
		return <div>
			<Form>
				<Row type="flex" justify="start" gutter={16}>
					<Col span={4}>
						<FormItem label="" {...formItemLayout} >
							{getFieldDecorator('name')(
								<AutoComplete
									dataSource={this.state.clearAuto ? [] : options}
									onSelect={this.handleNameSelect}
									onChange={this.handleNameChange}
									defaultActiveFirstOption={false}
									style={{ width: 260 }}
								>
									<Input placeholder='请输入公司简称' style={{ width: 200, marginLeft: '20px' }} />
								</AutoComplete>
							)}
						</FormItem>
					</Col>
					<Col style={{ marginLeft: '50px', marginTop: '2px' }}>
						<Button type="primary" className='left-gap' onClick={this.handleSearch}>查询</Button>
						<Button className='left-gap' type="primary" onClick={() => {
							handleNew('new', {})
						}}>新增</Button>
					</Col>
				</Row>
			</Form>
		</div>
	}
}

export default Form.create()(ClientListQuery);
