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
        <el-form-item label="类型">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in CustomerType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="级别">
          <el-select v-model="form.level" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in LevelType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属分公司">
          <el-select v-model="form.companyId" placeholder="请选择" filterable>
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in customerList" :key="item.id" :label="item.abbreviated" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属地区">
          <ChooseArea :province.sync="form.province" :city.sync="form.city" style="width:200px" checkStrictly></ChooseArea>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe :data="list" style="max-width: 100%;margin-top:15px;">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column label="名称" align="left" show-overflow-tooltip min-width="300">
        <template slot-scope="scope">
          <span class="table-text" @click="editDetail(scope.row.id, 'show')">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="简称" prop="abbreviated" align="left" show-overflow-tooltip min-width="160"></el-table-column>
      <el-table-column label="级别" align="left" show-overflow-tooltip width="100">
        <template slot-scope="scope">
          <span>{{levelList[scope.row.level]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="businessNumber" align="left" label="业务编码" width="120"></el-table-column>
      <el-table-column label="类型" align="left" width="100">
        <template slot-scope="scope">{{CustomerType[scope.row.type]?CustomerType[scope.row.type].label:''}}</template>
      </el-table-column>
      <el-table-column label="负责人" prop="generalDirectorName" align="left" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.generalDirectorName || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目助理" prop="directorName" align="left" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.directorName || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册地区" align="left" width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.city | address}}</template>
      </el-table-column>
      <el-table-column label="状态" align="left" width="60">
        <template slot-scope="scope">
          <el-tag size="mini" :type="!scope.row.isDisable ? 'primary' : 'warning'" disable-transitions>{{!scope.row.isDisable ?'启用':'禁用'}}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="createTime" align="center" label="创建时间" width="150"></el-table-column> -->
      <el-table-column align="left" label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button type="text" icon="el-icon-view" style="color:#333" @click="editDetail(scope.row.id,1)">查看</el-button> -->
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
import ChooseArea from '@/components/ChooseArea/index.vue'
import { CustomerType, LevelType } from '@/utils/field.js'
import { deleteCustomer, getCustomerPage, customerIsDisable, getCustomerList } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'CustomerList',
  components: { ChooseArea },
  props: ['value'],
  data() {
    return {
      form: {
        pageNum: 1,          //页码
        pageSize: 10,          //每页条数
        search: '',          //搜索条件
        province: '',
        city: '',
        type: '',
        level: '',
        companyId: ''
      },
      list: [],
      total: 0,
      CustomerType: CustomerType,
      LevelType: LevelType,
      customerList: [],
      levelList: ['总公司', '分公司', '支公司', '中心支公司']
    }
  },
  created() {
    this.getList()
    this.getCustomerList()
  },
  methods: {
    toClick() {
      this.$router.go(-1)
    },
    getList() {
      getCustomerPage(this.form).then(res => {
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
      Confirm('确定删除该客户吗?', () => {
        deleteCustomer({ id }).then(res => {
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
      Confirm(`确定${!row.isDisable ? '禁用' : '启用'}该客户吗?`, () => {
        customerIsDisable({ id: row.id }).then(res => {
          if (res.code != 200) {
            this.$message.warning(res.msg || '操作失败')
            return
          }
          this.$message.success('操作成功')
          this.getList()
        })
      })
    },
    getCustomerList() {
      let param = {
        level: 1,
      }
      getCustomerList(param).then(res => {
        if (res.code != 200) return
        this.customerList = res.data
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
</style>