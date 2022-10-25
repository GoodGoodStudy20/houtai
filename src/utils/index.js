/** 
  //数组对象去重
  @param{Array} arr 源数组
  @param{String} field 去重字段
  @returns 返回去重后的数组
 */
export function ArrayDistinct(arr, field) {
  let obj = {};
  let list = arr.reduce((cur, next) => {
    obj[next[field]] ? "" : (obj[next[field]] = true && cur.push(next));
    return cur;
  }, []);
  return list;
}
/**
 * @description: 防抖函数
 * @param {*} fn
 * @param {*} t
 * @return {*}
 */

export const Debounce = (fn, t) => {
  let delay = t || 400;
  let timer;
  return function () {
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    let callNow = !timer;
    timer = setTimeout(() => {
      timer = null;
    }, delay);

    if (callNow) fn.apply(this, args);
  };
};

/**
 * @description: 高德地图坐标转百度地图坐标
 * @param {*} gg_lng ,gg_lat
 * @return {*}bd_lat ,bd_lng
 */
export function bd_encrypt(gg_lng, gg_lat) {
  var X_PI = (Math.PI * 3000.0) / 180.0;
  var x = gg_lng,
    y = gg_lat;
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
  var bd_lng = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  return {
    lat: bd_lat,
    lng: bd_lng,
  };
}

/** 
 //浮点计算加法
 @param{Array} list 加数集合
 @returns 返回和
*/
export function NumberAdd(list) {
  let length = list.length; //获得传入参数数组长度
  if (!length) return 0;
  if (length == 1) return list[0];
  let arg1 = 0; //初始值
  for (let i = 0; i < length; i++) {
    let arg2 = list[i] || 0; //加数
    let r1, r2, m;
    try {
      r1 = String(arg1).split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = String(arg2).split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    arg1 = (arg1 * m + arg2 * m) / m;
  }
  return arg1;
}
/** 
   //浮点计算乘法
   @param{Number} arg1 因数1
   @param{Number} arg2 因数2
   @returns 返回积
*/
export function NumberMul(arg1 = 0, arg2 = 0) {
  arg1 = arg1 ? arg1 : 0;
  arg2 = arg2 ? arg2 : 0;
  let m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) {}
  try {
    m += s2.split(".")[1].length;
  } catch (e) {}
  return (
    (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) /
    Math.pow(10, m)
  );
}
/** 
   //浮点计算减法
   @param{Number} arg1 被减数
   @param{Number} arg2 减数
   @returns 返回差
*/
export function NumberSub(arg1 = 0, arg2 = 0) {
  let r1, r2, m;
  arg1 = arg1 ? arg1 : 0;
  arg2 = arg2 ? arg2 : 0;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2));
  return (NumberMul(arg1, m) - NumberMul(arg2, m)) / m;
}
/** 
   //浮点计算除法
   @param{Number} arg1 被除数
   @param{Number} arg2 除数
   @returns 返回商
*/
export function NumberDiv(arg1 = 0, arg2 = 0) {
  let t1 = 0,
    t2 = 0,
    r1,
    r2;
  arg1 = arg1 ? arg1 : 0;
  arg2 = arg2 ? arg2 : 0;
  try {
    t1 = arg1.toString().split(".")[1].length;
  } catch (e) {}
  try {
    t2 = arg2.toString().split(".")[1].length;
  } catch (e) {}

  r1 = Number(arg1.toString().replace(".", ""));
  r2 = Number(arg2.toString().replace(".", ""));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}
/** 
   //身份证算法校验
   @param{Number | String} id_no 身份证号码
   @returns 返回校验结果
*/
export function CheckIdCard(id_no) {
  if (
    !/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
      id_no
    )
  ) {
    return false;
  }
  let c = 0;
  let p = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  for (let i = 0; i < 17; i++) {
    let n = id_no.substr(i, 1);
    n = parseInt(n);
    c += p[i] * n;
  }
  let y = c % 11;
  let r = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
  let v = r[y];
  if (v == 10) v = "x";
  let l = id_no.substr(17, 1);

  if (v != l.toLowerCase()) {
    return false;
  } else {
    return true;
  }
}

/** 
   //合并对象key相同的值
   @param{Object} obj1 源对象
   @param{Object} obj2 源对象
   @returns 返回校验结果
*/
export function Assign(obj1, obj2) {
  for (let i in obj1) {
    for (let k in obj2) {
      if (i == k) {
        obj1[i] = obj2[k];
      }
    }
  }
}
/** 
   //导出
   @param{String} url 导出路径
   @param{Object} param 传参
   @param{Function} callback 回调函数
   @returns 返回校验结果
*/
export function exportCommon(url, param, callback) {
  const baseURL = process.env.VUE_APP_BASEURL;
  let paramList = [];
  for (let i in param) {
    paramList.push(`${i}=${param[i]}`);
  }
  let aurl = `${baseURL}${url}?${paramList.join("&")}`;
  window.location.href = aurl;
  if (callback) callback();
}

import axios from "axios";
import { baseURL } from "@/api/http";
// 标注了自定义的 可以自己先写死地址和token测试下，很快的
export function newExportsExcel(url, params = {}) {
  //这是请求的地址 （自定义）
  // 这是请求头中需要的token （自定义）
  let token = sessionStorage.getItem("x-token");
  return axios({
    method: "get",
    params,
    url: baseURL + url,
    // url: url,
    timeout: 6000000,
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      // "Content-Type": "application/x-www-form-urlencoded",
      Authorization: token,
    },
    responseType: "arraybuffer", // 相应类型如果有的话，就用接口中的，如果没有就默认为null
    // responseType: "blod", // 相应类型如果有的话，就用接口中的，如果没有就默认为null
  });
}
