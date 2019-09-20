import React from 'react';

export default class Statistics extends React.Component {
	constructor() {
		super();

	}
	render() {
		const { title, render } = this.props;
		return <fieldset className='fieldset_css'>
			<legend>{title}</legend>
			{render}
		</fieldset>

	}
}
