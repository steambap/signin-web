<template>
	<div>
		<mt-field label="杯数"
			type="number"
			v-model.number="cupSize"></mt-field>
		<mt-field label="备忘"
			type="textarea"
			rows="4"
			v-model="comment"></mt-field>
		<div class="d-flex bg-white">
			<div class="flex-0 p-8">
				<mt-button type="primary"
					size="large"
					:disabled="!hasChange || !inputValid"
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
	</div>
</template>

<script>
import { toast } from 'mint-ui';

export default {
	name: 'comment',
	props: ['active'],
	created() {
		this.resetChange();
	},
	data() {
		return {
			comment: '',
			cupSize: 0
		}
	},
	computed: {
		hasChange() {
			return this.comment !== this.$store.state.comment ||
				this.cupSize !== this.$store.state.cupSize;
		},
		inputValid() {
			return Number.isFinite(this.cupSize);
		}
	},
	methods: {
		confirmChange() {
			this.$store.dispatch(
				'updateComment',
				{ comment: this.comment, cupSize: this.cupSize }
			).catch(err => {
				this.$toast('同步失败：' + err);
			});
		},
		resetChange() {
			this.comment = this.$store.state.comment;
			this.cupSize = this.$store.state.cupSize;
		}
	},
	watch: {
		active(newValue, oldValue) {
			if (newValue === 'comment') {
				// Sync with store on change
				this.resetChange();
			} else if (oldValue === 'comment' && this.hasChange && this.inputValid) {
				// Save if he hasn't done so
				this.confirmChange();
			}
		}
	}
}
</script>