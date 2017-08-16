<template>
	<div id="name-list" :style="{bottom: hideTabbar ? 0 : '55px'}">
		<mt-cell v-for="item in nameList"
			:key="item.index"
			:title="item.name"
			@click.native="showAction(item.index)"></mt-cell>
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
					type="text"
					v-model.trim="editName"></mt-field>
			</div>
			<div class="mint-cell">
				<div class="mint-cell-wrapper">
					<div class="mint-cell-title">
						<checkbox :checked.sync="tagTable['负责人']" value="负责人"></checkbox>
					</div>
					<div class="mint-cell-title">
						<checkbox :checked.sync="tagTable['熬粥']" value="熬粥"></checkbox>
					</div>
					<div class="mint-cell-title">
						<checkbox :checked.sync="tagTable['前行']" value="前行"></checkbox>
					</div>
				</div>
			</div>
			<div class="mint-cell">
				<div class="mint-cell-wrapper">
					<div class="mint-cell-title">
						<checkbox :checked.sync="tagTable['摄影']" value="摄影"></checkbox>
					</div>
					<div class="mint-cell-title">
						<checkbox :checked.sync="tagTable['日志']" value="日志"></checkbox>
					</div>
					<div class="mint-cell-title">
						<checkbox :checked.sync="tagTable['文宣']" value="文宣"></checkbox>
					</div>
				</div>
			</div>
			<div class="mint-cell">
				<div class="mint-cell-wrapper">
					<div class="mint-cell-title">
						<checkbox :checked.sync="tagTable['新人']" value="新人"></checkbox>
					</div>
					<div class="mint-cell-title">
						<checkbox :checked.sync="tagTable['结行']" value="结行"></checkbox>
					</div>
					<div class="mint-cell-title">
						<checkbox :checked.sync="tagTable['后勤']" value="后勤"></checkbox>
					</div>
					<div class="mint-cell-title">
						<checkbox :checked.sync="tagTable['环保']" value="环保"></checkbox>
					</div>
				</div>
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
		<mt-actionsheet
			:actions="actions"
			v-model="sheetVis"></mt-actionsheet>
	</div>
</template>

<script>
import checkbox from '../component/checkbox.vue';
import { toast } from 'mint-ui';

export default {
	name: 'checkin',
	components: { checkbox },
	data() {
		return {
			inputNamePopVis: false,
			sheetVis: false,
			editName: '',
			actionIndex: -1,
			tagTable: {
				'负责人': false,
				'熬粥': false,
				'前行': false,
				'摄影': false,
				'日志': false,
				'文宣': false,
				'新人': false,
				'结行': false,
				'后勤': false,
				'环保': false
			}
		};
	},
	computed: {
		actions() {
			const name = this.names[this.actionIndex];
			return [
				{
					name: '删除 ' + name,
					method: this.deleteName
				},
				{
					name: '编辑 ' + name,
					method: this.modifyName
				}
			]
		},
		names() {
			return this.$store.state.names;
		},
		tags() {
			return this.$store.getters.tags;
		},
		nameList() {
			return this.names.map((name, i) => {
				const tagList = this.tags[i];
				const tagSurfix = tagList.join('') ? '（' + tagList.join('，') + '）' : '';
				return {
					name: (i + 1) + '、' + name + tagSurfix,
					index: i
				};
			});
		},
		hasName() {
			return this.editName.length > 0;
		},
		hideTabbar() {
			return this.$store.state.hideTabbar;
		}
	},
	methods: {
		addName() {
			this.actionIndex = -1;
			this.inputNamePopVis = true;
			// clear input
			this.editName = '';
			Object.keys(this.tagTable).forEach(key => {
				this.tagTable[key] = false;
			});
		},
		confirmName() {
			const tagList = Object.keys(this.tagTable).filter(key => {
				return this.tagTable[key];
			});
			const action = this.actionIndex > -1 ? 'editName' : 'addName';

			this.$store.dispatch(
				action,
				{ name: this.editName, tagList, index: this.actionIndex }
			).catch(this.onSyncError);
			this.inputNamePopVis = false;
		},
		deleteName() {
			this.$store.dispatch('deleteName', this.actionIndex)
				.catch(this.onSyncError);
		},
		onSyncError(err) {
			this.$toast('同步失败：' + err);
		},
		modifyName() {
			this.inputNamePopVis = true;
			// refill input
			this.editName = this.names[this.actionIndex];
			Object.keys(this.tagTable).forEach(key => {
				this.tagTable[key] = this.tags[this.actionIndex].indexOf(key) !== -1;
			});
		},
		showAction(index) {
			this.actionIndex = index;
			this.sheetVis = true;
		}
	},
	watch: {
		sheetVis(newValue) {
			if (newValue) {
				this.$store.commit('hideTabbar');
			} else {
				this.$store.commit('showTabbar');
			}
		},
		inputNamePopVis(newValue) {
			if (newValue) {
				this.$store.commit('hideTabbar');
			} else {
				this.$store.commit('showTabbar');
			}
		}
	}
}
</script>

<style scoped>
#fab {
	position: fixed;
	right: 20px;
	bottom: 75px;
	color: white;
}
#name-list {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	overflow-y: auto;
}
</style>
