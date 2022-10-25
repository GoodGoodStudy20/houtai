<template>
  <div style="width:100%">
    <!-- <el-button type="primary" size="mini" v-show="showType==0" @click="addHistorical">新增</el-button> -->
    <AddHistoricalReceivables v-model="showType" :editId="editId" :editType="editType" v-if="showType==1" v-bind="$attrs"></AddHistoricalReceivables>
    <HistoricalReceivables v-model="showType" v-show="showType==0" ref="list" @edit="editClick" v-bind="$attrs"></HistoricalReceivables>
  </div>
</template>

<script>
import HistoricalReceivables from './components/historicalReceivables.vue'
import AddHistoricalReceivables from './components/addHistoricalReceivables.vue'
export default {
  name: 'historicalReceivables',
  components: { HistoricalReceivables, AddHistoricalReceivables },
  data() {
    return {
      showType: 0,
      editType: '',
      editId: ''
    }
  },
  watch: {
    showType(val) {
      if (val == 0) {
        this.$refs['list'].getList()
      }
    }
  },
  created() {
  },
  methods: {
    editClick(id, editType) {
      this.editId = id
      this.editType = editType
    },
  }
}
</script>

<style>
</style>