<template>
  <div class="spacel-box">
    <el-form inline size="small">
      <el-form-item>
        <el-radio v-model="type" :label="0" @change="getBySubjectId">按主体</el-radio>
        <el-radio v-model="type" :label="1" @change="getByCustomerId">按客户</el-radio>
        <ChooseSubject @change="getBySubjectId" v-show="type==0" v-model="subjectId" showAll style="width:200px"></ChooseSubject>
        <ChooseCustomer @change="getByCustomerId" v-show="type==1" v-model="customerId" showAll style="width:200px"></ChooseCustomer>
        <el-checkbox v-model="isBeOverdue" style="margin-left:10px" :true-label="1" :false-label="0" @change="checkboxChange">过期</el-checkbox>
      </el-form-item>
    </el-form>
    <div v-show="type==0">
      <div class="first-box public">
        <el-tooltip effect="dark" :content="subjectObj.subjectAbbreviated|| subjectObj.abbreviated" placement="bottom">
          <p>{{subjectObj.subjectAbbreviated|| subjectObj.abbreviated}}</p>
        </el-tooltip>
        <p class="p2">
          <span><i class="el-icon-location-outline" style="margin-right:4px"></i>省：{{subjectObj.provincesQuantity || 0}}</span>
          <span><img src="@/assets/img/客户.png" style="width:15px;height:16px;margin-right:4px;vertical-align: middle;"></img>客户：{{subjectObj.customerQuantity || 0}}</span>
        </p>
      </div>
      <el-row v-for="(item,i) in subjectObj.contractStatisticsVoList" :key="i" style="margin-bottom:40px">
        <el-col :md="5" :lg="4" :xl="3">
          <div class="first-box public">
            <el-tooltip effect="dark" :content="item.provinceName" placement="bottom">
              <p>{{item.provinceName}}</p>
            </el-tooltip>
            <p style="margin-top:25px"><img src="@/assets/img/客户.png" style="width:15px;height:16px;margin-right:4px;vertical-align: middle;"></img>客户：{{item.customerQuantity || 0}}</p>
          </div>
        </el-col>
        <el-col :md="19" :lg="20" :xl="21">
          <div class="small-box public" v-for="(item2,k) in item.contractStatisticsVoList" :key="k">
            <el-tooltip effect="dark" :content="item2.customerAbbreviated" placement="bottom">
              <p>{{item2.customerAbbreviated}}</p>
            </el-tooltip>
            <p><i class="el-icon-receiving" style="margin-right:4px"></i>合同：{{item2.contractQuantity || 0}}</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-show="type==1">
      <div class="first-box public">
        <el-tooltip effect="dark" :content="customerObj.subjectAbbreviated || customerObj.abbreviated" placement="bottom">
          <p>{{customerObj.subjectAbbreviated || customerObj.abbreviated}}</p>
        </el-tooltip>
        <p style="margin-top:25px"><i class="el-icon-user" style="margin-right:4px"></i>主体：{{customerObj.subjectQuantity || 0}}</p>
      </div>
      <div class="small-box public" v-for="(item,k) in customerObj.contractStatisticsVoList" :key="k">
        <el-tooltip effect="dark" :content="item.subjectAbbreviated" placement="bottom">
          <p>{{item.subjectAbbreviated}}</p>
        </el-tooltip>
        <p style="margin-top:20px"><i class="el-icon-receiving" style="margin-right:4px"></i>合同：{{item.contractQuantity || 0}}</p>
      </div>
    </div>
    <!-- <TreeChart :json="treeDate"></TreeChart> -->
  </div>
</template>

<script>
import ChooseCustomer from '@/components/ChooseCustomer/index.vue'
import ChooseSubject from '@/components/ChooseSubject/index.vue'
import TreeChart from './component/TreeCharts'
import { contractStatisticsByCustomerId, contractStatisticsBySubjectId } from '@/api/index.js'
import { exportCommon } from '@/utils/index.js'
export default {
  name: 'contracts',
  props: ['value'],
  components: { ChooseCustomer, ChooseSubject, TreeChart },
  data() {
    return {
      type: 0,
      subjectId: '',
      customerId: '',
      isBeOverdue: 0,
      subjectObj: {},
      customerObj: {}
    }
  },
  created() {
    this.getBySubjectId()
  },
  methods: {
    getByCustomerId() {
      contractStatisticsByCustomerId({ customerId: this.customerId, isBeOverdue: this.isBeOverdue }).then(res => {
        let result = res.data || {}
        this.customerObj = result
      })
    },
    getBySubjectId() {
      contractStatisticsBySubjectId({ subjectId: this.subjectId, isBeOverdue: this.isBeOverdue }).then(res => {
        let result = res.data || {}
        this.subjectObj = result
      })
    },
    checkboxChange() {
      this.type == 0 ? this.getBySubjectId() : this.getByCustomerId()
    }
  }
}
</script>

<style lang="scss" scoped>
.spacel-box {
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: #fff;
  overflow: auto;
}
.top-box {
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  overflow: auto;
  background: #fff;
  border-radius: 10px;
  div {
    // width: 200px;
    flex: 1;
    flex-shrink: 0;
    margin-right: 10px;
    text-align: center;
    p:nth-child(1) {
      font-size: 20px;
    }
  }
}
.first-box {
  width: 180px;
  height: 96px;
  // background: #3a7dff;
  // border: 1px solid #3a7dff;
  background: url("../../../assets/img/共幸.png");
  background-size: 100% 100%;
  color: #fff;
  box-sizing: border-box;
  border-radius: 8px;
  margin: 0 auto 40px;
  text-align: center;
  padding: 1px 20px;
  font-weight: bold;
  font-size: 22px;
  p:nth-child(2) {
    font-size: 13px;
  }
  .p2 {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }
}
.small-box {
  width: 180px;
  height: 86px;
  background: #ffffff;
  color: #3a7dff;
  border: 1px solid #3a7dff;
  box-sizing: border-box;
  border-radius: 8px;
  text-align: center;
  display: inline-block;
  margin-left: 20px;
  margin-bottom: 10px;
  p:nth-child(2) {
    font-size: 13px;
    margin-top: 25px;
  }
}
.public {
  p:nth-child(1) {
    width: 80%;
    margin: 10px auto 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>