<template>
	<div class="d-flex flex-column" id="main">
		<div class="flex-1 d-flex border-bottom">
			<div class="flex-2 d-flex border-right"
				@click="activeCheckin">
				<div class="flex-0 p-8">
					今日签到：
					<div class="text-right">今日暂无</div>
				</div>
				<div class="flex-0 p-8 text-center">
					<edit-icon transform="scale(2) translate(0, 16)"></edit-icon>
				</div>
			</div>
			<div class="flex-1 p-8 text-center">
				<p>同步成功</p>
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
				<p>{{location}}</p>
				<map-pin-icon></map-pin-icon>
			</div>
			<div class="flex-1 p-8 text-center"
				@click="activeComment">
				<p>编辑备注</p>
				<message-circle-icon></message-circle-icon>
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

const xzList = Object.keys(xzTable).map(key => xzTable[key]);

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
		year() {
			return this.date.getFullYear();
		},
		month() {
			return this.date.getMonth() + 1;
		},
		day() {
			return this.date.getDate();
		},
		location() {
			return xzTable[this.$store.state.location];
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
				this.date.toISOString().slice(0, 10)
			);
		},
		pickLocation() {
			this.$refs.locPicker.open();
		},
		confirmLocation() {
			const xzInfo = this.$refs.locValue.values[0];
			if (!xzInfo) {
				return;
			}

			this.$store.dispatch('setLocation', xzInfo.loc);
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
</style>
