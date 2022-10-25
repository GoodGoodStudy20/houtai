<template>
  <div style="width:100%">
    <SmartSigning v-model="showType" v-show="showType==0" ref="list" @edit="editClick" v-bind="$attrs"></SmartSigning>
    <!-- <Form v-model="showType" v-show="showType==1" ref="form1" @edit="editClick" v-bind="$attrs"></Form> -->
  </div>
</template>

<script>
import SmartSigning from './components/SmartSigning.vue'
// import Form from './components/Form.vue'
export default {
  name: 'SmartSigningHome',
  components: { SmartSigning },
  data() {
    return {
      showType: 0,
      editType: '',
      editId: ''
    }
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