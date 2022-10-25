<template>
  <el-dialog :title="editType=='add' ? '新增产品':editType == 'show' ?'产品详情':'编辑产品信息'" :visible.sync="value" :close-on-click-modal="false" :before-close="dialogClose" width="420px">
    <el-form ref="form" :model="form" label-width="auto" size="small">
      <el-row>
        <el-col :span="22">
          <el-form-item label-width="80px" label="产品分类" prop="name" :rules="[{ required: true, message: '产品分类不可为空', trigger: 'blur' }]">
            <el-select class="elselect" v-model="form.productTypeId" placeholder="请选择">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="产品名称" prop="name" :rules="[{ required: true, message: '产品名称不可为空', trigger: 'blur' }]">
            <el-input placeholder="请输入产品名称" v-model="form.name" maxlength="16" :disabled="editShow"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="价格（元）">
            <el-input placeholder="请输入价格" v-model="form.startPrice" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" :disabled="editShow" style="width:120px"></el-input> 至
            <el-input placeholder="请输入价格" v-model="form.endPrice" oninput="value=value.replace(/[^\d.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" :disabled="editShow" style="width:124px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="结算单模板">
            <UploadFile v-model="form.settlementListFile" :limit="1"></UploadFile>
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item label="服务标准">
            <el-input placeholder="请输入服务标准" v-model="form.standardService" type="textarea" :disabled="editShow" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
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
import { addProduct, updateProduct, getProductTypeList } from '@/api/index'
import UploadFile from '@/components/UploadFile/index.vue'
export default {
  name: 'ProductForm',
  components: { UploadFile },
  props: ['value', 'editRow', 'editType'],
  data() {
    return {
      options: [],
      roleList: [],
      form: {
        productTypeId: '',
        name: '',           //名称
        startPrice: '',           //开始价格(元)
        endPrice: '',           //结束价格(元)
        settlementListFile: [],     //结算单模板
        standardService: '',           //服务标准
      },

    }
  },
  computed: {
    editShow() {
      return this.editType == 'show'
    }
  },
  created() {
    getProductTypeList({}).then((res) => {
      this.options = res.data

    })
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
        updateProduct(form).then(success)
      } else {
        addProduct(form).then(success)
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