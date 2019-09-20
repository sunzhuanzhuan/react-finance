import qs from 'qs';
export default function getPagination(context, search, options) {
	let paginationObj = {
		onChange: (current) => {
			context.queryData({ ...search.keys, page: current, page_size: options && options.page_size });
			context.props.history.replace({
				pathname: context.props.location.pathname,
				search: `?${qs.stringify({ ...search, keys: { ...search.keys, page: current } })}`,
			});
		},
		onShowSizeChange: (current, page_size) => {
			context.queryData({ ...search.keys, page: 1, page_size });
			context.props.history.replace({
				pathname: context.props.location.pathname,
				search: `?${qs.stringify({ ...search, keys: { ...search.keys, page: current, page_size } })}`,
			});
		},
		total: parseInt(options && options.total),
		current: parseInt(options && options.page),
		pageSize: parseInt(options && options.page_size),
		showQuickJumper: true,
		showSizeChanger: true,
		pageSizeOptions: ['20', '50', '100', '200']
	}
	return paginationObj
}
