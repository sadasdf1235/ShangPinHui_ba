<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="!isShowTable"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          style="margin: 10px 0"
          >添加属性</el-button
        >
        <el-table style="width: 100% margin:20px 0" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 20px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteAttr(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加 修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100% border margin:20px 0"
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 气泡弹出框 -->
              <el-popconfirm
                :title="`你确定删除${row.valueName}吗?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      //一级 二级 三级分类ID
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //平台属性的数据
      attrList: [],
      //控制是否显示table
      isShowTable: true,
      //属性值 | 属性名 添加或修改
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [
          //属性值
        ],
        categoryId: 0, //三级ID
        categoryLevel: 3, //三级ID
      },
    };
  },
  methods: {
    //获取一级 二级 三级分类的ID
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        // 一级分类发生变化 二级 三级分类的ID要清空
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        this.getAttrList();
      }
    },
    //获取平台属性的数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      // if (category1Id == "" || category2Id == "" || category3Id == "") return;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //添加属性值
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true,
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //添加属性
    addAttr() {
      this.isShowTable = false;
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [
          //属性值
        ],
        categoryId: this.category3Id, //三级ID
        categoryLevel: 3, //三级ID
        //控制添加属性值输入框显示和隐藏 以达成查看和编辑模式的切换
        flag: false,
      };
    },
    //修改属性
    updateAttr(row) {
      this.isShowTable = false;
      /*
    attrInfo 对象中嵌套数组 数组中又嵌套了对象 所以需要使用深拷贝来解决问题
      */
      this.attrInfo = cloneDeep(row);
      //添加属性flag 方便切换模式
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    //添加属性值输入框显示和隐藏 以达成查看和编辑模式的切换
    toLook(row) {
      row.flag = false;
      //属性值为空为无效输入 进行提示
      if (row.valueName.trim() == "") {
        this.$message({ message: "请输入一个有效的字符", type: "warning" });
      }
      //属性值不能重复
      let isReapt = this.attrInfo.attrValueList.some((item) => {
        if (row != item) {
          return (row.valueName = item.valueName);
        }
      });
      if (isReapt) return;
    },
    //切换为编辑模式
    toEdit(row, index) {
      row.flag = true;
      /*
this.$nextTick() 会在节点渲染完毕，自动执行一次
      */
      //自动聚焦
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //删除属性
    deleteAttr(row) {
      //弹出确认删除提示
      this.$confirm("此操作将永久删除该属性, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.attr.reqDeleteAttr(row.id);
          if (result.code == 200) {
            //确定删除执行
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
          //更新列表
          this.getAttrList();
        })
        .catch(() => {
          // 取消删除执行
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //删除属性值
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //保存按钮 添加或修改属性
    async addOrUpdateAttr() {
      //清除为空的数据 同时将flag属性删除 因为服务器不需要
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName != "") {
            delete item.flag;
            return true;
          }
        }
      );
      try {
        // 更新数据
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        //刷新属性列表
        this.isShowTable = true;
        //弹出提示框
        this.$message({ message: "保存成功", type: "success" });
        this.getAttrList();
      } catch (error) {
        // this.$message({ message: "保存失败", type: "warning" });
      }
    },
  },
};
</script>

<style>
</style>