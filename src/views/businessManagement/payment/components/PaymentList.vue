<template>
  <div>
    <el-button type="primary" @click="editDetail('', 'add')" size="small">新增</el-button>
    <div class="search-box">
      <el-form inline size="small">
        <el-form-item label="模糊搜索">
          <el-input v-model="form.search" style="width:230px" placeholder="客户名称、提交人名称、付款编号"></el-input>
        </el-form-item>
        <el-form-item label="业务模式">
          <el-select v-model="form.businessType" placeholder="请选择" style="width:120px">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in BusinessType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否积分">
          <el-select v-model="form.isIntegral" placeholder="请选择" style="width:120px">
            <el-option label="全部" value=""></el-option>
            <el-option label="是" :value="0"></el-option>
            <el-option label="否" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审批状态">
          <el-select v-model="form.approvalStatus" placeholder="请选择" style="width:120px">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in ApprovalStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="付款时间">
          <el-date-picker v-model="form.paymentStartTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:200px"></el-date-picker> 至
          <el-date-picker v-model="form.paymentEndTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:200px"></el-date-picker>
        </el-form-item> -->
        <el-form-item label="付款时间">
          <el-date-picker v-model="form.submitTime" style="width:220px" @change="changeTime" value-format="yyyy-MM-dd" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table stripe :data="list" style="max-width: 100%;margin-top:15px;">
      <el-table-column label="编号" prop="number" align="left" width="190" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="table-text" @click="editDetail(scope.row.id, 'show')">
            {{scope.row.number}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="客户" align="left" show-overflow-tooltip width="250">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.isIntegral==1?(scope.row.demandApprovalVo?scope.row.demandApprovalVo.customerVo.name:scope.row.customerVo.name):scope.row.customerVo.name" placement="bottom">
            <span>
              <!-- {{scope.row.isIntegral==1?(scope.row.demandApprovalVo?scope.row.demandApprovalVo.customerVo.abbreviated:scope.row.customerVo.abbreviated):scope.row.customerVo.abbreviated}}-{{scope.row.isIntegral==1?scope.row.customerChannelVo?scope.row.customerChannelVo.name:'-':'-'}} -->
              {{scope.row.isIntegral==1?(scope.row.demandApprovalVo?scope.row.demandApprovalVo.customerVo.abbreviated:scope.row.customerVo.abbreviated):scope.row.customerVo.abbreviated}}-{{scope.row.customerChannelVo?scope.row.customerChannelVo.name:'-'}}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column label="业务模式" align="left">
        <template slot-scope="scope">
          {{BusinessType[scope.row.businessType]?BusinessType[scope.row.businessType].label:'-'}}
        </template>
      </el-table-column>
      <el-table-column label="积分" align="left">
        <template slot-scope="scope">
          {{scope.row.isIntegral==0?'是':scope.row.isIntegral==1?'否':'-'}}
        </template>
      </el-table-column>
      <el-table-column label="支付委托经营所得金额（元）" prop="directAmount" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.directAmount || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付服务商金额（元）" prop="rechargeAmount" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.rechargeAmount || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务条件" prop="businessCondition" align="left"></el-table-column>
      <el-table-column label="付款时间" prop="paymentDate" align="left" width="120"></el-table-column>
      <el-table-column label="提交人" prop="createByName" align="left"></el-table-column>
      <el-table-column label="状态" align="left">
        <template slot-scope="scope">
          <span :style="{color:ApprovalStatus[scope.row.approvalStatus]?ApprovalStatus[scope.row.approvalStatus].color:'#000'}">{{ApprovalStatus[scope.row.approvalStatus]?ApprovalStatus[scope.row.approvalStatus].label:''}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批人" align="left">
        <template slot-scope="scope">
          <span v-if="scope.row.approvalStatus==1">{{scope.row.approvalName}}</span>
          <span v-else-if="scope.row.approvalStatus==3" style="color:red;">{{scope.row.returnName}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" prop="submitTime" align="left" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column align="left" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button type="text" icon="el-icon-view" style="color:#333" @click="editDetail(scope.row.id,1)">查看{{user.id}}</el-button> -->
          <el-button type="text" icon="el-icon-edit" @click="editDetail(scope.row.id,'refund')" v-if="scope.row.approvalStatus==2 && scope.row.createBy==user.id">退款</el-button>
          <el-button type="text" icon="el-icon-edit" @click="editDetail(scope.row.id,'edit')" v-if="scope.row.approvalStatus==0 && scope.row.createBy==user.id">编辑</el-button>
          <el-button type="text" icon="el-icon-edit" @click="editDetail(scope.row.id,'copy')" v-if="[3,4].includes(scope.row.approvalStatus) && scope.row.createBy==user.id">重新提交</el-button>
          <el-button type="text" icon="el-icon-remove-outline" @click="submitOne(scope.row.id)" v-if="scope.row.approvalStatus==0 && scope.row.createBy==user.id">提交</el-button>
          <el-button type="text" icon="el-icon-remove-outline" @click="revokeOne(scope.row.id)" v-if="scope.row.approvalStatus==1 && scope.row.createBy==user.id">撤销</el-button>
          <el-button type="text" icon="el-icon-delete" style="color:red" @click="deleteOne(scope.row.id)" v-if="[0,4].includes(scope.row.approvalStatus) && scope.row.createBy==user.id">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display:flex;justify-content:center">
      <el-pagination layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total"></el-pagination>
      <el-button v-show="isShowExport" style="margin-top:10px;margin-left:50px" size="mini" type="primary" v-debounce="exportClick" :loading="loading">导出</el-button>
    </div>
  </div>
</template>

<script>
import { BusinessType, ApprovalStatus } from '@/utils/field.js'
import { Confirm } from '@/utils/common.js'
import { newExportsExcel } from '@/utils/index.js'
import { getPaymentApprovalPage, deletePaymentApproval, revokePaymentApproval, submitPaymentApproval } from '@/api/index.js'
export default {
  name: 'PaymentList',
  props: ['value'],
  data() {
    return {
      form: {
        pageNum: 1,          //页码
        pageSize: 10,          //每页条数
        search: '',          //搜索条件
        approvalStatus: '',  //审批状态
        businessType: '',  //业务类型(0.垫资,1.不垫资)
        isIntegral: '',  //是否积分(0.是,1.否)
        paymentStartTime: '',
        paymentEndTime: '',
        submitTime: '',
        isControl: 1,
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
      },
      list: [],
      total: 0,
      BusinessType: BusinessType,
      ApprovalStatus: ApprovalStatus,
      user: {},
      loading: false
    }
  },
  created() {
    this.getList()
    this.user = JSON.parse(sessionStorage.getItem('user'))
  },
  methods: {
    exportClick() {
      // let param = this.form
      // delete param.pageSize
      let param = {
        search: this.form.search,          //搜索条件
        approvalStatus: this.form.approvalStatus,  //审批状态
        businessType: this.form.businessType,  //业务类型(0.垫资,1.不垫资)
        isIntegral: this.form.isIntegral,  //是否积分(0.是,1.否)
        paymentStartTime: this.form.paymentStartTime,
        paymentEndTime: this.form.paymentEndTime,
        submitTime: this.form.submitTime,
        isControl: 1,
      }
      this.loading = true
      var myDate = new Date();
      var Time1 = myDate.toLocaleDateString()//yyyy/MM/dd 这个方法如果是1月份，会显示yyyy/M/dd，默认把前面的0省略掉，有点坑，别的情况没尝试
      var Time2 = myDate.toISOString().slice(0, 10)//推荐 yyyy-MM-dd
      newExportsExcel('/cii-system/paymentApproval/exportPaymentApprovalListExcel', param).then(res => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        let url = URL.createObjectURL(blob);
        const link = document.createElement('a'); //创建a标签
        link.href = url;
        link.download = `付款列表-${Time2}`; //重命名文件
        link.click();
        URL.revokeObjectURL(url);
        this.loading = false
        // console.log("下载文件" + res);
      }).catch(err => {
        this.loading = false
      })
    },
    changeTime() {
      if (this.form.submitTime) {
        this.form.paymentStartTime = this.form.submitTime[0] || ''
        this.form.paymentEndTime = this.form.submitTime[1] || ''
      } else {
        this.form.paymentStartTime = ''
        this.form.paymentEndTime = ''
      }
    },
    getList() {
      getPaymentApprovalPage(this.form).then(res => {
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
      Confirm('确定删除该审批吗?', () => {
        deletePaymentApproval({ id }).then(res => {
          if (res.code != 200) {
            this.$message.warning(res.msg || '删除失败')
            return
          }
          this.$message.success('删除成功')
          this.getList()
        })
      })
    },
    submitOne(id) {
      Confirm('确定提交该审批吗?', () => {
        submitPaymentApproval({ id }).then(res => {
          if (res.code != 200) {
            this.$message.warning(res.msg || '提交失败')
            return
          }
          this.$message.success('提交成功')
          this.getList()
        })
      })
    },
    revokeOne(id) {
      Confirm('确定撤销该审批吗?', () => {
        revokePaymentApproval({ id }).then(res => {
          if (res.code != 200) {
            this.$message.warning(res.msg || '撤销失败')
            return
          }
          this.$message.success('撤销成功')
          this.getList()
        })
      })
    }
  },
  computed: {
    isShowExport() {
      // 是否具有导出权限
      let user = JSON.parse(sessionStorage.getItem('user'))
      if (user && user.exportPermission == 1) {
        return true
      } else {
        return false
      }
    }
  },
}
</script>

<style>
</style>