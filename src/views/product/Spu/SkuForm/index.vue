<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          v-model="skuInfo.price"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          placeholder="规格描述"
          type="textarea"
          rows="4"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.idAndValue">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form-item
          :label="saleAttr.saleAttrName"
          v-for="saleAttr in saleAttrList"
          :key="saleAttr.id"
        >
          <el-select placeholder="请选择" v-model="saleAttr.idAndValue">
            <el-option
              :label="spuSaleAttr.saleAttrValueName"
              :value="`${saleAttr.id}:${spuSaleAttr.id}`"
              v-for="spuSaleAttr in saleAttr.spuSaleAttrValueList"
              :key="spuSaleAttr.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          bored
          :data="imageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column width="80" type="selection"> </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row }">
              <img
                :src="row.imgUrl"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="mini"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设置默认</el-button
              >
              <el-button type="success" plain size="mini" v-else
                >默认</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" @click="saveSkuInfo">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      //获取图片信息
      imageList: [],
      // 获取属性信息
      attrList: [],
      // 获取销售属性信息
      saleAttrList: [],
      //收集sku的数据
      skuInfo: {
        category3Id: "",
        price: 0,
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        skuDefaultImg: "",
        skuDesc: "",
        skuImageList: [
          // {
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   spuImgId: 0,
          // },
        ],
        skuName: "",
        skuSaleAttrValueList: [
          // {
          //   saleAttrId: 0,
          //   saleAttrValueId: 0,
          // },
        ],
        spuId: 0,
        tmId: 0,
        weight: "",
      },
      //收集表格复选框图片的数据
      spuImageList: [],
      //接收spu信息
      spu: {},
    };
  },
  methods: {
    //取消按钮
    cancel() {
      this.$emit("skuForm", { scene: 0 });
      //清除数据
      Object.assign(this._data, this.$options.data());
    },
    //获取数据
    async getSkuData(category1Id, category2Id, spu) {
      //收集数据
      this.spu = spu;
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      //获取图片信息
      let image = await this.$API.spu.reqSpuImage(spu.id);
      if (image.code == 200) {
        let list = image.data;
        list.forEach((element) => {
          element.isDefault = 0;
        });
        this.imageList = list;
      }
      // 获取基础属性信息
      let attr = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (attr.code == 200) {
        this.attrList = attr.data;
      }
      // 获取销售属性信息
      let saleAttr = await this.$API.sku.reqGetSaleAttrList(spu.id);
      if (saleAttr.code == 200) {
        this.saleAttrList = saleAttr.data;
      }
    },
    //收集表格复选框的数据
    handleSelectionChange(params) {
      this.spuImageList = params;
    },
    //切换设置默认 和默认 按钮
    changeDefault(row) {
      //排他思想
      this.imageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //保存按钮 上传数据
    async saveSkuInfo() {
      //整理平台属性数据
      this.skuInfo.skuAttrValueList = this.attrList.reduce((prev, item) => {
        if (item.idAndValue) {
          let [attrId, valueId] = item.idAndValue.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      // 整理销售属性数据
      this.skuInfo.skuSaleAttrValueList = this.saleAttrList.reduce(
        (prev, item) => {
          if (item.idAndValue) {
            let [saleAttrId, saleAttrValueId] = item.idAndValue.split(":");
            prev.push({ saleAttrId, saleAttrValueId });
          }
        },
        []
      );
      // 整理图片数据
      this.skuInfo.skuImageList = this.spuImageList.map((item) => {
        return {
          imgUrl: item.imgUrl,
          imgName: item.imgName,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      let result = await this.$API.sku.reqSaveSkuInfo(this.skuInfo);
      if (result.code == 200) {
        this.$message({ message: "保存成功", type: "success" });
        this.$emit("skuForm", { scene: 0 });
        //清除数据
        Object.assign(this._data, this.$options.data());
      }
    },
  },
};
</script>

<style>
</style>