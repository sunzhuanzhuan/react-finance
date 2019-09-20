import React from 'react'
import { Row, Col, Form, Select, Input, Icon } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

let uuid = 1;

class ValueSection extends React.Component {
	constructor() {
		super();
		this.state = {

		}
	}
	checkCount = (rule, value, callback) => {
		let min_value = value.min_value || '';
		let max_value = value.max_value || 999999;
		let proportion = value.proportion || '';
		let weight = value.weight || '';
		const flag = this.checkValue([min_value, max_value, proportion, weight]);
		if (flag) {
			callback();
		} else {
			callback('请填写正确的阈值区间信息！');
		}
	}
	checkValue = (values) => {
		// const reg = /^(100(\.0{1,2})?|[0-9]?\d(\.\d\d?)?)$/;
		const extraReg = /^[1-9]\d*(\.\d\d?)?$/;
		let arr = [];
		if (values.length !== 4) return false;
		if (values[0] >= values[1]) return false;
		values.forEach((value, index) => {
			if (index === 2 || index === 3) {
				value && extraReg.test(value) ? arr.push(value) : null;
				return
			}
			value && value >= 100 ? arr.push(value) : null;
		});
		return arr.length === values.length;
	}
	handleRemove = (k) => {
		const { form } = this.props;
		const keys = form.getFieldValue('keys');
		if (keys.length === 1) {
			return;
		}
		form.setFieldsValue({
			keys: keys.filter(key => key !== k),
		});
	}
	handleAdd = () => {
		uuid++;
		const { form } = this.props;
		const keys = form.getFieldValue('keys');
		const nextKeys = keys.concat(uuid);
		form.setFieldsValue({
			keys: nextKeys,
		});
	}
	render() {
		const { getFieldDecorator, getFieldValue } = this.props.form;
		getFieldDecorator('keys', { initialValue: [1] });
		const keys = getFieldValue('keys');
		const formItems = keys.map((k) => {
			const name = `value_${k}`;
			return (
				<Row className='section-row' type="flex" justify="start" gutter={12} key={k} style={{ marginLeft: '76px', marginBottom: '20px' }}>
					<FormItem>
						{getFieldDecorator(name, {
							initialValue: { min_value: '', max_value: '', min_op: 'gt', max_op: 'lte', proportion: '', weight: '' },
							validateTrigger: 'onBlur',
							rules: [{ validator: this.checkCount }]
						})(
							<ValueInput />
						)}
					</FormItem>
					<Col>
						<Icon
							className='new-modal-icon'
							type="plus-circle-o"
							onClick={this.handleAdd}
						/>
						{keys.length > 1 ? <Icon
							className="new-modal-icon"
							type="minus-circle-o"
							disabled={keys.length === 1}
							onClick={() => this.handleRemove(k)}
						/> : null}
					</Col>
				</Row>
			);
		});
		return <div>
			<Row type="flex" justify="start" className='title-row'>
				<Col className='col-left'>阈值区间：</Col>
				<Col className='col-left'>下限值</Col>
				<Col className='col-left'>上限值</Col>
				<Col className='col-left'>提成比例</Col>
				<Col className='col-left'>超额权重</Col>
			</Row>
			<DefaultRows />
			{formItems}
		</div>
	}
}
class ValueInput extends React.Component {
	constructor(props) {
		super(props);
		const value = props.value || {};
		this.state = {
			min_value: value.min_value,
			max_value: value.max_value,
			min_op: value.min_op || 'gt',
			max_op: value.max_op || 'lte',
			proportion: value.proportion,
			weight: value.weight,
		};
	}
	componentWillReceiveProps(nextProps) {
		if ('value' in nextProps) {
			const value = nextProps.value;
			this.setState(value);
		}
	}
	handleMinOpChange = (min_op) => {
		if (!('value' in this.props)) {
			this.setState({ min_op });
		}
		this.triggerChange({ min_op });
	}
	handleMaxOpChange = (max_op) => {
		if (!('value' in this.props)) {
			this.setState({ max_op });
		}
		this.triggerChange({ max_op });
	}
	handleValueChange = (e, type) => {
		const _value = e.target.value;
		if (!('value' in this.props)) {
			this.setState({ [type]: _value });
		}
		this.triggerChange({ [type]: _value });
	}
	triggerChange = (changedValue) => {
		const onChange = this.props.onChange;
		if (onChange) {
			onChange(Object.assign({}, this.state, changedValue));
		}
	}
	render() {
		const { min_value, max_value, min_op, max_op, proportion, weight } = this.state;
		return <span className='section-row'>
			<span>
				<Select className='value-input-style'
					onChange={this.handleMinOpChange} value={min_op}>
					<Option value="gt">大于</Option>
					<Option value="gte">大于等于</Option>
				</Select>
				<Input addonAfter={'%'}
					style={{ width: 100, verticalAlign: 'middle' }}
					value={min_value}
					onChange={(e) => {
						this.handleValueChange(e, 'min_value');
					}}
				/>
			</span>
			<span className='value-input-item'>
				<Select className='value-input-style'
					onChange={this.handleMaxOpChange} value={max_op}>
					<Option value="lt">小于</Option>
					<Option value="lte">小于等于</Option>
				</Select>
				<Input addonAfter={'%'}
					style={{ width: 100, verticalAlign: 'middle' }}
					value={max_value}
					onChange={(e) => {
						this.handleValueChange(e, 'max_value');
					}}
				/></span>
			<span className='value-input-item'>
				<Input addonAfter={'%'}
					style={{ width: 100 }}
					value={proportion}
					onChange={(e) => {
						this.handleValueChange(e, 'proportion');
					}}
				/>
			</span>
			<span className='value-input-item'>
				<Input addonAfter={'%'}
					style={{ width: 100 }}
					value={weight}
					onChange={(e) => {
						this.handleValueChange(e, 'weight');
					}}
				/>
			</span>
		</span>
	}
}

const DefaultRows = () => {
	const selectBeforeMin = (<Select defaultValue="gte" style={{ width: 100 }} disabled>
		<Option value="gt">大于</Option>
		<Option value="gte">大于等于</Option>
	</Select>)
	const selectBeforeMax = (<Select defaultValue="lt" style={{ width: 100 }} disabled>
		<Option value="lt">小于</Option>
		<Option value="lte">小于等于</Option>
	</Select>);
	const selectBeforeMax2 = (<Select defaultValue="lte" style={{ width: 100 }} disabled>
		<Option value="lt">小于</Option>
		<Option value="lte">小于等于</Option>
	</Select>);
	return <div className='section-row'>
		<Row type="flex" justify="start" gutter={12} style={{ marginLeft: '70px', marginBottom: '20px' }}>
			<Col>
				<Input addonAfter={'%'} addonBefore={selectBeforeMin} style={{ width: 200 }} disabled defaultValue={0} />
			</Col>
			<Col className='formitem-left'>
				<Input addonAfter={'%'} addonBefore={selectBeforeMax} style={{ width: 200 }} disabled defaultValue={50} />
			</Col>
			<Col className='formitem-left'>
				<Input addonAfter={'%'} style={{ width: 100 }} disabled defaultValue={0} />
			</Col>
			<Col className='formitem-left'>
				<Input addonAfter={'%'} style={{ width: 100 }} disabled defaultValue={0} />
			</Col>
		</Row>
		<Row type="flex" justify="start" gutter={12} style={{ marginLeft: '70px', marginBottom: '20px' }}>
			<Col>
				<Input addonAfter={'%'} addonBefore={selectBeforeMin} style={{ width: 200 }} disabled defaultValue={50} />
			</Col>
			<Col className='formitem-left'>
				<Input addonAfter={'%'} addonBefore={selectBeforeMax2} style={{ width: 200 }} disabled defaultValue={100} />
			</Col>
			<Col className='formitem-left'>
				<Input addonAfter={'%'} style={{ width: 100 }} disabled defaultValue={'完成率'} />
			</Col>
			<Col className='formitem-left'>
				<Input addonAfter={'%'} style={{ width: 100 }} disabled defaultValue={0} />
			</Col>
		</Row>
	</div>
}
export default ValueSection;
