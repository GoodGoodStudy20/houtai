<template>
  <div>
    <div class="form-title">查看服务商信息</div>
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
            分类：<ChooseServiceProviderType
              style="width: 200px"
              disabled
              v-model="detailInfo.typeId"
            ></ChooseServiceProviderType>
          </div>
          <div class="grid-content1">
            信用代码：<span class="col-text">{{ detailInfo.creditCode }}</span>
          </div>
          <div class="grid-content1">
            所属地区：
            <ChooseArea
              disabled
              :province.sync="detailInfo.province"
              :city.sync="detailInfo.city"
            ></ChooseArea>
          </div>
          <div class="grid-content1">
            往来邮箱：<span class="col-text">{{
              detailInfo.contactMailbox || "--"
            }}</span>
          </div>
          <div class="grid-content1">
            服务时间：<span class="col-text"
              >{{ form.startWeek || "--" }}至{{ form.endWeek }}-{{
                form.startTime
              }}-{{ form.endTime }}</span
            >
          </div>
          <div class="grid-content1">
            服务费率：<span class="col-text">{{
              detailInfo.serviceCharge
            }}</span>
          </div>
          <div class="grid-content1">
            备注：<span class="col-text">{{ detailInfo.remark || "--" }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 服务规则 -->
    <div class="basic-info-container">
      <h3 class="basic-info">服务规则</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1">
            单人单月限额（元） ：<span class="col-text">{{
              detailInfo.singleMonthlyQuota
            }}</span>
          </div>
          <div class="grid-content1">
            年龄限制 ：<span class="col-text"
              >{{ detailInfo.ageQuotaStart || "--" }}至{{
                detailInfo.ageQuotaEnd || "--"
              }}</span
            >
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
    <!-- 账户/税务信息 -->
    <div class="basic-info-container">
      <h3 class="basic-info">账户/税务信息</h3>
      <div class="basic-info-content">
        <p class="business-conditions">基本户</p>
        <div v-for="(item, index) in detailInfo.accountTaxVoList" :key="index">
          <el-row v-if="item.type == 0" :gutter="20" class="rol-content">
            <el-col :span="8">
              <div class="grid-content">
                名称：<span class="col-text">{{ item.name || "--" }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                账号：<span class="col-text">{{ item.account || "--" }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                开户行：<span class="col-text">{{
                  item.openingBank || "--"
                }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="basic-info-content">
        <p class="business-conditions">一般户</p>
        <div v-for="(item, index) in detailInfo.accountTaxVoList" :key="index">
          <el-row v-if="item.type == 1" :gutter="20" class="rol-content">
            <el-col :span="8">
              <div class="grid-content">
                名称：<span class="col-text">{{ item.name || "--" }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                账号：<span class="col-text">{{ item.account || "--" }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="grid-content">
                开户行：<span class="col-text">{{
                  item.openingBank || "--"
                }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import ChooseArea from "@/components/ChooseArea/index.vue";
import { getServiceProviderInfo } from "@/api/index.js";
import { Assign } from "@/utils/index.js";
import ChooseServiceProviderType from "@/components/ChooseServiceProviderType/index.vue";
export default {
  components: { ChooseArea, ChooseServiceProviderType },
  props: ["value", "editId", "editType"],
  data() {
    return {
      detailInfo: {},
      form: {
        name: "", //名称
        abbreviated: "", //简称
        typeId: "", //服务商类型(0.身边云,1.合摩,2.嗨客,3.浪潮,4.北斗)
        province: "", //省
        city: "", //市
        creditCode: "", //信用代码
        contactMailbox: "", //联系邮箱
        tradeDate: "", //营业日期
        tradeTime: "", //营业时间
        serviceCharge: "", //服务费率
        remark: "", //备注
        startWeek: "",
        endWeek: "",
        startTime: "",
        endTime: "",
      },
      weekList: [
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
        "星期日",
      ], // 服务时间
    };
  },
  mounted() {
    if (this.editId) {
      this.onload();
    }
  },
  methods: {
    onload() {
      getServiceProviderInfo({ id: this.editId }).then((res) => {
        this.detailInfo = res.data || {};
        this.timeFun(this.detailInfo);
      });
    },
    timeFun(obj) {
      Assign(this.form, obj);
      this.form.startWeek = this.form.tradeDate.split(",")[0];
      this.form.endWeek = this.form.tradeDate.split(",")[1];
      this.form.startTime = this.form.tradeTime.split(",")[0];
      this.form.endTime = this.form.tradeTime.split(",")[1];
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