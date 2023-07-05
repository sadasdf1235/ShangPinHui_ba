<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix head">
      <el-tabs class="tabs" v-model="activeName">
        <!--  @tab-click="handleClick" -->
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visit"></el-tab-pane>
      </el-tabs>
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          v-model="date"
          class="data"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="content">
      <el-row :gutter="10">
        <el-col :span="18"><div class="charts" ref="bar"></div> </el-col>
        <el-col :span="6">
          <div class="contentRight">
            <h2>门店{{ title }}排名</h2>
            <ul>
              <li>
                <span class="liLeft">1</span>
                <span>321312</span>
                <span class="liRight">432423</span>
              </li>
              <li>
                <span class="liLeft">2</span>
                <span>321312</span>
                <span class="liRight">432423</span>
              </li>
              <li>
                <span class="liLeft">3</span>
                <span>321312</span>
                <span class="liRight">432423</span>
              </li>
              <li>
                <span>4</span>
                <span>321312</span>
                <span class="liRight">432423</span>
              </li>
              <li>
                <span>5</span>
                <span>321312</span>
                <span class="liRight">432423</span>
              </li>
              <li>
                <span>6</span>
                <span>321312</span>
                <span class="liRight">432423</span>
              </li>
              <li>
                <span>7</span>
                <span>321312</span>
                <span class="liRight">432423</span>
              </li>
            </ul>
          </div></el-col
        >
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      myEcharts: null,
      date: [],
    };
  },
  mounted() {
    this.myEcharts = echarts.init(this.$refs.bar);
    this.myEcharts.setOption({
      title: {
        text: "销售额趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 220, 123, 43, 523, 675, 312],
        },
      ],
    });
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
  },
  watch: {
    title() {
      this.myEcharts.setOption({
        title: {
          text: this.title,
        },
      });
    },
  },
  methods: {
    setDay() {
      let day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    setWeek() {
      let start = dayjs().day(1).format("YYYY-MM-DD");
      let end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setMonth() {
      let start = dayjs().startOf("month").format("YYYY-MM-DD");
      let end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setYear() {
      let start = dayjs().startOf("year").format("YYYY-MM-DD");
      let end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
};
</script>

<style scoped>
.head {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tabs {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.right span {
  margin: 0 10px;
}
.right .data {
  width: 250px;
  margin: 0 20px;
}
.charts {
  width: 100%;
  height: 300px;
}
.contentRight ul {
  padding: 0;
}
.contentRight ul li {
  margin: 10px 0;
  list-style: none;
  padding: 0;
}
.contentRight ul li span {
  margin: 0 10px;
}
.contentRight ul li .liLeft {
  background: black;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  float: left;
  text-align: center;
}
.contentRight ul li .liRight {
  float: right;
}
</style>