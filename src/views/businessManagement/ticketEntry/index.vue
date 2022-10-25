<template>
  <div style="width:100%">
    <TicketEntryList v-model="showType" v-show="showType==0" ref="list" @edit="editClick"></TicketEntryList>
    <TicketEntryForm v-model="showType" :editId="editId" :editType="editType" v-if="showType==1"></TicketEntryForm>
  </div>
</template>

<script>
import TicketEntryList from './components/TicketEntryList'
import TicketEntryForm from './components/TicketEntryForm'
export default {
  name: 'ticketEntry',
  components: { TicketEntryList, TicketEntryForm },
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