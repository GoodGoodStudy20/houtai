<template>
  <el-dialog :title="title" :visible.sync="value" :before-close="dialogClose" :close-on-click-modal="false" width="540px">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-row>
        <el-col :span="21">
          <el-form-item label="部门名称" prop="organizationName">
            <el-input style="width:80%;" placeholder="中英文、字母或数字组合,长度小于16位" v-model="form.organizationName" maxlength="16" :disabled="editShow"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="21">
          <el-form-item label="类型" prop="organizationType">
            <el-radio-group v-model="form.organizationType" :disabled="editShow">
              <el-radio :label="0">机构</el-radio>
              <el-radio :label="1">部门</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-button @click="dialogClose">关闭</el-button>
          <el-button type="primary" v-debounce="onSubmit" v-if="editType!='show'">保存</el-button>
          <!-- <el-button type="primary" v-debounce="onSubmit" v-if="editType == 2">保存</el-button> -->
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>

</template>
<script>
import { addOrganization, editorOrganization, getOrganizationById } from '@/api/index';
export default {
  name: 'OrganizationForm',
  props: ['value', 'editRow', 'editType'],
  data() {
    return {
      isAddDialogTitle: ['新增部门', '部门详情', '编辑部门'],
      organizationList: [],
      form: {
        id: '',    //机构id
        organizationName: '',                   //机构名称
        organizationContact: '',                 // 机构联系人
        organizationContactPhone: '',           //机构联系人手机号
        isApproval: true,                         //是否需要审批 1是 0否
        organizationType: 1,                  // 机构类型 1部门 0机构
        pid: 1,                              // 父机构ID
      },
      rules: {
        organizationName: [
          { required: true, message: '部门名称不可为空', trigger: 'blur' },
        ],
      },

    }
  },
  computed: {
    editShow() {
      return this.editType == 'show'
    },
    title() {
      return this.editType == 'show' ? '部门详情' : this.editType == 'edit' ? '编辑部门' : this.editType == 'add' ? '新增部门' : ''
    }

  },
  created() {
    if (this.editType != 'add') {
      Object.assign(this.form, this.editRow)
    }
  },
  methods: {
    dialogClose() {
      this.$emit('input', false)
    },
    onSubmit() {
      if (!this.$validate('form')) return
      let form = JSON.parse(JSON.stringify(this.form));
      let success = (res) => {
        if (res.code == 200) {
          this.$message.success('操作成功')
          this.$emit('success')
          this.dialogClose();
        } else {
          this.$message.error({
            message: res.msg || res.error_msg,
            duration: 1500
          });
        }
      }
      if (this.editType == 'edit') {
        editorOrganization(form).then(success)
      } else {
        addOrganization(form).then(success)
      }
    },
  },
}
</script>
<style scoped>
.el-form-item {
  text-align: left;
}
.content-text {
  letter-spacing: 1px;
  color: #333333;
  margin: 0px 10px;
  font-size: 16px;
}
</style>