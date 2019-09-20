import React from 'react'
import { Table, message } from "antd";

class PageTable extends React.Component {
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
		}).catch(({ errorMsg }) => {
			message.error(errorMsg || '列表加载失败，请重试');
			this.setState({ loading: false });
		});
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
			clearFlag=false
		} = this.props;
		let paginationObj = pagination ? pagination : {
			onChange: (current) => {
				this.setState({ loading: true });
				if (Object.prototype.toString.call(pageChange) === '[object Function]') {
					pageChange();
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
					sizeChange();
				}
				questAction({ [pageParams]: current, [limitParams]: pageSize, ...filterParams }).then(() => {
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
		return <Table columns={columns} dataSource={dataSource}
			loading={loading}
			pagination={clearFlag?false:paginationObj}
			rowKey={rowKey}
			bordered
		></Table>
	}
}

export default PageTable;
