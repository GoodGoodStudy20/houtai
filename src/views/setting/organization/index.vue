<template>
  <div style="width:100%">
    <el-button type="primary" size="small" icon="el-icon-plus" @click="editDetail({},'add')">新增部门</el-button>
    <div class="search-box">
      <el-form size="small" inline>
        <el-form-item label="名称">
          <el-input style="width:180px;" placeholder="请输入名称搜索" v-model="search"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe :data="list" style="margin-top:15px;">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="organizationName" label="名称" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="editDetail(scope.row,'show')">{{scope.row.organizationName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="isDisable" align="center" label="类型">
        <template slot-scope="scope">
          <el-tag size="mini" :type="!scope.row.organizationType ? 'primary' : 'warning'" disable-transitions>{{!scope.row.organizationType ?'机构':'部门'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" v-if="scope.row.id!=1" @click="editDetail(scope.row,'edit')">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" style="color:red" v-if="scope.row.id!=1" @click="deleteOne(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top:10px;" layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="pageSize" :current-page="pageNum" :total="total">
    </el-pagination>
    <!-- </el-col> -->
    <OrganizationForm v-if="isAddDialog" v-model="isAddDialog" :editRow="editRow" :editType="editType" @success="getList"></OrganizationForm>
  </div>
</template>
<script>
import { getOrganizationList, getOrganizationTree, delOrganizationById } from '@/api/index';
import OrganizationForm from './components/OrganizationForm.vue'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'organization',
  components: {
    OrganizationForm,
  },
  data() {
    return {
      // tree
      dataTree: [],
      defaultProps: {
        children: 'children',
        label: 'organizationName'
      },

      //add Dialog
      isAddDialog: false,
      isDisable: '',           //状态
      editRow: '',
      editType: '',            // 
      //set Approval People Dialog
      search: '', //搜索
      organizationArea: '',
      moreSelectValue: '',

      orgId: '',
      list: [
      ],
      total: 0,//分页总页数
      pageNum: 1,//分页页数
      pageSize: 10,//每页显示多少
    }
  },
  created() {
    this.onload();
  },
  methods: {
    onload() {
      // this.getTreeList();
      this.handleCurrentChange(1);
    },
    getList() {
      let param = {
        isPage: 1,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orgId: 1,
        search: this.search
      };
      getOrganizationList(param).then((response) => {
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
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getList();
    },
    handleNodeClick(data) {
      this.orgId = data.id
      this.handleSizeChange(1);
    },
    getTreeList() {
      getOrganizationTree({ orgId: this.orgId }).then((response) => {
        if (response.code == 200) {
          this.dataTree = [response.data];
        } else {
          this.$message.error({
            message: response.msg || response.error_msg,
            duration: 1500
          });
        }

      })
    },
    deleteOne(id) {
      Confirm('确定删除该部门吗?', () => {
        delOrganizationById({ id }).then(res => {
          if (res.code != 200) {
            this.$message.warning(res.msg || '删除失败')
            return
          }
          this.$message.success('删除成功')
          this.onload()
        })
      })
    },
    // type == 1 查看详情 type == 2 编辑
    editDetail(row, type) {
      this.editType = type;
      this.editRow = row;
      this.isAddDialog = true;
    }
  },
}
</script>
