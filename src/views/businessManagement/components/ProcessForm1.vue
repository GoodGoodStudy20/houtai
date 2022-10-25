<template>
  <div class="box">
    <el-steps direction="vertical" :active="active" :space="100" finish-status="success" :process-status="form2.approvalStatus==3?'error':'process'">
      <el-step v-for="(item,i) in list" :key="i">
        <template #title>
          <div style="display:flex">
            <div style="width:150px">
              {{item.name}}
            </div>
            <div style="margin-left:50px;font-size:14px" v-if="item.evaluateTime && item.isApproval != null">{{item.evaluateTime || item.updateTime || item.readTime}}</div>
            <el-button @click="editOne(item,'CC')" size="mini" type="primary" icon="el-icon-plus" circle v-if="[list.length].includes(i) && !disabled" style="margin-left:50px"></el-button>
          </div>
        </template>
        <template #description>
          <div style="color: #626468;font-size:14px">{{(item.approvalName&& item.approvalName!='null')?item.approvalName : ''}}</div>
          <el-collapse accordion v-if="item.returnContent">
            <el-collapse-item>
              <template slot="title">
                退回原因
              </template>
              <div v-html="item.returnContent" class="evaluate-content2"></div>
            </el-collapse-item>
          </el-collapse>
          <div class="evaluate-content" v-if="item.evaluateContent" v-html="item.evaluateContent"></div>
        </template>
      </el-step>
    </el-steps>
    <ProcessEdit v-if="showForm" v-model="showForm" :item="form" :editType="editType" @success="changeCopy"></ProcessEdit>
  </div>
</template>

<script>
import ProcessEdit from './ProcessEdit.vue'
import { getApprovalProcessConfigList, deleteApprovalProcessConfig, getApprovalProcessConfigInfo } from '@/api/index.js'
export default {
  name: 'ProcessForm',
  components: { ProcessEdit },
  props: ['type', 'disabled'],
  data() {
    return {
      list: [],
      list2: [],
      form: {},
      showForm: false,
      editType: '',
      active: -1,
      businessType: '',
      isIntegral: '',
      isOilCoupon: '',
      businessTypeChange: false,
      form2: {},
      // oilCouponChange: false,
      list3: [],//流程日志
    }
  },
  created() {
    this.$bus.$on('businessTypeChange', res => {
      this.businessTypeChange = true
      this.businessType = res

      // if (res == 1) {
      this.list = JSON.parse(JSON.stringify(this.list2))
      // } else {
      //   this.list = JSON.parse(JSON.stringify(this.list2)).filter(item => item.isUpdate != 2)
      // }
      // if (this.isIntegral == 0) {
      //   this.list = JSON.parse(JSON.stringify(this.list2)).filter(item => item.isUpdate == 0)
      // }
    })
    this.$bus.$on('isIntegralChange', res => {
      this.businessTypeChange = true
      this.isIntegral = res
      // if (res == 0) {//积分业务过滤掉确认下发及财务付款流程
      //   this.list = JSON.parse(JSON.stringify(this.list2)).filter(item => item.isUpdate == 0)
      // } else {
      this.list = JSON.parse(JSON.stringify(this.list2))
      // }
    })
    this.$bus.$on('oilCouponChange', res => {
      this.businessTypeChange = true
      this.isOilCoupon = res
      if (res == 0) {//积分业务过滤掉确认下发及财务付款流程
        this.list = JSON.parse(JSON.stringify(this.list2)).filter(item => item.isOilCoupon == 0)
      } else {
        this.list = JSON.parse(JSON.stringify(this.list2))
      }
    })
  },
  methods: {
    diretorChange(result = {}) {
      let list4 = this.list.filter(item => {
        return item.operationType == 0
      })
      this.list.forEach(item => {
        if (item.approvalId == list4[list4.length - 1].approvalId) {
          item.approvalName = result.name
        }
      })
    },
    //增加指定开票人节点
    invoiceUserChange(result = {}) {
      if (result.invoiceUserName) {
        this.list.forEach(item => {
          if (item.isUpdate == 1) {
            item.approvalName = result.invoiceUserName
            item.name = '开票节点'
          }
        })
      }
    },
    onload2(list = []) {
      list.forEach(item => {
        item.curStatus = 1
        if (item.returnContent) {
          this.list3 = list
        }
      })
      this.list3.reverse()


    },
    onload(result = {}) {
      this.form2 = result
      let list = result.approvalProcessVoList || []
      if (list.length) {
        this.list = list
        this.list.unshift({
          name: '提交审批',
          isApproval: result.submitTime ? 1 : 0,
          evaluateTime: result.submitTime,
          approvalName: result.createByName
        })
        // let length = this.list.filter((item, index) => item.isApproval == 1 || (item.operationType == 1 && ((this.list[index - 1].operationType != 1 && this.list[index - 1].isApproval == 1) && index != this.list.length - 1))).length
        let length = 0
        this.list.forEach((item, index) => {
          if (item.isApproval == 1) {
            length++
          }
          if (item.operationType == 1) {
            for (let _index = index - 1; _index >= 0; _index--) {
              if (this.list[_index].operationType == 1) {
                continue;
              }
              if (this.list[_index].isApproval == 1) {
                length++
                break;
              } else {
                break;
              }
            }
          }
        })
        this.active = length ? length == this.list.length ? length + 1 : length : 0

        return
      }

      getApprovalProcessConfigList({ type: this.type }).then(res => {
        this.list = res.data || []
        this.list.splice(0, 1)
        this.list.splice(this.list.length - 1, 1)
        this.list2 = JSON.parse(JSON.stringify(this.list))

        if (this.businessTypeChange) {//判断是否修改过业务模式
          // if (this.businessType == 1) {//业务模式等于不垫资的时候
          this.list = JSON.parse(JSON.stringify(this.list2))
          // }
          // else {//业务模式等于垫资的时候过滤掉确认下发流程
          //   this.list = JSON.parse(JSON.stringify(this.list2)).filter(item => item.isUpdate != 2)
          // }
          if (this.isIntegral == 0) {//积分业务过滤掉确认下发及财务付款流程
            this.list = JSON.parse(JSON.stringify(this.list2)).filter(item => item.isUpdate == 0)
          }
          if (this.isOilCoupon == 0) {//油券业务过滤掉油券业务流程
            this.list = JSON.parse(JSON.stringify(this.list2)).filter(item => item.isOilCoupon == 0)
          }
        }
      })
    },

    editOne(item, type) {
      this.editType = type
      this.form = Object.assign({}, item)
      this.showForm = true
    },
    changeCopy(item) {
      this.list[this.list.length - 1] = item
    },

    copyList() {

      let list = []
      let item = this.list[this.list.length - 1]
      if (item.approvalId) {
        let idList = item.approvalId.split(',')
        list = idList.map((item2, i) => {
          return {
            approvalId: item2,          //审批人
            operationType: 1,
            id: item.id,          //是否抄送（0.否 1.是）
            isRead: 0,          //是否已读（0.否 1.是）
            isSkip: 0,          //是否跳过(0.否,1.是)
            isUpdate: 0,          //是否可编辑
            name: item.name,          //名称
            sort: item.sort - 1,          //顺序
            type: this.type,          //类型(0.需求审批,1.付款审批)
          }
        })
      } else {
        list = [
          {
            approvalId: '',          //审批人
            operationType: 1,
            id: item.id,         //是否抄送（0.否 1.是）
            isRead: 0,          //是否已读（0.否 1.是）
            isSkip: 0,          //是否跳过(0.否,1.是)
            isUpdate: 0,          //是否可编辑
            name: item.name,          //名称
            sort: item.sort - 1,          //顺序
            type: this.type,          //类型(0.需求审批,1.付款审批)
          }
        ]
      }
      return list
    },
    commit() {
      let list = []
      for (let i in this.list) {
        if (i != this.list.length - 1 && this.list[i].name !== '提交审批') {
          list.push({
            approvalId: this.list[i].approvalId,          //审批人
            // isCopy: 0,          //是否抄送（0.否 1.是）
            isRead: 0,
            id: this.list[i].id,//审批流程id
            operationType: this.list[i].operationType,          //（0.审批 1.抄送，2.办理）
            isSkip: this.list[i].isSkip,          //是否跳过(0.否,1.是)
            isUpdate: this.list[i].isUpdate,          //是否编辑(0.否,1.是编辑2.是确认下发)
            name: this.list[i].name,          //名称
            sort: this.list[i].sort,          //顺序
            type: this.type,          //类型(0.需求审批,1.付款审批)
          })
        }
      }
      if (!list.length) return
      let copyList = this.copyList()
      list = [...list, ...copyList]
      return list
    }
  }
}
</script>

<style scoped lang='scss'>
.step {
  display: flex;
  align-items: center;
  .step-box {
    width: 200px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border: 1px solid #ccc;
    margin-right: 50px;
  }
}
.evaluate-content {
  font-size: 14px;
  background-color: #f2f6fb;
  color: #303132;
  margin: 20px 0;
  padding: 10px;
  border-radius: 4px;
}
.evaluate-content2 {
  font-size: 14px;
  background-color: #f2f6fb;
  color: #303132;
  padding: 10px;
  border-radius: 4px;
}
::v-deep .el-step__description.is-success {
  padding-right: 0px !important;
}
.line {
  width: 2px;
  height: 50px;
  margin-left: 100px;
  background: #000;
}
.form-box {
  text-align: center;
  width: 400px;
  border: 1px solid #ccc;
  padding: 30px;
}
::v-deep .el-collapse-item__arrow {
  margin: 0;
  margin-left: 5px;
}
::v-deep .el-collapse-item__header {
  background: #fff !important;
  border: none;
  color: #fa4a3e;
  padding: 0;
}
::v-deep .el-collapse-item__content {
  padding: 0 !important;
}
::v-deep .el-collapse {
  border: none;
}
::v-deep .el-collapse-item__wrap {
  border: none;
}
</style>