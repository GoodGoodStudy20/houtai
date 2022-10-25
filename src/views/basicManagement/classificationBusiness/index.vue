<template>
  <div>
    <div class="top">
      <div class="top-title">
        <div class="title-item table-text" @click="toClick"><img src="@/assets/img/left.png" alt=""><span>返回</span></div>
      </div>
      <el-button type="primary" size="small" @click="editDetail({},'add')">新增</el-button>
    </div>
    <div class="search-box">
      <el-form size="small" inline>
        <el-form-item label="名称">
          <el-input style="width:180px;" placeholder="请输入名称" v-model="form.search"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe :data="list" style="margin-top:15px;">
      <el-table-column type="index" align="center" label="序号" width="80"></el-table-column>
      <el-table-column prop="name" label="名称" align="left" width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="editDetail(scope.row, 'show')">{{scope.row.name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="remark" align="left" label="说明" show-overflow-tooltip></el-table-column>
      <el-table-column align="left" label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="editDetail(scope.row,'edit')">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" style="color:red" @click="deleteOne(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top:10px;" layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total">
    </el-pagination>
    <AddOrEditClassificationBusiness v-if="isAddDialog" v-model="isAddDialog" :editRow="editRow" :editType="editType" @success="getList"></AddOrEditClassificationBusiness>

  </div>

</template>
<script>
import { getBusinessScopeTypePage, deleteBusinessScopeType } from '@/api/index'
import AddOrEditClassificationBusiness from './components/AddOrEditClassificationBusiness.vue'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'classificationBusiness',
  components: {
    AddOrEditClassificationBusiness
  },
  data() {
    return {
      isAddDialog: false,
      isDisable: '',           //状态
      editRow: '',
      editType: '',            // 编辑状态 1是详情，2是编辑,''是添加
      list: [],
      form: {
        search: '',
        pageNum: 1,//分页页数
        pageSize: 10,//每页显示多少
      },
      total: 0,//分页总页数
      status: ['启用', '禁用'],
    }
  },
  created() {
    this.getList();
  },
  methods: {
    toClick() {
      this.$router.go(-1)
    },
    getList() {
      getBusinessScopeTypePage(this.form).then((response) => {
        if (response.code == 200) {
          this.total = response.data.total;
          this.list = response.data.records;
        } else {
          this.$message.error({
            title: '错误',
            message: response.msg || response.error_msg,
            duration: 1500
          });
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
    deleteOne(id) {
      Confirm('确定删除该产品吗?', () => {
        deleteBusinessScopeType({ id }).then(res => {
          if (res.code != 200) {
            this.$message.warning(res.msg || '删除失败')
            return
          }
          this.$message.success('删除成功')
          this.getList()
        })
      })
    },
    editDetail(row, type) {
      this.editType = type;
      this.editRow = row;
      this.isAddDialog = true;
    }
  },
}
</script>
<style lang="scss" scoped>
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.top-title {
  float: left;
  display: flex;
  .title-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin-right: 5px;
    img {
      width: 19px;
      height: 19px;
      margin-top: 2px;
    }
  }
}
</style>