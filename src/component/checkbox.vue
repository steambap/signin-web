<template>
	<label class="mint-checklist-label">
		<span class="mint-checkbox">
			<input type="checkbox"
				class="mint-checkbox-input"
				:value="value"
				:checked="checked"
				@change="onChange($event)">
			<span class="mint-checkbox-core"></span>
		</span>
		<span class="mint-checkbox-label">{{value}}</span>
	</label>
</template>

<script>
export default {
	name: 'checkbox',
	model: {
		prop: 'checked',
		event: 'change'
	},
	props: {
		checked: Boolean,
		value: String
	},
	methods: {
		onChange(e) {
			this.$emit('change', e.target.checked);
			this.$emit('update:checked', e.target.checked);
		}
	}
}
</script>
