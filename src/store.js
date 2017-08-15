import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
	location: '11',
	date: new Date().toISOString().slice(0, 10),
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
	updateDate(state, newDate) {
		state.date = newDate;
	},
	updateLocation(state, newLocation) {
		state.location = newLocation;
	},
	addName(state, payload) {
		state.names.push(payload.name);
		state.tags.push(payload.tagList.join('|'));
	},
	editName(state, payload) {
		Vue.set(state.names, payload.index, payload.name);
		Vue.set(state.tags, payload.index, payload.tagList.join('|'));
	},
	deleteName(state, index) {
		state.names.splice(index, 1);
		state.tags.splice(index, 1);
	},
	setSyncErr(state, msg) {
		state.lastSyncError = msg;
	}
};

const actions = {
	setDate({commit, dispatch}, newDate) {
		commit('updateDate', newDate);

		return dispatch('fetchData');
	},
	setLocation({commit, dispatch}, newLocation) {
		commit('updateLocation', newLocation);

		return dispatch('fetchData');
	},
	addName({commit, dispatch}, payload) {
		commit('addName', payload);

		return dispatch('syncData');
	},
	editName({commit, dispatch}, payload) {
		commit('editName', payload);

		return dispatch('syncData');
	},
	deleteName({commit, dispatch}, index) {
		commit('deleteName', index);

		return dispatch('syncData');
	},
	fetchData() {
		return Promise.resolve(null);
	},
	syncData({commit}) {
		return Promise.resolve(null).catch(err => {
			const res = err.response;
			if (res && res.data && res.data.msg) {
				commit('setSyncErr', res.data.msg)
			} else {
				commit('setSyncErr', String(err));
			}
		});
	}
};

const store = new Vuex.Store({
	strict: process.env.NODE_ENV === 'development',
	state,
	getters,
	mutations,
	actions
});

export default store;
