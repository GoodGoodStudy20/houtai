<template>
  <div size="small" label-width="auto" class="block-form3" style="font-size:14px;font-weight:400">
    <div class="loan-item">
      <p class="loan-item-text">公司名称：<span class="loanData-info">{{form.name}}</span></p>
      <p class="loan-item-text">税号：<span class="loanData-info">{{form.dutyParagraph}}</span></p>
    </div>
    <div class="loan-item">
      <p class="loan-item-text">注册地址：<span class="loanData-info">{{form.registeredAddress}}</span></p>
      <p class="loan-item-text">账号：<span class="loanData-info">{{form.account}}</span></p>
    </div>
    <div class="loan-item">
      <p class="loan-item-text">开户行：<span class="loanData-info">{{form.openingBank}}</span></p>
      <p class="loan-item-text">电话：<span class="loanData-info">{{form.phone}}</span></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Form4',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        name: '',
        dutyParagraph: '',
        registeredAddress: '',
        accountName: '',
        account: '',
        openingBank: ''

      },
    }
  },
  methods: {
    onload(obj) {
      this.form = Object.assign(this.form, obj)
    },
    commit() {
      if (!this.$validate('form')) return
      let obj = Object.assign({}, this.form)
      return obj
    },

  }
}
</script>

<style lang="scss" scoped>
.block-form3 {
  width: 1180px;
  margin: 0 auto;
  .loan-item {
    display: flex;
    // margin-left: 20px;
    margin: 0 0 16px 20px;
    .loan-item-text {
      width: 50%;
      margin: 0;
    }
  }
}
.loanData-info {
  font-size: 15px;
  color: #626468;
  font-weight: 600;
}
</style>