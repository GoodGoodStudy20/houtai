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
          <el-input v-model="form.search" style="width:260px" placeholder="主体名称、简称、法人名称、注册地址"></el-input>
        </el-form-item>
        <el-form-item label="税务类型">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in SubjectType" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
    <el-table stripe :data="list" style="max-width: 100%;margin-top:15px;" :header-cell-style="{'background-color':'#F4F8FF'}">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column label="名称" align="left" width="300" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="table-text" @click="editDetail(scope.row.id, 'show')">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="简称" prop="abbreviated" align="left" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="成立时间" prop="establishDate" align="left" width="100"></el-table-column>
      <el-table-column label="税务类型" align="left" width="100">
        <template slot-scope="scope">{{SubjectType[scope.row.type].label}}</template>
      </el-table-column>
      <el-table-column label="注册资本（万）" prop="registeredCapital" align="center" width="100"></el-table-column>
      <el-table-column label="注册地区" align="left" width="150" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.city | address}}</template>
      </el-table-column>
      <el-table-column label="法人" prop="legalPersonName" align="left" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="地址" prop="registeredAddress" align="left" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" align="left" width="60">
        <template slot-scope="scope">
          <el-tag size="mini" :type="!scope.row.isDisable ? 'primary' : 'warning'" disable-transitions>{{!scope.row.isDisable ?'启用':'禁用'}}</el-tag>
        </template>
      </el-table-column>
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
import { SubjectType } from '@/utils/field.js'
import ChooseArea from '@/components/ChooseArea/index.vue'
import { getSubjectPage, deleteSubject, subjectIsDisable } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'SubjectList',
  props: ['value'],
  data() {
    return {
      form: {
        pageNum: 1,          //页码
        pageSize: 10,          //每页条数
        search: '',          //搜索条件
        province: '',
        city: '',
      },
      list: [],
      total: 0,
      SubjectType: SubjectType
    }
  },
  created() {
    this.getList()
  },
  components: { ChooseArea },
  methods: {
    toClick() {
      this.$router.go(-1)
    },
    getList() {
      getSubjectPage(this.form).then(res => {
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
      Confirm('确定删除该主体吗?', () => {
        deleteSubject({ id }).then(res => {
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
      Confirm(`确定${!row.isDisable ? '禁用' : '启用'}该主体吗?`, () => {
        subjectIsDisable({ id: row.id }).then(res => {
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
</style>