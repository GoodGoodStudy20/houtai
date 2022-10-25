<template>
  <div>
    <div class="search-box">
      <el-form size="small" inline>
        <el-form-item label="模糊搜索">
          <el-input style="width:180px;" placeholder="名字" v-model="form.search"></el-input>
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="form.operateType" placeholder="请选择" style="width:120px">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,i) in operateTypeList" :key="i" :label="item" :value="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker v-model="form.operateStartTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:200px"></el-date-picker> 至
          <el-date-picker v-model="form.operateEndTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:200px"></el-date-picker>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe :data="list" style="margin-top:15px;">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column prop="operatorName" label="操作人" align="center"></el-table-column>
      <el-table-column prop="phone" align="center" label="手机号"></el-table-column>
      <el-table-column align="center" label="操作类型">
        <template slot-scope="scope">
          {{operateTypeList[scope.row.operateType]}}
        </template>
      </el-table-column>
      <el-table-column prop="operateDesc" align="center" label="操作内容"></el-table-column>
      <el-table-column prop="operateIp" align="center" label="操作ip"></el-table-column>
      <el-table-column prop="operateTime" align="center" label="操作时间"></el-table-column>
      <el-table-column align="left" label="查看参数">
        <template slot-scope="scope">
          <span class="table-text" @click="ResultShow(scope.row)">查看参数</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top:10px;" layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total">
    </el-pagination>
    <ResultDialog v-model="isResultShow" v-if="isResultShow" :row="row"></ResultDialog>
  </div>

</template>
<script>
import { getOperationLogPage } from '@/api/index'
import ResultDialog from './ResultDialog'
export default {
  name: 'journal',
  components: { ResultDialog },
  data() {
    return {
      form: {
        search: "",
        operateType: '',
        operateStartTime: "",
        operateEndTime: "",
        pageNum: 1,//分页页数
        pageSize: 10,//每页显示多少
      },
      operateTypeList: ['登录', '新增', '查询', '修改', '删除', '导出', '导入'],
      list: [],
      total: 0,//分页总页数
      isResultShow: false,
      row: {}
    }
  },
  created() {
    this.getList();
  },
  methods: {
    ResultShow(row) {
      this.row = row
      this.isResultShow = true
    },
    getList() {
      getOperationLogPage(this.form).then(res => {
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
  },
}
</script>