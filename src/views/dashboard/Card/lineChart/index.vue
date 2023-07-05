<template>
  <div ref="line" class="lineChart"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "lineChart",
  mounted() {
    let ech = echarts.init(this.$refs.line);
    ech.setOption({
      xAxis: {
        show: false,
        //均分
        type: "category",
      },
      yAxis: {
        show: false,
      },
      grid: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      series: [
        {
          type: "line",
          data: [123, 324, 35, 31, 454, 324],
          // 线条颜色
          lineStyle: {
            color: "purple",
          },
          //拐点
          itemStyle: {
            opacity: 0,
          },
          // 渐变
          areaStyle: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "purple", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#fff", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      ],
    });
  },
};
</script>

<style scoped>
.lineChart {
  width: 100%;
  height: 100%;
}
</style>