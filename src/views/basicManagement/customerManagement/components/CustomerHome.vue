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

        <div class="top-title">
          <div class="title-item table-text" v-if="!isChinaMapShow" @click="toChinaMap"><img src="@/assets/img/left.png" alt=""><span>返回</span></div>
        </div>
        <div ref='main' id="main" class="main-map" v-if="isChinaMapShow"></div>
        <div ref='main2' id="main2" class="main-map2" v-else></div>
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
        </div>
      </div>
      <div class="top-right-bottom">
        <div class="contract">到期合同</div>
        <div class="backg-contract">
          <div class="contract-number">
            {{ total || 0 }}<span>份</span>
          </div>
          <div class="contract-date">2个月内到期合同</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import * as echarts from 'echarts';
import moment from 'moment'
import { arrList } from "@/utils/area.js"
import { customerRegionDistribution, expireContractPage } from '@/api/index.js'
import { exportCommon } from '@/utils/index.js'
export default {
  name: 'contracts',
  props: ['value'],
  data() {
    return {
      form: {
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().endOf('month').format('YYYY-MM-DD'),
      },
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
          }, {
            text: '本季',
            onClick(picker) {
              const end = moment().endOf('quarter').format('YYYY-MM-DD');
              const start = moment().startOf('quarter').format('YYYY-MM-DD');
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '本年',
            onClick(picker) {
              const end = moment().endOf('year').format('YYYY-MM-DD');
              const start = moment().startOf('year').format('YYYY-MM-DD');
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      total: '',
      provinces: {   //数据
        台湾: 'taiwan',
        河北: 'hebei',
        山西: 'shanxi',
        辽宁: 'liaoning',
        吉林: 'jilin',
        黑龙江: 'heilongjiang',
        江苏: 'jiangsu',
        浙江: 'zhejiang',
        安徽: 'anhui',
        福建: 'fujian',
        江西: 'jiangxi',
        山东: 'shandong',
        河南: 'henan',
        湖北: 'hubei',
        湖南: 'hunan',
        广东: 'guangdong',
        海南: 'hainan',
        四川: 'sichuan',
        贵州: 'guizhou',
        云南: 'yunnan',
        陕西: 'shanxi1',
        甘肃: 'gansu',
        青海: 'qinghai',
        新疆: 'xinjiang',
        广西: 'guangxi',
        内蒙古: 'neimenggu',
        宁夏: 'ningxia',
        西藏: 'xizang',
        北京: 'beijing',
        天津: 'tianjin',
        上海: 'shanghai',
        重庆: 'chongqing',
        香港: 'xianggang',
        澳门: 'aomen'
      },
      provincesData: {},
      isChinaMapShow: true,
      regionCode: '',
      name1: ''
    }

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
    const { startDate, endDate } = this.form
    this.value2 = [startDate, endDate]
    this.customerRegionDistribution()
    this.expireContractPage()
  },
  mounted() {
    const myChart = echarts.init(this.$refs.main)
    let listener = function () {
      myChart.resize()
    }
    window.addEventListener('resize', listener)
  },
  methods: {
    toChinaMap() {
      this.isChinaMapShow = true
      this.regionCode = ''
      this.name1 = ''
      this.customerRegionDistribution()
    },
    expireContractPage() {
      let params = {
        pageNum: 1,
        pageSize: 10
      }
      expireContractPage(params).then((res) => {
        this.total = res.data.total;
      });
    },
    toClick(item) {
      if (item && item.path) {
        this.$router.push({
          path: item.path
        });
      }
    },
    changeTime() {
      if (this.value2) {
        this.form.startDate = this.value2[0]
        this.form.endDate = this.value2[1]
        this.value2 = [this.form.startDate, this.form.endDate]
        this.customerRegionDistribution()
      }
    },
    AreaChange() { },
    handleChange() { },
    customerRegionDistribution() {
      customerRegionDistribution({ ...this.form, regionCode: this.regionCode }).then(res => {
        let result = res.data || {}
        this.$nextTick(() => {
          if (!this.regionCode) {
            this.myChart(res.data)
          } else {
            this.chinaMaprsult(res.data)
          }
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
        { start: 5, end: 15 },
        { start: 15, end: 30 },
        { start: 30 }
      ];
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
        item.name1 = item.name
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
            this.arrList[0].features[i].properties.name1 = this.arrList[0].features[i].properties.name
            this.arrList[0].features[i].properties.name = item1.value == 0 ? item1.name : `${item1.name.slice(0, item1.name.indexOf('黑龙江') > -1 || item1.name.indexOf('内蒙古') > -1 ? 3 : 2)}(${item1.value})`
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
          zoom: 1.25,
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
              emphasis: {
                disabled: false
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
            if (params.name != '南海诸岛') {
              return `<div>
            <div>${params.name}:</div>
            <div>签约客户数: ${params.data.value}</div>
            <div>累积服务人员: ${params.data.cumulativePersonnel}</div>
            <div>累积成交金额: ${this.$options.filters.toThousands(params.data.cumulativeAmount)}</div>
            <div>本月服务人员: ${params.data.monthPersonnel}</div>
            <div>本月成交金额: ${this.$options.filters.toThousands(params.data.monthAmount)}</div>
            </div>`
            }
          }
        }
      };
      // 地图注册，第一个参数的名字必须和option.geo.map一致
      echarts.registerMap("china", this.arrList[0])
      charts.setOption(option);
      this.chinamapHidden(charts)
    },
    chinaMaprsult(data = []) {
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
        { start: 30 }
      ];
      let myData = []
      data.forEach(item => {
        myData.push(
          {
            name: item.regionName,
            value: item.signAContract || 0
          }
        )
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

        for (let i in this.provincesData) {
          if (this.provincesData.features[i] && this.provincesData.features[i].properties.name.slice(0, 2) == item1.name.slice(0, 2)) {
            this.provincesData.features[i].properties.name = item1.name
          }
        }
      })
      let charts
      if (!this.isChinaMapShow) {
        charts = echarts.init(this.$refs["main2"]);
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
            map: `${this.name1}`,
            // map: 'guangdong',
            roam: "true",
            zoom: 1.25,
            // nameProperty: 'name',
            componentType: 'geo',
            geoIndex: 0,
            selectedMode: false,
            select: false,

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
            mapType: `${this.name1}`, // 地图类型，支持world，china及全国34个省市自治区，例如：河北、北京  
            roam: false,  // 是否开启滚轮缩放和拖拽漫游,默认为false（关闭），其他有效输入为true（开启），'scale'（仅开启滚轮缩放），'move'（仅开启拖拽漫游）
            geoIndex: 0,
            data: myData,
          }],
          tooltip: {

          }
        };
        // 地图注册，第一个参数的名字必须和option.geo.map一致
        echarts.registerMap(`${this.name1}`, this.provincesData)
        // echarts.registerMap("china", this.arrList[0])
        charts.setOption(option);
      }
    },
    chinamapHidden(charts) {
      let that = this
      charts.off('click')//这里解决多次触发点击事件 但是还会执行2次  引用echarts地图，点击各个省份时，点击一个调用两次接口，再点击一次，调用四次接口，再点击调用八次。。。。依次叠加，问题在于，没有将地图上的点击事件清空
      charts.on('click', async function (params) {
        if (params.value && params.data.name1 in that.provinces && params.data.name1 != '上海' && params.data.name1 != '北京' && params.data.name1 != '天津' && params.data.name1 != '重庆') {
          let s = await import(`@/utils/map/${that.provinces[params.data.name1]}.json`);
          if (s) {
            that.name1 = that.provinces[params.data.name1]
            that.isChinaMapShow = false
            that.provincesData = s
            that.regionCode = params.data.regionCode
            that.customerRegionDistribution()
          }
        }
      })

    }
  }
}
</script>

<style lang="scss" scoped>
.spacel-box {
  padding-top: 6px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  // overflow: auto;
  display: flex;
}
.main-left {
  padding: 20px;
  border-radius: 10px;
  background: #fff;
  height: auto;
  min-height: 700px;
  margin-right: 20px;
  flex: 1;
  .map-container {
    width: 100%;
    height: 100%;
    // padding-right: 20px;
    box-sizing: border-box;
    .top-title {
      margin-top: 10px;
      // float: left;
      // display: flex;
      .title-item {
        display: flex;
        align-items: center;
        font-size: 14px;
        margin-right: 5px;
        img {
          width: 19px;
          height: 19px;
          margin-top: 2px;
        }
      }
    }
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
    .main-map2 {
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
      padding: 14px 0 0 10px;
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
    .contract {
      margin: 20px;
      font-size: 20px;
      font-weight: 600;
    }
    .backg-contract {
      height: 164px;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      background-color: #fff;
      cursor: pointer;
      .contract-number {
        font-family: Microsoft YaHei;
        font-size: 42px;
        font-weight: 700;
        color: #f68c0e;
        span {
          font-family: PingFang SC;
          font-size: 16px;
          font-weight: 400;
          color: #f68c0e;
        }
      }
      .contract-date {
        font-family: PingFang SC;
        font-size: 15px;
        font-weight: 400;
        color: #626468;
      }
    }
  }
}
</style>