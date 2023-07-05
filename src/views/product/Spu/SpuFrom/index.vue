<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="Spu名称">
        <el-input placeholder="Spu名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Spu描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="描述"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="Spu图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-success="handlerSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <!-- action 图片上传的地址
        file-list 照片墙需要展示的数据来源 必须是数组，且数组内必须含有name,url属性
        on-preview 图片预览功能
        on-remove 图片删除功能
         -->
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectAttr.length}未选择`"
          v-model="attrIdAndName"
        >
          <el-option
            :label="unSelect.name"
            :value="`${unSelect.id}:${unSelect.name}`"
            v-for="unSelect in unSelectAttr"
            :key="unSelect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrId"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table style="width: 100%" :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleCloseTag(row, index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
                <!-- @keyup.enter.native="handleInputConfirm" -->
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteSaleAttr($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      //spu信息
      spu: {
        category3Id: 0,
        description: "",
        spuImageList: [
          // {
          //   "id": 0,
          //   "imgName": "string",
          //   "imgUrl": "string",
          //   "spuId": 0
          // }
        ],
        spuName: "",
        spuSaleAttrList: [
          // {
          //   "baseSaleAttrId": 0,
          //   "id": 0,
          //   "saleAttrName": "string",
          //   "spuId": 0,
          //   "spuSaleAttrValueList": [
          //     {
          //       "baseSaleAttrId": 0,
          //       "id": 0,
          //       "isChecked": "string",
          //       "saleAttrName": "string",
          //       "saleAttrValueName": "string",
          //       "spuId": 0
          //     }
          //   ]
          // }
        ],
        tmId: "",
      },
      // 品牌信息
      tradeMarkList: [],
      // 图片信息
      spuImageList: [],
      // 平台属性信息
      saleAttrList: [],
      attrIdAndName: "",
    };
  },
  methods: {
    //照片墙图片预览功能
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //照片墙图片删除功能
    handlePictureCardPreview(file) {
      this.spuImageList = fileList;
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //照片墙上传成功的回调
    handlerSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    //父组件添加SPu按钮按下后 发送请求spu.品牌.图片。销售属性的请求
    async initSpuData(spu) {
      // spu
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      // 品牌
      let tradeMarkResult = await this.$API.spu.reqTradeMark();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 图片
      let spuImageResult = await this.$API.spu.reqSpuImage(spu.id);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        listArr.forEach((item) => {
          (item.name = item.imgName), (item.url = item.imgUrl);
        });
        this.spuImageList = listArr;
      }
      //销售属性
      let spuAttrResult = await this.$API.spu.reqSpuAttr();
      if (spuAttrResult.code == 200) {
        this.saleAttrList = spuAttrResult.data;
      }
    },
    //添加销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(":");
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      this.attrIdAndName = "";
    },
    //添加销售属性值
    addSaleAttrValue(row) {
      // inputVisible 控制着按钮 和 输入框的切换
      this.$set(row, "inputVisible", true);
      //inputValue 用于收集输入框的数据
      this.$set(row, "inputValue", "");
    },
    //属性值名称列表 输入框的事件
    handleInputConfirm(row) {
      let { baseSaleAttrId, inputValue } = row;
      //控制输入不能为空
      if (inputValue.trim() == "") {
        this.$message({ message: "不能为空", type: "warning" });
        return;
      }
      //控制输入的不能重复
      let result = row.spuSaleAttrValueList.some(
        (item) => item.saleAttrValueName == inputValue
      );
      if (result) {
        this.$message({ message: "不能重复", type: "warning" });
        return;
      }
      //将收集到的数据放入saleAttrValueList中，以进行展示
      let newArr = { baseSaleAttrId, saleAttrValueName: inputValue };
      row.spuSaleAttrValueList.push(newArr);
      row.inputVisible = false;
    },
    //删除tag
    handleCloseTag(row, index) {
      row.spuSaleAttrValueList.splice(index, 1);
    },
    //删除销售属性
    deleteSaleAttr($index) {
      this.spu.spuSaleAttrList.splice($index, 1);
    },
    //保存按钮 保存添加或修改的数据
    async addOrUpdateSpu() {
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      let result = await this.$API.spu.reqUpdateOrAddSpu(this.spu);
      if (result.code == 200) {
        this.$message({ message: "保存成功", type: "success" });
        //通知父组件 切换场景
        this.$emit("updateShow", {
          scene: 0,
          //flag 通知父组件是修改还是添加 以应对分页器的跳转
          flag: this.spu.id ? "update" : "add",
        });
      } else {
        this.$message.error("保存失败");
      }
      //清除数据
      Object.assign(this._data, this.$options.data());
    },
    //父组件添加SPu按钮按下后 发送请求品牌和销售属性的请求
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id;
      let tradeMarkResult = await this.$API.spu.reqTradeMark();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      let spuAttrResult = await this.$API.spu.reqSpuAttr();
      if (spuAttrResult.code == 200) {
        this.saleAttrList = spuAttrResult.data;
      }
    },
    //取消按钮
    cancel() {
      this.$emit("updateShow", { scene: 0, flag: "" });
      Object.assign(this._data, this.$options.data());
    },
  },
  computed: {
    //没有被选择的销售属性
    unSelectAttr() {
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
    //销售属性的ID
    attrId() {
      let result = this.attrIdAndName.split(":");
      return result[0];
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>