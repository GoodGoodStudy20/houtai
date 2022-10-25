<template>
  <div>
    <el-button type="primary" @click="editDetail('', 'add')" size="small">新增</el-button>
    <div class="search-box">
      <el-form inline size="small">
        <el-form-item label="模糊搜索">
          <el-input v-model="form.search" style="width:260px" placeholder="主体名称、简称、法人名称、注册地址"></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleCurrentChange(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table stripe :data="list" style="max-width: 100%;margin-top:15px;" :header-cell-style="{'background-color':'#F4F8FF'}">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column label="名称" align="left" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="table-text" @click="editDetail(scope.row.id, 'show')">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="简称" prop="abbreviated" align="left" width="120" show-overflow-tooltip></el-table-column> -->
      <!-- <el-table-column label="成立时间" prop="establishDate" align="left" width="120"></el-table-column> -->
      <el-table-column label="纳税类型" align="center" width="120">
        <template v-slot="{row}">{{SubjectType[row.type].label}}</template>
      </el-table-column>
      <el-table-column label="所属省级" align="left" width="120" show-overflow-tooltip>
        <template v-slot="{row}">{{row.city | province}}</template>
      </el-table-column>
      <el-table-column label="属地" align="left" width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.city | municipal}}</template>
      </el-table-column>
      <!-- <el-table-column label="注册资本（万）" prop="registeredCapital" align="center" width="100"></el-table-column> -->
      <!-- <el-table-column label="注册地区" align="left" width="150" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.city | address}}</template>
      </el-table-column> -->
      <!-- <el-table-column label="法人" prop="legalPersonName" align="left" width="120" show-overflow-tooltip></el-table-column> -->
      <!-- <el-table-column label="地址" prop="registeredAddress" align="left" show-overflow-tooltip></el-table-column> -->
      <el-table-column label="经营范围" align="left" width="280">
        <template v-slot="{ row }" class="business-Scope">
          <el-button v-for="(item,index) in row.scopeListId" :key="index">{{item}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="开票额度（万元）" prop="invoiceRestrictionsVoList[0].totalAmount" align="left" width="200">
        <template v-slot="{ row }">
          <el-popover @show="showInvoicingRestrictions(row)" placement="top-start" width="150" trigger="hover">
            <div v-for="(item, index) in specialTicket" :key="index">
              {{ InvoiceTypeList[item.type] }}:{{ item.maxAmount }}
            </div>
            <span slot="reference">{{row.invoiceRestrictionsVoList[0].totalAmount}}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="注册年限" align="center" width="80">
        <template v-slot="{ row }">
          <span>{{row.establishDate | InYear}}</span>
        </template>
      </el-table-column>
      <el-table-column label="近期变更时间" align="center" width="200" v-if='false'>
        <template v-slot="{ row }">
          <span>{{row.updateTime?row.updateTime:'-'}}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="left" width="80">
        <template slot-scope="scope">
          <el-tag size="mini" :type="!scope.row.isDisable ? 'primary' : 'warning'" disable-transitions>{{!scope.row.isDisable ?'启用':'禁用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作" width="200" fixed="right">
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
import { getSubjectPage, deleteSubject, subjectIsDisable } from '@/api/index.js'
import { Confirm } from '@/utils/common.js'
import { areaList } from "@/utils/area.js";
import moment from 'moment'
export default {
  name: 'SubjectList',
  props: ['value'],
  data() {
    return {
      form: {
        pageNum: 1,          //页码
        pageSize: 10,          //每页条数
        search: '',          //搜索条件
      },
      list: [],
      total: 0,
      SubjectType: SubjectType,
      specialTicket: [],
      InvoiceTypeList: ['专票', '普票', '普票(电子)', '专票(电子)']
    }
  },
  filters: {
    InYear(val) {
      let res = new Date() - new Date(val)
      let year = Math.floor(res / (1000 * 60 * 60 * 24 * 365))
      return year
      // moment.locale('zh-cn'); 
      // return  moment(val, "YYYY").fromNow();
    },
    province(value) {
      if (!value) return "";
      let address = "";
      for (let item of areaList) {
        if (item.id == value) {
          address = item.content;
          return address;
        }
        if (item.children && item.children.length) {
          for (let item2 of item.children) {
            if (item2.id == value) {
              address =
                item.content
              //  + " " + item2.content;
              return address;
            }
            if (item2.children && item2.children.length) {
              for (let item3 of item2.children) {
                if (item3.id == value) {
                  address =
                    item.content
                  // + " " + item2.content + " " + item3.content;
                  return address;
                }
              }
            }
          }
        }
      }
    },
    municipal(value) {
      if (!value) return "";
      let address = "";
      for (let item of areaList) {
        if (item.id == value) {
          address = item.content;
          return address;
        }
        if (item.children && item.children.length) {
          for (let item2 of item.children) {
            if (item2.id == value) {
              address = item2.content ? item2.content : item.content;
              //  + " " + item2.content;
              return address;
            }
            if (item2.children && item2.children.length) {
              for (let item3 of item2.children) {
                if (item3.id == value) {
                  address = item3.content ? item3.content : item2.content ? item2.content : item.content;
                  // item.content 
                  // + " " + item2.content + " " + item3.content;
                  return address;
                }
              }
            }
          }
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    showInvoicingRestrictions(row) {
      this.specialTicket = row.invoiceRestrictionsVoList
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
::v-deep .cell {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>