<template>
  <div style="width:100%">
    <DemandHome v-model="showType" v-show="showType==0" ref="list" @edit="editClick"></DemandHome>
  </div>
</template>

<script>
import DemandHome from './components/DemandHome'
export default {
  name: 'demand',
  components: {  DemandHome },
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