<template>
  <div>
    <div class="form-title">查看客户信息</div>
    <!-- 基础信息 -->
    <div class="basic-info-container">
      <h3 class="basic-info">基础信息</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1">
            名称：<span class="col-text">{{ detailInfo.name }}</span>
          </div>
          <div class="grid-content1">
            简称：<span class="col-text">{{ detailInfo.abbreviated }}</span>
          </div>
          <div class="grid-content1">
            类型：<span class="col-text" v-if="options[detailInfo.type]">{{
              options[detailInfo.type].label
            }}</span>
          </div>
          <div class="grid-content1">
            所属地区：
            <ChooseArea disabled :province.sync="detailInfo.province" :city.sync="detailInfo.city" />
          </div>
          <div class="grid-content1">
            级别：
            <el-select v-model="detailInfo.level" placeholder="请选择" disabled>
              <el-option v-for="item in LevelType" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="grid-content1">
            所属分公司：<span class="col-text">{{ detailInfo.name }}</span>
          </div>
          <div class="grid-content1">
            <span class="zmw"> 负责人：</span>
            <span class="col-text">{{ detailInfo.directorName || "--" }}</span>
          </div>
          <div class="grid-content1">
            <span class="zmw"> 总负责人：</span>
            <span class="col-text">{{ detailInfo.generalDirectorName || "--" }}</span>
          </div>
          <div class="grid-content1">
            信用代码：<span class="col-text">{{ detailInfo.creditCode }}</span>
          </div>
          <div class="grid-content1">
            业务编码：<span class="col-text">{{
              detailInfo.businessNumber
            }}</span>
          </div>
          <div class="grid-content1">
            往来邮箱：<span class="col-text">{{
              detailInfo.contactMailbox || "--"
            }}</span>
          </div>
          <div class="grid-content1">
            备注：<span class="col-text">{{ detailInfo.remark || "--" }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 客户需求 -->
    <div class="basic-info-container">
      <h3 class="basic-info">客户需求</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1">
            地域要求：<span class="col-text" v-if="detailInfo.customerDemandVo">{{
                option1[detailInfo.customerDemandVo.regionDemand].label || "--"
              }}</span>
          </div>
          <div class="grid-content1">
            税务类型要求：<span class="col-text" v-if="detailInfo.customerDemandVo">{{
                option2[detailInfo.customerDemandVo.taxTypeDemand].label || "--"
              }}</span>
          </div>
          <div class="grid-content1">
            成立年限：<span class="col-text" v-if="detailInfo.customerDemandVo">{{
                option3[detailInfo.customerDemandVo.establishYears].label ||
                "--"
              }}</span>
          </div>
          <div class="grid-content1">
            注册资本：<span class="col-text" v-if="detailInfo.customerDemandVo">{{
                option4[detailInfo.customerDemandVo.registeredCapital].label ||
                "--"
              }}</span>
          </div>
          <div class="grid-content1">
            主体关联要求：<span class="col-text" v-if="detailInfo.customerDemandVo">{{
                option5[detailInfo.customerDemandVo.subjectRelationDemand]
                  .label || "--"
              }}</span>
          </div>
          <div class="grid-content1">
            业务场景：<span class="col-text" v-if="detailInfo.customerDemandVo">{{
                detailInfo.customerDemandVo.businessScopeTypeNameList || "--"
              }}</span>
          </div>
          <div class="grid-content1">
            业务规模：<span class="col-text" v-if="detailInfo.customerDemandVo">{{
               detailInfo.customerDemandVo.businessScale || '--'
              }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 渠道 -->
    <div class="basic-info-container">
      <h3 class="basic-info">渠道</h3>
      <div class="basic-info-content">
        <div v-for="(item, index) in detailInfo.customerChannelVoList" :key="index">
          <el-row :gutter="20" class="rol-content">
            <el-col :span="8">
              <div class="grid-content mbt">
                名称：<span class="col-text">{{ item.name || "--" }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 业务条件 -->
    <div class="basic-info-container">
      <h3 class="basic-info">业务条件</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1">
            业务模式：<span class="col-text" v-if="BusinessType[detailInfo.defaultType]">{{ BusinessType[detailInfo.defaultType].label }}</span>
          </div>
          <div class="grid-content1" v-if="detailInfo.defaultType==0">
            当前是否积分：<span class="col-text" v-if="option6[detailInfo.isIntegral]">{{ option6[detailInfo.isIntegral].label }}</span>
          </div>
          <div class="grid-content1">
            服务费率：<span v-if="detailInfo.defaultType==0" class="col-text">{{ detailInfo.advanceServiceCharge }}%</span>
            <span v-if="detailInfo.defaultType==1" class="col-text">{{ detailInfo.noAdvanceServiceCharge }}%</span>
          </div>
          <div class="grid-content1" v-if="detailInfo.defaultType == 0">
            免息天数：<span class="col-text">{{ detailInfo.interestFreeDays }}天</span>
          </div>
          <div class="grid-content1" v-if="detailInfo.defaultType == 0">
            利率：<span class="col-text">{{ detailInfo.ratio }}/万/天</span>
          </div>
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
                职位：<span class="col-text">{{ item.position || "--" }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content mbt">
                姓名：<span class="col-text">{{ item.name || "--" }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content mbt">
                联系电话：<span class="col-text">{{ item.phone || "--" }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content mbt">
                邮箱：<span class="col-text">{{ item.mailbox || "--" }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content mbt">
                备注：<span class="col-text">{{ item.remark || "--" }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 发票信息 -->
    <div class="basic-info-container">
      <h3 class="basic-info">发票信息</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1">
            公司名称：<span class="col-text">{{
              detailInfo.invoiceVo.name || "--"
            }}</span>
          </div>
          <div class="grid-content1">
            税号：<span class="col-text">{{
              detailInfo.invoiceVo.dutyParagraph || "--"
            }}</span>
          </div>
          <div class="grid-content1">
            <span class="mw"> 注册地址：</span>
            <span class="col-text">{{
              detailInfo.invoiceVo.registeredAddress || "--"
            }}</span>
          </div>
          <div class="grid-content1">
            电话：<span class="col-text">{{
              detailInfo.invoiceVo.phone || "--"
            }}</span>
          </div>
          <div class="grid-content1">
            账号：<span class="col-text">{{
              detailInfo.invoiceVo.account || "--"
            }}</span>
          </div>
          <div class="grid-content1">
            开户行：<span class="col-text">{{
              detailInfo.invoiceVo.openingBank || "--"
            }}</span>
          </div>
          <div class="grid-content1">
            收货人：<span class="col-text">{{
              detailInfo.invoiceVo.recipient || "--"
            }}</span>
          </div>
          <div class="grid-content1">
            收货电话：<span class="col-text">{{
              detailInfo.invoiceVo.recipientPhone || "--"
            }}</span>
          </div>
          <div class="grid-content1">
            收货地址：<span class="col-text">{{
              detailInfo.invoiceVo.recipientAddress || "--"
            }}</span>
          </div>
        </div>
      </div>
      <div class="basic-info-content">
        <el-button type="primary" @click.stop="copyClick" size="mini" style="height: 30px; margin: 10px 10px 0 0">复制信息</el-button>
      </div>
    </div>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>
<script>
import { CustomerType, LevelType, BusinessType } from "@/utils/field.js";
import { getCustomerInfo } from "@/api/index.js";
import ChooseArea from "@/components/ChooseArea/index.vue";
export default {
  components: { ChooseArea },
  name: "ShowDetail",
  props: ["value", "editId", "editType"],
  data() {
    return {
      detailInfo: { invoiceVo: {} },
      options: CustomerType, // 地区
      BusinessType: BusinessType, // 地区
      LevelType: LevelType, //客户级别
      option1: [
        // 地区
        { label: "要求本省" },
        { label: "要求本市" },
        { label: "无要求" },
      ],
      option2: [
        // 税务类型
        { label: "一般纳税人" },
        { label: "小规模" },
        { label: "无要求" },
      ],
      option3: [
        // 成立年限
        { label: "六月以上" },
        { label: "无要求" },
      ],
      option4: [
        // 注册资本
        { label: "50万以上" },
        { label: "100万以上" },
        { label: "无要求" },
      ],
      option5: [
        // 主体关联要求
        { label: "省内无关联" },
        { label: "市内无关联" },
        { label: "无要求" },
      ],
      option6: [
        // 是否是积分
        { label: "是" },
        { label: "否" },
      ],
      sceneListName: []
    };
  },
  mounted() {
    if (this.editId) {
      this.onload();
    }
  },
  methods: {
    cancel() {
      this.$emit("input", 0);
    },
    onload() {
      getCustomerInfo({ id: this.editId }).then((res) => {
        this.detailInfo = res.data || {};
      });
    },
    // 复制信息
    copyClick() {
      let input = document.createElement("textarea");
      input.value = `公司名称：${this.detailInfo.invoiceVo.name}，\n税号：${this.detailInfo.invoiceVo.dutyParagraph}，\n注册地址：${this.detailInfo.invoiceVo.registeredAddress}，\n电话：${this.detailInfo.invoiceVo.phone}，\n账号：${this.detailInfo.invoiceVo.account}，\n开户行：${this.detailInfo.invoiceVo.openingBank}`; // 修改文本框的内容
      document.body.appendChild(input);
      input.select(); // 选中文本
      document.execCommand("copy"); // 执行浏览器复制命令
      document.body.removeChild(input);
      this.$message.success("复制成功");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
</style>