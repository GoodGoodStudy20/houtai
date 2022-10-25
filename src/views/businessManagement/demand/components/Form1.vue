<template>
  <el-form size="small" ref="form" :inline="true" :model="form" label-width="140px" :disabled="disabled" style="margin:auto;width:1280px;">
    <el-form-item label="编号规则" v-if="editType=='add' || editType=='copy'">
      <el-radio-group style="width:480px" v-model="form.numberType" @change="NumberTypeChange">
        <el-radio :label="item.value" v-for="item in NumberTypeList">{{
          item.label
        }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="编号" v-if="form.numberType==1" prop="number" :rules="[{ required: true, message: '编号不可为空', trigger: 'blur' }]">
      <el-input v-model="form.number" placeholder="请输入编号" style="width:480px"></el-input>
    </el-form-item>
    <el-form-item label="编号" v-else>
      <el-input v-model="form.number" placeholder="自动生成" :disabled="true" style="width:480px"></el-input>
    </el-form-item>
    <el-form-item label="客户名称" prop="customerId" :rules="[{ required: true, message: '客户不可为空', trigger: 'blur' }]">
      <ChooseCustomer v-model="form.customerId" ref="customer" @change="customerChange" style="width:480px"></ChooseCustomer>
    </el-form-item>

    <el-form-item label="渠道" prop="channelId" :rules="[{ required: true, message: '渠道不可为空', trigger: 'change' }]">
      <el-select v-model="form.channelId" placeholder="请选择" style="width:480px">
        <el-option v-for="item in ChannelType" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="业务模式" prop="businessType" :rules="[{ required: true, message: '业务模式不可为空', trigger: 'blur' }]">
      <el-select v-model="form.businessType" placeholder="请选择" style="width:480px" @change="typeChange">
        <el-option v-for="item in BusinessType" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="中介模式" prop="isAgent" :rules="[{ required: true, message: '中介模式不可为空', trigger: 'change' }]">
      <el-select v-model="form.isAgent" @change="agentTypeChange" placeholder="请选择" style="width:480px">
        <el-option label="否" :value="0"></el-option>
        <el-option label="是" :value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="中介机构" v-if="form.isAgent==1" prop="agentId" :rules="[{ required: true, message: '中介机构不可为空', trigger: 'blur' }]">
      <ChooseCustomer v-model="form.agentId" ref="customer2" @change="customerChange2" :params="{type:1}" style="width:480px"></ChooseCustomer>
    </el-form-item>
    <el-form-item label="到账回单" v-if="form.businessType==1" prop="returnMoneyListId" :rules="[{ required: form.businessType=1, message: '到账回单不可为空', trigger: 'blur' }]">
      <div style="width:480px;float:left;" v-if="!disabled">
        <el-button type="primary" @click="demandClickEvent" :disabled="form.isAgent==1 && !form.agentId">选择</el-button>
      </div>
      <!-- <div :class="editType == 'show'?'one-collect':'more-collect'">
        <el-popover placement="right" width="350" trigger="hover" v-if="collectionList.length>1">
          <div style="height:300px;overflow-y:auto;width:350px;">
            <div style="line-height:30px;" title="点击查看" class="file" v-for="collectionInfo in collectionList" :key="collectionInfo.id" @click="openFile(collectionInfo)">{{collectionInfo.customerVo.abbreviated + collectionInfo.returnMoneyDate + '回款' + collectionInfo.amount+'元'}}</div>
          </div>
          <div slot="reference" class="showCollect">共有{{collectionList.length}}笔回单</div>
        </el-popover>
      </div>
      <div v-if="collectionList.length==1">
        <div style="width:480px" title="点击查看" class="file" v-for="collectionInfo in collectionList" :key="collectionInfo.id" @click="openFile(collectionInfo)">{{collectionInfo.customerVo.abbreviated + collectionInfo.returnMoneyDate + '回款' + collectionInfo.amount+'元'}}</div>
      </div> -->

    </el-form-item>
    <el-form-item label="到账金额" v-if="form.businessType==1" prop="arrivalMoney" :rules="[{ required: true, message: '到账金额不可为空', trigger: 'blur' }]">
      <el-input v-model="form.arrivalMoney" placeholder="请输入到账金额" style="width:480px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')">
        <template slot="append">元</template>
      </el-input>
    </el-form-item>
    <el-form-item label="到账可用金额" v-if="form.businessType==1" prop="arrivalAvailableMoney" :rules="[{ required: true, message: '到账可用金额不可为空', trigger: 'blur' }]">
      <el-input v-model="form.arrivalAvailableMoney" placeholder="请输入到账可用金额" style="width:480px" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')">
        <template slot="append">元</template>
      </el-input>
    </el-form-item>

    <el-form-item label="资方" prop="backersListId" v-if="form.businessType==0" :rules="[{ required: true, message: '资方不可为空', trigger: 'blur,change' }]">
      <ChooseCapital v-model="form.backersListId" :multiple="true" style="width:480px"></ChooseCapital>
    </el-form-item>
    <!-- <el-form-item label="中介模式" prop="isAgent" :rules="[{ required: true, message: '中介模式不可为空', trigger: 'change' }]">
      <el-select v-model="form.isAgent" @change="agentTypeChange" placeholder="请选择" style="width:500px">
        <el-option label="否" :value="0"></el-option>
        <el-option label="是" :value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="中介机构" v-if="form.isAgent==1" prop="agentId" :rules="[{ required: true, message: '中介机构不可为空', trigger: 'blur' }]">
      <ChooseCustomer v-model="form.agentId" ref="customer2" @change="customerChange2" :params="{type:1}" style="width:500px"></ChooseCustomer>
    </el-form-item> -->
    <!-- <el-form-item label="产品" prop="productListId" :rules="[{ required: true, message: '产品不可为空', trigger: 'blur'}]">
      <ChooseProduct v-model="form.productListId" multiple style="width:500px"></ChooseProduct>
    </el-form-item> -->
    <el-form-item label="权益形式" prop="isIntegral" :rules="[{ required: true, message: '积分形式不可为空', trigger: 'change' }]">
      <el-select v-model="form.isIntegral" placeholder="请选择" style="width:480px" @change="isIntegralChange">
        <el-option label="是" :value="0"></el-option>
        <el-option label="否" :value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="油券业务" prop="isOilCoupon" :rules="[{ required: true, message: '油券业务不可为空', trigger: 'change' }]">
      <el-select v-model="form.isOilCoupon" placeholder="请选择" style="width:480px" @change="oilCouponChange">
        <el-option label="否" :value="0"></el-option>
        <el-option label="是" :value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="需求日期" prop="demandDate" :rules="[{ required: true, message: '需求日期不可为空', trigger: 'blur' }]">
      <el-date-picker v-model="form.demandDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:480px"></el-date-picker>
    </el-form-item>
    <el-form-item label="本次委托经营所得" prop="income" :rules="[{ required: true, message: '本次委托经营所得不可为空', trigger: 'blur' }]">
      <el-input v-model="form.income" placeholder="上传支付清单自动计算" style="width:480px" :disabled="true" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')">
        <template slot="append">元</template>
      </el-input>
    </el-form-item>
    <el-form-item label="垫付金额" v-if="form.businessType==1" prop="advancesMoney" :rules="[{ required: true, message: '垫付金额不可为空', trigger: 'blur' }]">
      <el-input v-model="form.advancesMoney" placeholder="请输入垫付金额" style="width:480px" oninput="value=value.replace(/[^\d.]/g,'')">
        <template slot="append">元</template>
      </el-input>
    </el-form-item>
    <el-form-item label="预计回款日期" v-if="form.businessType===0" prop="estimateArrivalDate" :rules="[{ required: true, message: '预计回款日期不可为空', trigger: 'blur' }]">
      <el-date-picker v-model="form.estimateArrivalDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" style="width:480px"></el-date-picker>
    </el-form-item>
    <div>
      <el-form-item label="备注">
        <el-input v-model="form.remark" placeholder="请输入备注" type="textarea" style="width:480px" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
      </el-form-item>
    </div>
    <div>
      <el-form-item label="应收" v-if="form.businessType!=1"><span style="color:red">{{disabled?form.receivableMoney:money1}}</span>
      </el-form-item>
      <el-form-item label="应付"><span style="color:red">{{disabled?form.copeWithMoney:money2}}</span>
      </el-form-item>
    </div>
    <el-dialog :visible.sync="checkCollection" title="选择回款记录" width="1180px" :close-on-click-modal="false">
      <collection :fromDemand='fromDemand' v-if="checkCollection" :disabled="true" :collectionList="collectionList" :serviceCharge1="serviceCharge1" :serviceCharge2="serviceCharge2" :idList="form.returnMoneyListId" :params="{customerId:(form.isAgent==1 && form.agentId)?form.agentId:form.customerId,approvalStatus:2,isControl: 1,isProvince:0,businessType:form.businessType}" @select="collectionSelect"></collection>
      <el-button type="primary" @click="checkCollection=false" style="margin-top:20px">确定</el-button>
    </el-dialog>
    <el-image-viewer v-if="dialogVisible" :on-close="onClose" :url-list="[dialogImageUrl]" />
  </el-form>

</template>

<script>
import { baseURL } from "@/api/http";
import ChooseCustomer from '@/components/ChooseCustomer/index.vue'
import ChooseCapital from '@/components/ChooseCapital/index.vue'
import ChooseProduct from '@/components/ChooseProduct/index.vue'
import collection from '@/views/businessManagement/collection/index.vue'
import { BusinessType } from '@/utils/field.js'
import { isEffective } from '@/api/index.js'
import { Assign, NumberMul, NumberAdd, NumberSub, NumberDiv } from '@/utils/index.js'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
let channelId = ''
export default {
  name: 'Form1',
  components: { ChooseCustomer, ChooseCapital, ChooseProduct, collection, ElImageViewer },
  props: {
    editType: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        numberType: 1,
        number: '',                //编号
        customerId: '',                //客户id
        channelId: '',                //渠道类型(0.综拓,1.创展,2.线客,3.车商,4.其他)
        productListId: '',                //产品
        businessType: '',                //业务类型(0.垫资,1.不垫资)
        // backersId: '',               //资方id
        isOilCoupon: 0,//是否油券
        backersListId: '',               //资方id
        isIntegral: '',                //是否积分(0.是,1.否)
        income: '',                //委托经营所得(元)
        demandDate: '',                //需求日期（yyyy-MM-dd）
        remark: '',                //备注
        isAgent: 0,//是否代理机构(1.是,0.否)
        agentId: '',//代理id
        arrivalMoney: '',//到账金额
        receivableMoney: '',//应收
        copeWithMoney: '',//应付
        returnMoneyListId: [],//回款id
        estimateArrivalDate: '',//预计到账日期
        customerVo: {},
        arrivalReceipt: [],//到账回单文件
        arrivalAvailableMoney: '',//到账可用金额
        advancesMoney: '',//垫付金额
      },
      income: '',//委托经营所得(元)
      ChannelType: [],
      BusinessType: BusinessType,
      serviceCharge1: '',
      serviceCharge2: '',
      checkCollection: false,
      fromDemand: 0,
      collectionName: '',//到账记录编号
      collectionSubjectId: '',//到账主体id
      collectionList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      NumberTypeList: [
        { value: 1, label: '自定义编号', },
        { value: 2, label: '系统编号', }
      ]
      // customer: {}
    }
  },
  created() {
    this.$bus.$on('serviceChargeChange', val => {
      this.serviceCharge1 = val
      this.arrivalMoneyMoneyChange()
    })
    this.$bus.$on('agentServiceCharge', val => {
      this.serviceCharge2 = val
      this.arrivalMoneyMoneyChange()
    })
  },
  watch: {
    'form.arrivalAvailableMoney': {
      handler(newv, oldv) {
        this.arrivalMoneyMoneyChange()
      },
      deep: true
    },
    'form.isAgent': {
      handler(newv, oldv) {
        this.arrivalMoneyMoneyChange()
      },
      deep: true
    },
    'form.businessType': {
      handler(newv, oldv) {
        this.arrivalMoneyMoneyChange()
        // if (newv == 0) {
        this.typeChange()
        // }
      },
      deep: true
    },
    'form.income'(val) {
      if (this.form.businessType == 1) {
        this.$emit('incomeCahange', val)
      }
    }

  },
  methods: {
    NumberTypeChange() {
      if (this.form.numberType == 2) {
        this.form.number = ''
      }
    },
    demandClickEvent() {
      this.fromDemand = '1'
      this.checkCollection = true
    },
    onload(obj) {
      channelId = obj.channelId;
      obj.channelId = '';
      Assign(this.form, obj)

      this.income = obj.income || 0
      this.serviceCharge1 = obj.serviceCharge || 0
      this.serviceCharge2 = obj.agentServiceCharge || 0
      // this.collectionSelect(obj.returnMoneyApprovalVoList || [], 'onload')

      //如果是重新提交，需要拉取最新回单数据，让业务重新选择回单
      if (this.editType != 'copy') {
        this.collectionSelect(obj.arrivalReceipt || [], 'onload')
      } else {
        obj.returnMoneyListId = ""
      }
      this.$nextTick(() => {
        this.$refs['customer'].getList('onload')
      })

    },
    customerChange(item, type) {
      // this.customer = item

      this.ChannelType = item.customerChannelVoList
      if (type != 'onload') {
        this.$set(this.form, 'businessType', item.defaultType)
        this.$set(this.form, 'isIntegral', item.isIntegral)
        this.serviceCharge1 = item.defaultType == 0 ? item.advanceServiceCharge : item.noAdvanceServiceCharge
        this.$emit('change', item)
        this.form.channelId = ''
        this.collectionSelect([])
        this.getFile()
        this.isIntegralChange()
      } else {
        this.form.channelId = channelId
      }
    },
    customerChange2(item, type) {
      if (type != 'onload') {
        item.agentServiceCharge = item.serviceCharge               //服务费(%)
        item.agentInterestFreeDays = item.interestFreeDays                //免息天数
        item.agentRatio = item.ratio                //利率(/万/天)
        this.serviceCharge2 = item.serviceCharge
        this.$emit('customerChange', item)
      }
    },
    totalAmountChange(data) {
      this.form.income = data
    },
    typeChange() {
      this.$emit('typeChange', this.form.businessType)
      this.$bus.$emit('businessTypeChange', this.form.businessType)
      this.form.businessType && this.getFile()
    },
    oilCouponChange() {
      this.$emit('oilCouponChange', this.form.isOilCoupon)
      this.$bus.$emit('oilCouponChange', this.form.isOilCoupon)
    },
    isIntegralChange() {

      this.$emit('isIntegralChange', this.form.isIntegral)
      this.$bus.$emit('isIntegralChange', this.form.isIntegral)
    },
    getFile() {//客户、业务类型、回款改变重新查询合同
      let getIsEffective = (params) => {
        isEffective(params).then(res => {
          let list = res.data || []
          let list2 = list.map(item => {
            let file = []
            try {
              file = JSON.parse(item.file)
            } catch (error) {
              file = []
            }
            return file
          })

          this.$bus.$emit('fileChange', list2.flat())
        })
      }
      if (this.form.businessType == 0 && this.form.customerId) {
        let params = {
          customerId: this.form.customerId
        }
        getIsEffective(params)
      } else if (this.form.businessType == 1 && this.form.customerId && this.collectionSubjectId) {
        let params = {
          customerId: this.form.customerId,
          subjectId: this.collectionSubjectId
        }
        getIsEffective(params)
      } else {
        this.$bus.$emit('fileChange', [])
      }
    },
    agentTypeChange() {
      this.$emit('agentTypeChange', this.form.isAgent)
      if (this.form.isAgent == 0) {
        this.form.agentId = ''
      }
    },
    collectionSelect(row, type = '') {//选择回款管理
      this.collectionList = row

      this.collectionSubjectId = row.length ? row[0].subjectId : ''
      this.collectionName = String(this.collectionList.map(item => {
        let _name = item.customerVo.abbreviated + item.returnMoneyDate + '回款' + item.amount
        return _name
      }) || [])
      if (type == 'onload') return //初始化不执行下面代码
      this.form.returnMoneyListId = this.collectionList.map(item => item.id) || []
      // this.form.arrivalMoney = NumberAdd(this.collectionList.map(item => item.amount) || [])
      this.form.arrivalMoney = NumberAdd(this.collectionList.map(item => item.amount) || [])
      this.form.arrivalAvailableMoney = NumberAdd(this.collectionList.map(item => item.availableMoney) || [])
      this.$bus.$emit('collectionSelect', (this.collectionList.map(item => JSON.parse(item.arrivalReceiptFile)) || []).flat()) //到账回单
      //关联不垫资的开票关联回单的合同
      let list = []
      this.collectionList && this.collectionList.length > 0 && this.collectionList.forEach(item => {
        item.invoiceApprovalVoList && item.invoiceApprovalVoList.forEach(item1 => {
          item1.contractApprovalVoList && item1.contractApprovalVoList.forEach(item2 => {
            list.push(item2)
          })
        })
      })
      let list3 = []
      list.forEach(el => {
        if (!list3.some(e => e.id == el.id)) {
          list3.push(el);
        }
      });
      let list2 = list3.map(item => {
        let file = []
        try {
          file = JSON.parse(item.file)
        } catch (error) {
          file = []
        }
        return file
      })
      this.$bus.$emit('fileChange', list2.flat())
      // this.getFile()
      //结算清单
      this.$bus.$emit('detailedChange', (this.collectionList.map(item => JSON.parse(item.detailedListFile)) || []).flat()) //结算清单
      this.$emit('chooseReceipt', this.collectionList, this.form.arrivalAvailableMoney, this.form.income)
    },
    arrivalMoneyMoneyChange() {//到账金额变动
      // let _income = 0;
      // //到账金额/(1-服务商费率)*(1-客服费率)
      // if (this.form.isAgent == 1) {
      //   // _income = NumberMul(NumberDiv(this.form.arrivalAvailableMoney, NumberSub(1, NumberDiv(this.serviceCharge2, 100))), NumberSub(1, NumberDiv(this.serviceCharge1, 100)))
      //   //                                   ( 10000 /  0.985   )   *   0.985
      //   _income = NumberMul(NumberDiv(this.form.arrivalAvailableMoney, NumberSub(1, NumberDiv(this.serviceCharge2, 100))), NumberSub(1, NumberDiv(this.serviceCharge1, 100)))
      // } else {
      //   _income = NumberMul(this.form.arrivalAvailableMoney, NumberSub(1, NumberDiv(this.serviceCharge1, 100)))
      // }
      // if (this.form.businessType == 1) {
      //   this.form.income = _income ? Number(_income).toFixed(2) : 0
      // } else {
      //   this.form.income = this.form.income


      // this.form.income = this.income ? this.income : this.form.arrivalAvailableMoney


      // console.log(this.form.income);
      // console.log(this.income);


      // }
    },
    commit() {
      if (this.form.businessType == 1 && this.collectionList.length == 0) {
        this.$message.error('请选择到账回单')
        return
      }
      if (!this.$validate('form')) return
      // if (this.form.businessType == 1 && Number(this.form.income) > Number(this.form.arrivalAvailableMoney)) {
      if (this.form.businessType == 1 && Number(this.form.income) > Number(NumberAdd([this.form.arrivalAvailableMoney, this.form.advancesMoney]))) {
        this.$message.error('委托经营所得必须等于到账可用金额 + 垫付金额！')
        return
      }
      this.form.returnMoneyListId = String(this.form.returnMoneyListId)
      if (this.form.businessType == 1 && !this.form.returnMoneyListId) {
        this.$message.warning('请选择到账回单')
      }
      this.form.receivableMoney = this.money1
      this.form.copeWithMoney = this.money2

      //到账回单文件
      let fileList = this.collectionList.map(item => {

        let tempList = JSON.parse(item.arrivalReceiptFile);
        if (tempList && tempList.length > 0) {
          return tempList[0];
        } else {
          return {};
        }
      })

      this.form.arrivalReceipt = JSON.stringify(fileList)
      return this.form
    },
    openFile(cInfo) {//查看回单文件
      let fileList = JSON.parse(cInfo.arrivalReceiptFile);
      if (!fileList || fileList.length == 0) {
        this.$message.warning('文件丢失');
        return;
      }
      let fileItem = fileList[0];
      if (fileItem instanceof Object) {
        if (fileItem.name.indexOf('.pdf') > -1) {
          window.open(fileItem.url)
        } else {
          this.dialogVisible = true
          this.dialogImageUrl = fileItem.url
          //this.handleClickItem()
        }
      } else {
        if (fileItem.indexOf('.pdf') > -1) {
          window.open(fileItem)
        } else {
          this.dialogVisible = true
          this.dialogImageUrl = fileItem
          //this.handleClickItem()
        }
      }


    },
    showBig(img) {

    },
    onClose() {
      this.dialogVisible = false
    },
    handleClickItem() {
      this.$nextTick(() => {
        let domImageMask = document.querySelector(".el-image-viewer__mask");  // 获取遮罩层dom
        if (!domImageMask) {
          return;
        }
        domImageMask.addEventListener("click", () => {
          // 点击遮罩层时调用关闭按钮的 click 事件
          document.querySelector(".el-image-viewer__close").click();
        });
      })
    }

  },
  computed: {
    money1() {//应收
      let sum = 0
      //不垫资的应收都等于到账金额
      if (this.form.businessType == 1) {
        sum = this.form.arrivalMoney;
      } else {
        //代理模式：委托经营所得/(1-客户服务费率)*(1-服务商费率)
        if (this.form.isAgent == 1) {
          sum = NumberMul(NumberDiv(this.form.income, NumberSub(1, NumberDiv(this.serviceCharge1, 100))), NumberSub(1, NumberDiv(this.serviceCharge2, 100)))
        } else {
          //委托经营所得/(1-客户服务费率)
          sum = NumberDiv(this.form.income, NumberSub(1, NumberDiv(this.serviceCharge1, 100)));
        }
      }
      return sum ? Number(sum).toFixed(2) : 0
    },
    money2() {//应付      
      return this.form.income ? Number(this.form.income).toFixed(2) : 0
    },
  }
}
</script>

<style>
.file {
  cursor: pointer;
  display: block;
}
.file:hover {
  color: #a0cfff;
}
.showCollect {
  cursor: pointer;
  height: 30px;
  width: 100px;
  border: 1px solid #0099ff2a;
  border-radius: 5px;
  text-align: center;
  background: #a0cfff;
  color: #fff;
}
.one-collect {
  width: 500px;
  float: left;
}
.more-collect {
  width: 400px;
  float: left;
}
</style>