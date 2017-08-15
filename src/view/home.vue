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
				<mt-field label="杯数" type="number"></mt-field>
				<mt-field label="自我介绍" type="textarea" rows="4"></mt-field>
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
	data() {
		return {
			active: 'checkin'
		};
	},
	methods: {
		setActive(arg) {
			this.active = arg;
		}
	}
}
</script>
