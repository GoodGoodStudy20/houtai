<template>
  <div style="width:100%">
    <CustomerHome v-model="showType" v-show="showType==0" ref="list" @edit="editClick"></CustomerHome>
  </div>
</template>

<script>
import CustomerHome from './components/CustomerHome'
export default {
  name: 'CustomerHome1',
  components: { CustomerHome },
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