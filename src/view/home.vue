<template>
	<div>
		<mt-tab-container v-model="active">
			<mt-tab-container-item id="home">
				<main-view :setActive="setActive"></main-view>
			</mt-tab-container-item>
			<mt-tab-container-item id="checkin">
				<checkin></checkin>
			</mt-tab-container-item>
			<mt-tab-container-item id="comment">
				<mt-field label="杯数"
					type="number"
					v-model="cupSize"
					@input="hasChange = true"></mt-field>
				<mt-field label="备忘"
					type="textarea"
					rows="4"
					v-model="comment"
					@input="hasChange = true"></mt-field>
			<div class="d-flex bg-white">
				<div class="flex-0 p-8">
					<mt-button type="primary"
						size="large"
						:disabled="!hasChange"
						@click="confirmChange">
						保存更改</mt-button>
				</div>
				<div class="flex-0 p-8">
					<mt-button type="default"
						size="large"
						:disabled="!hasChange"
						@click="resetChange">
						撤销更改</mt-button>
				</div>
			</div>
			</mt-tab-container-item>
		</mt-tab-container>
		<mt-tabbar v-model="active">
			<mt-tab-item id="home">
				<home-icon slot="icon"></home-icon>
				主页
			</mt-tab-item>
			<mt-tab-item id="checkin">
				<edit-icon slot="icon"></edit-icon>
				签到
			</mt-tab-item>
			<mt-tab-item id="comment">
				<message-circle-icon slot="icon"></message-circle-icon>
				备注
			</mt-tab-item>
		</mt-tabbar>
	</div>
</template>

<script>
import { HomeIcon, EditIcon, MessageCircleIcon } from 'vue-feather-icons';
import MainView from './main.vue';
import Checkin from './checkin.vue';

export default {
	name: 'home',
	components: { HomeIcon, EditIcon, MessageCircleIcon, Checkin, MainView },
	created() {
		this.resetChange();
	},
	data() {
		return {
			active: 'home',
			hasChange: false,
			comment: '',
			cupSize: 0
		};
	},
	methods: {
		setActive(arg) {
			this.active = arg;
		},
		confirmChange() {
			this.hasChange = false;
			this.$store.dispatch(
				'updateComment',
				{ comment: this.comment, cupSize: this.cupSize }
			);
		},
		resetChange() {
			this.hasChange = false;
			this.comment = this.$store.state.comment;
			this.cupSize = this.$store.state.cupSize;
		}
	},
	watch: {
		active(newValue, oldValue) {
			if (newValue === 'comment') {
				// Sync with store on change
				this.resetChange();
			} else if (oldValue === 'comment' && this.hasChange) {
				// Save if he hasn't done so
				this.confirmChange();
			}
		}
	}
}
</script>
