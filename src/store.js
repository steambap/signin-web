import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const apiOrigin =
	process.env.NODE_ENV === 'development'
		? '/api/log'
		: 'http://139.129.225.83:8900/log';

const state = {
	location: '11',
	date: new Date().toISOString().slice(0, 10),
	names: [],
	tags: [],
	comment: '',
	cupSize: -1,
	lastSyncError: '',
	fetching: false
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
		localStorage.setItem('sign_loc', newLocation);
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
	updateComment(state, payload) {
		state.comment = payload.comment;
		state.cupSize = payload.cupSize;
	},
	setSyncError(state, msg) {
		state.lastSyncError = msg;
	},
	startFetch(state) {
		state.fetching = true;
	},
	endFetch(state) {
		state.fetching = false;
	},
	fillData(state, data) {
		state.names = data.names;
		state.tags = data.tags;
		state.comment = data.comment;
		state.cupSize = data.cup_size;
	}
};

const actions = {
	setDate({ commit, dispatch }, newDate) {
		commit('updateDate', newDate);

		return dispatch('fetchData');
	},
	setLocation({ commit, dispatch }, newLocation) {
		commit('updateLocation', newLocation);

		return dispatch('fetchData');
	},
	addName({ commit, dispatch }, payload) {
		commit('addName', payload);

		return dispatch('syncData');
	},
	editName({ commit, dispatch }, payload) {
		commit('editName', payload);

		return dispatch('syncData');
	},
	deleteName({ commit, dispatch }, index) {
		commit('deleteName', index);

		return dispatch('syncData');
	},
	updateComment({ commit, dispatch }, payload) {
		commit('updateComment', payload);

		return dispatch('syncData');
	},
	fetchData({ commit, state }) {
		commit('startFetch');

		return axios.get(`${apiOrigin}?date=${state.date}&loc=${state.location}`).then(res => {
			commit('endFetch');
			const data = res.data;
			commit('fillData', data);

			return data;
		}).catch(err => {
			const res = err.response;
			const errStr = (res && res.data && res.data.msg) ? res.data.msg : String(err);

			commit('setSyncError', errStr);
		});
	},
	syncData({ commit, state }) {
		return axios
			.post(`${apiOrigin}?date=${state.date}&loc=${state.location}`, {
				names: state.names,
				tags: state.tags,
				comment: state.comment,
				cup_size: state.cupSize
			})
			.catch(err => {
				const res = err.response;
				const errStr = (res && res.data && res.data.msg) ? res.data.msg : String(err);
				
				commit('setSyncError', errStr);

				throw new Error(errStr);
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
