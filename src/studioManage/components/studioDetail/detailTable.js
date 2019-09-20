import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as studioActions from "../../actions";
import { Table, message, Button } from "antd";
import { WBYTableFooter } from "wbyui";


class StudioDetailTable extends React.Component {
	constructor() {
		super();
		this.state = {
			pageSize: 20,
			loading: false
		}
	}
	componentDidMount() {
		const {
			questAction,
			pageParams = 'page',
			limitParams = 'page_size',
			handlePageSize
		} = this.props;
		this.setState({ loading: true });
		questAction({ [pageParams]: 1, [limitParams]: 20 }).then(() => {
			if (Object.prototype.toString.call(handlePageSize) === '[object Function]') {
				handlePageSize(20);
			}
			this.setState({ loading: false });
		}).catch(() => {
			message.error('列表请求失败');
			this.setState({ loading: false });
		});
	}
	onCheckAllChange = e => {
		const { rowKey, dataSource, handleCurRowsChange } = this.props;
		let rowKeys = [], rows = [];
		if (e.target.checked) {
			dataSource.forEach(item => {
				if (item['source_status'] === "1") {
					rowKeys.push(item[rowKey]);
					rows.push(item);
				}
			})
		} else {
			rowKeys = [];
			rows = [];
		}
		handleCurRowsChange(rowKeys, rows);
	}
	handleChange = () => {
		this.props.handleVisible();
	}
	render() {
		const { pageSize, loading } = this.state;
		const {
			columns,
			dataSource,
			questAction,
			rowKey = 'id',
			pagination = null,
			pageChange = null,
			sizeChange = null,
			handlePageSize = null,
			pageSizeOptions = ['20', '50', '100', '200'],
			total = 20,
			current = 1,
			filterParams,
			pageParams = 'page',
			limitParams = 'page_size',
			curSelectRowKeys,
			handleCurRowsChange
		} = this.props;
		let filterData = dataSource ? dataSource.filter(item => item.source_status === "1") : [];
		let paginationObj = pagination ? pagination : {
			onChange: (current) => {
				this.setState({ loading: true });
				handleCurRowsChange();
				if (Object.prototype.toString.call(pageChange) === '[object Function]') {
					pageChange(current, pageSize);
				}
				questAction({ [pageParams]: current, [limitParams]: pageSize, ...filterParams }).then(() => {
					this.setState({ loading: false });
				}).catch(() => {
					message.error('列表请求失败');
					this.setState({ loading: false });
				});
			},
			onShowSizeChange: (current, pageSize) => {
				this.setState({ pageSize, loading: true })
				if (Object.prototype.toString.call(handlePageSize) === '[object Function]') {
					handlePageSize(pageSize);
				}
				if (Object.prototype.toString.call(sizeChange) === '[object Function]') {
					sizeChange(current, pageSize);
				}
				questAction({ [pageParams]: 1, [limitParams]: pageSize, ...filterParams }).then(() => {
					this.setState({ loading: false });
				}).catch(() => {
					message.error('列表请求失败');
					this.setState({ loading: false });
				});
			},
			total,
			current,
			pageSize,
			showQuickJumper: true,
			showSizeChanger: true,
			pageSizeOptions
		};
		let rowSelectionObj = {
			selectedRowKeys: curSelectRowKeys,
			onChange: (selectedRowKeys, selectedRows) => {
				handleCurRowsChange(selectedRowKeys, selectedRows);
			},
			getCheckboxProps: record => ({
				disabled: !(record.source_status === "1")
			}),
		}
		return <Table className='top-gap'
			columns={columns}
			dataSource={dataSource}
			loading={loading}
			rowKey={rowKey}
			bordered
			rowSelection={rowSelectionObj}
			pagination={false}
			footer={() => {
				return <WBYTableFooter
					plainOptions={filterData}
					selectedRowKeys={curSelectRowKeys}
					onChange={this.onCheckAllChange}
					title={'全选'}
					pagination={paginationObj}
				>
					<Button type='primary' disabled={curSelectRowKeys.length === 0} onClick={this.handleChange}>更换工作室</Button>
				</WBYTableFooter >
			}}
		>
		</Table>
	}
}
const mapStateToProps = () => {
	return {
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...studioActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(StudioDetailTable)
