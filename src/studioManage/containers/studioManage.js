import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as studioActions from "../actions";
import { Button, Table, Modal, message } from "antd";
import SearForm from '../../components/SearchForm'
import getPagination from '../../components/pagination'
import StudioModal from '../components/studioModal'
import { studioListSearchFunc } from '../constants/search'
import { studioConfigFunc } from "../constants";
import "./studioManage.less";
import numeral from 'numeral';
import qs from 'qs'

class StudioManage extends React.Component {
	constructor() {
		super();
		this.state = {
			newModalVisible: false,
			pageSize: '',
			record: {},
			isClick: false,
			pullReady: false,
			loading: false
		}
	}
	componentDidMount() {
		const search = qs.parse(this.props.location.search.substring(1));
		const { getStudioMetadata } = this.props.actions;
		getStudioMetadata().then(() => {
			this.setState({ pullReady: true });
		});
		this.queryData({ ...search.keys });
	}
	queryData = (obj, func) => {
		this.setState({ loading: true });
		return this.props.actions.getStudioList({ page: 1, page_size: 20, ...obj }).then(() => {
			if (func && Object.prototype.toString.call(func) === '[object Function]') {
				func();
			}
			this.setState({ loading: false })
		}).catch(({ errorMsg }) => {
			this.setState({ loading: false });
			message.error(errorMsg || '列表加载失败，请重试！');
		})
	}

	handleStopStudio = record => {
		const { getStudioCheck, getStudioNameCheck, getFreezeList, postStopStudio, getStudioList } = this.props.actions;
		const { studioData: { page } } = this.props;
		const { pageSize = 20, filterParams } = this.state;
		const hide = message.loading('处理中，请稍候...');
		getFreezeList({ studio_id: record.id, page: 1, page_size: 20 }).then(() => {
			let freezeList = this.props.freezeList.rows;
			if (freezeList.length > 0) {
				Promise.all([getStudioCheck({ id: record.id, page: 1, page_size: 20 }), getStudioNameCheck({ status: 1, page: 1, page_size: 100 })]).then(() => {
					this.setState({ record, newModalVisible: true }, () => {
						hide();
					});
				}).catch(() => {
					hide();
					message.error('请求失败，请重试');
				});
			} else {
				getStudioCheck({ id: record.id, page: 1, page_size: 20 }).then(() => {
					hide();
					let data = this.props.studioCheck;
					Modal.confirm({
						title: '确认是否停用该工作室',
						width: 520,
						content: <div>
							<span>当前工作室：{data.name}</span>
							<span className='left-gap'>剩余比例：{numeral(data.remaining_amount_ratio).format('0.00%')}</span>
							<span className='left-gap'>剩余额度：{numeral(data.remaining_amount / 100).format('0,0.00')}</span>
						</div>,
						onOk: () => {
							this.setState({ isClick: true });
							const hidden = message.loading("处理中，请稍候...");
							postStopStudio({ studio_id: data.id }).then(() => {
								this.setState({ isClick: false }, () => {
									hidden();
								});
								message.success('停用成功！');
								getStudioList({ ...filterParams, page, page_size: pageSize }).then((() => {
									message.success('列表已更新');
								})).catch(({ errorMsg }) => {
									message.error(errorMsg || '列表加载失败，请重试');
								});
							}).catch(({ errorMsg }) => {
								hidden();
								message.error(errorMsg || '停用失败，请重试');
								this.setState({ isClick: false });
							})
						},
						onCancel() {
						},
					})
				}).catch(({ errorMsg }) => {
					hide();
					message.error(errorMsg || '请求失败，请重试');
				})
			}
		}).catch(({ errorMsg }) => {
			hide();
			message.error(errorMsg || '请求失败，请重试');
		})
	}
	handleStartStudio = (record) => {
		const { postStartStudio, getStudioList } = this.props.actions;
		const { studioData: { page } } = this.props;
		const { filterParams } = this.state;
		Modal.confirm({
			title: '提示',
			content: '是否立即启用该工作室?',
			onOk: () => {
				this.setState({ isClick: true });
				const hidden = message.loading("处理中,请稍候...");
				postStartStudio({ studio_id: record.id }).then(() => {
					this.setState({ isClick: false }, () => {
						hidden();
					});
					message.success('启用成功！');
					getStudioList({ ...filterParams, page, page_size: 20 }).then(() => {
						message.success('列表已更新');
					}).catch(({ errorMsg }) => {
						message.success(errorMsg || '列表加载失败，请重试');
					});
				}).catch(({ errorMsg }) => {
					hidden();
					message.error(errorMsg || '启用失败，请重试');
					this.setState({ isClick: false });
				})
			},
			onCancel() {
			},

		})
	}
	handleSubmit = (values) => {
		const { getStudioList, postStopStudio } = this.props.actions;
		const { pageSize, record, filterParams } = this.state;
		const { studioData: { page } } = this.props;
		this.setState({ isClick: true });
		const hide = message.loading('操作中，请稍候...');
		postStopStudio({ ...values, studio_id: record.id }).then(() => {
			this.handleOnCancel();
			getStudioList({ ...filterParams, page, page_size: pageSize }).then(() => {
				message.success('列表已更新');
			}).catch(() => {
				message.success('列表加载失败，请重试');
			});
			hide();
			message.success('操作成功！');
			this.setState({ isClick: false });
		}).catch(({ errorMsg }) => {
			hide();
			message.error(errorMsg || '操作失败！');
			this.setState({ isClick: false });
		})
	};
	handleOnCancel = () => {
		this.setState({ newModalVisible: false })
	}
	handlePageSize = (pageSize) => {
		this.setState({ pageSize });
	}
	render() {
		const search = qs.parse(this.props.location.search.substring(1));
		const { newModalVisible, record, pageSize, filterParams, isClick, pullReady, loading } = this.state;
		const { studioData: { rows, total, page, page_size }, studioMetadata: { studio_status = [], studio_type = [], studio_supported_platforms = [], source_type = [] }, freezeList, studioCheck, studioNameCheck } = this.props;
		const studioConfig = studioConfigFunc(this.handleStopStudio, this.handleStartStudio, this.props.history);
		const studioListSearch = studioListSearchFunc({ studio_status, studio_type, studio_supported_platforms });
		const paginationObj = getPagination(this, search, { total, page, page_size });
		return <div className='studio-manage-container'>
			<fieldset className='fieldset_css'>
				<legend>查询</legend>
				{pullReady && <SearForm data={studioListSearch} getAction={this.queryData} responseLayout={{ xs: 24, sm: 24, md: 10, lg: 8, xxl: 6 }} />}
			</fieldset>
			<div className='top-gap'>
				<Button type='primary' onClick={() => {
					this.props.history.push('/finance/studiomanage/new?postType=1');
				}}>新建</Button>
			</div>
			<div className='top-gap'>
				<Table
					rowKey='id'
					loading={loading}
					columns={studioConfig}
					dataSource={rows}
					bordered
					pagination={total > page_size ? paginationObj : false}
				/>
			</div>
			<div>
				{newModalVisible ? <StudioModal
					visible={newModalVisible}
					type='stop'
					onCancel={this.handleOnCancel}
					record={record}
					page={page}
					page_size={pageSize}
					filterParams={filterParams}
					freezeList={freezeList.rows}
					studioCheck={studioCheck}
					studioNameCheck={studioNameCheck}
					sourceType={source_type}
					handleSubmit={this.handleSubmit}
					isClick={isClick}
				></StudioModal> : null}
			</div>
		</div>
	}
}

const mapStateToProps = (state) => {
	return {
		studioData: state.studioManage.studioData,
		studioCheck: state.studioManage.studioCheck,
		studioNameCheck: state.studioManage.studioNameCheck,
		studioMetadata: state.studioManage.studioMetadata,
		freezeList: state.studioManage.freezeList,
	}
}
const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...studioActions }, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(StudioManage)

