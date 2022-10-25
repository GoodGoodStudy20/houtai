export const uniqueTXT = "wlyn_";
export const auditStatusTag = [{
    type: 'info',
    text: '未提交'
  },
  {
    type: 'primary',
    text: '审批中'
  },
  {
    type: 'success',
    text: '审批通过'
  },
  {
    type: 'warning',
    text: '退回'
  },
  {
    type: 'danger',
    text: '撤回审批'
  }
]
export const approvalStatusTag = [{
    type: 'info',
    text: '待审批'
  },
  {
    type: 'success',
    text: '已审批'
  },
  {
    type: 'warning',
    text: '已退回'
  },
  {
    type: 'danger',
    text: '已撤回'
  }
]
export const provinceList = [{
    value: '110000',
    label: '北京市'
  },
  {
    value: '120000',
    label: '天津市'
  },
  {
    value: '130000',
    label: '河北省'
  },
  {
    value: '140000',
    label: '山西省'
  },
  {
    value: '150000',
    label: '内蒙古自治区'
  },
  {
    value: '210000',
    label: '辽宁省'
  },
  {
    value: '220000',
    label: '吉林省'
  },
  {
    value: '230000',
    label: '黑龙江省'
  },
  {
    value: '310000',
    label: '上海市'
  },
  {
    value: '320000',
    label: '江苏省'
  },
  {
    value: '330000',
    label: '浙江省'
  },
  {
    value: '340000',
    label: '安徽省'
  },
  {
    value: '350000',
    label: '福建省'
  },
  {
    value: '360000',
    label: '江西省'
  },
  {
    value: '370000',
    label: '山东省'
  },
  {
    value: '410000',
    label: '河南省'
  },
  {
    value: '420000',
    label: '湖北省'
  },
  {
    value: '430000',
    label: '湖南省'
  },
  {
    value: '440000',
    label: '广东省'
  },
  {
    value: '450000',
    label: '广西壮族自治区'
  },
  {
    value: '460000',
    label: '海南省'
  },
  {
    value: '500000',
    label: '重庆市'
  },
  {
    value: '510000',
    label: '四川省'
  },
  {
    value: '530000',
    label: '贵州省'
  },
  {
    value: '610000',
    label: '云南省'
  },
  {
    value: '630000',
    label: '西藏自治区'
  },
  {
    value: '650000',
    label: '陕西省'
  },
  {
    value: '520000',
    label: '甘肃省'
  },
  {
    value: '540000',
    label: '青海省'
  },
  {
    value: '620000',
    label: '宁夏回族自治区'
  },
  {
    value: '640000',
    label: '新疆维吾尔自治区'
  },
  {
    value: '710000',
    label: '台湾省'
  },
  {
    value: '810000',
    label: '香港特别行政区'
  },
  {
    value: '820000',
    label: '澳门特别行政区'
  },
]

export function getCookies(keys) {
  keys = uniqueTXT + keys
  try {
    const value = sessionStorage.getItem(keys);
    if (value === null || value === undefined || value === "") {
      return null;
    }
    return JSON.parse(sessionStorage.getItem(keys));
  } catch (err) {
    return null
  }

}

export function setCookies(keys, params) {
  keys = uniqueTXT + keys
  return sessionStorage.setItem(keys, JSON.stringify(params))
}

export function removeCookies(keys) {
  keys = uniqueTXT + keys
  sessionStorage.removeItem(keys)
}

export function exportCommon(url, param, callback) {
  const baseURL = process.env.VUE_APP_BASEURL
  const token = getCookies('x-token')
  let paramList = []
  for (let i in param) {
    paramList.push(`${i}=${param[i]}`)
  }
  let aurl = `${baseURL}${url}?${paramList.join('&')}`
  console.log('导出地址+', aurl)
  window.location.href = aurl
  if (callback) callback()
}


/** 
   //浮点计算乘法
   @param{Number} arg1 因数1
   @param{Number} arg2 因数2
   @returns 返回积
*/
export function NumberMul(arg1, arg2) {
  let m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) {}
  try {
    m += s2.split(".")[1].length
  } catch (e) {}
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
/** 
   //浮点计算减法
   @param{Number} arg1 被减数
   @param{Number} arg2 减数
   @returns 返回差
*/
export function NumberSub(arg1, arg2) {
  let r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (NumberMul(arg1, m) - NumberMul(arg2, m)) / m
}

/** 
 //浮点计算加法
 @param{Number} arg1 加数1
 @param{Number} arg2 加数1
 @returns 返回和
*/
export function NumberAdd(arg1, arg2) {
  let r1, r2, m;
  try {
    r1 = arg1.toString().split(".")[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split(".")[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (NumberMul(arg1, m) + NumberMul(arg2, m)) / m
}
/** 
   //身份证算法校验
   @param{Number | String} id_no 身份证号码
   @returns 返回校验结果
*/
export function CheckIdCard(id_no) {
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
  if (v == 10)
    v = 'x';
  let l = id_no.substr(17, 1);
  if (v != l.toLowerCase()) {
    return false
  } else {
    return true
  }
}