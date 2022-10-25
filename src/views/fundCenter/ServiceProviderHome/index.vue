<template>
  <div style="width:100%">
    <ServiceProviderHome v-model="showType" v-show="showType==0" ref="list" @edit="editClick"></ServiceProviderHome>
    <!-- <DemandForm v-model="showType" :editId="editId" :editType="editType" v-if="showType==1 && (editType =='add' || editType =='edit' || editType =='copy')"></DemandForm>
    <ShowDetail v-model="showType" :editId="editId" :editType="editType" v-if="showType==1 && (editType =='show' || editType =='approve')"></ShowDetail> -->
  </div>
</template>

<script>
import ServiceProviderHome from './components/ServiceProviderHome'
export default {
  name: 'ServiceProvider',
  components: {  ServiceProviderHome },
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