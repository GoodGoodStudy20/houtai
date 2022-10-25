import { MessageBox, Message } from 'element-ui';
/** 
   //通用二次确认弹框
   @param{String} msg 提示语
   @param{Function}} callback 回调函数
*/
export const Confirm = (msg, callback) => {
  MessageBox.confirm(msg, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    callback()
  }).catch(() => {
    Message({
      type: 'info',
      message: '已取消'
    });
  });
}