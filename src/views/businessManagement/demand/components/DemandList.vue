<template>
  <div>
    <div class="top" v-if="!select">
      <div class="top-title">
        <div class="title-item table-text" @click="toClick"><img src="@/assets/img/left.png" alt=""><span>返回</span></div>
      </div>
      <el-button type="primary" @click="editDetail('', 'add')" size="small" v-if="!select">新增</el-button>
    </div>

    <div class="search-box">
      <el-form inline size="small">
        <el-form-item label="模糊搜索">
          <el-input v-model="form.search" style="width:230px" placeholder="客户名称、提交人名称、需求编号"></el-input>
        </el-form-item>
        <el-form-item label="业务模式" v-if="!select">
          <el-select v-model="form.businessType" placeholder="请选择" style="width:120px">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in BusinessType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否权益" v-if="!select">
          <el-select v-model="form.isIntegral" placeholder="请选择" style="width:120px">
            <el-option label="全部" value=""></el-option>
            <el-option label="是" :value="0"></el-option>
            <el-option label="否" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="下发状态" v-if="!select">
          <el-select v-model="form.issueStatus" placeholder="请选择" style="width:120px">
            <el-option label="全部" value=""></el-option>
            <el-option label="未下发" :value="0"></el-option>
            <el-option label="已下发" :value="1"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="审批状态" v-if="!select">
          <el-select v-model="form.approvalStatus" placeholder="请选择" style="width:120px">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in ApprovalStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需求时间">
          <!-- <el-date-picker v-model="form.submitStartTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:200px"></el-date-picker> 至1
          <el-date-picker v-model="form.submitEndTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:200px"></el-date-picker> -->
          <el-date-picker v-model="form.submitTime" style="width:220px" @change="changeTime" value-format="yyyy-MM-dd" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="select" class="select-moeny" style="text-align:right">已选金额：当前应收：￥{{nowReceivableMoney}};剩余未开票:￥{{surplusNotInvoiced}}</div>
    <el-table stripe :data="list" @sort-change="sortChange" @selection-change="handleSelectionChange" style="max-width: 100%;margin-top:15px;">
      <el-table-column type="selection" width="55" fixed="left" v-if="select"></el-table-column>
      <el-table-column label="业务编号" align="left" min-width="190" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="table-text" @click="editDetail(scope.row.id, 'show')">{{scope.row.number}}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户" align="left" show-overflow-tooltip min-width="180px">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.customerVo?scope.row.customerVo.name:''" placement="bottom">
            <span>
              {{scope.row.customerVo?scope.row.customerVo.abbreviated:''}}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="渠道" align="left" show-overflow-tooltip min-width="80px">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.customerChannelVo?scope.row.customerChannelVo.name:''" placement="bottom">
            <span>
              {{scope.row.customerChannelVo?scope.row.customerChannelVo.name:''}}
            </span>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- <el-table-column label="主体" align="center" show-overflow-tooltip width="150">
        <template slot-scope="scope">
          {{scope.row.subjectVo?scope.row.subjectVo.name:''}}
        </template>
      </el-table-column> -->
      <el-table-column label="业务模式" align="left" width="80" v-if="!select">
        <template slot-scope="scope">
          {{BusinessType[scope.row.businessType]?BusinessType[scope.row.businessType].label:''}}
        </template>
      </el-table-column>
      <el-table-column label="权益" align="left" width="60" v-if="!select">
        <template slot-scope="scope">
          {{scope.row.isIntegral==0?'是':scope.row.isIntegral==1?'否':''}}
        </template>
      </el-table-column>
      <el-table-column label="委托经营所得（元）" prop="income" align="right" width="150px">
        <template slot-scope="scope">
          {{scope.row.income || 0 | toThousands}}
        </template>
      </el-table-column>
      <el-table-column label="预计回款时间" prop="estimateArrivalDate" align="left" width="120" v-if="select"></el-table-column>
      <el-table-column label="当前应收" prop="nowReceivableMoney" align="right" v-if="select" width="150px">
        <template slot-scope="scope">
          {{scope.row.nowReceivableMoney}}
        </template>
      </el-table-column>
      <el-table-column label="已回款" prop="alreadyReturnMoney" align="right" v-if="select" width="150px">
        <template slot-scope="scope">
          {{scope.row.alreadyReturnMoney || 0 | toThousands}}
        </template>
      </el-table-column>
      <el-table-column label="已开票" prop="alreadyInvoiceMoney" align="right" v-if="select" width="150px">
        <template slot-scope="scope">
          {{scope.row.alreadyInvoiceMoney || 0 | toThousands}}
        </template>
      </el-table-column>
      <el-table-column label="剩余未开票" prop="surplusNotInvoiced" align="right" v-if="select" width="150px">
        <template slot-scope="scope">
          {{scope.row.surplusNotInvoiced || 0 | toThousands}}
        </template>
      </el-table-column>
      <el-table-column label="业务条件" align="left" width="120px" class-name="business" v-if="!select">
        <template slot-scope="scope">
          {{scope.row.businessType == 0 ? `${scope.row.serviceCharge} (${scope.row.interestFreeDays})+${scope.row.ratio}` : scope.row.serviceCharge}}
        </template>
      </el-table-column>
      <el-table-column label="需求时间" prop="demandDate" align="left" width="120" sortable="custom"></el-table-column>
      <el-table-column label="提交人" prop="createByName" align="left" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" align="left" width="150" v-if="!select">
        <template slot-scope="scope">
          <span :style="{color:ApprovalStatus[scope.row.approvalStatus]?ApprovalStatus[scope.row.approvalStatus].color:'#000'}">{{ApprovalStatus[scope.row.approvalStatus]?ApprovalStatus[scope.row.approvalStatus].label:''}}</span>
          <span v-if="scope.row.approvalStatus==1">({{scope.row.approvalName}})</span>
          <span v-else-if="scope.row.approvalStatus==3" style="color:red;">({{scope.row.returnName}})</span>
        </template>
      </el-table-column>

      <el-table-column prop="submitTime" align="left" label="提交时间" width="160" show-overflow-tooltip sortable="custom"></el-table-column>
      <el-table-column align="left" label="操作" fixed="right" width="200" v-if="!select">
        <template slot-scope="scope">
          <!-- <el-button type="text" icon="el-icon-view" style="color:#333" @click="editDetail(scope.row.id,1)">查看</el-button> -->
          <el-button type="text" icon="el-icon-edit" @click="editDetail(scope.row.id,'edit')" v-if="scope.row.approvalStatus==0 && scope.row.createBy==user.id">编辑</el-button>
          <el-button type="text" icon="el-icon-edit" @click="editDetail(scope.row.id,'copy')" v-if="[3,4].includes(scope.row.approvalStatus) && scope.row.createBy==user.id">重新提交</el-button>
          <el-button type="text" icon="el-icon-remove-outline" @click="submitOne(scope.row.id)" v-if="scope.row.approvalStatus==0 && scope.row.createBy==user.id">提交</el-button>
          <el-button type="text" icon="el-icon-remove-outline" @click="revokeOne(scope.row.id)" v-if="scope.row.approvalStatus==1 && scope.row.createBy==user.id">撤销</el-button>
          <el-button type="text" icon="el-icon-delete" style="color:red" @click="deleteOne(scope.row.id)" v-if="[0,3,4].includes(scope.row.approvalStatus) && scope.row.createBy==user.id">删除</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column align=" center" label="操作" width="100" v-else fixed="right">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.approvalStatus==1" :style="{color:idList.includes(scope.row.id)?'#11c142':''}" type="text" @click="checkRow(scope.row)">{{idList.includes(scope.row.id)?'取消':'选择'}}</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <div style="display:flex;justify-content:center">
      <el-pagination layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total"></el-pagination>
      <el-button v-show="isShowExport && !select" style="margin-top:10px;margin-left:50px" size="mini" type="primary" v-debounce="exportClick" :loading="loading">导出</el-button>
    </div>
  </div>
</template>

<script>
import { BusinessType, ApprovalStatus } from '@/utils/field.js'
import { newExportsExcel, NumberAdd } from '@/utils/index.js'
import { getDemandApprovalPage, deleteDemandApproval, revokeApproval, submitApproval } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'DemandList',
  props: {
    value: Number,
    select: {//是否可选择
      type: Boolean,
      default: false
    },
    fromDemand: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      idList: [],
      form: {
        pageNum: 1,          //页码
        pageSize: 10,          //每页条数
        search: '',          //搜索条件
        approvalStatus: '',  //审批状态
        businessType: '',  //业务类型(0.垫资,1.不垫资)
        isIntegral: '',  //是否积分(0.是,1.否)
        issueStatus: '',//下发状态(0.未下发,1.已下发)
        demandStartTime: '',
        demandEndTime: '',
        isSubmitDate: '',//付款是否排序(0.倒序,1.升序) 
        isDemandDate: '',//需求是否排序(0.倒序,1.升序)
        isControl: 1,
      },
      list: [],
      total: 0,
      BusinessType: BusinessType,
      ApprovalStatus: ApprovalStatus,
      user: {},
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
      isClick: false,
      loading: false,
      multipleSelection: [],
      nowReceivableMoney: '',
      surplusNotInvoiced: ''
    }
  },
  created() {

    if (this.paramsSelectedListId) {
      this.idList = this.paramsSelectedListId.split(',').map(item => Number(item));
    }
    this.getList()
    this.user = JSON.parse(sessionStorage.getItem('user'))
  },
  methods: {
    toClick() {
      this.$router.go(-1)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.nowReceivableMoney = this.$options.filters.toThousands(NumberAdd(this.multipleSelection.map(item => item.nowReceivableMoney || 0)))
      this.surplusNotInvoiced = this.$options.filters.toThousands(NumberAdd(this.multipleSelection.map(item => item.surplusNotInvoiced || 0)))
      this.$emit('change', this.multipleSelection)
      // this.$emit('select', val)
    },
    checkRow(row) {
      if (this.idList.includes(row.id)) {
        let _index = this.idList.indexOf(row.id);
        this.idList.splice(_index, 1);
      } else {
        this.idList.push(row.id)
      }
      this.$emit('select', row)
    },
    exportClick() {
      let param = {
        search: this.form.search,          //搜索条件
        approvalStatus: this.form.approvalStatus,  //审批状态
        businessType: this.form.businessType,  //业务类型(0.垫资,1.不垫资)
        isIntegral: this.form.isIntegral,  //是否积分(0.是,1.否)
        issueStatus: this.form.issueStatus,//下发状态(0.未下发,1.已下发)
        // submitStartTime: this.form.submitStartTime,
        // submitEndTime: this.form.submitEndTime,
        demandStartTime: this.form.demandStartTime,
        demandEndTime: this.form.demandEndTime,
        isSubmitDate: 0,//付款是否排序(0.倒序,1.升序) 
        isDemandDate: this.form.isDemandDate,//需求是否排序(0.倒序,1.升序)
        isControl: 1,
      }
      // let param = this.form
      // delete param.pageSize
      this.loading = true
      var myDate = new Date();
      var Time1 = myDate.toLocaleDateString()//yyyy/MM/dd 这个方法如果是1月份，会显示yyyy/M/dd，默认把前面的0省略掉，有点坑，别的情况没尝试
      var Time2 = myDate.toISOString().slice(0, 10)//推荐 yyyy-MM-dd
      newExportsExcel('/cii-system/demandApproval/exportDemandApprovalListExcel', param).then(res => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        let url = URL.createObjectURL(blob);
        const link = document.createElement('a'); //创建a标签
        link.href = url;
        link.download = `业务申请列表-${Time2}`; //重命名文件
        link.click();
        URL.revokeObjectURL(url);
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    changeTime() {
      if (this.form.submitTime) {
        this.form.demandStartTime = this.form.submitTime[0] || ''
        this.form.demandEndTime = this.form.submitTime[1] || ''
      } else {
        this.form.demandStartTime = ''
        this.form.demandEndTime = ''
      }
    },
    getList(type) {
      let obj = {}
      if (this.fromDemand == 1) {
        obj = { ...this.form, ...this.$attrs.params }
      } else {
        obj = { ...this.form }
      }
      getDemandApprovalPage(obj).then(res => {
        if (res.code != 200) return
        this.list = res.data.records
        this.total = res.data.total
        this.list.forEach(item => {
          this.$set(item, 'nowReceivableMoney', NumberAdd([item.interestMoney, item.surplusMoney]))
        })
        if (type == 'invoice') {
          this.$emit('changeDemand', this.list)
        }
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
    sortChange({ column, prop, order }) {
      let str = prop == 'demandDate' ? 'isDemandDate' : prop == 'submitTime' ? 'isSubmitDate' : ''
      this.form[str] = order == 'ascending' ? 1 : 0
      if (str == 'isDemandDate') {
        this.form.isSubmitDate = '';
      } else {
        this.form.isDemandDate = '';
      }
      this.getList()
    },
    editDetail(id, type) {
      this.$emit('input', 1)
      this.$emit('edit', id, type)
    },
    deleteOne(id) {
      Confirm('确定删除该审批吗?', () => {
        deleteDemandApproval({ id }).then(res => {
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
        submitApproval({ id }).then(res => {
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
        revokeApproval({ id }).then(res => {
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
::v-deep .business {
  padding-left: 20px !important;
}
.select-moeny {
  text-align: right;
  margin-right: 20px;
  font-weight: 600;
}
</style>