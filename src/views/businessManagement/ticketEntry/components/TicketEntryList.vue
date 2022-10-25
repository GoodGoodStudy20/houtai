<template>
  <div>
    <el-button type="primary" @click="editDetail('', 'add')" size="small" v-if="!select">新增</el-button>
    <div class="search-box">
      <el-form inline size="small">
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择" style="width:150px">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,i) in status" :key="item" :label="item" :value="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主体">
          <ChooseSubject v-model="form.subjectId" placeholder="请选择" style="width:200px" showAll></ChooseSubject>
        </el-form-item>
        <el-form-item label="服务商">
          <ChooseServiceProvider v-model="form.serviceId" style="width:200px" showAll></ChooseServiceProvider>
        </el-form-item>
        <el-form-item label="进票时间">
          <!-- <el-date-picker v-model="form.enterInvoicingStartDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:150px"></el-date-picker> 至
          <el-date-picker v-model="form.enterInvoicingEndDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:150px"></el-date-picker> -->
          <el-date-picker v-model="form.submitTime" style="width:220px" @change="changeTime" value-format="yyyy-MM-dd" type="daterange" align="left" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe :data="list" ref="table" @selection-change="handleSelectionChange" row-key="id" style="max-width: 100%;margin-top:15px;">
      <el-table-column type="selection" width="55" v-if="multiline" :reserve-selection="true"></el-table-column>
      <el-table-column type="index" align="center" label="序号" width="50" v-else></el-table-column>
      <el-table-column label="购买方" align="left" show-overflow-tooltip width="150px">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.subjectVo?scope.row.subjectVo.name:''" placement="bottom">
            <span class="table-text" @click="editDetail(scope.row.id, 'show')">{{scope.row.subjectVo?scope.row.subjectVo.abbreviated:''}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="销售方" align="left" show-overflow-tooltip width="150px">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.serviceProviderVo?scope.row.serviceProviderVo.name:''" placement="bottom" v-if="scope.row.businessType==0">
            <span>{{scope.row.serviceProviderVo?scope.row.serviceProviderVo.abbreviated:''}}</span>
          </el-tooltip>
          <el-tooltip effect="dark" :content="scope.row.backersVo?scope.row.backersVo.name:''" placement="bottom" v-else>
            <span>{{scope.row.backersVo?scope.row.backersVo.abbreviated:''}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="业务类型" align="left">
        <template slot-scope="scope">
          {{businessTypeList[scope.row.businessType]}}
        </template>
      </el-table-column>
      <el-table-column label="进票金额" prop="withoutTaxAmount" align="left">
        <template slot-scope="scope">
          <span>{{scope.row.withoutTaxAmount || 0 | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="税率" prop="taxRate" align="left"></el-table-column>
      <el-table-column label="发票类型" align="left">
        <template slot-scope="scope">
          {{options1[scope.row.invoicingType]}}
        </template>
      </el-table-column>
      <!-- <el-table-column label="发票种类" align="center">
        <template slot-scope="scope">
          {{options1[scope.row.invoicingType]}}
        </template>
      </el-table-column> -->
      <el-table-column label="进票时间" prop="enterInvoicingDate" align="left" width="120"></el-table-column>
      <el-table-column label="状态" align="left">
        <template slot-scope="scope">
          {{status[scope.row.status]}}
        </template>
      </el-table-column>
      <el-table-column label="提交人" prop="createByName" align="left"></el-table-column>
      <el-table-column prop="createTime" align="left" label="提交时间" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column align="left" label="操作" width="200" v-if="!multiline" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" @click="editDetail(scope.row.id,'edit')">编辑</el-button>
          <el-button type="text" icon="el-icon-remove-outline" @click="setDisable(scope.row)">{{!scope.row.status ? '撤销' : '恢复'}}</el-button>
          <el-button type="text" icon="el-icon-delete" style="color:red" @click="deleteOne(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form.pageSize" :current-page="form.pageNum" :total="total"></el-pagination>

  </div>
</template>

<script>
import ChooseServiceProvider from '@/components/ChooseServiceProvider/index.vue'
import ChooseSubject from '@/components/ChooseSubject/index.vue'
import { deleteEnterInvoiceApproval, getEnterInvoiceApprovalPage, updateStatusEnterInvoiceApproval } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'TicketEntryList',
  components: { ChooseServiceProvider, ChooseSubject },
  props: {
    value: Number,
    select: {//是否可选择
      type: Boolean,
      default: false
    },
    multiline: {//是否多选
      type: Boolean,
      default: false
    },
    idList: {//多选已选择项
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        pageNum: 1,          //页码
        pageSize: 10,          //每页条数
        search: '',          //搜索条件
        status: '',
        serviceId: '',
        subjectId: '',
        enterInvoicingEndDate: '',
        enterInvoicingStartDate: '',
        submitTime: '',
        isControl: 1,
      },
      list: [],
      total: 0,
      businessTypeList: ['服务商发票', '资方发票'],
      options1: ['增值税专用发票', '增值税普通发票', '增值税普通发票(电子))'],
      options2: ['纸质', '电子'],
      status: ['正常', '撤销'],
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
    }
  },
  created() {
    this.getList()
    this.user = JSON.parse(sessionStorage.getItem('user'))
  },
  methods: {
    changeTime() {
      if (this.form.submitTime) {
        this.form.enterInvoicingStartDate = this.form.submitTime[0] || ''
        this.form.enterInvoicingEndDate = this.form.submitTime[1] || ''
      } else {
        this.form.enterInvoicingStartDate = ''
        this.form.enterInvoicingEndDate = ''
      }
    },
    getList() {
      getEnterInvoiceApprovalPage(this.form).then(res => {
        if (res.code != 200) return
        this.list = res.data.records
        this.total = res.data.total
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
      this.$emit('input', 1)
      this.$emit('edit', id, type)
    },
    deleteOne(id) {
      Confirm('确定删除吗?', () => {
        deleteEnterInvoiceApproval({ id }).then(res => {
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
      Confirm('确定提交吗?', () => {
        submitTicketEntryApproval({ id }).then(res => {
          if (res.code != 200) {
            this.$message.warning(res.msg || '提交失败')
            return
          }
          this.$message.success('提交成功')
          this.getList()
        })
      })
    },
    setDisable(row) {
      Confirm(`确定${!row.status ? '撤销' : '恢复'}吗?`, () => {
        updateStatusEnterInvoiceApproval({ id: row.id }).then(res => {
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
    }
  }
}
</script>

<style>
</style>