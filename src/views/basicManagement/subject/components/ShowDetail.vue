<template>
  <div>
    <div class="form-title">查看主体详情</div>
    <!-- 基础信息 -->
    <div class="basic-info-container">
      <h3 class="basic-info">基础信息</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1">
            主体名称：<span class="col-text">{{
              detailInfo.name || PLACEHOLDER_BAR
            }}</span>
          </div>
          <div class="grid-content1">
            简称：<span class="col-text">{{
              detailInfo.abbreviated || PLACEHOLDER_BAR
            }}</span>
          </div>
          <div class="grid-content1">
            运营性质：
            <el-select v-model="detailInfo.operateNature" placeholder="请选择">
              <el-option v-for="item in NatureOfOperation" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="grid-content1">
            主体级别：
            <el-select v-model="detailInfo.level" placeholder="请选择">
              <el-option v-for="item in PrincipalLevel" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="grid-content1">
            税务类型：<span class="col-text" v-if="options[detailInfo.type]">{{
              options[detailInfo.type].label || PLACEHOLDER_BAR
            }}</span>
          </div>
          <div class="grid-content1">
            <span class="mw"> 信用代码： </span>
            <span class="col-text">{{
              detailInfo.creditCode || PLACEHOLDER_BAR
            }}</span>
          </div>
          <div class="grid-content1">
            成立日期：<span class="col-text">{{
              detailInfo.establishDate || PLACEHOLDER_BAR
            }}</span>
          </div>
          <div class="grid-content1">
            有效期：<span class="col-text">{{ detailInfo.expireDate
              }}{{
                detailInfo.isNoFixed == 0
                  ? "无固定"
                  : detailInfo.isNoFixed == 1
                  ? "固定"
                  : "--"
              }}</span>
          </div>

          <div class="grid-content1">
            注册资本：<span class="col-text">{{ detailInfo.registeredCapital || 0 }}万</span>
          </div>
          <div class="grid-content1">
            法人：<span class="col-text">{{
              detailInfo.legalPersonName || PLACEHOLDER_BAR
            }}</span>
          </div>
          <div class="grid-content1">
            法人联系电话：<span class="col-text">{{
              detailInfo.legalPersonPhone || PLACEHOLDER_BAR
            }}</span>
          </div>
          <div class="grid-content1">
            工商年报提醒人：<span class="col-text">{{
              detailInfo.annualReportRemindName || PLACEHOLDER_BAR
            }}</span>
          </div>
          <div class="grid-content1">
            开票人：<span class="col-text">{{
              detailInfo.invoiceUserName || PLACEHOLDER_BAR
            }}</span>
          </div>
          <div class="grid-content1">
            <span class="mw"> 注册地址： </span>
            <span class="col-text">{{
              detailInfo.registeredAddress || PLACEHOLDER_BAR
            }}</span>
          </div>

          <div class="grid-content1"></div>
          <div class="grid-content2" style="width: 100%">
            <span class="mw">所属地区：</span>
            <ChooseArea disabled :province.sync="detailInfo.province" :city.sync="detailInfo.city" style="width: 100%"></ChooseArea>
          </div>
          <div class="grid-content2">
            经营范围分类：<span class="col-text" v-for="(item, index) in detailInfo.businessScopeTypeVoList" :key="index">{{ item.name || PLACEHOLDER_BAR }} 、
            </span>
          </div>
          <div class="grid-content2">
            <span class="mw">经营范围：</span><span class="col-text">{{
              detailInfo.businessScope || PLACEHOLDER_BAR
            }}</span>
          </div>
          <div class="grid-content1" style="width: 100%">
            备注：<span class="col-text">{{
              detailInfo.remark || PLACEHOLDER_BAR
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 股东监事信息 -->
    <div class="basic-info-container">
      <h3 class="basic-info">股东监事信息</h3>
      <div class="basic-info-content">
        <p class="business-conditions">监事</p>
        <div v-for="(item, index) in detailInfo.shareholderSupervisorVoList" :key="index">
          <el-row v-if="item.type == 1" :gutter="20" class="rol-content">
            <el-col :span="8">
              <div class="grid-content">
                姓名：<span class="col-text">{{
                  item.name || PLACEHOLDER_BAR
                }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                联系电话：<span class="col-text">{{
                  item.phone || PLACEHOLDER_BAR
                }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="basic-info-content">
        <p class="business-conditions">股东</p>
        <div v-for="(item, index) in detailInfo.shareholderSupervisorVoList" :key="index">
          <el-row v-if="item.type == 0" :gutter="20" class="rol-content">
            <el-col :span="8">
              <div class="grid-content">
                名称：<span class="col-text">{{
                  item.name || PLACEHOLDER_BAR
                }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                联系电话：<span class="col-text">{{
                  item.phone || PLACEHOLDER_BAR
                }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                占比：<span class="col-text">{{ item.proportion || 0 }}%</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!-- 账户/税务信息 -->
    <div class="basic-info-container">
      <h3 class="basic-info">账户/税务信息</h3>
      <div class="basic-info-content">
        <div class="df-fw bm" v-for="(item, index) in detailInfo.accountTaxVoList" :key="index">
          <div class="grid-content1">
            账户类型：
            <el-select v-model="item.type" disabled>
              <el-option v-for="item in accountType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="grid-content1">
            名称：<span class="col-text">{{
              item.name || PLACEHOLDER_BAR
            }}</span>
          </div>

          <div class="grid-content1">
            账号：<span class="col-text">{{
              item.account || PLACEHOLDER_BAR
            }}</span>
          </div>

          <div class="grid-content1 mbt">
            开户行：<span class="col-text">{{
              item.openingBank || PLACEHOLDER_BAR
            }}</span>
          </div>

          <div class="grid-content1 mbt">
            优盾：<span class="col-text">{{
              item.isYouDun ? "是" : "否"
            }}</span>
          </div>

          <div class="grid-content1 mbt">
            共管方：<span class="col-text">{{
              item.manageTogether || PLACEHOLDER_BAR
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 开票限制 -->
    <div class="basic-info-container">
      <h3 class="basic-info">开票限制</h3>
      <div class="basic-info-content">
        <div class="df-fw bm">
          <div class="grid-content1">
            单个客户每月不超过：<span class="col-text">{{ detailInfo.customerMonthly || 0 | toThousands }}元</span>
          </div>
          <div class="grid-content1">
            单个省份每月不超过：<span class="col-text">{{ detailInfo.provinceMonthly || 0 | toThousands }}元</span>
          </div>
        </div>
        <div style="display: flex; flex-wrap: wrap" v-for="(item, index) in detailInfo.invoiceRestrictionsVoList" :key="index" class="bm">
          <div class="grid-content1">
            发票类型：<span class="col-text" v-if="InvoiceTypeList[item.type]">{{ InvoiceTypeList[item.type].label }}</span>
          </div>
          <div class="grid-content1">
            发票份数(份)：<span class="col-text">{{ item.quantity }}</span>
          </div>
          <div class="grid-content1">
            单张票最大额度(元)：<span class="col-text">{{
              item.maxAmount || 0 | toThousands
            }}</span>
          </div>
          <div class="grid-content1">
            开票额度(元)：<span class="col-text">{{
              item.totalAmount || 0 | toThousands
            }}</span>
          </div>
          <div class="grid-content1">
            税率(%)：<span class="col-text">{{
              item.taxRate
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 证件信息 -->
    <div class="basic-info-container">
      <h3 class="basic-info">证件信息</h3>
      <div class="basic-info-content">
        <el-row :gutter="20" class="rol-content">
          <el-col :span="8" v-if="detailInfo.idCardJust">
            <div>法人身份证正面</div>
            <el-image fit="cover" class="images" :src="detailInfo.idCardJust" :preview-src-list="[detailInfo.idCardJust]">
            </el-image>
          </el-col>
          <el-col :span="8" v-if="detailInfo.idCardBack">
            <div>法人身份证反面</div>
            <el-image lazy fit="cover" class="images" :src="detailInfo.idCardBack" :preview-src-list="[detailInfo.idCardBack]">
            </el-image>
          </el-col>
          <el-col :span="8" v-if="detailInfo.businessLicenseOriginal">
            <div>营业执照正本</div>
            <el-image lazy fit="cover" class="images" :src="detailInfo.businessLicenseOriginal" :preview-src-list="[detailInfo.businessLicenseOriginal]">
            </el-image>
          </el-col>
          <el-col :span="8" v-if="detailInfo.businessLicenseDuplicate">
            <div>营业执照副本</div>
            <el-image lazy fit="cover" class="images" :src="detailInfo.businessLicenseDuplicate" :preview-src-list="[detailInfo.businessLicenseDuplicate]">
            </el-image>
          </el-col>
          <el-col :span="8" v-if="detailInfo.doorHeadPhoto">
            <div>门头照</div>
            <el-image lazy fit="cover" class="images" :src="detailInfo.doorHeadPhoto" :preview-src-list="[detailInfo.doorHeadPhoto]">
            </el-image>
          </el-col>
          <el-col :span="8" v-if="detailInfo.accountOpeningPermit">
            <div>开户许可证</div>
            <el-image lazy fit="cover" class="images" :src="detailInfo.accountOpeningPermit" :preview-src-list="[detailInfo.accountOpeningPermit]">
            </el-image>
          </el-col>
          <el-col :span="8" v-if="detailInfo.basicAccount">
            <div>基本账户信息</div>
            <el-image lazy fit="cover" class="images" :src="detailInfo.basicAccount" :preview-src-list="[detailInfo.basicAccount]">
            </el-image>
          </el-col>
          <el-col :span="8" v-if="detailInfo.otherPhoto">
            <div>其他</div>
            <el-image lazy fit="cover" class="images" :src="detailInfo.otherPhoto" :preview-src-list="[detailInfo.otherPhoto]">
            </el-image>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 工商年报文件 -->
    <div class="basic-info-container">
      <h3 class="basic-info">工商年报文件</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1" v-if="annualReportFile">
            <UploadFile v-model="annualReportFile" disabled />
          </div>
          <div v-else>{{ NO_DATA }}</div>
        </div>
      </div>
    </div>
    <!-- 账号密码 -->
    <div class="basic-info-container">
      <h3 class="basic-info">账号密码</h3>
      <div class="basic-info-content">
        <div class="df-fw" v-for="(item, index) in detailInfo.accountPasswordVoList" :key="index">
          <div class="grid-content1">
            名称：<span class="col-text">{{
              item.name || PLACEHOLDER_BAR
            }}</span>
          </div>
          <div class="grid-content1">
            网址：<span class="col-text">{{
              item.website || PLACEHOLDER_BAR
            }}</span>
          </div>
          <div class="grid-content1">
            账号：<span class="col-text">{{
              item.account || PLACEHOLDER_BAR
            }}</span>
          </div>
          <div class="grid-content1">
            密码：<span class="col-text">{{
              item.password || PLACEHOLDER_BAR
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 合同信息 -->
    <div class="basic-info-container">
      <h3 class="basic-info">合同信息</h3>
      <div class="basic-info-content">
        <Contract :disabled="true" :subjectId="subjectId" />
      </div>
    </div>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import { getSubjectInfo } from "@/api/index.js";
import ChooseArea from "@/components/ChooseArea/index.vue";
import UploadFile from "@/components/UploadFile/index.vue";
import Contract from "../../contract/index.vue";
import {
  AccountType,
  NatureOfOperation,
  PrincipalLevel,
  SubjectType,
  InvoiceTypeList,
} from "@/utils/field.js";
export default {
  components: { ChooseArea, Contract, UploadFile },
  name: "ShowDetail",
  props: ["value", "subjectId", "editType"],
  data() {
    return {
      detailInfo: {},
      accountType: AccountType,
      options: SubjectType, // 税务类型
      InvoiceTypeList: InvoiceTypeList, // 发票类型
      annualReportFile: [],
      NatureOfOperation: NatureOfOperation,
      PrincipalLevel: PrincipalLevel,
    };
  },
  mounted() {
    if (this.subjectId) {
      this.onload();
    }
  },
  methods: {
    onload() {
      getSubjectInfo({ id: this.subjectId }).then((res) => {
        this.detailInfo = res.data || {};
        this.annualReportFile = JSON.parse(this.detailInfo.annualReportFile);
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
</style>