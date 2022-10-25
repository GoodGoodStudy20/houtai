<template>
  <div>
    <el-button type="primary" size="small" @click="editDetail({},'add')">新增</el-button>
    <div class="search-box">
      <el-form size="small" inline>
        <el-form-item label="名称">
          <el-input style="width:180px;" placeholder="请输入名称搜索" v-model="form.search"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe :data="list" style="margin-top:15px;">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column prop="name" label="名称" align="left">
        <template slot-scope="scope">
          <el-button type="text" @click="editDetail(scope.row, 'show')">{{scope.row.name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="remark" align="left" label="说明" show-overflow-tooltip></el-table-column>
      <el-table-column align="left" label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="editDetail(scope.row,'edit')">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" style="color:red" @click="deleteOne(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top:10px;" layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total">
    </el-pagination>
    <ServiceProviderTypeForm v-if="isAddDialog" v-model="isAddDialog" :editRow="editRow" :editType="editType" @success="getList"></ServiceProviderTypeForm>

  </div>

</template>
<script>
import { getServiceProviderTypePage, deleteServiceProviderType } from '@/api/index'
import ServiceProviderTypeForm from './components/ServiceProviderTypeForm.vue'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'product',
  components: {
    ServiceProviderTypeForm
  },
  data() {
    return {
      // Dialog
      isAddDialog: false,
      isDisable: '',           //状态
      editRow: '',
      editType: '',            // 编辑状态 1是详情，2是编辑,''是添加
      list: [],
      form: {
        search: '',
        status: '',
        pageNum: 1,//分页页数
        pageSize: 10,//每页显示多少
      },
      total: 0,//分页总页数
      status: ['正常', '撤销'],
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getServiceProviderTypePage(this.form).then((response) => {
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
    setDisable(row) {
      Confirm(`确定${!row.isDisable ? '禁用' : '启用'}该服务商分类吗?`, () => {
        ProductIsDisable({ id: row.id }).then(res => {
          if (res.code != 200) {
            this.$message.warning(res.msg || '操作失败')
            return
          }
          this.$message.success('操作成功')
          this.getList()
        })
      })
    },
    deleteOne(id) {
      Confirm('确定删除该服务商分类吗?', () => {
        deleteServiceProviderType({ id }).then(res => {
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