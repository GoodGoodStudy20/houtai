/** 
  //数组对象去重
  @param{Array} arr 源数组
  @param{String} field 去重字段
  @returns 返回去重后的数组
 */
export function toThousands(num = 0) {
  let c =
    num.toString().indexOf(".") !== -1
      ? num.toLocaleString()
      : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
  return c;
}
export default { toThousands };
