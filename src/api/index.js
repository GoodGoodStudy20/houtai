import axios from "./http.js";
/**文 件 下 载 */
// 获取文件流
export function getFile(params) {
  return axios.get("/cii-system/uploadFile/getFile", {
    params,
    responseType: "blob",
  });
}

/** 用 户 管 理 */
// 登录
export function sysLogin(params) {
  return axios.post("/cii-system/user/sysLogin", params);
}
// 系统用户是否禁用
export function isDisable(params) {
  return axios.get("/cii-system/user/isDisable", { params });
}
//修改客户
export function updateUser(params) {
  return axios.post("/cii-system/user/updateUser", params);
}
//新增用户
export function addUser(params) {
  return axios.post("/cii-system/user/addUser", params);
}
// 查询客户分页列表
export function getUserPage(params) {
  return axios.get("/cii-system/user/getUserPage", { params });
}
// 查询客户列表
export function getUserList(params) {
  return axios.get("/cii-system/user/getUserList", { params });
}
// 查询用户详情信息
export function getUserInfo(params) {
  return axios.get("/cii-system/user/getUserInfo", { params });
}
// 密码重置(默认123456)
export function resetPwd(params) {
  return axios.get("/cii-system/user/resetPwd", { params });
}
//修改密码
export function changePwd(params) {
  return axios.post("/cii-system/user/changePwd", params);
}

/**操 作 日 志 */
//查询操作日志分页列表
export function getOperationLogPage(params) {
  return axios.post("/cii-system/operationLog/getOperationLogPage", params);
}
/**开 关 设 置 */
//查询短信发送状态
export function getSmsSendState(params) {
  return axios.get("/cii-system/smsLog/getSmsSendState", { params });
}

//修改短信是否发送
export function updateSmsSend(params) {
  return axios.get("/cii-system/smsLog/updateSmsSend", { params });
}

/**  角 色 管 理 */
// 新增角色
export function createRole(params) {
  return axios.post("/cii-system/role/createRole", params);
}
// 删除角色
export function deleteRole(params) {
  return axios.get("/cii-system/role/deleteRole", { params });
}
// 获取全部角色
export function getRoleAll(params) {
  return axios.get("/cii-system/role/getRoleAll", { params });
}
// 修改角色
export function updateRole(params) {
  return axios.post("/cii-system/role/updateRole", params);
}

/**  菜 单 管 理 */
// 获取全部菜单列表
export function getMenuList(params) {
  return axios.get("/cii-system/Menu/getMenuList", { params });
}
// 根据角色获取菜单
export function getRoleMenu(params) {
  return axios.get("/cii-system/Menu/getRoleMenu", { params });
}
// 设置或更新角色菜单
export function setRoleMenu(params) {
  return axios.post("/cii-system/Menu/setRoleMenu", params);
}
// 新增菜单
export function addMenu(params) {
  return axios.post("/cii-system/Menu/addMenu", params);
}
// 修改菜单
export function updateMenu(params) {
  return axios.post("/cii-system/Menu/updateMenu", params);
}
// 删除菜单
export function deleteMenu(params) {
  return axios.get("/cii-system/Menu/deleteMenu", { params });
}

/**  机 构 相 关 */

// 获取组织架构树
export function getOrganizationTree(params) {
  return axios.get("/cii-system/organization/getOrganizationTree", { params });
}
// 获取分支机构列表
export function getOrganizationList(params) {
  return axios.get("/cii-system/organization/getOrganizationList", { params });
}
// 获取分支机构详情
export function getOrganizationById(params) {
  return axios.get("/cii-system/organization/getOrganizationById", { params });
}
// 删除分支机构
export function delOrganizationById(params) {
  return axios.get("/cii-system/organization/delOrganizationById", { params });
}
// 编辑分支机构信息
export function editorOrganization(params) {
  return axios.post("/cii-system/organization/editorOrganization", params);
}
// 添加分支机构信息
export function addOrganization(params) {
  return axios.post("/cii-system/organization/addOrganization", params);
}

/**  主 体 信 息 管 理 */
// 新增主体信息
export function addSubject(params) {
  return axios.post("/cii-system/subject/addSubject", params);
}
// 修改主体信息
export function updateSubject(params) {
  return axios.post("/cii-system/subject/updateSubject", params);
}
// 查询主体信息分页列表
export function getSubjectPage(params) {
  return axios.post("/cii-system/subject/getSubjectPage", params);
}
// 查询主体信息列表
export function getSubjectList(params) {
  return axios.post("/cii-system/subject/getSubjectList", params);
}
// 查询主体详情信息
export function getSubjectInfo(params) {
  return axios.get("/cii-system/subject/getSubjectInfo", { params });
}
// 删除主体信息
export function deleteSubject(params) {
  return axios.get("/cii-system/subject/deleteSubject", { params });
}
// 删除主体发票限制
export function deleteInvoiceRestrictions(params) {
  return axios.get(
    "/cii-system/invoiceRestrictions/deleteInvoiceRestrictions",
    {
      params,
    }
  );
}
// 是否禁用主体信息
export function subjectIsDisable(params) {
  return axios.get("/cii-system/subject/isDisable", { params });
}
// 删除股东监事信息
export function deleteShareholderSupervisor(params) {
  return axios.get(
    "/cii-system/shareholderSupervisor/deleteShareholderSupervisor",
    {
      params,
    }
  );
}
// 删除账户税务信息
export function deleteAccountTax(params) {
  return axios.get("/cii-system/accountTax/deleteAccountTax", { params });
}
// 删除账号密码信息
export function deleteAccountPassword(params) {
  return axios.get("/cii-system/accountPassword/deleteAccountPassword", {
    params,
  });
}

/**  服 务 商 信 息 管 理 */

// 新增服务商信息
export function addServiceProvider(params) {
  return axios.post("/cii-system/serviceProvider/addServiceProvider", params);
}
// 删除服务商信息
export function deleteServiceProvider(params) {
  return axios.get("/cii-system/serviceProvider/deleteServiceProvider", {
    params,
  });
}
// 修改服务商信息
export function updateServiceProvider(params) {
  return axios.post(
    "/cii-system/serviceProvider/updateServiceProvider",
    params
  );
}
// 查询服务商详情信息
export function getServiceProviderInfo(params) {
  return axios.get("/cii-system/serviceProvider/getServiceProviderInfo", {
    params,
  });
}
// 是否禁用服务商信息
export function serviceProviderIsDisable(params) {
  return axios.get("/cii-system/serviceProvider/isDisable", { params });
}
// 查询服务商信息分页列表
export function getServiceProviderPage(params) {
  return axios.post(
    "/cii-system/serviceProvider/getServiceProviderPage",
    params
  );
}
// 查询服务商信息列表
export function getServiceProviderList(params) {
  return axios.post(
    "/cii-system/serviceProvider/getServiceProviderList",
    params
  );
}
// 删除联系人信息
export function deleteContacts(params) {
  return axios.get("/cii-system/contacts/deleteContacts", { params });
}

// 查询服务商分类列表-分页
export function getServiceProviderTypePage(params) {
  return axios.post(
    "/cii-system/serviceProviderType/getServiceProviderTypePage",
    params
  );
}
// 查询服务商分类列表
export function getServiceProviderTypeList(params) {
  return axios.post(
    "/cii-system/serviceProviderType/getServiceProviderTypeList",
    params
  );
}

// 新增服务商分类信息
export function addServiceProviderType(params) {
  return axios.post(
    "/cii-system/serviceProviderType/addServiceProviderType",
    params
  );
}
// 删除服务商分类信息
export function deleteServiceProviderType(params) {
  return axios.get(
    "/cii-system/serviceProviderType/deleteServiceProviderType",
    {
      params,
    }
  );
}
// 修改服务商分类信息
export function updateServiceProviderType(params) {
  return axios.post(
    "/cii-system/serviceProviderType/updateServiceProviderType",
    params
  );
}

/**  客 户 信 息 管 理 */

// 新增客户信息
export function addCustomer(params) {
  return axios.post("/cii-system/customer/addCustomer", params);
}
// 删除客户信息
export function deleteCustomer(params) {
  return axios.get("/cii-system/customer/deleteCustomer", { params });
}
// 是否禁用客户信息
export function customerIsDisable(params) {
  return axios.get("/cii-system/customer/isDisable", { params });
}
// 修改客户信息
export function updateCustomer(params) {
  return axios.post("/cii-system/customer/updateCustomer", params);
}
// 查询客户详情信息
export function getCustomerInfo(params) {
  return axios.get("/cii-system/customer/getCustomerInfo", { params });
}
// 查询客户信息分页列表
export function getCustomerPage(params) {
  return axios.post("/cii-system/customer/getCustomerPage", params);
}
// 查询客户信息列表
export function getCustomerList(params) {
  return axios.post("/cii-system/customer/getCustomerList", params);
}
// 删除客户渠道信息
export function deleteCustomerChannel(params) {
  return axios.get("/cii-system/customerChannel/deleteCustomerChannel", {
    params,
  });
}

/**  资 方 信 息 管 理 */

// 新增资方信息
export function addBackers(params) {
  return axios.post("/cii-system/backers/addBackers", params);
}
// 删除资方信息
export function deleteBackers(params) {
  return axios.get("/cii-system/backers/deleteBackers", { params });
}
// 是否禁用资方信息
export function backersIsDisable(params) {
  return axios.get("/cii-system/backers/isDisable", { params });
}
// 修改资方信息
export function updateBackers(params) {
  return axios.post("/cii-system/backers/updateBackers", params);
}
// 查询资方详情信息
export function getBackersInfo(params) {
  return axios.get("/cii-system/backers/getBackersInfo", { params });
}
// 查询资方信息分页列表
export function getBackersPage(params) {
  return axios.post("/cii-system/backers/getBackersPage", params);
}
// 查询资方信息列表
export function getBackersList(params) {
  return axios.post("/cii-system/backers/getBackersList", params);
}

/**合 同 管 理 */
// 新增合同信息
export function addContract(params) {
  return axios.post("/cii-system/contractApproval/addContract", params);
}
// 删除合同信息
export function deleteContract(params) {
  return axios.get("/cii-system/contractApproval/deleteContract", { params });
}
// 是否禁用合同信息
export function contractIsDisable(params) {
  return axios.get("/cii-system/contractApproval/isDisable", { params });
}
// 是否续签合同信息
export function isRenewal(params) {
  return axios.get("/cii-system/contractApproval/isRenewal", { params });
}
// 修改合同信息
export function updateContract(params) {
  return axios.post("/cii-system/contractApproval/updateContract", params);
}
// 查询合同详情信息
export function getContractInfo(params) {
  return axios.get("/cii-system/contractApproval/getContractInfo", { params });
}
// 查询合同信息分页列表
export function getContractPage(params) {
  return axios.post("/cii-system/contractApproval/getContractPage", params);
}
// 查询合同信息列表
export function getContractList(params) {
  return axios.post("/cii-system/contractApproval/getContractList", params);
}
// 根据客户统计合同
export function contractStatisticsByCustomerId(params) {
  return axios.post(
    "/cii-system/contractApproval/contractStatisticsByCustomerId",
    params
  );
}
// 根据主体统计合同
export function contractStatisticsBySubjectId(params) {
  return axios.post(
    "/cii-system/contractApproval/contractStatisticsBySubjectId",
    params
  );
}
// 判断合同是否有效
export function isEffective(params) {
  return axios.get("/cii-system/contractApproval/isEffective", { params });
}

/**产 品 分类 */
// 新增产品信息
export function addProductType(params) {
  return axios.post("/cii-system/productType/addProductType", params);
}
// 删除产品信息
export function deleteProductType(params) {
  return axios.get("/cii-system/productType/deleteProductType", { params });
}
// 是否禁用产品信息
export function ProductIsDisableType(params) {
  return axios.get("/cii-system/productType/isDisable", { params });
}
// 修改产品信息
export function updateProductType(params) {
  return axios.post("/cii-system/productType/updateProductType", params);
}
// 查询产品详情信息
export function getProductTypeInfo(params) {
  return axios.get("/cii-system/productType/getProductTypeInfo", { params });
}
// 查询产品分类信息分页列表
export function getProductTypePage(params) {
  return axios.post("/cii-system/productType/getProductTypePage", params);
}
// 查询产品信息列表
export function getProductTypeList(params) {
  return axios.post("/cii-system/productType/getProductTypeList", params);
}

/**产 品 管 理 */
// 新增产品信息
export function addProduct(params) {
  return axios.post("/cii-system/product/addProduct", params);
}
// 删除产品信息
export function deleteProduct(params) {
  return axios.get("/cii-system/product/deleteProduct", { params });
}
// 是否禁用产品信息
export function ProductIsDisable(params) {
  return axios.get("/cii-system/product/isDisable", { params });
}
// 修改产品信息
export function updateProduct(params) {
  return axios.post("/cii-system/product/updateProduct", params);
}
// 查询产品详情信息
export function getProductInfo(params) {
  return axios.get("/cii-system/product/getProductInfo", { params });
}
// 查询产品信息分页列表
export function getProductPage(params) {
  return axios.post("/cii-system/product/getProductPage", params);
}
// 查询产品信息列表
export function getProductList(params) {
  return axios.post("/cii-system/product/getProductList", params);
}

/**  审 批 流 程 配 置 */

// 新增审批流程配置
export function addApprovalProcessConfig(params) {
  return axios.post(
    "/cii-system/approvalProcessConfig/addApprovalProcessConfig",
    params
  );
}
// 删除审批流程配置
export function deleteApprovalProcessConfig(params) {
  return axios.get(
    "/cii-system/approvalProcessConfig/deleteApprovalProcessConfig",
    {
      params,
    }
  );
}
// 修改审批流程配置
export function updateApprovalProcessConfig(params) {
  return axios.post(
    "/cii-system/approvalProcessConfig/updateApprovalProcessConfig",
    params
  );
}
// 查询审批流程配置详情信息
export function getApprovalProcessConfigInfo(params) {
  return axios.get(
    "/cii-system/approvalProcessConfig/getApprovalProcessConfigInfo",
    {
      params,
    }
  );
}
// 查询审批流程配置列表
export function getApprovalProcessConfigList(params) {
  return axios.get(
    "/cii-system/approvalProcessConfig/getApprovalProcessConfigList",
    {
      params,
    }
  );
}

/**  需 求 审 批 管 理 */

// 新增需求审批
export function addDemandApproval(params) {
  return axios.post("/cii-system/demandApproval/addDemandApproval", params);
}
// 删除需求审批
export function deleteDemandApproval(params) {
  return axios.get("/cii-system/demandApproval/deleteDemandApproval", {
    params,
  });
}
// 修改需求审批
export function updateDemandApproval(params) {
  return axios.post("/cii-system/demandApproval/updateDemandApproval", params);
}
// 查询需求审批详情信息
export function getDemandApprovalInfo(params) {
  return axios.get("/cii-system/demandApproval/getDemandApprovalInfo", {
    params,
  });
}
// 查询需求审批信息分页列表
export function getDemandApprovalPage(params) {
  return axios.post("/cii-system/demandApproval/getDemandApprovalPage", params);
}
// 查询需求审批信息列表
export function getDemandApprovalList(params) {
  return axios.post("/cii-system/demandApproval/getDemandApprovalList", params);
}
// 撤销审批
export function revokeApproval(params) {
  return axios.get("/cii-system/demandApproval/revokeApproval", { params });
}
// 提交审批
export function submitApproval(params) {
  return axios.get("/cii-system/demandApproval/submitApproval", { params });
}
// 修改下发状态
export function updateIssueStatus(params) {
  return axios.get("/cii-system/demandApproval/updateIssueStatus", { params });
}

/**  付 款 审 批 管 理 */

// 新增付款审批
export function addPaymentApproval(params) {
  return axios.post("/cii-system/paymentApproval/addPaymentApproval", params);
}
// 删除付款审批
export function deletePaymentApproval(params) {
  return axios.get("/cii-system/paymentApproval/deletePaymentApproval", {
    params,
  });
}
// 修改付款审批
export function updatePaymentApproval(params) {
  return axios.post(
    "/cii-system/paymentApproval/updatePaymentApproval",
    params
  );
}
// 查询付款审批详情信息
export function getPaymentApprovalInfo(params) {
  return axios.get("/cii-system/paymentApproval/getPaymentApprovalInfo", {
    params,
  });
}
// 查询付款审批信息分页列表
export function getPaymentApprovalPage(params) {
  return axios.post(
    "/cii-system/paymentApproval/getPaymentApprovalPage",
    params
  );
}
// 删除支付信息
export function deletePayment(params) {
  return axios.get("/cii-system/payment/deletePayment", { params });
}
// 撤销审批
export function revokePaymentApproval(params) {
  return axios.get("/cii-system/paymentApproval/revokeApproval", { params });
}
// 提交审批
export function submitPaymentApproval(params) {
  return axios.get("/cii-system/paymentApproval/submitApproval", { params });
}
// 删除产品信息
export function deleteProductRelation(params) {
  return axios.get("/cii-system/productRelation/deleteProductRelation", {
    params,
  });
}
// 删除内部往来信息
export function deleteInternalTransactions(params) {
  return axios.get(
    "/cii-system/internalTransactions/deleteInternalTransactions",
    {
      params,
    }
  );
}
// 删除退款信息
export function deleteRefund(params) {
  return axios.get("/cii-system/Refund/deleteRefund", { params });
}

/**发 票 审 批 管 理 */

// 新增发票审批
export function addInvoiceApproval(params) {
  return axios.post("/cii-system/invoiceApproval/addInvoiceApproval", params);
}
// 删除发票审批
export function deleteInvoiceApproval(params) {
  return axios.get("/cii-system/invoiceApproval/deleteInvoiceApproval", {
    params,
  });
}
// 修改发票审批
export function updateInvoiceApproval(params) {
  return axios.post(
    "/cii-system/invoiceApproval/updateInvoiceApproval",
    params
  );
}
// 查询发票审批详情信息
export function getInvoiceApprovalInfo(params) {
  return axios.get("/cii-system/invoiceApproval/getInvoiceApprovalInfo", {
    params,
  });
}
// 查询发票审批信息分页列表
export function getInvoiceApprovalPage(params) {
  return axios.post(
    "/cii-system/invoiceApproval/getInvoiceApprovalPage",
    params
  );
}
// 修改状态
export function updateStatusInvoiceApproval(params) {
  return axios.get("/cii-system/invoiceApproval/updateStatus", { params });
}
// 获取开票统计详情
export function getInvoiceStatisticsInfo(params) {
  return axios.get("/cii-system/invoiceApproval/getInvoiceStatisticsInfo", {
    params,
  });
}
// 开票统计
// export function invoiceStatistics(params) {
//   return axios.post("/cii-system/invoiceApproval/invoiceStatistics", params);
// }
// 获取开票统计分页列表
export function getInvoiceStatisticsPage(params) {
  return axios.post(
    "cii-system/subjectStatistics/getInvoiceStatisticsPage",
    params
  );
}
// 获取进销票统计
export function enterSaleTicketStatistics(params) {
  return axios.post(
    "/cii-system/subjectStatistics/enterSaleTicketStatistics",
    params
  );
}
// 获取主体签约统计
export function getSubjectSignedStatistics(params) {
  return axios.post(
    "/cii-system/subjectStatistics/getSubjectSignedStatistics",
    params
  );
}
// 撤销审批
export function revokeInvoiceApproval(params) {
  return axios.get("/cii-system/invoiceApproval/revokeApproval", { params });
}
// 提交审批
export function submitInvoiceApproval(params) {
  return axios.get("/cii-system/invoiceApproval/submitApproval", { params });
}
// 删除发票文件
export function deleteInvoiceFile(params) {
  return axios.get("/cii-system/invoiceFile/deleteInvoiceFile", { params });
}

/**进 票 审 批 管 理 */

// 新增进票审批
export function addEnterInvoiceApproval(params) {
  return axios.post(
    "/cii-system/enterInvoiceApproval/addEnterInvoiceApproval",
    params
  );
}
// 删除进票审批
export function deleteEnterInvoiceApproval(params) {
  return axios.get(
    "/cii-system/enterInvoiceApproval/deleteEnterInvoiceApproval",
    {
      params,
    }
  );
}
// 修改进票审批
export function updateEnterInvoiceApproval(params) {
  return axios.post(
    "/cii-system/enterInvoiceApproval/updateEnterInvoiceApproval",
    params
  );
}
// 查询进票审批详情信息
export function getEnterInvoiceApprovalInfo(params) {
  return axios.get(
    "/cii-system/enterInvoiceApproval/getEnterInvoiceApprovalInfo",
    {
      params,
    }
  );
}
// 查询进票审批信息分页列表
export function getEnterInvoiceApprovalPage(params) {
  return axios.post(
    "/cii-system/enterInvoiceApproval/getEnterInvoiceApprovalPage",
    params
  );
}
// 修改状态
export function updateStatusEnterInvoiceApproval(params) {
  return axios.get("/cii-system/enterInvoiceApproval/updateStatus", { params });
}

/**回 款 审 批 管 理 */

// 新增回款审批
export function addReturnMoneyApproval(params) {
  return axios.post(
    "/cii-system/returnMoneyApproval/addReturnMoneyApproval",
    params
  );
}
// 删除回款审批
export function deleteReturnMoneyApproval(params) {
  return axios.get(
    "/cii-system/returnMoneyApproval/deleteReturnMoneyApproval",
    {
      params,
    }
  );
}
// 修改回款审批
export function updateReturnMoneyApproval(params) {
  return axios.post(
    "/cii-system/returnMoneyApproval/updateReturnMoneyApproval",
    params
  );
}
// 查询回款审批详情信息
export function getReturnMoneyApprovalInfo(params) {
  return axios.get(
    "/cii-system/returnMoneyApproval/getReturnMoneyApprovalInfo",
    {
      params,
    }
  );
}
// 查询回款审批信息分页列表
export function getReturnMoneyApprovalPage(params) {
  return axios.post(
    "/cii-system/returnMoneyApproval/getReturnMoneyApprovalPage",
    params
  );
}
// 提交审批
export function submitReturnMoneyApproval(params) {
  return axios.get("/cii-system/returnMoneyApproval/submitApproval", {
    params,
  });
}
//撤销审批
export function revokeReturnMoneyApproval(params) {
  return axios.get("/cii-system/returnMoneyApproval/revokeApproval", {
    params,
  });
}

/** 首 页 */

// 查询首页信息
export function getHomeInfo(params) {
  return axios.get("/cii-system/homePage/home", { params });
}
export function getHomePage(params) {
  return axios.post("/cii-system/homePage/getHomePage", params);
}
//首页到期合同分页列表
export function expireContractPage(params) {
  return axios.post("/cii-system/homePage/expireContractPage", params);
}
//首页应收账款分页列表
export function receivableAccountsPage(params) {
  return axios.post("/cii-system/homePage/receivableAccountsPage", params);
}
//首页应收账款分页列表
export function receivableAccounts(params) {
  return axios.get("/cii-system/homePage/receivableAccounts", { params });
}
// // 查询首页待办审批信息
// export function getHomePageList(params) {
//   return axios.get("/cii-system/homePage/getHomeList", { params });
// }

/** 审 批 中 心 */
// 查询审批分页列表
export function getApprovalProcessIPage(params) {
  return axios.post(
    "/cii-system/approvalProcess/getApprovalProcessIPage",
    params
  );
}
// 查询id查询回款审批信息
export function getReturnMoneyApprovalById(params) {
  return axios.get("/cii-system/demandApproval/getReturnMoneyApprovalById", {
    params,
  });
}
// 修改审批
export function updateApproval(params) {
  return axios.post("/cii-system/approvalProcess/updateApproval", params);
}
// 修改是否已读
export function updateIsRead(params) {
  return axios.get("/cii-system/approvalProcess/updateIsRead", { params });
}

/**统 计 中 心 */

// 获取应收账款中心列表
export function getReceivablePage(params) {
  return axios.post(
    "/cii-system/demandMoneyFlowRecord/getReceivablePage",
    params
  );
}
// 获取应收账款中心信息
export function getReceivable(params) {
  return axios.get("/cii-system/demandMoneyFlowRecord/getReceivable", {
    params,
  });
}
// 获取应收账款中心详情列表
export function getReceivableInfoPage(params) {
  return axios.post(
    "/cii-system/demandMoneyFlowRecord/getReceivableInfoPage",
    params
  );
}
// 获取应收账款中心详情信息
export function getReceivableInfo(params) {
  return axios.get("/cii-system/demandMoneyFlowRecord/getReceivableInfo", {
    params,
  });
}
// 需求金额月份对比
export function demandMonthComparison(params) {
  return axios.post(
    "/cii-system/demandMoneyFlowRecord/demandMonthComparison",
    params
  );
}
// 统计需求金额
export function demandStatistics(params) {
  return axios.post(
    "/cii-system/demandMoneyFlowRecord/demandStatistics",
    params
  );
}
// 需求金额年度占比
export function demandYearProportion(params) {
  return axios.post(
    "/cii-system/demandMoneyFlowRecord/demandYearProportion",
    params
  );
}

/**放 款 管 理 */

// 新增放款
export function addLoan(params) {
  return axios.post("/cii-system/loan/addLoan", params);
}
// 删除放款
export function deleteLoan(params) {
  return axios.get("/cii-system/loan/deleteLoan", { params });
}
// 查询放款分页列表
export function getLoanPage(params) {
  return axios.post("/cii-system/loan/getLoanPage", params);
}
// 查询放款信息
export function getLoanInfo(params) {
  return axios.get("/cii-system/loan/getLoanInfo", { params });
}
// 修改放款
export function updateLoan(params) {
  return axios.post("/cii-system/loan/updateLoan", params);
}
// 修改状态
export function updateStatusLoan(params) {
  return axios.get("/cii-system/loan/updateStatus", { params });
}
// 删除还款计划
export function deleteRepaymentPlan(params) {
  return axios.get("/cii-system/repaymentPlan/deleteRepaymentPlan", { params });
}

/**还 款 管 理 */

// 新增还款
export function addRepayment(params) {
  return axios.post("/cii-system/repayment/addRepayment", params);
}
// 删除还款
export function deleteRepayment(params) {
  return axios.get("/cii-system/repayment/deleteRepayment", { params });
}
// 查询还款分页列表
export function getRepaymentPage(params) {
  return axios.post("/cii-system/repayment/getRepaymentPage", params);
}
// 查询还款信息
export function getRepaymentInfo(params) {
  return axios.get("/cii-system/repayment/getRepaymentInfo", { params });
}
// 修改还款
export function updateRepayment(params) {
  return axios.post("/cii-system/repayment/updateRepayment", params);
}
// 修改状态
export function updateStatusRepayment(params) {
  return axios.get("/cii-system/repayment/updateStatus", { params });
}
// 查询历史应收列表
export function getHistoryReceivablePage(params) {
  return axios.post(
    "/cii-system/historyReceivable/getHistoryReceivablePage",
    params
  );
}
// 新增历史应收数据
export function addHistoryReceivable(params) {
  return axios.post(
    "/cii-system/historyReceivable/addHistoryReceivable",
    params
  );
}
// 修改历史应收数据
export function updateHisCustomer(params) {
  return axios.post("/cii-system/historyReceivable/updateCustomer", params);
}
// 查看历史应收数据详情
export function getHistoryReceivableInfo(params) {
  return axios.get("/cii-system/historyReceivable/getHistoryReceivableInfo", {
    params,
  });
}
// 删除历史应收数据详情
export function deleteHistoryReceivable(params) {
  return axios.get("/cii-system/historyReceivable/deleteHistoryReceivable", {
    params,
  });
}
// 修改历史应收数据状态
export function updateHistoryReceivableStatus(params) {
  return axios.get("/cii-system/historyReceivable/updateStatus", { params });
}
// 根据开票id和主体id删除发票文件
export function deleteByInvoiceIdAndSubjectId(params) {
  return axios.get("/cii-system/invoiceFile/deleteByInvoiceIdAndSubjectId", {
    params,
  });
}
// 查询还款通知天数
export function getRepaymentNoticeDays(params) {
  return axios.get("/cii-system/systemNoticeConfig/getRepaymentNoticeDays", {
    params,
  });
}
// 查询还款通知时间
export function getRepaymentNoticeTime(params) {
  return axios.get("/cii-system/systemNoticeConfig/getRepaymentNoticeTime", {
    params,
  });
}
// 修改还款通知天数
export function updateRepaymentNoticeDays(params) {
  return axios.get("/cii-system/systemNoticeConfig/updateRepaymentNoticeDays", {
    params,
  });
}
// 修改还款通知时间
export function updateRepaymentNoticeTime(params) {
  return axios.get("/cii-system/systemNoticeConfig/updateRepaymentNoticeTime", {
    params,
  });
}
//删除回款记录
export function deleteReturnMoneyRecord(params) {
  return axios.get("/cii-system/returnMoneyRecord/deleteReturnMoneyRecord", {
    params,
  });
}
//发票自动识别
export function ocrInvoice(params) {
  return axios.post("/cii-system/invoiceFile/ocrInvoice", params);
}
//识别到账回单
export function identifyReceipt(params) {
  return axios.post("/cii-system/returnMoneyApproval/identifyReceipt", params);
}
//删除定时任务
export function deleteTask(params) {
  return axios.get("/cii-system/task/deleteTask", { params });
}
//查询定时任务
export function getTask(params) {
  return axios.get("/cii-system/task/getTask", { params });
}
//重启定时任务
export function startTask(params) {
  return axios.get("/cii-system/task/startTask", { params });
}
//修改定时任务
export function updateTask(params) {
  return axios.get("/cii-system/task/updateTask", { params });
}
//根据客户查询负责人信息
export function getCustomerByDirector(params) {
  return axios.get("/cii-system/customer/getCustomerByDirector", { params });
}
//统计放款列表
export function getLoanStatistics(params) {
  return axios.get("/cii-system/loan/getLoanStatistics", { params });
}
//新增经营分类
export function addBusinessScopeType(params) {
  return axios.post(
    "/cii-system/businessScopeType/addBusinessScopeType",
    params
  );
}
//修改经营分类
export function updateBusinessScopeType(params) {
  return axios.post(
    "/cii-system/businessScopeType/updateBusinessScopeType",
    params
  );
}
//查询经营分类列表
export function getBusinessScopeTypePage(params) {
  return axios.post(
    "/cii-system/businessScopeType/getBusinessScopeTypePage",
    params
  );
}
//删除经营分类分页列表
export function deleteBusinessScopeType(params) {
  return axios.get("/cii-system/businessScopeType/deleteBusinessScopeType", {
    params,
  });
}
//查询经营分类列表
export function getBusinessScopeTypeList(params) {
  return axios.post(
    "/cii-system/businessScopeType/getBusinessScopeTypeList",
    params
  );
}
//查询历史数据列表
export function getHistoryDataPage(params) {
  return axios.post("/cii-system/historyData/getHistoryDataPage", params);
}
//很具手机号查询历史数据列表
export function getHistoryDataPageByPhone(params) {
  return axios.post(
    "/cii-system/historyData/getHistoryDataPageByPhone",
    params
  );
}
//退回审批
export function returnApproval(params) {
  return axios.post("/cii-system/approvalProcess/returnApproval", params);
}
//统计分公司资金
// export function sumCompanyCapital(params) {
//   return axios.post(
//     "/cii-system/returnMoneyApproval/sumCompanyCapital",
//     params
//   );
// }

//统计机构积分
export function countOrgIntegral(params) {
  return fetch("/cancelCode/countOrgIntegral", params);
}
//统计积分总数
export function countIntegralTotal(params) {
  return fetch("/cancelCode/countIntegralTotal", params);
}

// //统计客户资金
// export function sumCustomerCapital(params) {
//   return axios.post(
//     "/cii-system/returnMoneyApproval/sumCustomerCapital",
//     params
//   );
// }
// //统计客户渠道资金
// export function sumCustomerChannelCapital(params) {
//   return axios.post(
//     "/cii-system/returnMoneyApproval/sumCustomerChannelCapital",
//     params
//   );
// }

// 服务清单列表
export function getServiceDetailedFilePage(params) {
  return axios.post(
    "/cii-system/serviceDetailedFile/getServiceDetailedFilePage",
    params
  );
}
// 支付清单列表
export function getPaymentDetailedFilePage(params) {
  return axios.post(
    "/cii-system/paymentDetailedFile/getPaymentDetailedFilePage",
    params
  );
}
// 查询发票文件分页列表
export function getInvoiceFilePage(params) {
  return axios.post("/cii-system/invoiceFile/getInvoiceFilePage", params);
}
// 根据id查询业务审批信息
export function getDemandApprovalById(params) {
  return axios.get("/cii-system/invoiceApproval/getDemandApprovalById", {
    params,
  });
}
// 查询审批中的开票类型
export function getApprovalData(params) {
  return axios.get("/cii-system/invoiceApproval/getApprovalData", {
    params,
  });
}
// 根据id查询回款审批信息
export function getReturnApprovalById(params) {
  return axios.get("/cii-system/invoiceApproval/getReturnApprovalById", {
    params,
  });
}
// 根据id查询回款审批信息
export function getInvoiceApprovalById(params) {
  return axios.get("/cii-system/returnMoneyApproval/getInvoiceApprovalById", {
    params,
  });
}
// 查询审批流程日志列表
export function getApprovalProcessLogList(params) {
  return axios.post(
    "/cii-system/approvalProcessLog/getApprovalProcessLogList",
    params
  );
}
// 应收统计
export function getReceivableStatistics(params) {
  return axios.get("/cii-system/receivableStatistics/getReceivableStatistics", {
    params,
  });
}
// 逾期统计
export function getBeOverdueStatistics(params) {
  return axios.get("/cii-system/receivableStatistics/getBeOverdueStatistics", {
    params,
  });
}
// 应收明细分公司列表
export function getReceivableDetailed(params) {
  return axios.post(
    "/cii-system/receivableStatistics/getReceivableDetailed",
    params
  );
}
// 应收明细客户列表
export function getReceivableCustomerInfo(params) {
  return axios.post(
    "/cii-system/receivableStatistics/getReceivableCustomerInfo",
    params
  );
}
// 应收明细渠道列表
export function getReceivableChannelInfo(params) {
  return axios.post(
    "/cii-system/receivableStatistics/getReceivableChannelInfo",
    params
  );
}
// 应收明细需求分页列表
export function getReceivableDemandInfo(params) {
  return axios.post(
    "/cii-system/receivableStatistics/getReceivableDemandInfo",
    params
  );
}
// 应收明细按期应收列表
export function getOnScheduleReceivableInfo(params) {
  return axios.post(
    "/cii-system/receivableStatistics/getOnScheduleReceivableInfo",
    params
  );
}
// 应收明细逾期应收列表
export function getBeOverdueReceivableInfo(params) {
  return axios.post(
    "/cii-system/receivableStatistics/getBeOverdueReceivableInfo",
    params
  );
}
// 应收明细应收执行率列表
export function getReceivableRateList(params) {
  return axios.post(
    "/cii-system/receivableStatistics/getReceivableRateList",
    params
  );
}
// 业务数据统计
export function getDataStatistics(params) {
  return axios.post("/cii-system/demandStatistics/getDataStatistics", params);
}
// 业务统计
export function getBusinessStatistics(params) {
  return axios.post(
    "/cii-system/demandStatistics/getBusinessStatistics",
    params
  );
}
// 分公司业务统计
export function getBusinessStatisticsByCompanyId(params) {
  return axios.post(
    "/cii-system/demandStatistics/getBusinessStatisticsByCompanyId",
    params
  );
}
// 客户业务统计
export function getBusinessStatisticsByCustomerId(params) {
  return axios.post(
    "/cii-system/demandStatistics/getBusinessStatisticsByCustomerId",
    params
  );
}
// 渠道业务统计
export function getBusinessStatisticsByChannelId(params) {
  return axios.post(
    "/cii-system/demandStatistics/getBusinessStatisticsByChannelId",
    params
  );
}
// 应收提醒
export function getReceivableRemind(params) {
  return axios.get("/cii-system/demandStatistics/getReceivableRemind", {
    params,
  });
}
// 新增开票规划金额
export function addInvoicePlanAmountRecord(params) {
  return axios.post(
    "/cii-system/invoicePlanAmountRecord/addInvoicePlanAmountRecord",
    params
  );
}
// 修改开票规划金额
export function updateInvoicePlanAmountRecord(params) {
  return axios.post(
    "/cii-system/invoicePlanAmountRecord/updateInvoicePlanAmountRecord",
    params
  );
}
// 统计分公司资金
export function sumCompanyCapital(params) {
  return axios.post(
    "/cii-system/returnMoneyStatistics/sumCompanyCapital",
    params
  );
}
//统计客户资金
export function sumCustomerCapital(params) {
  return axios.post(
    "/cii-system/returnMoneyStatistics/sumCustomerCapital",
    params
  );
}
//统计客户渠道资金
export function sumCustomerChannelCapital(params) {
  return axios.post(
    "/cii-system/returnMoneyStatistics/sumCustomerChannelCapital",
    params
  );
}
// 查询未回款通知天数
export function getNotReturnMoneyNoticeDays(params) {
  return axios.get(
    "/cii-system/systemNoticeConfig/getNotReturnMoneyNoticeDays",
    {
      params,
    }
  );
}
// 查询未回款通知时间
export function getNotReturnMoneyNoticeTime(params) {
  return axios.get(
    "/cii-system/systemNoticeConfig/getNotReturnMoneyNoticeTime",
    {
      params,
    }
  );
}
// 修改未回款通知天数
export function updateNotReturnMoneyNoticeDays(params) {
  return axios.get(
    "/cii-system/systemNoticeConfig/updateNotReturnMoneyNoticeDays",
    {
      params,
    }
  );
}
// 修改未回款通知时间
export function updateNotReturnMoneyNoticeTime(params) {
  return axios.get(
    "/cii-system/systemNoticeConfig/updateNotReturnMoneyNoticeTime",
    {
      params,
    }
  );
}
// 客户地域分布统计
export function customerRegionDistribution(params) {
  return axios.post(
    "/cii-system/customerStatistics/customerRegionDistribution",
    params
  );
}
// 修改审批人
export function updateApprovalId(params) {
  return axios.post("/cii-system/approvalProcess/updateApprovalId", params);
}
// 批量修改审批人
export function batchUpdateApprovalId(params) {
  return axios.post(
    "/cii-system/approvalProcess/batchUpdateApprovalId",
    params
  );
}
// 产品销售趋势
export function monthProductSale(params) {
  return axios.get("/cii-system/productStatistics/monthProductSale", {
    params,
  });
}
// 服务类型数据
export function serviceTypeData(params) {
  return axios.post("/cii-system/productStatistics/serviceTypeData", params);
}
// 产品销售数据
export function productSaleData(params) {
  return axios.post("/cii-system/productStatistics/productSaleData", params);
}
// 销售占比
export function saleProportion(params) {
  return axios.post("/cii-system/productStatistics/saleProportion", params);
}
// 接口资金情况
export function loanCapitalSituation(params) {
  return axios.get("/cii-system/capitalStatistics/loanCapitalSituation", {
    params,
  });
}
// 还款统计
export function repaymentStatistics(params) {
  return axios.get("/cii-system/capitalStatistics/repaymentStatistics", {
    params,
  });
}
// 到期还款列表
export function repaymentExpireRemind(params) {
  return axios.get("/cii-system/capitalStatistics/repaymentExpireRemind", {
    params,
  });
}
// 待还资金占比
export function repaymentMoneyProportion(params) {
  return axios.get("/cii-system/capitalStatistics/repaymentMoneyProportion", {
    params,
  });
}
// 预计可支配资金列表
export function estimateControlMoneyList(params) {
  return axios.get("/cii-system/capitalStatistics/estimateControlMoneyList", {
    params,
  });
}
// 提交合同审批
export function submitContractApproval(params) {
  return axios.get("/cii-system/contractApproval/submitApproval", {
    params,
  });
}
// 撤销合同审批
export function revokeContractApproval(params) {
  return axios.get("/cii-system/contractApproval/revokeApproval", {
    params,
  });
}
