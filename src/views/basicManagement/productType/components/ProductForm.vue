<template>
  <el-dialog :title="editType=='add' ? '新增产品分类':editType == 'show' ?'产品分类详情':'编辑产品分类信息'" :visible.sync="value" :close-on-click-modal="false" :before-close="dialogClose" width="420px">
    <el-form ref="form" :model="form" label-width="auto" size="small">
      <el-row>
        <el-col :span="22">
          <el-form-item label-width="80px" label="产品分类" prop="name" :rules="[{ required: true, message: '产品名称不可为空', trigger: 'blur' }]">
            <el-input v-model="form.name" placeholder="请输入分类名" style="width:270px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label-width="80px" label="服务类型" prop="name" :rules="[{ required: true, message: '服务类型不可为空', trigger: 'blur' }]">
            <el-select v-model="form.type" placeholder="请选择" style="width:270px">
              <el-option v-for="item in severType" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="服务标准" label-width="80px">
            <el-input placeholder="请输入服务标准" style="width:270px" v-model="form.standardService" type="textarea" :disabled="editShow" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-button @click="dialogClose">关闭</el-button>
          <el-button type="primary" v-debounce="onSubmit" v-if="!editShow">保存</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
import { addProductType, updateProductType } from '@/api/index'
import UploadFile from '@/components/UploadFile/index.vue'
export default {
  name: 'ProductForm',
  components: { UploadFile },
  props: ['value', 'editRow', 'editType'],
  data() {
    return {
      roleList: [],
      form: {
        name: '',           //名称
        standardService: '',           //服务标准
        type: ''
      },
      severType: [
        { label: '前置服务', value: 0 },
        { label: '后置服务', value: 1 }
      ]

    }
  },
  computed: {
    editShow() {
      return this.editType == 'show'
    }
  },
  created() {
    if (this.editType != 'add') {
      Object.assign(this.form, this.editRow)
      this.form.settlementListFile = this.form.settlementListFile ? JSON.parse(this.form.settlementListFile) : []
    }
  },
  methods: {
    dialogClose(type) {
      if (type == 1) {
        this.$emit('success')
      }
      this.$emit('input', false)
    },
    onSubmit() {
      if (!this.$validate('form')) return
      let form = JSON.parse(JSON.stringify(this.form));
      form.settlementListFile = JSON.stringify(form.settlementListFile)
      let success = response => {
        if (response.code == 200) {
          this.$message.success('操作成功')
          this.dialogClose(1);
        } else {
          this.$message.error({
            message: response.msg || response.error_msg || '操作失败',
            duration: 1500
          });
        }
      }
      if (this.editType == 'edit') {
        updateProductType(form).then(success)
      } else {
        addProductType(form).then(success)
      }
    }
  },

}
</script>
<style lang="scss" scoped>
.elselect {
  width: 266px;
}
</style>