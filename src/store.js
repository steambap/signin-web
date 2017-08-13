import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
	location: 0,
	names: [],
	tags: [],
	comment: '',
	cup_size: -1,
	lastSyncError: ''
};

const getters = {
	tags(state) {
		return state.tags.map(tagStr => {
			return tagStr.split('|');
		});
	}
};

const mutations = {

};

const actions = {};

const store = new Vuex.Store({
	strict: process.env.NODE_ENV === 'development',
	state,
	getters,
	mutations,
	actions
});

export default store;
