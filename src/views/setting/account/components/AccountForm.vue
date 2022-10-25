<template>
  <el-dialog :title="editType == 'add' ? '新增人员' : editType == 'show' ? '人员详情' : '编辑人员信息'" :visible.sync="value" :close-on-click-modal="false" :before-close="dialogClose" width="420px">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="22">
          <el-form-item label="归属部门" prop="organizationOrg">
            <ChooseOrganization v-model="form.organizationOrg" :disabled="editShow" :showAll="false">
            </ChooseOrganization>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="姓名" prop="name">
            <el-input placeholder="请输入用户昵称(中英文字母或数字组合,长度小于16位)" v-model="form.name" maxlength="16" :disabled="editShow">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="手机号码" prop="phone">
            <el-input placeholder="请输入电话(7-11位数字)" v-model="form.phone" oninput="value=value.replace(/[^\d]/g,'')" maxlength="11" :disabled="editShow"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="form.roleId" :disabled="editShow" style="width:100%">
              <el-option v-for="(item, index) in roleList" :key="index" :label="item.roleName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="导出权限" prop="orgDate">
            <el-select v-model="form.exportPermission" placeholder="请选择" style="width:100%">
              <el-option v-for="item in exportPermission" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="数据权限" prop="orgDate">
            <ChooseOrganization v-model="form.orgDate" :disabled="editShow" multiple></ChooseOrganization>
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
import ChooseOrganization from '@/components/ChooseOrganization/index.vue'
import { addUser, updateUser, getRoleAll } from '@/api/index'
export default {
  name: 'AccountForm',
  components: { ChooseOrganization },
  props: ['value', 'editRow', 'editType'],
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('电话不可为空'));
      }
      if (value.length < 6) {
        return callback(new Error('号码至少7位以上'));
      }
    };
    return {
      exportPermission: [
        { value: 1, label: "是" },
        { value: 0, label: "否" },
      ],
      roleList: [],
      form: {
        organizationOrg: '',
        isReport: 1,
        roleId: '',                  // 0:管理人员，1：业务人员
        name: '',              // 用户名称
        phone: '',           // 手机号
        orgDate: '',//数据权限
        exportPermission: 0, // 导出权限 0 否, 1 是
      },
      rules: {
        name: [
          { required: true, message: '名称不可为空', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '联系电话不可为空', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        organizationOrg: [
          { required: true, message: '请选择部门', trigger: 'change' },
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' },
        ],
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
    this.getRoleAll();
  },
  methods: {
    getRoleAll() {
      getRoleAll().then((response) => {
        this.roleList = response.data;
      });
    },
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
          this.$message({
            message: response.msg,
            type: 'success'
          });
          this.dialogClose(1);
        } else {
          this.$message.error({
            message: response.msg || response.error_msg,
            duration: 1500
          });
        }
      }
      if (this.editType == 'edit') {
        updateUser(form).then(success)
      } else {
        addUser(form).then(success)
      }
    }
  },

}
</script>