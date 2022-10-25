<template>
  <div>
    <el-button type="primary" @click="editDetail('', 'add')" size="small" v-if="!select">新增</el-button>
    <div class="search-box">
      <el-form inline size="small">
        <el-form-item label="模糊搜索">
          <el-input v-model="form.search" placeholder="客户名称、主体名称"></el-input>
        </el-form-item>
        <el-form-item label="回款状态">
          <el-select v-model="form.status" placeholder="请选择" style="width:150px">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,i) in status" :key="item" :label="item" :value="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户">
          <el-cascader :props="props" :show-all-levels="false" clearable filterable v-model="value2" :options="options" placeholder="请选择所属分公司/客户" @change="handleChange"></el-cascader>
          <!-- <ChooseCustomer v-model="form.customerId" @change="customerChange" style="width:200px" showAll></ChooseCustomer> -->
        </el-form-item>
        <el-form-item label="渠道" v-if="!select">
          <el-select v-model="form.channelId" placeholder="请选择" style="width:150px" clearable filterable>
            <!-- <el-option label="全部" value=""></el-option> -->
            <el-option v-for="(item,i) in customerChannelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开票金额">
          <el-input v-model="form.invoicingAmount" style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="审批状态">
          <el-select v-model="form.approvalStatus" placeholder="请选择" style="width:150px">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,i) in ApprovalStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主体" v-if="!select">
          <ChooseSubject v-model="form.subjectId" placeholder="请选择" style="width:200px" showAll></ChooseSubject>
        </el-form-item>

        <el-form-item label="开票时间">
          <el-date-picker v-model="form.submitTime" style="width:220px" @change="changeTime" value-format="yyyy-MM-dd" type="daterange" align="left" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe :data="list" show-summary :summary-method="getSummaries" ref="table" @sort-change="sortChange" @selection-change="handleSelectionChange" row-key="id" style="max-width: 100%;margin-top:15px;">
      <el-table-column type="index" align="center" label="序号" width="50" v-if="!select"></el-table-column>

      <el-table-column label="编号" align="left" width="190" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="table-text" @click="editDetail(scope.row.id, 'show')">{{scope.row.number || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户" align="left" show-overflow-tooltip width="180px">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.customerVo?scope.row.customerVo.name:''" placement="bottom">
            <span>{{scope.row.customerVo?scope.row.customerVo.abbreviated:''}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="渠道" align="left" show-overflow-tooltip width="100px">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.customerChannelVo?scope.row.customerChannelVo.name:''" placement="bottom">
            <span>{{scope.row.customerChannelVo?scope.row.customerChannelVo.name:''}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="主体" align="left" show-overflow-tooltip width="100px">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.subjectName?scope.row.subjectName:''" placement="bottom">
            <span>{{scope.row.subjectAbbreviated?scope.row.subjectAbbreviated:''}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="开票金额" prop="invoicingAmount" align="right" min-width="120px">
        <template slot-scope="scope">
          <span>{{scope.row.invoicingAmount || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="税率" prop="taxRate" align="center" width="80px"></el-table-column>
      <el-table-column label="已回款金额" prop="returnAmount" min-width="120px" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.returnAmount || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="待回款金额" min-width="120px" prop="surplusAmount" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.surplusAmount || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发票种类" align="left">
        <template slot-scope="scope">
          {{InvoiceType[scope.row.invoicingType]?InvoiceType[scope.row.invoicingType].label:''}}
        </template>
      </el-table-column>
      <el-table-column label="发票类型" align="left">
        <template slot-scope="scope">
          {{InvoiceTypeList[scope.row.type]?InvoiceTypeList[scope.row.type].label:''}}
        </template>
      </el-table-column>

      <el-table-column label="开票时间" prop="invoicingDate" align="left" sortable="custom" width="120"></el-table-column>
      <el-table-column label="开票人" prop="invoicingUserName" align="left"></el-table-column>
      <el-table-column label="状态" align="left" width="150">
        <template slot-scope="scope">
          <span :style="{color:ApprovalStatus[scope.row.approvalStatus]?ApprovalStatus[scope.row.approvalStatus].color:'#000'}">{{ApprovalStatus[scope.row.approvalStatus]?ApprovalStatus[scope.row.approvalStatus].label:''}}</span>
          <span v-if="scope.row.approvalStatus==1">({{scope.row.approvalName}})</span>
          <span v-else-if="scope.row.approvalStatus==3" style="color:red;">({{scope.row.returnName}})</span>
        </template>
      </el-table-column>
      <el-table-column label="提交人" prop="createByName" align="left"></el-table-column>
      <el-table-column prop="submitTime" align="left" label="提交时间" width="160"></el-table-column>
      <el-table-column align="left" label="操作" width="190" v-if="!select" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="editDetail(scope.row.id,'edit')" v-if="scope.row.approvalStatus==0 && scope.row.createBy==user.id">编辑</el-button>
          <el-button type="text" icon="el-icon-edit" @click="editDetail(scope.row.id,'copy')" v-if="[3,4].includes(scope.row.approvalStatus) && scope.row.createBy==user.id">重新提交</el-button>
          <el-button type="text" icon="el-icon-remove-outline" @click="submitOne(scope.row.id)" v-if="scope.row.approvalStatus==0 && scope.row.createBy==user.id">提交</el-button>
          <el-button type="text" icon="el-icon-remove-outline" @click="revokeOne(scope.row.id)" v-if="scope.row.approvalStatus==1 && scope.row.createBy==user.id">撤销</el-button>
          <el-button type="text" icon="el-icon-delete" style="color:red" @click="deleteOne(scope.row.id)" v-if="[0,3,4].includes(scope.row.approvalStatus) && scope.row.createBy==user.id">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100" v-else fixed="right">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.approvalStatus==1" :style="{color:idList.includes(scope.row.id)?'#11c142':''}" type="text" @click="checkRow(scope.row)">{{idList.includes(scope.row.id)?'取消':'选择'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display:flex;justify-content:center">
      <el-pagination layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total"></el-pagination>
      <el-button v-show="isShowExport && !select" style="margin-top:10px;margin-left:50px" size="mini" type="primary" v-debounce="exportClick" :loading="loading">导出</el-button>
    </div>
  </div>
</template>

<script>
import ChooseCustomer from '@/components/ChooseCustomer/index.vue'
import ChooseSubject from '@/components/ChooseSubject/index.vue'
import { newExportsExcel } from '@/utils/index.js'
import { deleteInvoiceApproval, getInvoiceApprovalPage, updateStatusInvoiceApproval, revokeInvoiceApproval, submitInvoiceApproval, getCustomerList } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
import { ApprovalStatus, InvoiceType, InvoiceTypeList } from '@/utils/field.js'
import { NumberAdd } from '@/utils/index.js'
export default {
  name: 'InvoiceList',
  components: { ChooseCustomer, ChooseSubject },
  props: {
    value: Number,
    select: {//是否可选择
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => { }
    },
    paramsSelectedListId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      idList: [],
      form: {
        pageNum: 1,          //页码
        pageSize: 10,          //每页条数
        search: '',          //搜索条件
        status: '',
        customerId: '',
        invoicingAmount: '',
        subjectId: '',
        invoicingEndDate: '',
        invoicingStartDate: '',
        isProvince: 0,
        approvalStatus: '',//审批状态
        channelId: '',
        companyId: '',
        isControl: 1,
      },
      list: [],
      total: 0,
      InvoiceTypeList: [
        { value: 0, label: "专票（纸质）" },
        { value: 1, label: "普票（纸质）" },
        { value: 2, label: "普票（电子）" },
        { value: 3, label: "专票（电子）" },
      ],
      InvoiceType: [
        { value: 0, label: "垫资回款" },
        { value: 1, label: "不垫资到账" },
      ],
      status: ['已全部回款', '回款中'],
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
      customerChannelList: [],
      value2: [],
      props: {
        lazy: true,
        checkStrictly: true,
        lazyLoad: this.lazyLoad
      },
      customerList: [],
      options: [],
      loading: false,
      invoicedata: {}
    }
  },
  created() {
    if (this.paramsSelectedListId) {
      this.idList = this.paramsSelectedListId.split(',').map(parseInt);
    }
    this.getList()
    this.user = JSON.parse(sessionStorage.getItem('user'));

  },
  methods: {
    exportClick() {

      // let param = this.form
      // delete param.pageSize
      let param = {
        search: this.form.search,          //搜索条件
        status: this.form.status,
        customerId: this.form.customerId,
        invoicingAmount: this.form.invoicingAmount,
        subjectId: this.form.subjectId,
        invoicingEndDate: this.form.invoicingEndDate,
        invoicingStartDate: this.form.invoicingStartDate,
        isProvince: 0,
        approvalStatus: this.form.approvalStatus,//审批状态
        channelId: this.form.channelId,
        companyId: this.form.companyId,
        isControl: 1,
      }
      this.loading = true
      var myDate = new Date();
      var Time1 = myDate.toLocaleDateString()//yyyy/MM/dd 这个方法如果是1月份，会显示yyyy/M/dd，默认把前面的0省略掉，有点坑，别的情况没尝试
      var Time2 = myDate.toISOString().slice(0, 10)//推荐 yyyy-MM-dd
      newExportsExcel('/cii-system/invoiceApproval/exportInvoiceApprovalListExcel', param).then(res => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        let url = URL.createObjectURL(blob);
        const link = document.createElement('a'); //创建a标签
        link.href = url;
        link.download = `开票列表-${Time2}`; //重命名文件
        link.click();
        URL.revokeObjectURL(url);
        this.loading = false
        // console.log("下载文件" + res);
      }).catch(err => {
        this.loading = false
      })
    },
    lazyLoad(node, resolve) {
      const { level } = node
      if (!node.data) {
        getCustomerList({ level: 1 }).then(res => {
          this.customerList = res.data
          const nodes = Array.from(res.data).map(item => {
            return {
              value: item.id,
              companyId: item.companyId,
              label: `${item.abbreviated}`,
              leaf: level >= 1
            }
          })
          nodes.unshift({ value: '', label: '全部', leaf: level >= 1 })
          resolve(nodes)
        })
      } else {
        getCustomerList({ level: '', companyId: node.data.companyId || node.data.value }).then(res => {
          this.customerList = res.data
          const nodes = Array.from(res.data).map(item => {
            return {
              value: item.id,
              companyId: item.companyId,
              label: `${item.abbreviated}`,
              leaf: level == 1
            }
          })
          resolve(nodes)
        })
      }
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 3) {
          sums[index] = '合计';
          return;
        }
        if (index === 5) {
          sums[index] = this.invoicedata.totalInvoiceAmount
        }
        if (index === 7) {
          sums[index] = this.invoicedata.totalReturnAmount
        }
        if (index === 8) {
          sums[index] = this.invoicedata.totalSurplusAmount
        }
        // if (index === 4) {
        //   sums[index] = Number(this.loanInfo.surplusRepaymentMoney)
        // }

      });
      return sums;
    },
    handleChange(val) {
      this.form.channelId = ''
      if (val.length == 1) {
        this.form.companyId = val[0]
        this.form.customerId = ''
      } else if (val.length == 2) {
        this.form.customerId = val[1]
        this.form.companyId = ''
        this.customerList.forEach(item => {
          if (item.id == this.form.customerId) {
            this.customerChannelList = item.customerChannelVoList
          }
        })
      } else {
        this.form.companyId = ''
        this.form.customerId = ''
      }
    },
    customerChange(item) {
      this.form.channelId = ''
      this.customerChannelList = item.customerChannelVoList
    },
    sortChange({ column, prop, order }) {
      // let str = prop == 'demandDate' ? 'isDemandDate' : prop == 'submitTime' ? 'isSubmitDate' : ''
      this.form.invoicingDateSort = order == 'ascending' ? 1 : 0
      this.getList()
    },
    changeTime() {
      if (this.form.submitTime) {
        this.form.invoicingStartDate = this.form.submitTime[0] || ''
        this.form.invoicingEndDate = this.form.submitTime[1] || ''
      } else {
        this.form.invoicingEndDate = ''
        this.form.invoicingStartDate = ''
      }
    },
    getList() {
      getInvoiceApprovalPage({ ...this.form, ...this.params }).then(res => {
        if (res.code != 200) return
        this.list = res.data.invoiceApprovalPage.records
        this.invoicedata = res.data
        this.total = res.data.invoiceApprovalPage.total
        //判断是否多选切回显
        if (this.multiline && this.idList && this.idList.length) {
          this.list.forEach(item => {
            if (this.idList.includes(item.id)) {
              this.$refs.table.toggleRowSelection(item);
            }
          })
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
    editDetail(id, type) {
      if (this.select) {
        return
      }
      this.$emit('input', 1)
      this.$emit('edit', id, type)
    },
    deleteOne(id) {
      Confirm('确定删除该发票审批吗?', () => {
        deleteInvoiceApproval({ id }).then(res => {
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
        submitInvoiceApproval({ id }).then(res => {
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
        revokeInvoiceApproval({ id }).then(res => {
          if (res.code != 200) {
            this.$message.warning(res.msg || '撤销失败')
            return
          }
          this.$message.success('撤销成功')
          this.getList()
        })
      })
    },
    setDisable(row) {
      Confirm(`确定${!row.status ? '撤销' : '恢复'}该发票吗?`, () => {
        updateStatusInvoiceApproval({ id: row.id }).then(res => {
          if (res.code != 200) {
            this.$message.warning(res.msg || '操作失败')
            return
          }
          this.$message.success('操作成功')
          this.getList()
        })
      })
    },
    handleSelectionChange(val) {
      this.$emit('select', val)
    },
    clearSelection() {
      this.$refs.table.clearSelection();
    },
    checkRow(row) {
      if (this.idList.includes(row.id)) {
        let _index = this.idList.indexOf(row.id);
        this.idList.splice(_index, 1);
      } else {
        this.idList.push(row.id)
      }
      this.$emit('select', row)
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
::v-deep .el-table__footer-wrapper .el-table__footer tbody tr {
  font-weight: 700;
  background-color: #f4f8ff !important;
}
::v-deep .el-table__footer-wrapper tbody td.el-table__cell {
  background-color: #f4f8ff !important;
}
</style>