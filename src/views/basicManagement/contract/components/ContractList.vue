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
          <el-input v-model="form.search" style="width:300px" placeholder="合同编号、主体名称、客户名称、服务商名称"></el-input>
        </el-form-item>
        <el-form-item label="主体名称">
          <ChooseSubject v-model="form.subjectId"></ChooseSubject>
        </el-form-item>
        <el-form-item label="客户名称">
          <ChooseCustomer v-model="form.customerId"></ChooseCustomer>
        </el-form-item>
        <el-form-item label="合同类型">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in ContractType" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否近期到期">
          <el-select v-model="form.isExpire" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批状态" v-if="!$attrs.disabled">
          <el-select v-model="form.approvalStatus" placeholder="请选择" style="width: 150px">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in ApprovalStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe :data="list" style="max-width: 100%;margin-top:15px;">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column label="合同编号" align="left" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="table-text" @click="editDetail(scope.row.id, 'show')">{{scope.row.number}}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="left" width="100">
        <template slot-scope="scope">
          {{ContractType[scope.row.type]?ContractType[scope.row.type].label:''}}
        </template>
      </el-table-column>
      <el-table-column label="甲方" align="left" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row | partyNameA" placement="bottom">
            <span> {{scope.row | partyA}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="乙方" align="left" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row | partyNameB" placement="bottom">
            <span> {{scope.row | partyB}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="丙方" align="left" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row | partyNameC" placement="bottom">
            <span> {{scope.row | partyC}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="合同开始" prop="contractStartDate" align="left" width="100"></el-table-column>
      <el-table-column label="合同结束" prop="contractEndDate" align="left" width="100"></el-table-column>
      <el-table-column label="签订时间" prop="signDate" align="left" width="100"></el-table-column>
      <el-table-column label="合同状态" align="left" width="80">
        <template slot-scope="scope">
          <span :style="{color:scope.row.surplusDay<=0?'red':''}">{{scope.row.surplusDay>0?scope.row.surplusDay+'天到期':'已到期'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交人" prop="createByName" align="left" width="80"></el-table-column>

      <!-- <el-table-column label="状态" align="left" width="80">
        <template slot-scope="scope">
          <el-tag size="mini" :type="!scope.row.isDisable ? 'primary' : 'warning'" disable-transitions>{{!scope.row.isDisable ?'启用':'停用'}}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="当前状态" align="left" width="120">
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
      <el-table-column label="提交时间" prop="createTime" align="left" min-width="150"></el-table-column>
      <!-- <el-table-column align="left" label="操作" width="180" v-if="!$attrs.disabled" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="editDetail(scope.row.id,'edit')">编辑</el-button>
          <el-button type="text" v-if="scope.row.isRenewal===0 && Number(scope.row.surplusDay)<=30 && Number(scope.row.surplusDay)>0" @click="setisRenewal(scope.row)">续签</el-button>
          <el-button type="text" icon="el-icon-delete" style="color:red" @click="deleteOne(scope.row.id)">删除</el-button>
        </template>
      </el-table-column> -->
      <el-table-column align="left" label="操作" width="200" fixed="right" v-if="!$attrs.disabled">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="editDetail(scope.row.id, 'edit')" v-if="
              scope.row.approvalStatus == 0 && scope.row.createBy == user.id
            ">编辑</el-button>
          <el-button type="text" @click="editDetail(scope.row.id, 'again')" v-if="
              scope.row.approvalStatus == 2 && scope.row.createBy == user.id
            ">补传文件</el-button>
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
    </el-table>
    <div style="display: flex; justify-content: center">
      <el-pagination layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total"></el-pagination>
      <el-button v-show="isShowExport && !$attrs.disabled" style="margin-top: 10px; margin-left: 50px" size="mini" type="primary" v-debounce="exportClick" :loading="loading">导出</el-button>
    </div>
  </div>
</template>

<script>
import { ContractType, ApprovalStatus } from '@/utils/field.js'
import { deleteContract, getContractPage, contractIsDisable, isRenewal, revokeContractApproval, submitContractApproval } from '@/api/index.js'
import ChooseSubject from '@/components/ChooseSubject/index.vue'
import ChooseCustomer from '@/components/ChooseCustomer/index.vue'
import { Confirm } from '@/utils/common.js'
import { newExportsExcel } from "@/utils/index.js";
export default {
  name: 'Contract',
  props: ['value'],
  data() {
    return {
      form: {
        pageNum: 1,          //页码
        pageSize: 10,          //每页条数
        search: '',          //搜索条件
        type: '',
        customerId: '',//客户ID,
        subjectId: '',//主体ID
        isExpire: '',
        approvalStatus: ''
      },
      list: [],
      total: 0,
      ContractType: ContractType,
      ApprovalStatus: ApprovalStatus,
      user: {},
      loading: false
    }
  },
  components: {
    ChooseSubject, ChooseCustomer
  },
  created() {
    this.user = JSON.parse(sessionStorage.getItem("user"));
  },
  mounted() {
    if (this.$route.query.isExpire == 1) {
      this.form.isExpire = 1
    }
    this.getList()

  },
  filters: {
    partyA(row = {}) {
      let str = ''
      if (row.type == 0) {
        str = row.customerVo ? row.customerVo.abbreviated : ''
      } else if (row.type == 1) {
        str = row.subjectVo ? row.subjectVo.abbreviated : ''
      } else if (row.type == 2) {
        if (row.partyAType == 0) {
          str = row.partyACustomerVo ? row.partyACustomerVo.abbreviated : ''
        } else if (row.partyAType == 1) {
          str = row.partyASubjectVo ? row.partyASubjectVo.abbreviated : ''
        } else if (row.partyAType == 2) {
          str = row.partyAServiceProviderVo ? row.partyAServiceProviderVo.abbreviated : ''
        }
      } else if (row.type == 3) {
        str = row.backersVo ? row.backersVo.abbreviated : ''
      }
      return str
    },
    partyB(row = {}) {
      let str = ''
      if (row.type == 0) {
        str = row.subjectVo ? row.subjectVo.abbreviated : ''
      } else if (row.type == 1) {
        str = row.serviceProviderVo ? row.serviceProviderVo.abbreviated : ''
      } else if (row.type == 2) {
        if (row.partyBType == 0) {
          str = row.partyBCustomerVo ? row.partyBCustomerVo.abbreviated : ''
        } else if (row.partyBType == 1) {
          str = row.partyBSubjectVo ? row.partyBSubjectVo.abbreviated : ''
        } else if (row.partyBType == 2) {
          str = row.partyBServiceProviderVo ? row.partyBServiceProviderVo.abbreviated : ''
        }
      } else if (row.type == 3) {
        str = row.subjectVo ? row.subjectVo.abbreviated : ''
      }
      return str
    },
    partyC(row = {}) {
      let str = ''
      if (row.type == 2) {
        if (row.partyCType == 0) {
          str = row.partyCCustomerVo ? row.partyCCustomerVo.abbreviated : ''
        } else if (row.partyCType == 1) {
          str = row.partyCSubjectVo ? row.partyCSubjectVo.abbreviated : ''
        } else if (row.partyCType == 2) {
          str = row.partyCServiceProviderVo ? row.partyCServiceProviderVo.abbreviated : ''
        }
      }
      return str
    },
    partyNameA(row = {}) {
      let str = ''
      if (row.type == 0) {
        str = row.customerVo ? row.customerVo.name : ''
      } else if (row.type == 1) {
        str = row.subjectVo ? row.subjectVo.name : ''
      } else if (row.type == 2) {
        if (row.partyAType == 0) {
          str = row.partyACustomerVo ? row.partyACustomerVo.name : ''
        } else if (row.partyAType == 1) {
          str = row.partyASubjectVo ? row.partyASubjectVo.name : ''
        } else if (row.partyAType == 2) {
          str = row.partyAServiceProviderVo ? row.partyAServiceProviderVo.name : ''
        }
      } else if (row.type == 3) {
        str = row.backersVo ? row.backersVo.name : ''
      }
      return str
    },
    partyNameB(row = {}) {
      let str = ''
      if (row.type == 0) {
        str = row.subjectVo ? row.subjectVo.name : ''
      } else if (row.type == 1) {
        str = row.serviceProviderVo ? row.serviceProviderVo.name : ''
      } else if (row.type == 2) {
        if (row.partyBType == 0) {
          str = row.partyBCustomerVo ? row.partyBCustomerVo.name : ''
        } else if (row.partyBType == 1) {
          str = row.partyBSubjectVo ? row.partyBSubjectVo.name : ''
        } else if (row.partyBType == 2) {
          str = row.partyBServiceProviderVo ? row.partyBServiceProviderVo.name : ''
        }
      } else if (row.type == 3) {
        str = row.subjectVo ? row.subjectVo.name : ''
      }
      return str
    },
    partyNameC(row = {}) {
      let str = ''
      if (row.type == 2) {
        if (row.partyCType == 0) {
          str = row.partyCCustomerVo ? row.partyCCustomerVo.name : ''
        } else if (row.partyCType == 1) {
          str = row.partyCSubjectVo ? row.partyCSubjectVo.name : ''
        } else if (row.partyCType == 2) {
          str = row.partyCServiceProviderVo ? row.partyCServiceProviderVo.name : ''
        }
      }
      return str
    }
  },
  methods: {
    exportClick() {
      let param = {
        search: this.form.search,
        customerId: this.form.customerId,
        subjectId: this.form.subjectId,
        type: this.form.type,
        isExpire: this.form.isExpire,
        approvalStatus: this.form.approvalStatus,
      };
      this.loading = true;
      var myDate = new Date();
      var Time1 = myDate.toLocaleDateString(); //yyyy/MM/dd 这个方法如果是1月份，会显示yyyy/M/dd，默认把前面的0省略掉，有点坑，别的情况没尝试
      var Time2 = myDate.toISOString().slice(0, 10); //推荐 yyyy-MM-dd
      newExportsExcel(
        "/cii-system/contractApproval/exportContractListExcel",
        param
      )
        .then((res) => {
          let blob = new Blob([res], { type: "application/vnd.ms-excel" });
          let url = URL.createObjectURL(blob);
          const link = document.createElement("a"); //创建a标签
          link.href = url;
          link.download = `合同列表-${Time2}`; //重命名文件
          link.click();
          URL.revokeObjectURL(url);
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    toClick() {
      this.$router.go(-1)
    },
    getList(param) {
      getContractPage({ ...this.form, ...param, ...this.$attrs }).then(res => {
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
    submitOne(id) {
      Confirm("确定提交该审批吗?", () => {
        submitContractApproval({ id }).then((res) => {
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
        revokeContractApproval({ id }).then((res) => {
          if (res.code != 200) {
            this.$message.warning(res.msg || "撤销失败");
            return;
          }
          this.$message.success("撤销成功");
          this.getList();
        });
      });
    },
    deleteOne(id) {
      Confirm('确定删除该合同吗?', () => {
        deleteContract({ id }).then(res => {
          if (res.code != 200) {
            this.$message.warning(res.msg || '删除失败')
            return
          }
          this.$message.success('删除成功')
          this.getList()
        })
      })
    },
    setisRenewal(row) {
      Confirm(`确定续签该合同吗?`, () => {
        isRenewal({ id: row.id }).then(res => {
          if (res.code != 200) {
            this.$message.warning(res.msg || '操作失败')
            return
          }
          this.$message.success('操作成功')
          if (this.$route.query.isExpire == 1) {
            this.getList({ isExpire: 1 })
          } else {
            this.getList()
          }
        })
      })
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