import Vue from 'vue';
import Vuex from 'vuex'
import field from "@/store/modules/field";

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		field,
	}
})