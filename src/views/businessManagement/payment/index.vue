<template>
  <div style="width:100%">
    <PaymentList v-model="showType" v-show="showType==0" ref="list" @edit="editClick"></PaymentList>
    <PaymentForm v-model="showType" :editId="editId" :editType="editType" v-if="showType==1"></PaymentForm>
  </div>
</template>

<script>
import PaymentForm from './components/PaymentForm'
import PaymentList from './components/PaymentList'
export default {
  name: 'payment',
  components: { PaymentForm, PaymentList },
  data() {
    return {
      showType: 0,
      editType: '',
      editId: ''
    }
  },
  created() {
  },
  watch: {
    showType(val) {
      if (val == 0) {
        this.$refs['list'].getList()
      }
    }
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