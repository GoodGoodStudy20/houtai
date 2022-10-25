<template>
  <div>
    <div class="form-title">查看资方信息</div>
    <!-- 基础信息 -->
    <div class="basic-info-container">
      <h3 class="basic-info">基础信息</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1">
            名称：<span class="col-text">{{
              detailInfo.name || PLACEHOLDER_BAR
            }}</span>
          </div>
          <div class="grid-content1">
            简称：<span class="col-text">{{
              detailInfo.abbreviated || PLACEHOLDER_BAR
            }}</span>
          </div>
          <div class="grid-content1">
            授信额度（万） ：<span class="col-text">{{
              detailInfo.creditQuota || PLACEHOLDER_BAR
            }}</span>
          </div>
          <div class="grid-content1">
            信用代码：<span class="col-text">{{
              detailInfo.creditCode || PLACEHOLDER_BAR
            }}</span>
          </div>
          <div class="grid-content1">
            来往邮箱：<span class="col-text">{{
              detailInfo.contactMailbox || PLACEHOLDER_BAR
            }}</span>
          </div>
          <div class="grid-content2">
            <span class="mw">注册地址：</span><span class="col-text">{{
              detailInfo.registeredAddress || PLACEHOLDER_BAR
            }}</span>
          </div>
          <div class="grid-content2" style="width: 100%">
            <span class="mw">经营范围：</span><span class="col-text">{{
              detailInfo.businessScope || PLACEHOLDER_BAR
            }}</span>
          </div>
          <div class="grid-content1">
            备注：<span class="col-text">{{
              detailInfo.remark || PLACEHOLDER_BAR
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 账户 -->
    <div class="basic-info-container">
      <h3 class="basic-info">账户</h3>
      <div class="basic-info-content">
        <div v-for="(item, index) in detailInfo.accountTaxVoList" :key="index">
          <el-row :gutter="20" class="rol-content">
            <el-col :span="8">
              <div class="grid-content mbt">
                名称：<span class="col-text">{{
                  item.name || PLACEHOLDER_BAR
                }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content mbt">
                账号：<span class="col-text">{{
                  item.account || PLACEHOLDER_BAR
                }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content mbt">
                开户行：<span class="col-text">{{
                  item.openingBank || PLACEHOLDER_BAR
                }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content mbt">
                备注：<span class="col-text">{{
                  item.remark || PLACEHOLDER_BAR
                }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 联系人 -->
    <div class="basic-info-container">
      <h3 class="basic-info">联系人</h3>
      <div class="basic-info-content">
        <div v-for="(item, index) in detailInfo.contactsVoList" :key="index">
          <el-row :gutter="20" class="rol-content">
            <el-col :span="8">
              <div class="grid-content mbt">
                职位：<span class="col-text">{{
                  item.position || PLACEHOLDER_BAR
                }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content mbt">
                姓名：<span class="col-text">{{
                  item.name || PLACEHOLDER_BAR
                }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content mbt">
                联系电话：<span class="col-text">{{
                  item.phone || PLACEHOLDER_BAR
                }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content mbt">
                邮箱：<span class="col-text">{{
                  item.mailbox || PLACEHOLDER_BAR
                }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content mbt">
                备注：<span class="col-text">{{
                  item.remark || PLACEHOLDER_BAR
                }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 文件 -->
    <div class="basic-info-container">
      <h3 class="basic-info">文件</h3>
      <div class="basic-info-content">
        <UploadFile v-if="fileUrl.length !== 0" v-model="fileUrl" disabled />
        <div v-else>{{ NO_DATA }}</div>
      </div>
    </div>
    <div class="basic-info-container">
      <h3 class="basic-info">资金记录</h3>
      <el-table stripe :data="list" style="max-width: 100%;margin-top:15px;">
        <el-table-column label="主体" align="left" show-overflow-tooltip min-width="150px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.subjectVo?scope.row.subjectVo.name:''" placement="bottom">
              <span>{{scope.row.subjectVo?scope.row.subjectVo.abbreviated:''}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="放款金额" prop="loanMoney" align="right">
          <template slot-scope="scope">
            <span>{{scope.row.loanMoney || 0 | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用信额度(万)" prop="useQuota" align="right">
          <template slot-scope="scope">
            <span>{{scope.row.useQuota}}</span>
          </template>
        </el-table-column>
        <el-table-column label="剩余额度(万)" prop="surplusQuota" align="right">
          <template slot-scope="scope">
            <span>{{scope.row.surplusQuota }}</span>
          </template>
        </el-table-column>
        <el-table-column label="放款期限" prop="loanTerm" align="left" min-width="180" class-name="cell-loanTerm">
          <template slot-scope="scope">
            <span>{{scope.row.loanStartTerm}} 至 {{scope.row.loanEndTerm}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="left" width="100">
          <template slot-scope="scope">
            <el-tag size="mini" :style="{'background-color':scope.row.status==0?'#FFF5EB':'#EBF2FF','border-color':scope.row.status==0?'#FFA439':'#3A7DFF','cursor':'pointer'}">
              <span :style="{color:scope.row.status==0?'#FFA439':'#3A7DFF'}">{{status[scope.row.status]}}</span>
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="surplus-item" v-if="surplusRepaymentMoney">
        <p>用信额度合计：</p>
        <p class="surplus"><span class="surplus-left">￥</span>{{surplusRepaymentMoney || 0 | toThousands}}</p>
      </div>
    </div>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import { getBackersInfo } from "@/api/index.js";
import UploadFile from "@/components/UploadFile/index.vue";
export default {
  components: { UploadFile },
  name: "ShowDetail",
  props: ["value", "editId", "editType"],
  data() {
    return {
      detailInfo: {},
      fileUrl: [], // 文件
      list: [],
      status: ['还款中', '已还款'],
      surplusRepaymentMoney: 0
    };
  },
  mounted() {
    if (this.editId) {
      this.onload();
    }
  },
  methods: {
    onload() {
      getBackersInfo({ id: this.editId }).then((res) => {
        this.detailInfo = res.data || {};
        this.fileUrl = JSON.parse(this.detailInfo.fileUrl);
        this.list = this.detailInfo.loanVoList
      });
    },
    cancel() {
      this.$emit("input", 0);
    },
  },
};
</script>


<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
::v-deep .cell-loanTerm {
  padding-left: 20px !important;
}
</style>