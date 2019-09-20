import React from 'react'
// import { connect } from 'react-redux';
// import { bindActionCreators } from "redux";
// import * as action from "../action";
import "./studioManage.less";
import { Button } from "antd";
import { orderConfig } from "../constants";
import CheckOrderQuery from '../components/checkOrderQuery'
import StudioPageTable from '../components/pageTable'


class StudioCheckOrder extends React.Component {
	constructor() {
		super();
		this.state = {
		}
	}

	render() {
		return <div className='studio-manage'>
			<CheckOrderQuery></CheckOrderQuery>
			<StudioPageTable className='top-gap'
				columns={orderConfig}
			></StudioPageTable>
			<Button className='top-gap' type='primary' size='large' onClick={() => {
				console.log(1);
			}}>返回</Button>
		</div>
	}
}
// const mapDispatchToProps = dispatch => ({
// 	actions: bindActionCreators({ ...action }, dispatch)
// });
export default StudioCheckOrder;
// export default connect(state => ({ ...state }), mapDispatchToProps)(ApplyDetail)
