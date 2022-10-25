<template>
  <div style="width:100%">
    <HistoryList v-model="showType" v-if="showType==0" @edit="editClick"></HistoryList>
    <HistoryDetail v-model="showType" :phone="phone" :type="type" :editType="editType" v-if="showType==1 && editType=='show'"></HistoryDetail>
  </div>
</template>

<script>
import HistoryList from './components/HistoryList'
import HistoryDetail from './components/HistoryDetail'
export default {
  name: 'HistoryData',
  components: { HistoryList, HistoryDetail },
  data() {
    return {
      showType: 0,
      editType: '',
      phone: '',
      type: ''
    }
  },
  created() {
  },
  methods: {
    editClick(phone, editType, type) {
      this.phone = phone
      this.type = type
      this.editType = editType
    }
  }
}
</script>

<style>
</style>