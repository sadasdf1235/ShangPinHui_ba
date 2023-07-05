<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 展示Spu列表 -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin: 20px 0"
          :disabled="!category3Id"
          @click="addSpu"
          >添加Spu</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="Spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="Spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                @click="showSku(row)"
                size="mini"
              ></el-button>
              <el-popconfirm
                title="你确定删除该属性吗?"
                @onConfirm="deleteSpu(row)"
                ><el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :pager-count="7"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          :total="total"
          layout="prev, pager, next, jumper,->,sizes, total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <!-- 添加|修改Spu -->
      <SpuForm v-show="scene == 1" @updateShow="updateShow" ref="spu"></SpuForm>
      <!-- 添加Sku列表 -->
      <SkuForm v-show="scene == 2" @skuForm="skuForm" ref="sku"></SkuForm>
      <!-- 弹出sku列表 -->
      <el-dialog
        :title="`${spu.spuName}的sku列表`"
        :visible.sync="dialogTableVisible"
        :before-close="dialogClose"
      >
        <el-table
          :data="skuList"
          style="width: 100%"
          border
          v-loading="loading"
        >
          <el-table-column prop="skuName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="price" label="价格" width="width">
          </el-table-column>
          <el-table-column prop="weight" label="重量" width="width">
          </el-table-column>
          <el-table-column label="默认图片" width="width">
            <template slot-scope="{ row }">
              <img
                :src="row.skuDefaultImg"
                alt=""
                style="width: 100px; height: 200px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "./SpuFrom";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      records: [],
      //当前页
      page: 1,
      //每页展示多少条数据
      limit: 3,
      //总数据
      total: 99,
      //控制 添加修改Spu 展示Spu 添加Sku列表的显示和隐藏
      /*
      0 展示Spu
      1 添加修改Spu
      2 添加Sku列表的显示和隐藏
      */
      scene: 0,
      //收集sku列表的数据
      skuList: [],
      //展示sku列表按钮行的spu数据
      spu: {},
      // 控制sku列表的展示
      dialogTableVisible: false,
      //sku列表loading效果
      loading: true,
    };
  },
  components: {
    SpuForm,
    SkuForm,
  },
  methods: {
    //获取一 二 三级分类的ID
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else if (level == 3) {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    //获取Spu列表数据
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqGetSpu(page, limit, category3Id);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    //子组件SpuForm
    updateShow({ scene, flag }) {
      this.scene = scene;
      if (flag == "update") {
        //修改 跳转到当前页
        this.getSpuList(this.page);
      } else {
        // 添加跳转到第一页
        this.getSpuList();
      }
    },
    //修改Spu按钮
    updateSpu(row) {
      this.scene = 1;
      this.$refs.spu.initSpuData(row);
    },
    //添加spu
    addSpu() {
      this.scene = 1;
      this.$refs.spu.addSpuData(this.category3Id);
    },
    //删除spu
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ message: "删除成功", type: "success" });
        this.getSpuList(this.records.length > 1 ? this.page : 1);
      }
    },
    //添加sku
    addSku(row) {
      this.scene = 2;
      this.$refs.sku.getSkuData(this.category1Id, this.category2Id, row);
    },
    //展示sku
    async showSku(spu) {
      //弹出框显示
      this.dialogTableVisible = true;
      this.spu = spu;
      let result = await this.$API.sku.reqGetSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
    //子组件skuForm
    skuForm({ scene }) {
      this.scene = scene;
    },
    //sku列表弹出框 关闭前的回调
    dialogClose(done) {
      this.loading = true;
      this.skuList = [];
      done();
    },
  },
};
</script>

<style>
</style>