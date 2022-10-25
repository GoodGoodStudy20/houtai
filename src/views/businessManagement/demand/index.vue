<template>
  <div style="width:100%">
    <DemandList v-model="showType" v-show="showType==0" ref="list" @edit="editClick"></DemandList>
    <DemandForm v-model="showType" :editId="editId" :editType="editType" v-if="showType==1 && (editType =='add' || editType =='edit' || editType =='copy')"></DemandForm>
    <ShowDetail v-model="showType" :editId="editId" :editType="editType" v-if="showType==1 && (editType =='show' || editType =='approve')"></ShowDetail>
  </div>
</template>

<script>
import DemandForm from './components/DemandForm'
import DemandList from './components/DemandList'
import ShowDetail from './components/ShowDetail'
export default {
  name: 'demand',
  components: { DemandForm, DemandList, ShowDetail },
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