<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
};
</script>

<style lang="scss">
html,
body,
#app {
  height: 100%;
  margin: 0;
  width: 100%;
}
#app {
  font-family: "PingFang SC", "Lantinghei SC", "Microsoft YaHei", "HanHei SC",
    "Helvetica Neue", "Open Sans", Arial, "Hiragino Sans GB", "微软雅黑", SimSun,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: #fff;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  background-color: #fff;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(144, 147, 153, 0.3);
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 18px !important;
}
.el-form-item__label {
  font-weight: bold !important;
}
.el-dialog {
  text-align: center;
}
.el-pagination {
  text-align: center;
  margin-top: 10px;
}
.right-button {
  width: 100px !important;
  margin: 6px 0 !important;
}
.top-btn {
  margin: 10px;
}
// .el-collapse {
//   width: 70%;
//   margin: 0 auto;
// }
.el-collapse-item__header {
  background: #0099ff2a !important;
  padding: 0 10px;
  font-weight: bold !important;
}
.el-collapse-item__content {
  padding: 10px;
}
.el-divider--horizontal {
  margin: 5px 0 10px !important;
}
.el-input.is-disabled .el-input__inner,
.el-textarea.is-disabled .el-textarea__inner {
  color: #303132 !important;
}
.btn-box {
  padding: 20px 0;
  width: 100%;
  text-align: center;
}
.form-title {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  padding: 10px 0;
}
.el-tree {
  background: #00000000 !important;
}
.search-box {
  border-radius: 8px;
  background: #fff;
  padding: 21px 10px 0;
  margin-top: 10px;
  text-align: left !important;
}
.table-text {
  color: #0099ff;
  cursor: pointer;
}
.spacel-box {
  .el-input__inner {
    background: #ffffff00 !important;
  }
}
.block-form {
  margin: 0 auto;
  width: 1180px;
}
.cell {
  padding: 0 5px !important;
}
.block-form-flex {
  display: flex;
  flex-wrap: wrap;
}
</style>
