<template>
  <el-form class="block-form" v-loading="loading">
    <el-form-item label="Excel模板">
      <a style="margin:0px;" href="https://template.gongxingtech.com/支付清单.xlsx">下载模板</a>
    </el-form-item>
    <div class="file-container">
      <el-form-item>
        <div class="primary-file">
          <div class="file-type">客户原文件上传</div>
          <UploadFile v-model="form.primaryIssueDetailedListFile" :disabled="disabled" style="width:500px"></UploadFile>
        </div>
      </el-form-item>

      <el-form-item required>
        <!-- <UploadFile v-model="form.issueDetailedFile" :disabled="disabled" style="width:500px"></UploadFile> -->
        <div class="file-type">支付清单文件上传</div>

        <el-upload ref="upload" accept=".xls, .xlsx" :show-file-list="false" :action="url" :data="{isIntegral}" :before-remove="handleTip" :on-remove="handleRemove" :on-success="handleSuccess" :headers="headers" :on-progress="onProgress" :on-error="onError" :limit="1">
          <el-button size="small" type="primary">点击上传</el-button>
          <span slot="tip" style="margin-left:20px;color:red" v-if="!fileName">(*只允许上传Excel文件)</span>
        </el-upload>
        <ul class="el-upload-list el-upload-list--text file-list">
          <li v-for="(item,i) in fileList" :key="i" class="el-upload-list__item is-success">
            <span class="el-upload-list__item-name" target="_blank" @click="onDownload(item)"><i class="el-icon-document"></i>{{fileName?fileName:item.name}}</span>
            <label class="el-upload-list__item-status-label">
              <i class="el-icon-upload-success el-icon-circle-check"></i>
            </label>
            <i class="el-icon-close" @click="deleteImg(i)" v-if="!disabled"></i>
          </li>
        </ul>
      </el-form-item>
    </div>
    <ResultDialog v-model="showDialog" @delate="delate" :errorList="errorList"></ResultDialog>
  </el-form>
</template>

<script>
import UploadFile from '@/components/UploadFile/index.vue'
import ResultDialog from './ResultDialog.vue'
import { baseURL } from "@/api/http";
import { Confirm } from '@/utils/common.js'
export default {
  name: 'Form6',
  components: { ResultDialog, UploadFile },
  props: ['disabled'],
  data() {
    return {
      form: {
        detailedListFile: [],//清单文件
        issueDetailedFile: [],//下发清单
        primaryIssueDetailedListFile: [],//原下发清单
      },
      url: baseURL + '/cii-system/paymentDetailedFile/analysisPaymentDetailedFile',
      headers: { 'x-token': sessionStorage.getItem('x-token') },     //设置上传文件请求头
      loading: false,
      fileName: '',
      showDialog: false,
      errorList: [],
      list: [],
      isIntegral: '',
      isOilCoupon: '',
      businessType: ''
    }
  },
  computed: {
    fileList() {
      return this.form.issueDetailedFile.map(item => item) || []
    }
  },
  created() {

    this.$bus.$on('isIntegralChange', res => {
      this.isIntegral = res
    })
    this.$bus.$on('oilCouponChange', res => {
      this.isOilCoupon = res
    })
  },
  methods: {
    change(type) {
      this.businessType = type

    },
    deleteImg(index) {
      Confirm('确认删除此附件吗?', () => {
        this.form.issueDetailedFile.splice(index, 1)
        this.$message.success('删除成功!');
        this.$refs['upload'].clearFiles()
      })
    },
    delate() {
      this.form.issueDetailedFile.splice(0, 1)
      // this.$message.success('删除成功!');
      this.$refs['upload'].clearFiles()
    },
    onDownload(item) {
      if (item.name.indexOf('.pdf') > -1) {
        window.open(item.url)
      } else {
        let data = {
          fileName: item.name.split('.')[0],
          fileUrl: item.url
        }
        let paramList = []
        for (let i in data) {
          paramList.push(`${i}=${data[i]}`)
        }
        let aurl = `${baseURL}/cii-system/uploadFile/getFile?${paramList.join('&')}`
        window.location.href = aurl
      }
    },
    handleTip(e) {
      return this.$confirm('确定删除该文件？')
    },
    handleSuccess(e, file) {
      if (e.code == 200) {
        this.loading = false
        this.fileName = file.name;
        let data = e.data || {}
        this.list = Array.isArray(data) ? data : data.list;
        console.log(data.totalAmount);
        if(data.totalAmount){
          this.$emit('totalAmountChange',data.totalAmount)
        }
        this.errorList = data.errorList || []
        this.form.issueDetailedFile.push(
          {
            name: file.name || '',
            url: data.fileUrl || ''
          }
        )
        if (this.errorList.length > 0) {
          this.showDialog = true
        }
        this.$message.success('上传成功')
      } else {
        this.loading = false
        this.$refs['upload'].clearFiles()
        this.$message.error('上传失败')
      }
    },
    handleRemove() {
      this.list = []
      this.errorList = []
      this.fileName = ''
      this.$message.success('删除成功')
    },
    onProgress() {
      this.loading = true
    },
    onError() {
      this.loading = false
    },
    onload(obj) {
      this.isIntegral = obj.isIntegral
      this.isOilCoupon = obj.isOilCoupon
      this.form.detailedListFile = obj.detailedListFile ? JSON.parse(obj.detailedListFile) : []
      this.form.issueDetailedFile = obj.issueDetailedFile ? JSON.parse(obj.issueDetailedFile) : []
      this.form.primaryIssueDetailedListFile = obj.primaryIssueDetailedListFile ? JSON.parse(obj.primaryIssueDetailedListFile) : []
    },
    commit() {
      if (this.businessType != 0) {
        if (!this.form.issueDetailedFile || !this.form.issueDetailedFile.length) {
          this.$message.warning('请上传支付清单')
          return
        }
        if (!this.form.primaryIssueDetailedListFile || !this.form.primaryIssueDetailedListFile.length) {
          this.$message.warning('请上传支付清单原文件')
          return
        }
        if (this.errorList.length > 0) {
          this.$message.warning('请修改并上传支付清单')
          return
        }
      }
      // if (!this.form.detailedListFile || !this.form.detailedListFile.length) {
      //   this.$message.warning('请上传清单文件')
      //   return
      // }
      let obj = Object.assign({}, this.form)
      obj.detailedListFile = JSON.stringify(obj.detailedListFile)
      obj.issueDetailedFile = JSON.stringify(obj.issueDetailedFile)
      obj.primaryIssueDetailedListFile = JSON.stringify(obj.primaryIssueDetailedListFile)
      return obj
    }
  }
}
</script>

<style lang="scss" scoped>
.file-list {
  width: 300px;
}
.file-type {
  font-weight: 700;
  margin: 10px 0;
  color: #606266;
}
.file-container {
  display: flex;
  .primary-file {
    margin-right: 50px;
  }
}
</style>