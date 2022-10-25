<template>
  <div class="switch-box">
    <el-form size="small" :model="form" label-width="140px">
      <el-form-item label="短信开关">
        <el-switch v-model="msgSwitch" @change="changeMsg" active-color="#13ce66" inactive-color="#ff4949" active-text="开" inactive-text="关"></el-switch>
      </el-form-item>
      <el-form-item label="还款通知天数">
        <el-input style="width:220px" v-model="form.repaymentNoticeDays" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
        <el-button type="primary" style="margin-left:20px" @click="editRepaymentNoticeDays">修改</el-button>
      </el-form-item>
      <el-form-item label="还款通知时间">
        <el-time-picker v-model="form.repaymentNoticeTime" value-format='HH:mm:ss' placeholder="选择还款通知时间">
        </el-time-picker>
        <el-button type="primary" style="margin-left:20px" @click="editRepaymentNoticeTime">修改</el-button>
      </el-form-item>
      <el-form-item label="定时任务">
        <!-- <el-input style="width:400px" v-model="form.triggertaskjob"></el-input> -->
        <el-select v-model="form.date" multiple placeholder="请选择" @change="select" style="width:220px">
          <el-option v-for="item in hours" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
        <el-button type="primary" style="margin-left:20px" @click="editTask">修改</el-button>
      </el-form-item>
      <el-form-item label="未回款通知天数">
        <el-input style="width:220px" v-model="form2.days" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
        <el-button type="primary" style="margin-left:20px" @click="updateNotReturnMoneyNoticeDays">修改</el-button>
      </el-form-item>
      <el-form-item label="未回款通知时间">
        <el-time-picker v-model="form2.time" value-format='HH:mm:ss' placeholder="选择还款通知时间">
        </el-time-picker>
        <el-button type="primary" style="margin-left:20px" @click="updateNotReturnMoneyNoticeTime">修改</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>
<script>
import {  updateSmsSend,
  getSmsSendState,
  getRepaymentNoticeDays,
  getRepaymentNoticeTime,
  updateRepaymentNoticeDays,
  updateRepaymentNoticeTime,
  getTask,
  startTask,
  updateTask,
  getNotReturnMoneyNoticeTime,
  getNotReturnMoneyNoticeDays,
  updateNotReturnMoneyNoticeDays,
  updateNotReturnMoneyNoticeTime
} from '@/api/index'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'journal',
  data() {
    return {
      msgSwitch: false,
      form: {
        repaymentNoticeDays: '',
        repaymentNoticeTime: '',
        triggertaskjob: '',
        date: ''
      },
      form2: {
        time: '',
        days: ''
      },
      date: '',
      hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    }
  },
  created() {
    this.getList();
  },
  methods: {
    select() {
      let a = this.form.date.sort((a, b) => a - b)
      this.date = '0 ' + '0 ' + a.toString() + ' * ' + '* ' + '* '
    },
    changeMsg() {
      updateSmsSend({ type: this.msgSwitch }).then(res => {
        this.$message.success('修改成功')
      })
    },
    //修改还款通知天数
    editRepaymentNoticeDays() {
      Confirm('确认修改还款通知天数吗?', () => {
        updateRepaymentNoticeDays({ days: this.form.repaymentNoticeDays }).then(res => {
          this.$message.success('修改成功')
          this.getList()
        })
      })
    },
    updateNotReturnMoneyNoticeDays() {
      Confirm('确认修改未回款通知天数吗?', () => {
        updateNotReturnMoneyNoticeDays({ days: this.form2.days }).then(res => {
          this.$message.success('修改成功')
          this.getList()
        })
      })
    },
    //修改还款通知时间
    editRepaymentNoticeTime() {
      Confirm('确认修改还款通知时间吗?', () => {
        updateRepaymentNoticeTime({ time: this.form.repaymentNoticeTime }).then(res => {
          this.$message.success('修改成功')
          this.getList()
        })
      })
    },
    //修改还款通知时间
    updateNotReturnMoneyNoticeTime() {
      Confirm('确认修改未回款通知时间吗?', () => {
        updateNotReturnMoneyNoticeTime({ time: this.form2.time }).then(res => {
          this.$message.success('修改成功')
          this.getList()
        })
      })
    },
    editTask() {
      Confirm('确认修改定时任务吗?', () => {
        updateTask({ cron: this.date, type: 'triggertaskjob' }).then(res => {
          this.$message.success('修改成功')
          this.getList()
        })
      })
    },
    getList() {
      getSmsSendState({}).then(res => {
        if (res.code == 200) {
          this.msgSwitch = res.data;
        }
      })
      getRepaymentNoticeDays({}).then(res => {
        if (res.code == 200) {
          this.form.repaymentNoticeDays = res.data;
        }
      })
      getRepaymentNoticeTime({}).then(res => {
        if (res.code == 200) {
          this.form.repaymentNoticeTime = res.data;
        }
      })
      getNotReturnMoneyNoticeTime({}).then(res => {
        if (res.code == 200) {
          this.form2.time = res.data;
        }
      })
      getNotReturnMoneyNoticeDays({}).then(res => {
        if (res.code == 200) {
          this.form2.days = res.data;
        }
      })
      getTask({}).then(res => {
        if (res.code == 200) {
          let result = res.data
          var obj = result.split('=')[2].split('}')[0]
          this.form.triggertaskjob = obj
          let c = '[' + this.form.triggertaskjob.replace(/\ /g, "").substr(2).replace(/\*/g, "") + ']'
          this.form.date = JSON.parse(c)
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.switch-box {
  background: #fff;
  height: 100%;
  padding: 20px;
  border-radius: 10px;
  box-sizing: border-box;
}
</style>