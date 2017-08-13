import Vue from 'vue';
import Router from 'vue-router';
import Home from './view/home.vue';
import Checkin from './view/checkin.vue';

Vue.use(Router);

const routes = [
	{
		path: '/',
		component: Home
	},
	{
		path: '/checkin',
		component: Checkin
	}
];

const router = new Router({
	routes
});

export default router;
