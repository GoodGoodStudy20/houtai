<template>
  <div>
    <el-image-viewer v-if="dialogVisibleImg" :on-close="onClose" :url-list="[dialogImageUrl]" :zIndex="20060" />
    <el-dialog title="文件预览" :visible.sync="dialogVisibleFile" width="100%" top="0" :before-close="handleClose">
      <iframe v-if="dialogVisibleFile" id="bi_iframe2" class="bi_iframe2" :src="fileUrl" frameborder="0" scrolling="auto" @load="adjustIframe" width="100%">
      </iframe>
      <span slot="footer" class="dialog-footer">
        <span>可能因为网络波动导致加载过慢，请稍后；加载失败，请刷新或下载&nbsp;&nbsp;</span>
        <el-button type="primary" @click="onDownload(itemFile)">下 载<i class="el-icon-download el-icon--right"></i></el-button>
        <el-button type="primary" @click="qp">{{
          screenFull ? "全 屏" : "恢 复"
        }}</el-button>
        <el-button type="primary" @click="fileUrl = fileUrl + '&a=1'">刷新</el-button>
        <el-button type="primary" @click="close">关 闭</el-button>
      </span>
    </el-dialog>
    <el-upload v-if="value.length < limit" :disabled="disabled" ref="upload" :accept="accept" name="mfile" :action="url" :multiple="limit > 1" :before-remove="handleTip" :show-file-list="false" :on-remove="handleRemove" :on-success="handleSuccess" :headers="headers" :on-progress="onProgress" :on-error="onError" :limit="limit">
      <span slot="tip" style="margin-left:20px;color:red" v-if="isShow">(*只允许上传Excel文件)</span>
      <el-button :disabled="disabled" class="el-icon-upload" size="small" type="primary" v-if="!disabled">点击上传</el-button>
    </el-upload>
    <!-- <br> -->
    <ul class="el-upload-list el-upload-list--text">
      <li v-for="(item, i) in fileList" :key="i" class="el-upload-list__item is-success">
        <span class="el-upload-list__item-name" target="_blank" @click="filePreview(item)"><i class="el-icon-document"></i>{{ fileName ? fileName : item.name }}</span>
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-circle-check"></i>
        </label>
        <i class="el-icon-close" @click="deleteImg(i)" v-if="!disabled"></i>
      </li>
    </ul>
  </div>
</template>

<script>
import ScreenFull from "screenfull/dist/screenfull";
import { baseURL } from "@/api/http";
import { Confirm } from "@/utils/common.js";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
  components: { ElImageViewer },
  name: "UploadFile",
  props: {
    value: String | Array,
    title: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: 99,
    },
    fileName: {
      type: String,
      default: "",
    },
    accept: {
      type: String,
      default: "*",
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      url: baseURL + "/cii-system/uploadFile/baiduUploadFile",
      headers: { "x-token": sessionStorage.getItem("x-token") }, //设置上传文件请求头
      loading: false,
      list: [],
      dialogVisibleFile: false, // 文件弹窗
      dialogVisibleImg: false, // 图片弹窗
      fileUrl: "", // 文件路径
      dialogImageUrl: "", // 图片路径
      itemFile: {}, // 当前点击的文件
      screenFull: true,
      dialogWidth: "70%",
    };
  },
  created() {
    if (this.value && !Array.isArray(this.value)) {
      this.$emit("input", JSON.parse(this.value));
    }
  },
  computed: {
    fileList() {
      return this.value.map((item) => item) || [];
    },
  },
  methods: {
    handleSuccess(e, file) {
      if (this.title) {
        localStorage.setItem("fileName", file.name);
      }

      if (e.code == 200) {
        let data = e.data || {};
        this.$emit("input", [...this.value, { name: file.name, url: data }]);
      }
      this.$message({
        message: e.msg || e.error_msg || e.message,
        type: e.code == 200 ? "success" : "error",
      });
    },
    handleTip() {
      return this.$confirm("确定删除该文件？");
    },
    handleRemove(file, fileList) {
      let list = JSON.parse(JSON.stringify(fileList));
      // let index = fileList.findIndex(item => item.uid == file.uid)
      // list.splice(index, 1)
      this.$emit("input", list);
      this.$message.success("删除成功");
    },
    onProgress() {
      this.loading = true;
    },
    onError() {
      this.loading = false;
    },
    deleteImg(index) {
      Confirm("确认删除此附件吗?", () => {
        let list = JSON.parse(JSON.stringify(this.value));
        list.splice(index, 1);
        this.$emit("input", list);
        this.$message.success("删除成功!");
      });
    },

    // 预览文件
    // 预览图片
    filePreviewImg(url) {
      if (url) {
        this.dialogImageUrl = url.url;
        this.dialogVisibleImg = true;
      }
    },
    // 图片关闭
    onClose() {
      this.dialogVisibleImg = false;
    },
    fileType(file) {
      if (file) {
        if (file.indexOf("?") != -1) {
          file = file.slice(0, file.indexOf("?")).toLowerCase();
        }
        return file;
      }
    },
    filePreview(file) {
      if (
        file.name.toLowerCase().indexOf(".jpg") > -1 ||
        file.name.toLowerCase().indexOf(".png") > -1 ||
        file.name.toLowerCase().indexOf(".svg") > -1
      ) {
        this.filePreviewImg(file);
        return;
      }
      this.itemFile = file;
      if (file && this.fileType(file.url).indexOf(".pdf") > -1) {
        this.fileUrl = file.url;
      } else {
        let routeUrl = file.url;
        let url = encodeURIComponent(routeUrl);
        this.fileUrl =
          "https://view.officeapps.live.com/op/view.aspx?src=" + url;
      }
      this.dialogVisibleFile = true;
      // window.open(this.fileUrl, "_target");
      // 在浏览器打开;
    },
    onDownload(item) {
      if (
        item.name.toLowerCase().indexOf(".pdf") > -1 ||
        item.name.toLowerCase().indexOf(".jpg") > -1 ||
        item.name.toLowerCase().indexOf(".png") > -1 ||
        item.name.toLowerCase().indexOf(".svg") > -1
      ) {
        window.open(item.url);
      } else {
        let data = {
          fileName: item.name.split(".")[0],
          fileUrl: item.url,
        };
        let paramList = [];
        for (let i in data) {
          paramList.push(`${i}=${data[i]}`);
        }
        let aurl = `${baseURL}/cii-system/uploadFile/getFile?${paramList.join(
          "&"
        )}`;
        window.location.href = aurl;
      }
    },
    // 文件关闭
    handleClose() {
      this.dialogVisibleFile = false;
      if (this.screenFull) return;
      this.qp();
    },
    close() {
      this.dialogVisibleFile = false;
      if (this.screenFull) return;
      this.qp();
    },
    adjustIframe() {
      this.$nextTick(() => {
        let ifm = document.getElementById("bi_iframe2");
        ifm.height = document.documentElement.clientHeight - 100;
      });
    },
    qp() {
      this.$nextTick(() => {
        let ifm = document.getElementById("bi_iframe2");
        ScreenFull.toggle();
        this.screenFull = ScreenFull.isFullscreen; // false 全屏
        if (!this.screenFull) {
          // 全屏
          this.dialogWidth = "100%";
          ifm.height = document.documentElement.clientHeight + 20;
        } else {
          this.dialogWidth = "70%";
          ifm.height = document.documentElement.clientHeight - 220;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__wrapper {
  // display: none;
  .el-dialog__header {
    padding: 5px;
    .el-dialog__headerbtn {
      top: 10px;
    }
  }
  .el-dialog__body {
    padding: 0 5px;
  }
  .el-dialog__footer {
    padding: 5px 5px 10px;
  }
}
.bi_iframe2 {
  height: 80vh;
}
</style>