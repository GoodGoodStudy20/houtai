<template>
  <el-dialog :title="type=='edit' ? '编辑角色' : '新增角色'" :visible.sync="value" width="30%" :before-close="dialogClose" :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" label-width="auto">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="roleRemark">
        <el-input v-model="form.roleRemark" type="textarea" :autosize="{ minRows: 2, maxRows: 10}"></el-input>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" v-debounce="onSubmit">确 定</el-button>
      <el-button @click="dialogClose">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>

import { createRole, updateRole } from '@/api/index'
export default {
  name: 'RoleForm',
  props: ['value', 'editItem', 'type'],
  data() {
    return {
      form: {
        roleName: '',                   //角色名称
        roleRemark: '',                    // 备注
        roleId: '',                        //主键
      },
      rules: {
        roleName: [
          { required: true, message: '角色名称不可为空', trigger: 'blur' },
        ],
      },
      disabled: false

    }
  },
  created() {
    if (this.type == "edit") {
      Object.assign(this.form, this.editItem)
    }
  },
  methods: {
    dialogClose() {
      this.$emit('input', false)
    },
    onSubmit() {
      if (!this.$validate('form')) {
        return
      }
      let success = res => {
        this.$message.success('操作成功')
        this.dialogClose()
        this.$emit('success')
      }
      if (this.type == "edit") {//修改
        updateRole(this.form).then(success).catch(err => {
          this.$message.error('修改失败')
        })
      } else {//新增
        createRole(this.form).then(success).catch(err => {
          this.$message.error('添加失败')
        })
      }
    }
  }
}
</script>