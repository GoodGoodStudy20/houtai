<template>
  <div style="width:100%">
    <RepaymentList v-model="showType" v-if="showType==0" @edit="editClick"></RepaymentList>
    <RepaymentForm v-model="showType" :editId="editId" :editType="editType" v-if="showType==1"></RepaymentForm>
  </div>
</template>

<script>
import RepaymentForm from './components/RepaymentForm'
import RepaymentList from './components/RepaymentList'
export default {
  name: 'Repayment',
  components: { RepaymentForm, RepaymentList },
  data() {
    return {
      showType: 0,
      editType: '',
      editId: ''
    }
  },
  created() {
  },
  methods: {
    editClick(id, editType) {
      this.editId = id
      this.editType = editType
    }
  }
}
</script>

<style>
</style>