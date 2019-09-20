import React from 'react'
import { Form } from 'antd'
import ValueSection from './valueSection'

class FormList extends React.PureComponent {
	componentDidMount() {
		const { setFieldsValue } = this.props.form;
		const { data = [] } = this.props;
		if (data.length > 0) {
			setFieldsValue({
				keys: data.map((item, index) => index)
			});
			setTimeout(() => {
				data.forEach((item, index) => {
					let obj = { ...item };
					obj['min'] = (item['min']).toFixed(2);
					obj['max'] = (item['max']).toFixed(2);
					obj['rate'] = (item['rate'] * 100).toFixed(2);
					obj['minRate'] = (item['minRate'] * 100).toFixed(2);
					setFieldsValue({
						[index]: obj
					})
				})
			}, 0);
		}
	}
	render() {
		return <Form>
			<ValueSection form={this.props.form} />
		</Form>
	}
}

export default Form.create()(FormList)
