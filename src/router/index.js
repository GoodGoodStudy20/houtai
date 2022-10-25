import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

export const constantRoutes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
  },
  {
    path: "/index",
    redirect: "/default",
    component: () => import("@/views/index/index"),
    children: [
      {
        path: "/default",
        component: () => import("@/views/index/default.vue"),
        name: "default",
        meta: { keepAlive: true, name: "首页" },
      },
      /**     审批 */
      {
        path: "/approve/index",
        name: "approve",
        component: () => import("@/views/approve/index.vue"),
        meta: { keepAlive: true, name: "审批中心" },
      },
      /**应收历史 */
      {
        path: "/fundCenter/historicalReceivables",
        name: "historicalReceivables",
        component: () =>
          import("@/views/fundCenter/historicalReceivables/index.vue"),
        meta: { keepAlive: true, name: "历史应收" },
      },
      // /**智能签约 */
      {
        path: "/fundCenter/SmartSigningHome",
        name: "SmartSigningHome",
        component: () => import("@/views/fundCenter/SmartSigning/index.vue"),
        meta: { keepAlive: true, name: "智能签约" },
      },
      {
        path: "/fundCenter/SmartSigning",
        name: "SmartSigning",
        component: () =>
          import("@/views/fundCenter/SmartSigning/components/Form.vue"),
        meta: { keepAlive: true, name: "智能签约" },
      },
      {
        path: "/fundCenter/demandStatistics",
        name: "demandStatistics",
        component: () =>
          import("@/views/fundCenter/demandStatistics/index.vue"),
        meta: { keepAlive: true, name: "需求统计" },
      },
      {
        path: "/fundCenter/invoicing",
        name: "invoicing",
        component: () => import("@/views/fundCenter/invoicing/index.vue"),
        meta: { keepAlive: true, name: "开票统计" },
      },
      {
        path: "/fundCenter/contracts",
        name: "contracts",
        component: () => import("@/views/fundCenter/contracts/index.vue"),
        meta: { keepAlive: true, name: "签约统计" },
      },
      /**资 金 管 理 */
      {
        path: "/fundManagement/loan",
        name: "loan",
        component: () => import("@/views/fundManagement/loan/index.vue"),
        meta: { keepAlive: true, name: "放款管理" },
      },
      /**     业务管理 */
      {
        path: "/businessManagement/demand",
        name: "demand",
        component: () => import("@/views/businessManagement/demand/index.vue"),
        meta: { keepAlive: true, name: "业务申请" },
      },
      /**     业务管理首页 */
      {
        path: "/businessManagement/demandHome",
        name: "demandHome",
        component: () =>
          import("@/views/businessManagement/demandHome/index.vue"),
        meta: { keepAlive: true, name: "业务统计" },
      },
      /**     产品管理首页 */
      {
        path: "/businessManagement/productHome",
        name: "productHome",
        component: () =>
          import("@/views/businessManagement/productHome/index.vue"),
        meta: { keepAlive: true, name: "业务统计" },
      },
      {
        path: "/businessManagement/CustomerDeamnd",
        name: "CustomerDeamnd",
        component: () =>
          import(
            "@/views/businessManagement/demandHome/components/CustomerDeamnd.vue"
          ),
      },
      {
        path: "/businessManagement/ChannelDemand",
        name: "ChannelDemand",
        component: () =>
          import(
            "@/views/businessManagement/demandHome/components/ChannelDemand.vue"
          ),
      },
      {
        path: "/businessManagement/OperatingSubject",
        name: "OperatingSubject",
        component: () =>
          import("@/views/businessManagement/OperatingSubject/index.vue"),
        meta: { keepAlive: true, name: "运营主体管理" },
      },
      {
        path: "/businessManagement/payment",
        name: "payment",
        component: () => import("@/views/businessManagement/payment/index.vue"),
        meta: { keepAlive: true, name: "付款管理" },
      },
      {
        path: "/businessManagement/invoice",
        name: "invoice",
        component: () => import("@/views/businessManagement/invoice/index.vue"),
        meta: { keepAlive: true, name: "开票管理" },
      },
      {
        path: "/businessManagement/collection",
        name: "collection",
        component: () =>
          import("@/views/businessManagement/collection/index.vue"),
        meta: { keepAlive: true, name: "回款管理" },
      },
      {
        path: "/businessManagement/ticketEntry",
        name: "ticketEntry",
        component: () =>
          import("@/views/businessManagement/ticketEntry/index.vue"),
        meta: { keepAlive: true, name: "进票管理" },
      },

      /**     基础管理 */
      {
        path: "/basicManagement/subject",
        name: "subject",
        component: () => import("@/views/basicManagement/subject/index.vue"),
        meta: { keepAlive: true, name: "主体管理" },
      },
      {
        path: "/basicManagement/classificationBusiness",
        name: "classificationBusiness",
        component: () =>
          import("@/views/basicManagement/classificationBusiness/index.vue"),
        meta: { keepAlive: true, name: "经营范围分类" },
      },
      {
        path: "/basicManagement/customer",
        name: "customer",
        component: () => import("@/views/basicManagement/customer/index.vue"),
        meta: { keepAlive: true, name: "客户管理" },
      },
      {
        path: "/basicManagement/customerManagement",
        name: "customerManagement",
        component: () =>
          import("@/views/basicManagement/customerManagement/index.vue"),
        meta: { keepAlive: true, name: "客户管理首页" },
      },
      {
        path: "/basicManagement/serviceProvider",
        name: "serviceProvider",
        component: () =>
          import("@/views/basicManagement/serviceProvider/index.vue"),
        meta: { keepAlive: true, name: "服务商管理" },
      },
      {
        path: "/basicManagement/serviceProviderType",
        name: "serviceProviderType",
        component: () =>
          import("@/views/basicManagement/serviceProviderType/index.vue"),
        meta: { keepAlive: true, name: "服务商分类" },
      },
      {
        path: "/basicManagement/capital",
        name: "capital",
        component: () => import("@/views/basicManagement/capital/index.vue"),
        meta: { keepAlive: true, name: "资方管理" },
      },
      {
        path: "/basicManagement/contract",
        name: "contract",
        component: () => import("@/views/basicManagement/contract/index.vue"),
        meta: { keepAlive: true, name: "合同管理" },
      },
      {
        path: "/basicManagement/productType",
        name: "productType",
        component: () =>
          import("@/views/basicManagement/productType/index.vue"),
        meta: { keepAlive: true, name: "产品分类" },
      },
      {
        path: "/basicManagement/product",
        name: "product",
        component: () => import("@/views/basicManagement/product/index.vue"),
        meta: { keepAlive: true, name: "产品管理" },
      },

      /**     系统设置 */
      {
        path: "/setting/menu",
        name: "menu",
        component: () => import("@/views/setting/menu/index.vue"),
        meta: { keepAlive: true, name: "权限管理" },
      },
      {
        path: "/setting/account",
        name: "account",
        component: () => import("@/views/setting/account/index.vue"),
        meta: { keepAlive: true, name: "人员管理" },
      },
      {
        path: "/setting/organization",
        name: "organization",
        component: () => import("@/views/setting/organization/index.vue"),
        meta: { keepAlive: true, name: "部门管理" },
      },
      {
        path: "/setting/process",
        name: "process",
        component: () => import("@/views/setting/process/index.vue"),
        meta: { keepAlive: true, name: "流程管理" },
      },
      {
        path: "/setting/journal",
        name: "journal",
        component: () => import("@/views/setting/journal/index.vue"),
        meta: { keepAlive: true, name: "日志管理" },
      },
      {
        path: "/setting/switch",
        name: "switch",
        component: () => import("@/views/setting/switch/index.vue"),
        meta: { keepAlive: true, name: "开关管理" },
      },
      {
        path: "/setting/historyData",
        name: "historyData",
        component: () => import("@/views/setting/historyData/index.vue"),
        meta: { keepAlive: true, name: "历史数据" },
      },
      /**
       * 权益中心
       */
      // 权益监控
      {
        path: "/equityCenter/equityMonitoring",
        name: "equityMonitoring",
        component: () =>
          import("@/views/equityCenter/equityMonitoring/index.vue"),
      },
      // 客户中心
      {
        path: "/equityCenter/customerCenter",
        name: "customerCenter",
        component: () =>
          import("@/views/equityCenter/customerCenter/index.vue"),
      },
      {
        path: "/fundCenter/receivable",
        name: "receivableList",
        component: () =>
          import("@/views/fundCenter/receivable/components/ReceivableList.vue"),
        meta: { keepAlive: true, name: "应收统计列表", levle: "1" },
      },
      {
        path: "/fundCenter/ReceivableInfo",
        component: () =>
          import("@/views/fundCenter/receivable/components/ReceivableInfo.vue"), // Parent router-view
        name: "ReceivableInfo",
        // meta: { title: 'Menu 1' },
      },
      {
        path: "/fundCenter/ReceivableChannelDetail",
        component: () =>
          import(
            "@/views/fundCenter/receivable/components/ReceivableChannelDetail.vue"
          ),
        name: "ReceivableChannelDetail",
      },
      {
        path: "/fundCenter/ReceivableDemandDetail",
        component: () =>
          import(
            "@/views/fundCenter/receivable/components/ReceivableDemandDetail.vue"
          ),
        name: "ReceivableDemandDetail",
      },
      {
        path: "/fundCenter/OverdueReceivablesDetail",
        component: () =>
          import(
            "@/views/fundCenter/receivable/components/OverdueReceivablesDetail.vue"
          ),
        name: "OverdueReceivablesDetail",
      },
      {
        path: "/fundCenter/ExecutionRateDetail",
        component: () =>
          import(
            "@/views/fundCenter/receivable/components/ExecutionRateDetail.vue"
          ),
        name: "ExecutionRateDetail",
      },
      {
        path: "/fundCenter/ReceivablesScheduleDetail",
        component: () =>
          import(
            "@/views/fundCenter/receivable/components/ReceivablesScheduleDetail.vue"
          ),
        name: "ReceivablesScheduleDetail",
      },
      // 到账分公司统计
      {
        path: "/fundCenter/StatisticsInvoiceReceipt",
        name: "StatisticsInvoiceReceipt",
        component: () =>
          import("@/views/fundCenter/StatisticsInvoiceReceipt/index.vue"),
        meta: { keepAlive: true, name: "到账分公司列表", levle: "1" },
      },
      //到账客户统计
      {
        path: "/fundCenter/CustomerReceivable",
        name: "CustomerReceivable",
        component: () =>
          import(
            "@/views/fundCenter/StatisticsInvoiceReceipt/components/CustomerReceivable.vue"
          ),
        meta: { keepAlive: true, name: "到账客户列表", levle: "1" },
      },
      //到账渠道统计
      {
        path: "/fundCenter/ChannelReceivable",
        name: "ChannelReceivable",
        component: () =>
          import(
            "@/views/fundCenter/StatisticsInvoiceReceipt/components/ChannelReceivable.vue"
          ),
        meta: { keepAlive: true, name: "到账渠道列表", levle: "1" },
      },
      //资金中心
      {
        path: "/fundCenter/fundStatistics",
        name: "fundStatistics",
        component: () => import("@/views/fundCenter/fundStatistics/index.vue"),
        meta: { keepAlive: true, name: "资金中心", levle: "1" },
      },
      //服务商管理
      {
        path: "/fundCenter/ServiceProviderHome",
        name: "ServiceProviderHome",
        component: () =>
          import("@/views/fundCenter/ServiceProviderHome/index.vue"),
        meta: { keepAlive: true, name: "服务商管理", levle: "1" },
      },
    ],
  },
];
const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

const VueRouterPush = Router.prototype.push;
Router.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch((err) => err);
};
router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    //如果是登录页，则跳过验证
    next(); //必不可少
    return; //以下的代码不执行
  }
  if (!sessionStorage.getItem("x-token") && router.path !== "/") {
    next({
      path: "/login",
    });
  } else next();
});
export default router;
