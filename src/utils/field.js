export const NatureOfOperation = [
  // 运营性质
  { value: 0, label: "自有运营" },
  { value: 1, label: "外部合作" },
]
export const PrincipalLevel = [
  // 主体级别
  { value: 0, label: "一类" },
  { value: 1, label: "二类" },
  { value: 2, label: "三类" },
]
export const AccountType = [
  // 账户类型
  { value: 0, label: "基本户" },
  { value: 1, label: "一般户" },
  { value: 2, label: "共管户" },
];
export const SubjectType = [
  //税务类型
  { value: 0, label: "一般纳税人" },
  { value: 1, label: "小规模" },
];
export const CustomerType = [
  { value: 0, label: "保险公司" },
  { value: 1, label: "代理机构" },
  { value: 2, label: "门店" },
  { value: 3, label: "其他" },
];
export const BusinessType = [
  //业务模式
  { value: 0, label: "垫资" },
  { value: 1, label: "不垫资" },
];
export const ApprovalStatus = [
  //审批状态
  { value: 0, label: "未提交", color: "#000" },
  { value: 1, label: "审批中", color: "#FFA814" },
  { value: 2, label: "审批通过", color: "#11C142" },
  { value: 3, label: "审批未通过", color: "#f14f44" },
  { value: 4, label: "已撤销", color: "#90939980" },
];
export const ApprovalType = [
  //审批类型
  { value: 0, label: "需求审批" },
  { value: 1, label: "付款审批" },
  { value: 2, label: "开票审批" },
  { value: 3, label: "回款审批" },
  { value: 5, label: "合同审批" },
];
export const ContractType = [
  //合同类型
  { value: 0, label: "客户合同" },
  { value: 1, label: "服务商合同" },
  { value: 2, label: "三方合同" },
  { value: 3, label: "借款合同" },
];
export const InvoiceType = [
  //发票种类
  { value: 0, label: "垫资回款开票" },
  { value: 1, label: "不垫资到账开票" },
];
export const InvoiceTypeList = [
  //发票类型
  { value: 0, label: "增值税专用发票（纸质）", disabled: false },
  { value: 1, label: "增值税普通发票（纸质）", disabled: false },
  { value: 2, label: "增值税普通发票（电子）", disabled: false },
  { value: 3, label: "增值税专用发票（电子）", disabled: false },
];
//客户级别
export const LevelType = [
  { value: 0, label: "总公司" },
  { value: 1, label: "分公司" },
  { value: 2, label: "支公司" },
  { value: 3, label: "中心支公司" },
];
