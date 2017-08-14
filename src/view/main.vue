<template>
	<div class="d-flex flex-column" id="main">
		<div class="flex-1 d-flex border-bottom">
			<div class="flex-2 border-right p-8">
				今日签到
			</div>
			<div class="flex-1 p-8 text-center">
				<p>同步成功</p>
				<refresh-cw-icon></refresh-cw-icon>
			</div>
		</div>
		<div class="flex-1 d-flex border-bottom">
			<div class="flex-1 border-right p-8">
				3月1日
			</div>
			<div class="flex-1 border-right p-8">
				天津南开
			</div>
			<div class="flex-1 p-8 text-center">
				<p>编辑备注</p>
				<message-circle-icon></message-circle-icon>
			</div>
		</div>
	</div>
</template>

<script>
import { RefreshCwIcon, MessageCircleIcon } from 'vue-feather-icons';

export default {
	name: 'main',
	components: { RefreshCwIcon, MessageCircleIcon }
}
</script>

<style scoped>
#main * {
	box-sizing: border-box;
}
.p-8 {
	padding: 8px;
}
</style>
