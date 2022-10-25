import axios from "axios";
import router from "../router";
import { Message } from "element-ui";
export const baseURL = process.env.VUE_APP_BASEURL;
axios.defaults.timeout =
  process.env.VUE_APP_TYPE === "production" ? 300000 : 600000;
axios.defaults.baseURL = baseURL;

//http request 拦截器
axios.interceptors.request.use(
  (config) => {
    config.headers = {
      "Content-Type": "application/json",
    };
    if (sessionStorage.getItem("x-token")) {
      config.headers["x-token"] = sessionStorage.getItem("x-token");
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

function logOut() {
  sessionStorage.removeItem("x-token");
  Message.error({
    message: "已下线,请重新登录",
    duration: 3500,
  });
  router.push("/login");
}
//http response 拦截器
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    let errorStatus = "Error: Request failed with status code 401" == error;
    if (errorStatus) {
      logOut();
    }
    if (JSON.stringify(error).indexOf("Error: timeout") != -1) {
      Message.error({
        title: "错误",
        message: "连接超时,请重试",
        duration: 2500,
      });
    }
    return Promise.reject(error);
  }
);

export default axios;
