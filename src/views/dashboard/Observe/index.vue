<template>
  <div>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="12">
          <MySearch></MySearch>
        </el-col>
        <el-col :span="12">
          <MyCategory></MyCategory>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import MySearch from "./MySearch";
import MyCategory from "./MyCategory";
export default {
  name: "Observe",
  components: {
    MySearch,
    MyCategory,
  },
};
</script>

<style>
</style>