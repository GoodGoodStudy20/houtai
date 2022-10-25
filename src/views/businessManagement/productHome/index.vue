<template>
  <div style="width:100%">
    <productHome v-model="showType" v-show="showType==0" ref="list" @edit="editClick"></productHome>
  </div>
</template>

<script>
import productHome from './components/productHome'
export default {
  name: 'product',
  components: { productHome },
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