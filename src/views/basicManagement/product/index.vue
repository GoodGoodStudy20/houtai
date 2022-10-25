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
          <el-input style="width:180px;" placeholder="请输入名称搜索" v-model="form.search"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe :data="list" style="margin-top:15px;">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column prop="productTypeId" align="left" label="产品分类">
        <template slot-scope="scope">
          <span>{{scope.row.productTypeVo.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sysName" label="产品名称" align="left">
        <template slot-scope="scope">
          <el-button type="text" @click="editDetail(scope.row, 'show')">{{scope.row.name}}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="left" label="单价（元）">
        <template slot-scope="scope">
          {{scope.row.startPrice || 0 | toThousands}} - {{scope.row.endPrice || 0 | toThousands}}
        </template>
      </el-table-column>
      <el-table-column prop="standardService" align="left" label="服务标准" show-overflow-tooltip></el-table-column>
      <el-table-column prop="isDisable" align="left" label="状态" width="70">
        <template slot-scope="scope">
          <el-tag size="mini" :type="!scope.row.isDisable ? 'primary' : 'warning'" disable-transitions>{{!scope.row.isDisable ?'已启用':'已禁用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="editDetail(scope.row,'edit')">编辑</el-button>
          <el-button type="text" icon="el-icon-remove-outline" @click="setDisable(scope.row)">{{!scope.row.isDisable ? '禁用' : '启用'}}</el-button>
          <el-button type="text" icon="el-icon-delete" style="color:red" @click="deleteOne(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top:10px;" layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total">
    </el-pagination>
    <ProductForm v-if="isAddDialog" v-model="isAddDialog" :editRow="editRow" :editType="editType" @success="getList"></ProductForm>

  </div>

</template>
<script>
import { getProductPage, ProductIsDisable, deleteProduct } from '@/api/index'
import ProductForm from './components/ProductForm.vue'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'product',
  components: {
    ProductForm
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
    toClick() {
      this.$router.go(-1)
    },
    getList() {
      getProductPage(this.form).then((response) => {
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
      Confirm(`确定${!row.isDisable ? '禁用' : '启用'}该产品吗?`, () => {
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
      Confirm('确定删除该产品吗?', () => {
        deleteProduct({ id }).then(res => {
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