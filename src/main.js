import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import Element from "element-ui";
import { areaList } from "@/utils/area.js";
import "element-ui/lib/theme-chalk/index.css";
import filters from "./filters/index.js";
Object.keys(filters).map((v) => {
  Vue.filter(v, filters[v]);
});
import * as d3 from "d3";
Vue.prototype.$d3 = d3;
window.d3 = d3; //暂时设置为全局变量
Vue.prototype.$validate = function (formName) {
  let a = true;
  this.$refs[formName].validate((valid) => {
    if (!valid) {
      a = false;
      this.$message.error({
        title: "错误",
        message: "请检查完善输入项并重试",
        duration: 1500,
      });
      return;
    }
  });
  return a;
};
Vue.use(Element);
Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue();
Vue.prototype.PLACEHOLDER_BAR = "--"; // 占位符
Vue.prototype.NO_DATA = "暂无数据"; // 暂无数据
Vue.directive("debounce", {
  //按钮防抖指令
  inserted: function (el, binding) {
    let timer;
    let i = 0;
    el.addEventListener("click", () => {
      if (i++ >= 5) {
        Element.Message.warning("操作频繁，5秒后重试");
        i = 0;
      }
      if (timer) {
        clearTimeout(timer);
      }
      let callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
        i = 0;
      }, 5000);
      if (callNow) binding.value();
    });
  },
});
Vue.filter("address", function (value) {
  if (!value) return "";
  let address = "";
  for (let item of areaList) {
    if (item.id == value) {
      address = item.content;
      return address;
    }
    if (item.children && item.children.length) {
      for (let item2 of item.children) {
        if (item2.id == value) {
          address = item.content + " " + item2.content;
          return address;
        }
        if (item2.children && item2.children.length) {
          for (let item3 of item2.children) {
            if (item3.id == value) {
              address =
                item.content + " " + item2.content + " " + item3.content;
              return address;
            }
          }
        }
      }
    }
  }
});
Vue.filter("typeName", function (value) {
  return value == "add"
    ? "添加"
    : value == "edit"
    ? "编辑"
    : value == "show"
    ? "查看"
    : value == "flushRed"
    ? "冲红"
    : value == "tovoid"
    ? "作废"
    : "";
});
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
