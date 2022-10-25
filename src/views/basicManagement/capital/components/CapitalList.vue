<template>
  <div>
    <div class="top">
      <div class="top-title">
        <div class="title-item table-text" @click="toClick"><img src="@/assets/img/left.png" alt=""><span>返回</span></div>
      </div>
      <el-button type="primary" @click="editDetail('', 'add')" size="small">新增</el-button>
    </div>
    <div class="search-box">
      <el-form inline size="small">
        <el-form-item label="模糊搜索">
          <el-input v-model="form.search" placeholder="名称、简称"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe :data="list" style="max-width: 100%;margin-top:15px;">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column label="名称" align="left" width="300" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="table-text" @click="editDetail(scope.row.id, 'show')">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="简称" prop="abbreviated" align="left"></el-table-column>
      <el-table-column label="授信额度(万)" prop="creditQuota" align="left"></el-table-column>
      <el-table-column label="用信额度(万)" prop="useQuota" align="left"></el-table-column>
      <el-table-column label="剩余额度(万)" prop="surplusQuota" align="left"></el-table-column>
      <el-table-column label="注册地址" prop="registeredAddress" align="left" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" width="100" align="left">
        <template slot-scope="scope">
          <el-tag size="mini" :type="!scope.row.isDisable ? 'primary' : 'warning'" disable-transitions>{{!scope.row.isDisable ?'启用':'禁用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作" width="260" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="editDetail(scope.row.id,'edit')">编辑</el-button>
          <el-button type="text" icon="el-icon-remove-outline" @click="setDisable(scope.row)">{{!scope.row.isDisable ? '禁用' : '启用'}}</el-button>
          <el-button type="text" icon="el-icon-delete" style="color:red" @click="deleteOne(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total"></el-pagination>

  </div>
</template>

<script>
import { deleteBackers, getBackersPage, backersIsDisable } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'CapitalList',
  props: ['value'],
  data() {
    return {
      form: {
        pageNum: 1,          //页码
        pageSize: 10,          //每页条数
        search: '',          //搜索条件
      },
      list: [],
      total: 0,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    toClick() {
      this.$router.go(-1)
    },
    getList() {
      getBackersPage(this.form).then(res => {
        if (res.code != 200) return
        this.list = res.data.records
        this.total = res.data.total
      })
    },
    handleSizeChange(val) {
      this.form.pageSize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.form.pageNum = val
      this.getList()
    },
    editDetail(id, type) {
      this.$emit('input', 1)
      this.$emit('edit', id, type)
    },
    deleteOne(id) {
      Confirm('确定删除该资方吗?', () => {
        deleteBackers({ id }).then(res => {
          if (res.code != 200) {
            this.$message.warning(res.msg || '删除失败')
            return
          }
          this.$message.success('删除成功')
          this.getList()
        })
      })
    },
    setDisable(row) {
      Confirm(`确定${!row.isDisable ? '禁用' : '启用'}该资方吗?`, () => {
        backersIsDisable({ id: row.id }).then(res => {
          if (res.code != 200) {
            this.$message.warning(res.msg || '操作失败')
            return
          }
          this.$message.success('操作成功')
          this.getList()
        })
      })
    },
  }
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
.total-amount {
  font-weight: 700;
}
</style>