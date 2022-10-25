<template>
  <div>
    <div class="top">
      <div class="top-title">
        <div class="title-item table-text" @click="toClick"><img src="@/assets/img/left.png" alt=""><span>返回</span></div>
      </div>
      <el-button type="primary" @click="editDetail('', 'add')" size="small" v-if="!$attrs.disabled">新增</el-button>
    </div>
    <div class="search-box">
      <el-form inline size="small">
        <el-form-item label="模糊搜索">
          <el-input v-model="form.search" style="width: 320px" placeholder="付款方名称、提交人名称、回款编号、主体名称、回款金额"></el-input>
        </el-form-item>

        <el-form-item label="付款方">
          <ChooseCustomer v-model="form.payerId" style="width: 200px" showAll></ChooseCustomer>
        </el-form-item>
        <el-form-item label="客户">
          <el-cascader :props="props" :show-all-levels="false" clearable filterable v-model="value2" :options="options" placeholder="请选择所属分公司/客户" @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="主体">
          <ChooseSubject v-model="form.subjectId" placeholder="请选择" style="width: 200px" showAll></ChooseSubject>
        </el-form-item>
        <el-form-item label="业务类型">
          <el-select v-model="form.businessType" placeholder="请选择" style="width: 120px">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in BusinessType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格金额" v-if="$attrs.disabled">
          <el-input v-model="form.amount"></el-input>
        </el-form-item>
        <el-form-item label="状态" v-if="!$attrs.disabled">
          <el-select v-model="form.approvalStatus" placeholder="请选择" style="width: 150px">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in ApprovalStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="回款时间">
          <el-date-picker v-model="form.returnMoneyStartDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:150px"></el-date-picker> 至
          <el-date-picker v-model="form.returnMoneyEndDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:150px"></el-date-picker>
        </el-form-item> -->
        <el-form-item label="回款时间">
          <el-date-picker v-model="form.submitTime" style="width: 220px" @change="changeTime" value-format="yyyy-MM-dd" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe :data="list" :size="$attrs.disabled ? 'mini' : ''" style="
        max-width: 100%;
        margin-top: 15px;
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1);
      " :header-cell-style="{ 'background-color': '#F4F8FF' }">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column label="编号" align="left" width="210" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="table-text" @click="editDetail(scope.row.id, 'show')">{{
            scope.row.number || PLACEHOLDER_BAR
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="付款方" prop="payerVo.name" align="left" show-overflow-tooltip width="180px">
      </el-table-column>
      <el-table-column label="客户" align="left" show-overflow-tooltip width="180px">
        <template slot-scope="scope">
          <span>{{
              scope.row.customerVo ? scope.row.customerVo.abbreviated : ""
            }}--{{
              scope.row.customerChannelVo
                ? scope.row.customerChannelVo.name
                : ""
            }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主体" align="left" show-overflow-tooltip width="100px">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.subjectVo ? scope.row.subjectVo.name : ''" placement="bottom">
            <span>{{
              scope.row.subjectVo ? scope.row.subjectVo.abbreviated : ""
            }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="业务类型" prop="payerVo.businessType" align="left" show-overflow-tooltip width="100px" v-if="!$attrs.disabled">
        <template slot-scope="scope">
          <span>{{
            scope.row.businessType == 1
              ? "不垫资"
              : scope.row.businessType == 0
              ? "垫资"
              : "--"
          }}</span>
        </template>
      </el-table-column>

      <el-table-column label="回款金额" prop="amount" align="right" width="110px">
        <template slot-scope="scope">
          <span>{{ scope.row.amount || 0 | toThousands }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可用金额" prop="availableMoney" align="right" width="110px">
        <template slot-scope="scope">
          <span>{{ (scope.row.availableMoney || 0) | toThousands }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回款时间" prop="returnMoneyDate" align="left" width="120"></el-table-column>
      <el-table-column label="当前状态" align="left" width="150">
        <template slot-scope="scope">
          <span :style="{
              color: ApprovalStatus[scope.row.approvalStatus]
                ? ApprovalStatus[scope.row.approvalStatus].color
                : '#000',
            }">{{
              ApprovalStatus[scope.row.approvalStatus]
                ? ApprovalStatus[scope.row.approvalStatus].label
                : ""
            }}</span>
          <span v-if="scope.row.approvalStatus == 1">({{ scope.row.approvalName }})</span>
          <span v-else-if="scope.row.approvalStatus == 3" style="color: red">({{ scope.row.returnName }})</span>
        </template>
      </el-table-column>
      <el-table-column label="提交人" prop="createByName" align="left" width="100px"></el-table-column>
      <el-table-column prop="createTime" align="left" label="提交时间" width="160"></el-table-column>
      <el-table-column align="left" label="操作" width="200" fixed="right" v-if="!$attrs.disabled">
        <template slot-scope="scope">
          <!-- <el-button type="text" icon="el-icon-remove-outline" @click="setDisable(scope.row)">{{!scope.row.status ? '撤销' : '恢复'}}</el-button>
          <el-button type="text" icon="el-icon-delete" style="color:red" @click="deleteOne(scope.row.id)">删除</el-button> -->
          <el-button type="text" icon="el-icon-edit" @click="editDetail(scope.row.id, 'edit')" v-if="
              scope.row.approvalStatus == 0 && scope.row.createBy == user.id
            ">编辑</el-button>
          <el-button type="text" icon="el-icon-edit" @click="editDetail(scope.row.id, 'copy')" v-if="
              [3, 4].includes(scope.row.approvalStatus) &&
              scope.row.createBy == user.id
            ">重新提交</el-button>
          <el-button type="text" icon="el-icon-remove-outline" @click="submitOne(scope.row.id)" v-if="
              scope.row.approvalStatus == 0 && scope.row.createBy == user.id
            ">提交</el-button>
          <el-button type="text" icon="el-icon-remove-outline" @click="revokeOne(scope.row.id)" v-if="
              scope.row.approvalStatus == 1 && scope.row.createBy == user.id
            ">撤销</el-button>
          <el-button type="text" icon="el-icon-delete" style="color: red" @click="deleteOne(scope.row.id)" v-if="
              [0, 3, 4].includes(scope.row.approvalStatus) &&
              scope.row.createBy == user.id
            ">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100" fixed="right" v-else>
        <template slot-scope="scope">
          <!-- <el-button :disabled="scope.row.approvalStatus==1" type="text" @click="checkRow(scope.row)" v-show="!$attrs.collectionList.length||!$attrs.collectionList[0].subjectId||$attrs.collectionList[0].subjectId==scope.row.subjectId">{{$attrs.idList.includes(scope.row.id)?'取消':'选择'}}</el-button> -->
          <el-button :disabled="scope.row.approvalStatus == 1" type="text" :style="{
              color: $attrs.idList.includes(scope.row.id) ? '#11c142' : '',
            }" @click="checkRow(scope.row)">{{
              $attrs.idList.includes(scope.row.id) ? "取消" : "选择"
            }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px">
      <span>回款金额合计：</span><span class="total-amount">{{ totalReturnAmount | toThousands }}</span>
    </div>
    <div style="display: flex; justify-content: center">
      <el-pagination layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total"></el-pagination>
      <el-button v-show="isShowExport && !$attrs.disabled" style="margin-top: 10px; margin-left: 50px" size="mini" type="primary" v-debounce="exportClick" :loading="loading">导出</el-button>
    </div>
  </div>
</template>

<script>
import ChooseCustomer from "@/components/ChooseCustomer/index.vue";
import ChooseSubject from "@/components/ChooseSubject/index.vue";
import { ApprovalStatus, BusinessType } from "@/utils/field.js";
import {
  deleteReturnMoneyApproval,
  getReturnMoneyApprovalPage,
  submitReturnMoneyApproval,
  revokeReturnMoneyApproval,
  getCustomerList,
} from "@/api/index.js";
import { Confirm } from "@/utils/common.js";
import {
  NumberMul,
  NumberSub,
  NumberDiv,
  newExportsExcel,
} from "@/utils/index.js";
export default {
  name: "CollectionList",
  components: { ChooseCustomer, ChooseSubject },
  props: ["value", "fromDemand", "serviceCharge1", "serviceCharge2"],
  data() {
    return {
      form: {
        pageNum: 1, //页码
        pageSize: 10, //每页条数
        status: "",
        search: "",
        approvalStatus: "",
        payerId: "",
        customerId: "",
        subjectId: "",
        returnMoneyEndDate: "",
        returnMoneyStartDate: "",
        submitTime: "",
        amount: "",
        businessType: "",
        companyId: "",
        isControl: 1,
        // businessType: 1
      },
      list: [],
      total: 0,
      ApprovalStatus: ApprovalStatus,
      BusinessType: BusinessType,
      options1: ["增值税专用发票", "增值税普通发票"],
      options2: ["纸质", "电子"],
      status: ["正常", "撤销"],
      user: {},
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      props: {
        lazy: true,
        checkStrictly: true,
        lazyLoad: this.lazyLoad,
      },
      value2: [],
      options: [],
      customerList: [],
      loading: false,
      totalReturnAmount: "",
    };
  },
  created() {
    this.getList();
    this.user = JSON.parse(sessionStorage.getItem("user"));
  },
  methods: {
    NumberMul,
    NumberSub,
    NumberDiv,
    toClick() {
      this.$router.go(-1)
    },
    exportClick() {
      let param = {
        status: this.form.status,
        search: this.form.search,
        approvalStatus: this.form.approvalStatus,
        payerId: this.form.payerId,
        customerId: this.form.customerId,
        subjectId: this.form.subjectId,
        returnMoneyEndDate: this.form.returnMoneyEndDate,
        returnMoneyStartDate: this.form.returnMoneyStartDate,
        // submitTime: this.form.submitTime,
        amount: this.form.amount,
        businessType: this.form.businessType,
        companyId: this.form.companyId,
        isControl: 1,
      };
      this.loading = true;
      var myDate = new Date();
      var Time1 = myDate.toLocaleDateString(); //yyyy/MM/dd 这个方法如果是1月份，会显示yyyy/M/dd，默认把前面的0省略掉，有点坑，别的情况没尝试
      var Time2 = myDate.toISOString().slice(0, 10); //推荐 yyyy-MM-dd
      newExportsExcel(
        "/cii-system/returnMoneyApproval/exportReturnMoneyApprovalListExcel",
        param
      )
        .then((res) => {
          let blob = new Blob([res], { type: "application/vnd.ms-excel" });
          let url = URL.createObjectURL(blob);
          const link = document.createElement("a"); //创建a标签
          link.href = url;
          link.download = `回款列表-${Time2}`; //重命名文件
          link.click();
          URL.revokeObjectURL(url);
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    lazyLoad(node, resolve) {
      const { level } = node;
      if (!node.data) {
        getCustomerList({ level: 1 }).then((res) => {
          this.customerList = res.data;
          const nodes = Array.from(res.data).map((item) => {
            return {
              value: item.id,
              companyId: item.companyId,
              label: `${item.abbreviated}`,
              leaf: level >= 1,
            };
          });
          nodes.unshift({ value: "", label: "全部", leaf: level >= 1 });
          resolve(nodes);
        });
      } else {
        getCustomerList({ level: "", companyId: node.data.companyId || node.data.value }).then(
          (res) => {
            this.customerList = res.data;
            const nodes = Array.from(res.data).map((item) => {
              return {
                value: item.id,
                companyId: item.companyId,
                label: `${item.abbreviated}`,
                leaf: level == 1,
              };
            });
            resolve(nodes);
          }
        );
      }
    },
    handleChange(val) {
      if (val.length == 1) {
        this.form.companyId = val[0];
        this.form.customerId = "";
      } else if (val.length == 2) {
        this.form.customerId = val[1];
        this.form.companyId = "";
      } else {
        this.form.companyId = "";
        this.form.customerId = "";
      }
    },
    changeTime() {
      if (this.form.submitTime) {
        this.form.returnMoneyStartDate = this.form.submitTime[0] || "";
        this.form.returnMoneyEndDate = this.form.submitTime[1] || "";
      } else {
        this.form.returnMoneyEndDate = "";
        this.form.returnMoneyStartDate = "";
      }
    },
    getList() {
      let ApprovalPageObj = {};
      if (this.fromDemand == 1) {
        ApprovalPageObj = {
          ...this.form,
          ...this.$attrs.params,
          approvalStatus: "1,2",
        };
      } else {
        ApprovalPageObj = { ...this.form, ...this.$attrs.params };
      }
      getReturnMoneyApprovalPage(ApprovalPageObj).then((res) => {
        if (res.code != 200) return;
        this.list = res.data.returnMoneyApprovalVoIPage.records;
        this.totalReturnAmount = res.data.totalReturnAmount || 0;
        if (this.serviceCharge1 || this.serviceCharge1 === 0) {
          this.list.forEach((item) => {
            if (this.serviceCharge2 || this.serviceCharge2 === 0) {
              item.availableMoney =
                item.availableMoney || item.availableMoney == 0
                  ? item.availableMoney
                  : NumberMul(
                    NumberDiv(
                      item.amount,
                      NumberSub(1, NumberDiv(this.serviceCharge2, 100))
                    ),
                    NumberSub(1, NumberDiv(this.serviceCharge1, 100))
                  ).toFixed(2);
            } else {
              item.availableMoney =
                item.availableMoney || item.availableMoney == 0
                  ? item.availableMoney
                  : NumberMul(
                    item.amount,
                    NumberSub(1, NumberDiv(this.serviceCharge1, 100))
                  ).toFixed(2);
            }
          });
        }
        this.total = res.data.returnMoneyApprovalVoIPage.total;
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
      if (this.fromDemand == 1) {
        return;
      }
      this.$emit("input", 1);
      this.$emit("edit", id, type);
    },
    deleteOne(id) {
      Confirm("确定删除该回款吗?", () => {
        deleteReturnMoneyApproval({ id }).then((res) => {
          if (res.code != 200) {
            this.$message.warning(res.msg || "删除失败");
            return;
          }
          this.$message.success("删除成功");
          this.getList();
        });
      });
    },
    submitOne(id) {
      Confirm("确定提交该审批吗?", () => {
        submitReturnMoneyApproval({ id }).then((res) => {
          if (res.code != 200) {
            this.$message.warning(res.msg || "提交失败");
            return;
          }
          this.$message.success("提交成功");
          this.getList();
        });
      });
    },
    revokeOne(id) {
      Confirm("确定撤销该审批吗?", () => {
        revokeReturnMoneyApproval({ id }).then((res) => {
          if (res.code != 200) {
            this.$message.warning(res.msg || "撤销失败");
            return;
          }
          this.$message.success("撤销成功");
          this.getList();
        });
      });
    },
    checkRow(row) {
      let list = JSON.parse(JSON.stringify(this.$attrs.collectionList));
      if (this.$attrs.idList.includes(row.id)) {
        list.splice(
          list.findIndex((item) => item.id == row.id),
          1
        );
      } else {
        list.push(row);
      }
      this.$emit("select", list);
    },
  },
  computed: {
    isShowExport() {
      // 是否具有导出权限
      let user = JSON.parse(sessionStorage.getItem("user"));
      if (user && user.exportPermission == 1) {
        return true;
      } else {
        return false;
      }
    },
  },
};
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