<template>
  <div style="width:100%">
    <ReceivableList v-model="showType" v-if="showType==0" @edit="editClick"></ReceivableList>
    <ReceivableInfo v-model="showType" :editId="editId" :channelId="channelId" :customerName="customerName" :channelName="channelName" v-if="showType==1"></ReceivableInfo>
  </div>
</template>

<script>
import ReceivableInfo from './components/ReceivableInfo'
import ReceivableList from './components/ReceivableList'
export default {
  name: 'historicalReceivables',
  components: { ReceivableInfo, ReceivableList },
  data() {
    return {
      showType: 0,
      channelId: '',
      editId: '',
      customerName: '',
      channelName: ''
    }
  },
  created() {
  },
  methods: {
    editClick(id, channelId, customerName, channelName) {
      this.editId = id
      this.channelId = channelId
      this.customerName = customerName
      this.channelName = channelName
    }
  }
}
</script>

<style>
</style>