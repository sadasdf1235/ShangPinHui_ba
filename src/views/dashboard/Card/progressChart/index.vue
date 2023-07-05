<template>
  <div ref="progress" class="progressChart"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "progressChart",
  mounted() {
    let ech = echarts.init(this.$refs.progress);
    ech.setOption({
      xAxis: {
        show: false,
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        type: "category",
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
          data: [78],
          color: "yellowgreen",
          //柱条宽度
          barWidth: 10,
          //设置为true 背景颜色才能生效
          showBackground: true,
          // 背景颜色
          backgroundStyle: {
            color: "#eee",
          },
          label: {
            // 文本是否显示
            show: true,
            // 文本内容
            formatter: "|",
            position: "right",
          },
        },
      ],
      tooltip: {},
    });
  },
};
</script>

<style scoped>
.progressChart {
  width: 100%;
  height: 100%;
}
</style>