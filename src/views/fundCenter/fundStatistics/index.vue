<template>
  <div style="width:100%">
    <FundStatistics v-model="showType" v-show="showType==0" ref="list" @edit="editClick"></FundStatistics>
  </div>
</template>

<script>
import FundStatistics from './components/FundStatistics'
export default {
  name: 'fund',
  components: { FundStatistics },
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