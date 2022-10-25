<template>
  <el-container class="box">
    <el-container>
      <el-aside style="height: 100vh; background-color: #394067; overflow-x: hidden" :style="{ width: collapse ? '64px' : '210px' }">
        <div class="left-title" v-show="!collapse">
          <p>CII</p>
          <p>共幸供应链系统</p>
        </div>
        <!-- :default-active="$route.fullPath" -->
        <el-menu :collapse="collapse" style="border-right: none !important" background-color="#394067" :unique-opened="true" text-color="#fff" active-text-color="#D9B166" @select="menuClick">
          <Submenu :list="menuTree" :collapse="collapse"></Submenu>
        </el-menu>
      </el-aside>
      <div class="box2">
        <div class="top-box">
          <el-tooltip class="item" effect="dark" :content="collapse ? '展开菜单栏' : '收起菜单栏'" placement="bottom">
            <i :class="collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="collapse = !collapse" style="cursor: pointer"></i>
          </el-tooltip>
          <!-- <div class="tab-container">
            <el-tabs v-model="tabActive" type="border-card" v-show="tabList.length" closable @tab-remove="removeTab" class="tabs" @tab-click="clickTab">
              <el-tab-pane v-for="(item, i) in tabList" :key="i" :label="item.name" :name="item.path"></el-tab-pane>
            </el-tabs>
          </div> -->
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ sysName }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="changePwd">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="view-box" id="viewBox">
          <!-- <el-tabs v-model="tabActive" type="border-card" v-show="tabList.length" closable @tab-remove="removeTab" class="tabs" @tab-click="clickTab">
            <el-tab-pane v-for="(item, i) in tabList" :key="i" :label="item.name" :name="item.path"></el-tab-pane>
          </el-tabs> -->
          <!-- <keep-alive :include="keepList"> -->
          <router-view :key="$route.fullPath" ref="route"></router-view>
          <!-- </keep-alive> -->
          <!-- <keep-alive :include="keepList" :exclude="excludeList">
            <router-view :key="$route.fullPath" ref="route" @reomve="removeTab"></router-view>
          </keep-alive> -->
        </div>
      </div>
    </el-container>
    <ChangePassword :show.sync="changePwdDialog" :sysId="sysId"></ChangePassword>
  </el-container>
</template>
<script>
import ChangePassword from "@/components/ChangePassword/index";
import Submenu from "@/components/Submenu/index";
import { mapGetters } from "vuex";
export default {
  name: "index",
  components: { ChangePassword, Submenu },
  data() {
    return {
      TabsMenuValue: "/default",
      TabsMenuArr: [],
      changePwdDialog: false,
      sysName: "",
      sysPhone: "",
      sysId: "",
      organizationName: "",
      menuTree: [],
      collapse: false,
      excludeList: ["order", "orderDetail"],
      tabList: [
        {
          path: "/default",
          pathName: "default",
          name: "首页",
          fullPath: "/default",
        },
      ],
      tabActive: "",
    };
  },
  computed: {
    ...mapGetters(["keepList"]),
  },
  created() {
    // this.addTab(this.$route)
    this.menuTree = JSON.parse(sessionStorage.getItem("menuList"));
    let user = JSON.parse(sessionStorage.getItem("user")) || {};
    this.sysId = user.id;
    this.sysName = user.name;
    this.sysPhone = user.phone;
    this.organizationName = user.organizationOrgName;
  },
  mounted() {
    this.waterMark();
  },
  // watch: {
  //   $route(to, from) {
  //     this.addTab(to)
  //   }
  // },
  methods: {
    addTab(to) {
      if (
        this.tabList.findIndex((item) => item.name == to.meta.name) == -1 &&
        to.meta.keepAlive
      ) {
        this.tabList.push({
          ...to.meta,
          path: to.path,
          pathName: to.name,
          fullPath: to.fullPath,
        });
      } else {
        this.tabList.forEach((item) => {
          if (item.name == to.meta.name) {
            item.pathName = to.meta.name;
            item.fullPath = to.fullPath;
          }
        });
      }
      this.tabActive = to.meta.keepAlive ? to.path : "";
    },
    clickTab() {
      let fullPath =
        this.tabList.find((item) => item.path == this.tabActive) || {};
      this.$router.push(fullPath.fullPath);
    },
    removeTab(targetName) {
      if (this.tabActive === targetName) {
        this.tabList.forEach((tab, index) => {
          if (tab.path === targetName) {
            let nextTab = this.tabList[index + 1] || this.tabList[index - 1];
            if (nextTab) {
              this.tabActive = nextTab.path;
              this.$router.push(nextTab.path);
            }
          }
        });
      }
      this.tabList = this.tabList.filter((tab) => tab.path !== targetName);
    },
    changePwd() {
      this.changePwdDialog = true;
    },
    // 左侧菜单 点击跳转
    async menuClick(path) {
      this.getMenu(this.menuTree, path);
      if (this.$route.path == path) {
        this.$refs["route"] ? (this.$refs["route"].showType = 0) : "";
        return;
      }
      this.$router.push({ path: path });
    },
    getMenu(list, path) {
      list.map((item) => {
        if (item.path == path && path != "/default") {
          this.$store.commit("addMenuList", item);
          return;
        }
        if (item.child && item.child.length) {
          this.getMenu(item.child, path);
        }
      });
    },
    //退出登录
    logOut() {
      this.TabsMenuArr = [];
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("x-token");
      this.$router.replace("/login");
    },
    waterMark() {
      //添加水印
      // let setWatermark = () => {
      let id = "1.23452384164.123412416";
      // if (document.getElementById(id) !== null) {
      //   document.body.removeChild(document.getElementById(id));
      // }
      //创建一个画布
      let can = document.createElement("canvas");
      //设置画布的长宽
      can.width = 300;
      can.height = 200;
      let cans = can.getContext("2d");
      //旋转角度
      cans.rotate((-15 * Math.PI) / 180);
      cans.font = "18px Vedana";
      //设置填充绘画的颜色、渐变或者模式
      cans.fillStyle = "rgba(200, 200, 200, 0.40)";
      //设置文本内容的当前对齐方式
      cans.textAlign = "center";
      //设置在绘制文本时使用的当前文本基线
      cans.textBaseline = "Middle";
      //在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
      cans.fillText(this.sysName, can.width / 8, can.height / 1.8);
      cans.font = "14px Vedana";
      cans.fillText(this.sysPhone, can.width / 8, can.height / 1.5);
      let div = document.createElement("div");
      div.id = id;
      div.style.pointerEvents = "none";
      div.style.top = "0px";
      div.style.left = "200px";
      // div.style.position = 'absolute';
      div.style.position = "fixed";
      div.style.zIndex = "100000";
      div.style.width = "100%";
      div.style.height = "100%";
      div.style.background =
        "url(" + can.toDataURL("image/png") + ") left top repeat";
      if (!document.getElementById("viewBox")) return false;
      document.getElementById("viewBox").appendChild(div);
    },
  },
};
</script>

<style lang="scss" scoped>
$themeColor: #0099ff;
.box {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .box2 {
    width: 100%;
    overflow: auto;
    // padding: 10px;
    box-sizing: border-box;
    border-left: 1px solid #eee;
  }
}
.el-dropdown {
  cursor: pointer;
}
.el-container {
  height: 100%;
}
.left-title {
  margin: 40px 0 50px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  color: #ffffff;
  p:nth-child(1) {
    font-size: 24px;
  }
}
.top-box {
  box-sizing: border-box;
  // background-color: $themeColor;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  width: 100%;
  padding: 0 10px;
  position: relative;
  .tab-container {
    position: absolute;
    left: 80px;
  }
}
::v-deep .el-tabs--border-card {
  box-shadow: none;
}
.view-box {
  box-sizing: border-box;
  background: #f0f2fa;
  padding: 10px;
  height: calc(100vh - 60px);
  overflow-y: auto;
  position: relative;
}
.el-header span {
  color: #ffffff;
}
.el-tab-pane {
  font-size: 16px;
}

.el-container .el-aside,
.el-menu {
  color: #333;
}
.el-main {
  background-color: #ffffff;
  color: #333;
  // text-align: center;
  padding-top: 5px !important;
  padding-left: 4px !important;
  padding-right: 4px !important;
  border-left: 1px solid #f1f1f1;
  min-height: 730px;
}
body > .el-container {
  margin-bottom: 40px;
}
::v-deep .el-menu-item {
  margin-bottom: 10px;
}
::v-deep .el-menu-item.is-active {
  background: #4a6cef !important;
  border-radius: 0px 60px 60px 0px !important;
}
::v-deep .el-tabs--border-card {
  margin-bottom: 10px;
}
::v-deep .el-tabs--border-card > .el-tabs__content {
  padding: 0;
}
</style>