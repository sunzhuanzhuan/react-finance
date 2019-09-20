import React from 'react'
import { Table } from "antd";
import { WBYTableFooter } from 'wbyui'
import qs from 'qs'
import difference from 'lodash/difference';
import Scolltable from '@/components/Scolltable';
import { events } from '@/util';

class ApplyTable extends React.Component {
	constructor() {
		super();
		this.state = {
			leftWidth: 0
		}
		events.on('message', this.collapsedListener); 
	}
	collapsedListener = isClosed => {
		this.setState({leftWidth: isClosed ? 40 : 200});
	}
	componentDidMount() {
		const leftSlide = document.getElementsByClassName('ant-layout-sider-trigger')[0];
		const leftWidth = leftSlide && leftSlide.clientWidth;

		this.setState({leftWidth});
	}
	onCheckAllChange = e => {
		const { type, curSelectRowKeys, dataSource, handleSelected } = this.props;
		let ary = dataSource.map(item => item.order_id);
		let filterData = dataSource.filter(item => item.status === '1');
		let filterAry = filterData.map(item => item.order_id);
		let rowKeys = difference(curSelectRowKeys, ary);
		let fillterRowKeys = difference(curSelectRowKeys, filterAry);
		let rows, curRowKeys;
		if (e.target.checked) {
			if (type === 'write_detail') {
				curRowKeys = fillterRowKeys.concat(filterAry);
				rows = filterData;
			} else {
				curRowKeys = rowKeys.concat(ary);
				rows = dataSource;
			}
		} else {
			curRowKeys = rowKeys;
			rows = [];
		}
		handleSelected(curRowKeys, rows);
	}
	selectedAry = type => {
		const { dataSource, curSelectRowKeys, curSelectRows } = this.props;
		const curAry = difference(curSelectRowKeys, curSelectRows.map(item => item.order_id));
		const data = type === 'write_detail' ? dataSource.filter(item => item.status === '1') : dataSource;
		const ary = data.map(item => item.order_id);
		const flag = ary.every(item => curSelectRowKeys.includes(item));
		return flag ? ary : curAry
	}
	render() {
		const { type, rowKey, loading, columns, dataSource, page, total, addPageSize = 20, queryAction, curSelectRowKeys, handleSelected, scroll = {} } = this.props;
		const { leftWidth } = this.state;
		const search = qs.parse(this.props.location.search.substring(1));
		const data = type === 'write_detail' ? dataSource.filter(item => item.status === '1') : dataSource;
		const ary = this.selectedAry(type);
		const page_size = search.keys ? search.keys.page_size : 50;
		let paginationObj = {
			onChange: (current) => {
				queryAction({ page: current, ...search.keys });
			},
			total: parseInt(total),
			current: parseInt(page),
			pageSize: parseInt(page_size),
			showQuickJumper: true,
		};
		if(type === 'add') {
			Object.assign(paginationObj, {
				showSizeChanger: true,
				pageSizeOptions: ['20', '50', '100', '200'],
				onShowSizeChange: (page, pageSize) => {
					queryAction({ ...search.keys, page, page_size: pageSize  });
				},
				onChange: (page, pageSize) => {
					queryAction({ ...search.keys, page, page_size: pageSize });
				},
				pageSize: addPageSize,
			})
		}
		let rowSelectionObj = type === 'write_detail' ? {
			selectedRowKeys: curSelectRowKeys,
			onChange: (selectedRowKeys, selectedRows) => {
				handleSelected(selectedRowKeys, selectedRows);
			},
			getCheckboxProps: record => ({
				disabled: !(record.status === "1")
			}),
		} : {
				selectedRowKeys: curSelectRowKeys,
				onChange: (selectedRowKeys, selectedRows) => {
					handleSelected(selectedRowKeys, selectedRows);
				}
			};
		return <div>
			{type === 'read_detail' ? <Scolltable scrollClassName='.ant-table-body' widthScroll={leftWidth == '200' ? 2920 : 2740}><Table className='top-gap read-detail-table table_style'
				rowKey={rowKey}
				columns={columns}
				dataSource={dataSource}
				scroll={scroll}
				bordered
				pagination={paginationObj}
				loading={loading}
			/></Scolltable> : null}
			{type === 'write_detail' ? <Scolltable scrollClassName='.ant-table-body' widthScroll={leftWidth == '200' ? 4360 : 4200}><Table className='top-gap detail-table table_style'
				rowKey={rowKey}
				columns={columns}
				dataSource={dataSource}
				scroll={scroll}
				bordered
				pagination={paginationObj}
				loading={loading}
				rowSelection={rowSelectionObj}
			// footer={() => {
			// 	return <WBYTableFooter
			// 		plainOptions={data}
			// 		selectedRowKeys={ary}
			// 		onChange={this.onCheckAllChange}
			// 		title={'全选'}
			// 		pagination={dataSource.length ? paginationObj : false}
			// 	/>
			// }}
			/></Scolltable> : null}
			{type === 'add' ? <Scolltable scrollClassName='.ant-table-body' widthScroll={leftWidth == '200' ? 2050 : 1900}><Table className='top-gap add-table table_style'
				rowKey={rowKey}
				columns={columns}
				dataSource={dataSource}
				scroll={scroll}
				bordered
				pagination={paginationObj}
				loading={loading}
				rowSelection={rowSelectionObj}
			// footer={() => {
			// 	return <WBYTableFooter
			// 		plainOptions={dataSource}
			// 		selectedRowKeys={ary}
			// 		onChange={this.onCheckAllChange}
			// 		title={'全选'}
			// 		pagination={dataSource.length ? paginationObj : false}
			// 	/>
			// }}
			/></Scolltable> : null}
		</div>
	}
}

export default ApplyTable;
