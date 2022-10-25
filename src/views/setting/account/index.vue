<template>
  <div>
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-plus"
      @click="editDetail({}, 'add')"
      >新增人员</el-button
    >
    <el-row>
      <div class="search-box">
        <el-form size="small" inline>
          <el-form-item label="名称">
            <el-input
              style="width: 180px"
              placeholder="请输入名称搜索"
              v-model="search"
            ></el-input>
          </el-form-item>
          <el-form-item label=" ">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handleCurrentChange(1)"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item label="">
            <el-checkbox v-model="disablePeoples" @change="disablePeoplesFun"
              >显示禁用人员</el-checkbox
            >
          </el-form-item>
        </el-form>
      </div>
      <!-- <el-col :span="24">
        <el-input style="width:180px;" size="mini" placeholder="请输入名称搜索" v-model="search"></el-input>
        <el-button type="primary" style="margin:0 20px" size="mini" icon="el-icon-search" @click="handleCurrentChange(1)">查询</el-button>
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="editDetail({},'add')">新增人员</el-button>
      </el-col> -->
      <el-col :span="4">
        <el-tree
          style="margin-top: 20px"
          :data="dataTree"
          :props="defaultProps"
          accordion
          @node-click="handleNodeClick"
          node-key="id"
          :default-expanded-keys="[orgId]"
        >
        </el-tree>
      </el-col>
      <el-col :span="20">
        <el-table
          stripe
          :data="list"
          style="margin-top: 15px; box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1)"
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="50"
          ></el-table-column>
          <el-table-column prop="sysName" label="姓名" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="editDetail(scope.row, 'show')">{{
                scope.row.name
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="organizationOrgName"
            align="center"
            label="所属部门"
          >
          </el-table-column>
          <el-table-column prop="phone" align="center" label="手机号/账号">
          </el-table-column>
          <el-table-column prop="roleName" align="center" label="角色">
          </el-table-column>
          <el-table-column
            prop="isDisable"
            align="center"
            label="状态"
            width="70"
          >
            <template slot-scope="scope">
              <el-tag
                size="mini"
                :type="!scope.row.isDisable ? 'primary' : 'warning'"
                disable-transitions
                >{{ !scope.row.isDisable ? "已启用" : "已禁用" }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="220"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="editDetail(scope.row, 'edit')"
                >编辑</el-button
              >
              <el-button
                type="text"
                style="color: red"
                icon="el-icon-warning"
                v-if="sysId != scope.row.id"
                @click="resetPwd(scope.row.id)"
                >重置密码</el-button
              >
              <el-button
                type="text"
                icon="el-icon-remove-outline"
                @click="setDisable(scope.row.id, 1, scope.$index)"
                v-if="scope.row.isDisable == 0"
                >禁用</el-button
              >
              <el-button
                type="text"
                icon="el-icon-remove-outline"
                @click="setDisable(scope.row.id, 0, scope.$index)"
                v-if="scope.row.isDisable == 1"
                >启用</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="margin-top: 10px"
          layout="total, prev, pager, next,sizes"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :page-size="pageSize"
          :current-page="pageNum"
          :total="total"
        >
        </el-pagination>
      </el-col>
    </el-row>
    <AccountForm
      v-if="isAddDialog"
      v-model="isAddDialog"
      :editRow="editRow"
      :editType="editType"
      @success="getList"
    ></AccountForm>
  </div>
</template>
<script>
import {
  getOrganizationTree,
  getUserPage,
  resetPwd,
  isDisable,
} from "@/api/index";
import AccountForm from "./components/AccountForm.vue";
export default {
  name: "account",
  components: {
    AccountForm,
  },
  data() {
    return {
      disablePeoples: false,
      // tree
      dataTree: [],
      defaultProps: {
        children: "children",
        label: "organizationName",
      },
      sysId: "",

      // Dialog
      isAddDialog: false,
      isDisable: "", //状态
      editRow: "",
      editType: "", // 编辑状态 1是详情，2是编辑,''是添加
      // search
      search: "", //搜索
      organizationArea: "",
      moreSelectValue: "",
      // list
      orgId: "",
      list: [],
      total: 0, //分页总页数
      pageNum: 1, //分页页数
      pageSize: 10, //每页显示多少
    };
  },
  created() {
    this.orgId = 1;
    this.sysId = JSON.parse(sessionStorage.getItem("user")).id;
    this.getList();
    this.getTreeList();
  },
  methods: {
    // 是否显示禁用人员
    disablePeoplesFun() {
      this.pageNum = 1;
      this.getList();
    },
    resetPwd(id) {
      this.$confirm("此操作将重置该用户密码, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        resetPwd({ id }).then((response) => {
          this.$message({
            message: response.msg || response.error_msg,
            type: response.code == 200 ? "success" : "default",
          });
        });
      });
    },
    getList() {
      let param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        search: this.search,
        organizationOrg: this.orgId,
        isDisable: Number(this.disablePeoples),
      };
      getUserPage(param).then((response) => {
        if (response.code == 200) {
          this.total = response.data.total;
          this.list = response.data.records;
        } else {
          this.$message.error({
            title: "错误",
            message: response.msg || response.error_msg,
            duration: 1500,
          });
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getList();
    },
    setDisable(id, type) {
      let param = {
        id: id,
        isDisable: type,
      };
      this.$confirm(
        Number(type) == 1 ? "是否禁用该用户?" : "是否启用该用户?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        isDisable(param).then((response) => {
          this.getList();
          this.$message({
            type: response.code == 200 ? "success" : "default",
            duration: 2000,
            message: response.msg || response.error_msg,
          });
        });
      });
    },
    handleNodeClick(data) {
      this.orgId = data.id;
      this.handleCurrentChange(1);
    },
    getTreeList() {
      getOrganizationTree({ orgId: this.orgId }).then((response) => {
        if (response.code == 200) {
          this.dataTree = [response.data];
        } else {
          this.$message.error({
            title: "错误",
            message: response.msg || response.error_msg,
            duration: 1500,
          });
        }
      });
    },
    // type == 1 查看详情 type == 2 编辑
    editDetail(row, type) {
      this.editType = type;
      this.editRow = row;
      this.isAddDialog = true;
    },
  },
};
</script>