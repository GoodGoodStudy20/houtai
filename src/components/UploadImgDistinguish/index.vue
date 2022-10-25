<template>
  <div style="display:flex">
    <el-upload v-loading.fullscreen.lock="fullscreenLoading" drag v-if="!hideUpload && !disabled" class="avatar-uploader" name="mfile" :multiple="true" :headers="myHeaders" :action="uploadFileUrl" :show-file-list="false" :on-progress="handleFileLoading" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
      <div class="avatar-uploader-icon"><i class="el-icon-plus"></i></div>
    </el-upload>
    <el-image-viewer v-if="dialogVisible" :on-close="onClose" :url-list="[dialogImageUrl]" />
  </div>
</template>
<script>
import { baseURL } from '@/api/http';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { Confirm } from '@/utils/common.js'
export default {
  name: 'UploadImgDistinguish',
  components: { ElImageViewer },
  props: {
    value: String | Array,

    disabled: {
      type: Boolean,
      default: false
    },
    hideUpload: {
      type: Boolean,
      default: false
    },
    hideDelete: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 99
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showViewer: false,
      myHeaders: { 'x-token': sessionStorage.getItem('x-token') },     //设置上传文件请求头
      uploadFileUrl: '',
      dialogVisible: false,
      dialogImageUrl: '',
      list: [],
      fullscreenLoading: false
    }
  },
  created() {
    if (!Array.isArray(this.value) && this.value) {
      this.$emit('input', this.value.split(','));
    }
  },
  mounted() {
    this.uploadFileUrl = this.type == 'invoice' ? baseURL + '/cii-system/invoiceFile/vatInvoice' : baseURL + '/cii-system/returnMoneyApproval/identifyReceipt'
  },
  methods: {
    onClose() {
      this.dialogVisible = false
    },
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        this.fullscreenLoading = false
        this.list = res.data
        // this.$emit('input', [...this.value, res.data]);
        this.$emit('input', [res.data]);
        // this.$emit('changeList')
      } else {
        this.$message.error('上传错误，请稍后重试');
        this.fullscreenLoading = false
      }

    },
    handleFileLoading() {
      this.fullscreenLoading = true
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'application/pdf' || file.type === 'application/ofd';
      const isLt5M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/JPEG/PNG/OFD/PFD 格式!');
      }
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 10MB!');
      }

      return isJPG && isLt5M;
    },
  }
}
</script>
<style scoped>
.img-box {
  position: relative;
}
.img-box:hover .icon-box {
  opacity: 0.5;
}
.avatar {
  width: 100px;
  height: 100px;
  margin: 0 10px;
  /* z-index: 1; */
}
.icon-box {
  position: absolute;
  left: 10px;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  transition: opacity 0.3s;
  height: 100px;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5);
}
.icon-box i {
  cursor: pointer;
}
.avatar-uploader {
  position: relative;
  /* border: 1px solid #b4b4b4; */
  /* width: 100px;
  height: 100px; */
  border-radius: 15px;
  box-sizing: border-box;
  /* padding: 35px; */
  cursor: pointer;
}
::v-deep .el-upload-dragger {
  width: 150px;
  height: 150px;
}
.avatar-uploader-icon {
  width: 150px;
  height: 150px;
  line-height: 150px;
  font-size: 30px;
  color: #b4b4b4;
}
</style>