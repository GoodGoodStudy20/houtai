<template>
  <div>
    <el-button type="primary" @click="editDetail('', 'add')" size="small"
      >新增</el-button
    >
    <div class="search-box">
      <el-form inline size="small">
        <el-form-item label="模糊搜索">
          <el-input v-model="form.search" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <ChooseServiceProviderType
            v-model="form.typeId"
            :width="200"
          ></ChooseServiceProviderType>
        </el-form-item>
        <el-form-item label="所属地区">
          <ChooseArea
            :province.sync="form.province"
            :city.sync="form.city"
            style="width: 200px"
            checkStrictly
          ></ChooseArea>
        </el-form-item>
        <el-form-item label=" ">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleCurrentChange(1)"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-table
      stripe
      :data="list"
      style="
        max-width: 100%;
        margin-top: 15px;
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
      "
    >
      <el-table-column
        type="index"
        align="left"
        label="序号"
        width="50"
      ></el-table-column>
      <el-table-column
        label="名称"
        align="left"
        show-overflow-tooltip
        min-width="300"
      >
        <template slot-scope="scope">
          <span class="table-text" @click="editDetail(scope.row.id, 'show')">{{
            scope.row.name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="简称"
        prop="abbreviated"
        align="left"
        width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="类型"
        prop="serviceProviderTypeVo.name"
        align="left"
        width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="服务费率"
        prop="serviceCharge"
        align="left"
        width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="地区" align="left">
        <template slot-scope="scope">{{ scope.row.city | address }}</template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="left">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="!scope.row.isDisable ? 'primary' : 'warning'"
            disable-transitions
            >{{ !scope.row.isDisable ? "启用" : "禁用" }}</el-tag
          >
        </template>
      </el-table-column>
      <!-- <el-table-column prop="createName" align="center" label="创建人"></el-table-column> -->
      <!-- <el-table-column prop="createTime" align="center" label="创建时间" width="150"></el-table-column> -->
      <el-table-column align="left" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button type="text" icon="el-icon-view" style="color:#333" @click="editDetail(scope.row.id,1)">查看</el-button> -->
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="editDetail(scope.row.id, 'edit')"
            >编辑</el-button
          >
          <el-button
            type="text"
            icon="el-icon-remove-outline"
            @click="setDisable(scope.row)"
            >{{ !scope.row.isDisable ? "禁用" : "启用" }}</el-button
          >
          <el-button
            type="text"
            icon="el-icon-delete"
            style="color: red"
            @click="deleteOne(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="total, prev, pager, next,sizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :page-size="form.pageSize"
      :current-page="form.pageNum"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import ChooseArea from "@/components/ChooseArea/index.vue";
import ChooseServiceProviderType from "@/components/ChooseServiceProviderType/index.vue";
import {
  deleteServiceProvider,
  getServiceProviderPage,
  serviceProviderIsDisable,
} from "@/api/index.js";
import { Confirm } from "@/utils/common.js";
export default {
  name: "ServiceProviderList",
  components: { ChooseArea, ChooseServiceProviderType },
  props: ["value"],
  data() {
    return {
      form: {
        pageNum: 1, //页码
        pageSize: 10, //每页条数
        search: "", //搜索条件
        province: "",
        city: "",
        typeId: "",
      },
      list: [],
      total: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getServiceProviderPage(this.form).then((res) => {
        if (res.code != 200) return;
        this.list = res.data.records;
        this.total = res.data.total;
      });
    },
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.handleCurrentChange(1);
    },
    handleCurrentChange(val) {
      this.form.pageNum = val;
      this.getList();
    },
    editDetail(id, type) {
      this.$emit("input", 1);
      this.$emit("edit", id, type);
    },
    deleteOne(id) {
      Confirm("确定删除该服务商吗?", () => {
        deleteServiceProvider({ id }).then((res) => {
          if (res.code != 200) {
            this.$message.warning(res.msg || "删除失败");
            return;
          }
          this.$message.success("删除成功");
          this.getList();
        });
      });
    },
    setDisable(row) {
      Confirm(`确定${!row.isDisable ? "禁用" : "启用"}该服务商吗?`, () => {
        serviceProviderIsDisable({ id: row.id }).then((res) => {
          if (res.code != 200) {
            this.$message.warning(res.msg || "操作失败");
            return;
          }
          this.$message.success("操作成功");
          this.getList();
        });
      });
    },
  },
};
</script>

<style>
</style>