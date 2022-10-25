import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    menuList: [],
    taxType: '', // 税务类型
  },
  getters: {
    keepList: (state) => {
      return state.menuList.map((item) => {
        let name = item.path.split("/")[2];
        if (name) return name;
      });
    },
  },
  mutations: {
    addMenuList(state, menu = {}) {
      let index = state.menuList.findIndex((item) => item.id == menu.id);
      if (index == -1) {
        state.menuList.push(menu);
      }
    },
    setTaxType(state, taxType) {
      state.taxType = taxType
    }
  },
  actions: {},
});

export default store;
