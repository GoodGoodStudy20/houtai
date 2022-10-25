<template>
  <div>
    <div class="search-box">
      <el-button type="primary" class="button-cancel" @click="cancel">返回</el-button>
      <el-form size="small" inline>
        <el-form-item label="所属年份">

          <el-date-picker v-model="form.yearFile" type="year" value-format="yyyy" format="yyyy" placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="时间">
          <el-date-picker v-model="form.operateStartTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:200px"></el-date-picker> 至
          <el-date-picker v-model="form.operateEndTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:200px"></el-date-picker>
        </el-form-item> -->
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">搜索</el-button>
        </el-form-item>
        <el-form-item label="分类标签：" class="form-mr">
          <el-tag v-if="type==0" class="tag-item tag-item1" size="mini">个人</el-tag>
          <el-tag v-if="type==1" class="tag-item tag-item2" size="mini">代理人</el-tag>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe :data="list" style="margin-top:15px;">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column prop="name" label="姓名" align="left" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" align="left" label="手机号" width="120"></el-table-column>
      <el-table-column prop="idCode" align="left" label="身份证号码"></el-table-column>
      <el-table-column prop="cardNumber" align="left" label="银行卡号"></el-table-column>
      <el-table-column prop="amount" align="left" label="金额（元）" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.amount || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="yearFile" align="left" label="所属年份" width="180"></el-table-column>
    </el-table>
    <el-pagination style="margin-top:10px;" layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total">
    </el-pagination>
  </div>

</template>
<script>
import { getHistoryDataPageByPhone } from '@/api/index'
export default {
  name: 'historyData',
  props: ['phone', 'type'],
  data() {
    return {
      form: {
        pageNum: 1,//分页页数
        pageSize: 10,//每页显示多少
        yearFile: ''
      },
      list: [],
      total: 0,//分页总页数
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getHistoryDataPageByPhone({ phone: this.phone, ...this.form }).then(res => {
        if (res.code == 200) {
          this.total = res.data.total;
          this.list = res.data.records;
        }
      })
    },
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.form.pageNum = val;
      this.getList();
    },
    cancel() {
      this.$emit('input', 0)
    },
  },
}
</script>
<style lang="scss" scoped>
.button-cancel {
  margin-bottom: 20px;
}
.form-mr {
  float: right;
  margin-right: 100px;
}
.tag-item {
  margin: 5px;
  padding: 0 20px;
}
.tag-item1 {
  background-color: #ddfae4;
  color: #5cccd0;
}
.tag-item2 {
  background-color: #ebf4ff;
  // color: #5cccd0;
}
.tag-item3 {
  background-color: #ffefe5;
  color: #ff6277;
}
</style>