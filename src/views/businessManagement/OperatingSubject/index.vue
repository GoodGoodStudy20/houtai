<template>
  <div style="width:100%">
    <OperatingSubjectHome v-model="showType" v-show="showType==0" ref="list" @edit="editClick"></OperatingSubjectHome>
  </div>
</template>

<script>
import OperatingSubjectHome from './components/OperatingSubject'
export default {
  name: 'OperatingSubject',
  components: { OperatingSubjectHome },
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