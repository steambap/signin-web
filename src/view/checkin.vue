<template>
	<div>
		<mt-cell v-for="(name, index) in names"
			:key="index"
			:title="name"></mt-cell>
	</div>
</template>

<script>
export default {
	name: 'checkin',
	data() {
		return {names: ['111', '222', '333']};
	}
}
</script>
