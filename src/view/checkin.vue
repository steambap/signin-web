<template>
	<div>
		<mt-cell v-for="(name, index) in names"
			:key="index"
			:title="name"></mt-cell>
		<div class="mint-palette-button"
			id="fab"
			@click="addName">
			<div class="mint-main-button">+</div>
		</div>
		<mt-popup v-model="inputNamePopVis"
			position="right"
			class="popup-fullscreen">
			<div class="p-8">
				<mt-field label="名字"
					type="number"
					v-model.trim="editName"></mt-field>
			</div>

			<div class="d-flex">
				<div class="flex-0 p-8">
					<mt-button type="primary"
						size="large"
						@click="confirmName"
						:disabled="!hasName">确定</mt-button>
				</div>
				<div class="flex-0 p-8">
					<mt-button type="default"
						size="large"
						@click="inputNamePopVis = false">
						取消</mt-button>
				</div>
			</div>
		</mt-popup>
	</div>
</template>

<script>
export default {
	name: 'checkin',
	data() {
		return {
			inputNamePopVis: false,
			editName: ''
		};
	},
	computed: {
		names() {
			return this.$store.state.names;
		},
		tags() {
			return this.$store.getters.tags;
		},
		hasName() {
			return this.editName.length > 0;
		}
	},
	methods: {
		addName() {
			this.inputNamePopVis = true;
		},
		confirmName() {
			this.$store.dispatch('addName', {name: this.editName, tagList: []});
			this.inputNamePopVis = false;
		}
	}
}
</script>

<style scoped>
#fab {
	position: fixed;
	right: 20px;
	bottom: 75px;
}
</style>
