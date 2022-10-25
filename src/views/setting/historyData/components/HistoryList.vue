<template>
  <div>
    <div class="search-box">
      <el-form size="small" inline>
        <el-form-item label="模糊搜索">
          <el-input style="width:220px;" placeholder="姓名、手机号、卡号、身份证" v-model="form.search" clearable></el-input>
        </el-form-item>
        <el-form-item label="标签类型">
          <el-select v-model="form.type" placeholder="请选择标签类型" style="width:160px">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,i) in tagTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="时间">
          <el-date-picker v-model="form.operateStartTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:200px"></el-date-picker> 至
          <el-date-picker v-model="form.operateEndTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:200px"></el-date-picker>
        </el-form-item> -->
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe :data="list" style="margin-top:15px;" :header-cell-style="{'background-color':'#F4F8FF'}">
      <el-table-column type="index" align="center" label="序号" width="80"></el-table-column>
      <el-table-column prop="name" label="姓名" align="left" width="120">
        <template slot-scope="scope">
          <span class="table-text" @click="editDetail(scope.row.phone, 'show',scope.row.type)">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" align="left" label="手机号" width="160"></el-table-column>
      <el-table-column prop="idCode" align="left" min-width="180" label="身份证号码"></el-table-column>
      <el-table-column prop="cardNumber" align="left" min-width="180" label="银行卡号"></el-table-column>
      <el-table-column prop="quantity" align="left" width="100" label="交易次数"></el-table-column>

      <el-table-column prop="amount" align="right" label="金额（元）" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.amount || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="分类标签" min-width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type==0" class="tag-item tag-item1" size="mini">个人</el-tag>
          <el-tag v-if="scope.row.type==1" class="tag-item tag-item2" size="mini">代理人</el-tag>
          <el-tag class="tag-item tag-item3" v-if="scope.row.region && scope.row.region!=='null'" size="mini">{{scope.row.region}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top:10px;" layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total">
    </el-pagination>
  </div>

</template>
<script>
import { getHistoryDataPage } from '@/api/index'
export default {
  name: 'historyData',
  data() {
    return {
      form: {
        pageNum: 1,//分页页数
        pageSize: 10,//每页显示多少
        type: '',
        search: ''
      },
      list: [],
      total: 0,//分页总页数
      tagTypeList: [
        { value: 0, label: '个人' },
        { value: 1, label: '代理人' }
      ]
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getHistoryDataPage(this.form).then(res => {
        if (res.code == 200) {
          this.total = res.data.total;
          this.list = res.data.records;
        }
      })
    },
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.getList(1);
    },
    handleCurrentChange(val) {
      this.form.pageNum = val;
      this.getList();
    },
    editDetail(phone, type, type2) {
      this.$emit('input', 1)
      this.$emit('edit', phone, type, type2)
    },
  },
}
</script>
<style lang="scss" scoped>
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