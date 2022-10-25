<template>
  <!-- detailData.businessType==1?'不垫资':'垫资' -->
  <!-- detailData.isAgent==1?'是':'否' 中介 -->
  <div style="width: 99%; margin: auto">
    <div class="form-title">项目签报详情</div>
    <div class="approve">
      <div class="basic-info-container">
        <h3 class="basic-info">客户信息</h3>
        <div class="basic-info-content">
          <div style="display: flex; flex-wrap: wrap">
            <div v-if="detailData.customerVo" class="grid-content12b">
              客户：<span class="col-text">{{
                detailData.customerVo.abbreviated
              }}</span>
            </div>
            <div v-if="detailData.customerChannelVo" class="grid-content12b">
              渠道：<span class="col-text">{{
                detailData.customerChannelVo.name
              }}</span>
            </div>
            <div class="grid-content12b">
              项目编号：<span class="col-text cur" @click.stop="copyClick">{{ detailData.number }}</span>
            </div>
            <div class="grid-content12b">
              需求日期：<span class="col-text">{{
                detailData.demandDate
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="basic-info-container" v-if="Datalist.length > 0">
        <h3 class="basic-info">产品信息</h3>
        <div class="product-header">
          <el-row :gutter="20" class="rol-content">
            <el-col :span="5" style="padding: 0">
              <div class="grid-content">产品分类</div>
            </el-col>
            <el-col :span="4" style="padding: 0">
              <div class="grid-content">产品名称</div>
            </el-col>
            <el-col :span="4" style="padding: 0">
              <div class="grid-content">产品单价（元）</div>
            </el-col>
            <el-col :span="4" style="padding: 0">
              <div class="grid-content">数量</div>
            </el-col>
            <el-col :span="4" style="padding: 0">
              <div class="grid-content">金额</div>
            </el-col>
          </el-row>
        </div>
        <div class="product-content" v-for="product in Datalist" :key="product.id">
          <el-row :gutter="20" class="rol-content">
            <el-col :span="5" style="padding: 0">
              <div class="grid-content">{{ product.productTypeVo.name }}</div>
            </el-col>
            <el-col :span="4" style="padding: 0">
              <div class="grid-content">{{ product.productVo.name }}</div>
            </el-col>
            <el-col :span="4" style="padding: 0">
              <div class="grid-content">{{ product.price }}</div>
            </el-col>
            <el-col :span="4" style="padding: 0">
              <div class="grid-content">{{ product.quantity }}</div>
            </el-col>
            <el-col :span="4" style="padding: 0">
              <div class="grid-content">{{ product.allPrice }}</div>
            </el-col>
          </el-row>
          <el-divider class="divder-product"></el-divider>
        </div>
      </div>

      <div class="basic-info-container">
        <h3 class="basic-info file-info">附件信息</h3>
        <div class="business-outer-container">
          <div class="business-container2b">
            <span class="sb-title">合同</span>
            <FileType :fileList="contractFileList"></FileType>
          </div>
          <div class="business-container2b">
            <span class="sb-title">结算清单</span>
            <FileType :fileList="settlementDetailedFile"></FileType>
          </div>
          <div class="business-container2b" v-if="serviceDetailedFileList && !serviceDetailedFileList.length>0 && primaryServiceDetailedFile && primaryServiceDetailedFile.length>0">
            <span class="sb-title">服务清单</span>
            <FileType :fileList="primaryServiceDetailedFile"></FileType>
          </div>
          <div class="business-container2b" v-if="paymentDetailedFilePage && !paymentDetailedFilePage.length>0 && primaryIssueDetailedListFile && primaryIssueDetailedListFile.length>0">
            <span class="sb-title">支付清单</span>
            <FileType :fileList="primaryIssueDetailedListFile"></FileType>
          </div>
        </div>
      </div>
      <!-- 服务清单 -->
      <div class="basic-info-container" v-if="serviceDetailedFileList && serviceDetailedFileList.length>0">
        <h3 class="basic-info">服务清单</h3>
        <div style="padding: 0 16px 18px" class="detail">
          <el-table :data="serviceDetailedFileList" max-height="700px" show-summary :summary-method="getSummaries2" :header-cell-style="{ 'background-color': '#F4F8FF' }">
            <el-table-column prop="serviceObject" label="服务对象" align="left" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="serviceDate" label="服务时间" align="left" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="serviceContent" label="服务内容" align="left" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="price" label="单价" align="right" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.price || 0 | toThousands}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" align="center" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="settlementAmount" label="结算金额(元)" align="right" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.settlementAmount || 0 | toThousands}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="display:flex;justify-content:center">
            <el-pagination layout="total, prev, pager, next,sizes" :page-sizes="[5, 10, 50, 100]" @size-change="handleSizeChange2" @current-change="handleCurrentChange2" background :page-size="form2.pageSize" :current-page="form2.pageNum" :total="total2"></el-pagination>
            <el-button style="margin-top:10px;margin-left:50px" size="mini" type="primary" v-if="primaryServiceDetailedFile && primaryServiceDetailedFile.length>0" @click="filePreview(primaryServiceDetailedFile)">查看</el-button>
            <!-- <div style="margin-top:10px" v-show="isShowExport">
              <el-select size="small" v-model="exportType" placeholder="请选择" style="width:150px">
                <el-option label="导出类型" value=""></el-option>
                <el-option label="原附件文件" value="1"></el-option>
                <el-option label="导出列表" value="2"></el-option>
              </el-select>
            </div> -->
            <!-- <el-button v-show="isShowExport && !select" style="margin-top:10px;margin-left:50px" size="mini" type="primary" v-debounce="exportClick" :loading="loading">导出</el-button> -->

          </div>
        </div>
      </div>
      <!-- 支付清单 -->
      <div class="basic-info-container">
        <h3 class="basic-info">支付清单</h3>
        <div style="padding: 0 16px 18px" class="detail" v-if="paymentDetailedFilePage && paymentDetailedFilePage.length>0">
          <el-table :data="paymentDetailedFilePage" max-height="700px" show-summary :summary-method="getSummaries1" :header-cell-style="{ 'background-color': '#F4F8FF' }">
            <el-table-column label="姓名" prop="name" align="left" show-overflow-tooltip>
            </el-table-column>
            <!-- <el-table-column label="性别" align="left" show-overflow-tooltip>
            </el-table-column> -->
            <el-table-column label="手机号" prop="phone" align="left" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="身份证号码" prop="idCode" align="left" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="账号" prop="bankCard" align="left" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="开户行" prop="bankName" align="left" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="金额(元)" prop="amount" align="right" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.amount || 0 | toThousands}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="display:flex;justify-content:center">
            <el-pagination layout="total, prev, pager, next,sizes" :page-sizes="[5, 10, 50, 100]" @size-change="handleSizeChange1" @current-change="handleCurrentChange1" background :page-size="form1.pageSize" :current-page="form1.pageNum" :total="total1"></el-pagination>
            <el-button style="margin-top:10px;margin-left:50px" size="mini" type="primary" @click="exportIssueDetailedFile">导出</el-button>
            <el-button style="margin-top:10px;margin-left:50px" size="mini" type="primary" v-if="primaryIssueDetailedListFile && primaryIssueDetailedListFile.length>0" @click="filePreview(primaryIssueDetailedListFile)">查看</el-button>
            <!-- <div style="margin-top:10px" v-show="isShowExport">
              <el-select size="small" v-model="exportType1" placeholder="请选择" style="width:150px">
                <el-option label="导出类型" value=""></el-option>
                <el-option label="原附件文件" value="1"></el-option>
                <el-option label="导出列表" value="2"></el-option>
              </el-select>
            </div> -->
          </div>
        </div>
        <div v-else>

          <div style="padding:0 10px 15px;">委托经营所得：￥{{detailData.income || 0 | toThousands}}</div>
        </div>
      </div>
      <div class="basic-info-container" v-if="showService">
        <h3 class="basic-info">上游服务商</h3>
        <div class="df-fw" style="padding:0 10px">
          <Form17 ref="form17" :editType="editType" />
        </div>
      </div>
      <div class="basic-info-container" v-show="(editType=='show' || editType=='approve') && (detailData.copeWithAllocation && detailData.serviceId) && !showService && isRoleShow">
        <h3 class="basic-info">上游服务商</h3>

        <div class="basic-info-content">
          <div style="display: flex; flex-wrap: wrap">
            <div class="grid-content12b">
              名称：<span class="col-text">{{
                detailData.serviceProviderVo && detailData.serviceProviderVo.abbreviated
                }}</span>
            </div>
            <div v-if="detailData.copeWithAllocation" class="grid-content12b">
              应付分配比例：<span class="col-text">{{
                  detailData.copeWithAllocation
                }} %</span>
            </div>
            <div class="grid-content12b">
              支付平台：<span class="col-text">{{ detailData.issueType==1?'其他':'九华保' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="basic-info-container" v-if="detailData.businessType == 1">
        <h3 class="basic-info">关联回单详情</h3>
        <div style="padding: 0 16px 18px" class="detail">
          <el-table :data="arrivalReceipt" show-summary :summary-method="getSummaries" max-height="700px" :header-cell-style="{ 'background-color': '#F4F8FF' }">
            <el-table-column label="回单编号" align="left" width="240" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="table-text" @click="openFile(scope.row)" :style="{
                    color:
                      scope.row.status && scope.row.status == 1
                        ? '#ffa814'
                        : '',
                  }">{{ scope.row.number }}</span><span v-if="scope.row.status == 1" style="color: #ffa814">(审批中)</span>
              </template>
            </el-table-column>
            <el-table-column property="customerVo.abbreviated" label="渠道" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="`${
                    (scope.row.customerVo &&
                      scope.row.customerVo.abbreviated) ||
                    scope.row.abbreviated
                  }(${
                    (scope.row.customerChannelVo &&
                      scope.row.customerChannelVo.name) ||
                    scope.row.channelName
                  })`" placement="top-start">
                  <span>{{
                    (scope.row.customerChannelVo &&
                      scope.row.customerChannelVo.name) ||
                    scope.row.channelName
                  }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column property="amount" label="到账金额" align="right">
              <template slot-scope="scope">
                <span v-if="scope.row.amount || scope.row.amount == 0">{{
                  scope.row.amount || 0 | toThousands
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column property="returnMoneyDate" label="到账时间" align="right" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.returnMoneyDate || "--" }}</span>
              </template>
            </el-table-column>
            <el-table-column property="availableMoney" label="可用委托" align="right">
              <template slot-scope="scope">
                <span v-if="
                    scope.row.availableMoney || scope.row.availableMoney == 0
                  ">{{ Number(scope.row.availableMoney) || 0 | toThousands }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column label="已用次数" align="right">
              <template slot="header" slot-scope="">
                <el-tooltip effect="dark" content="已用次数：指之前已用回单次数，不包含本次" placement="top">
                  <span class="explain-fields">已用次数</span>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <el-popover placement="top" offset="100" trigger="click" width="450" v-if="
                    scope.row.availAbleMoneyRecordList &&
                    scope.row.availAbleMoneyRecordList.length > 0
                  ">
                  <el-table :data="scope.row.availAbleMoneyRecordList">
                    <el-table-column width="230" label="签报">
                      <template slot-scope="scope1">
                        <span>{{ scope1.row.number }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column width="100" label="渠道">
                      <template slot-scope="scope1">
                        <span>{{ scope1.row.channelName }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column width="100" align="right" label="已用委托">
                      <template slot-scope="scope1">
                        <span>{{ scope1.row.usedMoney || 0 | toThousands }}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <span style="
                      display: inline-block;
                      padding: 0 20px;
                      color: #3a7dff;
                      cursor: pointer;
                    " slot="reference">{{
                      scope.row.availAbleMoneyRecordList &&
                      scope.row.availAbleMoneyRecordList.length
                        ? scope.row.availAbleMoneyRecordList.length
                        : 0 || "--"
                    }}</span>
                </el-popover>
                <span v-else style="display: inline-block; padding: 0 20px">{{
                  scope.row.availAbleMoneyRecordList &&
                  scope.row.availAbleMoneyRecordList.length
                    ? scope.row.availAbleMoneyRecordList.length
                    : 0 || "--"
                }}</span>
              </template>
            </el-table-column>
            <el-table-column property="arrivalUsedMoney" label="已用委托" align="right">
              <template slot="header" slot-scope="">
                <el-tooltip effect="dark" content="已用委托：指之前已用委托金额，不含本次申请金额" placement="top">
                  <span class="explain-fields">已用委托</span>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <span>{{
                  scope.row.arrivalUsedMoney ||
                  scope.row.usedMoney || 0 | toThousands
                }}</span>
              </template>
            </el-table-column>
            <el-table-column property="currentUsedMoney" label="本次申请" align="right">
              <template slot-scope="scope">
                <span v-if="
                    scope.row.currentUsedMoney ||
                    scope.row.currentUsedMoney == 0
                  ">{{ scope.row.currentUsedMoney || 0 | toThousands }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column property="surplusAvailableMoney" label="剩余委托" align="right">
              <template slot="header" slot-scope="">
                <el-tooltip effect="dark" content="剩余委托：指冻结本次申请金额后剩余可用委托" placement="top">
                  <span class="explain-fields">剩余委托</span>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <span v-if="
                    scope.row.surplusAvailableMoney ||
                    scope.row.surplusAvailableMoney == 0
                  ">{{
                    Number(scope.row.surplusAvailableMoney) || 0 | toThousands
                  }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="basic-info-content basic-info-content1" style="margin-top:20px">
            <div style="display: flex; flex-wrap: wrap">
              <div class="grid-content12b">
                <div>
                  <span style="font-weight: 600">服务费率：</span>
                  <span class="col-text">{{detailData.businessType == 0 ?`${detailData.serviceCharge || 0} (${detailData.interestFreeDays || 0})+${detailData.ratio || 0}`:detailData.serviceCharge}}</span>
                </div>
              </div>
              <div class="grid-content12b" v-if="detailData.isAgent==1">
                <span style="font-weight: 600">代理费率：</span>
                <span class="col-text">{{`${detailData.agentServiceCharge || 0} (${detailData.agentInterestFreeDays || 0})+${detailData.agentRatio || 0}`}}</span>
              </div>
              <div class="grid-content12b" v-if="detailData.businessType==1 && detailData.advancesMoney">
                <span style="font-weight: 600">垫付金额：</span>
                <span class="col-text">{{detailData.advancesMoney || 0}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 垫资 -->
      <div class="basic-info-container" v-if="detailData.businessType == 0">
        <h3 class="basic-info">垫资情况</h3>
        <div class="basic-info-content">
          <div style="display: flex; flex-wrap: wrap">
            <div class="grid-content12b">
              <span style="font-weight: 600">应收：￥{{detailData.receivableMoney || 0 | toThousands}}</span>
            </div>
            <div class="grid-content12b">
              <span style="font-weight: 600"> 预计回款日期：{{detailData.estimateArrivalDate}}</span>
            </div>
            <div class="grid-content12b">
              <span style="font-weight: 600">服务费率：{{detailData.businessType == 0 ?`${detailData.serviceCharge} (${detailData.interestFreeDays})+${detailData.ratio}`:detailData.serviceCharge}}</span>
            </div>
            <div class="grid-content12b" v-if="detailData.isAgent==1">
              <span style="font-weight: 600">代理费率：</span>
              <span class="col-text">{{`${detailData.agentServiceCharge} (${detailData.agentInterestFreeDays})+${detailData.agentRatio}`}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="basic-info-container" v-if="(screenshot && screenshot.length>0) || (determineFile && determineFile.length>0)">
        <h3 class="basic-info file-info">确权文件</h3>
        <div class="screenshot">
          <el-image class="img-item2" v-for="item in screenshot" :key="item" :src="item" :preview-src-list="[item]"></el-image>
        </div>
        <FileType :fileList="determineFile"></FileType>
      </div>
      <!-- 付款信息审批办理 -->
      <!-- <div class="basic-info-container" v-if="editType == 'approve' && showPayment">
        <h3 class="basic-info">付款信息</h3>
        <PaymentInformation class="payment-information" ref="paymentForm" :showTime="true" :disabled="disabledPayment"></PaymentInformation>
      </div> -->
      <!-- 内部往来审批办理 -->
      <!-- <div class="basic-info-container" v-if="editType == 'approve' && showPayment">
        <h3 class="basic-info">内部往来</h3>
        <InsideIntercourse class="payment-information" ref="insideForm" :disabled="disabledPayment"></InsideIntercourse>
      </div> -->
      <div class="basic-info-container">
        <h3 class="basic-info">审批流程</h3>
        <div class="basic-info-content">
          <ProcessForm ref="processform" :disabled="true"></ProcessForm>
        </div>
      </div>
    </div>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" @click="approveClick" v-if="editType == 'approve' && showIssue == 0">审批</el-button>
      <el-button type="primary" @click="approveClick" v-if="editType == 'approve' && showIssue == 1">办理</el-button>
      <el-button type="primary" @click="approveClick" v-if="editType == 'approve' && showIssue == 2">确认下发</el-button>
      <el-button type="danger" @click="returnClick" v-if="editType == 'approve'">退回</el-button>
    </div>
    <ApproveDialog v-model="showDialog" v-if="showDialog" :idData="idData" :type="0" :relationshipId="editId" @success="approveSuccess" :showIssue="showIssue"></ApproveDialog>
    <ReturnDialog v-model="showReturnDialog" v-if="showReturnDialog" :approvalProcessVoList="detailData.approvalProcessVoList" :idData="idData" :type="0" :relationshipId="editId" @success="approveSuccess" :showIssue="showIssue"></ReturnDialog>
    <ReceiptUseDetails v-model="showReceipDialog" v-if="showReceipDialog" :returnMoneyApprovalList="returnMoneyApprovalList"></ReceiptUseDetails>

    <el-image-viewer v-if="dialogVisible" :on-close="onClose" :url-list="[dialogImageUrl]" :zIndex="20060" />
    <div id="main"></div>
    <el-dialog title="文件预览" :visible.sync="dialogVisibleFile" width="100%" top="0" :fullscreen="true" :before-close="handleClose">
      <iframe v-if="dialogVisibleFile" id="bi_iframe" class="bi_iframe2" :src="fileUrl" frameborder="0" scrolling="auto" @load="adjustIframe" width="100%">
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
  </div>
</template>
<script>
import {
  getDemandApprovalInfo,
  addPaymentApproval,
  updatePaymentApproval,
  getReturnMoneyApprovalById,
  updateIsRead,
  getReturnMoneyApprovalByCustomerId,
  getServiceDetailedFilePage,
  getPaymentDetailedFilePage,
  updateDemandApproval,
  updateApproval,
  getApprovalProcessLogList
} from "@/api/index.js";
import ScreenFull from "screenfull/dist/screenfull";
import { baseURL } from "@/api/http";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import ProcessForm from "../../components/ProcessForm";
import ApproveDialog from "../../components/ApproveDialog";
import ReturnDialog from "../../components/ReturnDialog";
import Form17 from "./Form17";
import ReceiptUseDetails from "./ReceiptUseDetails";
import FileType from "@/components/FileType";
import { NumberSub, NumberAdd, NumberMul } from "@/utils/index.js";
export default {
  name: "ShowDetail",
  components: {
    ProcessForm,
    ApproveDialog,
    FileType,
    ElImageViewer,
    ReturnDialog,
    ReceiptUseDetails,
    Form17
  },

  props: ["value", "editId", "editType"],
  data() {
    return {
      gridData: [],
      Datalist: [],
      showDialog: false,
      showReturnDialog: false,
      showReceipDialog: false,
      form: {},
      detailData: { customerVo: {} }, //详情数据对象
      businessTypelist: "", //资方
      contractFileList: [], //业务合同
      issueDetailedFile: [], //支付清单
      settlementDetailedFile: [], //结算清单
      approvalProcessVoList: [], //流程
      // dialogTableVisible: false,
      // gridData: [],
      screenshot: [], //确权文件记录
      determineFile: [],//其他文件
      // determineFile2: [], //确权文件
      moneySum: 0, //支付委托经营所得金额
      moneySum2: 0, //支付服务商金额,
      dialogVisible: false, //图片弹窗
      dialogImageUrl: "",
      idData: {},
      maps: new Map(),
      moneyList: [],
      returnMoneyApprovalList: [],
      submitTime: "",
      serviceDetailedFileList: [], // 服务清单
      paymentDetailedFilePage: [], // 支付清单
      total1: 0,
      total2: 0,
      form1: {
        pageNum: 1,
        pageSize: 5,
        isPage: 1,
        demandId: this.editId,
      },
      form2: {
        pageNum: 1,
        pageSize: 5,
        isPage: 1,
        demandId: this.editId,
      },
      exportType: '',//服务清单导出类型
      exportType1: '',//支付清单导出类型
      primaryServiceDetailedFile: [],
      primaryIssueDetailedListFile: [],
      serviceSumAmount: '',
      paymentSumAmount: '',
      dialogVisibleFile: false, // 文件弹窗
      fileUrl: '',
      screenFull: true,
      dialogWidth: "70%",
      arrivalReceipt: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$bus.$on("refundAmount", (res) => {
        this.refundAmount = res;
      });
      this.onload();
      this.getServiceDetailedFilePageFun();
      this.getPaymentDetailedFilePageFun();
    });

  },
  methods: {
    exportIssueDetailedFile() {
      let data = JSON.parse(this.detailData.issueDetailedFile) || []
      console.log(data[0].url);
      // return
      const link = document.createElement('a');
      // 创建url对象
      if (data && data[0]) {
        // const objectUrl = new Blob([data[0].url])
        link.style.display = 'none';

        link.href = data[0].url
        link.download = data[0].name;
        document.body.appendChild(link);
        link.click();
        // 适当释放url
        document.body.removeChild(link) // 释放标签
      }
    },
    // 复制信息
    copyClick() {
      let input = document.createElement("textarea");
      input.value = this.detailData.number
      document.body.appendChild(input);
      input.select(); // 选中文本
      document.execCommand("copy"); // 执行浏览器复制命令
      document.body.removeChild(input);
      this.$message.success("复制成功");
    },
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
      this.itemFile = file[0];
      if (file && file[0] && this.fileType(file[0].url).indexOf(".pdf") > -1) {
        this.fileUrl = file[0] && file[0].url;
        this.dialogVisibleFile = true;
      } else if (file && file[0] && (this.fileType(file[0].url).indexOf(".png") > -1 || this.fileType(file[0].url).indexOf(".jpg") > -1) | this.fileType(file[0].url).indexOf(".svg") > -1) {
        this.filePreviewImg(file[0])
      }
      else {
        let routeUrl = file && file[0] && file[0].url;
        let url = encodeURIComponent(routeUrl);
        this.fileUrl =
          "https://view.officeapps.live.com/op/view.aspx?src=" + url;
        this.dialogVisibleFile = true;
      }

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
    filePreviewImg(url) {
      if (url) {
        this.dialogImageUrl = url.url;
        this.dialogVisible = true;
      }
    },
    // 图片关闭
    onClose() {
      this.dialogVisible = false;
    },
    // 文件关闭
    handleClose() {
      this.dialogVisibleFile = false;
      if (this.screenFull) return;
      this.qp();
    },
    exportClick() {
      if (this.primaryServiceDetailedFile.length > 0) {
        var main = document.getElementById("main");
        this.primaryServiceDetailedFile.forEach((item, index) => {
          let data = {
            fileName: item.name.split('.')[0],
            fileUrl: item.url
          }
          let paramList = []
          for (let i in data) {
            paramList.push(`${i}=${data[i]}`)
          }
          let aurl = `${baseURL}/cii-system/uploadFile/getFile?${paramList.join('&')}`
          var timer1 = setTimeout(function (aurl) {
            return function () {
              //定义一个看不见的iframe
              const iframe = document.createElement("iframe");
              iframe.style.display = "none"; // 防止影响页面设置不可见
              iframe.style.height = "0"; // 防止影响页面高度设置为0
              iframe.src = aurl;//下载地址
              main.appendChild(iframe);// 这一行必须，iframe挂在到dom树上才会发请求
              var timer2 = setTimeout(function () {
                iframe.remove();
                clearTimeout(timer2)
              }, 5000)  //这个就根据实际情况定义一下延时删除添加的iframe,不删除也问题不大
              clearTimeout(timer1);
            }
          }(aurl), 1000 * index)

        })
      } else {
        this.$message.error('未上传服务清单原文件')
      }
    },
    exportClick2() {
      if (this.primaryIssueDetailedListFile.length > 0) {
        var main = document.getElementById("main");
        this.primaryIssueDetailedListFile.forEach((item, index) => {
          let data = {
            fileName: item.name.split('.')[0],
            fileUrl: item.url
          }
          let paramList = []
          for (let i in data) {
            paramList.push(`${i}=${data[i]}`)
          }
          let aurl = `${baseURL}/cii-system/uploadFile/getFile?${paramList.join('&')}`
          var timer1 = setTimeout(function (aurl) {
            return function () {
              //定义一个看不见的iframe
              const iframe = document.createElement("iframe");
              iframe.style.display = "none"; // 防止影响页面设置不可见
              iframe.style.height = "0"; // 防止影响页面高度设置为0
              iframe.src = aurl;//下载地址
              main.appendChild(iframe);// 这一行必须，iframe挂在到dom树上才会发请求
              var timer2 = setTimeout(function () {
                iframe.remove();
                clearTimeout(timer2)
              }, 5000)  //这个就根据实际情况定义一下延时删除添加的iframe,不删除也问题不大
              clearTimeout(timer1);
            }
          }(aurl), 1000 * index)

        })
        // for (let index in this.primaryIssueDetailedListFile) {
        //   let data = {
        //     fileName: this.primaryIssueDetailedListFile[index].name.split('.')[0],
        //     fileUrl: this.primaryIssueDetailedListFile[index].url
        //   }
        //   let paramList = []
        //   for (let i in data) {
        //     paramList.push(`${i}=${data[i]}`)
        //   }
        //   let aurl = `${baseURL}/cii-system/uploadFile/getFile?${paramList.join('&')}`
        //   const a = document.createElement('a');
        //   a.style.display = 'none';
        //   a.download = this.primaryIssueDetailedListFile[index].name;
        //   a.href = aurl;
        //   document.body.appendChild(a);
        //   a.click();  // 自动触发点击a标签的click事件
        //   document.body.removeChild(a);
        // }
      } else {
        this.$message.error('未上传支付清单原文件')
      }
    },
    // 服务清单
    async getServiceDetailedFilePageFun() {
      try {
        const res = await getServiceDetailedFilePage(this.form2);
        this.serviceDetailedFileList = res.data.serviceDetailedFilePage.records;
        this.total2 = res.data.serviceDetailedFilePage.total;
        this.serviceSumAmount = res.data.sumPrice
      } catch (error) {
        console.log(error);
      }
    },
    // 支付清单
    async getPaymentDetailedFilePageFun() {
      // const params = {
      //   demandId: this.editId,
      //   isDisable: 0,
      //   isPage: 1,
      //   pageNum: 1,
      //   pageSize: 5,
      //   search: "",
      // };
      try {
        const res = await getPaymentDetailedFilePage(this.form1);
        this.paymentDetailedFilePage = res.data.paymentDetailedFilePage.records;
        this.total1 = res.data.paymentDetailedFilePage.total;
        this.paymentSumAmount = res.data.sumAmount
      } catch (error) {
        console.log(error);
      }
    },
    handleSizeChange1(val) {
      this.form1.pageSize = val
      this.handleCurrentChange1(1)
    },
    handleCurrentChange1(val) {
      this.form1.pageNum = val
      this.getPaymentDetailedFilePageFun()
    },
    handleSizeChange2(val) {
      this.form2.pageSize = val
      this.handleCurrentChange2(1)
    },
    handleCurrentChange2(val) {
      this.form2.pageNum = val
      this.getServiceDetailedFilePageFun()
    },
    changeTime() {
      let param = {};
      if (this.submitTime) {
        param = {
          returnMoneyStartDate: this.submitTime[0],
          returnMoneyEndDate: this.submitTime[1],
        };
      }
      this.getReturnMoneyApprovalByCustomerId(param);
    },
    // returnApprove(id, editType) {
    //   this.$emit('input', 1)
    //   this.$emit('edit', id, editType)
    // },
    handleDetail(row) {
      this.showReceipDialog = true;
      this.returnMoneyApprovalList = row.returnMoneyApprovalList;
    },
    load(tree, treeNode, resolve) {
      const id = tree.id;
      this.maps.set(id, { tree, treeNode, resolve });
      // let list = this.detailData.arrivalReceipt.filter(item => {
      //   return item.deleteId == deleteId
      // })
      resolve(this.arrivalReceipt);
    },
    getSummaries(param) {
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (this.arrivalReceipt && this.arrivalReceipt.length > 0) {
          if (index === 1) {
            sums[index] = "合计";
            return;
          }
          if (index === 2) {
            sums[index] = this.$options.filters.toThousands(
              NumberAdd(
                this.arrivalReceipt.map((item) => item.amount || 0)
              )
            );
          }
          if (index === 4) {
            sums[index] = this.$options.filters.toThousands(
              Number(
                NumberAdd(
                  this.arrivalReceipt.map(
                    (item) => item.availableMoney || 0
                  )
                )
              )
            );
          }
          if (index === 6) {
            sums[index] = this.$options.filters.toThousands(
              NumberAdd(
                this.arrivalReceipt.map(
                  (item) => item.arrivalUsedMoney || item.usedMoney || 0
                )
              )
            );
          }
          if (index === 7) {
            sums[index] = this.$options.filters.toThousands(
              NumberAdd(
                this.arrivalReceipt.map(
                  (item) => item.currentUsedMoney || 0
                )
              )
            );
          }
          if (index === 8) {
            sums[index] = this.$options.filters.toThousands(
              Number(
                NumberAdd(
                  this.arrivalReceipt.map(
                    (item) => item.surplusAvailableMoney || 0
                  )
                )
              )
            );
          }
        }
      });
      return sums;
    },
    getSummaries1(param) {
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 4) {
          sums[index] = this.detailData.isIntegral == 1 ? "申请委托(非权益)" : this.detailData.isIntegral == 0 ? '申请委托(权益)' : '申请委托';
          return;
        }
        if (index === 5) {
          sums[index] = this.$options.filters.toThousands(this.paymentSumAmount) || 0;
          // sums[index] = this.paymentSumAmount && this.$options.filters.toThousands(this.paymentSumAmount) || 0
        }
      });
      return sums;
    },
    getSummaries2(param) {
      const { columns } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 2) {
          sums[index] = "合计";
          return;
        }
        // if (index === 3) {
        //   sums[index] = this.serviceDetailedFileList && this.serviceDetailedFileList.length > 0 && this.$options.filters.toThousands(
        //     NumberAdd(
        //       this.serviceDetailedFileList.map((item) => item.price)
        //     )
        //   );
        // }
        // if (index === 4) {
        //   sums[index] = this.serviceDetailedFileList && this.serviceDetailedFileList.length > 0 && NumberAdd(
        //     this.serviceDetailedFileList.map((item) => item.quantity)
        //   )
        // }
        if (index === 5) {
          sums[index] = this.$options.filters.toThousands(this.serviceSumAmount) || 0;
          // sums[index] = this.serviceDetailedFileList && this.serviceDetailedFileList.length > 0 && this.$options.filters.toThousands(
          //   NumberAdd(
          //     this.serviceDetailedFileList.map((item) => item.settlementAmount)
          //   )
          // );
        }
      });
      return sums;
    },
    returnClick() {
      this.showReturnDialog = true;
    },
    openFile(cInfo) {
      let fileList = JSON.parse(cInfo.arrivalReceiptFile);
      if (!fileList || fileList.length == 0) {
        this.$message.warning("文件丢失");
        return;
      }
      let fileItem = fileList[0];
      // this.dialogTableVisible = false
      if (fileItem instanceof Object) {
        if (fileItem.name.indexOf(".pdf") > -1) {
          window.open(fileItem.url);
        } else {
          this.dialogVisible = true;
          this.dialogImageUrl = fileItem.url;
          //this.handleClickItem()
        }
      } else {
        if (fileItem.indexOf(".pdf") > -1) {
          window.open(fileItem);
        } else {
          this.dialogVisible = true;
          this.dialogImageUrl = fileItem;
          //this.handleClickItem()
        }
      }
    },
    downLoad(url) {
      if (url) {
        this.dialogVisible = true;
        this.dialogImageUrl = url;
      }
    },
    //修改已读
    readUpdate(data) {
      updateIsRead(data).then(() => { });
    },
    async onload() {
      await getDemandApprovalInfo({ id: this.editId }).then(async (res) => {
        this.detailData = res.data;
        let businessTypelist = [];
        if (this.detailData.businessType == 0) {
          this.detailData.backersVoList.forEach((item) => {
            businessTypelist.push(item.abbreviated);
            // businessTypelist.push(item.abbreviated)
            this.businessTypelist = businessTypelist.join(" & ");
          });
        }
        this.Datalist = this.detailData.productRelationVoList;
        this.Datalist.forEach(item => {
          if (item.quantity) {
            item.allPrice = NumberMul(item.price, item.quantity).toFixed(2) || 0;
          }
        })

        this.contractFileList = JSON.parse(this.detailData.contractFile) || [];
        this.issueDetailedFile =
          JSON.parse(this.detailData.issueDetailedFile) || [];//支付清单文件
        this.primaryIssueDetailedListFile =
          JSON.parse(this.detailData.primaryIssueDetailedListFile) || [];//支付清单文件
        if (this.primaryIssueDetailedListFile && this.primaryIssueDetailedListFile[0]) {
          let file = this.primaryIssueDetailedListFile
          if (file && file[0] && (this.fileType(file[0].url).indexOf(".png") > -1 || this.fileType(file[0].url).indexOf(".jpg") > -1) | this.fileType(file[0].url).indexOf(".svg") > -1) {
            this.primaryIssueDetailedListFile = this.issueDetailedFile
          }
        }
        this.settlementDetailedFile =
          JSON.parse(this.detailData.settlementDetailedFile) || [];

        this.serviceDetailedFile =
          JSON.parse(this.detailData.serviceDetailedFile) || [];//服务清单文件
        this.primaryServiceDetailedFile =
          JSON.parse(this.detailData.primaryServiceDetailedFile) || []; //原服务清单文件
        if (this.primaryServiceDetailedFile && this.primaryServiceDetailedFile[0]) {
          let file = this.primaryServiceDetailedFile
          if (file && file[0] && (this.fileType(file[0].url).indexOf(".png") > -1 || this.fileType(file[0].url).indexOf(".jpg") > -1) | this.fileType(file[0].url).indexOf(".svg") > -1) {
            this.primaryServiceDetailedFile = this.serviceDetailedFile
          }
        }
        this.screenshot = this.detailData.screenshot
          ? this.detailData.screenshot.split(",")
          : [];
        this.determineFile = this.detailData.determineFile
          ? JSON.parse(this.detailData.determineFile)
          : [];

        // this.determineFile.push(...wxScreenshot, ...mailScreenshot);
        this.approvalProcessVoList =
          this.detailData.approvalProcessVoList || [];
        // if (this.detailData.paymentApprovalVoList[0]) {
        //   let list = this.detailData.paymentApprovalVoList[0].paymentVoList.map(
        //     (item) => item.directAmount
        //   );
        //   this.moneySum = NumberSub(NumberAdd(list), this.refundAmount);
        //   let list2 =
        //     this.detailData.paymentApprovalVoList[0].paymentVoList.map(
        //       (item) => item.rechargeAmount
        //     );
        //   this.moneySum2 = NumberAdd(list2);
        // }
        let user = JSON.parse(sessionStorage.getItem("user"));
        this.idData =
          (this.detailData.approvalProcessVoList &&
            this.detailData.approvalProcessVoList.find((item) => {
              // if (index > 0) {
              //   this.isShowReturn = true
              // }
              return (
                item.approvalId == user.id &&
                (item.operationType == 0 || item.operationType == 2)
              );
            })) ||
          {};
        if (this.$route.query.id) {
          if (this.$route.query.state == 1 && this.editType == "show") {
            let isCopyData =
              (this.detailData.approvalProcessVoList &&
                this.detailData.approvalProcessVoList.find((item) => {
                  return item.approvalId == user.id && item.operationType == 1;
                })) ||
              {};
            let data = {
              id: isCopyData.id,
            };
            this.readUpdate(data);
          }
        }
        this.$nextTick(() => {
          if (this.showService) {
            this.$refs['form17'].onload(this.detailData)
          }
        })
        let par = {
          type: 0,
          relationshipId: this.editId
        }
        await getApprovalProcessLogList(par).then(res => {
          let re = res.data
          this.$refs["processform"].onload2(re);
        })
        this.$refs["processform"].onload(this.detailData);
        // this.detailData.arrivalReceipt = [];
        //计算回单可用委托，有返回值取返回值，没有就根据服务费计算
        // const { agentServiceCharge, serviceCharge } = this.detailData;
        if (this.detailData.businessType == 1) {
          await getReturnMoneyApprovalById({ id: this.editId }).then((res) => {
            this.detailData.arrivalReceipt = res.data || [];
            this.arrivalReceipt = res.data || [];
            this.arrivalReceipt.forEach((item) => {
              if (
                item.availAbleMoneyRecordList &&
                item.availAbleMoneyRecordList.length > 0
              ) {
                item.availAbleMoneyRecordList.forEach((item1) => {
                  this.$set(item1, "status", item1.approvalStatus);
                });
              }
            });
          });
        }
        if (this.detailData.businessType == 1) {
          if (
            this.detailData.capitalStartTime &&
            this.detailData.capitalEndTime
          ) {
            this.submitTime = [
              this.detailData.capitalStartTime,
              this.detailData.capitalEndTime,
            ];
          } else {
            this.submitTime = [];
          }
          // let param = {
          //   returnMoneyStartDate: this.submitTime[0],
          //   returnMoneyEndDate: this.submitTime[1],
          // }
          // this.getReturnMoneyApprovalByCustomerId(param)
        }

      });
    },
    async onload_1() {
      await getDemandApprovalInfo({ id: this.editId }).then((res) => {
        this.detailData = res.data;
        let businessTypelist = [];
        if (this.detailData.businessType == 0) {
          this.detailData.backersVoList.forEach((item) => {
            businessTypelist.push(item.abbreviated);
            // businessTypelist.push(item.abbreviated)
            this.businessTypelist = businessTypelist.join(" & ");
          });
        }
        this.Datalist = this.detailData.productRelationVoList;
        this.contractFileList = JSON.parse(this.detailData.contractFile) || [];
        this.issueDetailedFile =
          JSON.parse(this.detailData.issueDetailedFile) || [];//支付清单文件
        this.primaryIssueDetailedListFile =
          JSON.parse(this.detailData.primaryIssueDetailedListFile) || [];//支付清单文件

        this.settlementDetailedFile =
          JSON.parse(this.detailData.settlementDetailedFile) || [];
        this.serviceDetailedFile =
          JSON.parse(this.detailData.serviceDetailedFile) || [];//服务清单文件
        this.primaryServiceDetailedFile =
          JSON.parse(this.detailData.primaryServiceDetailedFile) || []; //原服务清单文件
        this.screenshot = this.detailData.screenshot ? JSON.parse(this.detailData.screenshot)
          : [];
        // let wxScreenshot = this.detailData.wxScreenshot
        //   ? this.detailData.wxScreenshot.split(",")
        //   : [];
        // let mailScreenshot = this.detailData.mailScreenshot
        //   ? this.detailData.mailScreenshot.split(",")
        //   : [];
        this.determineFile = this.detailData.determineFile
          ? JSON.parse(this.detailData.determineFile)
          : [];

        // this.determineFile.push(...wxScreenshot, ...mailScreenshot);
        this.approvalProcessVoList =
          this.detailData.approvalProcessVoList || [];
        if (this.detailData.paymentApprovalVoList[0]) {
          let list = this.detailData.paymentApprovalVoList[0].paymentVoList.map(
            (item) => item.directAmount
          );
          this.moneySum = NumberSub(NumberAdd(list), this.refundAmount);
          let list2 =
            this.detailData.paymentApprovalVoList[0].paymentVoList.map(
              (item) => item.rechargeAmount
            );
          this.moneySum2 = NumberAdd(list2);
        }
        let user = JSON.parse(sessionStorage.getItem("user"));
        this.idData =
          (this.detailData.approvalProcessVoList &&
            this.detailData.approvalProcessVoList.find((item) => {
              // if (index > 0) {
              //   this.isShowReturn = true
              // }
              return (
                item.approvalId == user.id &&
                (item.operationType == 0 || item.operationType == 2)
              );
            })) ||
          {};
        if (this.$route.query.id) {
          if (this.$route.query.state == 1 && this.editType == "show") {
            let isCopyData =
              (this.detailData.approvalProcessVoList &&
                this.detailData.approvalProcessVoList.find((item) => {
                  return item.approvalId == user.id && item.operationType == 1;
                })) ||
              {};
            let data = {
              id: isCopyData.id,
            };
            this.readUpdate(data);
          }
        }
        this.$nextTick(() => {
          if (this.showService) {
            this.$refs['form17'].onload(this.detailData)
          }
        })
        this.$refs["processform"].onload(this.detailData);
        this.detailData.arrivalReceipt = [];
        //计算回单可用委托，有返回值取返回值，没有就根据服务费计算
        // const { agentServiceCharge, serviceCharge } = this.detailData;
        if (this.detailData.businessType == 1) {
          getReturnMoneyApprovalById({ id: this.editId }).then((res) => {
            this.detailData.arrivalReceipt = res.data || [];
            this.detailData.arrivalReceipt.forEach((item) => {
              if (
                item.availAbleMoneyRecordList &&
                item.availAbleMoneyRecordList.length > 0
              ) {
                item.availAbleMoneyRecordList.forEach((item1) => {
                  this.$set(item1, "status", item1.approvalStatus);
                });
              }
            });
          });
        }
        if (this.detailData.businessType == 1) {
          // let param = {}
          // getReturnMoneyApprovalByCustomerId({ customerId: this.detailData.customerId, ...param }).then(res => {
          //   this.moneyList = res.data
          //   this.moneyList.forEach(item => [
          //     this.$set(item, 'unrecordedAmount', NumberSub(item.invoiceAmount, item.returnAmount))
          //   ])
          // })
          if (
            this.detailData.capitalStartTime &&
            this.detailData.capitalEndTime
          ) {
            this.submitTime = [
              this.detailData.capitalStartTime,
              this.detailData.capitalEndTime,
            ];
          } else {
            this.submitTime = [];
          }
          // let param = {
          //   returnMoneyStartDate: this.submitTime[0],
          //   returnMoneyEndDate: this.submitTime[1],
          // }
          // this.getReturnMoneyApprovalByCustomerId(param)
        }
      });
    },
    getReturnMoneyApprovalByCustomerId(param = {}) {
      getReturnMoneyApprovalByCustomerId({
        customerId: this.detailData.customerId,
        ...param,
      }).then((res) => {
        this.moneyList = res.data;
        this.moneyList.forEach((item) => [
          this.$set(
            item,
            "unrecordedAmount",
            NumberSub(item.invoiceAmount, item.returnAmount)
          ),
        ]);
      });
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
    approveSuccess(data1) {
      if (this.showService && !this.disabledService) {
        let form17 = this.$refs["form17"].commit();
        if (!form17 && form17 != {}) return
        let data = {
          ...form17
        }
        let success = res => {
          if (res.code != 200) {
            this.$message.error(res.msg || '操作失败')
            return
          }
          this.updateApprovalFun(data1)
          this.$message.success('操作成功')
        }
        data.id = this.editId
        updateDemandApproval(data).then(success)
      } else {
        this.cancel();
      }
    },
    approveClick1() {
      if (this.showPayment && !this.disabledPayment) {
        let { list = [], date = "" } = this.$refs["paymentForm"].commit() || {};
        let index = list.findIndex(
          (item) =>
            (item.rechargeAmount || item.rechargeAmount == 0) &&
            (item.directAmount || item.directAmount == 0) &&
            item.subjectId
        );
        if (index == -1) {
          this.$message.warning("请填写支付信息");
          return;
        }
        if (!date) {
          this.$message.warning("请选择付款日期");
          return;
        }
      }
      this.showDialog = true;
    },
    approveClick() {
      if (this.showPayment && !this.disabledService) {
        let form17 = this.$refs["form17"].commit();
        if (!form17 && form17 != {}) return
        // if (!form17.serviceId) {
        //   this.$message.warning("请填写服务商");
        //   return;
        // }
        // if (!form17.copeWithAllocation) {
        //   this.$message.warning("应付分配比例");
        //   return;
        // }
      }
      this.showDialog = true;
    },
    // submitPayment() {
    //   //审批生成付款审批
    //   if (
    //     this.form.paymentApprovalVoList &&
    //     this.form.paymentApprovalVoList.length
    //   ) {
    //     //编辑支付信息
    //     let { date = "", list = [] } = this.$refs["paymentForm"].commit() || {};
    //     let data = {
    //       id: this.form.paymentApprovalVoList[0].id,
    //       updatePaymentReqList: list, //支付信息
    //       paymentDate: date, //支付日期
    //       updateInternalTransactionsReqList: this.$refs["insideForm"].commit(), //往来信息
    //     };
    //     updatePaymentApproval(data).then(() => {
    //       this.cancel();
    //     });
    //   } else {
    //     //新增支付信息
    //     // let processForm_2 = this.$refs['processForm_2'].commit() || []

    //     let { date = "", list = [] } = this.$refs["paymentForm"].commit() || {};
    //     let data = {
    //       approvalStatus: 1, //状态
    //       businessCondition:
    //         this.detailData.businessType == 0
    //           ? `${this.detailData.serviceCharge} (${this.detailData.interestFreeDays}) +${this.detailData.ratio}`
    //           : this.detailData.serviceCharge, //业务条件
    //       businessType: this.detailData.businessType, //业务类型(0.垫资,1.不垫资)
    //       customerId: this.detailData.customerId, //客户id
    //       channelId: this.detailData.channelId, //渠道
    //       demandId: this.detailData.id, //需求id
    //       income: this.detailData.income, //委托经营所得(元)
    //       isIntegral: this.detailData.isIntegral, //是否积分(0.是,1.否)
    //       remark: "", //备注
    //       paymentListFile: this.detailData.detailedListFile, //支付清单文件
    //       addPaymentReqList: list, //支付信息
    //       paymentDate: date, //支付日期
    //       // addApprovalProcessReqList: processForm_2,//审批流程
    //       addInternalTransactionsReqList: this.$refs["insideForm"].commit(), //往来信息
    //       isRelation: 1,
    //     };
    //     addPaymentApproval(data).then(() => {
    //       this.cancel();
    //     });
    //   }
    // },
    cancel() {
      if (this.$route.query.id) {
        this.$router.go(-1);
      } else {
        this.$emit("input", 0);
      }
    },
  },
  computed: {
    isRoleShow() {
      let user = JSON.parse(sessionStorage.getItem('user'))
      if ([1, 13, 16].includes(user.roleId)) {
        return true
      } else {
        return false
      }

    },
    isShowExport() {
      // 是否具有导出权限
      let user = JSON.parse(sessionStorage.getItem('user'))
      if (user && user.exportPermission == 1) {
        return true
      } else {
        return false
      }
    },
    isAgent() {
      return this.detailData.isAgent == 1;
    },
    // disabled() {
    //   return this.editType == 'show' || this.editType == 'approve'
    // },
    showService() {
      let show = false;
      if (this.editType == "approve") {
        let user = JSON.parse(sessionStorage.getItem("user"));
        let item = this.detailData.approvalProcessVoList
          ? this.detailData.approvalProcessVoList.find(
            (item) =>
              item.approvalId == user.id &&
              (item.operationType == "0" || item.operationType == "2")
          )
          : {};

        show = item && item.isUpdate == 1;
      }
      return show;
    },
    disabledService() {
      let disabled = true;
      if (this.editType == "approve") {
        let user = JSON.parse(sessionStorage.getItem("user"));
        let item = this.detailData.approvalProcessVoList
          ? this.detailData.approvalProcessVoList.find(
            (item) =>
              item.approvalId == user.id &&
              (item.operationType == "0" || item.operationType == "2")
          )
          : {};
        disabled = !item.isUpdate;
      }
      return disabled;
    },
    showPayment() {
      let show = false;
      // if (this.detailData.isIntegral != 1) {
      //   return false;
      // }
      if (this.editType == "approve" || this.editType == "show") {
        let user = JSON.parse(sessionStorage.getItem("user"));
        let item = this.detailData.approvalProcessVoList
          ? this.detailData.approvalProcessVoList.find(
            (item) =>
              item.approvalId == user.id &&
              (item.operationType == "0" || item.operationType == "2")
          )
          : {};
        show = item.isUpdate == 1;
      }
      if (
        this.editType == "show" &&
        this.detailData.paymentApprovalVoList &&
        this.detailData.paymentApprovalVoList.length
      ) {
        show = true;
      }
      return show;
    },
    disabledPayment() {
      let disabled = true;
      if (this.editType == "approve" && this.detailData.isIntegral == 1) {
        let user = JSON.parse(sessionStorage.getItem("user"));
        let item = this.detailData.approvalProcessVoList
          ? this.detailData.approvalProcessVoList.find(
            (item) =>
              item.approvalId == user.id &&
              (item.operationType == "0" || item.operationType == "2")
          )
          : {};
        disabled = !item.isUpdate;
      }
      return disabled;
    },
    showIssue() {
      let show = 0;
      // if (this.detailData.businessType != 1) {
      //   return false
      // }
      if (this.editType == "approve") {
        let user = JSON.parse(sessionStorage.getItem("user"));
        let item = this.detailData.approvalProcessVoList
          ? this.detailData.approvalProcessVoList.find(
            (item) =>
              item.approvalId == user.id &&
              (item.operationType == "0" || item.operationType == "2")
          )
          : {};
        show = item.isUpdate;
      }
      return show;
    },
  },
  // watch: {
  //   'exportType'(val) {
  //     if (val == 1) {
  //       if (this.primaryServiceDetailedFile.length > 0) {
  //         var main = document.getElementById("main");
  //         this.primaryServiceDetailedFile.forEach((item, index) => {
  //           let data = {
  //             fileName: item.name.split('.')[0],
  //             fileUrl: item.url
  //           }
  //           let paramList = []
  //           for (let i in data) {
  //             paramList.push(`${i}=${data[i]}`)
  //           }
  //           let aurl = `${baseURL}/cii-system/uploadFile/getFile?${paramList.join('&')}`
  //           var timer1 = setTimeout(function (aurl) {
  //             return function () {
  //               //定义一个看不见的iframe
  //               const iframe = document.createElement("iframe");
  //               iframe.style.display = "none"; // 防止影响页面设置不可见
  //               iframe.style.height = "0"; // 防止影响页面高度设置为0
  //               iframe.src = aurl;//下载地址
  //               main.appendChild(iframe);// 这一行必须，iframe挂在到dom树上才会发请求
  //               var timer2 = setTimeout(function () {
  //                 iframe.remove();
  //                 clearTimeout(timer2)
  //               }, 5000)  //这个就根据实际情况定义一下延时删除添加的iframe,不删除也问题不大
  //               clearTimeout(timer1);
  //             }
  //           }(aurl), 1000 * index)

  //         })
  //       } else {
  //         this.$message.error('未上传服务清单原文件')
  //       }
  //     }
  //     if (val == 2) {
  //       if (this.serviceDetailedFile.length == 1) {
  //         let data = {
  //           fileName: this.serviceDetailedFile[0].name.split('.')[0],
  //           fileUrl: this.serviceDetailedFile[0].url
  //         }
  //         let paramList = []
  //         for (let i in data) {
  //           paramList.push(`${i}=${data[i]}`)
  //         }
  //         let aurl = `${baseURL}/cii-system/uploadFile/getFile?${paramList.join('&')}`
  //         const a = document.createElement('a');
  //         a.style.display = 'none';
  //         a.download = this.serviceDetailedFile[0].name;
  //         a.href = aurl;
  //         document.body.appendChild(a);
  //         a.click();  // 自动触发点击a标签的click事件
  //         document.body.removeChild(a);
  //         // window.location.href = this.serviceDetailedFile[0].url
  //       }
  //     }
  //   },
  //   'exportType1'(val) {
  //     if (val == 1) {
  //       if (this.primaryIssueDetailedListFile.length > 0) {
  //         var main = document.getElementById("main");
  //         this.primaryIssueDetailedListFile.forEach((item, index) => {
  //           let data = {
  //             fileName: item.name.split('.')[0],
  //             fileUrl: item.url
  //           }
  //           let paramList = []
  //           for (let i in data) {
  //             paramList.push(`${i}=${data[i]}`)
  //           }
  //           let aurl = `${baseURL}/cii-system/uploadFile/getFile?${paramList.join('&')}`
  //           var timer1 = setTimeout(function (aurl) {
  //             return function () {
  //               //定义一个看不见的iframe
  //               const iframe = document.createElement("iframe");
  //               iframe.style.display = "none"; // 防止影响页面设置不可见
  //               iframe.style.height = "0"; // 防止影响页面高度设置为0
  //               iframe.src = aurl;//下载地址
  //               main.appendChild(iframe);// 这一行必须，iframe挂在到dom树上才会发请求
  //               var timer2 = setTimeout(function () {
  //                 iframe.remove();
  //                 clearTimeout(timer2)
  //               }, 5000)  //这个就根据实际情况定义一下延时删除添加的iframe,不删除也问题不大
  //               clearTimeout(timer1);
  //             }
  //           }(aurl), 1000 * index)

  //         })
  //         // for (let index in this.primaryIssueDetailedListFile) {
  //         //   let data = {
  //         //     fileName: this.primaryIssueDetailedListFile[index].name.split('.')[0],
  //         //     fileUrl: this.primaryIssueDetailedListFile[index].url
  //         //   }
  //         //   let paramList = []
  //         //   for (let i in data) {
  //         //     paramList.push(`${i}=${data[i]}`)
  //         //   }
  //         //   let aurl = `${baseURL}/cii-system/uploadFile/getFile?${paramList.join('&')}`
  //         //   const a = document.createElement('a');
  //         //   a.style.display = 'none';
  //         //   a.download = this.primaryIssueDetailedListFile[index].name;
  //         //   a.href = aurl;
  //         //   document.body.appendChild(a);
  //         //   a.click();  // 自动触发点击a标签的click事件
  //         //   document.body.removeChild(a);
  //         // }
  //       } else {
  //         this.$message.error('未上传支付清单原文件')
  //       }
  //     }
  //     if (val == 2) {
  //       if (this.issueDetailedFile.length == 1) {
  //         let data = {
  //           fileName: this.issueDetailedFile[0].name.split('.')[0],
  //           fileUrl: this.issueDetailedFile[0].url
  //         }
  //         let paramList = []
  //         for (let i in data) {
  //           paramList.push(`${i}=${data[i]}`)
  //         }
  //         let aurl = `${baseURL}/cii-system/uploadFile/getFile?${paramList.join('&')}`
  //         const a = document.createElement('a');
  //         a.style.display = 'none';
  //         a.download = this.issueDetailedFile[0].name;
  //         a.href = aurl;
  //         document.body.appendChild(a);
  //         a.click();  // 自动触发点击a标签的click事件
  //         document.body.removeChild(a);
  //         // window.location.href = this.serviceDetailedFile[0].url
  //       }
  //     }
  //   }
  // }
};
</script>
<style lang="scss" scoped>
.basic-info-container {
  position: relative;
  font-family: PingFang SC;
  font-size: 14px;
  background: #ffffff;
  border-radius: 8px;
  margin: 14px 0;
  .payment-information {
    // display: flex;
    width: 100% !important;
    margin: 0 18px 0 !important;
  }
  .divder-top {
    transform: scaleY(0.5);
  }
  // padding: 54px 16px;
  .basic-info {
    // margin-left: 16px;
    padding: 16px 0 0 20px;
    font-weight: 700;
    margin-left: 12px;
    // font-size: 16px;
  }
  .file-info {
    font-weight: 700;
    margin: 0 0 0 12px;
  }
  .internal-info {
    padding: 0;
    font-weight: 700;
    font-size: 14px;
    margin: 0 0 0 16px;
    color: #3a7dff;
  }
  .basic-info:before {
    display: inline-block;
    content: "";
    width: 4px;
    height: 18px;
    position: absolute;
    background-color: #3a7dff;
    left: 16px;
    top: 18px;
    // margin-right: 10px;
  }
  .money-info {
    padding: 0 20px;
  }
  .border-solid {
    margin: 0 16px 18px;
    border-top: 1px solid rgba(0, 0, 0, 0.15);
    transform: scaleY(0.5);
  }
  .basic-info-content {
    padding: 0 16px 18px;
    &.payment-info {
      padding: 0 16px 5px;
    }
    .rol-content {
      padding-top: 16px;
    }
    .mb {
      padding-top: 16px;
      margin-bottom: 20px;
    }
    .rol-content:nth-of-type(1) {
      padding-top: 0;
    }
    .grid-content {
      // width: 33.33%;
      font-weight: 400;
      font-size: 14px;
      // margin-bottom: 10px;
      color: #626468;
      .col-text {
        font-size: 14px;
        color: #303132;
        &.receipt {
          color: #3a7dff;
          cursor: pointer;
        }
        &.red {
          color: #f14f44;
        }
        &.weight {
          font-size: 16px;
          font-weight: 700;
        }
        &.weight1 {
          font-size: 16px;
          font-weight: 700;
          color: #626468;
        }
      }
      &.top {
        display: flex;
        align-items: center;
        .top-img {
          margin: 0 5px;
        }
      }
      &.bold {
        color: #303132;
        font-weight: 700;
        font-size: 15px;
      }
    }
    .grid-content1 {
      width: 33.33%;
      font-weight: 400;
      font-size: 14px;
      margin-bottom: 16px;
      color: #626468;
      .col-text {
        font-size: 14px;
        color: #303132;
        &.receipt {
          color: #3a7dff;
          cursor: pointer;
        }
        &.red {
          color: #f14f44;
        }
        &.weight {
          font-size: 16px;
          font-weight: 700;
        }
        &.weight1 {
          font-size: 16px;
          font-weight: 700;
          color: #626468;
        }
      }
      &.top {
        display: flex;
        align-items: center;
        .top-img {
          margin: 0 5px;
        }
      }
      &.bold {
        color: #303132;
        font-weight: 700;
        font-size: 15px;
      }
    }
    .grid-content12b {
      width: 25%;
      font-weight: 400;
      font-size: 14px;
      margin-bottom: 16px;
      color: #626468;
      .col-text {
        font-size: 14px;
        color: #303132;
        &.cur {
          cursor: pointer;
        }
        &.receipt {
          color: #3a7dff;
          cursor: pointer;
        }
        &.red {
          color: #f14f44;
        }
        &.weight {
          font-size: 16px;
          font-weight: 700;
        }
        &.weight1 {
          font-size: 16px;
          font-weight: 700;
          color: #626468;
        }
      }
      &.top {
        display: flex;
        align-items: center;
        .top-img {
          margin: 0 5px;
        }
      }
      &.bold {
        color: #303132;
        font-weight: 700;
        font-size: 15px;
      }
    }
    .grid-content12b1 {
      width: 70%;
      font-weight: 400;
      font-size: 14px;
      margin-bottom: 16px;
      color: #626468;
      .file-con {
        display: flex;
        flex-wrap: wrap;
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
    .remark {
      line-height: 30px;
      // padding: 16px 0 0;
      .col-text {
        color: #303132;
      }
    }
    .business-conditions {
      font-weight: 700;
      color: #3a7dff;
    }
  }
  .basic-info-content1 {
    padding: 0;
  }
  .table-header-row {
    background-color: #0a3a8b;
  }
  .img {
    height: 48px;
  }
  .screenshot {
    display: flex;
    padding: 20px;
    .img-item2 {
      width: 64px;
      height: 64px;
      margin-right: 20px;
    }
  }
  //产品清单
  .product-header {
    margin: 0 16px;
    padding: 0 5px;
    height: 54px;
    line-height: 54px;
    background-color: #f4f8ff;
    .grid-content {
      padding-left: 10px;
      color: #909399;
      font-size: 14px;
      font-weight: 700;
    }
  }
  .product-content {
    margin: 0 16px;
    height: 50px;
    line-height: 50px;
    // border-bottom: 1px solid #d0d0d0;
    .grid-content {
      font-size: 15px;
      padding-left: 10px;
      color: #626468;
    }
    .divder-product {
      transform: scaleY(0.5);
    }
  }
  .product-content:last-of-type {
    .divder-product {
      transform: scaleY(0);
    }
  }
  // .product-content:last-of-type {
  //   margin: 0 16px;
  //   height: 50px;
  //   line-height: 50px;
  //   // border-bottom: none;
  //   .grid-content {
  //     font-size: 15px;
  //     padding-left: 10px;
  //     color: #626468;
  //   }
  // }
  //业务凭证
  .business-outer-container {
    display: flex;
    flex-wrap: wrap;
    margin: 0 16px;
    .business-container {
      width: 32%;
      margin: 10px 0.5%;
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
    .business-container:last-of-type {
      .business-item-container {
        display: flex;
        flex-wrap: wrap;
      }
      .business-item {
        display: inline-block;
      }
      .business-item-outer {
        display: inline-block;
      }
    }
  }

  .subject-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .subject-item {
      width: 33.33%;
      margin-bottom: 15px;
      // background-color: pink;
      .grid-content {
        font-weight: 400;
        color: #626468;
        margin: 10px 0;
        .col-text {
          color: #303132;
          &.receipt {
            color: #3a7dff;
            cursor: pointer;
          }
          &.red {
            color: #f14f44;
          }
        }
      }
    }
  }
  .internal-container {
    display: flex;
    flex-wrap: wrap;
    .internal-transactions {
      margin-bottom: 15px;
    }
  }
  .internal-transactions {
    width: 33.33%;
    // background-color: pink;
    .grid-content {
      font-weight: 400;
      color: #626468;
      margin: 10px 0;
      .col-text {
        color: #303132;
        &.receipt {
          color: #3a7dff;
          cursor: pointer;
        }
        &.red {
          color: #f14f44;
        }
      }
    }
  }
}
.statistical-time {
  margin-right: 10px;
  font-size: 14px;
  font-weight: 700;
}
.return-money-dialog {
  overflow: scroll;
}
.explain-fields {
  &:after {
    display: inline-block;
    content: "";
    width: 14px;
    height: 14px;
    background: url("../../../../assets/img/字段解释.png") no-repeat;
    background-size: contain;
    vertical-align: middle;
    margin-left: 5px;
    cursor: pointer;
  }
}
.detail {
  ::v-deep .el-table__indent {
    padding: 0 !important;
  }
  ::v-deep .el-table__placeholder {
    width: 0;
  }
}

// .business-item {
//   display: inline-block;
// }

.bi_iframe2 {
  height: 80vh;
}
::v-deep .return-money-date {
  padding-left: 30px !important;
}
::v-deep .el-dialog__title {
  font-weight: 700;
}
::v-deep .el-image-viewer__wrapper {
  z-index: 2005;
}
::v-deep .el-table__footer-wrapper .el-table__footer tbody tr {
  font-weight: 700;
  background-color: #f4f8ff !important;
}
::v-deep .el-table__footer-wrapper tbody td.el-table__cell {
  background-color: #f4f8ff !important;
}
</style>