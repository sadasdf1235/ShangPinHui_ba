<template>
  <div ref="bar" class="barChart"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "barChart",
  mounted() {
    let ech = echarts.init(this.$refs.bar);
    ech.setOption({
      xAxis: {
        show: false,
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
          type: "bar",
          data: [123, 324, 35, 31, 454, 324],
          color: "cyan",
        },
      ],
      tooltip: {},
    });
  },
};
</script>

<style scoped>
.barChart {
  width: 100%;
  height: 100%;
}
</style>