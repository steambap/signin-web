<template>
	<div class="bg-white" id="main">
		<div class="flex-1 d-flex border-bottom">
			<div class="flex-2 d-flex border-right"
				@click="activeCheckin">
				<div class="flex-0 p-8">
					<span class="text-inverse">今日签到：</span>
					<div class="text-right">{{checkinMeta[0]}}</div>
					<div class="text-right">{{checkinMeta[1]}}</div>
				</div>
				<div class="flex-0 p-8 text-center" style="padding-top: 24px">
					<edit-icon
						width="48" height="48"
						class="stroke-primary"></edit-icon>
				</div>
			</div>
			<div class="flex-1 p-8 text-center"
				:class="{
					'text-grey': !syncError,
					'text-danger': syncError
				}"
				@click="resync">
				<p>{{syncHint}}</p>
				<refresh-cw-icon></refresh-cw-icon>
			</div>
		</div>
		<div class="flex-1 d-flex border-bottom">
			<div class="flex-1 border-right p-8 text-center"
				id="date-cell"
				@click="pickDate">
				<p>{{year}}年{{month}}月</p>
				<h2>
					{{day}}
					<small>日</small>
				</h2>
			</div>
			<div class="flex-1 border-right p-8 text-center"
				@click="pickLocation">
				<p class="text-inverse">{{location}}</p>
				<map-pin-icon></map-pin-icon>
			</div>
			<div class="flex-1 p-8 text-center"
				@click="activeComment">
				<p class="text-inverse">编辑备注</p>
				<message-circle-icon class="stroke-primary"></message-circle-icon>
			</div>
		</div>
		<!-- popup -->
		<mt-datetime-picker
			ref="datePicker"
			type="date"
			v-model="date"
			@confirm="confirmDate"></mt-datetime-picker>
		<mt-popup
			ref="locPicker"
			v-model="locPickerVisible"
			position="bottom"
			class="w-100">
			<div class="picker-toolbar">
				<span class="mint-datetime-action mint-datetime-cancel"
					@click="locPickerVisible = false">取消</span>
				<span class="mint-datetime-action mint-datetime-confirm"
					@click="confirmLocation">确定</span>
			</div>
			<mt-picker
				:slots="slots"
				valueKey="name"
				:visibleItemCount="7"
				ref="locValue"></mt-picker>
		</mt-popup>
	</div>
</template>

<script>
import { RefreshCwIcon, MessageCircleIcon, MapPinIcon, EditIcon } from 'vue-feather-icons';
import xzTable from '../xz-table';

export default {
	name: 'main',
	components: { RefreshCwIcon, MessageCircleIcon, MapPinIcon, EditIcon },
	data() {
		const nameTable = Object.keys(xzTable).map(key => {
			return {
				name: `NO.${key} ${xzTable[key]}`,
				loc: key
			};
		});

		return {
			date: new Date(),
			locPickerVisible: false,
			slots: [
				{
					values: nameTable,
					flex: 1
				}
			]
		};
	},
	props: {
		setActive: {
			type: Function
		}
	},
	computed: {
		currentData() {
			return this.$store.state.date;
		},
		year() {
			return this.currentData.getFullYear();
		},
		month() {
			return this.currentData.getMonth() + 1;
		},
		day() {
			return this.currentData.getDate();
		},
		location() {
			return xzTable[this.$store.state.location];
		},
		checkinMeta() {
			const names = this.$store.state.names;
			if (names.length === 0) {
				return ['今天没有人', '点击添加'];
			} else if (names.length === 1) {
				return [names[0] + ' 老师', ''];
			} else {
				return [names[0], `等${names.length}位老师`]
			}
		},
		syncError() {
			return this.$store.state.lastSyncError;
		},
		syncHint() {
			if (this.syncError) {
				return this.syncError + '\n点击同步';
			}

			return '同步成功';
		}
	},
	methods: {
		activeCheckin() {
			this.setActive('checkin');
		},
		activeComment() {
			this.setActive('comment');
		},
		pickDate() {
			this.$refs.datePicker.open();
		},
		confirmDate() {
			this.$store.dispatch(
				'setDate',
				this.date
			).catch(err => {
				this.$toast('获取数据失败：' + err);
			});
		},
		pickLocation() {
			this.$refs.locPicker.open();
		},
		confirmLocation() {
			const xzInfo = this.$refs.locValue.values[0];
			if (!xzInfo) {
				return;
			}
			this.locPickerVisible = false;
			this.$store.dispatch('setLocation', xzInfo.loc).catch(err => {
				this.$toast('获取数据失败：' + err);
			});
		},
		resync() {
			if (!this.syncError) {
				return;
			}
			this.$store.dispatch('syncData').catch(err => {
				this.$toast('同步失败：' + err);
			});
		}
	}
}
</script>

<style scoped>
#main * {
	box-sizing: border-box;
}
#date-cell h2 {
	margin: 0;
	font-size: 2rem;
}
#date-cell small {
	font-size: 1rem;
}
.stroke-primary {
	stroke: #26a2ff;
}
.text-danger svg {
	stroke: #ef4336;
}
</style>
