<template>
  <div style="width:100%">
    <companyReceivable v-model="showType" v-if="showType==0" @edit="editClick"></companyReceivable>
    <!-- <ReceivableInfo v-model="showType" :editId="editId" :channelId="channelId" :agentId="agentId" :customerName="customerName" :channelName="channelName" v-if="showType==1"></ReceivableInfo> -->
  </div>
</template>

<script>
import companyReceivable from './components/companyReceivable'
export default {
  name: 'receivable',
  components: { companyReceivable },
  data() {
    return {
      showType: 0,
      channelId: '',
      editId: '',
      customerName: '',
      channelName: '',
      agentId: ''
    }
  },
  created() {
  },
  methods: {
    editClick(id, channelId, customerName, channelName, agentId) {
      this.editId = id
      this.channelId = channelId
      this.customerName = customerName
      this.channelName = channelName
      this.agentId = agentId
    }
  }
}
</script>

<style>
</style>