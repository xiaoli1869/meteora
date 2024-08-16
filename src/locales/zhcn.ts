export default {
  header: {
    tab1: "Supply / Borrow",
    tab2: "tab2",
    button: "Connect wallet",
    errorChain: "Error Chain",
    changeNetwork: "Change Network",
  },
  supplyBorrowData: {
    title1: "Statistical",
    tab1: "总质押量",
    tab1_2: "总借贷量",
    tab1_3: "总存款量",
    button1: "Quick Swap",
    title2: "My Supply / Borrow",
    tab2_1: "我的质押金额",
    tab2_2: "我的借款金额",
    tab2_3: "我未领取的收益",
    tab2_4: "我的存款金额",
    tab2_5: "累积收益",
    button2: "领取",
    tips: "XXXXXXXXXXXXXXXXXXXXXX",
    quickSwap: {
      title: "Quick Swap",
      youPay: "You Pay",
      balance: "Balance",
      max: "Max",
      receive: "Receive",
      referenceRate: "参考汇率",
      mobileRate: "最佳流动池收费",
      exchangeRate: "兑换手续费",
      slippage: "Slippage",
      auto: "Auto",
      custom: "Custom",
      swap: "Swap",
      tips: "XXXXXXXXXXXXXXX",
    },
  },
  claimFees: {
    title: "领取质押 LP Token 收益",
    tab1: "收益来源",
    tab2: "ID",
    tab3: "收益额",
    tips: "质押 LP 之后，依旧可以获得 LP 原有的流动性收益",
    button: "Claim Fees",
  },
  message: {
    success: "success",
    warning: "warning",
    error: "error",
  },
  lendingTable: {
    title: "质押借贷",
    tab1: "Pairs",
    tab2: "My Positions",
    tab2_1: "共 {{num}} 个 LP Pair",
    tab3: "当前质押价值",
    tab3_1: "LP 收益：${{num}}",
    tab3_button: "领取",
    tab4: "Action",
    tab4_button: "质押借贷",
    tab5: "最大借贷 / 借贷比例",
    tab6: "当前借贷 / 健康度",
    tab7: "Action",
    tab7_button1: "借出 {{token}}",
    tab7_button2: "还款",
    lendingDialog: {
      title: "质押 LP 借出 USDS",
      amount: "借贷金额",
      value: "价值",
      lendingRate: "借贷比例",
      maxLending: "最大借贷金额",
      tips: "质押你持有的 LP Token，即可借出一定比例的 USDS！你的 LP 质押后，依然可以获得 LP 原有的流动性收益",
      button: "质押并借出",
      remainingLending: "当前剩余可借：{{num}} USDS",
      button1: "继续借出",
      warningMsg: "请输入正确的金额",
    },
    repaymentDialog: {
      title: "USDS 还款",
      amount: "还款金额",
      availableAmount: "可用总额：{{num}} USDS",
      value: "价值",
      currentLoans: "当前借贷",
      button: "还款",
    },
  },
  stakeTable: {
    title: "存款生息",
    tab1: "Assets",
    tab2: "My Positions",
    tab3: "存入利率",
    tab3_tips: "xxxxxx",
    tab4: "总存入量",
    tab5: "当前收益",
    tab6: "Action",
    tab6_button1: "Stake",
    tab6_button2: "Take Out",
    dialog: {
      title: "Stake",
      amount: "Stake Amount",
      takeOutTitle: "Take Out",
      takeOutAmount: "take Out Amount",
      balance: "Balance",
      sumLiqui: "总流动性",
      pledge: "当前质押",
      button: "Stake",
      takeOutButton: "Take Out",
      tips: "xxxxx",
      takeOutTips: "xxxxxxxx",
    },
  },
};
