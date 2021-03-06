<template>
	<div>
		<mt-tabbar v-model="active" v-if="!hideTabbar">
			<mt-tab-item id="home">
				<home-icon slot="icon"></home-icon>
				主页
			</mt-tab-item>
			<mt-tab-item id="checkin">
				<edit-icon slot="icon"></edit-icon>
				签到
			</mt-tab-item>
			<mt-tab-item id="comment">
				<trash-icon slot="icon"></trash-icon>
				杯数
			</mt-tab-item>
		</mt-tabbar>
		<mt-tab-container v-model="active">
			<mt-tab-container-item id="home">
				<main-view :setActive="setActive"></main-view>
			</mt-tab-container-item>
			<mt-tab-container-item id="checkin">
				<checkin></checkin>
			</mt-tab-container-item>
			<mt-tab-container-item id="comment">
				<comment :active="active"></comment>
			</mt-tab-container-item>
		</mt-tab-container>
		<!-- popup -->
		<mt-popup
			ref="locPopup"
			v-model="locPopupVis"
			position="bottom"
			class="popup-fullscreen">
			<h3 class="text-center text-inverse">请选择一个心栈：</h3>
			<mt-picker
				:slots="slots"
				valueKey="name"
				:visibleItemCount="7"
				ref="locValue"></mt-picker>
			<div class="p-8">
				<mt-button size="large"
					type="primary"
					@click="confirmLoc">确认</mt-button>
			</div>
			<div class="p-8">
				<p>不知道选择哪个？</p>
				<p>选择 [NO.0 测试] 开始试用</p>
				<p>或 联系负责人 确认心栈名字</p>
			</div>
		</mt-popup>
		<mt-popup class="popup-fullscreen"
			ref="fetchPopup"
			v-model="isFetching"
			position="right">
			<h3 class="text-center text-inverse">{{fetchHint}}</h3>
			<div class="p-8">
				<mt-button size="large"
					type="primary"
					@click="retry"
					:disabled="!fetchError">重试</mt-button>
			</div>
		</mt-popup>
	</div>
</template>

<script>
import { HomeIcon, EditIcon, TrashIcon } from 'vue-feather-icons';
import MainView from './main.vue';
import Checkin from './checkin.vue';
import Comment from './comment.vue';
import xzTable from '../xz-table';

export default {
	name: 'home',
	components: { HomeIcon, EditIcon, TrashIcon, Checkin, MainView, Comment },
	created() {
		this.maybeFetch();
		this.$nextTick(() => {
			this.slots[0].defaultIndex = 3;
		});
	},
	data() {
		const nameTable = Object.keys(xzTable).map(key => {
			return {
				name: `NO.${key} ${xzTable[key]}`,
				loc: key
			};
		});

		return {
			active: 'home',
			locPopupVis: false,
			slots: [
				{
					values: nameTable,
					flex: 1,
					defaultIndex: 0
				}
			],
			fetching: false,
			fetchError: ''
		};
	},
	computed: {
		isFetching: {
			get: function() {
				return Boolean(this.fetching || this.fetchError);
			},
			set: function() {

			}
		},
		fetchHint() {
			if (this.fetching) {
				return '连接服务器中...';
			}

			return this.fetchError;
		},
		hideTabbar() {
			return this.$store.state.hideTabbar;
		}
	},
	methods: {
		setActive(arg) {
			this.active = arg;
		},
		maybeFetch() {
			const loc = localStorage.getItem('sign_loc');
			if (!loc) {
				this.locPopupVis = true;
			} else {
				this.handleFetch(loc);
			}
		},
		confirmLoc() {
			this.locPopupVis = false;
			const xzInfo = this.$refs.locValue.values[0];
			this.handleFetch(xzInfo.loc);
		},
		handleFetch(loc) {
			this.locPopupVis = false;
			this.fetching = true;
			this.$store.dispatch('setLocation', loc)
				.then(this.onFetchDone)
				.catch(this.onFetchError);
		},
		retry() {
			this.fetching = true;
			this.$store.dispatch('fetchData')
				.then(this.onFetchDone)
				.catch(this.onFetchError);
		},
		onFetchDone() {
			this.fetching = false;
			this.fetchError = '';
		},
		onFetchError(err) {
			const res = err.response;
			const errStr = (res && res.data && res.data.msg) ? res.data.msg : String(err);

			this.fetching = false;
			this.fetchError = errStr;
		}
	}
}
</script>
