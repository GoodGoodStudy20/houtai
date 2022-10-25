<template>
  <div class="spacel-box">

    <div class="main-left">
      <div class="map-container">
        <div class="top">
          <div class="title">客户地域分布图</div>
          <div style="margin-right:20px">
            <el-date-picker size="mini" v-model="value2" type="daterange" @change="changeTime" value-format="yyyy-MM-dd" style=" width:200px" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions1"></el-date-picker>
          </div>
        </div>

        <div ref='main' id="main" class="main-map"></div>
      </div>
    </div>
    <div class="main-right">
      <div class="top-right-container">
        <!-- <h3>常用功能</h3> -->
        <div class="data-title">常用功能</div>
        <div class="common-function">
          <div @click="toClick(item)" class="function-item" v-for="item in iconList" :key="item.id">
            <img :src="item.customIcon" alt="" />
            <p>{{item.label}}</p>
          </div>
          <!-- <div @click="toClick('invoice')" class="function-item">
            <img src="@/assets/img/今日需求2.png" alt="" />
            <p>开票管理</p>
          </div>
          <div @click="toClick('invoice')" class="function-item">
            <img src="@/assets/img/今日需求2.png" alt="" />
            <p>开票管理</p>
          </div>
          <div @click="toClick('invoice')" class="function-item">
            <img src="@/assets/img/今日需求2.png" alt="" />
            <p>开票管理</p>
          </div>
          <div @click="toClick('collection')" class="function-item">
            <img src="@/assets/img/今日需求2.png" alt="" />
            <p>回单管理</p>
          </div> -->
        </div>
      </div>
      <div class="top-right-bottom">

      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { arrList } from "@/utils/area.js"
import { getCustomerDataStatistics, } from '@/api/index.js'
import { exportCommon } from '@/utils/index.js'
export default {
  name: 'contracts',
  props: ['value'],
  data() {
    return {
      form: {},
      value2: '',
      iconList: [],
      menuList: [],
      arrList: arrList,
      pickerOptions1: {
        shortcuts: [
          {
            text: '本月',
            onClick(picker) {
              const end = moment().endOf('month').format('YYYY-MM-DD');
              const start = moment().startOf('month').format('YYYY-MM-DD');
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '上月',
            onClick(picker) {
              const end = moment().month(moment().month() - 1).endOf('month').format('YYYY-MM-DD');
              const start = moment().month(moment().month() - 1).startOf('month').format('YYYY-MM-DD');
              picker.$emit('pick', [start, end]);
            }
          }]
      },    }
  },
  created() {
    this.menuList = JSON.parse(sessionStorage.getItem("menuList"));
    this.menuList.forEach(item => {
      if (item.child) {
        item.child.forEach(item1 => {
          if (item1.child && item1.path == '/basicManagement/customerManagement') {
            item1.child.forEach(item2 => {
              this.iconList.push(item2)
            })
          }
        })
      }
    })
    this.getCustomerDataStatistics()
  },
  methods: {
    toClick(item) {
      if (item && item.path) {
        this.$router.push({
          path: item.path
        });
      }
    },
    changeTime(type = '') {
      this.dateType = type
      if (type == 'today') {
        this.form4.startDate = moment().format('YYYY-MM-DD')
        this.form4.endDate = moment().format('YYYY-MM-DD')

      } else if (type == 'month') {
        this.form4.startDate = moment().startOf('month').format('YYYY-MM-DD')
        this.form4.endDate = moment().endOf('month').format('YYYY-MM-DD')
      } else if (type == 'quarter') {
        this.form4.startDate = moment().startOf('quarter').format('YYYY-MM-DD')
        this.form4.endDate = moment().endOf('quarter').format('YYYY-MM-DD')
      } else if (type == 'year') {
        this.form4.startDate = moment().startOf('year').format('YYYY-MM-DD')
        this.form4.endDate = moment().endOf('year').format('YYYY-MM-DD')
      } else {
        if (this.value2) {
          this.form4.startDate = this.value2[0]
          this.form4.endDate = this.value2[1]
        }
      }
      this.value2 = [this.form4.startDate, this.form4.endDate]
      this.getBusinessStatisticsByCustomerId()
    },
    AreaChange() { },
    handleChange() { },
    getCustomerDataStatistics() {
      let param = {
        startDate: '',
        endDate: ''
      }
      getCustomerDataStatistics(param).then(res => {
        let result = res.data || {}
        this.$nextTick(() => {
          this.myChart(res.data)
        })
      })
    },

    myChart(data = []) {
      function mapValue(name) {
        let numArr = data.filter(item => {
          return item.regionName.slice(0, 2) == name.slice(0, 2)
        })
        return numArr[0] && numArr[0].signAContract || 0
      }
      //显示颜色列表
      let splitList = [
        { end: 1 },
        { start: 1, end: 5 },
        { start: 6, end: 15 },
        { start: 16, end: 30 },
        { start: 31, end: 50 }
      ];
      let a = data.map(item => {
        return {
          value: item.signAContract || 0,
          name: item.regionName,
          cumulativeAmount: item.cumulativeAmount,
          cumulativePersonnel: item.cumulativePersonnel,
          monthAmount: item.monthAmount,
          monthPersonnel: item.monthPersonnel,
          regionCode: item.regionCode,
        }
      })
      //地图区域颜色数据
      let myData = [
        { name: '北京', value: mapValue('北京') || 0 },
        { name: '天津', value: mapValue('天津') || 0 },
        { name: '河北', value: mapValue('河北') || 0 },
        { name: '山西', value: mapValue('山西') || 0 },
        { name: '内蒙古', value: mapValue('内蒙古') || 0 },
        { name: '辽宁', value: mapValue('辽宁') || 0 },
        { name: '吉林', value: mapValue('吉林') || 0 },
        { name: '黑龙江', value: mapValue('黑龙江') || 0 },
        { name: '上海', value: mapValue('上海') || 0 },
        { name: '江苏', value: mapValue('江苏') || 0 },
        { name: '浙江', value: mapValue('浙江') || 0 },
        { name: '安徽', value: mapValue('安徽') || 0 },
        { name: '福建', value: mapValue('福建') || 0 },
        { name: '江西', value: mapValue('江西') || 0 },
        { name: '山东', value: mapValue('山东') || 0 },
        { name: '河南', value: mapValue('河南') || 0 },
        { name: '广东', value: mapValue('广东') || 0 },
        { name: '广西', value: mapValue('广西') || 0 },
        { name: '湖北', value: mapValue('湖北') || 0 },
        { name: '湖南', value: mapValue('湖南') || 0 },
        { name: '新疆', value: mapValue('新疆') || 0 },
        { name: '西藏', value: mapValue('西藏') || 0 },
        { name: '青海', value: mapValue('青海') || 0 },
        { name: '甘肃', value: mapValue('甘肃') || 0 },
        { name: '云南', value: mapValue('云南') || 0 },
        { name: '青海', value: mapValue('青海') || 0 },
        { name: '宁夏', value: mapValue('宁夏') || 0 },
        { name: '四川', value: mapValue('四川') || 0 },
        { name: '陕西', value: mapValue('陕西') || 0 },
        { name: '贵州', value: mapValue('贵州') || 0 },
        { name: '重庆', value: mapValue('重庆') || 0 },
        { name: '海南', value: mapValue('海南') || 0 },
        { name: '香港', value: mapValue('香港') || 0 },
        { name: '澳门', value: mapValue('澳门') || 0 },
        { name: '台湾', value: mapValue('台湾') || 0 },

      ]
      myData.map(item => {
        item.name = item.value == 0 ? item.name : `${item.name}(${item.value})`
      })
      data.forEach(item => {
        myData.forEach(item1 => {
          if (item.regionName.slice(0, 2) == item1.name.slice(0, 2)) {
            item1.cumulativeAmount = item.cumulativeAmount
            item1.cumulativePersonnel = item.cumulativePersonnel
            item1.monthAmount = item.monthAmount
            item1.monthPersonnel = item.monthPersonnel
            item1.regionCode = item.regionCode
          }
        })
      })
      //修改地图数据，显示省份合同数量
      myData.forEach(item1 => {
        for (let i in this.arrList[0].features) {
          if (this.arrList[0].features[i].properties.name.slice(0, 2) == item1.name.slice(0, 2)) {
            this.arrList[0].features[i].properties.name = item1.value == 0 ? item1.name : `${item1.name.slice(0, item1.name.length > 5 ? 3 : 2)}(${item1.value})`
          }
        }
      })
      const charts = echarts.init(this.$refs["main"]);
      const option = {
        // 背景颜色
        backgroundColor: "#fff",
        // 提示浮窗样式
        tooltip: {
          show: true,
          trigger: "item",
          alwaysShowContent: false,
          backgroundColor: "#0C121C",
          borderColor: "rgba(0, 0, 0, 0.16);",
          hideDelay: 100,
          triggerOn: "mousemove",
          enterable: true,
          textStyle: {
            color: "#DADADA",
            fontSize: "12",
            width: 50,
            height: 30,
            overflow: "break",
          },
          showDelay: 100
        },
        visualMap: {
          align: "left",
          inverse: true,
          right: '50px',
          bottom: '50px',
          splitList: splitList,
          color: ['#4E8BFF', '#6197FF', '#89B1FF', '#B0CBFF', '#EBF2FF'],
          show: true
        },
        // 地图配置
        geo: {
          map: "china",
          roam: "true",
          componentType: 'geo',
          geoIndex: 0,
          selectedMode: false,
          select: false,
          regions: [
            {
              name: "南海诸岛",
              itemStyle: {
                // 隐藏地图
                normal: {
                  opacity: 0, // 为 0 时不绘制该图形
                }
              },
              label: {
                show: false // 隐藏文字
              },
              tooltip: {
                show: false
              }
            },
          ],
          label: {
            // 通常状态下的样式
            normal: {
              show: true,
              textStyle: {
                color: "#000",
              },
            },
            // 鼠标放上去的样式
            emphasis: {
              show: true,
              textStyle: {
                color: "#000",
              },
            },
          },
          // 地图区域的样式设置
          itemStyle: {
            normal: {
              borderColor: "#aaa",
              borderWidth: 1,
              areaColor: {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(147, 235, 248, 0)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(147, 235, 248, .2)", // 100% 处的颜色
                  },
                ],
              },
            },
            // 鼠标放上去高亮的样式
            emphasis: {
              borderColor: "#aaa",
              borderWidth: 1,
              areaColor: {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(147, 235, 248, 0)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(147, 235, 248, .2)", // 100% 处的颜色
                  },
                ],
              },
            },
          },
        },
        series: [{
          name: '签约合同',
          type: 'map',
          mapType: 'china', // 地图类型，支持world，china及全国34个省市自治区，例如：河北、北京  
          roam: false,  // 是否开启滚轮缩放和拖拽漫游,默认为false（关闭），其他有效输入为true（开启），'scale'（仅开启滚轮缩放），'move'（仅开启拖拽漫游）
          geoIndex: 0,
          data: myData,
        }],
        tooltip: {
          formatter: (params) => {
            return `<div><div>${params.name}</div></div>`
          }
        }
      };
      // 地图注册，第一个参数的名字必须和option.geo.map一致
      // echarts.registerMap("china", this.arrList[0])
      charts.setOption(option);
    }
  }
}
</script>

<style lang="scss" scoped>
.spacel-box {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
}
.main-left {
  padding: 20px;
  border-radius: 10px;
  background: #fff;
  height: auto;
  min-height: 800px;
  margin-right: 20px;
  flex: 1;
  .map-container {
    width: 100%;
    height: 100%;
    // padding-right: 20px;
    box-sizing: border-box;
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: 20px;
        font-weight: 600;
      }
    }
    // display: flex;
    .main-map {
      width: 100%;
      height: 100%;
      // flex: 1;
      div {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.main-right {
  width: 400px;
  display: flex;
  flex-direction: column;
  .top-right-container {
    border-radius: 10px;
    background-color: #fff;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 20px;
    .data-title {
      font-weight: 700;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .common-function {
      width: 100%;
      display: flex;
      // justify-content: space-around;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
      .function-item {
        cursor: pointer;
        text-align: center;
        font-weight: 700;
        width: 25%;
        flex-shrink: 0;
        img {
          width: 50px;
          height: 50px;
        }
      }
    }
  }
  .top-right-bottom {
    border-radius: 10px;
    background-color: #fff;
    flex: 1;
  }
}
</style>