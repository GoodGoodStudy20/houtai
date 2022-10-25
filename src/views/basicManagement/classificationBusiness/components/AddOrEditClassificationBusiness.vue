<template>
  <el-dialog :title="editType=='add' ? '新增经营范围分类':editType == 'show' ?'经营范围分类详情':'编辑经营范围分类信息'" :visible.sync="value" :close-on-click-modal="false" :before-close="dialogClose" width="420px">
    <el-form ref="form" :model="form" label-width="auto" size="small">
      <el-row>
        <el-col :span="22">
          <el-form-item label="分类名称" prop="name" :rules="[{ required: true, message: '分类名称不可为空', trigger: 'blur' }]">
            <el-input v-model="form.name" :disabled="editShow" placeholder="请输入分类名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="名称说明">
            <el-input placeholder="请输入分类名称" v-model="form.remark" type="textarea" :disabled="editShow" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-button @click="dialogClose">关闭</el-button>
          <el-button type="primary" v-debounce="onSubmit" v-if="!editShow">提交</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
import { addBusinessScopeType, updateBusinessScopeType } from '@/api/index'
export default {
  name: 'AddOrEditClassificationBusiness',
  props: ['value', 'editRow', 'editType'],
  data() {
    return {
      roleList: [],
      form: {
        name: '',           //名称
        remark: '',           //说明
      },

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
        updateBusinessScopeType(form).then(success)
      } else {
        addBusinessScopeType(form).then(success)
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