<template>
  <div class="business-item-outer">
    <el-image-viewer v-if="dialogVisibleImg" :on-close="onClose" :url-list="[dialogImageUrl]" :zIndex="20060" />
    <el-dialog title="文件预览" :visible.sync="dialogVisibleFile" :width="dialogWidth" top="0" :before-close="handleClose">
      <iframe v-if="dialogVisibleFile" class="bi_iframe" id="bi_iframe" :src="fileUrl" frameborder="0" scrolling="auto" @load="adjustIframe" width="100%">
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
    <div class="business-item">
      <div class="img-item" v-for="file in fileList" :key="file.url">
        <img class="img" v-if="file && fileType(file.url).indexOf('.pdf') > -1" @click="filePreview(file)" src="@/assets/img/PDF.png" alt="" />

        <img class="img" v-if="
            file &&
            fileType(file.url).indexOf('.xls') > -1 &&
            fileType(file.url).indexOf('.xlsx') < 0
          " src="@/assets/img/excel.png" alt="" @click.stop="filePreview(file)" />

        <img class="img" v-if="file && fileType(file.url).indexOf('.xlsx') > -1" src="@/assets/img/excel.png" alt="" @click="filePreview(file)" />

        <img class="img" v-if="
            file &&
            fileType(file.url).indexOf('.doc') > -1 &&
            fileType(file.url).indexOf('.docx') < 0
          " src="@/assets/img/word.png" alt="" @click="filePreview(file)" />

        <img @click="filePreview(file)" class="img" v-if="file && fileType(file.url).indexOf('.docx') > -1" src="@/assets/img/word.png" alt="" />

        <img @click="onDownload(file)" class="img" v-if="file && fileType(file.url).indexOf('.zip') > -1" src="@/assets/img/压缩文件.png" alt="" />

        <img @click="onDownload(file)" class="img" v-if="file && fileType(file.url).indexOf('.rar') > -1" src="@/assets/img/压缩文件.png" alt="" />

        <img @click="filePreviewImg(file)" class="img" v-if="file && fileType(file.url).indexOf('.jpg') > -1" :src="file.url" alt="" />

        <img @click="filePreviewImg(file)" class="img" v-if="file && fileType(file.url).indexOf('.png') > -1" :src="file.url" alt="" />

        <img @click="filePreviewImg(file)" class="img" v-if="file && fileType(file.url).indexOf('.svg') > -1" :src="file.url" alt="" />
        <el-tooltip effect="light" :content="file.name" placement="right">
          <div v-if="file && fileType(file.url).indexOf('.pdf') > -1" class="item-content" @click.stop="filePreview(file)">
            {{ file.name }}
          </div>
          <div v-if="
              file &&
              fileType(file.url).indexOf('.xls') > -1 &&
              fileType(file.url).indexOf('.xlsx') < 0
            " class="item-content" @click.stop="filePreview(file)">
            {{ file.name }}
          </div>
          <div v-if="file && fileType(file.url).indexOf('.xlsx') > -1" class="item-content" @click.stop="filePreview(file)">
            {{ file.name }}
          </div>
          <div v-if="
              file &&
              fileType(file.url).indexOf('.doc') > -1 &&
              fileType(file.url).indexOf('.docx') < 0
            " class="item-content" @click.stop="filePreview(file)">
            {{ file.name }}
          </div>
          <div v-if="file && fileType(file.url).indexOf('.docx') > -1" class="item-content" @click.stop="filePreview(file)">
            {{ file.name }}
          </div>
          <div v-if="file && fileType(file.url).indexOf('.zip') > -1" class="item-content" @click.stop="onDownload(file)">
            {{ file.name }}
          </div>
          <div v-if="file && fileType(file.url).indexOf('.rar') > -1" class="item-content" @click.stop="onDownload(file)">
            {{ file.name }}
          </div>
          <div v-if="file && fileType(file.url).indexOf('.jpg') > -1" class="item-content" @click.stop="filePreviewImg(file)">
            {{ file.name }}
          </div>
          <div v-if="file && fileType(file.url).indexOf('.png') > -1" class="item-content" @click.stop="filePreviewImg(file)">
            {{ file.name }}
          </div>
          <div v-if="file && fileType(file.url).indexOf('.svg') > -1" class="item-content" @click.stop="filePreviewImg(file)">
            {{ file.name }}
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script>
import ScreenFull from "screenfull/dist/screenfull";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import { baseURL } from "@/api/http";
export default {
  components: { ElImageViewer },
  name: "FileType",
  props: {
    fileList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      dialogVisibleFile: false, // 文件弹窗
      dialogVisibleImg: false, // 图片弹窗
      fileUrl: "", // 文件路径
      dialogImageUrl: "", // 图片路径
      screenFull: true,
      dialogWidth: "70%",
    };
  },
  methods: {
    close() {
      this.dialogVisibleFile = false;
      if (this.screenFull) return;
      this.qp();
    },
    adjustIframe() {
      this.$nextTick(() => {
        let ifm = document.getElementById("bi_iframe");
        ifm.height = document.documentElement.clientHeight - 100;
      });
    },
    qp() {
      this.$nextTick(() => {
        let ifm = document.getElementById("bi_iframe");
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
    // 预览文件
    filePreview(file) {
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
      // window.open(this.fileUrl, "_target"); 在浏览器打开
    },
    // 文件关闭
    handleClose() {
      this.dialogVisibleFile = false;
      if (this.screenFull) return;
      this.qp();
    },
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
  },
};
</script>
<style lang="scss" scoped>
.business-item-outer {
  // display: flex;
}
::v-deep .el-dialog__wrapper {
  // display: none;
  .el-dialog__header {
    padding: 5px;
    .el-dialog__headerbtn {
      top: 10px;
    }
  }
  .el-dialog__body {
    // height: 100vh;
    padding: 0 5px;
  }
  .el-dialog__footer {
    padding: 5px 5px 10px;
  }
}
.business-item {
  // display: flex;
  // flex-wrap: wrap;
  // justify-content: space-around;
  // justify-content: flex-start;
  cursor: pointer;
  .img {
    display: block;
    height: 22px;
    margin-right: 6px;
  }
  .img-item {
    display: flex;
    align-items: center;
    height: 35px;

    .item-content {
      // width: 50%;
      // width: 50%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #303132;
      margin-right: 20px;
      &:hover {
        color: #3a7dff;
      }
    }
    .down-load {
      span {
        display: inline-block;
        margin-right: 10px;
        color: #3a7dff;
        &:hover {
          color: blue;
        }
      }
    }
  }
  .bi_iframe {
    height: 80vh;
  }
  // .img-item:first-child {
  //   width: 89px;
  //   height: 70px;
  //   margin: 0;
  //   cursor: pointer;
  //   .item-content {
  //     overflow: hidden;
  //     text-overflow: ellipsis;
  //     white-space: nowrap;
  //     color: #303132;
  //     &:hover {
  //       color: #3a7dff;
  //     }
  //   }
  // }
  // .img-item:nth-of-type(4) {
  //   margin: 0;
  //   cursor: pointer;
  // }
}
</style>
