<template>
  <div style="display:flex">
    <div v-for="(item,i) in value" :key="i" class="img-box">
      <el-image :src="item" class="avatar" :preview-src-list="value" @click.stop="handleClickItem"></el-image>
      <div class="icon-box" v-if="!hideDelete && !disabled">
        <i class="el-icon-zoom-in" @click="showBig(item)"></i>
        <i class="el-icon-delete" @click="deleteImg(i)"></i>
      </div>
    </div>
    <el-upload v-if="!hideUpload && !disabled && value.length<limit" :accept="accept" class="avatar-uploader" name="mfile" :multiple="limit>1" :headers="myHeaders" :action="uploadFileUrl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
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
  name: 'UploadImg',
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
      default: 1
    },
    accept: {
      type: String,
      default: '*'
    }
  },
  data() {
    return {
      showViewer: false,
      myHeaders: { 'x-token': sessionStorage.getItem('x-token') },     //设置上传文件请求头
      uploadFileUrl: baseURL + '/cii-system/uploadFile/baiduUploadFile',
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  created() {
    if (!Array.isArray(this.value) && this.value) {
      this.$emit('input', this.value.split(','));
    }
  },
  methods: {
    showBig(img) {
      this.dialogVisible = true
      this.dialogImageUrl = img
      this.handleClickItem()
    },
    onClose() {
      this.dialogVisible = false
    },
    deleteImg(index) {
      Confirm('确认删除此照片吗?', () => {
        let list = JSON.parse(JSON.stringify(this.value))
        list.splice(index, 1)
        this.$emit('input', list);
        this.$message.success('删除成功!');
      })
    },
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        this.$emit('input', [...this.value, res.data]);
      } else {
        this.$message.error('上传错误，请稍后重试');
      }

    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/svg';
      const isLt5M = file.size / 5120 / 5120 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/JPEG/PNG/SVG 格式!');
      }
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
      }
      return isJPG && isLt5M;
    },
    handleClickItem() {
      this.$nextTick(() => {
        let domImageMask = document.querySelector(".el-image-viewer__mask");  // 获取遮罩层dom
        if (!domImageMask) {
          return;
        }
        domImageMask.addEventListener("click", () => {
          // 点击遮罩层时调用关闭按钮的 click 事件
          document.querySelector(".el-image-viewer__close").click();
        });
      })
    }
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
  border: 1px solid #b4b4b4;
  width: 100px;
  height: 100px;
  border-radius: 15px;
  box-sizing: border-box;
  /* padding: 35px; */
  cursor: pointer;
}
.avatar-uploader-icon {
  width: 100px;
  height: 100px;
  line-height: 100px;
  font-size: 30px;
  color: #b4b4b4;
}
</style>