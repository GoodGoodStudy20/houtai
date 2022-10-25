<template>
  <div>
    <div class="form-title">发票信息</div>
    <!-- 基础信息 -->
    <div class="basic-info-container">
      <h3 class="basic-info">开票要求</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1">
            编号：<span class="col-text">{{ detailInfo.number }}</span>
          </div>
          <div class="grid-content1">
            开票类型：<span class="col-text">{{
              InvoiceListType[detailInfo.type] && InvoiceListType[detailInfo.invoicingType].label
            }}</span>
          </div>
          <div class="grid-content1" v-if="detailInfo.invoicingType==1">
            作废规则：<span class="col-text">{{
              detailInfo.voidRule==1?'部分作废':'全部作废'
            }}</span>
          </div>

          <div class="grid-content1" v-if="detailInfo.invoicingType==2">
            冲红规则：<span class="col-text">{{
              detailInfo.voidRule==1?'部分冲红':'全部冲红'
            }}</span>
          </div>
          <div class="grid-content1" v-if="detailInfo.invoicingType==2">
            正数开票编号：<span class="col-text">{{
              detailInfo.invoiceNumber
            }}</span>
          </div>
          <div class="grid-content1" v-if="detailInfo.invoicingType !=0 && detailInfo.voidRule==1">
            正数发票号码：
            <el-tooltip effect="dark" :content="invoicingCode" placement="top-start">
              <span class="col-text brak">{{
              invoicingCode
            }}</span>
            </el-tooltip>
          </div>

          <!-- <div class="grid-content1" v-if="detailInfo.invoicingType==2">
            正数发票号码：<span class="col-text">{{
              invoicingCode
            }}</span>
          </div> -->
          <div class="grid-content1">
            客户：<span class="col-text">{{
             detailInfo.customerVo && detailInfo.customerVo.abbreviated
            }}</span>
          </div>
          <div class="grid-content1">
            渠道：<span class="col-text">{{
             detailInfo.customerChannelVo && detailInfo.customerChannelVo.name
            }}</span>
          </div>
          <div class="grid-content1">
            发票类型：<span class="col-text" v-if="InvoiceTypeList[detailInfo.type]">{{ InvoiceTypeList[detailInfo.type].label }}</span>
          </div>

          <div class="grid-content1">
            开票科目：<span class="col-text">{{
              detailInfo.invoicingContent
            }}</span>
          </div>
          <div class="grid-content1">
            {{detailInfo.invoicingType ==1?'作废':detailInfo.invoicingType ==2?'冲红':'开票'}}金额（元）：<span class="col-text">{{
              detailInfo.invoicingAmount || 0 | toThousands
            }}</span>
          </div>
          <div class="grid-content1">
            税率（%）：<span class="col-text">{{ detailInfo.taxRate }}</span>
          </div>

          <div class="" style="display: block">
            开票主体：
            <span class="col-text" v-for="(item, index) in detailInfo.subjectVoList" :key="index">
              {{ item.abbreviated || 0 }}
            </span>
          </div>
          <div class="grid-content2" style="width: 100%; margin-top: 20px">
            <span class="mmw"> {{detailInfo.invoicingType !=0 ?'原因/':''}}备注：</span>
            <span class="col-text">{{ detailInfo.remark || "--" }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="basic-info-container">
      <h3 class="basic-info">业务信息</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1" v-if="InvoiceType[detailInfo.invoicingNature]">
            发票种类：<span class="col-text">{{ InvoiceType[detailInfo.invoicingNature].label }}</span>
          </div>
          <!-- <div class="grid-content1" v-if="detailInfo.invoicingNature===0">
            关联签报号：<span class="col-text">{{ demandNumber }}</span>
          </div>
          <div class="grid-content1" v-if="detailInfo.invoicingNature===0">
            关联客户名称：<span class="col-text">{{ demandCustomer }}</span>
          </div>
          <div class="grid-content1" v-if="detailInfo.invoicingNature===0">
            委托经营所得：<span class="col-text">{{ income }}</span>
          </div> -->
          <div class="grid-content1" v-if="detailInfo.invoicingNature===1 && detailInfo.contractVoList && detailInfo.contractVoList.length > 0">
            合同编号：<span class="col-text">{{ contractNumber }}</span>
          </div>
          <div class="grid-content1" v-if="detailInfo.invoicingNature===1">
            预计回款日期：<span class="col-text">{{
              detailInfo.estimateReturnMoneyDate
            }}</span>
          </div>
        </div>
        <div v-if="detailInfo.invoicingNature===0 && detailInfo.invoicingType==0 && demandDataList && demandDataList.length>0">
          <ChooseDemandDetail ref="demand1" :selectList="selectList" :type="'showInfo'"></ChooseDemandDetail>
        </div>
      </div>
    </div>
    <!-- >结算清单(盖章文件) -->
    <!-- <div class="basic-info-container" v-if="detailInfo.invoicingType==0">
      <h3 class="basic-info">结算清单(盖章文件)</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1">
            <UploadFile v-model="sealDetailedListFile" disabled />
          </div>
        </div>
      </div>
    </div> -->
    <div class="basic-info-container" v-if="detailInfo.invoicingType==0">
      <h3 class="basic-info file-info">附件信息</h3>
      <div class="business-outer-container">
        <div class="business-container2b">
          <span class="sb-title">合同</span>
          <FileType :fileList="contractFile"></FileType>
        </div>
        <div class="business-container2b">
          <span class="sb-title">结算清单</span>
          <FileType :fileList="settlementDetailedFile"></FileType>
        </div>
        <div class="business-container2b">
          <span class="sb-title">服务清单</span>
          <FileType :fileList="serviceDetailedFile"></FileType>
        </div>
      </div>
    </div>
    <!-- 开票详情 -->
    <div class="basic-info-container" v-show="showPayment && detailInfo.invoicingType !=1">
      <h3 class="basic-info">开票详情</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <Form6 ref="form6" :editType="editType" :disabled="disabledPayment" />
        </div>
      </div>
    </div>
    <div class="basic-info-container" v-if="!showPayment && invoiceFileVoLists && invoiceFileVoLists.length>0 && detailInfo.invoicingType !=1">
      <h3 class="basic-info">开票详情</h3>
      <div class="basic-info-content">
        <el-table :data="invoiceFileVoLists" show-summary :summary-method="getSummaries" max-height="700px" :header-cell-style="{ 'background-color': '#F4F8FF' }">
          <el-table-column label="序号" type="index" align="left" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="开票时间" align="left" prop="invoicingDate" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="发票号码" prop="invoicingCode" align="left" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="金额" prop="invoicingAmount" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.invoicingAmount || 0 | toThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column label="税额" prop="invoicingTaxAmount" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.invoicingTaxAmount || 0 | toThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column label="税价合计" prop="priceTaxTotal" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.priceTaxTotal || 0 | toThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column label="发票文件" prop="amount" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="invoice-file" style="color:#409eff">
                <i class="el-icon-document"></i><span @click="filePreviewImg(scope.row.invoiceFile[0])">发票</span></span>
            </template>
          </el-table-column>
          <el-table-column label="发票状态" prop="amount" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag :type="scope.row.invoicingStatus==1?'warning':'primary'" size="mini">{{scope.row.invoicingStatus==1?'作废':'正常'}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div style="display:flex;justify-content:center">
          <el-pagination layout="total, prev, pager, next,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" background :page-size="form1.pageSize" :current-page="form1.pageNum" :total="total"></el-pagination>
        </div>
      </div>
    </div>
    <div class="basic-info-container" v-show="detailInfo.invoicingType==1">
      <h3 class="basic-info">作废发票详情</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <Form11 ref="form11" :editType="editType" :disabled="disabledPayment" />
        </div>
      </div>
    </div>
    <!-- 客户发票信息 customerVo.invoiceVo -->
    <div class="basic-info-container" v-if="
        customerId && detailInfo.customerVo && detailInfo.customerVo.invoiceVo
      ">
      <h3 class="basic-info">客户开票信息</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1">
            公司名称：<span class="col-text">{{
              detailInfo.customerVo.invoiceVo.name
            }}</span>
          </div>
          <div class="grid-content1">
            税号：<span class="col-text">{{
              detailInfo.customerVo.invoiceVo.dutyParagraph
            }}</span>
          </div>
          <div class="grid-content1">
            注册地址：<span class="col-text">{{
              detailInfo.customerVo.invoiceVo.registeredAddress
            }}</span>
          </div>
          <div class="grid-content1">
            账号：<span class="col-text">{{
              detailInfo.customerVo.invoiceVo.account
            }}</span>
          </div>
          <div class="grid-content1">
            开户行：<span class="col-text">{{
              detailInfo.customerVo.invoiceVo.openingBank
            }}</span>
          </div>
          <div class="grid-content1">
            电话：<span class="col-text">{{
              detailInfo.customerVo.invoiceVo.phone
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 物流信息 -->
    <div class="basic-info-container" v-if="showForm4 && isShow">
      <h3 class="basic-info">邮寄信息</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <div class="grid-content1">
            收货人：<span class="col-text">{{
              detailInfo.recipient || "--"
            }}</span>
          </div>
          <div class="grid-content1">
            收货电话：<span class="col-text">{{
              detailInfo.recipientPhone || "--"
            }}</span>
          </div>
          <div class="grid-content1">
            收货地址：<span class="col-text">{{
              detailInfo.recipientAddress || "--"
            }}</span>
          </div>
          <div class="grid-content1">
            物流单号：<span class="col-text">{{
              detailInfo.logisticsOrderNo || "--"
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 回款信息 invoiceReturnMoneyRecordVoList -->
    <div class="basic-info-container" v-if="editType == 'show' && list && list.length>0 && detailInfo.approvalStatus == 2 && detailInfo.invoicingType ==0">
      <h3 class="basic-info">回款信息</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <Form5 :list="list" />
        </div>
      </div>
    </div>
    <div class="basic-info-container" v-if="editType == 'show' && invoiceReturnMoneyRecordVoList && invoiceReturnMoneyRecordVoList.length>0 && detailInfo.approvalStatus == 2 && detailInfo.invoicingType ==0">
      <!-- <div class="basic-info-container"> -->
      <h3 class="basic-info">到账信息</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <Form12 :list="invoiceReturnMoneyRecordVoList" />
        </div>
      </div>
    </div>
    <!-- 流程 -->
    <div class="basic-info-container">
      <h3 class="basic-info">流程</h3>
      <div class="basic-info-content">
        <div class="df-fw">
          <ProcessForm ref="form8" disabled type="2" />
        </div>
      </div>
    </div>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" v-debounce="submitBack" v-if="!disabled || showIssue == 1">保存返回</el-button>
      <el-button type="primary" v-debounce="submitTo" v-if="!disabled">提交</el-button>
      <el-button type="primary" v-debounce="approveClick" v-if="editType == 'approve' && showIssue == 0">审批</el-button>
      <el-button type="danger" @click="returnClick" v-if="editType == 'approve'">退回</el-button>
    </div>
    <el-image-viewer v-if="dialogVisibleImg" :on-close="onClose" :url-list="[dialogImageUrl]" :zIndex="20060" />
    <el-dialog title="文件预览" :fullscreen="true" :visible.sync="dialogVisibleFile" width="100%" top="0" :before-close="handleClose">
      <iframe v-if="dialogVisibleFile" id="bi_iframe" :src="fileUrl" class="bi_iframe" frameborder="0" scrolling="auto" @load="adjustIframe" width="100%">
      </iframe>
      <span slot="footer" class="dialog-footer">
        <span>可能因为网络波动导致加载过慢，请稍后；加载失败，请刷新或下载&nbsp;&nbsp;</span>
        <el-button type="primary" @click="onDownload(itemFile)">下 载<i class="el-icon-download el-icon--right"></i></el-button>
        <el-button type="primary" @click="qp">{{
          screenFull ? "全 屏" : "恢 复"
        }}</el-button>
        <el-button type="primary" @click="fileUrl = fileUrl + '&a=1'">刷新</el-button>
        <el-button type="primary" @click="close">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- <el-image-viewer v-if="dialogVisibleImg" :on-close="onClose" :url-list="[dialogImageUrl]" :zIndex="20060" /> -->
    <ApproveDialog v-model="showDialog" v-if="showDialog" :idData="idData" :type="2" :relationshipId="editId" @success="approveSuccess" :showIssue="showIssue" />
    <ReturnDialog v-model="showReturnDialog" v-if="showReturnDialog" :approvalProcessVoList="detailInfo.approvalProcessVoList" :idData="idData" :type="2" :relationshipId="editId" @success="returnApproveSuccess" :showIssue="showIssue" />
  </div>
</template>

<script>
import Form5 from "./Form5";
import Form6 from "./Form6";
import Form11 from "./Form11";
import Form12 from "./Form12";
import ChooseDemandDetail from "./ChooseDemandDetail";
import ProcessForm from "../../components/ProcessForm";
// import ChooseCustomer from "@/components/ChooseCustomer/index.vue";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import UploadFile from "@/components/UploadFile/index.vue";
import FileType from "@/components/FileType/index.vue";
import ScreenFull from "screenfull/dist/screenfull";
import { baseURL } from "@/api/http";
// import ChooseUser from "@/components/ChooseUser/index.vue";
// import UploadImgDistinguish from "@/components/UploadImgDistinguish/index.vue";
import ApproveDialog from "../../components/ApproveDialog";
import ReturnDialog from "../../components/ReturnDialog";
import { Assign, NumberAdd } from '@/utils/index.js'
import {
  updateApproval,
  updateInvoiceApproval,
  getInvoiceApprovalInfo,
  updateIsRead,
  getSubjectList,
  getInvoiceFilePage,
  getDemandApprovalById,
  getReturnApprovalById
} from "@/api/index.js";
import { InvoiceType, InvoiceTypeList } from "@/utils/field.js";
export default {
  components: {
    // ChooseCustomer,
    ElImageViewer,
    UploadFile,
    Form5,
    Form6,
    Form11,
    Form12,
    ProcessForm,
    // ChooseUser,
    // UploadImgDistinguish,
    ApproveDialog,
    ReturnDialog,
    ChooseDemandDetail,
    FileType
  },
  props: ["value", "editId", "editType"],
  data() {
    return {
      showReturnDialog: false,
      showForm4: false,
      list: [

      ],
      showDialog: false,
      form: {},
      idData: {},
      customerId: "",
      detailInfo: { customerChannelVo: {}, customerVo: {} },
      InvoiceTypeList: InvoiceTypeList, // 发票类型
      InvoiceType: InvoiceType, // 发票种类
      subjectList: [], // 开票主体
      settlementDetailedFile: [], // 结算清单(盖章文件)
      contractFile: [], // 结算清单(盖章文件)
      serviceDetailedFile: [], // 结算清单(盖章文件)
      InvoiceListType: [
        {
          label: '正数发票',
          value: 0
        },
        {
          label: '作废发票',
          value: 1
        },
        {
          label: '冲红发票',
          value: 2
        },
      ],
      demandNumber: '',
      demandCustomer: '',
      income: '',
      contractNumber: '',
      invoicingCode: [],
      total: 0,
      invoiceFileVoLists: [],
      form1: {
        pageNum: 1,          //页码
        pageSize: 10,          //每页条数
        // isPage: 1,
        invoiceId: ''
      },
      dialogVisibleImg: false,
      dialogImageUrl: "", // 图片路径
      sumPriceTaxTotal: '',//发票合计金额
      selectList: [],
      invoiceFileListId: '',
      invoiceReturnMoneyRecordVoList: [],
      demandDataList: [],
      dialogVisibleFile: false,
      screenFull: true,
      itemFile: ''
    };
  },
  watch: {
    "form.type"(val) {
      if (val || val == 0) {
        this.getSubjectList();
      }
    },
  },
  computed: {
    isShow() {
      return this.editType !== 'tovoid' && this.editType !== 'flushRed'
    },
    disabled() {
      return this.editType == "show" || this.editType == "approve";
    },
    showPayment() {
      let show = false;
      // this.$nextTick(() => {
      if (this.editType == "approve") {
        let user = JSON.parse(sessionStorage.getItem("user"));
        let item = this.form.approvalProcessVoList
          ? this.form.approvalProcessVoList.find((item) => {
            return (
              item.approvalId == user.id &&
              (item.operationType == 0 || item.operationType == 2)
            );
          })
          : {};
        show = !!item.isUpdate;
      }
      // if (
      //   this.editType == "show" &&
      //   this.form.invoiceFileVoList &&
      //   this.form.invoiceFileVoList.length > 0
      // ) {
      //   show = true;
      // }
      // });
      return show;
    },
    disabledPayment() {
      let disabled = true;
      if (this.editType == "approve") {
        let user = JSON.parse(sessionStorage.getItem("user"));
        let item = this.form.approvalProcessVoList
          ? this.form.approvalProcessVoList.find((item) => {
            return (
              item.approvalId == user.id &&
              (item.operationType == 0 || item.operationType == 2)
            );
          })
          : {};
        disabled = !item.isUpdate;
      }
      return disabled;
    },
    showIssue() {
      let show = 0; //审批
      if (this.editType == "approve") {
        let user = JSON.parse(sessionStorage.getItem("user"));
        let item = this.form.approvalProcessVoList
          ? this.form.approvalProcessVoList.find((item) => {
            return (
              item.approvalId == user.id &&
              (item.operationType == 0 || item.operationType == 2)
            );
          })
          : {};
        show = item.operationType;
      }
      return show;
    },
  },
  mounted() {
    if (this.editId) {
      this.onload();
      this.getReturnApprovalById()
    }
  },
  methods: {
    onDownload(item) {
      let data = {
        fileName: item.name.split('.')[0],
        fileUrl: item.url
      }
      let paramList = []
      for (let i in data) {
        paramList.push(`${i}=${data[i]}`)
      }
      let aurl = `${baseURL}/cii-system/uploadFile/getFile?${paramList.join('&')}`
      const a = document.createElement('a');
      a.style.display = 'none';
      a.download = item.name;
      a.href = aurl;
      document.body.appendChild(a);
      a.click();  // 自动触发点击a标签的click事件
      document.body.removeChild(a);
    },
    close() {
      this.dialogVisibleFile = false;
      if (this.screenFull) return;
      this.qp();
    },
    adjustIframe() {
      this.$nextTick(() => {
        let ifm = document.getElementById("bi_iframe");
        ifm.height = document.documentElement.clientHeight - 100;
      });
    },
    qp() {
      this.$nextTick(() => {
        let ifm = document.getElementById("bi_iframe");
        ScreenFull.toggle();
        this.screenFull = ScreenFull.isFullscreen; // false 全屏
        if (!this.screenFull) {
          // 全屏
          this.dialogWidth = "100%";
          ifm.height = document.documentElement.clientHeight + 20;
        } else {
          this.dialogWidth = "70%";
          ifm.height = document.documentElement.clientHeight - 220;
        }
      });
    },
    // 预览文件
    filePreview(file) {
      this.itemFile = file
      if (file && this.fileType(file.url).indexOf(".pdf") > -1) {
        this.fileUrl = file.url;
      } else if (file && this.fileType(file.url).indexOf(".ofd") > -1) {
        this.fileUrl = "https://view.xdocin.com/view?src=" + file.url;
      }
      else {
        let routeUrl = file.url;
        let url = encodeURIComponent(routeUrl);
        this.fileUrl =
          "https://view.officeapps.live.com/op/view.aspx?src=" + url;

      }
      this.dialogVisibleFile = true;
      // window.open(this.fileUrl, "_target"); 在浏览器打开
    },
    fileType(file) {
      if (file) {
        if (file.indexOf("?") != -1) {
          file = file.slice(0, file.indexOf("?")).toLowerCase();
        }
        return file;
      }
    },
    // 文件关闭
    handleClose() {
      this.dialogVisibleFile = false;
      if (this.screenFull) return;
      this.qp();
    },
    //发票文件合计行
    getSummaries(param) {
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 2) {
          sums[index] = "合计";
          return;
        }
        // if (index === 3) {
        //   sums[index] = this.$options.filters.toThousands(NumberAdd(this.invoiceFileVoLists.map(item => item.invoicingAmount))) || 0
        // }
        // if (index === 4) {
        //   sums[index] = this.$options.filters.toThousands(NumberAdd(this.invoiceFileVoLists.map(item => item.invoicingTaxAmount))) || 0
        // }
        if (index === 5) {
          sums[index] = this.$options.filters.toThousands(this.sumPriceTaxTotal) || 0
        }
      });
      return sums;
    },
    filePreviewImg(url) {
      if (url) {
        if (url.name.indexOf(".pdf") > -1 || url.name.indexOf(".ofd") > -1) {
          this.filePreview(url)
        } else {
          this.dialogImageUrl = url.url;
          this.dialogVisibleImg = true;
        }
      }
    },
    getReturnApprovalById() {
      getReturnApprovalById({ id: this.editId }).then(res => {
        this.invoiceReturnMoneyRecordVoList = res.data
        this.invoiceReturnMoneyRecordVoList.forEach((item) => {
          try {
            if (item.returnMoneyApprovalVo) {
              item.returnMoneyApprovalVo.arrivalReceiptFile = JSON.parse(item.returnMoneyApprovalVo.arrivalReceiptFile);
            }
          } catch (error) { }
        });
      })
    },
    // 图片关闭
    onClose() {
      this.dialogVisibleImg = false;
    },
    //获取发票文件
    getInvoiceFilePage() {
      getInvoiceFilePage(this.form1).then(res => {
        if (res.code != 200) return
        this.invoiceFileVoLists = res.data.invoiceFileVoIPage.records
        this.sumPriceTaxTotal = res.data.sumPriceTaxTotal
        this.total = res.data.invoiceFileVoIPage.total
        this.invoiceFileVoLists.forEach((item) => {
          try {
            item.invoiceFile = JSON.parse(item.invoiceFile);
          } catch (error) { }
        });
        // if (this.invoiceFileVoLists && this.invoiceFileVoLists.length > 0) {
        //   // this.priceTaxTotal = NumberAdd(this.detailInfo.invoiceFileVoLists.map(item => item.priceTaxTotal))
        //   this.invoiceFileVoLists.forEach(item => {
        //     this.invoicingCode.push(item.invoicingCode)
        //   })
        //   this.invoicingCode = String(this.invoicingCode)
        //   // this.priceTaxTotal=invoicingCode
        // }
      })
    },
    //修改已读
    readUpdate(data) {
      updateIsRead(data).then((res) => {
        console.log(res);
      });
    },
    // 开票主体
    getSubjectList(params = {}) {
      getSubjectList({ ...params, type: this.form.type }).then((res) => {
        this.subjectList = res.data;
      });
    },
    // 物流信息是否展示
    typeChange(type) {
      this.showForm4 = [0, 1].includes(type);
    },
    onload() {
      getInvoiceApprovalInfo({ id: this.editId }).then(async (res) => {
        let result = res.data || {};
        this.form = result;
        this.detailInfo = result;
        this.settlementDetailedFile = JSON.parse(
          this.detailInfo.settlementDetailedFile
        );
        this.contractFile = JSON.parse(
          this.detailInfo.contractFile
        );
        this.serviceDetailedFile = JSON.parse(
          this.detailInfo.serviceDetailedFile
        );
        if (result.invoicingType == 0 && result.invoicingNature == 0 && result.demandApprovalVoList && result.demandApprovalVoList.length > 0) {
          await getDemandApprovalById({ id: result.id }).then(res => {
            if (res.code != 200) return
            let resu = res.data
            this.demandDataList = res.data
            resu.forEach(item => {
              this.$set(item, 'nowReceivableMoney', NumberAdd([item.interestMoney, item.surplusMoney]))
            })
            if (this.detailInfo.invoicingNature === 0 && this.detailInfo.invoicingType == 0) {
              this.$nextTick(() => {
                this.$refs['demand1'].onload(resu)
              })
            }
          })
        }

        this.$nextTick(() => {
          // if (this.detailInfo.demandApprovalVoList && this.detailInfo.demandApprovalVoList.length > 0) {
          //   // this.demandNumber = String(this.detailInfo.demandApprovalVoList.map(item => item.number))
          //   // this.demandCustomer = String(this.detailInfo.demandApprovalVoList.map(item => item.customerVo && item.customerVo.abbreviated))
          //   // this.income = NumberAdd(this.detailInfo.demandApprovalVoList.map(item => item.income))

          //   // this.selectList = this.detailInfo.demandApprovalVoList
          //   this.$refs['demand1'].onload(resu)
          // }
          if (this.detailInfo.contractVoList && this.detailInfo.contractVoList.length > 0) {
            this.contractNumber = String(this.detailInfo.contractVoList.map(item => item.number))
          }
          this.form1.invoiceId = result.id
          this.getInvoiceFilePage()
        })

        if (this.detailInfo.invoiceFileVoList && this.detailInfo.invoiceFileVoList.length > 0) {
          // this.priceTaxTotal = NumberAdd(this.detailInfo.invoiceFileVoLists.map(item => item.priceTaxTotal))
          this.detailInfo.invoiceFileVoList.forEach(item => {
            this.invoicingCode.push(item.invoicingCode)
          })
          this.invoicingCode = String(this.invoicingCode)
          // this.priceTaxTotal=invoicingCode
        }
        // if (this.detailInfo.invoiceFileListId) {
        //   this.invoiceFileListId
        // }

        this.$nextTick(() => {

          if (this.detailInfo.invoicingType == 1) {
            this.$refs["form11"].onload(result); // 流程
          }
          else {
            this.$refs["form6"].onload(result); // 流程
          }
          // if (this.detailInfo.invoicingType == 1) {
          //   this.$refs["form11"].onload(result); // 流程
          // } else {
          //   this.$refs["form6"].onload(result); // 流程

          // }
        })


        this.$refs["form8"].onload(result); // 流程
        // 物流信息是否展示
        this.typeChange(result.type);
        if (result.customerVo && result.customerVo.invoiceVo) {
          this.customerId = result.customerVo.invoiceVo.id;
        }
        this.list = result.invoiceReturnMoneyRecordVoList;
        let user = JSON.parse(sessionStorage.getItem("user"));
        this.idData =
          (result.approvalProcessVoList &&
            result.approvalProcessVoList.find((item) => {
              return (
                item.approvalId == user.id &&
                (item.operationType == 0 || item.operationType == 2)
              );
            })) ||
          {};
        if (this.$route.query.id) {
          if (this.$route.query.state == 1 && this.editType == "show") {
            let isCopyData =
              (result.approvalProcessVoList &&
                result.approvalProcessVoList.find((item) => {
                  return item.approvalId == user.id && item.operationType == 1;
                })) ||
              {};
            let data = {
              id: isCopyData.id,
            };
            this.readUpdate(data);
          }
        }
      });
    },
    handleSizeChange(val) {
      this.form1.pageSize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.form1.pageNum = val
      this.getInvoiceFilePage()
    },
    cancel() {
      if (this.$route.query.id) {
        this.$router.go(-1);
      } else {
        this.$emit("input", 0);
      }
    },
    // 保存返回
    submitBack() {
      this.submit(0, "back");
    },
    // 提交
    submitTo() {
      this.submit(1, "back");
    },
    submit(state, type = 0) {
      let form = this.form1Commit();
      if (!form) return;
      let form4 = this.form4Commit();
      if (this.isShow) {
        let form7 = this.form7Commit();
        if (!form7) return;
      }
      let data = {
        ...form,
        // ...form3,
        ...form4,
        ...form7,
        // addApprovalProcessReqList: form8,
        approvalStatus: state,
      };
      let success = (res) => {
        if (res.code != 200) {
          this.$message.error(res.msg || "操作失败");
          return;
        }
        this.$message.success("操作成功");
        if (type == "back") {
          this.cancel();
        }
      };
      if (this.editType == "approve") {
        data.id = this.editId;
        if (this.detailInfo.invoicingType != 1) {
          let form6 = this.$refs["form6"].commit();
          if (!form6) return;
          data.updateInvoiceFileReqList = form6.InvoiceFileReqList;
          data.invoicingUserId = form6.invoicingUserId;
          data.viceRemark = form6.viceRemark;
          data.invoicingDate = form6.invoicingDate;
          if (form6.InvoiceFileReqList) {
            data.approvalStatus = "";
          }
        }

        updateInvoiceApproval(data).then(success);
      }
    },
    // form1 commit
    form1Commit() {
      // if (!this.$validate("form")) return;
      if (Array.isArray(this.form.subjectListId)) {
        this.form.subjectListId = this.form.subjectListId.join(",");
      }
      let obj = Object.assign({}, this.form);
      return obj;
    },
    // form4 commit
    form4Commit() {
      if (!this.form.contractFile || !this.form.contractFile.length) return;
      let obj = Object.assign({}, this.form);
      obj.contractFile = JSON.stringify(obj.contractFile);
      return obj;
    },

    form7Commit() {
      if (
        !this.form.settlementDetailedFile ||
        !this.form.settlementDetailedFile.length
      ) {
        this.$message.warning("请上传结算清单(盖章文件)");
        return;
      }
      let obj = Object.assign({}, this.form);
      obj.settlementDetailedFile = JSON.stringify(obj.settlementDetailedFile);
      obj.contractFile = JSON.stringify(obj.contractFile);
      obj.serviceDetailedFile = JSON.stringify(obj.serviceDetailedFile);
      return obj;
    },
    // 点击权限弹窗
    approveClick() {
      if (this.showPayment && !this.disabledPayment && this.detailInfo.invoicingType != 1) {
        let form6 = this.$refs["form6"].commit();
        if (!form6) return;
      }
      this.showDialog = true;
    },
    updateApprovalFun(data) {
      let success = (res) => {
        if (res.code == 200) {

          this.$message.success("操作成功");
          this.cancel();
        }
      };
      updateApproval(data).then(success);
    },
    // 权限弹窗
    approveSuccess(data1) {
      if (this.showPayment && !this.disabledPayment) {
        if (this.detailInfo.invoicingType != 1) {
          let form6 = this.$refs["form6"].commit();
          let data = {
            ...form6,
            id: this.editId,
          };
          data.updateInvoiceFileReqList = form6.InvoiceFileReqList;
          data.approvalStatus = "";
          let success = (res) => {
            if (res.code != 200) {
              this.$message.error(res.msg || "操作失败");
              return;
            }
            this.$message.success("操作成功");
            this.updateApprovalFun(data1);
          };
          updateInvoiceApproval(data).then(success);
        } else {
          this.updateApprovalFun(data1);
          // this.cancel();
        }

      } else {
        this.cancel();
        // 
      }
      // if (this.detailInfo.invoicingType == 1) {
      //   this.updateApprovalFun(data1);
      // }
      // else {
      //   
      // }
    },
    // 退回
    returnApproveSuccess() {
      if (this.showPayment && !this.disabledPayment) {
        this.$message.success("操作成功");
        this.cancel();
      } else {
        this.cancel();
      }
    },

    // 退回
    returnClick() {
      this.showReturnDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../../assets/css/common.scss";
.invoice-file {
  color: #409eff;
  cursor: pointer;
  font-weight: 600;
  span {
    margin-left: 5px;
  }
}
//业务凭证
.business-outer-container {
  display: flex;
  flex-wrap: wrap;
  margin: 0 16px;
  .business-container2b {
    width: 25%;
    .sb-title {
      display: block;
      margin: 12px 0 10px 0;
      font-weight: 600;
    }
    .business-item {
      display: flex;
      flex-wrap: wrap;
      cursor: pointer;
      .img-item {
        width: 89px;
        height: 70px;
        margin-left: 18px;
        margin-bottom: 18px;
        .item-content {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #303132;
          &:hover {
            color: #3a7dff;
          }
        }
      }
      .img-item2 {
        width: 64px;
        height: 64px;
        margin: 0 10px;
      }
      .img-item:first-child {
        width: 89px;
        height: 70px;
        margin: 0;
        cursor: pointer;
        .item-content {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #303132;
          &:hover {
            color: #3a7dff;
          }
        }
      }
    }
    .file-data {
      color: #3a7dff;
      font-size: 14px;
      font-weight: 700;
    }
  }
}
::v-deep .el-table__footer-wrapper .el-table__footer tbody tr {
  font-weight: 700;
  background-color: #f4f8ff !important;
}
::v-deep .el-table__footer-wrapper tbody td.el-table__cell {
  background-color: #f4f8ff !important;
}
.bi_iframe {
  height: 80vh;
}
</style>