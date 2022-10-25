<template>
  <el-dialog :title="menuType=='edit' ? '编辑菜单' : '新增菜单'" :visible.sync="value" width="400px" :close-on-click-modal="false" :before-close="dialogClose">
    <el-form ref="form" :model="form" label-width="auto">
      <el-form-item label="菜单名称" prop="label" :rules="[{ required: true, message: '菜单名称不可为空', trigger: 'blur' }]">
        <el-input v-model="form.label"></el-input>
      </el-form-item>
      <el-form-item label="菜单编码">
        <el-input v-model="form.menuCode"></el-input>
      </el-form-item>
      <el-form-item label="菜单图标">
        <ChooseIcon v-model="form.menuIcon"></ChooseIcon>
      </el-form-item>
      <el-form-item label="上传图片">
        <UploadImg v-model="customIcon" :limit="1"></UploadImg>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="form.menuSort"></el-input>
      </el-form-item>
      <el-form-item label="请求路径">
        <el-input v-model="form.path"></el-input>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" v-debounce="onSubmit" :disabled="disabled">确 定</el-button>
      <el-button @click="dialogClose">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>

import { addMenu, updateMenu } from '@/api/index'
import UploadImg from '@/components/UploadImg/index.vue'
import ChooseIcon from '@/components/ChooseIcon/index.vue'
export default {
  props: ['value', 'menuRow', 'menuType'],
  components: { ChooseIcon, UploadImg },
  data() {
    return {
      form: {
        label: '',          //菜单名称
        menuCode: '',          //菜单编码
        menuIcon: '',          //菜单图标
        menuLevel: '',          //菜单级别(1.一级菜单,2.二级菜单等以此类推)
        menuSort: '',          //排序
        parentId: '',          //父级菜单id
        path: '',          //请求路径
        customIcon: [],//菜单图片
      },
      customIcon: [],
      disabled: false

    }
  },
  created() {
    if (this.menuType == 'edit') {
      this.customIcon.push(this.menuRow.customIcon)
      // this.customIcon = this.menuRow.customIcon ? JSON.parse(this.menuRow.customIcon) : [];
      Object.assign(this.form, this.menuRow)
    } else {
      this.form.parentId = this.menuRow.id || 0
      this.form.menuLevel = Number(this.menuRow.menuLevel || 0) + 1
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
      this.form.customIcon = String(this.customIcon)
      let success = res => {
        if (res.code == 200) {
          this.$message.success('操作成功')
          this.$emit('success')
          this.dialogClose()
        }
      }
      if (this.menuType == "edit") {//修改
        updateMenu(this.form).then(success).catch(err => {
          this.$message.error('修改失败')
        })
      } else {//新增
        addMenu(this.form).then(success).catch(err => {
          this.$message.error('添加失败')
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-tree-node {
  width: 300px;
  display: flex;
  justify-content: space-between;
}
</style>